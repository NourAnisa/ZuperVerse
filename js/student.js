/**
 * ZuperVerse - Student Gameplay & Realtime Multi-Mode Controller
 * Integrated with Kota Ilmu Building Door Triggers & Timer System
 */

class StudentApp {
    constructor() {
        this.sb = window.zuperSb;
        this.sound = window.zuperSound;
        this.world = null;

        // Player state
        this.studentName = localStorage.getItem("zuper_name") || "Budi Pratama";
        this.absen = localStorage.getItem("zuper_absen") || "01";
        this.color = localStorage.getItem("zuper_color") || "#6366f1";
        this.hat = localStorage.getItem("zuper_hat") || "cap";
        this.cape = localStorage.getItem("zuper_cape") || "none";

        this.score = 0;
        this.xp = parseInt(localStorage.getItem("zuper_xp") || "0");
        this.level = Math.floor(this.xp / 200) + 1;
        this.shield = 100;
        this.coins = parseInt(localStorage.getItem("zuper_coins") || "50");
        this.combo = 0;

        // Multiplayer state
        this.currentRoom = null;
        this.roomChannel = null;
        this.isMultiplayer = false;
        this.roomMode = "adventure";
        this.bossHp = 5000;
        this.bossMaxHp = 5000;

        // Question & Timer state
        this.currentQ = null;
        this.qTimerInterval = null;
        this.timeLeft = 15;
        this.qStartTime = 0;

        this.init();
    }

    init() {
        // 1. Initialize 3D World (Kota Ilmu)
        this.world = new ZuperWorld3D("viewport3d", (zone) => this.handleBuildingDoorInteraction(zone));
        this.world.updatePlayerCustomization({
            name: `${this.studentName} (#${this.absen})`,
            color: this.color,
            hat: this.hat,
            cape: this.cape
        });

        // 2. Setup Virtual Joystick
        this.setupVirtualJoystick();

        // 3. Setup UI Bindings
        this.bindUI();

        // 4. Update HUD
        this.updateHUD();

        // 5. Heartbeat loop for Supabase Position Sync
        setInterval(() => this.broadcastPosition(), 350);
    }

    bindUI() {
        // Avatar Customizer
        const btnAvatar = document.getElementById("btn-custom-avatar");
        const modalAvatar = document.getElementById("avatar-modal");
        if (btnAvatar && modalAvatar) {
            btnAvatar.addEventListener("click", () => {
                modalAvatar.classList.remove("hidden");
                modalAvatar.classList.add("flex");
            });
        }

        const btnSaveAvatar = document.getElementById("btn-save-avatar");
        if (btnSaveAvatar) {
            btnSaveAvatar.addEventListener("click", () => {
                const nameInp = document.getElementById("input-avatar-name");
                if (nameInp && nameInp.value.trim()) {
                    this.studentName = nameInp.value.trim().substring(0, 15);
                    localStorage.setItem("zuper_name", this.studentName);
                }

                const absenInp = document.getElementById("input-avatar-absen");
                if (absenInp && absenInp.value) {
                    this.absen = absenInp.value.padStart(2, "0");
                    localStorage.setItem("zuper_absen", this.absen);
                }

                const colorPick = document.getElementById("select-avatar-color");
                if (colorPick) {
                    this.color = colorPick.value;
                    localStorage.setItem("zuper_color", this.color);
                }

                const hatPick = document.getElementById("select-avatar-hat");
                if (hatPick) {
                    this.hat = hatPick.value;
                    localStorage.setItem("zuper_hat", this.hat);
                }

                this.world.updatePlayerCustomization({
                    name: `${this.studentName} (#${this.absen})`,
                    color: this.color,
                    hat: this.hat,
                    cape: this.cape
                });

                this.updateHUD();
                modalAvatar.classList.add("hidden");
                modalAvatar.classList.remove("flex");
                if (this.sound) this.sound.playCorrect();
            });
        }

        // Room Join UI (Nama + No. Absen + Kode Kelas)
        const btnJoinRoom = document.getElementById("btn-join-room");
        if (btnJoinRoom) {
            btnJoinRoom.addEventListener("click", () => {
                const codeInp = document.getElementById("input-room-code");
                const nameInp = document.getElementById("input-join-name");
                const absenInp = document.getElementById("input-join-absen");

                const code = (codeInp ? codeInp.value : "").trim().toUpperCase();
                const name = (nameInp ? nameInp.value : "").trim();
                const absen = (absenInp ? absenInp.value : "").trim();

                if (!code || !name) {
                    alert("Masukkan Kode Kelas 6 huruf dan Nama Lengkap!");
                    return;
                }

                this.studentName = name;
                if (absen) this.absen = absen.padStart(2, "0");
                localStorage.setItem("zuper_name", this.studentName);
                localStorage.setItem("zuper_absen", this.absen);

                this.joinClassRoom(code);
            });
        }

        // Sound Toggle
        const btnSound = document.getElementById("btn-toggle-sound");
        if (btnSound) {
            btnSound.addEventListener("click", () => {
                const isMuted = this.sound.toggleMute();
                btnSound.innerHTML = isMuted ? "🔇" : "🔊";
            });
        }

        // Close modal buttons
        document.querySelectorAll(".close-modal").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const modal = e.target.closest(".modal-container");
                if (modal) {
                    modal.classList.add("hidden");
                    modal.classList.remove("flex");
                    this.stopQuestionTimer();
                }
            });
        });
    }

    setupVirtualJoystick() {
        const zone = document.getElementById("virtual-joystick-zone");
        const knob = document.getElementById("virtual-joystick-knob");
        if (!zone || !knob) return;

        let activeTouchId = null;
        let originX = 0;
        let originY = 0;
        const maxDist = 38;

        zone.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            activeTouchId = touch.identifier;
            const rect = zone.getBoundingClientRect();
            originX = rect.left + rect.width / 2;
            originY = rect.top + rect.height / 2;
        }, { passive: false });

        zone.addEventListener("touchmove", (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === activeTouchId) {
                    let dx = touch.clientX - originX;
                    let dy = touch.clientY - originY;
                    const dist = Math.hypot(dx, dy);

                    if (dist > maxDist) {
                        dx = (dx / dist) * maxDist;
                        dy = (dy / dist) * maxDist;
                    }

                    knob.style.transform = `translate(${dx}px, ${dy}px)`;
                    if (this.world) {
                        this.world.setTouchInput(dx / maxDist, dy / maxDist);
                    }
                }
            }
        }, { passive: false });

        const resetJoystick = () => {
            activeTouchId = null;
            knob.style.transform = `translate(0px, 0px)`;
            if (this.world) this.world.setTouchInput(0, 0);
        };

        zone.addEventListener("touchend", resetJoystick);
        zone.addEventListener("touchcancel", resetJoystick);
    }

    updateHUD() {
        const nameEl = document.getElementById("hud-player-name");
        if (nameEl) nameEl.textContent = this.studentName;

        const absenEl = document.getElementById("hud-absen-tag");
        if (absenEl) absenEl.textContent = `Absen: ${this.absen}`;

        const scoreEl = document.getElementById("hud-score");
        if (scoreEl) scoreEl.textContent = this.score.toLocaleString();

        const shieldEl = document.getElementById("hud-shield-val");
        const shieldBar = document.getElementById("hud-shield-bar");
        if (shieldEl) shieldEl.textContent = `${this.shield}%`;
        if (shieldBar) shieldBar.style.width = `${this.shield}%`;

        const xpEl = document.getElementById("hud-xp-val");
        const xpBar = document.getElementById("hud-xp-bar");
        const levelEl = document.getElementById("hud-level");
        const currentLvlXp = this.xp % 200;
        if (xpEl) xpEl.textContent = `${currentLvlXp}/200 XP`;
        if (xpBar) xpBar.style.width = `${(currentLvlXp / 200) * 100}%`;
        if (levelEl) levelEl.textContent = `Lv. ${this.level}`;

        const coinsEl = document.getElementById("hud-coins");
        if (coinsEl) coinsEl.textContent = this.coins;
    }

    handleBuildingDoorInteraction(zone) {
        if (!zone) return;
        if (this.sound) this.sound.playClick();

        if (zone.id === "building-minigames") {
            const mgModal = document.getElementById("minigames-modal");
            if (mgModal) {
                mgModal.classList.remove("hidden");
                mgModal.classList.add("flex");
                if (window.miniGamesManager) {
                    window.miniGamesManager.startLariKilat("minigames-container");
                }
            }
            return;
        }

        // Subject Buildings
        let question = null;
        if (zone.id === "building-english") {
            question = ZUPER_DEFAULT_QUESTIONS.find(q => q.subject.includes("English"));
        } else if (zone.id === "building-math") {
            question = ZUPER_DEFAULT_QUESTIONS.find(q => q.subject.includes("Math"));
        } else if (zone.id === "building-science") {
            question = ZUPER_DEFAULT_QUESTIONS.find(q => q.subject.includes("Science"));
        } else {
            question = ZUPER_DEFAULT_QUESTIONS[Math.floor(Math.random() * ZUPER_DEFAULT_QUESTIONS.length)];
        }

        if (question) {
            this.openQuizModal(question);
        }
    }

    openQuizModal(question) {
        this.currentQ = question;
        this.qStartTime = performance.now();
        const modal = document.getElementById("quiz-modal");
        const qTitle = document.getElementById("quiz-q-title");
        const qSubject = document.getElementById("quiz-q-subject");
        const qContainer = document.getElementById("quiz-interaction-container");
        const feedbackBox = document.getElementById("quiz-feedback-box");

        if (!modal || !qTitle || !qContainer) return;

        if (feedbackBox) feedbackBox.classList.add("hidden");
        qSubject.textContent = `${question.subject} • ${question.type.toUpperCase()}`;
        qTitle.textContent = question.question;
        qContainer.innerHTML = "";

        // Start 15s Countdown Timer
        this.startQuestionTimer(15);

        // 1. MULTIPLE CHOICE
        if (question.type === "multiple_choice") {
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-1 md:grid-cols-2 gap-3";
            question.options.forEach((opt, idx) => {
                const btn = document.createElement("button");
                btn.className = "p-4 rounded-2xl bg-slate-800/90 hover:bg-indigo-900/60 border border-slate-700/80 hover:border-indigo-400 font-semibold text-left text-slate-100 flex items-center gap-3 transition-all active:scale-95";
                const letters = ["A", "B", "C", "D"];
                btn.innerHTML = `
                    <span class="w-8 h-8 rounded-xl bg-slate-700 text-indigo-300 font-bold flex items-center justify-center">${letters[idx]}</span>
                    <span class="text-sm md:text-base">${opt}</span>
                `;
                btn.addEventListener("click", () => this.submitAnswer(idx === question.correctAnswer, idx));
                grid.appendChild(btn);
            });
            qContainer.appendChild(grid);
        }

        // 2. TRUE / FALSE
        else if (question.type === "true_false") {
            const row = document.createElement("div");
            row.className = "grid grid-cols-2 gap-4";
            question.options.forEach((opt, idx) => {
                const btn = document.createElement("button");
                btn.className = `p-6 rounded-2xl font-black text-lg text-white border transition-all active:scale-95 ${
                    idx === 0 
                        ? "bg-emerald-600/80 hover:bg-emerald-500 border-emerald-400" 
                        : "bg-rose-600/80 hover:bg-rose-500 border-rose-400"
                }`;
                btn.textContent = opt;
                btn.addEventListener("click", () => this.submitAnswer(idx === question.correctAnswer, idx));
                row.appendChild(btn);
            });
            qContainer.appendChild(row);
        }

        // 3. SHORT ANSWER
        else if (question.type === "short_answer") {
            const box = document.createElement("div");
            box.className = "space-y-4 max-w-md mx-auto";
            box.innerHTML = `
                <input id="quiz-input-text" type="text" placeholder="Ketik jawabanmu di sini..." class="w-full p-4 rounded-2xl bg-slate-900 border border-indigo-500/60 text-slate-100 font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <p class="text-xs text-slate-400 text-center">${question.hint || ""}</p>
                <button id="quiz-submit-text" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white shadow-lg transition-all active:scale-95">
                    Kirim Jawaban
                </button>
            `;
            qContainer.appendChild(box);

            const submitBtn = box.querySelector("#quiz-submit-text");
            const inputField = box.querySelector("#quiz-input-text");
            submitBtn.addEventListener("click", () => {
                const val = (inputField.value || "").trim().toLowerCase();
                const isCorrect = question.acceptableAnswers.some(ans => ans.toLowerCase() === val);
                this.submitAnswer(isCorrect, val);
            });
        }

        // 4. MATCHING PAIRS
        else if (question.type === "matching") {
            const wrapper = document.createElement("div");
            wrapper.className = "space-y-3";
            const grid = document.createElement("div");
            grid.className = "space-y-2.5";
            question.pairs.forEach((pair) => {
                const row = document.createElement("div");
                row.className = "flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs md:text-sm";
                row.innerHTML = `
                    <span class="font-bold text-amber-300">${pair.left}</span>
                    <span class="text-slate-400">➡️</span>
                    <span class="font-medium text-slate-200">${pair.right}</span>
                `;
                grid.appendChild(row);
            });
            wrapper.appendChild(grid);

            const btnDone = document.createElement("button");
            btnDone.className = "w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-md";
            btnDone.textContent = "Verifikasi Pasangan";
            btnDone.addEventListener("click", () => this.submitAnswer(true, 0));
            wrapper.appendChild(btnDone);
            qContainer.appendChild(wrapper);
        }

        // 5. ORDERING
        else if (question.type === "ordering") {
            const wrapper = document.createElement("div");
            wrapper.className = "space-y-3";
            question.correctSequence.forEach((item, idx) => {
                const step = document.createElement("div");
                step.className = "flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-indigo-500/30 text-xs md:text-sm";
                step.innerHTML = `
                    <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">${idx + 1}</span>
                    <span class="font-semibold text-slate-100">${item}</span>
                `;
                wrapper.appendChild(step);
            });

            const btnConfirm = document.createElement("button");
            btnConfirm.className = "w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white shadow-md";
            btnConfirm.textContent = "Konfirmasi Urutan Selesai";
            btnConfirm.addEventListener("click", () => this.submitAnswer(true, 0));
            wrapper.appendChild(btnConfirm);
            qContainer.appendChild(wrapper);
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

    startQuestionTimer(seconds = 15) {
        this.stopQuestionTimer();
        this.timeLeft = seconds;
        const timerEl = document.getElementById("quiz-timer");
        if (timerEl) timerEl.textContent = `${this.timeLeft}s`;

        this.qTimerInterval = setInterval(() => {
            this.timeLeft--;
            if (timerEl) timerEl.textContent = `${this.timeLeft}s`;

            if (this.timeLeft <= 0) {
                this.stopQuestionTimer();
                this.submitAnswer(false, -1, true); // Timeout counts as wrong
            }
        }, 1000);
    }

    stopQuestionTimer() {
        if (this.qTimerInterval) {
            clearInterval(this.qTimerInterval);
            this.qTimerInterval = null;
        }
    }

    submitAnswer(isCorrect, selectedOption, isTimeout = false) {
        this.stopQuestionTimer();
        const responseTimeSec = Math.round((performance.now() - this.qStartTime) / 100) / 10;
        const feedbackBox = document.getElementById("quiz-feedback-box");
        const fbStatus = document.getElementById("quiz-fb-status");
        const fbExplanation = document.getElementById("quiz-fb-explanation");

        if (feedbackBox && fbStatus && fbExplanation) {
            feedbackBox.classList.remove("hidden");
            if (isCorrect) {
                if (this.sound) this.sound.playCorrect();
                fbStatus.className = "text-base font-black text-emerald-400";
                fbStatus.textContent = "🎉 Luar Biasa! Jawabanmu Benar!";
                this.combo++;
                this.score += 100 + (this.combo * 20) + (this.timeLeft * 5);
                this.xp += 40;
                this.coins += 10;
                this.spawnFloatingText("+100 PTS!", "#10b981");

                if (this.roomMode === "boss_raid") {
                    if (this.sound) this.sound.playLaserSpell();
                    this.bossHp = Math.max(0, this.bossHp - 500);
                    this.updateBossBar();
                    this.spawnFloatingText("💥 BOSS -500 HP!", "#f43f5e");
                }
            } else {
                if (this.sound) this.sound.playWrong();
                fbStatus.className = "text-base font-black text-rose-400";
                fbStatus.textContent = isTimeout ? "⏱️ Waktu Habis!" : "❌ Jawaban Kurang Tepat";
                this.combo = 0;
                this.shield = Math.max(0, this.shield - 25);
                this.spawnFloatingText("-25% SHIELD", "#f43f5e");

                if (this.shield <= 0 && this.roomMode === "battle_royale") {
                    this.handleEliminated();
                }
            }

            fbExplanation.textContent = this.currentQ.explanation || "Pembahasan materi terverifikasi.";
            this.updateHUD();

            this.logAssessment(isCorrect, responseTimeSec, typeof selectedOption === "number" ? selectedOption : 0);
        }
    }

    spawnFloatingText(text, color) {
        const el = document.createElement("div");
        el.className = "floating-text";
        el.style.left = "50%";
        el.style.top = "40%";
        el.style.color = color || "#ffffff";
        el.textContent = text;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }

    updateBossBar() {
        const bossBar = document.getElementById("hud-boss-bar");
        const bossVal = document.getElementById("hud-boss-hp-val");
        if (bossBar && bossVal) {
            const pct = (this.bossHp / this.bossMaxHp) * 100;
            bossBar.style.width = `${pct}%`;
            bossVal.textContent = `${this.bossHp} / ${this.bossMaxHp} HP`;
        }
    }

    handleEliminated() {
        if (this.sound) this.sound.playWarningAlarm();
        const elimModal = document.getElementById("eliminated-modal");
        if (elimModal) {
            elimModal.classList.remove("hidden");
            elimModal.classList.add("flex");
        }
    }

    async joinClassRoom(roomCode) {
        if (!this.sb) {
            alert("Koneksi Supabase belum aktif.");
            return;
        }

        try {
            const { data: room, error: roomErr } = await this.sb
                .from("zuper_rooms")
                .select("*")
                .eq("room_code", roomCode)
                .single();

            if (roomErr || !room) {
                alert(`Room Kelas "${roomCode}" tidak ditemukan!`);
                return;
            }

            this.currentRoom = roomCode;
            this.roomMode = room.game_mode || "battle_royale";
            this.isMultiplayer = true;

            const displayName = `${this.studentName} (#${this.absen})`;

            await this.sb.from("zuper_players").upsert({
                room_code: roomCode,
                student_name: displayName,
                avatar_color: this.color,
                avatar_hat: this.hat,
                avatar_cape: this.cape,
                pos_x: this.world.playerPos.x,
                pos_z: this.world.playerPos.z,
                score: this.score,
                shield: this.shield,
                is_alive: true,
                is_ready: true
            }, { onConflict: "room_code, student_name" });

            this.subscribeToRoom(roomCode);

            const lobbyModal = document.getElementById("join-room-modal");
            if (lobbyModal) lobbyModal.classList.add("hidden");

            const roomIndicator = document.getElementById("hud-room-indicator");
            if (roomIndicator) {
                roomIndicator.classList.remove("hidden");
                roomIndicator.innerHTML = `Room: <b>${roomCode}</b> (${this.roomMode.toUpperCase()})`;
            }

            if (this.roomMode === "boss_raid") {
                const bossContainer = document.getElementById("hud-boss-container");
                if (bossContainer) bossContainer.classList.remove("hidden");
            }

            if (this.sound) this.sound.playCorrect();
            alert(`Berhasil terhubung ke Room Kelas ${roomCode} sebagai ${displayName}!`);
        } catch (e) {
            console.error("Join room error:", e);
        }
    }

    subscribeToRoom(roomCode) {
        if (this.roomChannel) {
            this.sb.removeChannel(this.roomChannel);
        }

        this.roomChannel = this.sb
            .channel(`zuper-room-${roomCode}`)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "zuper_players",
                filter: `room_code=eq.${roomCode}`
            }, () => {
                this.refreshRoomPlayers();
            })
            .on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "zuper_rooms",
                filter: `room_code=eq.${roomCode}`
            }, (payload) => {
                const updated = payload.new;
                if (updated && updated.boss_hp !== undefined) {
                    this.bossHp = updated.boss_hp;
                    this.updateBossBar();
                }
            })
            .subscribe();

        this.refreshRoomPlayers();
    }

    async refreshRoomPlayers() {
        if (!this.sb || !this.currentRoom) return;
        const { data: players } = await this.sb
            .from("zuper_players")
            .select("*")
            .eq("room_code", this.currentRoom);

        if (players && this.world) {
            this.world.syncOtherPlayers(players);
        }
    }

    async broadcastPosition() {
        if (!this.sb || !this.currentRoom || !this.world) return;
        try {
            const displayName = `${this.studentName} (#${this.absen})`;
            await this.sb.from("zuper_players").update({
                pos_x: Math.round(this.world.playerPos.x * 10) / 10,
                pos_z: Math.round(this.world.playerPos.z * 10) / 10,
                score: this.score,
                shield: this.shield,
                last_seen: new Date().toISOString()
            }).match({
                room_code: this.currentRoom,
                student_name: displayName
            });
        } catch (e) {}
    }

    async logAssessment(isCorrect, responseTimeSec, selectedOption) {
        if (!this.sb) return;
        try {
            await this.sb.from("zuper_assessments").insert({
                room_code: this.currentRoom || "SOLO_QUEST",
                student_name: `${this.studentName} (#${this.absen})`,
                question_id: this.currentQ ? this.currentQ.id : "q_unknown",
                is_correct: isCorrect,
                response_time_sec: responseTimeSec,
                selected_option: selectedOption
            });
        } catch (e) {}
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.studentApp = new StudentApp();
});

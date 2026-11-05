/**
 * ZuperVerse - Interactive Mini-Games Suite (Fase 3)
 * Mode 1: Lari Kilat (Speed Runner 4-Lajur)
 * Mode 2: Jembatan Juara (Sky Bridge Quiz)
 */

class MiniGamesManager {
    constructor() {
        this.sound = window.zuperSound;
        this.activeGame = null;
        this.runnerState = {
            lane: 1, // 0: A, 1: B, 2: C, 3: D
            lanes: ["A", "B", "C", "D"],
            speed: 5,
            gateDist: 100,
            score: 0,
            lives: 3,
            currentQIndex: 0,
            timer: 15,
            isRunning: false
        };

        this.bridgeState = {
            step: 0,
            totalSteps: 5,
            lives: 3,
            score: 0,
            currentQ: null
        };
    }

    /**
     * Start Mode 1: Lari Kilat (4-Lane Speed Runner)
     */
    startLariKilat(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.activeGame = "lari_kilat";
        this.runnerState.lane = 1;
        this.runnerState.score = 0;
        this.runnerState.lives = 3;
        this.runnerState.currentQIndex = 0;
        this.runnerState.isRunning = true;

        const questions = ZUPER_DEFAULT_QUESTIONS.filter(q => q.type === "multiple_choice");
        const currentQ = questions[0];

        container.innerHTML = `
            <div class="relative w-full h-[520px] bg-gradient-to-b from-indigo-950 via-slate-900 to-black rounded-3xl overflow-hidden border-2 border-indigo-500/60 shadow-2xl flex flex-col justify-between p-4">
                
                <!-- Top HUD -->
                <div class="flex justify-between items-center z-10 glass-panel px-4 py-2.5 rounded-2xl border border-indigo-400/40">
                    <div>
                        <span class="text-xs font-black text-amber-400">⚡ LARI KILAT: 4 LAJUR</span>
                        <div class="text-[11px] text-slate-300">Pindah ke lajur jawaban yang benar!</div>
                    </div>
                    <div class="flex items-center gap-4 text-xs font-bold">
                        <span id="runner-lives">❤️❤️❤️</span>
                        <span class="text-amber-300">Skor: <span id="runner-score">0</span></span>
                        <button onclick="window.miniGamesManager.stopGame()" class="px-2.5 py-1 rounded-lg bg-rose-600/80 text-white text-xs">Keluar</button>
                    </div>
                </div>

                <!-- Question Prompt Banner -->
                <div class="z-10 p-3.5 rounded-2xl bg-indigo-900/80 border border-indigo-400/60 text-center shadow-lg">
                    <span class="text-[10px] text-indigo-300 uppercase tracking-widest font-bold block mb-1">Pertanyaan Gerbang:</span>
                    <h4 id="runner-question-text" class="text-sm md:text-base font-bold text-white">${currentQ.question}</h4>
                </div>

                <!-- 4 Lanes Track Canvas / DOM Representation -->
                <div id="runner-track" class="relative flex-1 w-full grid grid-cols-4 gap-2 my-2 items-end pb-8">
                    <!-- 4 Lane Tracks -->
                    <div class="runner-lane-col relative h-full bg-slate-800/40 border-r border-dashed border-indigo-500/20 flex flex-col justify-end items-center pb-2">
                        <span class="text-2xl font-black text-indigo-300/40 mb-2">A</span>
                        <div class="text-[10px] text-center text-slate-200 px-1 font-semibold truncate w-full" title="${currentQ.options[0]}">${currentQ.options[0]}</div>
                    </div>
                    <div class="runner-lane-col relative h-full bg-slate-800/40 border-r border-dashed border-indigo-500/20 flex flex-col justify-end items-center pb-2">
                        <span class="text-2xl font-black text-indigo-300/40 mb-2">B</span>
                        <div class="text-[10px] text-center text-slate-200 px-1 font-semibold truncate w-full" title="${currentQ.options[1]}">${currentQ.options[1]}</div>
                    </div>
                    <div class="runner-lane-col relative h-full bg-slate-800/40 border-r border-dashed border-indigo-500/20 flex flex-col justify-end items-center pb-2">
                        <span class="text-2xl font-black text-indigo-300/40 mb-2">C</span>
                        <div class="text-[10px] text-center text-slate-200 px-1 font-semibold truncate w-full" title="${currentQ.options[2]}">${currentQ.options[2]}</div>
                    </div>
                    <div class="runner-lane-col relative h-full bg-slate-800/40 flex flex-col justify-end items-center pb-2">
                        <span class="text-2xl font-black text-indigo-300/40 mb-2">D</span>
                        <div class="text-[10px] text-center text-slate-200 px-1 font-semibold truncate w-full" title="${currentQ.options[3]}">${currentQ.options[3]}</div>
                    </div>

                    <!-- Player Avatar Runner Position -->
                    <div id="runner-avatar" class="absolute bottom-6 w-12 h-14 rounded-2xl bg-gradient-to-t from-indigo-600 to-purple-500 flex items-center justify-center text-2xl shadow-xl border-2 border-white transition-all duration-200" style="left: calc(25% * 1 + 6%);">
                        🏃
                    </div>
                </div>

                <!-- Bottom Controls (Buttons for Mobile & Touch) -->
                <div class="grid grid-cols-2 gap-3 z-10">
                    <button id="btn-runner-left" class="py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 font-bold text-white text-sm border border-slate-700 flex items-center justify-center gap-2 active:scale-95">
                        <span>◀ Pindah Kiri</span>
                    </button>
                    <button id="btn-runner-right" class="py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 font-bold text-white text-sm border border-slate-700 flex items-center justify-center gap-2 active:scale-95">
                        <span>Pindah Kanan ▶</span>
                    </button>
                </div>

                <!-- Submit / Pass Gate Button -->
                <button id="btn-runner-pass" class="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 font-black text-white text-sm shadow-lg active:scale-95">
                    🚀 Terobos Gerbang Sekarang!
                </button>
            </div>
        `;

        this.bindRunnerControls(questions);
    }

    bindRunnerControls(questions) {
        const updateAvatarPos = () => {
            const avatar = document.getElementById("runner-avatar");
            if (avatar) {
                avatar.style.left = `calc(25% * ${this.runnerState.lane} + 5%)`;
            }
        };

        const moveLeft = () => {
            if (this.runnerState.lane > 0) {
                this.runnerState.lane--;
                if (this.sound) this.sound.playJump();
                updateAvatarPos();
            }
        };

        const moveRight = () => {
            if (this.runnerState.lane < 3) {
                this.runnerState.lane++;
                if (this.sound) this.sound.playJump();
                updateAvatarPos();
            }
        };

        const btnLeft = document.getElementById("btn-runner-left");
        const btnRight = document.getElementById("btn-runner-right");
        if (btnLeft) btnLeft.addEventListener("click", moveLeft);
        if (btnRight) btnRight.addEventListener("click", moveRight);

        // Keyboard Arrow bindings
        this.runnerKeyHandler = (e) => {
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft();
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") moveRight();
            if (e.key === " " || e.key === "Enter") {
                const passBtn = document.getElementById("btn-runner-pass");
                if (passBtn) passBtn.click();
            }
        };
        window.addEventListener("keydown", this.runnerKeyHandler);

        // Pass Gate check
        const btnPass = document.getElementById("btn-runner-pass");
        if (btnPass) {
            btnPass.addEventListener("click", () => {
                const q = questions[this.runnerState.currentQIndex % questions.length];
                const isCorrect = this.runnerState.lane === q.correctAnswer;

                if (isCorrect) {
                    if (this.sound) this.sound.playCorrect();
                    this.runnerState.score += 150;
                    alert("🎉 Gerbang Berhasil Diterobos! Jawaban Benar (+150 Poin)!");
                } else {
                    if (this.sound) this.sound.playWrong();
                    this.runnerState.lives--;
                    alert("💥 Menabrak Rintangan! Jawaban Kurang Tepat (-1 Nyawa)!");
                }

                // Update HUD
                const scoreEl = document.getElementById("runner-score");
                if (scoreEl) scoreEl.textContent = this.runnerState.score;
                const livesEl = document.getElementById("runner-lives");
                if (livesEl) livesEl.textContent = "❤️".repeat(Math.max(0, this.runnerState.lives));

                if (this.runnerState.lives <= 0) {
                    alert(`Permainan Selesai! Skor Akhir Lari Kilat: ${this.runnerState.score} Pts`);
                    this.stopGame();
                    return;
                }

                // Next question
                this.runnerState.currentQIndex++;
                const nextQ = questions[this.runnerState.currentQIndex % questions.length];
                const qText = document.getElementById("runner-question-text");
                if (qText) qText.textContent = nextQ.question;
            });
        }
    }

    /**
     * Start Mode 2: Jembatan Juara (Sky Bridge Quiz)
     */
    startJembatanJuara(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.activeGame = "jembatan_juara";
        this.bridgeState.step = 0;
        this.bridgeState.score = 0;
        this.bridgeState.lives = 3;

        const questions = ZUPER_DEFAULT_QUESTIONS.filter(q => q.type === "true_false");
        const currentQ = questions[0];

        container.innerHTML = `
            <div class="relative w-full h-[520px] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl flex flex-col justify-between p-4">
                <!-- Top HUD -->
                <div class="flex justify-between items-center z-10 glass-panel px-4 py-2.5 rounded-2xl border border-cyan-400/40">
                    <div>
                        <span class="text-xs font-black text-cyan-400">🌉 JEMBATAN JUARA: SKY BRIDGE QUIZ</span>
                        <div class="text-[11px] text-slate-300">Pilih ubin kaca yang kokoh menuju garis akhir!</div>
                    </div>
                    <div class="flex items-center gap-4 text-xs font-bold">
                        <span id="bridge-lives">❤️❤️❤️</span>
                        <span class="text-amber-300">Skor: <span id="bridge-score">0</span></span>
                        <button onclick="window.miniGamesManager.stopGame()" class="px-2.5 py-1 rounded-lg bg-rose-600/80 text-white text-xs">Keluar</button>
                    </div>
                </div>

                <!-- Sky Bridge Question -->
                <div class="z-10 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-center shadow-lg my-auto">
                    <span class="text-[10px] text-cyan-300 uppercase tracking-widest font-bold block mb-1">Langkah Jembatan #${this.bridgeState.step + 1}:</span>
                    <h4 class="text-sm md:text-base font-bold text-white mb-6">${currentQ.question}</h4>

                    <!-- 2 Glass Stepping Tiles -->
                    <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <button onclick="window.miniGamesManager.handleBridgeStep(0)" class="p-6 rounded-3xl bg-emerald-600/80 hover:bg-emerald-500 border-2 border-emerald-400/80 text-white font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                            <span>✅ TRUE</span>
                            <span class="block text-xs font-normal text-emerald-200 mt-1">Ubin Kaca Kiri</span>
                        </button>
                        <button onclick="window.miniGamesManager.handleBridgeStep(1)" class="p-6 rounded-3xl bg-rose-600/80 hover:bg-rose-500 border-2 border-rose-400/80 text-white font-black text-lg shadow-xl shadow-rose-500/20 active:scale-95 transition-all">
                            <span>❌ FALSE</span>
                            <span class="block text-xs font-normal text-rose-200 mt-1">Ubin Kaca Kanan</span>
                        </button>
                    </div>
                </div>

                <!-- Footer Bridge Status -->
                <div class="text-center text-xs text-slate-400">
                    Progres: Langkah <span class="font-bold text-cyan-300">${this.bridgeState.step + 1}</span> dari ${this.bridgeState.totalSteps}
                </div>
            </div>
        `;
    }

    handleBridgeStep(tileIndex) {
        const questions = ZUPER_DEFAULT_QUESTIONS.filter(q => q.type === "true_false");
        const currentQ = questions[this.bridgeState.step % questions.length];
        const isCorrect = tileIndex === currentQ.correctAnswer;

        if (isCorrect) {
            if (this.sound) this.sound.playCorrect();
            this.bridgeState.score += 200;
            this.bridgeState.step++;
            alert("✨ Ubin Kokoh! Kamu melangkah maju ke seberang jembatan (+200 Pts)!");
        } else {
            if (this.sound) this.sound.playWrong();
            this.bridgeState.lives--;
            alert("💥 Kaca Retak! Kamu kehilangan 1 nyawa!");
        }

        if (this.bridgeState.lives <= 0) {
            alert(`Game Over! Jembatan runtuh. Skor Akhir: ${this.bridgeState.score} Pts`);
            this.stopGame();
            return;
        }

        if (this.bridgeState.step >= this.bridgeState.totalSteps) {
            if (this.sound) this.sound.playVictoryFanfare();
            alert(`🏆 SELAMAT! Kamu berhasil menyeberangi Jembatan Juara dengan Skor ${this.bridgeState.score} Pts!`);
            this.stopGame();
            return;
        }

        // Re-render next step
        this.startJembatanJuara("minigames-container");
    }

    stopGame() {
        if (this.runnerKeyHandler) {
            window.removeEventListener("keydown", this.runnerKeyHandler);
        }
        const modal = document.getElementById("minigames-modal");
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    }
}

window.miniGamesManager = new MiniGamesManager();

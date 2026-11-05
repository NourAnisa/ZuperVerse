/**
 * ZuperVerse - 3D Environment & Building Interaction Engine (Fase 2: Kota Ilmu)
 * Three.js WebGL City of Knowledge with 3D Subject Buildings & Entrance Door Triggers
 */

class ZuperWorld3D {
    constructor(canvasContainerId, onZoneInteract) {
        this.container = document.getElementById(canvasContainerId);
        this.onZoneInteract = onZoneInteract || (() => {});
        this.otherPlayers = new Map();
        this.buildings = [];
        this.playerConfig = {
            color: '#6366f1',
            hat: 'cap',
            cape: 'none',
            name: 'Adventurer'
        };

        // Movement state
        this.moveInput = { x: 0, z: 0 };
        this.playerPos = { x: 0, y: 0.8, z: 10 };
        this.walkCycle = 0;
        this.activeZone = null;

        this.init();
    }

    init() {
        if (!window.THREE) return;

        // 1. Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060911);
        this.scene.fog = new THREE.FogExp2(0x060911, 0.012);

        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 500);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 2. Lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e1e38, 0.7);
        this.scene.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.1);
        sunLight.position.set(35, 70, 45);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        this.scene.add(sunLight);

        // 3. Build 3D "Kota Ilmu" (Ground, Streets, Plaza, Trees)
        this.buildKotaIlmuGround();

        // 4. Build 3D Subject Buildings with Entrance Doors
        this.buildSubjectBuildings();

        // 5. Build NPC Wiseman
        this.buildNPCWiseman();

        // 6. Build Player Avatar
        this.buildPlayerAvatar();

        // 7. Controls & Loop
        this.setupKeyboardControls();
        this.setupResizeListener();

        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    buildKotaIlmuGround() {
        // City Base Ground
        const groundGeo = new THREE.CylinderGeometry(42, 38, 5, 36);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -2.5;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Cyber Asphalt Crossroads
        const roadGeo = new THREE.PlaneGeometry(8, 76);
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
        
        const roadNtoS = new THREE.Mesh(roadGeo, roadMat);
        roadNtoS.rotation.x = -Math.PI / 2;
        roadNtoS.position.y = 0.05;
        roadNtoS.receiveShadow = true;
        this.scene.add(roadNtoS);

        const roadWtoE = roadNtoS.clone();
        roadWtoE.rotation.z = Math.PI / 2;
        this.scene.add(roadWtoE);

        // Center Plaza
        const plazaGeo = new THREE.CylinderGeometry(10, 10, 0.4, 28);
        const plazaMat = new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.4 });
        const plaza = new THREE.Mesh(plazaGeo, plazaMat);
        plaza.position.y = 0.2;
        plaza.receiveShadow = true;
        this.scene.add(plaza);

        // Floating Center Knowledge Crystal
        const crystalGeo = new THREE.OctahedronGeometry(2.2, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
            color: 0x818cf8,
            emissive: 0x4338ca,
            emissiveIntensity: 0.7,
            roughness: 0.15,
            metalness: 0.85
        });
        this.centerCrystal = new THREE.Mesh(crystalGeo, crystalMat);
        this.centerCrystal.position.set(0, 4.5, 0);
        this.scene.add(this.centerCrystal);

        // Street Lamps with Glowing Lanterns
        const lampPositions = [
            [-8, 8], [8, 8], [-8, -8], [8, -8],
            [0, 16], [0, -16], [16, 0], [-16, 0]
        ];

        lampPositions.forEach(([lx, lz]) => {
            const poleGeo = new THREE.CylinderGeometry(0.12, 0.15, 3.5, 6);
            const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
            const pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.set(lx, 1.75, lz);
            this.scene.add(pole);

            const lanternGeo = new THREE.SphereGeometry(0.35, 8, 8);
            const lanternMat = new THREE.MeshBasicMaterial({ color: 0xa5f3fc });
            const lantern = new THREE.Mesh(lanternGeo, lanternMat);
            lantern.position.set(lx, 3.6, lz);
            this.scene.add(lantern);
        });
    }

    buildSubjectBuildings() {
        const buildingsData = [
            {
                id: "building-english",
                subject: "English Math",
                title: "Gedung Bahasa & Kosa Kata (English Hall)",
                color: 0x8b5cf6, // Violet
                accentColor: 0xc084fc,
                x: 0,
                z: -26,
                doorAngle: 0,
                desc: "Uji Kosa Kata, Angka Ordinal & Soal Cerita Bahasa Inggris"
            },
            {
                id: "building-math",
                subject: "Mathematics",
                title: "Kastil Matematika & Aljabar (Math Citadel)",
                color: 0x06b6d4, // Cyan
                accentColor: 0x67e8f9,
                x: -26,
                z: 0,
                doorAngle: Math.PI / 2,
                desc: "Uji Operasi Hitung, Aljabar & Pecahan Desimal"
            },
            {
                id: "building-science",
                subject: "Science & Math (IPA)",
                title: "Laboratorium Sains & Robotik (Science Lab)",
                color: 0x10b981, // Emerald
                accentColor: 0x6ee7b7,
                x: 26,
                z: 0,
                doorAngle: -Math.PI / 2,
                desc: "Uji Kecepatan, Fisika Dasar & Observasi IPA"
            },
            {
                id: "building-minigames",
                subject: "Mini-Games",
                title: "Stadion Turnamen Mini-Games (Stadium)",
                color: 0xf43f5e, // Rose
                accentColor: 0xfb7185,
                x: 0,
                z: 26,
                doorAngle: Math.PI,
                desc: "Mode Lari Kilat 4-Lajur & Jembatan Juara"
            }
        ];

        buildingsData.forEach(b => {
            const group = new THREE.Group();

            // Main Building Block (Architecture)
            const mainGeo = new THREE.BoxGeometry(11, 10, 11);
            const mainMat = new THREE.MeshStandardMaterial({
                color: 0x1e293b,
                roughness: 0.6,
                metalness: 0.2
            });
            const mainMesh = new THREE.Mesh(mainGeo, mainMat);
            mainMesh.position.y = 5;
            mainMesh.castShadow = true;
            mainMesh.receiveShadow = true;
            group.add(mainMesh);

            // Roof Spire / Dome
            const roofGeo = new THREE.ConeGeometry(7, 4.5, 4);
            const roofMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.3 });
            const roof = new THREE.Mesh(roofGeo, roofMat);
            roof.position.y = 12.25;
            roof.rotation.y = Math.PI / 4;
            roof.castShadow = true;
            group.add(roof);

            // Glowing Entrance Door
            const doorGeo = new THREE.BoxGeometry(3.2, 4.5, 0.4);
            const doorMat = new THREE.MeshStandardMaterial({
                color: b.color,
                emissive: b.accentColor,
                emissiveIntensity: 0.8,
                roughness: 0.2
            });
            const door = new THREE.Mesh(doorGeo, doorMat);
            door.position.set(0, 2.25, 5.55);
            group.add(door);

            // Glowing Door Frame Arch
            const archGeo = new THREE.BoxGeometry(4.2, 5.2, 0.6);
            const archMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
            const arch = new THREE.Mesh(archGeo, archMat);
            arch.position.set(0, 2.6, 5.4);
            group.add(arch);

            // Signboard on top of door
            const signGeo = new THREE.BoxGeometry(5.5, 1.2, 0.4);
            const signMat = new THREE.MeshStandardMaterial({ color: b.color });
            const sign = new THREE.Mesh(signGeo, signMat);
            sign.position.set(0, 5.8, 5.7);
            group.add(sign);

            group.position.set(b.x, 0, b.z);
            group.rotation.y = b.doorAngle;
            this.scene.add(group);

            // Register door interaction trigger
            this.buildings.push({
                id: b.id,
                subject: b.subject,
                name: b.title,
                desc: b.desc,
                x: b.x,
                z: b.z,
                triggerRadius: 5.5
            });
        });
    }

    buildNPCWiseman() {
        const npcGroup = new THREE.Group();

        // Robot Head
        const headGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xd97706,
            emissiveIntensity: 0.5,
            roughness: 0.2
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 2.6;
        npcGroup.add(head);

        // Halo Ring
        const haloGeo = new THREE.TorusGeometry(1.6, 0.15, 8, 24);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 3.6;
        npcGroup.add(halo);

        npcGroup.position.set(5.5, 0, 5.5);
        this.scene.add(npcGroup);
        this.npcWiseman = npcGroup;

        this.buildings.push({
            id: "npc-wiseman",
            name: "Guru Robot ZuperWiseman",
            desc: "Panduan Misi Harian & Bantuan Belajar",
            x: 5.5,
            z: 5.5,
            triggerRadius: 4.0
        });
    }

    buildPlayerAvatar() {
        this.playerMesh = this.createAvatarMesh(this.playerConfig);
        this.playerMesh.position.set(this.playerPos.x, this.playerPos.y, this.playerPos.z);
        this.scene.add(this.playerMesh);
    }

    createAvatarMesh(config) {
        const avatarGroup = new THREE.Group();

        // Torso
        const torsoGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12);
        const torsoMat = new THREE.MeshStandardMaterial({ color: config.color || '#6366f1', roughness: 0.4 });
        const torso = new THREE.Mesh(torsoGeo, torsoMat);
        torso.position.y = 1.0;
        torso.castShadow = true;
        avatarGroup.add(torso);

        // Head
        const headGeo = new THREE.SphereGeometry(0.42, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.85;
        head.castShadow = true;
        avatarGroup.add(head);

        // Eyes Visor
        const visorGeo = new THREE.BoxGeometry(0.45, 0.15, 0.2);
        const visorMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.8 });
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.position.set(0, 1.9, 0.35);
        avatarGroup.add(visor);

        // Hat
        if (config.hat === "crown") {
            const crownGeo = new THREE.CylinderGeometry(0.48, 0.38, 0.3, 5);
            const crownMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
            const crown = new THREE.Mesh(crownGeo, crownMat);
            crown.position.y = 2.3;
            avatarGroup.add(crown);
        } else if (config.hat === "wizard") {
            const wizGeo = new THREE.ConeGeometry(0.5, 1.1, 8);
            const wizMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
            const wiz = new THREE.Mesh(wizGeo, wizMat);
            wiz.position.y = 2.5;
            avatarGroup.add(wiz);
        } else if (config.hat === "horns") {
            const hornGeo = new THREE.ConeGeometry(0.12, 0.5, 6);
            const hornMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
            const hornL = new THREE.Mesh(hornGeo, hornMat);
            hornL.position.set(-0.3, 2.25, 0.1);
            hornL.rotation.z = 0.3;
            const hornR = new THREE.Mesh(hornGeo, hornMat);
            hornR.position.set(0.3, 2.25, 0.1);
            hornR.rotation.z = -0.3;
            avatarGroup.add(hornL);
            avatarGroup.add(hornR);
        } else {
            const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.12, 12);
            const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
            const cap = new THREE.Mesh(capGeo, capMat);
            cap.position.y = 2.25;
            avatarGroup.add(cap);
        }

        return avatarGroup;
    }

    updatePlayerCustomization(config) {
        this.playerConfig = { ...this.playerConfig, ...config };
        if (this.playerMesh) {
            this.scene.remove(this.playerMesh);
        }
        this.buildPlayerAvatar();
    }

    syncOtherPlayers(playersList) {
        const activeIds = new Set();
        playersList.forEach(p => {
            if (p.student_name === this.playerConfig.name) return;
            activeIds.add(p.student_name);

            if (!this.otherPlayers.has(p.student_name)) {
                const mesh = this.createAvatarMesh({
                    color: p.avatar_color || '#10b981',
                    hat: p.avatar_hat || 'cap',
                    cape: p.avatar_cape || 'none'
                });
                mesh.position.set(p.pos_x || 0, 0.8, p.pos_z || 0);
                this.scene.add(mesh);
                this.otherPlayers.set(p.student_name, { mesh, targetX: p.pos_x || 0, targetZ: p.pos_z || 0 });
            } else {
                const entry = this.otherPlayers.get(p.student_name);
                entry.targetX = p.pos_x || 0;
                entry.targetZ = p.pos_z || 0;
            }
        });

        for (let [name, entry] of this.otherPlayers.entries()) {
            if (!activeIds.has(name)) {
                this.scene.remove(entry.mesh);
                this.otherPlayers.delete(name);
            }
        }
    }

    setupKeyboardControls() {
        this.keys = {};
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === "e" || e.key === "E" || e.code === "Space") {
                if (this.activeZone) {
                    this.onZoneInteract(this.activeZone);
                }
            }
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        this.setTouchInput = (x, z) => {
            this.moveInput.x = x;
            this.moveInput.z = z;
        };
    }

    setupResizeListener() {
        window.addEventListener("resize", () => {
            if (!this.container || !this.renderer || !this.camera) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    updatePlayerMovement(delta) {
        let kX = 0, kZ = 0;
        if (this.keys["w"] || this.keys["arrowup"]) kZ -= 1;
        if (this.keys["s"] || this.keys["arrowdown"]) kZ += 1;
        if (this.keys["a"] || this.keys["arrowleft"]) kX -= 1;
        if (this.keys["d"] || this.keys["arrowright"]) kX += 1;

        const inputX = kX !== 0 ? kX : this.moveInput.x;
        const inputZ = kZ !== 0 ? kZ : this.moveInput.z;

        const speed = 12.0;
        if (inputX !== 0 || inputZ !== 0) {
            const length = Math.sqrt(inputX * inputX + inputZ * inputZ);
            const normX = inputX / length;
            const normZ = inputZ / length;

            this.playerPos.x += normX * speed * delta;
            this.playerPos.z += normZ * speed * delta;

            // Restrict bounds
            const dist = Math.sqrt(this.playerPos.x * this.playerPos.x + this.playerPos.z * this.playerPos.z);
            if (dist > 38) {
                this.playerPos.x = (this.playerPos.x / dist) * 38;
                this.playerPos.z = (this.playerPos.z / dist) * 38;
            }

            const targetAngle = Math.atan2(normX, normZ);
            this.playerMesh.rotation.y = targetAngle;

            this.walkCycle += delta * 15;
            this.playerMesh.position.y = 0.8 + Math.abs(Math.sin(this.walkCycle)) * 0.2;
        } else {
            this.playerMesh.position.y = 0.8;
        }

        this.playerMesh.position.x = this.playerPos.x;
        this.playerMesh.position.z = this.playerPos.z;

        // Follow Camera
        const targetCamX = this.playerPos.x;
        const targetCamY = this.playerPos.y + 11;
        const targetCamZ = this.playerPos.z + 16;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.1;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.1;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.1;
        this.camera.lookAt(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
    }

    checkBuildingDoorTriggers() {
        let closestBuilding = null;
        let minDist = Infinity;

        this.buildings.forEach(b => {
            const dx = this.playerPos.x - b.x;
            const dz = this.playerPos.z - b.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < b.triggerRadius) {
                if (dist < minDist) {
                    minDist = dist;
                    closestBuilding = b;
                }
            }
        });

        if (closestBuilding !== this.activeZone) {
            this.activeZone = closestBuilding;
            const promptEl = document.getElementById("zone-interaction-prompt");
            if (promptEl) {
                if (this.activeZone) {
                    promptEl.classList.remove("hidden");
                    promptEl.innerHTML = `
                        <div class="glass-panel px-5 py-2.5 rounded-2xl border border-indigo-400 text-center animate-bounce shadow-xl">
                            <span class="text-amber-300 font-black text-sm">Tekan [E] atau Ketuk</span>: Masuk Pintu <b>${this.activeZone.name}</b>
                        </div>
                    `;
                } else {
                    promptEl.classList.add("hidden");
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();

        if (this.playerMesh) {
            this.updatePlayerMovement(delta);
        }

        this.checkBuildingDoorTriggers();

        if (this.centerCrystal) {
            this.centerCrystal.rotation.y += delta * 0.8;
            this.centerCrystal.position.y = 4.5 + Math.sin(this.clock.getElapsedTime() * 2) * 0.3;
        }

        if (this.npcWiseman) {
            this.npcWiseman.position.y = Math.sin(this.clock.getElapsedTime() * 2.5) * 0.25;
            this.npcWiseman.rotation.y += delta * 0.5;
        }

        for (let entry of this.otherPlayers.values()) {
            entry.mesh.position.x += (entry.targetX - entry.mesh.position.x) * 0.15;
            entry.mesh.position.z += (entry.targetZ - entry.mesh.position.z) * 0.15;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.ZuperWorld3D = ZuperWorld3D;

/**
 * ZuperVerse - 3D Interactive Virtual World Engine (Three.js WebGL)
 * Low-poly stylized cyberpunk campus with player customization & realtime multi-avatar rendering
 */

class ZuperWorld3D {
    constructor(canvasContainerId, onZoneInteract) {
        this.container = document.getElementById(canvasContainerId);
        this.onZoneInteract = onZoneInteract || (() => {});
        this.otherPlayers = new Map(); // id -> { mesh, nameTag, targetPos }
        this.interactiveZones = [];
        this.playerConfig = {
            color: '#6366f1',
            hat: 'cap',
            cape: 'none',
            name: 'Adventurer'
        };

        // Movement state
        this.moveInput = { x: 0, z: 0 };
        this.playerPos = { x: 0, y: 0.8, z: 12 };
        this.playerVelocity = { x: 0, z: 0 };
        this.playerRotation = 0;
        this.walkCycle = 0;
        this.activeZone = null;

        this.init();
    }

    init() {
        if (!window.THREE) {
            console.error("Three.js not loaded!");
            return;
        }

        // 1. Scene, Camera & Renderer
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x080c14);
        this.scene.fog = new THREE.FogExp2(0x080c14, 0.015);

        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 500);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 2. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffeedd, 1.0);
        dirLight.position.set(30, 60, 40);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 10;
        dirLight.shadow.camera.far = 150;
        dirLight.shadow.camera.left = -40;
        dirLight.shadow.camera.right = 40;
        dirLight.shadow.camera.top = 40;
        dirLight.shadow.camera.bottom = -40;
        this.scene.add(dirLight);

        // Cyber Accent Lights
        const cyanLight = new THREE.PointLight(0x06b6d4, 2, 40);
        cyanLight.position.set(-15, 6, -10);
        this.scene.add(cyanLight);

        const purpleLight = new THREE.PointLight(0xa855f7, 2, 40);
        purpleLight.position.set(15, 6, -10);
        this.scene.add(purpleLight);

        // 3. Build Island & Environment
        this.buildAkademiaIsland();
        this.buildInteractivePortals();
        this.buildNPCWiseman();

        // 4. Build Player
        this.buildPlayerAvatar();

        // 5. Setup Controls & Listeners
        this.setupKeyboardControls();
        this.setupResizeListener();

        // 6. Start Render Loop
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    buildAkademiaIsland() {
        // Main Ground Island
        const islandGeo = new THREE.CylinderGeometry(40, 32, 6, 32);
        const islandMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.7,
            metalness: 0.2
        });
        const island = new THREE.Mesh(islandGeo, islandMat);
        island.position.y = -3;
        island.receiveShadow = true;
        this.scene.add(island);

        // Glowing Surface Lawn
        const surfaceGeo = new THREE.CylinderGeometry(39.5, 39.5, 0.4, 32);
        const surfaceMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.5,
            metalness: 0.1
        });
        const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
        surface.position.y = 0;
        surface.receiveShadow = true;
        this.scene.add(surface);

        // Futuristic Pathway Grid Cross
        const pathGeo = new THREE.PlaneGeometry(6, 70);
        const pathMat = new THREE.MeshBasicMaterial({ color: 0x312e81, transparent: true, opacity: 0.4 });
        const path1 = new THREE.Mesh(pathGeo, pathMat);
        path1.rotation.x = -Math.PI / 2;
        path1.position.y = 0.22;
        this.scene.add(path1);

        const path2 = path1.clone();
        path2.rotation.z = Math.PI / 2;
        this.scene.add(path2);

        // Center Plaza Fountain
        const plazaGeo = new THREE.CylinderGeometry(9, 9, 0.5, 24);
        const plazaMat = new THREE.MeshStandardMaterial({ color: 0x4338ca, roughness: 0.4 });
        const plaza = new THREE.Mesh(plazaGeo, plazaMat);
        plaza.position.y = 0.25;
        this.scene.add(plaza);

        // Center Floating Crystal
        const crystalGeo = new THREE.OctahedronGeometry(2, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
            color: 0x818cf8,
            emissive: 0x4338ca,
            emissiveIntensity: 0.6,
            roughness: 0.2,
            metalness: 0.8
        });
        this.centerCrystal = new THREE.Mesh(crystalGeo, crystalMat);
        this.centerCrystal.position.set(0, 4, 0);
        this.scene.add(this.centerCrystal);

        // Stylized Trees around the island perimeter
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const dist = 32 + (Math.sin(i * 3) * 3);
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;
            this.createStylizedTree(x, z);
        }
    }

    createStylizedTree(x, z) {
        const group = new THREE.Group();
        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3, 6);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        group.add(trunk);

        // Foliage Cone
        const foliageGeo = new THREE.ConeGeometry(2.2, 4.5, 6);
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.y = 4.2;
        foliage.castShadow = true;
        group.add(foliage);

        group.position.set(x, 0, z);
        this.scene.add(group);
    }

    buildInteractivePortals() {
        const portalsData = [
            {
                id: "portal-english",
                name: "English Vocab & Counting Spire",
                color: 0xa855f7,
                x: 0,
                z: -24,
                desc: "Kuis Petualangan Bahasa Inggris Berhitung"
            },
            {
                id: "portal-math",
                name: "Mathematics Citadel",
                color: 0x06b6d4,
                x: -24,
                z: 0,
                desc: "Kuis Aljabar & Operasi Hitung Logika"
            },
            {
                id: "portal-science",
                name: "Science & Logic Lab",
                color: 0x10b981,
                x: 24,
                z: 0,
                desc: "Kuis Eksperimen IPA & Kecepatan"
            },
            {
                id: "portal-battle",
                name: "Multiplayer Battle Royale Arena",
                color: 0xf43f5e,
                x: 0,
                z: 24,
                desc: "Arena Eliminasi Safe Zone Kelas"
            }
        ];

        this.portalMeshes = [];

        portalsData.forEach(p => {
            const portalGroup = new THREE.Group();

            // Ring Torus
            const ringGeo = new THREE.TorusGeometry(3.2, 0.4, 12, 28);
            const ringMat = new THREE.MeshStandardMaterial({
                color: p.color,
                emissive: p.color,
                emissiveIntensity: 0.8,
                roughness: 0.3
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 4;
            portalGroup.add(ring);

            // Swirling Inner Vortex
            const vortexGeo = new THREE.CircleGeometry(2.8, 24);
            const vortexMat = new THREE.MeshBasicMaterial({
                color: p.color,
                transparent: true,
                opacity: 0.45,
                side: THREE.DoubleSide
            });
            const vortex = new THREE.Mesh(vortexGeo, vortexMat);
            vortex.position.y = 4;
            portalGroup.add(vortex);

            // Pedestal base
            const baseGeo = new THREE.CylinderGeometry(4, 4.5, 0.8, 16);
            const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
            const base = new THREE.Mesh(baseGeo, baseMat);
            base.position.y = 0.4;
            portalGroup.add(base);

            portalGroup.position.set(p.x, 0, p.z);
            this.scene.add(portalGroup);

            this.interactiveZones.push({
                id: p.id,
                name: p.name,
                x: p.x,
                z: p.z,
                radius: 5.5,
                desc: p.desc,
                mesh: portalGroup,
                ring: ring,
                vortex: vortex
            });
        });
    }

    buildNPCWiseman() {
        const npcGroup = new THREE.Group();

        // Body Sphere (Robot / Wiseman Spirit)
        const bodyGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xd97706,
            emissiveIntensity: 0.5,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 2.6;
        npcGroup.add(body);

        // Halo Ring
        const haloGeo = new THREE.TorusGeometry(1.6, 0.15, 8, 24);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 3.6;
        npcGroup.add(halo);

        npcGroup.position.set(6, 0, 6);
        this.scene.add(npcGroup);
        this.npcWiseman = npcGroup;

        this.interactiveZones.push({
            id: "npc-wiseman",
            name: "Guru AI ZuperWiseman",
            x: 6,
            z: 6,
            radius: 4,
            desc: "Panduan Misi Harian & Tips Belajar",
            mesh: npcGroup
        });
    }

    buildPlayerAvatar() {
        this.playerMesh = this.createAvatarMesh(this.playerConfig);
        this.playerMesh.position.set(this.playerPos.x, this.playerPos.y, this.playerPos.z);
        this.scene.add(this.playerMesh);
    }

    createAvatarMesh(config) {
        const avatarGroup = new THREE.Group();

        // 1. Torso
        const torsoGeo = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.5, 0.8, 4, 8) : new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12);
        const torsoMat = new THREE.MeshStandardMaterial({
            color: config.color || '#6366f1',
            roughness: 0.4
        });
        const torso = new THREE.Mesh(torsoGeo, torsoMat);
        torso.position.y = 1.0;
        torso.castShadow = true;
        avatarGroup.add(torso);

        // 2. Head
        const headGeo = new THREE.SphereGeometry(0.42, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.85;
        head.castShadow = true;
        avatarGroup.add(head);

        // 3. Eyes / Visor
        const visorGeo = new THREE.BoxGeometry(0.45, 0.15, 0.2);
        const visorMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.8 });
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.position.set(0, 1.9, 0.35);
        avatarGroup.add(visor);

        // 4. Hat Customization
        if (config.hat === "crown") {
            const crownGeo = new THREE.CylinderGeometry(0.48, 0.38, 0.3, 5);
            const crownMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
            const crown = new THREE.Mesh(crownGeo, crownMat);
            crown.position.y = 2.3;
            avatarGroup.add(crown);
        } else if (config.hat === "wizard") {
            const wizGeo = new THREE.ConeGeometry(0.5, 1.1, 8);
            const wizMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.5 });
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
            // Student Cap
            const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.12, 12);
            const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
            const cap = new THREE.Mesh(capGeo, capMat);
            cap.position.y = 2.25;
            avatarGroup.add(cap);
        }

        // 5. Cape Customization
        if (config.cape && config.cape !== "none") {
            const capeGeo = new THREE.PlaneGeometry(0.8, 1.3);
            const capeMat = new THREE.MeshStandardMaterial({ color: 0xd946ef, side: THREE.DoubleSide });
            const cape = new THREE.Mesh(capeGeo, capeMat);
            cape.position.set(0, 1.0, -0.45);
            cape.rotation.x = 0.15;
            avatarGroup.add(cape);
        }

        avatarGroup.userData = { torso, head };
        return avatarGroup;
    }

    updatePlayerCustomization(config) {
        this.playerConfig = { ...this.playerConfig, ...config };
        if (this.playerMesh) {
            this.scene.remove(this.playerMesh);
        }
        this.buildPlayerAvatar();
    }

    // Multiplayer: Update or Spawn Other Players
    syncOtherPlayers(playersList) {
        const activeIds = new Set();

        playersList.forEach(p => {
            if (p.student_name === this.playerConfig.name) return; // skip self

            activeIds.add(p.student_name);

            if (!this.otherPlayers.has(p.student_name)) {
                // Spawn new avatar
                const otherMesh = this.createAvatarMesh({
                    color: p.avatar_color || '#10b981',
                    hat: p.avatar_hat || 'cap',
                    cape: p.avatar_cape || 'none'
                });
                otherMesh.position.set(p.pos_x || 0, 0.8, p.pos_z || 0);
                this.scene.add(otherMesh);
                this.otherPlayers.set(p.student_name, {
                    mesh: otherMesh,
                    targetX: p.pos_x || 0,
                    targetZ: p.pos_z || 0
                });
            } else {
                // Update target position for smooth lerp
                const entry = this.otherPlayers.get(p.student_name);
                entry.targetX = p.pos_x || 0;
                entry.targetZ = p.pos_z || 0;
            }
        });

        // Despawn departed players
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

        // Touch Joystick Integration Hook
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
        // Read Keyboard
        let kX = 0;
        let kZ = 0;
        if (this.keys["w"] || this.keys["arrowup"]) kZ -= 1;
        if (this.keys["s"] || this.keys["arrowdown"]) kZ += 1;
        if (this.keys["a"] || this.keys["arrowleft"]) kX -= 1;
        if (this.keys["d"] || this.keys["arrowright"]) kX += 1;

        // Combine with Touch Joystick
        const inputX = kX !== 0 ? kX : this.moveInput.x;
        const inputZ = kZ !== 0 ? kZ : this.moveInput.z;

        const speed = 12.0;
        if (inputX !== 0 || inputZ !== 0) {
            const length = Math.sqrt(inputX * inputX + inputZ * inputZ);
            const normX = inputX / length;
            const normZ = inputZ / length;

            this.playerPos.x += normX * speed * delta;
            this.playerPos.z += normZ * speed * delta;

            // Restrict inside island bounds (radius 36)
            const distFromCenter = Math.sqrt(this.playerPos.x * this.playerPos.x + this.playerPos.z * this.playerPos.z);
            if (distFromCenter > 36) {
                this.playerPos.x = (this.playerPos.x / distFromCenter) * 36;
                this.playerPos.z = (this.playerPos.z / distFromCenter) * 36;
            }

            // Smooth rotation towards movement direction
            const targetAngle = Math.atan2(normX, normZ);
            this.playerMesh.rotation.y = targetAngle;

            // Bobbing walking animation
            this.walkCycle += delta * 15;
            this.playerMesh.position.y = 0.8 + Math.abs(Math.sin(this.walkCycle)) * 0.2;
        } else {
            this.playerMesh.position.y = 0.8;
        }

        this.playerMesh.position.x = this.playerPos.x;
        this.playerMesh.position.z = this.playerPos.z;

        // Third-person Follow Camera with smooth lerp
        const targetCamX = this.playerPos.x;
        const targetCamY = this.playerPos.y + 10;
        const targetCamZ = this.playerPos.z + 16;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.1;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.1;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.1;
        this.camera.lookAt(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
    }

    checkInteractiveZones() {
        let closestZone = null;
        let minDistance = Infinity;

        this.interactiveZones.forEach(z => {
            const dx = this.playerPos.x - z.x;
            const dz = this.playerPos.z - z.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < z.radius) {
                if (dist < minDistance) {
                    minDistance = dist;
                    closestZone = z;
                }
            }
        });

        if (closestZone !== this.activeZone) {
            this.activeZone = closestZone;
            const promptEl = document.getElementById("zone-interaction-prompt");
            if (promptEl) {
                if (this.activeZone) {
                    promptEl.classList.remove("hidden");
                    promptEl.innerHTML = `
                        <div class="glass-panel px-5 py-2.5 rounded-2xl border border-indigo-400 text-center animate-bounce shadow-xl">
                            <span class="text-amber-300 font-black text-sm">Tekan [E] atau Ketuk</span>: Masuk ke <b>${this.activeZone.name}</b>
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

        // 1. Player Movement & Follow Cam
        if (this.playerMesh) {
            this.updatePlayerMovement(delta);
        }

        // 2. Zone check
        this.checkInteractiveZones();

        // 3. Ambient Animations
        if (this.centerCrystal) {
            this.centerCrystal.rotation.y += delta * 0.8;
            this.centerCrystal.position.y = 4 + Math.sin(this.clock.getElapsedTime() * 2) * 0.3;
        }

        if (this.npcWiseman) {
            this.npcWiseman.position.y = Math.sin(this.clock.getElapsedTime() * 2.5) * 0.25;
            this.npcWiseman.rotation.y += delta * 0.5;
        }

        this.interactiveZones.forEach(z => {
            if (z.ring) z.ring.rotation.z += delta * 1.2;
            if (z.vortex) z.vortex.rotation.z -= delta * 0.8;
        });

        // 4. Smooth lerp other player avatars
        for (let entry of this.otherPlayers.values()) {
            entry.mesh.position.x += (entry.targetX - entry.mesh.position.x) * 0.15;
            entry.mesh.position.z += (entry.targetZ - entry.mesh.position.z) * 0.15;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.ZuperWorld3D = ZuperWorld3D;

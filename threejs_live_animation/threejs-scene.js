class ThreeJSScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.lights = {};
        this.objects = {};
        this.animationId = null;
        this.elapsedTime = 0;
        
        // Initialize animation parameters
        this.initializeAnimationParams();
        
        this.init();
    }

    initializeAnimationParams() {
        // Initialize animation parameters directly here to avoid circular dependencies
        this.animationParams = {
            jrj3D: {
                layerCount: 5,
                layerSpacing: 2,
                rotationSpeed: 0.005,
                depthEffect: 0.3,
                lightingIntensity: 1.2
            },
            texturePortal: {
                portalSize: 8,
                particleCount: 500,
                rotationSpeed: 0.01,
                waveIntensity: 1.5,
                colorShift: true
            },
            aggregatron: {
                cubeCount: 8,
                cubeSize: 2,
                orbitRadius: 10,
                rotationSpeed: 0.02,
                pulseIntensity: 2,
                energyBeams: 12,
                coreScale: 1.5
            },
            aggregatronGlow: {
                logoSize: 8,
                floatAmplitude: 0.5,
                floatSpeed: 0.8,
                glowIntensity: 1.5,
                particleCount: 100,
                rotationSpeed: 0.003
            }
        };
    }

    init() {
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupObjects();
        this.addEventListeners();
        this.animate();
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    setupLights() {
        // Ambient light
        this.lights.ambient = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(this.lights.ambient);

        // Main directional light
        this.lights.main = new THREE.DirectionalLight(0xffffff, 1);
        this.lights.main.position.set(5, 5, 5);
        this.lights.main.castShadow = true;
        this.lights.main.shadow.mapSize.width = 2048;
        this.lights.main.shadow.mapSize.height = 2048;
        this.scene.add(this.lights.main);

        // Point lights for dynamic effects
        this.lights.point1 = new THREE.PointLight(0xff6b6b, 1, 100);
        this.lights.point1.position.set(-10, 0, 0);
        this.scene.add(this.lights.point1);

        this.lights.point2 = new THREE.PointLight(0x4ecdc4, 1, 100);
        this.lights.point2.position.set(10, 0, 0);
        this.scene.add(this.lights.point2);

        this.lights.point3 = new THREE.PointLight(0xffe66d, 1, 100);
        this.lights.point3.position.set(0, 10, 0);
        this.scene.add(this.lights.point3);
    }

    setupObjects() {
        // Create different object groups for different animation modes
        this.objects.cubes = this.createCubeGrid();
        this.objects.sphere = this.createReactiveSphere();
        this.objects.particles = this.createParticleSystem();
        this.objects.waves = this.createWaveGeometry();
        this.objects.helix = this.createDNAHelix();
        this.objects.tunnel = this.createBassTunnel();
        this.objects.galaxy = this.createSpiralGalaxy();
        this.objects.tree = this.createFractalTree();
        this.objects.crystals = this.createCrystalFormation();
        this.objects.rings = this.createSoundRings();
        this.objects.bars = this.createFrequencyBars();
        this.objects.matrix = this.createMatrixRain();
        this.objects.plasma = this.createPlasmaField();
        this.objects.vortex = this.createVortexTunnel();
        this.objects.neural = this.createNeuralNetwork();
        this.objects.kaleidoscope = this.createKaleidoscope();
        this.objects.lightning = this.createLightningField();
        this.objects.ocean = this.createOceanWaves();
        this.objects.fractal = this.createFractalMandala();
        this.objects.spiral = this.createFibonacciSpiral();
        this.objects.aurora = this.createAuroraBorealis();
        this.objects.cityscape = this.createDigitalCityscape();
        this.objects.molecules = this.createMolecularDance();
        this.objects.tornado = this.createTornadoVortex();
        this.objects.cosmos = this.createCosmicNebula();
        this.objects.labyrinth = this.createDigitalLabyrinth();
        this.objects.waterfall = this.createDataWaterfall();
        this.objects.fire = this.createPlasmaFire();
        this.objects.ice = this.createCrystalIce();
        this.objects.desert = this.createDesertDunes();
        this.objects.volcano = this.createLavaEruption();
        this.objects.forest = this.createDigitalForest();
        this.objects.cyberpunk = this.createCyberpunkGrid();
        this.objects.retro = this.createRetroWave();
        this.objects.abstract = this.createAbstractFlow();
        this.objects.mechanical = this.createMechanicalGears();
        this.objects.underwater = this.createUnderwaterWorld();
        this.objects.constellation = this.createStarConstellation();
        this.objects.blackhole = this.createBlackHole();
        this.objects.prism = this.createLightPrism();
        this.objects.quantum = this.createQuantumField();
        this.objects.ecosystem = this.createDigitalEcosystem();
        this.objects.texturePortal = this.createTexturePortal();
        this.objects.jrj3D = this.createJRJ3DGallery();
        this.objects.aggregatron = this.createAggregatronCore();
        this.objects.aggregatronGlow = this.createAggregatronGlow();

        // Hide all initially except cubes
        this.setAnimationMode('cubes');
    }

    createCubeGrid() {
        const group = new THREE.Group();
        const cubes = [];
        const gridSize = 8;
        const spacing = 2;

        for (let x = 0; x < gridSize; x++) {
            cubes[x] = [];
            for (let z = 0; z < gridSize; z++) {
                const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
                const material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL((x + z) / (gridSize * 2), 0.8, 0.5),
                    transparent: true,
                    opacity: 0.8
                });

                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    (x - gridSize / 2) * spacing,
                    0,
                    (z - gridSize / 2) * spacing
                );
                cube.castShadow = true;
                cube.receiveShadow = true;
                
                cubes[x][z] = cube;
                group.add(cube);
            }
        }

        group.userData.cubes = cubes;
        
        // Add slight angle for depth perception
        group.rotation.x = -Math.PI / 12; // 15 degrees downward tilt
        group.rotation.y = Math.PI / 24;  // 7.5 degrees side tilt
        
        this.scene.add(group);
        return group;
    }

    createReactiveSphere() {
        const group = new THREE.Group();
        
        // Main sphere
        const geometry = new THREE.IcosahedronGeometry(3, 2);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.7,
            wireframe: false
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        
        // Store original vertices for animation
        sphere.userData.originalVertices = geometry.attributes.position.array.slice();
        
        group.add(sphere);
        group.userData.mainSphere = sphere;

        // Wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
        group.add(wireframe);
        group.userData.wireframe = wireframe;

        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createParticleSystem() {
        const group = new THREE.Group();
        const particleCount = 2000;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a sphere
            const radius = Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random colors
            const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData.originalPositions = positions.slice();
        
        group.add(particles);
        group.userData.particles = particles;

        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createWaveGeometry() {
        const group = new THREE.Group();
        const width = 32;
        const height = 32;
        
        const geometry = new THREE.PlaneGeometry(20, 20, width - 1, height - 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            wireframe: false
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.userData.originalVertices = geometry.attributes.position.array.slice();
        plane.userData.width = width;
        plane.userData.height = height;
        
        group.add(plane);
        group.userData.plane = plane;

        // Add wireframe version
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
        wireframe.rotation.x = -Math.PI / 2;
        group.add(wireframe);
        group.userData.wireframe = wireframe;

        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createDNAHelix() {
        const group = new THREE.Group();
        const helixData = [];
        const segmentCount = 100;
        
        // Create two intertwining helices
        for (let strand = 0; strand < 2; strand++) {
            const strandGroup = new THREE.Group();
            const spheres = [];
            
            for (let i = 0; i < segmentCount; i++) {
                const geometry = new THREE.SphereGeometry(0.2, 10, 8);
                const material = new THREE.MeshPhongMaterial({
                    color: strand === 0 ? 0x4ecdc4 : 0xff6b6b,
                    transparent: true,
                    opacity: 0.9
                });
                
                const sphere = new THREE.Mesh(geometry, material);
                
                // Position along helix
                const t = (i / segmentCount) * Math.PI * 8;
                const radius = 3;
                const height = 10;
                
                sphere.position.x = Math.cos(t + strand * Math.PI) * radius;
                sphere.position.z = Math.sin(t + strand * Math.PI) * radius;
                sphere.position.y = (i / segmentCount - 0.5) * height;
                
                sphere.userData.originalPosition = sphere.position.clone();
                sphere.userData.index = i;
                sphere.userData.strand = strand;
                
                spheres.push(sphere);
                strandGroup.add(sphere);
            }
            
            strandGroup.userData.spheres = spheres;
            group.add(strandGroup);
        }
        
        // Add connecting bonds between strands
        const bondGroup = new THREE.Group();
        const bonds = [];
        
        for (let i = 0; i < segmentCount; i += 3) {
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, 6);
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5
            });
            
            const bond = new THREE.Mesh(geometry, material);
            bond.rotation.z = Math.PI / 2;
            bond.position.y = (i / segmentCount - 0.5) * 10;
            bond.userData.index = i;
            
            bonds.push(bond);
            bondGroup.add(bond);
        }
        
        group.add(bondGroup);
        group.userData.strands = group.children.slice(0, 2);
        group.userData.bonds = bonds;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createBassTunnel() {
        const group = new THREE.Group();
        const segmentCount = 50;
        const rings = [];
        
        for (let i = 0; i < segmentCount; i++) {
            const ringGroup = new THREE.Group();
            const ringSegments = 16;
            
            for (let j = 0; j < ringSegments; j++) {
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(j / ringSegments, 0.8, 0.5),
                    transparent: true,
                    opacity: 0.7
                });
                
                const cube = new THREE.Mesh(geometry, material);
                
                const angle = (j / ringSegments) * Math.PI * 2;
                const radius = 5;
                
                cube.position.x = Math.cos(angle) * radius;
                cube.position.z = Math.sin(angle) * radius;
                cube.position.y = 0;
                
                cube.userData.originalPosition = cube.position.clone();
                cube.userData.angle = angle;
                cube.userData.segmentIndex = j;
                
                ringGroup.add(cube);
            }
            
            ringGroup.position.y = (i - segmentCount / 2) * 0.8;
            ringGroup.userData.ringIndex = i;
            ringGroup.userData.cubes = ringGroup.children;
            
            rings.push(ringGroup);
            group.add(ringGroup);
        }
        
        group.userData.rings = rings;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createSpiralGalaxy() {
        const group = new THREE.Group();
        const armCount = 4;
        const particleCount = 1000;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const armIndex = i % armCount;
            const t = (i / particleCount) * Math.PI * 4;
            const armOffset = (armIndex / armCount) * Math.PI * 2;
            
            const radius = (i / particleCount) * 8 + Math.random() * 2;
            const angle = t + armOffset + Math.sin(t * 2) * 0.3;
            
            const i3 = i * 3;
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = (Math.random() - 0.5) * 2;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            // Color based on arm and distance from center
            const hue = (armIndex / armCount) + (radius / 10);
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.originalPositions = positions.slice();
        particles.userData.originalColors = colors.slice();
        
        group.add(particles);
        group.userData.particles = particles;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createFractalTree() {
        const group = new THREE.Group();
        
        const createBranch = (startPos, direction, length, depth, maxDepth) => {
            if (depth >= maxDepth) return;
            
            const geometry = new THREE.CylinderGeometry(
                Math.max(0.05, 0.3 - depth * 0.05),
                Math.max(0.1, 0.4 - depth * 0.05),
                length,
                8
            );
            
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(0.3 - depth * 0.05, 0.8, 0.4 + depth * 0.1),
                transparent: true,
                opacity: 0.8
            });
            
            const branch = new THREE.Mesh(geometry, material);
            
            // Position and orient the branch
            const endPos = startPos.clone().add(direction.clone().multiplyScalar(length));
            branch.position.copy(startPos.clone().add(endPos).multiplyScalar(0.5));
            branch.lookAt(endPos);
            branch.rotateX(Math.PI / 2);
            
            branch.userData.depth = depth;
            branch.userData.originalScale = branch.scale.clone();
            
            group.add(branch);
            
            // Create child branches
            if (depth < maxDepth - 1) {
                const branchCount = Math.max(2, 4 - depth);
                for (let i = 0; i < branchCount; i++) {
                    const angle = (i / branchCount) * Math.PI * 2 + Math.random() * 0.5;
                    const newDirection = new THREE.Vector3(
                        Math.cos(angle) * 0.6 + direction.x * 0.4,
                        direction.y * 0.8 + Math.random() * 0.4,
                        Math.sin(angle) * 0.6 + direction.z * 0.4
                    ).normalize();
                    
                    const newLength = length * (0.7 + Math.random() * 0.2);
                    createBranch(endPos, newDirection, newLength, depth + 1, maxDepth);
                }
            }
        };
        
        // Create main trunk and branches
        createBranch(
            new THREE.Vector3(0, -3, 0),
            new THREE.Vector3(0, 1, 0),
            2,
            0,
            5
        );
        
        group.userData.branches = group.children;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createCrystalFormation() {
        const group = new THREE.Group();
        const crystalCount = 12;
        const crystals = [];
        
        for (let i = 0; i < crystalCount; i++) {
            // Create various crystal shapes
            const shapeType = Math.floor(Math.random() * 3);
            let geometry;
            
            switch (shapeType) {
                case 0: // Octahedron
                    geometry = new THREE.OctahedronGeometry(1 + Math.random());
                    break;
                case 1: // Tetrahedron
                    geometry = new THREE.TetrahedronGeometry(1 + Math.random());
                    break;
                case 2: // Icosahedron
                    geometry = new THREE.IcosahedronGeometry(1 + Math.random(), 1);
                    break;
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                transparent: true,
                opacity: 0.7,
                wireframe: false
            });
            
            const crystal = new THREE.Mesh(geometry, material);
            
            // Position crystals in a cluster
            const angle = (i / crystalCount) * Math.PI * 2;
            const radius = 3 + Math.random() * 4;
            const height = (Math.random() - 0.5) * 6;
            
            crystal.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            crystal.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            crystal.userData.originalScale = crystal.scale.clone();
            crystal.userData.originalPosition = crystal.position.clone();
            crystal.userData.rotationSpeed = (Math.random() - 0.5) * 0.02;
            
            crystals.push(crystal);
            group.add(crystal);
        }
        
        group.userData.crystals = crystals;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createSoundRings() {
        const group = new THREE.Group();
        const ringCount = 15;
        const rings = [];
        
        for (let i = 0; i < ringCount; i++) {
            const geometry = new THREE.RingGeometry(0.1, 1, 32);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / ringCount, 0.8, 0.5),
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(geometry, material);
            ring.position.y = (i - ringCount / 2) * 0.5;
            ring.userData.originalScale = 1;
            ring.userData.ringIndex = i;
            
            rings.push(ring);
            group.add(ring);
        }
        
        group.userData.rings = rings;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createFrequencyBars() {
        const group = new THREE.Group();
        const barCount = 64;
        const bars = [];
        
        for (let i = 0; i < barCount; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 1, 0.3);
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(i / barCount, 0.8, 0.5),
                transparent: true,
                opacity: 0.8
            });
            
            const bar = new THREE.Mesh(geometry, material);
            
            // Arrange bars in a circle
            const angle = (i / barCount) * Math.PI * 2;
            const radius = 6;
            
            bar.position.x = Math.cos(angle) * radius;
            bar.position.z = Math.sin(angle) * radius;
            bar.position.y = 0;
            
            bar.userData.originalScale = bar.scale.clone();
            bar.userData.barIndex = i;
            
            bars.push(bar);
            group.add(bar);
        }
        
        group.userData.bars = bars;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createMatrixRain() {
        const group = new THREE.Group();
        const columnsPerSide = 15;
        const layers = 4;
        const drops = [];
        
        // Create matrix rain around the viewer in a 3D space
        for (let layer = 0; layer < layers; layer++) {
            const radius = 8 + layer * 3;
            const angleStep = (Math.PI * 2) / columnsPerSide;
            
            for (let col = 0; col < columnsPerSide; col++) {
                const columnGroup = new THREE.Group();
                const columnDrops = [];
                const angle = col * angleStep;
                
                for (let row = 0; row < 25; row++) {
                    const geometry = new THREE.PlaneGeometry(0.4, 0.6);
                    const material = new THREE.MeshBasicMaterial({
                        color: 0x00ff00,
                        transparent: true,
                        opacity: Math.random() * 0.7 + 0.1,
                        side: THREE.DoubleSide
                    });
                    
                    const drop = new THREE.Mesh(geometry, material);
                    
                    // Position in cylindrical coordinates
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const y = (row - 12) * 0.7 + Math.random() * 2;
                    
                    drop.position.set(x, y, z);
                    
                    // Make the plane face inward toward the center
                    drop.lookAt(0, y, 0);
                    
                    drop.userData.fallSpeed = Math.random() * 0.08 + 0.03;
                    drop.userData.columnIndex = col;
                    drop.userData.rowIndex = row;
                    drop.userData.layer = layer;
                    drop.userData.angle = angle;
                    drop.userData.radius = radius;
                    
                    columnDrops.push(drop);
                    columnGroup.add(drop);
                }
                
                columnGroup.userData.drops = columnDrops;
                columnGroup.userData.angle = angle;
                columnGroup.userData.radius = radius;
                drops.push(columnGroup);
                group.add(columnGroup);
            }
        }
        
        group.userData.columns = drops;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createPlasmaField() {
        const group = new THREE.Group();
        const gridSize = 32;
        const spacing = 0.5;
        
        const geometry = new THREE.PlaneGeometry(gridSize * spacing, gridSize * spacing, gridSize - 1, gridSize - 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                audioLevel: { value: 0.0 },
                dominantFreq: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Audio-reactive wave displacement
                    float wave = sin(pos.x * 0.2 + time) * sin(pos.y * 0.2 + time) * audioLevel;
                    pos.z += wave * 2.0;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                uniform float dominantFreq;
                
                void main() {
                    vec2 pos = vUv * 10.0;
                    float plasma = sin(pos.x + time) + sin(pos.y + time) + 
                                   sin(pos.x + pos.y + time) + sin(sqrt(pos.x * pos.x + pos.y * pos.y) + time);
                    
                    plasma += audioLevel * 3.0;
                    
                    vec3 color = vec3(
                        sin(plasma + dominantFreq) * 0.5 + 0.5,
                        sin(plasma + dominantFreq + 2.0) * 0.5 + 0.5,
                        sin(plasma + dominantFreq + 4.0) * 0.5 + 0.5
                    );
                    
                    gl_FragColor = vec4(color, 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        
        group.add(plane);
        group.userData.material = material;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createVortexTunnel() {
        const group = new THREE.Group();
        const spiralCount = 8;
        const particleCount = 800;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount) * Math.PI * 6;
            const spiral = i % spiralCount;
            const spiralOffset = (spiral / spiralCount) * Math.PI * 2;
            
            const radius = 2 + Math.sin(t * 0.5) * 3;
            const x = Math.cos(t + spiralOffset) * radius;
            const y = (i / particleCount - 0.5) * 20;
            const z = Math.sin(t + spiralOffset) * radius;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            const hue = (spiral / spiralCount + t * 0.1) % 1;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 2 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.originalPositions = positions.slice();
        particles.userData.originalColors = colors.slice();
        
        group.add(particles);
        group.userData.particles = particles;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createNeuralNetwork() {
        const group = new THREE.Group();
        const nodeCount = 50;
        const nodes = [];
        const connections = [];
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 10, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(geometry, material);
            const radius = 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            node.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            node.userData.originalPosition = node.position.clone();
            node.userData.pulsePhase = Math.random() * Math.PI * 2;
            
            nodes.push(node);
            group.add(node);
        }
        
        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() < 0.3) { // 30% connection probability
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    
                    positions[0] = nodes[i].position.x;
                    positions[1] = nodes[i].position.y;
                    positions[2] = nodes[i].position.z;
                    positions[3] = nodes[j].position.x;
                    positions[4] = nodes[j].position.y;
                    positions[5] = nodes[j].position.z;
                    
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    
                    const material = new THREE.LineBasicMaterial({
                        color: 0x0088ff,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const line = new THREE.Line(geometry, material);
                    line.userData.nodeA = nodes[i];
                    line.userData.nodeB = nodes[j];
                    
                    connections.push(line);
                    group.add(line);
                }
            }
        }
        
        group.userData.nodes = nodes;
        group.userData.connections = connections;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createKaleidoscope() {
        const group = new THREE.Group();
        const segments = 6;
        
        for (let i = 0; i < segments; i++) {
            const segmentGroup = new THREE.Group();
            const angle = (i / segments) * Math.PI * 2;
            
            // Create geometric shapes for each segment
            const shapes = [];
            for (let j = 0; j < 20; j++) {
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL((i / segments + j * 0.1) % 1, 0.8, 0.6),
                    transparent: true,
                    opacity: 0.7
                });
                
                const cube = new THREE.Mesh(geometry, material);
                const radius = 3 + j * 0.3;
                cube.position.set(
                    Math.cos(angle + j * 0.2) * radius,
                    (j - 10) * 0.5,
                    Math.sin(angle + j * 0.2) * radius
                );
                
                cube.userData.originalPosition = cube.position.clone();
                cube.userData.segmentIndex = i;
                cube.userData.shapeIndex = j;
                
                shapes.push(cube);
                segmentGroup.add(cube);
            }
            
            segmentGroup.userData.shapes = shapes;
            segmentGroup.userData.angle = angle;
            group.add(segmentGroup);
        }
        
        group.userData.segments = group.children;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createLightningField() {
        const group = new THREE.Group();
        const boltCount = 12;
        const bolts = [];
        
        for (let i = 0; i < boltCount; i++) {
            const boltGroup = new THREE.Group();
            const segments = 20;
            const boltSegments = [];
            
            let currentPos = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                5,
                (Math.random() - 0.5) * 10
            );
            
            for (let j = 0; j < segments; j++) {
                const geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 4);
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                
                const segment = new THREE.Mesh(geometry, material);
                
                const nextPos = currentPos.clone();
                nextPos.y -= 0.5;
                nextPos.x += (Math.random() - 0.5) * 0.8;
                nextPos.z += (Math.random() - 0.5) * 0.8;
                
                segment.position.copy(currentPos);
                segment.lookAt(nextPos);
                
                segment.userData.originalPosition = segment.position.clone();
                segment.userData.segmentIndex = j;
                segment.userData.boltIndex = i;
                
                boltSegments.push(segment);
                boltGroup.add(segment);
                
                currentPos = nextPos;
            }
            
            boltGroup.userData.segments = boltSegments;
            boltGroup.userData.flickerPhase = Math.random() * Math.PI * 2;
            bolts.push(boltGroup);
            group.add(boltGroup);
        }
        
        group.userData.bolts = bolts;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createOceanWaves() {
        const group = new THREE.Group();
        const waveCount = 64;
        const waves = [];
        
        // Create main wave surface
        const geometry = new THREE.PlaneGeometry(20, 20, waveCount - 1, waveCount - 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x0088aa,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            side: THREE.DoubleSide
        });
        
        const waveSurface = new THREE.Mesh(geometry, material);
        waveSurface.rotation.x = -Math.PI / 2;
        waveSurface.position.y = -2;
        
        const vertices = geometry.attributes.position.array;
        const originalVertices = new Float32Array(vertices);
        
        waveSurface.userData.originalVertices = originalVertices;
        
        group.add(waveSurface);
        
        // Create foam particles
        const foamGeometry = new THREE.BufferGeometry();
        const foamCount = 200;
        const foamPositions = new Float32Array(foamCount * 3);
        const foamColors = new Float32Array(foamCount * 3);
        
        for (let i = 0; i < foamCount; i++) {
            foamPositions[i * 3] = (Math.random() - 0.5) * 20;
            foamPositions[i * 3 + 1] = -1.5 + Math.random() * 0.5;
            foamPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            foamColors[i * 3] = 1;
            foamColors[i * 3 + 1] = 1;
            foamColors[i * 3 + 2] = 1;
        }
        
        foamGeometry.setAttribute('position', new THREE.BufferAttribute(foamPositions, 3));
        foamGeometry.setAttribute('color', new THREE.BufferAttribute(foamColors, 3));
        
        const foamMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const foam = new THREE.Points(foamGeometry, foamMaterial);
        foam.userData.originalPositions = foamPositions.slice();
        
        group.add(foam);
        group.userData.waveSurface = waveSurface;
        group.userData.foam = foam;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createFractalMandala() {
        const group = new THREE.Group();
        const iterations = 3; // Reduced from 5 to 3
        const shapes = [];
        
        function createFractalLayer(radius, depth, parentAngle = 0) {
            if (depth <= 0) return;
            
            const segmentCount = Math.max(4, 8 - depth); // Fewer segments for deeper levels
            for (let i = 0; i < segmentCount; i++) {
                const angle = (i / segmentCount) * Math.PI * 2 + parentAngle;
                
                const geometry = new THREE.RingGeometry(radius * 0.8, radius, 4); // Reduced segments
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL((depth / iterations + i * 0.1) % 1, 0.8, 0.6),
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                
                const ring = new THREE.Mesh(geometry, material);
                ring.position.set(
                    Math.cos(angle) * radius * 2,
                    depth * 0.5,
                    Math.sin(angle) * radius * 2
                );
                ring.rotation.x = angle;
                
                ring.userData.depth = depth;
                ring.userData.angle = angle;
                ring.userData.baseRadius = radius;
                ring.userData.segmentIndex = i;
                
                shapes.push(ring);
                group.add(ring);
                
                // Recursive fractal generation - only for first 2 levels
                if (depth > 1 && depth <= 2) {
                    createFractalLayer(radius * 0.6, depth - 1, angle + Math.PI / 8);
                }
            }
        }
        
        createFractalLayer(2, iterations);
        group.userData.shapes = shapes;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createFibonacciSpiral() {
        const group = new THREE.Group();
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const theta = i * 2 * Math.PI / goldenRatio;
            const radius = Math.sqrt(i) * 0.5;
            
            positions[i * 3] = Math.cos(theta) * radius;
            positions[i * 3 + 1] = Math.sin(theta) * radius;
            positions[i * 3 + 2] = (i / particleCount - 0.5) * 10;
            
            const hue = (i / particleCount + theta * 0.1) % 1;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = 0.5 + (i / particleCount) * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.originalPositions = positions.slice();
        particles.userData.originalColors = colors.slice();
        
        group.add(particles);
        group.userData.particles = particles;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createAuroraBorealis() {
        const group = new THREE.Group();
        const layerCount = 4;
        const waves = [];
        
        for (let layer = 0; layer < layerCount; layer++) {
            const waveCount = 12;
            const layerGroup = new THREE.Group();
            const layerWaves = [];
            
            for (let i = 0; i < waveCount; i++) {
                const geometry = new THREE.PlaneGeometry(15, 3, 20, 5);
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0.0 },
                        audioLevel: { value: 0.0 },
                        layer: { value: layer }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        uniform float time;
                        uniform float audioLevel;
                        uniform float layer;
                        
                        void main() {
                            vUv = uv;
                            vec3 pos = position;
                            
                            float wave = sin(pos.x * 0.5 + time + layer) * (1.0 + audioLevel);
                            pos.y += wave;
                            pos.z += sin(pos.x * 0.3 + time) * audioLevel * 0.5;
                            
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        varying vec2 vUv;
                        uniform float time;
                        uniform float audioLevel;
                        uniform float layer;
                        
                        void main() {
                            vec3 color1 = vec3(0.1, 0.8, 0.3); // Green
                            vec3 color2 = vec3(0.8, 0.2, 0.8); // Purple
                            vec3 color3 = vec3(0.2, 0.6, 1.0); // Blue
                            
                            float gradient = vUv.y;
                            float shimmer = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
                            
                            vec3 color = mix(color1, color2, gradient);
                            color = mix(color, color3, shimmer * audioLevel);
                            
                            float alpha = (1.0 - gradient) * (0.6 - layer * 0.1) * (1.0 + audioLevel);
                            
                            gl_FragColor = vec4(color, alpha);
                        }
                    `,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide
                });
                
                const wave = new THREE.Mesh(geometry, material);
                wave.position.set(
                    (i - waveCount / 2) * 1.5,
                    5 + layer * 2,
                    -layer * 3
                );
                wave.rotation.x = -Math.PI / 6;
                
                layerWaves.push(wave);
                layerGroup.add(wave);
            }
            
            layerGroup.userData.waves = layerWaves;
            layerGroup.userData.layer = layer;
            waves.push(layerGroup);
            group.add(layerGroup);
        }
        
        group.userData.layers = waves;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createDigitalCityscape() {
        const group = new THREE.Group();
        const buildingCount = 50;
        const buildings = [];
        
        for (let i = 0; i < buildingCount; i++) {
            const width = 0.5 + Math.random() * 1.5;
            const depth = 0.5 + Math.random() * 1.5;
            const height = 2 + Math.random() * 13;
            
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.7, 0.3),
                transparent: true,
                opacity: 0.8
            });
            
            const building = new THREE.Mesh(geometry, material);
            building.position.set(
                (Math.random() - 0.5) * 30,
                height / 2 - 8,
                (Math.random() - 0.5) * 30
            );
            
            // Add windows
            const windows = [];
            const windowCount = Math.floor(height / 2) * Math.floor(width * 2);
            for (let j = 0; j < windowCount; j++) {
                const windowGeometry = new THREE.PlaneGeometry(0.1, 0.1);
                const windowMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    transparent: true,
                    opacity: Math.random() > 0.7 ? 1 : 0
                });
                
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(
                    (Math.random() - 0.5) * width * 0.8,
                    (Math.random() - 0.5) * height * 0.8,
                    width / 2 + 0.01
                );
                
                windows.push(window);
                building.add(window);
            }
            
            building.userData.height = height;
            building.userData.windows = windows;
            building.userData.originalHeight = height;
            
            buildings.push(building);
            group.add(building);
        }
        
        group.userData.buildings = buildings;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createMolecularDance() {
        const group = new THREE.Group();
        const atomCount = 30;
        const atoms = [];
        const bonds = [];
        
        // Create atoms
        for (let i = 0; i < atomCount; i++) {
            const atomSize = 0.2 + Math.random() * 0.3;
            const geometry = new THREE.SphereGeometry(atomSize, 8, 6);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                transparent: true,
                opacity: 0.8
            });
            
            const atom = new THREE.Mesh(geometry, material);
            atom.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            );
            
            atom.userData.originalPosition = atom.position.clone();
            atom.userData.vibrationPhase = Math.random() * Math.PI * 2;
            atom.userData.atomType = Math.floor(Math.random() * 4);
            
            atoms.push(atom);
            group.add(atom);
        }
        
        // Create bonds between nearby atoms
        for (let i = 0; i < atoms.length; i++) {
            for (let j = i + 1; j < atoms.length; j++) {
                const distance = atoms[i].position.distanceTo(atoms[j].position);
                if (distance < 4 && Math.random() < 0.3) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    
                    positions[0] = atoms[i].position.x;
                    positions[1] = atoms[i].position.y;
                    positions[2] = atoms[i].position.z;
                    positions[3] = atoms[j].position.x;
                    positions[4] = atoms[j].position.y;
                    positions[5] = atoms[j].position.z;
                    
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    
                    const material = new THREE.LineBasicMaterial({
                        color: 0x888888,
                        transparent: true,
                        opacity: 0.5
                    });
                    
                    const bond = new THREE.Line(geometry, material);
                    bond.userData.atomA = atoms[i];
                    bond.userData.atomB = atoms[j];
                    
                    bonds.push(bond);
                    group.add(bond);
                }
            }
        }
        
        group.userData.atoms = atoms;
        group.userData.bonds = bonds;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createTornadoVortex() {
        const group = new THREE.Group();
        const particleCount = 1000;
        const spiralCount = 3;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const height = (i / particleCount) * 20 - 10;
            const radius = (1 - Math.abs(height) / 10) * 5;
            const angle = (i / particleCount) * Math.PI * 10;
            
            positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5);
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5);
            
            velocities[i * 3] = Math.random() - 0.5;
            velocities[i * 3 + 1] = Math.random() * 0.1;
            velocities[i * 3 + 2] = Math.random() - 0.5;
            
            const intensity = 1 - Math.abs(height) / 10;
            const color = new THREE.Color().setHSL(0.1, 0.8, 0.3 + intensity * 0.4);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.9
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.originalPositions = positions.slice();
        particles.userData.velocities = velocities;
        
        group.add(particles);
        group.userData.particles = particles;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createCosmicNebula() {
        const group = new THREE.Group();
        const starCount = 800;
        const nebulaLayers = 3;
        
        // Create stars
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 50;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            
            const temp = Math.random();
            const color = new THREE.Color().setHSL(0.6 + temp * 0.4, 0.7, 0.8);
            starColors[i * 3] = color.r;
            starColors[i * 3 + 1] = color.g;
            starColors[i * 3 + 2] = color.b;
            
            starSizes[i] = Math.random() * 3 + 1;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        group.add(stars);
        
        // Create nebula layers
        const nebulaGroups = [];
        for (let layer = 0; layer < nebulaLayers; layer++) {
            const nebulaGeometry = new THREE.SphereGeometry(15 + layer * 5, 16, 16);
            const nebulaMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    audioLevel: { value: 0.0 },
                    layer: { value: layer }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    void main() {
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vPosition;
                    uniform float time;
                    uniform float audioLevel;
                    uniform float layer;
                    
                    void main() {
                        float noise = sin(vPosition.x * 0.1 + time) * sin(vPosition.y * 0.1 + time) * sin(vPosition.z * 0.1 + time);
                        noise += audioLevel * 2.0;
                        
                        vec3 color = vec3(0.8, 0.3, 0.9) + vec3(0.2, 0.4, 0.1) * sin(time + layer);
                        float alpha = max(0.0, noise * 0.3 * (1.0 - layer * 0.2));
                        
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending
            });
            
            const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
            nebulaGroups.push(nebula);
            group.add(nebula);
        }
        
        group.userData.stars = stars;
        group.userData.nebulas = nebulaGroups;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createDigitalLabyrinth() {
        const group = new THREE.Group();
        const mazeSize = 20;
        const walls = [];
        
        // Simple maze generation
        for (let x = 0; x < mazeSize; x++) {
            for (let z = 0; z < mazeSize; z++) {
                if (x === 0 || x === mazeSize - 1 || z === 0 || z === mazeSize - 1 || 
                    (x % 2 === 0 && z % 2 === 0 && Math.random() > 0.3)) {
                    
                    const geometry = new THREE.BoxGeometry(1, 3, 1);
                    const material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.8, 0.4),
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const wall = new THREE.Mesh(geometry, material);
                    wall.position.set(x - mazeSize / 2, 1.5, z - mazeSize / 2);
                    
                    // Add glow effect
                    const glowGeometry = new THREE.BoxGeometry(1.2, 3.2, 1.2);
                    const glowMaterial = new THREE.MeshBasicMaterial({
                        color: material.color.clone(),
                        transparent: true,
                        opacity: 0.2
                    });
                    
                    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                    wall.add(glow);
                    
                    wall.userData.x = x;
                    wall.userData.z = z;
                    wall.userData.glowMaterial = glowMaterial;
                    
                    walls.push(wall);
                    group.add(wall);
                }
            }
        }
        
        group.userData.walls = walls;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createDataWaterfall() {
        const group = new THREE.Group();
        const streamCount = 15;
        const streams = [];
        
        for (let i = 0; i < streamCount; i++) {
            const streamGroup = new THREE.Group();
            const dropletCount = 30;
            const droplets = [];
            
            for (let j = 0; j < dropletCount; j++) {
                const geometry = new THREE.SphereGeometry(0.3, 8, 6);
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.5 + i * 0.05, 0.8, 0.6),
                    transparent: true,
                    opacity: 0.9
                });
                
                const droplet = new THREE.Mesh(geometry, material);
                droplet.position.set(
                    (i - streamCount / 2) * 1.5,
                    10 - j * 0.7,
                    0
                );
                
                droplet.userData.streamIndex = i;
                droplet.userData.dropletIndex = j;
                droplet.userData.fallSpeed = 0.1 + Math.random() * 0.1;
                
                droplets.push(droplet);
                streamGroup.add(droplet);
            }
            
            streamGroup.userData.droplets = droplets;
            streams.push(streamGroup);
            group.add(streamGroup);
        }
        
        group.userData.streams = streams;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createPlasmaFire() {
        const group = new THREE.Group();
        const flameCount = 25;
        const flames = [];
        
        for (let i = 0; i < flameCount; i++) {
            const particleCount = 20;
            const flameGroup = new THREE.Group();
            const particles = [];
            
            for (let j = 0; j < particleCount; j++) {
                const geometry = new THREE.SphereGeometry(0.2 + j * 0.1, 6, 4);
                const hue = 0.1 - j * 0.02; // Red to yellow gradient
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(Math.max(0, hue), 0.9, 0.6),
                    transparent: true,
                    opacity: 0.8 - j * 0.03
                });
                
                const particle = new THREE.Mesh(geometry, material);
                particle.position.set(
                    (i - flameCount / 2) * 0.8 + (Math.random() - 0.5) * 0.5,
                    j * 0.4 - 5,
                    (Math.random() - 0.5) * 0.5
                );
                
                particle.userData.baseY = particle.position.y;
                particle.userData.flickerPhase = Math.random() * Math.PI * 2;
                particle.userData.particleIndex = j;
                
                particles.push(particle);
                flameGroup.add(particle);
            }
            
            flameGroup.userData.particles = particles;
            flames.push(flameGroup);
            group.add(flameGroup);
        }
        
        group.userData.flames = flames;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createCrystalIce() {
        const group = new THREE.Group();
        const crystalCount = 40;
        const crystals = [];
        
        for (let i = 0; i < crystalCount; i++) {
            const shape = Math.floor(Math.random() * 3);
            let geometry;
            
            switch (shape) {
                case 0:
                    geometry = new THREE.OctahedronGeometry(0.5 + Math.random());
                    break;
                case 1:
                    geometry = new THREE.TetrahedronGeometry(0.5 + Math.random());
                    break;
                case 2:
                    geometry = new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.7);
                    break;
            }
            
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.7, 0.8),
                transparent: true,
                opacity: 0.7,
                wireframe: Math.random() > 0.7
            });
            
            const crystal = new THREE.Mesh(geometry, material);
            crystal.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            
            crystal.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            crystal.userData.rotationSpeed = (Math.random() - 0.5) * 0.02;
            crystal.userData.originalScale = crystal.scale.clone();
            
            crystals.push(crystal);
            group.add(crystal);
        }
        
        group.userData.crystals = crystals;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createDesertDunes() {
        const group = new THREE.Group();
        const duneCount = 8;
        const dunes = [];
        
        for (let i = 0; i < duneCount; i++) {
            const geometry = new THREE.SphereGeometry(3 + Math.random() * 4, 16, 8, 0, Math.PI);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.1 + Math.random() * 0.05, 0.6, 0.5),
                transparent: true,
                opacity: 0.8,
                wireframe: false
            });
            
            const dune = new THREE.Mesh(geometry, material);
            dune.position.set(
                (i - duneCount / 2) * 6 + (Math.random() - 0.5) * 3,
                -2,
                (Math.random() - 0.5) * 10
            );
            dune.rotation.y = Math.random() * Math.PI * 2;
            
            dune.userData.originalPosition = dune.position.clone();
            
            dunes.push(dune);
            group.add(dune);
        }
        
        // Add sand particles
        const sandGeometry = new THREE.BufferGeometry();
        const sandCount = 600;
        const sandPositions = new Float32Array(sandCount * 3);
        const sandColors = new Float32Array(sandCount * 3);
        
        for (let i = 0; i < sandCount; i++) {
            sandPositions[i * 3] = (Math.random() - 0.5) * 40;
            sandPositions[i * 3 + 1] = Math.random() * 5;
            sandPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
            
            const color = new THREE.Color().setHSL(0.1, 0.4, 0.6 + Math.random() * 0.3);
            sandColors[i * 3] = color.r;
            sandColors[i * 3 + 1] = color.g;
            sandColors[i * 3 + 2] = color.b;
        }
        
        sandGeometry.setAttribute('position', new THREE.BufferAttribute(sandPositions, 3));
        sandGeometry.setAttribute('color', new THREE.BufferAttribute(sandColors, 3));
        
        const sandMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const sandParticles = new THREE.Points(sandGeometry, sandMaterial);
        sandParticles.userData.originalPositions = sandPositions.slice();
        
        group.add(sandParticles);
        group.userData.dunes = dunes;
        group.userData.sand = sandParticles;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createLavaEruption() {
        const group = new THREE.Group();
        const emberCount = 500;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(emberCount * 3);
        const colors = new Float32Array(emberCount * 3);
        const velocities = new Float32Array(emberCount * 3);
        const ages = new Float32Array(emberCount);
        
        for (let i = 0; i < emberCount; i++) {
            // Start at base - positioned lower for overhead view
            positions[i * 3] = (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = -6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
            
            // Random velocities upward
            velocities[i * 3] = (Math.random() - 0.5) * 0.2;
            velocities[i * 3 + 1] = Math.random() * 0.3 + 0.1;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
            
            ages[i] = Math.random();
            
            // Hot colors
            const temp = Math.random();
            const color = new THREE.Color().setHSL(temp * 0.1, 0.9, 0.5 + temp * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const embers = new THREE.Points(geometry, material);
        embers.userData.velocities = velocities;
        embers.userData.ages = ages;
        
        group.add(embers);
        group.userData.embers = embers;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createDigitalForest() {
        const group = new THREE.Group();
        const treeCount = 25;
        const trees = [];
        
        for (let i = 0; i < treeCount; i++) {
            const treeGroup = new THREE.Group();
            
            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4, 6);
            const trunkMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.08, 0.6, 0.3),
                transparent: true,
                opacity: 0.8
            });
            
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 0;
            treeGroup.add(trunk);
            
            // Leaves/Particles
            const leafCount = 30;
            const leaves = [];
            
            for (let j = 0; j < leafCount; j++) {
                const leafGeometry = new THREE.PlaneGeometry(0.3, 0.3);
                const leafMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.7, 0.5),
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                
                const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
                leaf.position.set(
                    (Math.random() - 0.5) * 4,
                    1 + Math.random() * 3,
                    (Math.random() - 0.5) * 4
                );
                
                leaf.userData.swayPhase = Math.random() * Math.PI * 2;
                leaf.userData.originalPosition = leaf.position.clone();
                
                leaves.push(leaf);
                treeGroup.add(leaf);
            }
            
            treeGroup.position.set(
                (Math.random() - 0.5) * 30,
                -2,
                (Math.random() - 0.5) * 30
            );
            
            treeGroup.userData.leaves = leaves;
            trees.push(treeGroup);
            group.add(treeGroup);
        }
        
        group.userData.trees = trees;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createCyberpunkGrid() {
        const group = new THREE.Group();
        const gridSize = 25;
        const lines = [];
        const dataStreams = [];
        
        // Create grid lines
        for (let i = 0; i <= gridSize; i++) {
            // Horizontal lines
            const hGeometry = new THREE.BufferGeometry();
            const hPositions = new Float32Array([
                -gridSize / 2, -2, i - gridSize / 2,
                gridSize / 2, -2, i - gridSize / 2
            ]);
            hGeometry.setAttribute('position', new THREE.BufferAttribute(hPositions, 3));
            
            const hMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(0.7, 0.8, 0.3 + Math.random() * 0.3),
                transparent: true,
                opacity: 0.6
            });
            
            const hLine = new THREE.Line(hGeometry, hMaterial);
            lines.push(hLine);
            group.add(hLine);
            
            // Vertical lines
            const vGeometry = new THREE.BufferGeometry();
            const vPositions = new Float32Array([
                i - gridSize / 2, -2, -gridSize / 2,
                i - gridSize / 2, -2, gridSize / 2
            ]);
            vGeometry.setAttribute('position', new THREE.BufferAttribute(vPositions, 3));
            
            const vMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(0.7, 0.8, 0.3 + Math.random() * 0.3),
                transparent: true,
                opacity: 0.6
            });
            
            const vLine = new THREE.Line(vGeometry, vMaterial);
            lines.push(vLine);
            group.add(vLine);
        }
        
        // Create data streams
        for (let i = 0; i < 20; i++) {
            const streamGeometry = new THREE.SphereGeometry(0.3, 8, 6);
            const streamMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.8
            });
            
            const stream = new THREE.Mesh(streamGeometry, streamMaterial);
            stream.position.set(
                (Math.random() - 0.5) * gridSize,
                -1.8,
                (Math.random() - 0.5) * gridSize
            );
            
            stream.userData.speed = Math.random() * 0.1 + 0.05;
            stream.userData.direction = Math.random() * Math.PI * 2;
            
            dataStreams.push(stream);
            group.add(stream);
        }
        
        group.userData.lines = lines;
        group.userData.dataStreams = dataStreams;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createRetroWave() {
        const group = new THREE.Group();
        
        // Create retro grid
        const gridGeometry = new THREE.PlaneGeometry(30, 30, 30, 30);
        const gridMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                audioLevel: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    float wave = sin(pos.x * 0.5 + time) * sin(pos.z * 0.5 + time * 0.8);
                    pos.y += wave * audioLevel * 2.0;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vec2 grid = abs(fract(vUv * 30.0) - 0.5);
                    float line = min(grid.x, grid.y);
                    
                    vec3 color = vec3(1.0, 0.2, 0.8); // Hot pink
                    vec3 bg = vec3(0.1, 0.0, 0.2); // Dark purple
                    
                    color = mix(color, bg, smoothstep(0.0, 0.1, line));
                    color *= (0.5 + audioLevel * 0.5);
                    
                    gl_FragColor = vec4(color, 0.8);
                }
            `,
            transparent: true,
            wireframe: false
        });
        
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -5;
        
        group.add(grid);
        
        // Create neon mountains
        const mountainCount = 5;
        const mountains = [];
        
        for (let i = 0; i < mountainCount; i++) {
            const mountainGeometry = new THREE.ConeGeometry(2 + i, 8 + i * 2, 6);
            const mountainMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.8, 0.8, 0.4),
                transparent: true,
                opacity: 0.6,
                wireframe: true
            });
            
            const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
            mountain.position.set(
                (i - mountainCount / 2) * 8,
                (8 + i * 2) / 2,
                -15 - i * 3
            );
            
            mountains.push(mountain);
            group.add(mountain);
        }
        
        group.userData.grid = grid;
        group.userData.mountains = mountains;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createAbstractFlow() {
        const group = new THREE.Group();
        const flowCount = 15;
        const flows = [];
        
        for (let i = 0; i < flowCount; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10),
                new THREE.Vector3(-3, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15),
                new THREE.Vector3(3, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15),
                new THREE.Vector3(10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
            ]);
            
            const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.2 + Math.random() * 0.3, 8, false);
            const tubeMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL((i / flowCount + Math.random() * 0.2) % 1, 0.8, 0.6),
                transparent: true,
                opacity: 0.7
            });
            
            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            tube.userData.flowIndex = i;
            tube.userData.morphPhase = Math.random() * Math.PI * 2;
            
            flows.push(tube);
            group.add(tube);
        }
        
        group.userData.flows = flows;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createMechanicalGears() {
        const group = new THREE.Group();
        const gearCount = 12;
        const gears = [];
        
        for (let i = 0; i < gearCount; i++) {
            const radius = 1 + Math.random() * 2;
            const teeth = Math.floor(8 + radius * 4);
            
            // Create gear shape
            const shape = new THREE.Shape();
            const toothHeight = 0.2;
            
            for (let j = 0; j < teeth; j++) {
                const angle1 = (j / teeth) * Math.PI * 2;
                const angle2 = ((j + 0.5) / teeth) * Math.PI * 2;
                const angle3 = ((j + 1) / teeth) * Math.PI * 2;
                
                if (j === 0) {
                    shape.moveTo(Math.cos(angle1) * radius, Math.sin(angle1) * radius);
                }
                
                shape.lineTo(Math.cos(angle1) * (radius + toothHeight), Math.sin(angle1) * (radius + toothHeight));
                shape.lineTo(Math.cos(angle2) * (radius + toothHeight), Math.sin(angle2) * (radius + toothHeight));
                shape.lineTo(Math.cos(angle3) * radius, Math.sin(angle3) * radius);
            }
            
            const extrudeSettings = {
                depth: 0.3,
                bevelEnabled: false
            };
            
            const gearGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const gearMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.1, 0.6, 0.4 + Math.random() * 0.2),
                transparent: true,
                opacity: 0.8
            });
            
            const gear = new THREE.Mesh(gearGeometry, gearMaterial);
            gear.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 20
            );
            
            gear.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            gear.userData.rotationSpeed = (Math.random() - 0.5) * 0.05;
            gear.userData.radius = radius;
            
            gears.push(gear);
            group.add(gear);
        }
        
        // Add steam particles
        const steamGeometry = new THREE.BufferGeometry();
        const steamCount = 150;
        const steamPositions = new Float32Array(steamCount * 3);
        const steamColors = new Float32Array(steamCount * 3);
        
        for (let i = 0; i < steamCount; i++) {
            steamPositions[i * 3] = (Math.random() - 0.5) * 20;
            steamPositions[i * 3 + 1] = Math.random() * 10;
            steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            const opacity = Math.random() * 0.5 + 0.3;
            steamColors[i * 3] = opacity;
            steamColors[i * 3 + 1] = opacity;
            steamColors[i * 3 + 2] = opacity;
        }
        
        steamGeometry.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
        steamGeometry.setAttribute('color', new THREE.BufferAttribute(steamColors, 3));
        
        const steamMaterial = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const steam = new THREE.Points(steamGeometry, steamMaterial);
        steam.userData.originalPositions = steamPositions.slice();
        
        group.add(steam);
        group.userData.gears = gears;
        group.userData.steam = steam;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createUnderwaterWorld() {
        const group = new THREE.Group();
        
        // Create water surface with caustics
        const waterGeometry = new THREE.PlaneGeometry(30, 30, 20, 20);
        const waterMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                audioLevel: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    float wave1 = sin(pos.x * 0.5 + time) * 0.5;
                    float wave2 = sin(pos.y * 0.3 + time * 1.2) * 0.3;
                    pos.z += (wave1 + wave2) * (1.0 + audioLevel);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vec2 caustic = sin(vUv * 10.0 + time * 2.0) * 0.5 + 0.5;
                    vec3 waterColor = vec3(0.0, 0.3 + caustic.x * 0.3, 0.8 + caustic.y * 0.2);
                    waterColor *= (0.7 + audioLevel * 0.3);
                    
                    gl_FragColor = vec4(waterColor, 0.8);
                }
            `,
            transparent: true
        });
        
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 8;
        group.add(water);
        
        // Create bubbles
        const bubbleGeometry = new THREE.BufferGeometry();
        const bubbleCount = 300;
        const bubblePositions = new Float32Array(bubbleCount * 3);
        const bubbleSizes = new Float32Array(bubbleCount);
        
        for (let i = 0; i < bubbleCount; i++) {
            bubblePositions[i * 3] = (Math.random() - 0.5) * 25;
            bubblePositions[i * 3 + 1] = Math.random() * 15 - 5;
            bubblePositions[i * 3 + 2] = (Math.random() - 0.5) * 25;
            bubbleSizes[i] = Math.random() * 0.3 + 0.1;
        }
        
        bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
        bubbleGeometry.setAttribute('size', new THREE.BufferAttribute(bubbleSizes, 1));
        
        const bubbleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            transparent: true,
            opacity: 0.6,
            color: 0xaaccff,
            sizeAttenuation: true
        });
        
        const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
        bubbles.userData.originalPositions = bubblePositions.slice();
        group.add(bubbles);
        
        group.userData.water = water;
        group.userData.bubbles = bubbles;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createStarConstellation() {
        const group = new THREE.Group();
        const starCount = 200;
        const stars = [];
        const connections = [];
        
        // Create stars
        for (let i = 0; i < starCount; i++) {
            const starGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 6, 4);
            const starMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.8, 0.9),
                transparent: true,
                opacity: 0.8 + Math.random() * 0.2
            });
            
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
            );
            
            star.userData.twinklePhase = Math.random() * Math.PI * 2;
            star.userData.baseOpacity = star.material.opacity;
            
            stars.push(star);
            group.add(star);
        }
        
        // Create connections between nearby stars
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const distance = stars[i].position.distanceTo(stars[j].position);
                if (distance < 8 && Math.random() < 0.1) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    
                    positions[0] = stars[i].position.x;
                    positions[1] = stars[i].position.y;
                    positions[2] = stars[i].position.z;
                    positions[3] = stars[j].position.x;
                    positions[4] = stars[j].position.y;
                    positions[5] = stars[j].position.z;
                    
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    
                    const material = new THREE.LineBasicMaterial({
                        color: 0x888888,
                        transparent: true,
                        opacity: 0.2
                    });
                    
                    const connection = new THREE.Line(geometry, material);
                    connections.push(connection);
                    group.add(connection);
                }
            }
        }
        
        group.userData.stars = stars;
        group.userData.connections = connections;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createBlackHole() {
        const group = new THREE.Group();
        
        // Event horizon
        const horizonGeometry = new THREE.SphereGeometry(2, 16, 16);
        const horizonMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });
        
        const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
        group.add(eventHorizon);
        
        // Accretion disk
        const diskGeometry = new THREE.RingGeometry(3, 8, 32);
        const diskMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                audioLevel: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    float radius = length(vUv - 0.5) * 2.0;
                    float spiral = atan(vUv.y - 0.5, vUv.x - 0.5) + radius * 3.0 - time * 2.0;
                    float intensity = sin(spiral) * 0.5 + 0.5;
                    
                    vec3 color = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 1.0, 0.0), intensity);
                    color *= (0.5 + audioLevel * 0.5);
                    
                    gl_FragColor = vec4(color, 0.8 * intensity);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
        accretionDisk.rotation.x = -Math.PI / 2;
        group.add(accretionDisk);
        
        // Spiraling particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 800;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const radius = 8 + Math.random() * 12;
            const angle = Math.random() * Math.PI * 2;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
            
            velocities[i * 3] = Math.random() - 0.5;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i * 3 + 2] = Math.random() - 0.5;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            color: 0xff6600,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData.velocities = velocities;
        group.add(particles);
        
        group.userData.eventHorizon = eventHorizon;
        group.userData.accretionDisk = accretionDisk;
        group.userData.particles = particles;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createLightPrism() {
        const group = new THREE.Group();
        const prismCount = 8;
        const prisms = [];
        const lightRays = [];
        
        for (let i = 0; i < prismCount; i++) {
            // Prism geometry
            const prismGeometry = new THREE.ConeGeometry(1, 3, 3);
            const prismMaterial = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                transparent: true,
                opacity: 0.3,
                wireframe: false
            });
            
            const prism = new THREE.Mesh(prismGeometry, prismMaterial);
            prism.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 20
            );
            prism.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            prisms.push(prism);
            group.add(prism);
            
            // Light rays from each prism
            for (let j = 0; j < 6; j++) {
                const rayGeometry = new THREE.BufferGeometry();
                const rayPositions = new Float32Array([
                    0, 0, 0,
                    Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4
                ]);
                rayGeometry.setAttribute('position', new THREE.BufferAttribute(rayPositions, 3));
                
                const hue = j / 6; // Rainbow spectrum
                const rayMaterial = new THREE.LineBasicMaterial({
                    color: new THREE.Color().setHSL(hue, 1.0, 0.6),
                    transparent: true,
                    opacity: 0.7
                });
                
                const ray = new THREE.Line(rayGeometry, rayMaterial);
                ray.position.copy(prism.position);
                ray.userData.prismIndex = i;
                ray.userData.rayIndex = j;
                
                lightRays.push(ray);
                group.add(ray);
            }
        }
        
        group.userData.prisms = prisms;
        group.userData.lightRays = lightRays;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createQuantumField() {
        const group = new THREE.Group();
        
        // Quantum field visualization
        const fieldGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                audioLevel: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    float wave = sin(pos.x * 0.5 + time) * sin(pos.y * 0.3 + time * 1.2);
                    pos.z += wave * (1.0 + audioLevel) * 0.5;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vec2 quantum = sin(vUv * 15.0 + time * 3.0) * 0.5 + 0.5;
                    vec3 color = vec3(quantum.x * 0.3, 0.6 + quantum.y * 0.3, 0.8 + quantum.x * 0.2);
                    color *= (0.6 + audioLevel * 0.4);
                    
                    gl_FragColor = vec4(color, 0.7);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        quantumField.rotation.x = -Math.PI / 3;
        group.add(quantumField);
        
        // Particle pairs (entangled)
        const pairCount = 6;
        const entangledPairs = [];
        
        for (let i = 0; i < pairCount; i++) {
            const pair = [];
            for (let j = 0; j < 2; j++) {
                const particleGeometry = new THREE.SphereGeometry(0.3, 8, 6);
                const particleMaterial = new THREE.MeshBasicMaterial({
                    color: j === 0 ? 0xff0066 : 0x0066ff,
                    transparent: true,
                    opacity: 0.8
                });
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                particle.position.set(
                    (Math.random() - 0.5) * 15,
                    Math.random() * 8 - 4,
                    (Math.random() - 0.5) * 15
                );
                
                particle.userData.pairIndex = i;
                particle.userData.particleIndex = j;
                particle.userData.oscillationPhase = Math.random() * Math.PI * 2;
                
                pair.push(particle);
                group.add(particle);
            }
            entangledPairs.push(pair);
        }
        
        group.userData.quantumField = quantumField;
        group.userData.entangledPairs = entangledPairs;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createDigitalEcosystem() {
        const group = new THREE.Group();
        const organismCount = 25;
        const organisms = [];
        
        // Create different types of organisms
        const organismTypes = ['predator', 'herbivore', 'plant'];
        
        for (let i = 0; i < organismCount; i++) {
            const type = organismTypes[Math.floor(Math.random() * organismTypes.length)];
            let geometry, material, organism;
            
            switch (type) {
                case 'predator':
                    geometry = new THREE.ConeGeometry(0.5, 1.5, 6);
                    material = new THREE.MeshBasicMaterial({
                        color: 0xff3333,
                        transparent: true,
                        opacity: 0.8
                    });
                    break;
                case 'herbivore':
                    geometry = new THREE.SphereGeometry(0.4, 8, 6);
                    material = new THREE.MeshBasicMaterial({
                        color: 0x33ff33,
                        transparent: true,
                        opacity: 0.8
                    });
                    break;
                case 'plant':
                    geometry = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 6);
                    material = new THREE.MeshBasicMaterial({
                        color: 0x33cc33,
                        transparent: true,
                        opacity: 0.7
                    });
                    break;
            }
            
            organism = new THREE.Mesh(geometry, material);
            organism.position.set(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 25
            );
            
            organism.userData.type = type;
            organism.userData.energy = Math.random() * 100;
            organism.userData.age = 0;
            organism.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.1
            );
            organism.userData.originalScale = organism.scale.clone();
            
            organisms.push(organism);
            group.add(organism);
        }
        
        group.userData.organisms = organisms;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createTexturePortal() {
        const group = new THREE.Group();
        
        // Load the JRJ texture
        const loader = new THREE.TextureLoader();
        let jrjTexture = null;
        
        // Create placeholder material first
        let portalMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                audioLevel: { value: 0.0 },
                texture1: { value: null },
                hasTexture: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Audio-reactive vertex displacement
                    float wave = sin(pos.x * 2.0 + time) * sin(pos.y * 2.0 + time * 1.2);
                    pos.z += wave * audioLevel * 0.5;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float audioLevel;
                uniform sampler2D texture1;
                uniform float hasTexture;
                
                void main() {
                    vec2 uv = vUv;
                    
                    // Audio-reactive distortion
                    uv.x += sin(uv.y * 10.0 + time * 2.0) * audioLevel * 0.1;
                    uv.y += cos(uv.x * 10.0 + time * 1.5) * audioLevel * 0.1;
                    
                    vec3 color;
                    
                    if (hasTexture > 0.5) {
                        // Use loaded texture
                        color = texture2D(texture1, uv).rgb;
                        
                        // Audio-reactive color effects
                        color *= (0.7 + audioLevel * 0.5);
                        color.r += sin(time * 3.0) * audioLevel * 0.2;
                        color.g += cos(time * 2.0) * audioLevel * 0.2;
                        color.b += sin(time * 4.0) * audioLevel * 0.2;
                    } else {
                        // Fallback pattern if texture fails to load
                        float pattern = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time * 1.2);
                        color = vec3(0.5 + pattern * 0.5, 0.3 + pattern * 0.3, 0.8 + pattern * 0.2);
                        color *= (0.6 + audioLevel * 0.4);
                    }
                    
                    gl_FragColor = vec4(color, 0.9);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        // Try to load the texture
        loader.load(
            './jrj.png',
            (texture) => {
                console.log('JRJ texture loaded successfully');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                portalMaterial.uniforms.texture1.value = texture;
                portalMaterial.uniforms.hasTexture.value = 1.0;
                portalMaterial.needsUpdate = true;
            },
            (progress) => {
                console.log('Loading JRJ texture...', progress);
            },
            (error) => {
                console.warn('Failed to load JRJ texture, using fallback pattern:', error);
                portalMaterial.uniforms.hasTexture.value = 0.0;
            }
        );
        
        // Main portal plane
        const portalGeometry = new THREE.PlaneGeometry(8, 8, 32, 32);
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.position.z = 0;
        group.add(portal);
        
        // Surrounding particle ring
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 6 + Math.random() * 4;
            const height = (Math.random() - 0.5) * 3;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
            
            // Color based on position
            const hue = (angle / (Math.PI * 2) + Math.random() * 0.2) % 1;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 0.5 + 0.2;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData.originalPositions = positions.slice();
        group.add(particles);
        
        // Energy beams connecting to portal
        const beamCount = 8;
        const beams = [];
        
        for (let i = 0; i < beamCount; i++) {
            const angle = (i / beamCount) * Math.PI * 2;
            const beamGeometry = new THREE.BufferGeometry();
            const beamPositions = new Float32Array([
                Math.cos(angle) * 10, Math.sin(angle) * 2, Math.sin(angle) * 10,
                0, 0, 0
            ]);
            beamGeometry.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
            
            const beamMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(i / beamCount, 0.8, 0.6),
                transparent: true,
                opacity: 0.5
            });
            
            const beam = new THREE.Line(beamGeometry, beamMaterial);
            beam.userData.angle = angle;
            beam.userData.beamIndex = i;
            beams.push(beam);
            group.add(beam);
        }
        
        group.userData.portal = portal;
        group.userData.particles = particles;
        group.userData.beams = beams;
        group.userData.portalMaterial = portalMaterial;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createJRJ3DGallery() {
        const params = this.animationParams.jrj3D;
        const loader = new THREE.TextureLoader();
        const group = new THREE.Group();
        
        const layers = [];
        
        // Create multiple layers for 3D depth effect
        for (let i = 0; i < params.layerCount; i++) {
            // Create front face
            const frontGeometry = new THREE.PlaneGeometry(8, 8);
            const frontMaterial = new THREE.MeshBasicMaterial({
                transparent: false,
                side: THREE.FrontSide
            });
            const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
            
            // Create back face with UV coordinates flipped horizontally
            const backGeometry = new THREE.PlaneGeometry(8, 8);
            const backMaterial = new THREE.MeshBasicMaterial({
                transparent: false,
                side: THREE.BackSide
            });
            const backMesh = new THREE.Mesh(backGeometry, backMaterial);
            
            // Group both faces together
            const layerGroup = new THREE.Group();
            layerGroup.add(frontMesh);
            layerGroup.add(backMesh);
            
            // Position layers with depth spacing
            layerGroup.position.z = i * params.layerSpacing;
            layerGroup.position.x = Math.sin(i * 0.5) * 0.5;
            layerGroup.position.y = Math.cos(i * 0.3) * 0.3;
            
            layerGroup.userData.layerIndex = i;
            layerGroup.userData.originalZ = layerGroup.position.z;
            layerGroup.userData.originalX = layerGroup.position.x;
            layerGroup.userData.originalY = layerGroup.position.y;
            layerGroup.userData.frontMaterial = frontMaterial;
            layerGroup.userData.backMaterial = backMaterial;
            
            layers.push(layerGroup);
            group.add(layerGroup);
        }
        
        // Load texture for all layers
        loader.load(
            './jrj.png',
            (texture) => {
                console.log('JRJ 3D Gallery texture loaded successfully');
                layers.forEach(layer => {
                    // Front face gets normal texture
                    const frontTexture = texture.clone();
                    frontTexture.needsUpdate = true;
                    layer.userData.frontMaterial.map = frontTexture;
                    layer.userData.frontMaterial.needsUpdate = true;
                    
                    // Back face gets horizontally flipped texture
                    const backTexture = texture.clone();
                    backTexture.wrapS = THREE.RepeatWrapping;
                    backTexture.repeat.x = -1; // Flip horizontally
                    backTexture.needsUpdate = true;
                    layer.userData.backMaterial.map = backTexture;
                    layer.userData.backMaterial.needsUpdate = true;
                });
            },
            (progress) => {
                console.log('Loading JRJ 3D Gallery texture...', progress);
            },
            (error) => {
                console.warn('Failed to load JRJ 3D Gallery texture:', error);
            }
        );
        
        // Add ambient lighting for the gallery
        const ambientLight = new THREE.AmbientLight(0xffffff, params.lightingIntensity * 0.6);
        group.add(ambientLight);
        
        // Add point light for depth and dimension
        const pointLight = new THREE.PointLight(0xffffff, params.lightingIntensity, 50);
        pointLight.position.set(5, 5, 10);
        group.add(pointLight);
        
        // Create 3D text "ENTERPRISES" that orbits around the gallery
        const fontLoader = new THREE.FontLoader();
        const textGroup = new THREE.Group();
        
        // Create text without font loading (using default geometry)
        const textGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.1);
        const letters = "ENTERPRISES".split("");
        const textMeshes = [];
        
        letters.forEach((letter, index) => {
            const letterMaterial = new THREE.MeshPhongMaterial({
                color: 0x4a9eff,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
            
            const letterMesh = new THREE.Mesh(textGeometry.clone(), letterMaterial);
            
            // Position letters in a circle around the center
            const angle = (index / letters.length) * Math.PI * 2;
            const radius = 12;
            letterMesh.position.x = Math.cos(angle) * radius;
            letterMesh.position.y = Math.sin(angle) * radius;
            letterMesh.position.z = 0;
            
            // Store original orbit parameters
            letterMesh.userData.orbitAngle = angle;
            letterMesh.userData.orbitRadius = radius;
            letterMesh.userData.letterIndex = index;
            
            textMeshes.push(letterMesh);
            textGroup.add(letterMesh);
        });
        
        group.add(textGroup);
        
        group.userData.layers = layers;
        group.userData.ambientLight = ambientLight;
        group.userData.pointLight = pointLight;
        group.userData.textGroup = textGroup;
        group.userData.textMeshes = textMeshes;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createAggregatronCore() {
        const params = this.animationParams.aggregatron;
        const loader = new THREE.TextureLoader();
        const group = new THREE.Group();
        
        // Central core with aggregatron texture
        const coreGeometry = new THREE.SphereGeometry(params.coreScale, 32, 32);
        const coreMaterial = new THREE.MeshPhongMaterial({
            transparent: false,
            shininess: 100,
            emissive: 0x001122
        });
        const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(coreSphere);
        
        // Load aggregatron texture
        loader.load(
            './aggregatron.png',
            (texture) => {
                console.log('Aggregatron texture loaded successfully');
                coreMaterial.map = texture;
                coreMaterial.needsUpdate = true;
            },
            (progress) => {
                console.log('Loading aggregatron texture...', progress);
            },
            (error) => {
                console.warn('Failed to load aggregatron texture:', error);
            }
        );
        
        // Orbiting cubes around the core
        const orbitingCubes = [];
        for (let i = 0; i < params.cubeCount; i++) {
            const cubeGeometry = new THREE.BoxGeometry(params.cubeSize, params.cubeSize, params.cubeSize);
            const cubeMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(i / params.cubeCount, 0.8, 0.6),
                transparent: true,
                opacity: 0.8,
                shininess: 50
            });
            
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            
            // Position cubes in orbit
            const angle = (i / params.cubeCount) * Math.PI * 2;
            cube.position.x = Math.cos(angle) * params.orbitRadius;
            cube.position.z = Math.sin(angle) * params.orbitRadius;
            cube.position.y = Math.sin(angle * 2) * 2;
            
            cube.userData.orbitAngle = angle;
            cube.userData.cubeIndex = i;
            
            orbitingCubes.push(cube);
            group.add(cube);
        }
        
        // Energy beams connecting core to cubes
        const energyBeams = [];
        for (let i = 0; i < params.energyBeams; i++) {
            const beamGeometry = new THREE.BufferGeometry();
            const beamPositions = new Float32Array([
                0, 0, 0,  // Core center
                Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10  // Random endpoint
            ]);
            beamGeometry.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
            
            const beamMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(i / params.energyBeams, 1.0, 0.5),
                transparent: true,
                opacity: 0.7
            });
            
            const beam = new THREE.Line(beamGeometry, beamMaterial);
            beam.userData.beamIndex = i;
            energyBeams.push(beam);
            group.add(beam);
        }
        
        // Particle field around the core
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i + 1] = (Math.random() - 0.5) * 30;
            positions[i + 2] = (Math.random() - 0.5) * 30;
            
            colors[i] = 0.2 + Math.random() * 0.3;
            colors[i + 1] = 0.4 + Math.random() * 0.4;
            colors[i + 2] = 0.8 + Math.random() * 0.2;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        group.add(particles);
        
        // Store references for animation
        group.userData.coreSphere = coreSphere;
        group.userData.orbitingCubes = orbitingCubes;
        group.userData.energyBeams = energyBeams;
        group.userData.particles = particles;
        group.userData.particleGeometry = particleGeometry;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    createAggregatronGlow() {
        const params = this.animationParams.aggregatronGlow;
        const loader = new THREE.TextureLoader();
        const group = new THREE.Group();
        
        // Front face of logo
        const frontGeometry = new THREE.PlaneGeometry(params.logoSize, params.logoSize);
        const frontMaterial = new THREE.MeshBasicMaterial({
            transparent: false,
            side: THREE.FrontSide
        });
        const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
        
        // Back face of logo with correct orientation
        const backGeometry = new THREE.PlaneGeometry(params.logoSize, params.logoSize);
        const backMaterial = new THREE.MeshBasicMaterial({
            transparent: false,
            side: THREE.BackSide
        });
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);
        
        // Group front and back faces
        const logoGroup = new THREE.Group();
        logoGroup.add(frontMesh);
        logoGroup.add(backMesh);
        
        // Enhanced glow effect - multiple layers for intensity
        const glowLayers = [];
        for (let i = 0; i < 3; i++) {
            const glowSize = params.logoSize * (1.3 + i * 0.2);
            const glowGeometry = new THREE.PlaneGeometry(glowSize, glowSize);
            const glowMaterial = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.4 - (i * 0.1),
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            glowMesh.position.z = -0.1 - (i * 0.05); // Stack behind logo
            glowLayers.push(glowMesh);
        }
        
        // Load aggregatron texture
        loader.load(
            './aggregatron.png',
            (texture) => {
                console.log('Aggregatron Glow texture loaded successfully');
                
                // Apply clean texture to front face
                const frontTexture = texture.clone();
                frontTexture.needsUpdate = true;
                frontMaterial.map = frontTexture;
                frontMaterial.needsUpdate = true;
                
                // Apply horizontally flipped texture to back face
                const backTexture = texture.clone();
                backTexture.wrapS = THREE.RepeatWrapping;
                backTexture.repeat.x = -1; // Flip horizontally for correct orientation
                backTexture.needsUpdate = true;
                backMaterial.map = backTexture;
                backMaterial.needsUpdate = true;
                
                // Apply texture to all glow layers
                glowLayers.forEach(glowMesh => {
                    const glowTexture = texture.clone();
                    glowTexture.needsUpdate = true;
                    glowMesh.material.map = glowTexture;
                    glowMesh.material.needsUpdate = true;
                });
            },
            (progress) => {
                console.log('Loading aggregatron glow texture...', progress);
            },
            (error) => {
                console.warn('Failed to load aggregatron glow texture:', error);
            }
        );
        
        // Subtle ambient particles
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(params.particleCount * 3);
        const colors = new Float32Array(params.particleCount * 3);
        const sizes = new Float32Array(params.particleCount);
        
        for (let i = 0; i < params.particleCount; i++) {
            const i3 = i * 3;
            
            // Distribute particles in a sphere around the logo
            const radius = 15 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Soft blue-white colors
            colors[i3] = 0.8 + Math.random() * 0.2;     // R
            colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G  
            colors[i3 + 2] = 1.0;                       // B
            
            sizes[i] = 0.5 + Math.random() * 1.0;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        
        // Add components to group
        glowLayers.forEach(glowMesh => group.add(glowMesh)); // Multiple glow layers behind
        group.add(logoGroup);     // Logo (front and back faces) in front
        group.add(particles);     // Ambient particles
        
        // Store references for animation
        group.userData.logoGroup = logoGroup;
        group.userData.frontMesh = frontMesh;
        group.userData.backMesh = backMesh;
        group.userData.glowLayers = glowLayers;
        group.userData.particles = particles;
        group.userData.particleGeometry = particleGeometry;
        group.userData.originalY = 0;
        
        this.scene.add(group);
        group.visible = false;
        return group;
    }

    setAnimationMode(mode) {
        // Hide all objects
        Object.values(this.objects).forEach(obj => {
            obj.visible = false;
        });

        // Show selected mode
        if (this.objects[mode]) {
            this.objects[mode].visible = true;
        }

        this.currentMode = mode;
    }

    updateAudioData(audioData) {
        if (!audioData || !this.currentMode) return;

        const { frequencyData, timeDomainData, volume, dominantFrequency } = audioData;
        
        // Update lights based on audio
        this.updateLights(volume, dominantFrequency);
        
        // Update objects based on current mode
        switch (this.currentMode) {
            case 'cubes':
                this.updateCubes(frequencyData, volume);
                break;
            case 'sphere':
                this.updateSphere(frequencyData, volume, dominantFrequency);
                break;
            case 'particles':
                this.updateParticles(frequencyData, volume, timeDomainData);
                break;
            case 'waves':
                this.updateWaves(frequencyData, timeDomainData, volume);
                break;
            case 'helix':
                this.updateHelix(frequencyData, volume, dominantFrequency);
                break;
            case 'tunnel':
                this.updateTunnel(frequencyData, volume, timeDomainData);
                break;
            case 'galaxy':
                this.updateGalaxy(frequencyData, volume, dominantFrequency);
                break;
            case 'tree':
                this.updateTree(frequencyData, volume, timeDomainData);
                break;
            case 'crystals':
                this.updateCrystals(frequencyData, volume, dominantFrequency);
                break;
            case 'rings':
                this.updateRings(frequencyData, volume, timeDomainData);
                break;
            case 'bars':
                this.updateBars(frequencyData, volume);
                break;
            case 'matrix':
                this.updateMatrix(frequencyData, volume, timeDomainData);
                break;
            case 'plasma':
                this.updatePlasma(frequencyData, volume, timeDomainData);
                break;
            case 'vortex':
                this.updateVortex(frequencyData, volume, dominantFrequency);
                break;
            case 'neural':
                this.updateNeural(frequencyData, volume, timeDomainData);
                break;
            case 'kaleidoscope':
                this.updateKaleidoscope(frequencyData, volume, dominantFrequency);
                break;
            case 'lightning':
                this.updateLightning(frequencyData, volume, timeDomainData);
                break;
            case 'ocean':
                this.updateOcean(frequencyData, volume, timeDomainData);
                break;
            case 'fractal':
                this.updateFractal(frequencyData, volume, dominantFrequency);
                break;
            case 'spiral':
                this.updateSpiral(frequencyData, volume, dominantFrequency);
                break;
            case 'aurora':
                this.updateAurora(frequencyData, volume, timeDomainData);
                break;
            case 'cityscape':
                this.updateCityscape(frequencyData, volume, dominantFrequency);
                break;
            case 'molecules':
                this.updateMolecules(frequencyData, volume, timeDomainData);
                break;
            case 'tornado':
                this.updateTornado(frequencyData, volume, dominantFrequency);
                break;
            case 'cosmos':
                this.updateCosmos(frequencyData, volume, dominantFrequency);
                break;
            case 'labyrinth':
                this.updateLabyrinth(frequencyData, volume, timeDomainData);
                break;
            case 'waterfall':
                this.updateWaterfall(frequencyData, volume, dominantFrequency);
                break;
            case 'fire':
                this.updateFire(frequencyData, volume, dominantFrequency);
                break;
            case 'ice':
                this.updateIce(frequencyData, volume, dominantFrequency);
                break;
            case 'desert':
                this.updateDesert(frequencyData, volume, timeDomainData);
                break;
            case 'volcano':
                this.updateVolcano(frequencyData, volume, dominantFrequency);
                break;
            case 'forest':
                this.updateForest(frequencyData, volume, timeDomainData);
                break;
            case 'cyberpunk':
                this.updateCyberpunk(frequencyData, volume, dominantFrequency);
                break;
            case 'retro':
                this.updateRetro(frequencyData, volume, dominantFrequency);
                break;
            case 'abstract':
                this.updateAbstract(frequencyData, volume, dominantFrequency);
                break;
            case 'mechanical':
                this.updateMechanical(frequencyData, volume, dominantFrequency);
                break;
            case 'underwater':
                this.updateUnderwater(frequencyData, volume, dominantFrequency);
                break;
            case 'constellation':
                this.updateConstellation(frequencyData, volume, dominantFrequency);
                break;
            case 'blackhole':
                this.updateBlackHole(frequencyData, volume, dominantFrequency);
                break;
            case 'prism':
                this.updatePrism(frequencyData, volume, dominantFrequency);
                break;
            case 'quantum':
                this.updateQuantum(frequencyData, volume, dominantFrequency);
                break;
            case 'ecosystem':
                this.updateEcosystem(frequencyData, volume, dominantFrequency);
                break;
            case 'texturePortal':
                this.updateTexturePortal(frequencyData, volume, dominantFrequency);
                break;
            case 'jrj3D':
                this.updateJRJ3D(frequencyData, volume, dominantFrequency);
                break;
            case 'aggregatron':
                this.updateAggregatronCore(frequencyData, volume, dominantFrequency);
                break;
            case 'aggregatronGlow':
                this.updateAggregatronGlow(frequencyData, volume, dominantFrequency);
                break;
        }
    }

    updateLights(volume, dominantFrequency) {
        const intensity = Math.min(volume * 2, 3);
        
        // Pulse main lights
        this.lights.point1.intensity = intensity;
        this.lights.point2.intensity = intensity;
        this.lights.point3.intensity = intensity;

        // Change colors based on frequency
        const hue = (dominantFrequency / 20000) * 360;
        this.lights.point1.color.setHSL((hue / 360), 0.8, 0.5);
        this.lights.point2.color.setHSL(((hue + 120) % 360) / 360, 0.8, 0.5);
        this.lights.point3.color.setHSL(((hue + 240) % 360) / 360, 0.8, 0.5);
    }

    updateCubes(frequencyData, volume) {
        const cubes = this.objects.cubes.userData.cubes;
        const gridSize = cubes.length;
        
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const cube = cubes[x][z];
                const index = Math.floor(((x + z) / (gridSize * 2)) * frequencyData.length);
                const scale = 1 + (frequencyData[index] / 255) * 3 * volume;
                
                cube.scale.y = scale;
                cube.rotation.y += 0.01 * volume;
                
                // Update color based on frequency
                const hue = (index / frequencyData.length);
                cube.material.color.setHSL(hue, 0.8, 0.5);
            }
        }
    }

    updateSphere(frequencyData, volume, dominantFrequency) {
        const sphere = this.objects.sphere.userData.mainSphere;
        const wireframe = this.objects.sphere.userData.wireframe;
        
        // Rotate based on volume
        sphere.rotation.y += 0.01 * volume;
        wireframe.rotation.y += 0.01 * volume;
        
        // Scale based on volume
        const scale = 1 + volume * 0.3;
        sphere.scale.setScalar(scale);
        wireframe.scale.setScalar(scale * 1.1);
        
        // Deform vertices based on frequency data
        const geometry = sphere.geometry;
        const positions = geometry.attributes.position.array;
        const originalVertices = sphere.userData.originalVertices;
        
        for (let i = 0; i < positions.length; i += 3) {
            const index = Math.floor((i / 3 / positions.length * 3) * frequencyData.length);
            const displacement = (frequencyData[index] / 255) * volume * 0.5;
            
            positions[i] = originalVertices[i] * (1 + displacement);
            positions[i + 1] = originalVertices[i + 1] * (1 + displacement);
            positions[i + 2] = originalVertices[i + 2] * (1 + displacement);
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    updateParticles(frequencyData, volume, timeDomainData) {
        const particles = this.objects.particles.userData.particles;
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const originalPositions = particles.userData.originalPositions;
        
        for (let i = 0; i < positions.length; i += 3) {
            const index = Math.floor((i / 3) / (positions.length / 3) * frequencyData.length);
            const frequency = frequencyData[index] / 255;
            const timeValue = timeDomainData[index] / 255;
            
            // Move particles based on audio
            const displacement = frequency * volume * 2;
            positions[i] = originalPositions[i] + Math.sin(Date.now() * 0.001 + i) * displacement;
            positions[i + 1] = originalPositions[i + 1] + Math.cos(Date.now() * 0.001 + i) * displacement;
            positions[i + 2] = originalPositions[i + 2] + timeValue * volume;
            
            // Update colors
            const hue = (frequency + timeValue) * 0.5;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5 + volume * 0.3);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        
        // Rotate the entire particle system
        particles.rotation.y += 0.005 * volume;
    }

    updateWaves(frequencyData, timeDomainData, volume) {
        const plane = this.objects.waves.userData.plane;
        const wireframe = this.objects.waves.userData.wireframe;
        const geometry = plane.geometry;
        const positions = geometry.attributes.position.array;
        const originalVertices = plane.userData.originalVertices;
        const width = plane.userData.width;
        const height = plane.userData.height;
        
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const index = i * height + j;
                const posIndex = index * 3 + 2; // Z coordinate
                
                const freqIndex = Math.floor((i / width) * frequencyData.length);
                const timeIndex = Math.floor((j / height) * timeDomainData.length);
                
                const frequency = frequencyData[freqIndex] / 255;
                const timeValue = (timeDomainData[timeIndex] - 128) / 128;
                
                const wave = Math.sin((i + Date.now() * 0.001) * 0.5) * frequency * volume * 2;
                const ripple = Math.cos((j + Date.now() * 0.002) * 0.3) * timeValue * volume;
                
                positions[posIndex] = originalVertices[posIndex] + wave + ripple;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Also update wireframe
        const wireframePositions = wireframe.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i++) {
            wireframePositions[i] = positions[i];
        }
        wireframe.geometry.attributes.position.needsUpdate = true;
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.render();
    }

    render() {
        // Update elapsed time
        this.elapsedTime = Date.now() * 0.001; // Convert to seconds
        
        // Rotate camera around the scene
        const time = Date.now() * 0.0005;
        this.camera.position.x = Math.cos(time) * 15;
        this.camera.position.z = Math.sin(time) * 15;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }

    updateHelix(frequencyData, volume, dominantFrequency) {
        const helixGroup = this.objects.helix;
        const strands = helixGroup.userData.strands;
        const bonds = helixGroup.userData.bonds;
        
        // Rotate the entire helix
        helixGroup.rotation.y += 0.01 * (1 + volume);
        
        strands.forEach((strand, strandIndex) => {
            const spheres = strand.userData.spheres;
            
            spheres.forEach((sphere, index) => {
                const freqIndex = Math.floor((index / spheres.length) * frequencyData.length);
                const frequency = frequencyData[freqIndex] / 255;
                
                // Pulse spheres based on frequency
                const scale = 1 + frequency * volume * 2;
                sphere.scale.setScalar(scale);
                
                // Color shift based on frequency
                const hue = (frequency + volume + strandIndex * 0.5) % 1;
                sphere.material.color.setHSL(hue, 0.8, 0.5 + volume * 0.3);
                
                // Slight position variation
                const originalPos = sphere.userData.originalPosition;
                const variation = Math.sin(Date.now() * 0.002 + index * 0.1) * frequency * volume * 0.3;
                sphere.position.copy(originalPos);
                sphere.position.x += variation;
                sphere.position.z += variation * 0.5;
            });
        });
        
        // Animate bonds
        bonds.forEach((bond, index) => {
            const freqIndex = Math.floor((index / bonds.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            bond.scale.x = 1 + frequency * volume;
            bond.material.opacity = 0.3 + frequency * volume * 0.5;
        });
    }

    updateTunnel(frequencyData, volume, timeDomainData) {
        const tunnelGroup = this.objects.tunnel;
        const rings = tunnelGroup.userData.rings;
        
        // Move camera effect by shifting rings
        rings.forEach((ring, ringIndex) => {
            const cubes = ring.userData.cubes;
            
            // Move ring forward based on bass
            ring.position.y += volume * 0.1;
            
            // Reset position if too far
            if (ring.position.y > 25) {
                ring.position.y = -25;
            }
            
            cubes.forEach((cube, cubeIndex) => {
                const freqIndex = Math.floor((cubeIndex / cubes.length) * frequencyData.length);
                const frequency = frequencyData[freqIndex] / 255;
                
                // Scale cubes based on frequency
                const scale = 1 + frequency * volume * 3;
                cube.scale.setScalar(scale);
                
                // Pulse radius
                const originalPos = cube.userData.originalPosition;
                const radiusMultiplier = 1 + frequency * volume * 0.5;
                cube.position.x = originalPos.x * radiusMultiplier;
                cube.position.z = originalPos.z * radiusMultiplier;
                
                // Color based on frequency and position
                const hue = (frequency + ringIndex * 0.1 + cubeIndex * 0.05) % 1;
                cube.material.color.setHSL(hue, 0.8, 0.5 + frequency * 0.3);
            });
            
            // Rotate ring
            ring.rotation.y += 0.01 * (1 + volume);
        });
    }

    updateGalaxy(frequencyData, volume, dominantFrequency) {
        const galaxyGroup = this.objects.galaxy;
        const particles = galaxyGroup.userData.particles;
        
        // Rotate galaxy
        galaxyGroup.rotation.y += 0.005 * (1 + volume * 0.5);
        
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const originalPositions = particles.userData.originalPositions;
        const originalColors = particles.userData.originalColors;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Spiral motion based on frequency
            const spiralOffset = Math.max(-2, Math.min(2, frequency * volume * Math.sin(Date.now() * 0.001 + particleIndex * 0.1)));
            const verticalOffset = Math.max(-2, Math.min(2, Math.sin(Date.now() * 0.002 + particleIndex) * frequency * volume));
            
            positions[i] = originalPositions[i] + (isNaN(spiralOffset) ? 0 : spiralOffset);
            positions[i + 1] = originalPositions[i + 1] + (isNaN(verticalOffset) ? 0 : verticalOffset);
            positions[i + 2] = originalPositions[i + 2] + (isNaN(spiralOffset * 0.5) ? 0 : spiralOffset * 0.5);
            
            // Color pulsing - use original colors as base
            const intensity = Math.max(0.1, Math.min(2.0, 0.5 + frequency * volume * 0.5));
            colors[i] = originalColors[i] * intensity;
            colors[i + 1] = originalColors[i + 1] * intensity;
            colors[i + 2] = originalColors[i + 2] * intensity;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    updateTree(frequencyData, volume, timeDomainData) {
        const treeGroup = this.objects.tree;
        const branches = treeGroup.userData.branches;
        
        branches.forEach((branch, index) => {
            const depth = branch.userData.depth;
            const freqIndex = Math.floor((depth / 5) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Scale branches based on frequency and depth
            const scaleMultiplier = 1 + frequency * volume * (1 - depth * 0.2);
            branch.scale.copy(branch.userData.originalScale).multiplyScalar(scaleMultiplier);
            
            // Color shift based on growth
            const hue = 0.3 + frequency * 0.2 - depth * 0.05;
            branch.material.color.setHSL(hue, 0.8, 0.4 + frequency * volume * 0.3);
            
            // Subtle swaying
            const sway = Math.sin(Date.now() * 0.001 + index * 0.1) * volume * 0.02;
            branch.rotation.z = sway;
        });
        
        // Grow/shrink entire tree
        const treeScale = 1 + volume * 0.3;
        treeGroup.scale.setScalar(treeScale);
    }

    updateCrystals(frequencyData, volume, dominantFrequency) {
        const crystalGroup = this.objects.crystals;
        const crystals = crystalGroup.userData.crystals;
        
        crystals.forEach((crystal, index) => {
            const freqIndex = Math.floor((index / crystals.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Growth animation
            const growth = 1 + frequency * volume * 2;
            crystal.scale.copy(crystal.userData.originalScale).multiplyScalar(growth);
            
            // Rotation
            crystal.rotation.x += crystal.userData.rotationSpeed * (1 + volume);
            crystal.rotation.y += crystal.userData.rotationSpeed * 0.7 * (1 + volume);
            
            // Color shifting
            const hue = (Date.now() * 0.0001 + index * 0.1 + frequency) % 1;
            crystal.material.color.setHSL(hue, 0.8, 0.5 + frequency * 0.3);
            
            // Floating motion
            const originalPos = crystal.userData.originalPosition;
            const float = Math.sin(Date.now() * 0.001 + index * 0.2) * volume;
            crystal.position.y = originalPos.y + float;
            
            // Opacity pulsing
            crystal.material.opacity = 0.6 + frequency * volume * 0.4;
        });
    }

    updateRings(frequencyData, volume, timeDomainData) {
        const ringGroup = this.objects.rings;
        const rings = ringGroup.userData.rings;
        
        rings.forEach((ring, index) => {
            const freqIndex = Math.floor((index / rings.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Expand rings based on frequency
            const expansion = 1 + frequency * volume * 4;
            ring.scale.setScalar(expansion);
            
            // Color animation
            const hue = (index / rings.length + Date.now() * 0.0002) % 1;
            ring.material.color.setHSL(hue, 0.8, 0.5 + frequency * 0.3);
            
            // Opacity based on expansion
            ring.material.opacity = Math.max(0.1, 0.8 - (expansion - 1) * 0.2);
            
            // Rotation
            ring.rotation.z += 0.01 * (1 + frequency * volume);
        });
    }

    updateBars(frequencyData, volume) {
        const barGroup = this.objects.bars;
        const bars = barGroup.userData.bars;
        
        bars.forEach((bar, index) => {
            const freqIndex = Math.floor((index / bars.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Scale height based on frequency
            const height = 1 + frequency * volume * 8;
            bar.scale.y = height;
            bar.position.y = (height - 1) * 0.5;
            
            // Color gradient
            const hue = index / bars.length;
            const lightness = 0.4 + frequency * 0.4;
            bar.material.color.setHSL(hue, 0.8, lightness);
            
            // Slight rotation
            bar.rotation.y = frequency * volume * 0.2;
        });
    }

    updateMatrix(frequencyData, volume, timeDomainData) {
        const matrixGroup = this.objects.matrix;
        const columns = matrixGroup.userData.columns;
        
        // Rotate the entire matrix slowly for dynamic effect
        matrixGroup.rotation.y += 0.002 * (1 + volume * 0.5);
        
        columns.forEach((column, colIndex) => {
            const drops = column.userData.drops;
            const freqIndex = Math.floor((colIndex / columns.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            drops.forEach((drop, dropIndex) => {
                // Falling animation
                drop.position.y -= drop.userData.fallSpeed * (1 + volume);
                
                // Reset position when off screen and randomize appearance
                if (drop.position.y < -15) {
                    drop.position.y = 12 + Math.random() * 6;
                    drop.material.opacity = Math.random() * 0.8 + 0.2;
                    
                    // Slight random horizontal offset for more organic feel
                    const angle = drop.userData.angle + (Math.random() - 0.5) * 0.2;
                    const radius = drop.userData.radius + (Math.random() - 0.5) * 1;
                    drop.position.x = Math.cos(angle) * radius;
                    drop.position.z = Math.sin(angle) * radius;
                }
                
                // Opacity fading with minimum threshold
                drop.material.opacity = Math.max(0.05, drop.material.opacity * 0.996);
                
                // Color intensity based on frequency and layer depth
                const intensity = Math.max(0, Math.min(1, frequency * volume));
                const layerIntensity = 1 - (drop.userData.layer * 0.2);
                const greenValue = Math.max(0.1, Math.min(1, (intensity + 0.3) * layerIntensity));
                drop.material.color.setRGB(0, greenValue, 0);
                
                // Random character flash effect
                if (Math.random() < frequency * volume * 0.15) {
                    drop.material.opacity = 1;
                    drop.material.color.setRGB(0.2, 1, 0.2);
                }
                
                // Scale pulse based on audio
                const scale = 1 + frequency * volume * 0.3;
                drop.scale.setScalar(scale);
            });
        });
    }

    updatePlasma(frequencyData, volume, timeDomainData) {
        const plasmaGroup = this.objects.plasma;
        const material = plasmaGroup.userData.material;
        
        // Update shader uniforms
        material.uniforms.time.value += 0.02 * (1 + volume);
        material.uniforms.audioLevel.value = volume;
        
        // Calculate dominant frequency
        let maxValue = 0;
        let dominantFreq = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            if (frequencyData[i] > maxValue) {
                maxValue = frequencyData[i];
                dominantFreq = i / frequencyData.length;
            }
        }
        material.uniforms.dominantFreq.value = dominantFreq * Math.PI * 2;
    }

    updateVortex(frequencyData, volume, dominantFrequency) {
        const vortexGroup = this.objects.vortex;
        const particles = vortexGroup.userData.particles;
        
        // Rotate the entire vortex
        vortexGroup.rotation.y += 0.03 * (1 + volume);
        
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const originalPositions = particles.userData.originalPositions;
        const originalColors = particles.userData.originalColors;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Spiral motion with audio reaction
            const t = Date.now() * 0.001 + particleIndex * 0.1;
            const spiralOffset = frequency * volume * Math.sin(t);
            const pullEffect = volume * 0.5;
            
            // Move particles inward/outward based on audio
            const radius = Math.sqrt(originalPositions[i] * originalPositions[i] + originalPositions[i + 2] * originalPositions[i + 2]);
            const newRadius = radius * (1 + pullEffect * Math.sin(t));
            
            const angle = Math.atan2(originalPositions[i + 2], originalPositions[i]);
            positions[i] = Math.cos(angle + spiralOffset) * newRadius;
            positions[i + 1] = originalPositions[i + 1] + Math.sin(t) * frequency * volume * 2;
            positions[i + 2] = Math.sin(angle + spiralOffset) * newRadius;
            
            // Color intensity
            const intensity = 0.5 + frequency * volume * 0.5;
            colors[i] = originalColors[i] * intensity;
            colors[i + 1] = originalColors[i + 1] * intensity;
            colors[i + 2] = originalColors[i + 2] * intensity;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    updateNeural(frequencyData, volume, timeDomainData) {
        const neuralGroup = this.objects.neural;
        const nodes = neuralGroup.userData.nodes;
        const connections = neuralGroup.userData.connections;
        
        // Update nodes
        nodes.forEach((node, index) => {
            const freqIndex = Math.floor((index / nodes.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Pulse effect
            const pulsePhase = node.userData.pulsePhase + Date.now() * 0.005;
            const pulse = 1 + Math.sin(pulsePhase) * frequency * volume;
            node.scale.setScalar(pulse);
            
            // Color change
            const hue = (frequency + volume + Date.now() * 0.0001) % 1;
            node.material.color.setHSL(hue, 0.8, 0.5 + frequency * 0.3);
            
            // Slight position variation
            const originalPos = node.userData.originalPosition;
            const variation = Math.sin(Date.now() * 0.003 + index) * frequency * volume * 0.5;
            node.position.copy(originalPos);
            node.position.multiplyScalar(1 + variation);
        });
        
        // Update connections
        connections.forEach((connection, index) => {
            const freqIndex = Math.floor((index / connections.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Update line positions
            const positions = connection.geometry.attributes.position.array;
            const nodeA = connection.userData.nodeA;
            const nodeB = connection.userData.nodeB;
            
            positions[0] = nodeA.position.x;
            positions[1] = nodeA.position.y;
            positions[2] = nodeA.position.z;
            positions[3] = nodeB.position.x;
            positions[4] = nodeB.position.y;
            positions[5] = nodeB.position.z;
            
            connection.geometry.attributes.position.needsUpdate = true;
            
            // Pulse opacity and color
            connection.material.opacity = 0.3 + frequency * volume * 0.5;
            const hue = (frequency + index * 0.1) % 1;
            connection.material.color.setHSL(hue, 0.8, 0.6);
        });
    }

    updateKaleidoscope(frequencyData, volume, dominantFrequency) {
        const kaleidoscopeGroup = this.objects.kaleidoscope;
        const segments = kaleidoscopeGroup.userData.segments;
        
        // Rotate entire kaleidoscope
        kaleidoscopeGroup.rotation.y += 0.02 * (1 + volume);
        kaleidoscopeGroup.rotation.z += 0.01 * (1 + volume * 0.5);
        
        segments.forEach((segment, segmentIndex) => {
            const shapes = segment.userData.shapes;
            const freqIndex = Math.floor((segmentIndex / segments.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            shapes.forEach((shape, shapeIndex) => {
                // Scale based on frequency
                const scale = 1 + frequency * volume * 2;
                shape.scale.setScalar(scale);
                
                // Color cycling
                const hue = (segmentIndex / segments.length + shapeIndex * 0.1 + Date.now() * 0.001) % 1;
                shape.material.color.setHSL(hue, 0.8, 0.5 + frequency * 0.3);
                
                // Rotation
                shape.rotation.x += frequency * volume * 0.1;
                shape.rotation.y += frequency * volume * 0.05;
                
                // Position pulsing
                const originalPos = shape.userData.originalPosition;
                const radiusMult = 1 + frequency * volume * 0.5;
                shape.position.copy(originalPos).multiplyScalar(radiusMult);
            });
            
            // Segment rotation
            segment.rotation.y += frequency * volume * 0.02;
        });
    }

    updateLightning(frequencyData, volume, timeDomainData) {
        const lightningGroup = this.objects.lightning;
        const bolts = lightningGroup.userData.bolts;
        
        bolts.forEach((bolt, boltIndex) => {
            const segments = bolt.userData.segments;
            const flickerPhase = bolt.userData.flickerPhase + Date.now() * 0.01;
            const freqIndex = Math.floor((boltIndex / bolts.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Flicker effect
            const shouldFlicker = Math.sin(flickerPhase) * frequency * volume > 0.3;
            
            segments.forEach((segment, segmentIndex) => {
                if (shouldFlicker && Math.random() < frequency * volume) {
                    // Flash bright white
                    segment.material.color.setRGB(1, 1, 1);
                    segment.material.opacity = 1;
                    segment.scale.setScalar(2 + frequency * volume * 3);
                } else {
                    // Normal lightning color
                    const intensity = 0.3 + frequency * volume * 0.5;
                    segment.material.color.setRGB(0.8 * intensity, 0.9 * intensity, 1 * intensity);
                    segment.material.opacity = 0.8 * intensity;
                    segment.scale.setScalar(1);
                }
                
                // Random branch movement
                const jitter = (Math.random() - 0.5) * frequency * volume * 0.2;
                const originalPos = segment.userData.originalPosition;
                segment.position.copy(originalPos);
                segment.position.x += jitter;
                segment.position.z += jitter;
            });
        });
    }

    updateOcean(frequencyData, volume, timeDomainData) {
        const oceanGroup = this.objects.ocean;
        const waveSurface = oceanGroup.userData.waveSurface;
        const foam = oceanGroup.userData.foam;
        
        // Update wave surface
        const geometry = waveSurface.geometry;
        const positions = geometry.attributes.position.array;
        const originalVertices = waveSurface.userData.originalVertices;
        
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = originalVertices[i];
            const z = originalVertices[i + 2];
            
            // Calculate wave based on position and audio
            const wave1 = Math.sin(x * 0.1 + time + volume * 2) * (1 + volume);
            const wave2 = Math.sin(z * 0.15 + time * 1.2 + volume) * 0.5;
            const audioWave = Math.sin((x + z) * 0.05 + time * 2) * volume * 2;
            
            positions[i + 1] = wave1 + wave2 + audioWave;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Update foam particles
        const foamGeometry = foam.geometry;
        const foamPositions = foamGeometry.attributes.position.array;
        const originalFoamPositions = foam.userData.originalPositions;
        
        for (let i = 0; i < foamPositions.length; i += 3) {
            const freqIndex = Math.floor((i / foamPositions.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Foam movement
            foamPositions[i] = originalFoamPositions[i] + Math.sin(time + i) * frequency * volume;
            foamPositions[i + 1] = originalFoamPositions[i + 1] + Math.sin(time * 2 + i) * frequency * volume * 0.5;
            foamPositions[i + 2] = originalFoamPositions[i + 2] + Math.cos(time + i) * frequency * volume;
        }
        
        foamGeometry.attributes.position.needsUpdate = true;
        
        // Color animation based on audio
        const intensity = 0.7 + volume * 0.3;
        waveSurface.material.color.setRGB(0, 0.5 * intensity, 0.7 * intensity);
    }

    updateFractal(frequencyData, volume, dominantFrequency) {
        const fractalGroup = this.objects.fractal;
        const shapes = fractalGroup.userData.shapes;
        
        // Rotate entire fractal
        fractalGroup.rotation.z += 0.01 * (1 + volume);
        
        // Optimize: Update only every other frame and batch by depth level
        const frameCount = Date.now() * 0.01;
        const shouldUpdate = Math.floor(frameCount) % 2 === 0;
        
        if (shouldUpdate) {
            const time = Date.now() * 0.0005;
            
            shapes.forEach((shape, index) => {
                // Sample fewer frequency points for performance - with bounds checking
                const freqIndex = Math.max(0, Math.min(frequencyData.length - 1, 
                    Math.floor((shape.userData.depth / 3) * frequencyData.length)));
                const frequency = (frequencyData[freqIndex] || 0) / 255;
                
                // Scale based on frequency and depth - with bounds
                const depthMultiplier = 1 + (shape.userData.depth / 3) * 0.3;
                const audioScale = Math.max(0.2, Math.min(3.0, 1 + frequency * volume * 0.8));
                const scale = depthMultiplier * audioScale;
                shape.scale.setScalar(scale);
                
                // Color cycling - less frequent updates
                if (index % 3 === 0) {
                    const hue = (shape.userData.depth / 3 + time + frequency) % 1;
                    shape.material.color.setHSL(hue, 0.8, 0.5 + frequency * 0.3);
                }
                
                // Rotation based on audio - reduced frequency
                shape.rotation.z += frequency * volume * 0.005;
                
                // Opacity pulsing - with bounds
                shape.material.opacity = Math.max(0.3, Math.min(1.0, 0.7 + frequency * volume * 0.3));
            });
        }
    }

    updateSpiral(frequencyData, volume, dominantFrequency) {
        const spiralGroup = this.objects.spiral;
        const particles = spiralGroup.userData.particles;
        
        // Rotate spiral
        spiralGroup.rotation.y += 0.02 * (1 + volume);
        
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const originalPositions = particles.userData.originalPositions;
        const originalColors = particles.userData.originalColors;
        
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Spiral growth animation
            const growth = 1 + frequency * volume;
            const theta = particleIndex * 2 * Math.PI / goldenRatio + Date.now() * 0.001;
            const radius = Math.sqrt(particleIndex) * 0.5 * growth;
            
            positions[i] = Math.cos(theta) * radius;
            positions[i + 1] = Math.sin(theta) * radius;
            positions[i + 2] = originalPositions[i + 2] + Math.sin(Date.now() * 0.002 + particleIndex * 0.1) * frequency * volume;
            
            // Color intensity
            const intensity = 0.6 + frequency * volume * 0.4;
            colors[i] = originalColors[i] * intensity;
            colors[i + 1] = originalColors[i + 1] * intensity;
            colors[i + 2] = originalColors[i + 2] * intensity;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    updateAurora(frequencyData, volume, timeDomainData) {
        const auroraGroup = this.objects.aurora;
        const layers = auroraGroup.userData.layers;
        
        layers.forEach((layer, layerIndex) => {
            const waves = layer.userData.waves;
            const freqIndex = Math.floor((layerIndex / layers.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            waves.forEach((wave, waveIndex) => {
                const material = wave.material;
                
                // Update shader uniforms
                material.uniforms.time.value += 0.03 * (1 + frequency);
                material.uniforms.audioLevel.value = frequency * volume;
                
                // Wave movement
                wave.position.y += Math.sin(Date.now() * 0.001 + waveIndex) * frequency * volume * 0.1;
            });
        });
    }

    updateCityscape(frequencyData, volume, dominantFrequency) {
        const cityscapeGroup = this.objects.cityscape;
        const buildings = cityscapeGroup.userData.buildings;
        
        buildings.forEach((building, index) => {
            const freqIndex = Math.floor((index / buildings.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Building height scaling
            const heightScale = 1 + frequency * volume;
            building.scale.y = heightScale;
            building.position.y = (building.userData.originalHeight * heightScale) / 2 - 8;
            
            // Window flickering
            const windows = building.userData.windows;
            windows.forEach((window, winIndex) => {
                if (Math.random() < frequency * volume * 0.3) {
                    window.material.opacity = Math.random() > 0.5 ? 1 : 0;
                }
                
                // Color shifting
                const hue = (frequency + Date.now() * 0.0001) % 1;
                window.material.color.setHSL(hue, 0.8, 0.7);
            });
            
            // Building color
            const intensity = 0.3 + frequency * volume * 0.4;
            building.material.color.setHSL(0.6, 0.7, intensity);
        });
    }

    updateMolecules(frequencyData, volume, timeDomainData) {
        const moleculeGroup = this.objects.molecules;
        const atoms = moleculeGroup.userData.atoms;
        const bonds = moleculeGroup.userData.bonds;
        
        // Update atoms
        atoms.forEach((atom, index) => {
            const freqIndex = Math.floor((index / atoms.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Vibration
            const vibration = atom.userData.vibrationPhase + Date.now() * 0.005;
            const originalPos = atom.userData.originalPosition;
            const vibrationAmount = frequency * volume * 0.5;
            
            atom.position.set(
                originalPos.x + Math.sin(vibration) * vibrationAmount,
                originalPos.y + Math.cos(vibration * 1.2) * vibrationAmount,
                originalPos.z + Math.sin(vibration * 0.8) * vibrationAmount
            );
            
            // Scale pulsing
            const scale = 1 + frequency * volume;
            atom.scale.setScalar(scale);
            
            // Color cycling based on atom type
            const hue = (atom.userData.atomType * 0.25 + frequency + Date.now() * 0.0002) % 1;
            atom.material.color.setHSL(hue, 0.8, 0.6);
        });
        
        // Update bonds
        bonds.forEach((bond, index) => {
            const atomA = bond.userData.atomA;
            const atomB = bond.userData.atomB;
            
            // Update bond positions
            const positions = bond.geometry.attributes.position.array;
            positions[0] = atomA.position.x;
            positions[1] = atomA.position.y;
            positions[2] = atomA.position.z;
            positions[3] = atomB.position.x;
            positions[4] = atomB.position.y;
            positions[5] = atomB.position.z;
            
            bond.geometry.attributes.position.needsUpdate = true;
            
            // Bond strength visualization
            const distance = atomA.position.distanceTo(atomB.position);
            const freqIndex = Math.floor((index / bonds.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            bond.material.opacity = Math.max(0.2, 0.8 - distance * 0.1 + frequency * volume * 0.3);
        });
    }

    updateTornado(frequencyData, volume, dominantFrequency) {
        const tornadoGroup = this.objects.tornado;
        const particles = tornadoGroup.userData.particles;
        
        // Rotate tornado
        tornadoGroup.rotation.y += 0.05 * (1 + volume);
        
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        const originalPositions = particles.userData.originalPositions;
        const velocities = particles.userData.velocities;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Spiral motion
            const height = positions[i + 1];
            const radius = (1 - Math.abs(height) / 10) * 5;
            const angle = Date.now() * 0.005 + particleIndex * 0.1;
            const pullStrength = frequency * volume * 0.5;
            
            // Update positions with wind effect
            positions[i] += velocities[i] + Math.cos(angle) * pullStrength;
            positions[i + 1] += velocities[i + 1] * (1 + frequency * volume);
            positions[i + 2] += velocities[i + 2] + Math.sin(angle) * pullStrength;
            
            // Keep particles in tornado bounds
            if (positions[i + 1] > 10) {
                positions[i + 1] = -10;
                positions[i] = (Math.random() - 0.5) * 2;
                positions[i + 2] = (Math.random() - 0.5) * 2;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
    }

    updateCosmos(frequencyData, volume, dominantFrequency) {
        const cosmosGroup = this.objects.cosmos;
        const stars = cosmosGroup.userData.stars;
        const nebulas = cosmosGroup.userData.nebulas;
        
        // Rotate cosmos slowly
        cosmosGroup.rotation.y += 0.002 * (1 + volume * 0.3);
        
        // Update nebulas
        nebulas.forEach((nebula, index) => {
            const material = nebula.material;
            material.uniforms.time.value += 0.01;
            material.uniforms.audioLevel.value = volume;
            
            nebula.rotation.x += 0.001 * (1 + volume);
            nebula.rotation.y += 0.002 * (1 + volume);
        });
        
        // Twinkling stars
        const starColors = stars.geometry.attributes.color.array;
        for (let i = 0; i < starColors.length; i += 3) {
            const starIndex = i / 3;
            const freqIndex = Math.floor((starIndex / (starColors.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            if (Math.random() < frequency * volume * 0.1) {
                const brightness = 0.8 + frequency * volume * 0.2;
                starColors[i] = brightness;
                starColors[i + 1] = brightness;
                starColors[i + 2] = brightness;
            }
        }
        
        stars.geometry.attributes.color.needsUpdate = true;
    }

    updateLabyrinth(frequencyData, volume, timeDomainData) {
        const labyrinthGroup = this.objects.labyrinth;
        const walls = labyrinthGroup.userData.walls;
        
        walls.forEach((wall, index) => {
            const freqIndex = Math.floor((index / walls.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Wall height pulsing
            const scale = 1 + frequency * volume * 0.5;
            wall.scale.y = scale;
            
            // Glow effect
            const glowMaterial = wall.userData.glowMaterial;
            glowMaterial.opacity = 0.2 + frequency * volume * 0.3;
            
            // Color shifting
            const hue = (0.5 + wall.userData.x * 0.1 + wall.userData.z * 0.1 + Date.now() * 0.0005) % 1;
            wall.material.color.setHSL(hue, 0.8, 0.4 + frequency * 0.3);
            glowMaterial.color.copy(wall.material.color);
        });
    }

    updateWaterfall(frequencyData, volume, dominantFrequency) {
        const waterfallGroup = this.objects.waterfall;
        const streams = waterfallGroup.userData.streams;
        
        streams.forEach((stream, streamIndex) => {
            const droplets = stream.userData.droplets;
            const freqIndex = Math.floor((streamIndex / streams.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            droplets.forEach((droplet, dropletIndex) => {
                // Falling animation
                droplet.position.y -= droplet.userData.fallSpeed * (1 + frequency * volume);
                
                // Reset when off screen
                if (droplet.position.y < -10) {
                    droplet.position.y = 10;
                }
                
                // Horizontal sway
                const sway = Math.sin(Date.now() * 0.003 + dropletIndex) * frequency * volume * 0.3;
                droplet.position.x = (streamIndex - streams.length / 2) * 1.5 + sway;
                
                // Color and opacity
                const intensity = 0.7 + frequency * volume * 0.3;
                droplet.material.color.setHSL(0.5, 0.8, intensity);
                droplet.material.opacity = intensity;
                
                // Scale
                const scale = 1 + frequency * volume * 0.5;
                droplet.scale.setScalar(scale);
            });
        });
    }

    updateFire(frequencyData, volume, dominantFrequency) {
        const fireGroup = this.objects.fire;
        const flames = fireGroup.userData.flames;
        
        flames.forEach((flame, flameIndex) => {
            const particles = flame.userData.particles;
            const freqIndex = Math.floor((flameIndex / flames.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            particles.forEach((particle, particleIndex) => {
                // Flickering height
                const flickerPhase = particle.userData.flickerPhase + Date.now() * 0.01;
                const baseY = particle.userData.baseY;
                const flicker = Math.sin(flickerPhase) * frequency * volume * 0.5;
                
                particle.position.y = baseY + flicker;
                
                // Scale based on height and audio
                const heightFactor = 1 - (particleIndex / particles.length) * 0.5;
                const scale = heightFactor * (1 + frequency * volume);
                particle.scale.setScalar(scale);
                
                // Color intensity (hotter at base)
                const heatLevel = (particles.length - particleIndex) / particles.length;
                const hue = Math.max(0, 0.1 - particleIndex * 0.02 + frequency * 0.05);
                const brightness = 0.6 + heatLevel * 0.4 + frequency * volume * 0.2;
                
                particle.material.color.setHSL(hue, 0.9, brightness);
                particle.material.opacity = 0.8 - particleIndex * 0.03 + frequency * volume * 0.2;
                
                // Random horizontal movement
                if (Math.random() < frequency * volume * 0.3) {
                    particle.position.x += (Math.random() - 0.5) * 0.2;
                    particle.position.z += (Math.random() - 0.5) * 0.2;
                }
            });
        });
    }

    updateIce(frequencyData, volume, dominantFrequency) {
        const iceGroup = this.objects.ice;
        const crystals = iceGroup.userData.crystals;
        
        crystals.forEach((crystal, index) => {
            const freqIndex = Math.floor((index / crystals.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Rotation
            crystal.rotation.x += crystal.userData.rotationSpeed * (1 + frequency);
            crystal.rotation.y += crystal.userData.rotationSpeed * 0.7 * (1 + frequency);
            crystal.rotation.z += crystal.userData.rotationSpeed * 0.5 * (1 + frequency);
            
            // Scale pulsing
            const originalScale = crystal.userData.originalScale;
            const scale = 1 + frequency * volume * 0.3;
            crystal.scale.copy(originalScale).multiplyScalar(scale);
            
            // Color shifting with icy blues
            const hue = 0.55 + frequency * 0.1 + Math.sin(Date.now() * 0.001 + index) * 0.05;
            const lightness = 0.8 + frequency * volume * 0.2;
            crystal.material.color.setHSL(hue, 0.7, lightness);
            
            // Opacity effects
            crystal.material.opacity = 0.7 + frequency * volume * 0.3;
            
            // Floating effect
            const float = Math.sin(Date.now() * 0.002 + index * 0.5) * frequency * volume * 0.5;
            crystal.position.y += float * 0.1;
        });
    }

    updateDesert(frequencyData, volume, timeDomainData) {
        const desertGroup = this.objects.desert;
        const dunes = desertGroup.userData.dunes;
        const sand = desertGroup.userData.sand;
        
        // Update dune positions (heat shimmer effect)
        dunes.forEach((dune, index) => {
            const freqIndex = Math.floor((index / dunes.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            const originalPos = dune.userData.originalPosition;
            const shimmer = Math.sin(Date.now() * 0.005 + index) * frequency * volume * 0.1;
            
            dune.position.copy(originalPos);
            dune.position.y += shimmer;
            
            // Color temperature effects
            const hue = 0.1 + frequency * 0.02;
            const lightness = 0.5 + frequency * volume * 0.2;
            dune.material.color.setHSL(hue, 0.6, lightness);
        });
        
        // Update sand particles (wind effect)
        const sandGeometry = sand.geometry;
        const sandPositions = sandGeometry.attributes.position.array;
        const originalSandPositions = sand.userData.originalPositions;
        
        for (let i = 0; i < sandPositions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (sandPositions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Wind movement
            const windEffect = frequency * volume * 0.3;
            sandPositions[i] = originalSandPositions[i] + Math.sin(Date.now() * 0.002 + particleIndex) * windEffect;
            sandPositions[i + 1] = originalSandPositions[i + 1] + Math.cos(Date.now() * 0.003 + particleIndex) * windEffect * 0.5;
            sandPositions[i + 2] = originalSandPositions[i + 2] + Math.sin(Date.now() * 0.001 + particleIndex) * windEffect;
        }
        
        sandGeometry.attributes.position.needsUpdate = true;
    }

    updateVolcano(frequencyData, volume, dominantFrequency) {
        const volcanoGroup = this.objects.volcano;
        const embers = volcanoGroup.userData.embers;
        
        const geometry = embers.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const velocities = embers.userData.velocities;
        const ages = embers.userData.ages;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Update positions
            positions[i] += velocities[i] * (1 + frequency * volume);
            positions[i + 1] += velocities[i + 1] * (1 + frequency * volume);
            positions[i + 2] += velocities[i + 2] * (1 + frequency * volume);
            
            // Apply gravity
            velocities[i + 1] -= 0.01;
            
            // Age particles
            ages[particleIndex] += 0.01;
            
            // Reset particles
            if (positions[i + 1] < -12 || ages[particleIndex] > 1) {
                positions[i] = (Math.random() - 0.5) * 2;
                positions[i + 1] = -6;
                positions[i + 2] = (Math.random() - 0.5) * 2;
                
                velocities[i] = (Math.random() - 0.5) * 0.2;
                velocities[i + 1] = Math.random() * 0.3 + 0.1 + frequency * volume * 0.2;
                velocities[i + 2] = (Math.random() - 0.5) * 0.2;
                
                ages[particleIndex] = 0;
            }
            
            // Color cooling effect
            const age = ages[particleIndex];
            const temp = 1 - age;
            const hue = temp * 0.1; // Red to yellow to black
            const lightness = temp * (0.5 + frequency * volume * 0.3);
            
            const color = new THREE.Color().setHSL(hue, 0.9, lightness);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    updateForest(frequencyData, volume, timeDomainData) {
        const forestGroup = this.objects.forest;
        const trees = forestGroup.userData.trees;
        
        trees.forEach((tree, treeIndex) => {
            const leaves = tree.userData.leaves;
            const freqIndex = Math.floor((treeIndex / trees.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Tree swaying
            const sway = Math.sin(Date.now() * 0.002 + treeIndex) * frequency * volume * 0.02;
            tree.rotation.z = sway;
            
            // Leaf movement
            leaves.forEach((leaf, leafIndex) => {
                const swayPhase = leaf.userData.swayPhase + Date.now() * 0.003;
                const originalPos = leaf.userData.originalPosition;
                
                const leafSway = Math.sin(swayPhase) * frequency * volume * 0.3;
                leaf.position.copy(originalPos);
                leaf.position.x += leafSway;
                leaf.position.y += Math.cos(swayPhase * 1.2) * frequency * volume * 0.1;
                
                // Color variation (seasonal effects)
                const hue = 0.3 + Math.sin(Date.now() * 0.0005 + leafIndex) * frequency * 0.1;
                const lightness = 0.5 + frequency * volume * 0.2;
                leaf.material.color.setHSL(hue, 0.7, lightness);
                
                // Transparency for wind effect
                leaf.material.opacity = 0.7 + frequency * volume * 0.3;
            });
        });
    }

    updateCyberpunk(frequencyData, volume, dominantFrequency) {
        const cyberpunkGroup = this.objects.cyberpunk;
        const lines = cyberpunkGroup.userData.lines;
        const dataStreams = cyberpunkGroup.userData.dataStreams;
        
        // Update grid lines
        lines.forEach((line, index) => {
            const freqIndex = Math.floor((index / lines.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Pulsing opacity
            line.material.opacity = 0.6 + frequency * volume * 0.4;
            
            // Color shifting
            const hue = 0.7 + frequency * 0.3;
            line.material.color.setHSL(hue, 0.8, 0.3 + frequency * 0.4);
        });
        
        // Update data streams
        dataStreams.forEach((stream, index) => {
            const freqIndex = Math.floor((index / dataStreams.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Movement
            const direction = stream.userData.direction;
            const speed = stream.userData.speed * (1 + frequency * volume * 2);
            
            stream.position.x += Math.cos(direction) * speed;
            stream.position.z += Math.sin(direction) * speed;
            
            // Wrap around edges
            if (Math.abs(stream.position.x) > 12.5) stream.position.x *= -1;
            if (Math.abs(stream.position.z) > 12.5) stream.position.z *= -1;
            
            // Scale and glow
            const scale = 1 + frequency * volume * 2;
            stream.scale.setScalar(scale);
            
            // Color intensity
            const intensity = 0.8 + frequency * volume * 0.2;
            stream.material.color.setRGB(0, intensity, intensity);
        });
    }

    updateRetro(frequencyData, volume, dominantFrequency) {
        const retroGroup = this.objects.retro;
        const grid = retroGroup.userData.grid;
        const mountains = retroGroup.userData.mountains;
        
        // Update grid shader
        const gridMaterial = grid.material;
        gridMaterial.uniforms.time.value += 0.03 * (1 + volume);
        gridMaterial.uniforms.audioLevel.value = volume;
        
        // Mountain effects
        mountains.forEach((mountain, index) => {
            const freqIndex = Math.floor((index / mountains.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Scale pulsing
            const scale = 1 + frequency * volume * 0.3;
            mountain.scale.setScalar(scale);
            
            // Neon glow intensity
            const hue = 0.8 + frequency * 0.2;
            const brightness = 0.4 + frequency * volume * 0.4;
            mountain.material.color.setHSL(hue, 0.8, brightness);
            
            // Slight floating
            const float = Math.sin(Date.now() * 0.002 + index) * frequency * volume * 0.2;
            mountain.position.y += float * 0.1;
        });
    }

    updateAbstract(frequencyData, volume, dominantFrequency) {
        const abstractGroup = this.objects.abstract;
        const flows = abstractGroup.userData.flows;
        
        flows.forEach((flow, index) => {
            const freqIndex = Math.floor((index / flows.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Morphing rotation
            const morphPhase = flow.userData.morphPhase + Date.now() * 0.002;
            flow.rotation.x = Math.sin(morphPhase) * frequency * volume;
            flow.rotation.y += 0.01 * (1 + frequency);
            flow.rotation.z = Math.cos(morphPhase * 1.3) * frequency * volume * 0.5;
            
            // Scale variations
            const scale = 1 + frequency * volume * 0.5;
            flow.scale.setScalar(scale);
            
            // Color morphing
            const hue = (index / flows.length + Date.now() * 0.0003 + frequency) % 1;
            const saturation = 0.8 + frequency * 0.2;
            const lightness = 0.6 + frequency * volume * 0.3;
            
            flow.material.color.setHSL(hue, saturation, lightness);
            
            // Opacity pulsing
            flow.material.opacity = 0.7 + frequency * volume * 0.3;
            
            // Position floating
            const float = Math.sin(Date.now() * 0.001 + index * 0.5) * frequency * volume;
            flow.position.y += float * 0.05;
        });
    }

    updateMechanical(frequencyData, volume, dominantFrequency) {
        const mechanicalGroup = this.objects.mechanical;
        const gears = mechanicalGroup.userData.gears;
        const steam = mechanicalGroup.userData.steam;
        
        // Update gears
        gears.forEach((gear, index) => {
            const freqIndex = Math.floor((index / gears.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Rotation based on audio
            const rotationSpeed = gear.userData.rotationSpeed * (1 + frequency * volume * 2);
            gear.rotation.z += rotationSpeed;
            
            // Scale pulsing
            const scale = 1 + frequency * volume * 0.2;
            gear.scale.setScalar(scale);
            
            // Metallic color variations
            const hue = 0.1 + frequency * 0.05;
            const lightness = 0.4 + frequency * volume * 0.3;
            gear.material.color.setHSL(hue, 0.6, lightness);
        });
        
        // Update steam particles
        const steamGeometry = steam.geometry;
        const steamPositions = steamGeometry.attributes.position.array;
        const originalSteamPositions = steam.userData.originalPositions;
        
        for (let i = 0; i < steamPositions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (steamPositions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Steam rising
            steamPositions[i + 1] += 0.05 * (1 + frequency * volume);
            
            // Steam dissipation
            if (steamPositions[i + 1] > 15) {
                steamPositions[i] = (Math.random() - 0.5) * 20;
                steamPositions[i + 1] = 0;
                steamPositions[i + 2] = (Math.random() - 0.5) * 20;
            }
            
            // Horizontal drift
            steamPositions[i] += Math.sin(Date.now() * 0.001 + particleIndex) * frequency * volume * 0.02;
            steamPositions[i + 2] += Math.cos(Date.now() * 0.001 + particleIndex) * frequency * volume * 0.02;
        }
        
        steamGeometry.attributes.position.needsUpdate = true;
    }

    updateUnderwater(frequencyData, volume, dominantFrequency) {
        const underwaterGroup = this.objects.underwater;
        const water = underwaterGroup.userData.water;
        const bubbles = underwaterGroup.userData.bubbles;
        
        // Update water shader
        water.material.uniforms.time.value += 0.02 * (1 + volume);
        water.material.uniforms.audioLevel.value = volume;
        
        // Animate bubbles
        const geometry = bubbles.geometry;
        const positions = geometry.attributes.position.array;
        const originalPositions = bubbles.userData.originalPositions;
        
        for (let i = 0; i < positions.length; i += 3) {
            const bubbleIndex = i / 3;
            const freqIndex = Math.floor((bubbleIndex / (positions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Bubble rise with audio influence
            positions[i] = originalPositions[i] + Math.sin(Date.now() * 0.002 + bubbleIndex) * frequency * volume;
            positions[i + 1] += 0.02 * (1 + frequency * volume);
            positions[i + 2] = originalPositions[i + 2] + Math.cos(Date.now() * 0.003 + bubbleIndex) * frequency * volume;
            
            // Reset bubbles that reach surface
            if (positions[i + 1] > 10) {
                positions[i + 1] = -5;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
    }

    updateConstellation(frequencyData, volume, dominantFrequency) {
        const constellationGroup = this.objects.constellation;
        const stars = constellationGroup.userData.stars;
        const connections = constellationGroup.userData.connections;
        
        stars.forEach((star, index) => {
            const freqIndex = Math.floor((index / stars.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Twinkling effect
            const twinkle = Math.sin(Date.now() * 0.01 + star.userData.twinklePhase) * 0.5 + 0.5;
            star.material.opacity = star.userData.baseOpacity * (0.5 + twinkle * frequency * volume);
            
            // Color shift based on audio
            const hue = (frequency + Date.now() * 0.0001) % 1;
            star.material.color.setHSL(0.6 + hue * 0.4, 0.8, 0.9);
        });
        
        // Update connection opacity
        connections.forEach((connection, index) => {
            const freqIndex = Math.floor((index / connections.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            connection.material.opacity = 0.2 + frequency * volume * 0.3;
        });
    }

    updateBlackHole(frequencyData, volume, dominantFrequency) {
        const blackholeGroup = this.objects.blackhole;
        const eventHorizon = blackholeGroup.userData.eventHorizon;
        const accretionDisk = blackholeGroup.userData.accretionDisk;
        const particles = blackholeGroup.userData.particles;
        
        // Rotate accretion disk
        accretionDisk.rotation.z += 0.02 * (1 + volume);
        accretionDisk.material.uniforms.time.value += 0.03;
        accretionDisk.material.uniforms.audioLevel.value = volume;
        
        // Pulse event horizon
        const scale = 1 + volume * 0.2;
        eventHorizon.scale.setScalar(scale);
        
        // Animate spiraling particles
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Spiral inward toward black hole
            const centerX = 0, centerZ = 0;
            const dx = positions[i] - centerX;
            const dz = positions[i + 2] - centerZ;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            if (distance < 2) {
                // Reset particle if it gets too close
                const angle = Math.random() * Math.PI * 2;
                positions[i] = Math.cos(angle) * (8 + Math.random() * 12);
                positions[i + 2] = Math.sin(angle) * (8 + Math.random() * 12);
            } else {
                // Pull toward center with spiral motion
                const pullStrength = 0.02 * (1 + volume);
                positions[i] -= dx * pullStrength;
                positions[i + 2] -= dz * pullStrength;
                
                // Add spiral motion
                const angle = Math.atan2(dz, dx);
                positions[i] += Math.cos(angle + Math.PI / 2) * pullStrength * 0.5;
                positions[i + 2] += Math.sin(angle + Math.PI / 2) * pullStrength * 0.5;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
    }

    updatePrism(frequencyData, volume, dominantFrequency) {
        const prismGroup = this.objects.prism;
        const prisms = prismGroup.userData.prisms;
        const lightRays = prismGroup.userData.lightRays;
        
        // Rotate prisms
        prisms.forEach((prism, index) => {
            const freqIndex = Math.floor((index / prisms.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            prism.rotation.x += frequency * volume * 0.02;
            prism.rotation.y += frequency * volume * 0.015;
            
            // Scale based on audio
            const scale = 1 + frequency * volume * 0.5;
            prism.scale.setScalar(scale);
        });
        
        // Animate light rays
        lightRays.forEach((ray, index) => {
            const freqIndex = Math.floor((index / lightRays.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Update ray intensity
            ray.material.opacity = 0.7 + frequency * volume * 0.3;
        });
    }

    updateQuantum(frequencyData, volume, dominantFrequency) {
        const quantumGroup = this.objects.quantum;
        const quantumField = quantumGroup.userData.quantumField;
        const entangledPairs = quantumGroup.userData.entangledPairs;
        
        // Update quantum field
        quantumField.material.uniforms.time.value += 0.05 * (1 + volume);
        quantumField.material.uniforms.audioLevel.value = volume;
        
        // Animate entangled particles
        entangledPairs.forEach((pair, pairIndex) => {
            const freqIndex = Math.floor((pairIndex / entangledPairs.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            pair.forEach((particle, particleIndex) => {
                // Quantum entanglement - particles mirror each other's behavior
                const phase = Date.now() * 0.003 + particle.userData.oscillationPhase;
                const entanglement = particleIndex === 0 ? 1 : -1;
                
                const oscillation = Math.sin(phase) * frequency * volume * 2 * entanglement;
                particle.position.y += oscillation * 0.1;
                
                // Scale pulsing
                const scale = 1 + frequency * volume * 0.3;
                particle.scale.setScalar(scale);
            });
        });
    }

    updateEcosystem(frequencyData, volume, dominantFrequency) {
        const ecosystemGroup = this.objects.ecosystem;
        const organisms = ecosystemGroup.userData.organisms;
        
        organisms.forEach((organism, index) => {
            const freqIndex = Math.floor((index / organisms.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Movement based on audio
            const movementSpeed = frequency * volume * 0.02;
            organism.position.add(organism.userData.velocity.clone().multiplyScalar(movementSpeed));
            
            // Update velocity randomly
            if (Math.random() < 0.05) {
                organism.userData.velocity.set(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.1
                );
            }
            
            // Scale based on audio
            const scale = 1 + frequency * volume * 0.3;
            organism.scale.copy(organism.userData.originalScale).multiplyScalar(scale);
            
            // Boundary check
            if (organism.position.length() > 15) {
                organism.position.multiplyScalar(0.8);
            }
        });
    }

    updateTexturePortal(frequencyData, volume, dominantFrequency) {
        const portalGroup = this.objects.texturePortal;
        const portal = portalGroup.userData.portal;
        const particles = portalGroup.userData.particles;
        const beams = portalGroup.userData.beams;
        const portalMaterial = portalGroup.userData.portalMaterial;
        
        // Update portal shader uniforms
        portalMaterial.uniforms.time.value += 0.02 * (1 + volume);
        portalMaterial.uniforms.audioLevel.value = volume;
        
        // Rotate the main portal
        portal.rotation.z += 0.01 * (1 + volume);
        
        // Scale portal based on bass
        const bassFreq = frequencyData.slice(0, Math.floor(frequencyData.length * 0.1));
        const bassLevel = bassFreq.reduce((sum, val) => sum + val, 0) / (bassFreq.length * 255);
        const portalScale = 1 + bassLevel * volume * 0.5;
        portal.scale.setScalar(portalScale);
        
        // Animate surrounding particles
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const originalPositions = particles.userData.originalPositions;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Orbital motion with audio influence
            const time = Date.now() * 0.001;
            const baseAngle = (particleIndex / (positions.length / 3)) * Math.PI * 2;
            const orbitSpeed = 0.5 + frequency * volume;
            const currentAngle = baseAngle + time * orbitSpeed;
            
            const radius = 6 + Math.sin(time * 2 + particleIndex) * frequency * volume * 2;
            positions[i] = Math.cos(currentAngle) * radius;
            positions[i + 1] = originalPositions[i + 1] + Math.sin(time * 3 + particleIndex) * frequency * volume;
            positions[i + 2] = Math.sin(currentAngle) * radius;
            
            // Color intensity based on frequency
            const intensity = 0.6 + frequency * volume * 0.4;
            colors[i] *= intensity;
            colors[i + 1] *= intensity;
            colors[i + 2] *= intensity;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        
        // Animate energy beams
        beams.forEach((beam, index) => {
            const freqIndex = Math.floor((index / beams.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] / 255;
            
            // Update beam opacity and color
            beam.material.opacity = 0.5 + frequency * volume * 0.5;
            
            // Animate beam endpoints
            const positions = beam.geometry.attributes.position.array;
            const angle = beam.userData.angle + Date.now() * 0.001 * (1 + frequency);
            const distance = 10 + frequency * volume * 3;
            
            positions[0] = Math.cos(angle) * distance;
            positions[1] = Math.sin(angle * 2) * 2;
            positions[2] = Math.sin(angle) * distance;
            
            beam.geometry.attributes.position.needsUpdate = true;
            
            // Color cycling
            const hue = (index / beams.length + Date.now() * 0.0005) % 1;
            beam.material.color.setHSL(hue, 0.8, 0.6 + frequency * 0.2);
        });
        
        // Rotate entire group for additional dynamics
        portalGroup.rotation.y += 0.005 * (1 + volume * 0.5);
    }

    updateJRJ3D(frequencyData, volume, dominantFrequency) {
        const params = this.animationParams.jrj3D;
        const galleryGroup = this.objects.jrj3D;
        
        if (!galleryGroup || !galleryGroup.userData.layers) {
            console.warn('JRJ3D gallery group or layers not found');
            return;
        }
        
        const layers = galleryGroup.userData.layers;
        const ambientLight = galleryGroup.userData.ambientLight;
        const pointLight = galleryGroup.userData.pointLight;
        const textGroup = galleryGroup.userData.textGroup;
        const textMeshes = galleryGroup.userData.textMeshes;
        
        // Rotate the entire group slightly for 3D effect
        galleryGroup.rotation.y += params.rotationSpeed * (1 + volume * 0.5);
        galleryGroup.rotation.x = Math.sin(this.elapsedTime * 0.3) * 0.1;
        
        // Animate individual layers with depth effect
        layers.forEach((layer, index) => {
            const originalX = layer.userData.originalX;
            const originalY = layer.userData.originalY;
            const originalZ = layer.userData.originalZ;
            
            // Gentle audio-reactive positioning
            const freqIndex = Math.floor((index / layers.length) * frequencyData.length);
            const freq = frequencyData[freqIndex] / 255;
            
            // Subtle parallax movement based on audio
            layer.position.x = originalX + Math.sin(this.elapsedTime + index) * 0.2 + freq * volume * 0.3;
            layer.position.y = originalY + Math.cos(this.elapsedTime * 0.8 + index) * 0.15 + freq * volume * 0.2;
            
            // Depth effect animation
            const depthOffset = Math.sin(this.elapsedTime * 0.5 + index * 0.5) * params.depthEffect;
            layer.position.z = originalZ + depthOffset + freq * volume * 0.5;
            
            // Gentle scaling based on audio
            const scale = 1 + freq * volume * 0.1;
            layer.scale.setScalar(scale);
            
            // Images remain fully opaque - no transparency changes
        });
        
        // Animate lighting based on audio
        ambientLight.intensity = params.lightingIntensity * 0.6 + volume * 0.4;
        
        // Move point light in a circle for dynamic lighting
        const lightRadius = 8;
        pointLight.position.x = Math.cos(this.elapsedTime * 0.7) * lightRadius;
        pointLight.position.z = Math.sin(this.elapsedTime * 0.7) * lightRadius + 10;
        pointLight.intensity = params.lightingIntensity + volume * 0.5;
        
        // Color cycling for point light based on dominant frequency
        const hue = (dominantFrequency / 1000) % 1;
        pointLight.color.setHSL(hue, 0.5, 0.8);
        
        // Animate orbiting "ENTERPRISES" text
        if (textMeshes && textMeshes.length > 0) {
            textMeshes.forEach((letterMesh, index) => {
                const originalAngle = letterMesh.userData.orbitAngle;
                const originalRadius = letterMesh.userData.orbitRadius;
                
                // Orbit animation with audio reactivity
                const orbitSpeed = 0.02 * (1 + volume * 0.5);
                const currentAngle = originalAngle + this.elapsedTime * orbitSpeed;
                
                // Vary radius slightly based on audio frequency
                const freqIndex = Math.floor((index / textMeshes.length) * frequencyData.length);
                const freq = frequencyData[freqIndex] / 255;
                const radiusVariation = originalRadius + freq * volume * 2;
                
                // Calculate orbital position
                letterMesh.position.x = Math.cos(currentAngle) * radiusVariation;
                letterMesh.position.y = Math.sin(currentAngle) * radiusVariation;
                
                // Add vertical bobbing motion
                letterMesh.position.z = Math.sin(this.elapsedTime * 2 + index * 0.5) * 2 + freq * volume * 3;
                
                // Rotate letters to face center while adding audio-reactive spin
                letterMesh.lookAt(0, 0, 0);
                letterMesh.rotation.z += freq * volume * 0.1;
                
                // Color cycling based on audio
                const letterHue = (hue + index * 0.1) % 1;
                letterMesh.material.color.setHSL(letterHue, 0.8, 0.6 + freq * 0.4);
                
                // Scale based on audio
                const scale = 1 + freq * volume * 0.3;
                letterMesh.scale.setScalar(scale);
            });
            
            // Rotate the entire text group for additional motion
            textGroup.rotation.z += 0.005 * (1 + volume);
        }
    }

    updateAggregatronCore(frequencyData, volume, dominantFrequency) {
        const params = this.animationParams.aggregatron;
        const aggregatronGroup = this.objects.aggregatron;
        
        if (!aggregatronGroup || !aggregatronGroup.userData.coreSphere) {
            console.warn('Aggregatron core group not found');
            return;
        }
        
        const coreSphere = aggregatronGroup.userData.coreSphere;
        const orbitingCubes = aggregatronGroup.userData.orbitingCubes;
        const energyBeams = aggregatronGroup.userData.energyBeams;
        const particles = aggregatronGroup.userData.particles;
        const particleGeometry = aggregatronGroup.userData.particleGeometry;
        
        // Animate core sphere
        coreSphere.rotation.x += params.rotationSpeed * (1 + volume);
        coreSphere.rotation.y += params.rotationSpeed * 0.7;
        
        // Pulsate core based on bass
        const bassFreq = frequencyData.slice(0, Math.floor(frequencyData.length * 0.1));
        const bassLevel = bassFreq.reduce((sum, val) => sum + val, 0) / (bassFreq.length * 255);
        const coreScale = params.coreScale + bassLevel * volume * params.pulseIntensity;
        coreSphere.scale.setScalar(coreScale);
        
        // Animate core material emission
        coreSphere.material.emissive.setRGB(bassLevel * volume, bassLevel * volume * 0.5, bassLevel * volume * 2);
        
        // Animate orbiting cubes
        orbitingCubes.forEach((cube, index) => {
            const originalAngle = cube.userData.orbitAngle;
            const cubeIndex = cube.userData.cubeIndex;
            
            // Orbit animation with audio reactivity
            const orbitSpeed = params.rotationSpeed * (1 + volume * 0.8);
            const currentAngle = originalAngle + this.elapsedTime * orbitSpeed;
            
            // Get frequency for this cube
            const freqIndex = Math.floor((cubeIndex / orbitingCubes.length) * frequencyData.length);
            const freq = frequencyData[freqIndex] / 255;
            
            // Animate orbit radius based on frequency
            const orbitRadius = params.orbitRadius + freq * volume * 5;
            
            // Calculate position
            cube.position.x = Math.cos(currentAngle) * orbitRadius;
            cube.position.z = Math.sin(currentAngle) * orbitRadius;
            cube.position.y = Math.sin(currentAngle * 2 + this.elapsedTime) * 3 + freq * volume * 4;
            
            // Rotate cubes
            cube.rotation.x += 0.02 + freq * volume * 0.1;
            cube.rotation.y += 0.015 + freq * volume * 0.08;
            cube.rotation.z += 0.01 + freq * volume * 0.05;
            
            // Scale based on frequency
            const scale = 1 + freq * volume * 0.5;
            cube.scale.setScalar(scale);
            
            // Color cycling
            const hue = (cubeIndex / orbitingCubes.length + this.elapsedTime * 0.1) % 1;
            cube.material.color.setHSL(hue, 0.8 + freq * 0.2, 0.6 + freq * volume * 0.3);
        });
        
        // Animate energy beams
        energyBeams.forEach((beam, index) => {
            const beamIndex = beam.userData.beamIndex;
            const freqIndex = Math.floor((beamIndex / energyBeams.length) * frequencyData.length);
            const freq = frequencyData[freqIndex] / 255;
            
            // Update beam endpoints
            const positions = beam.geometry.attributes.position.array;
            const angle = this.elapsedTime * 0.5 + beamIndex;
            const distance = 15 + freq * volume * 10;
            
            // Beam from core to dynamic endpoint
            positions[3] = Math.cos(angle) * distance;
            positions[4] = Math.sin(angle * 1.5) * distance * 0.5;
            positions[5] = Math.sin(angle) * distance;
            
            beam.geometry.attributes.position.needsUpdate = true;
            
            // Animate beam opacity and color
            beam.material.opacity = 0.3 + freq * volume * 0.7;
            const hue = (beamIndex / energyBeams.length + this.elapsedTime * 0.2) % 1;
            beam.material.color.setHSL(hue, 1.0, 0.5 + freq * 0.5);
        });
        
        // Animate particle field
        const positions = particleGeometry.attributes.position.array;
        const colors = particleGeometry.attributes.color.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const freq = frequencyData[freqIndex] / 255;
            
            // Create swirling motion
            const angle = this.elapsedTime * 0.3 + particleIndex * 0.1;
            const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
            
            positions[i] = Math.cos(angle) * radius;
            positions[i + 2] = Math.sin(angle) * radius;
            positions[i + 1] += Math.sin(this.elapsedTime + particleIndex) * 0.05;
            
            // Update particle colors based on audio
            colors[i] = 0.2 + freq * volume * 0.5;
            colors[i + 1] = 0.4 + freq * volume * 0.4;
            colors[i + 2] = 0.8 + freq * volume * 0.2;
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
        particleGeometry.attributes.color.needsUpdate = true;
        
        // Rotate entire group
        aggregatronGroup.rotation.y += params.rotationSpeed * 0.3 * (1 + volume);
    }

    updateAggregatronGlow(frequencyData, volume, dominantFrequency) {
        const params = this.animationParams.aggregatronGlow;
        const glowGroup = this.objects.aggregatronGlow;
        
        if (!glowGroup || !glowGroup.userData.logoGroup) {
            console.warn('Aggregatron Glow group not found');
            return;
        }
        
        const logoGroup = glowGroup.userData.logoGroup;
        const frontMesh = glowGroup.userData.frontMesh;
        const backMesh = glowGroup.userData.backMesh;
        const glowLayers = glowGroup.userData.glowLayers;
        const particles = glowGroup.userData.particles;
        const particleGeometry = glowGroup.userData.particleGeometry;
        
        // Subtle floating motion
        const floatOffset = Math.sin(this.elapsedTime * params.floatSpeed) * params.floatAmplitude;
        glowGroup.position.y = floatOffset;
        
        // Very gentle rotation based on audio
        glowGroup.rotation.z = Math.sin(this.elapsedTime * 0.2) * 0.02 + volume * 0.01;
        glowGroup.rotation.y += params.rotationSpeed * (1 + volume * 0.3);
        
        // Gentle scaling based on bass
        const bassFreq = frequencyData.slice(0, Math.floor(frequencyData.length * 0.1));
        const bassLevel = bassFreq.reduce((sum, val) => sum + val, 0) / (bassFreq.length * 255);
        const scaleAmount = 1 + bassLevel * volume * 0.05; // Very subtle scaling
        logoGroup.scale.setScalar(scaleAmount);
        
        // Enhanced glow intensity and shimmer effect
        const glowIntensity = params.glowIntensity * (1 + volume * 1.2); // Increased intensity
        const shimmerEffect = Math.sin(this.elapsedTime * 4) * 0.3 + 0.7; // Pulsing shimmer
        
        // Animate multiple glow layers for intense effect
        glowLayers.forEach((glowMesh, index) => {
            const layerIntensity = (glowIntensity + shimmerEffect) * (1 - index * 0.2);
            glowMesh.material.opacity = Math.min(0.8, 0.3 + volume * 0.6 * layerIntensity);
            glowMesh.scale.setScalar(scaleAmount * (1.2 + index * 0.1));
            
            // Individual layer color cycling for rainbow effect
            const layerHue = ((dominantFrequency / 2000) + index * 0.1 + this.elapsedTime * 0.1) % 1;
            glowMesh.material.color.setHSL(layerHue, 0.7, 0.9);
        });
        
        // Subtle logo material emissive glow - more prominent
        if (frontMesh.material.emissive !== undefined) {
            const emissiveIntensity = volume * 0.3 + shimmerEffect * 0.2;
            frontMesh.material.emissive = frontMesh.material.emissive || new THREE.Color();
            frontMesh.material.emissive.setRGB(
                emissiveIntensity * 0.3,
                emissiveIntensity * 0.5,
                emissiveIntensity * 0.8
            );
        }
        
        if (backMesh.material.emissive !== undefined) {
            const emissiveIntensity = volume * 0.3 + shimmerEffect * 0.2;
            backMesh.material.emissive = backMesh.material.emissive || new THREE.Color();
            backMesh.material.emissive.setRGB(
                emissiveIntensity * 0.3,
                emissiveIntensity * 0.5,
                emissiveIntensity * 0.8
            );
        }
        
        // Animate ambient particles
        const positions = particleGeometry.attributes.position.array;
        const colors = particleGeometry.attributes.color.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            
            // Gentle orbital motion
            const angle = this.elapsedTime * 0.1 + particleIndex * 0.1;
            const originalRadius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
            
            positions[i] = Math.cos(angle) * originalRadius;
            positions[i + 2] = Math.sin(angle) * originalRadius;
            
            // Gentle vertical bobbing
            positions[i + 1] += Math.sin(this.elapsedTime * 0.5 + particleIndex * 0.2) * 0.02;
            
            // Subtle color variations based on audio
            const freqIndex = Math.floor((particleIndex / (positions.length / 3)) * frequencyData.length);
            const freq = frequencyData[freqIndex] / 255;
            
            colors[i] = 0.8 + freq * volume * 0.2;     // R
            colors[i + 1] = 0.9 + freq * volume * 0.1; // G
            colors[i + 2] = 1.0;                       // B (keep blue constant)
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
        particleGeometry.attributes.color.needsUpdate = true;
        
        // Adjust particle opacity based on volume
        particles.material.opacity = 0.3 + volume * 0.3;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clean up Three.js objects
        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.renderer.dispose();
    }
}
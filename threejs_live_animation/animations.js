class AudioAnimations {
    constructor() {
        this.sensitivity = 1.0;
        this.animationMode = 'cubes';
        this.isActive = false;
        
        // Animation parameters
        this.params = {
            cubes: {
                scaleMultiplier: 3,
                rotationSpeed: 0.01,
                colorShift: true,
                heightVariation: true
            },
            sphere: {
                deformationStrength: 0.5,
                rotationSpeed: 0.01,
                scaleVariation: 0.3,
                vertexDisplacement: true
            },
            particles: {
                movementRange: 2,
                colorShift: true,
                sizeVariation: true,
                spiralMotion: true
            },
            waves: {
                amplitude: 2,
                frequency: 0.5,
                rippleSpeed: 0.001,
                heightVariation: true
            },
            helix: {
                helixRadius: 3,
                helixHeight: 10,
                rotationSpeed: 0.02,
                pulseStrength: 2
            },
            tunnel: {
                tunnelLength: 20,
                segmentCount: 50,
                radius: 5,
                pulsation: 3
            },
            galaxy: {
                arms: 4,
                armLength: 8,
                particleCount: 1000,
                rotationSpeed: 0.005
            },
            tree: {
                branches: 6,
                maxDepth: 5,
                branchLength: 2,
                angleVariation: 0.5
            },
            crystals: {
                crystalCount: 12,
                growthRate: 2,
                geometryVariation: true,
                colorShift: true
            },
            rings: {
                ringCount: 15,
                maxRadius: 8,
                thickness: 0.1,
                expansionRate: 2
            },
            bars: {
                barCount: 64,
                maxHeight: 8,
                spacing: 0.3,
                colorGradient: true
            },
            matrix: {
                columns: 20,
                dropSpeed: 0.1,
                glyphCount: 50,
                fadeRate: 0.02
            },
            plasma: {
                gridSize: 32,
                waveSpeed: 0.02,
                colorCycleSpeed: 0.01,
                amplitude: 2
            },
            vortex: {
                spiralCount: 8,
                particleCount: 800,
                rotationSpeed: 0.03,
                pullStrength: 0.5
            },
            neural: {
                nodeCount: 50,
                connectionProbability: 0.3,
                pulseSpeed: 0.05,
                networkRadius: 8
            },
            kaleidoscope: {
                segments: 6,
                reflectionDepth: 3,
                rotationSpeed: 0.02,
                colorShift: 0.01
            },
            lightning: {
                boltCount: 12,
                branchProbability: 0.4,
                flickerRate: 0.3,
                maxLength: 10
            },
            ocean: {
                waveCount: 64,
                amplitude: 3,
                frequency: 0.02,
                foamParticles: 200
            },
            fractal: {
                iterations: 5,
                complexity: 8,
                rotationSpeed: 0.01,
                zoomFactor: 1.5
            },
            spiral: {
                armCount: 3,
                spiralTightness: 0.3,
                particleCount: 500,
                growthRate: 0.02
            },
            aurora: {
                waveCount: 12,
                layerCount: 4,
                shimmerRate: 0.03,
                colorShiftSpeed: 0.01
            },
            cityscape: {
                buildingCount: 50,
                maxHeight: 15,
                windowDensity: 0.6,
                lightFlickerRate: 0.2
            },
            molecules: {
                atomCount: 30,
                bondLength: 2,
                vibrationRate: 0.05,
                electronSpeed: 0.1
            },
            tornado: {
                particleCount: 1000,
                spiralCount: 3,
                height: 20,
                rotationSpeed: 0.05
            },
            cosmos: {
                starCount: 800,
                nebulaLayers: 3,
                galaxyCount: 5,
                twinkleRate: 0.02
            },
            labyrinth: {
                mazeSize: 20,
                wallHeight: 3,
                pathWidth: 1,
                glowIntensity: 0.5
            },
            waterfall: {
                streamCount: 15,
                dropletCount: 300,
                fallSpeed: 0.2,
                mistParticles: 100
            },
            fire: {
                flameCount: 25,
                particleCount: 400,
                flameHeight: 8,
                flickerRate: 0.15
            },
            ice: {
                crystalCount: 40,
                shardCount: 200,
                reflectionIntensity: 0.8,
                freezeRate: 0.03
            },
            desert: {
                duneCount: 8,
                sandParticles: 600,
                windSpeed: 0.02,
                heatShimmer: 0.1
            },
            volcano: {
                lavaFlows: 6,
                emberCount: 500,
                eruptionHeight: 12,
                coolingRate: 0.05
            },
            forest: {
                treeCount: 25,
                leafParticles: 300,
                branchDepth: 4,
                swayRate: 0.02
            },
            cyberpunk: {
                gridSize: 25,
                circuitDensity: 0.4,
                dataStreamCount: 20,
                scanlineSpeed: 0.1
            },
            retro: {
                waveHeight: 5,
                gridLines: 30,
                neonIntensity: 0.8,
                synthSpeed: 0.03
            },
            abstract: {
                flowCount: 15,
                complexity: 6,
                morphRate: 0.02,
                colorCycles: 3
            },
            mechanical: {
                gearCount: 12,
                pistonCount: 8,
                rotationSpeeds: [0.02, 0.03, 0.05],
                steamParticles: 150
            },
            underwater: {
                bubbleCount: 300,
                currentStrength: 0.5,
                causticSpeed: 0.02,
                fishCount: 12
            },
            constellation: {
                starCount: 200,
                connectionDistance: 8,
                twinkleSpeed: 0.01,
                orbitRadius: 15
            },
            blackhole: {
                particleCount: 800,
                eventHorizon: 2,
                spiralSpeed: 0.03,
                accretionDisk: true
            },
            prism: {
                prismCount: 8,
                lightRays: 24,
                refractionIntensity: 0.8,
                spectrumShift: 0.02
            },
            quantum: {
                fieldIntensity: 1.2,
                particleInterference: true,
                waveFunction: 0.05,
                entanglement: 6
            },
            ecosystem: {
                organisms: 25,
                foodChain: 3,
                growthRate: 0.02,
                biodiversity: 0.8
            },
            texturePortal: {
                portalSize: 8,
                particleCount: 500,
                rotationSpeed: 0.01,
                waveIntensity: 1.5,
                colorShift: true
            },
            jrj3D: {
                layerCount: 5,
                layerSpacing: 2,
                rotationSpeed: 0.005,
                depthEffect: 0.3,
                lightingIntensity: 1.2
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
        
        // Performance optimization
        this.frameCount = 0;
        this.updateInterval = 1; // Update every frame by default
        
        // Audio response filters
        this.bassResponse = 0;
        this.midResponse = 0;
        this.trebleResponse = 0;
        this.lastUpdateTime = 0;
    }

    setSensitivity(value) {
        this.sensitivity = Math.max(0.1, Math.min(5.0, value));
    }

    setAnimationMode(mode) {
        this.animationMode = mode;
    }

    setActive(active) {
        this.isActive = active;
    }

    updateParameters(mode, params) {
        if (this.params[mode]) {
            Object.assign(this.params[mode], params);
        }
    }

    processAudioData(audioData) {
        if (!this.isActive || !audioData) return null;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;
        
        // Extract frequency bands
        const bass = this.extractFrequencyRange(audioData.frequencyData, 0, 0.1);
        const mid = this.extractFrequencyRange(audioData.frequencyData, 0.1, 0.5);
        const treble = this.extractFrequencyRange(audioData.frequencyData, 0.5, 1.0);
        
        // Apply smoothing to frequency responses
        this.bassResponse = this.smoothValue(this.bassResponse, bass, 0.3);
        this.midResponse = this.smoothValue(this.midResponse, mid, 0.3);
        this.trebleResponse = this.smoothValue(this.trebleResponse, treble, 0.3);
        
        // Create processed audio data with enhanced parameters
        return {
            ...audioData,
            bass: this.bassResponse * this.sensitivity,
            mid: this.midResponse * this.sensitivity,
            treble: this.trebleResponse * this.sensitivity,
            volume: audioData.volume * this.sensitivity,
            deltaTime: deltaTime,
            frameCount: this.frameCount++
        };
    }

    extractFrequencyRange(frequencyData, startRatio, endRatio) {
        const startIndex = Math.floor(startRatio * frequencyData.length);
        const endIndex = Math.floor(endRatio * frequencyData.length);
        
        let sum = 0;
        let count = 0;
        
        for (let i = startIndex; i < endIndex; i++) {
            sum += frequencyData[i];
            count++;
        }
        
        return count > 0 ? (sum / count) / 255 : 0;
    }

    smoothValue(current, target, smoothing) {
        return current + (target - current) * smoothing;
    }

    // Enhanced cube animations
    animateCubes(cubes, audioData) {
        const { frequencyData, bass, mid, treble, volume, frameCount } = audioData;
        const params = this.params.cubes;
        const gridSize = cubes.length;
        
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const cube = cubes[x][z];
                const distance = Math.sqrt((x - gridSize/2) ** 2 + (z - gridSize/2) ** 2);
                const normalizedDistance = distance / (gridSize * 0.7);
                
                // Frequency-based scaling with position influence
                let freqIndex = Math.floor((x + z) / (gridSize * 2) * frequencyData.length);
                freqIndex = Math.max(0, Math.min(freqIndex, frequencyData.length - 1));
                
                const frequency = frequencyData[freqIndex] / 255;
                let scale = 1;
                
                // Different frequency responses based on position
                if (normalizedDistance < 0.3) {
                    // Center cubes respond to bass
                    scale = 1 + bass * params.scaleMultiplier;
                } else if (normalizedDistance < 0.7) {
                    // Middle ring responds to mid frequencies
                    scale = 1 + mid * params.scaleMultiplier * 0.8;
                } else {
                    // Outer cubes respond to treble
                    scale = 1 + treble * params.scaleMultiplier * 0.6;
                }
                
                // Add frequency-specific modulation
                scale += frequency * volume * 0.5;
                
                // Smooth scaling animation
                cube.scale.y = this.smoothValue(cube.scale.y, scale, 0.2);
                
                // Rotation based on audio and position
                if (params.rotationSpeed > 0) {
                    cube.rotation.y += params.rotationSpeed * (1 + volume * 2);
                    cube.rotation.x += params.rotationSpeed * 0.5 * mid;
                }
                
                // Color animation
                if (params.colorShift) {
                    const hue = (frameCount * 0.001 + normalizedDistance + frequency) % 1;
                    const saturation = 0.7 + treble * 0.3;
                    const lightness = 0.4 + volume * 0.4;
                    cube.material.color.setHSL(hue, saturation, lightness);
                }
                
                // Position bobbing
                if (params.heightVariation) {
                    const bobbing = Math.sin(frameCount * 0.02 + distance * 0.5) * volume * 0.5;
                    cube.position.y = bobbing;
                }
                
                // Opacity based on volume
                cube.material.opacity = 0.6 + volume * 0.4;
            }
        }
    }

    // Enhanced sphere animations
    animateSphere(sphere, wireframe, audioData) {
        const { frequencyData, bass, mid, treble, volume, frameCount } = audioData;
        const params = this.params.sphere;
        
        // Rotation
        sphere.rotation.y += params.rotationSpeed * (1 + volume);
        sphere.rotation.x += params.rotationSpeed * 0.3 * mid;
        wireframe.rotation.y = sphere.rotation.y * 1.1;
        wireframe.rotation.x = sphere.rotation.x * 0.9;
        
        // Scale variation
        const baseScale = 1 + bass * params.scaleVariation;
        sphere.scale.setScalar(baseScale);
        wireframe.scale.setScalar(baseScale * 1.05);
        
        // Vertex deformation
        if (params.vertexDisplacement) {
            const geometry = sphere.geometry;
            const positions = geometry.attributes.position.array;
            const originalVertices = sphere.userData.originalVertices;
            
            for (let i = 0; i < positions.length; i += 3) {
                const vertexIndex = i / 3;
                const freqIndex = Math.floor((vertexIndex / (positions.length / 3)) * frequencyData.length);
                const frequency = frequencyData[freqIndex] / 255;
                
                // Multi-layered deformation
                const displacement1 = frequency * params.deformationStrength * volume;
                const displacement2 = Math.sin(frameCount * 0.02 + vertexIndex * 0.1) * bass * 0.3;
                const displacement3 = Math.cos(frameCount * 0.015 + vertexIndex * 0.05) * treble * 0.2;
                
                const totalDisplacement = displacement1 + displacement2 + displacement3;
                
                positions[i] = originalVertices[i] * (1 + totalDisplacement);
                positions[i + 1] = originalVertices[i + 1] * (1 + totalDisplacement);
                positions[i + 2] = originalVertices[i + 2] * (1 + totalDisplacement);
            }
            
            geometry.attributes.position.needsUpdate = true;
            geometry.computeVertexNormals();
        }
        
        // Material properties
        sphere.material.opacity = 0.7 + volume * 0.3;
        wireframe.material.opacity = 0.2 + treble * 0.3;
        
        // Color shifting
        const hue = (frameCount * 0.002 + bass * 2) % 1;
        sphere.material.color.setHSL(hue, 0.8, 0.5 + mid * 0.3);
    }

    // Enhanced particle animations
    animateParticles(particles, audioData) {
        const { frequencyData, timeDomainData, bass, mid, treble, volume, frameCount } = audioData;
        const params = this.params.particles;
        
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const sizes = geometry.attributes.size ? geometry.attributes.size.array : null;
        const originalPositions = particles.userData.originalPositions;
        
        const particleCount = positions.length / 3;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const freqIndex = Math.floor((i / particleCount) * frequencyData.length);
            const timeIndex = Math.floor((i / particleCount) * timeDomainData.length);
            
            const frequency = frequencyData[freqIndex] / 255;
            const timeValue = (timeDomainData[timeIndex] - 128) / 128;
            
            // Multi-dimensional movement
            const time = frameCount * 0.01;
            
            // Base spiral motion
            if (params.spiralMotion) {
                const radius = 5 + bass * 5;
                const angle = time + i * 0.1 + frequency * Math.PI * 2;
                const height = Math.sin(time * 0.5 + i * 0.05) * treble * 3;
                
                positions[i3] = originalPositions[i3] + Math.cos(angle) * radius * frequency;
                positions[i3 + 1] = originalPositions[i3 + 1] + height;
                positions[i3 + 2] = originalPositions[i3 + 2] + Math.sin(angle) * radius * frequency;
            } else {
                // Organic movement
                const displacement = frequency * volume * params.movementRange;
                positions[i3] = originalPositions[i3] + Math.sin(time + i * 0.01) * displacement;
                positions[i3 + 1] = originalPositions[i3 + 1] + Math.cos(time * 0.7 + i * 0.02) * displacement;
                positions[i3 + 2] = originalPositions[i3 + 2] + timeValue * volume * 2;
            }
            
            // Color animation
            if (params.colorShift) {
                const baseHue = (frequency + timeValue * 0.5 + frameCount * 0.001) % 1;
                const saturation = 0.7 + mid * 0.3;
                const lightness = 0.5 + volume * 0.4;
                
                const color = new THREE.Color().setHSL(baseHue, saturation, lightness);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }
            
            // Size variation
            if (sizes && params.sizeVariation) {
                const baseSize = 0.5 + frequency * 2;
                const pulsing = Math.sin(time * 2 + i * 0.1) * bass * 0.5;
                sizes[i] = baseSize + pulsing;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        if (sizes) geometry.attributes.size.needsUpdate = true;
        
        // Global rotation and scaling
        particles.rotation.y += 0.005 * (1 + volume);
        particles.rotation.x += 0.002 * mid;
        
        const globalScale = 1 + bass * 0.2;
        particles.scale.setScalar(globalScale);
    }

    // Enhanced wave animations
    animateWaves(plane, wireframe, audioData) {
        const { frequencyData, timeDomainData, bass, mid, treble, volume, frameCount } = audioData;
        const params = this.params.waves;
        
        const geometry = plane.geometry;
        const positions = geometry.attributes.position.array;
        const originalVertices = plane.userData.originalVertices;
        const width = plane.userData.width;
        const height = plane.userData.height;
        
        const time = frameCount * params.rippleSpeed;
        
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const index = i * height + j;
                const posIndex = index * 3 + 2; // Z coordinate
                
                // Normalized coordinates
                const x = (i - width / 2) / width;
                const z = (j - height / 2) / height;
                const distance = Math.sqrt(x * x + z * z);
                
                // Multiple wave layers
                const freqIndex1 = Math.floor((i / width) * frequencyData.length);
                const freqIndex2 = Math.floor((j / height) * frequencyData.length);
                const timeIndex = Math.floor(distance * timeDomainData.length);
                
                const freq1 = frequencyData[freqIndex1] / 255;
                const freq2 = frequencyData[freqIndex2] / 255;
                const timeVal = (timeDomainData[timeIndex] - 128) / 128;
                
                // Primary wave (bass-driven)
                const wave1 = Math.sin(distance * 10 - time * 50) * bass * params.amplitude;
                
                // Secondary wave (mid-frequency)
                const wave2 = Math.cos(i * 0.5 + time * 30) * mid * params.amplitude * 0.7;
                
                // Ripple effect (treble)
                const ripple = Math.sin(distance * 20 - time * 80) * treble * params.amplitude * 0.5;
                
                // Frequency-specific displacement
                const freqDisplacement = (freq1 + freq2) * 0.5 * volume * params.amplitude;
                
                // Time domain influence
                const timeDisplacement = timeVal * volume * 0.3;
                
                // Combine all effects
                let totalHeight = wave1 + wave2 + ripple + freqDisplacement + timeDisplacement;
                
                // Add some randomness based on audio
                totalHeight += (Math.random() - 0.5) * volume * 0.1;
                
                positions[posIndex] = originalVertices[posIndex] + totalHeight;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Update wireframe
        const wireframePositions = wireframe.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i++) {
            wireframePositions[i] = positions[i];
        }
        wireframe.geometry.attributes.position.needsUpdate = true;
        
        // Material color animation
        const hue = (frameCount * 0.002 + bass) % 1;
        plane.material.color.setHSL(hue, 0.8, 0.5 + volume * 0.3);
        plane.material.opacity = 0.7 + mid * 0.3;
        
        // Wireframe opacity
        wireframe.material.opacity = 0.3 + treble * 0.4;
    }

    // Performance optimization methods
    setUpdateInterval(interval) {
        this.updateInterval = Math.max(1, interval);
    }

    shouldUpdate() {
        return this.frameCount % this.updateInterval === 0;
    }

    // Preset management
    getPreset(name) {
        const presets = {
            gentle: {
                cubes: { scaleMultiplier: 1.5, rotationSpeed: 0.005 },
                sphere: { deformationStrength: 0.2, scaleVariation: 0.15 },
                particles: { movementRange: 1, spiralMotion: false },
                waves: { amplitude: 1, rippleSpeed: 0.0005 }
            },
            intense: {
                cubes: { scaleMultiplier: 5, rotationSpeed: 0.02 },
                sphere: { deformationStrength: 1, scaleVariation: 0.5 },
                particles: { movementRange: 4, spiralMotion: true },
                waves: { amplitude: 4, rippleSpeed: 0.002 }
            },
            smooth: {
                cubes: { scaleMultiplier: 2, rotationSpeed: 0.008 },
                sphere: { deformationStrength: 0.3, scaleVariation: 0.2 },
                particles: { movementRange: 1.5, spiralMotion: false },
                waves: { amplitude: 1.5, rippleSpeed: 0.001 }
            }
        };
        
        return presets[name] || presets.gentle;
    }

    applyPreset(presetName) {
        const preset = this.getPreset(presetName);
        Object.keys(preset).forEach(mode => {
            this.updateParameters(mode, preset[mode]);
        });
    }
}
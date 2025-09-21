class AudioVisualizerApp {
    constructor() {
        this.audioAnalyzer = null;
        this.threeScene = null;
        this.animations = null;
        this.isRunning = false;
        this.isInitialized = false;
        
        // UI elements
        this.startButton = null;
        this.stopButton = null;
        this.sensitivitySlider = null;
        this.sensitivityValue = null;
        this.animationModeSelect = null;
        this.randomCycleButton = null;
        this.audioLevelDisplay = null;
        this.frequencyDisplay = null;
        
        // Settings
        this.settings = {
            sensitivity: 1.0,
            animationMode: 'cubes',
            autoStart: false,
            showStats: true
        };
        
        // Animation modes for random cycling
        this.animationModes = [
            'cubes', 'sphere', 'particles', 'waves', 'helix', 'tunnel', 'galaxy',
            'tree', 'crystals', 'rings', 'bars', 'matrix', 'plasma', 'vortex',
            'neural', 'kaleidoscope', 'lightning', 'ocean', 'fractal', 'spiral',
            'aurora', 'cityscape', 'molecules', 'tornado', 'cosmos', 'labyrinth',
            'waterfall', 'fire', 'ice', 'desert', 'volcano', 'forest', 'cyberpunk',
            'retro', 'abstract', 'mechanical', 'underwater', 'constellation',
            'blackhole', 'prism', 'quantum', 'ecosystem', 'texturePortal',
            'jrj3D', 'aggregatron', 'aggregatronGlow'
        ];
        
        // Random cycling state
        this.isRandomCycling = false;
        this.randomCycleInterval = null;
        this.cycleIntervalMs = 15000; // 15 seconds
        
        // GUI visibility state
        this.isGUIHidden = false;
        
        // Darkness control properties
        this.darknessLevel = 0; // 0 = normal, 1 = completely dark
        this.maxDarkness = 1.0; // Maximum darkness level (completely black)
        this.darknessStep = 0.05; // Amount to change per scroll
        this.darknessOverlay = null;
        
        this.init();
    }

    async init() {
        try {
            console.log('Initializing Audio Visualizer...');
            
            // Check security context first
            this.checkSecurityContext();
            
            // Initialize components
            this.audioAnalyzer = new AudioAnalyzer();
            this.threeScene = new ThreeJSScene('threejs-canvas');
            this.animations = new AudioAnimations();
            
            // Setup UI
            this.setupUI();
            
            // Setup audio callbacks
            this.setupAudioCallbacks();
            
            // Load settings
            this.loadSettings();
            
            this.isInitialized = true;
            console.log('Audio Visualizer initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Audio Visualizer:', error);
            this.showError('Failed to initialize application: ' + error.message);
        }
    }

    checkSecurityContext() {
        const securityNotice = document.getElementById('security-notice');
        
        if (!window.isSecureContext || !navigator.mediaDevices) {
            console.warn('Insecure context detected:', {
                isSecureContext: window.isSecureContext,
                protocol: window.location.protocol,
                hostname: window.location.hostname,
                mediaDevices: !!navigator.mediaDevices
            });
            
            if (securityNotice) {
                securityNotice.style.display = 'block';
            }
            
            // Add helpful instructions
            const instructions = document.createElement('div');
            instructions.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: rgba(255, 165, 0, 0.9);
                color: black;
                padding: 15px;
                border-radius: 10px;
                z-index: 150;
                text-align: center;
                font-weight: bold;
            `;
            
            const currentUrl = window.location.href;
            const isFileProtocol = currentUrl.startsWith('file://');
            const isHttp = currentUrl.startsWith('http://') && !currentUrl.includes('localhost') && !currentUrl.includes('127.0.0.1');
            
            let message = '';
            if (isFileProtocol) {
                message = `
                    <div>📁 You're opening the file directly. Please serve it with a local server:</div>
                    <div style="font-family: monospace; margin: 10px 0; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px;">
                        cd "${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}"<br>
                        python -m http.server 8000<br>
                        Then visit: http://localhost:8000
                    </div>
                `;
            } else if (isHttp) {
                message = `
                    <div>🔒 Please use HTTPS or localhost. Current URL: ${currentUrl}</div>
                    <div>Try: ${currentUrl.replace('http://', 'https://')} or serve locally</div>
                `;
            } else {
                message = `
                    <div>🔧 Browser compatibility issue detected.</div>
                    <div>Please use Chrome 47+, Firefox 36+, Safari 11+, or Edge 12+</div>
                `;
            }
            
            instructions.innerHTML = message + `
                <button onclick="this.parentElement.remove()" 
                        style="margin-top: 10px; background: #333; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                    Dismiss
                </button>
            `;
            
            document.body.appendChild(instructions);
        }
    }

    setupUI() {
        // Get UI elements
        this.startButton = document.getElementById('start-audio');
        this.stopButton = document.getElementById('stop-audio');
        this.testButton = document.getElementById('test-audio');
        this.calibrateButton = document.getElementById('calibrate-audio');
        this.sensitivitySlider = document.getElementById('sensitivity');
        this.sensitivityValue = document.getElementById('sensitivity-value');
        this.animationModeSelect = document.getElementById('animation-mode');
        this.randomCycleButton = document.getElementById('random-cycle');
        this.audioLevelDisplay = document.getElementById('audio-level');
        this.frequencyDisplay = document.getElementById('frequency-display');

        // Setup event listeners
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startAudio());
        }
        
        if (this.stopButton) {
            this.stopButton.addEventListener('click', () => this.stopAudio());
            this.stopButton.disabled = true;
        }
        
        if (this.testButton) {
            this.testButton.addEventListener('click', () => this.testMicrophone());
        }
        
        if (this.calibrateButton) {
            this.calibrateButton.addEventListener('click', () => this.calibrateMicrophone());
        }
        
        if (this.sensitivitySlider) {
            this.sensitivitySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.setSensitivity(value);
            });
        }
        
        if (this.animationModeSelect) {
            this.animationModeSelect.addEventListener('change', (e) => {
                this.setAnimationMode(e.target.value);
            });
        }

        if (this.randomCycleButton) {
            this.randomCycleButton.addEventListener('click', () => this.randomCycle());
            // Initialize button state
            this.updateRandomCycleButton();
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Add screen click/tap to show hidden GUI
        document.addEventListener('click', (e) => this.handleScreenClick(e));
        document.addEventListener('touchstart', (e) => this.handleScreenClick(e));
        
        // Add scroll wheel darkness control
        this.setupScrollDarkness();
        
        // Add preset buttons
        this.addPresetButtons();
        
        // Initial UI state
        this.updateUI();
    }

    addPresetButtons() {
        const controlsDiv = document.getElementById('controls');
        if (!controlsDiv) return;

        const presetGroup = document.createElement('div');
        presetGroup.className = 'control-group';
        presetGroup.innerHTML = `
            <label>Presets:</label>
            <button id="preset-gentle" class="preset-btn">Gentle</button>
            <button id="preset-smooth" class="preset-btn">Smooth</button>
            <button id="preset-intense" class="preset-btn">Intense</button>
        `;
        
        controlsDiv.appendChild(presetGroup);
        
        // Add Hide GUI button in its own control group after presets
        const hideGuiGroup = document.createElement('div');
        hideGuiGroup.className = 'control-group';
        hideGuiGroup.innerHTML = `
            <button id="hide-gui">Hide GUI</button>
        `;
        
        controlsDiv.appendChild(hideGuiGroup);
        
        // Add event listeners for preset buttons
        document.getElementById('preset-gentle')?.addEventListener('click', () => this.applyPreset('gentle'));
        document.getElementById('preset-smooth')?.addEventListener('click', () => this.applyPreset('smooth'));
        document.getElementById('preset-intense')?.addEventListener('click', () => this.applyPreset('intense'));
        
        // Add event listener for Hide GUI button
        const hideGuiButton = document.getElementById('hide-gui');
        if (hideGuiButton) {
            console.log('Adding click event listener to hide GUI button');
            hideGuiButton.addEventListener('click', (event) => {
                console.log('Hide GUI button clicked!');
                event.preventDefault();
                event.stopPropagation();
                this.hideGUI();
            });
        } else {
            console.error('Hide GUI button not found after creation!');
        }
    }

    setupAudioCallbacks() {
        this.audioAnalyzer.onAudioData = (audioData) => {
            this.handleAudioData(audioData);
        };
        
        this.audioAnalyzer.onError = (error) => {
            this.handleAudioError(error);
        };
    }

    handleAudioData(audioData) {
        if (!this.isRunning) return;
        
        // Process audio data through animations
        const processedData = this.animations.processAudioData(audioData);
        
        if (processedData) {
            // Update Three.js scene
            this.threeScene.updateAudioData(processedData);
            
            // Update UI displays
            this.updateAudioDisplays(processedData);
        }
    }

    handleAudioError(error) {
        console.error('Audio error:', error);
        this.showError('Audio Error: ' + error.message);
        this.stopAudio();
    }

    async startAudio() {
        if (!this.isInitialized) {
            this.showError('Application not initialized');
            return;
        }
        
        try {
            this.showLoading('Checking browser compatibility...');
            
            // Run diagnostics first
            const diagnostics = await this.runDiagnostics();
            if (!diagnostics.success) {
                throw new Error(diagnostics.error);
            }
            
            this.showLoading('Initializing audio...');
            
            // Initialize audio analyzer
            const success = await this.audioAnalyzer.initialize();
            if (!success) {
                throw new Error('Failed to initialize audio analyzer');
            }
            
            // Start audio processing
            this.audioAnalyzer.start();
            this.animations.setActive(true);
            
            this.isRunning = true;
            this.updateUI();
            
            this.hideLoading();
            console.log('Audio visualization started successfully');
            
        } catch (error) {
            console.error('Failed to start audio:', error);
            this.hideLoading();
            this.showError(error.message || 'Failed to start audio: Unknown error');
        }
    }

    async runDiagnostics() {
        console.log('Running audio diagnostics...');
        console.log('Current URL:', window.location.href);
        console.log('Secure context:', window.isSecureContext);
        console.log('Navigator.mediaDevices:', !!navigator.mediaDevices);
        console.log('User agent:', navigator.userAgent);
        
        // Check basic browser support
        if (!navigator.mediaDevices) {
            // More specific error based on the actual issue
            if (!window.isSecureContext) {
                return {
                    success: false,
                    error: 'MediaDevices API requires a secure context (HTTPS). You are currently accessing the page via HTTP or file:// protocol. Please serve the page over HTTPS or access via localhost (http://localhost:8000).'
                };
            } else {
                return {
                    success: false,
                    error: 'MediaDevices API not supported in this browser. Please use a modern browser: Chrome 47+, Firefox 36+, Safari 11+, or Edge 12+.'
                };
            }
        }
        
        if (!navigator.mediaDevices.getUserMedia) {
            return {
                success: false,
                error: 'getUserMedia not supported. Please update your browser to a newer version.'
            };
        }
        
        // Check Web Audio API
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return {
                success: false,
                error: 'Web Audio API not supported. Please use a modern browser with Web Audio support.'
            };
        }
        
        // Check secure context
        if (!window.isSecureContext) {
            return {
                success: false,
                error: 'Microphone access requires a secure context (HTTPS). Please serve the page over HTTPS or access via localhost.'
            };
        }
        
        // Check WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            return {
                success: false,
                error: 'WebGL not supported. Please enable WebGL in your browser settings or use a different browser.'
            };
        }
        
        // Test basic audio context creation
        try {
            const testContext = new AudioContextClass();
            testContext.close();
        } catch (error) {
            return {
                success: false,
                error: `Audio context creation failed: ${error.message}`
            };
        }
        
        console.log('All diagnostics passed');
        return { success: true };
    }

    async testMicrophone() {
        try {
            this.showLoading('Testing microphone... Speak or make noise!');
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            
            // Configure analyzer for better sensitivity
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.3;
            analyser.minDecibels = -90;
            analyser.maxDecibels = -10;
            
            source.connect(analyser);
            
            const frequencyData = new Uint8Array(analyser.frequencyBinCount);
            const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
            
            let testPassed = false;
            let attempts = 0;
            const maxAttempts = 150; // Test for about 7.5 seconds
            let maxVolumeDetected = 0;
            let maxFrequencyDetected = 0;
            
            // Create a real-time feedback display
            const feedbackDiv = document.createElement('div');
            feedbackDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 30px;
                border-radius: 15px;
                z-index: 1001;
                text-align: center;
                font-family: Arial, sans-serif;
                min-width: 300px;
            `;
            
            feedbackDiv.innerHTML = `
                <h3 style="margin-top: 0; color: #4ecdc4;">🎤 Microphone Test</h3>
                <p>Speak, sing, clap, or make noise!</p>
                <div style="margin: 20px 0;">
                    <div>Volume Level: <span id="volume-reading">0</span></div>
                    <div>Frequency Level: <span id="frequency-reading">0</span></div>
                    <div style="margin-top: 10px;">
                        <div id="volume-bar" style="width: 100%; height: 20px; background: #333; border-radius: 10px; overflow: hidden;">
                            <div id="volume-fill" style="height: 100%; background: linear-gradient(90deg, #4ecdc4, #44a08d); width: 0%; transition: width 0.1s;"></div>
                        </div>
                    </div>
                </div>
                <div id="test-status">Listening for audio...</div>
                <button onclick="this.closest('div').remove(); window.cancelMicTest()" 
                        style="margin-top: 15px; background: #ff4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cancel Test
                </button>
            `;
            
            document.body.appendChild(feedbackDiv);
            
            // Make cleanup function globally accessible
            window.cancelMicTest = () => {
                testPassed = true; // Stop the loop
                stream.getTracks().forEach(track => track.stop());
                audioContext.close();
                this.hideLoading();
            };
            
            const testLoop = () => {
                if (testPassed) return;
                
                analyser.getByteFrequencyData(frequencyData);
                analyser.getByteTimeDomainData(timeDomainData);
                
                // Calculate volume from time domain data (more accurate)
                let sum = 0;
                for (let i = 0; i < timeDomainData.length; i++) {
                    const amplitude = (timeDomainData[i] - 128) / 128;
                    sum += amplitude * amplitude;
                }
                const rms = Math.sqrt(sum / timeDomainData.length);
                const volume = rms * 100; // Convert to percentage
                
                // Calculate frequency activity
                const frequencyActivity = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
                
                // Update max detected values
                maxVolumeDetected = Math.max(maxVolumeDetected, volume);
                maxFrequencyDetected = Math.max(maxFrequencyDetected, frequencyActivity);
                
                // Update UI
                const volumeReading = document.getElementById('volume-reading');
                const frequencyReading = document.getElementById('frequency-reading');
                const volumeFill = document.getElementById('volume-fill');
                const testStatus = document.getElementById('test-status');
                
                if (volumeReading) volumeReading.textContent = volume.toFixed(1) + '%';
                if (frequencyReading) frequencyReading.textContent = frequencyActivity.toFixed(1);
                if (volumeFill) volumeFill.style.width = Math.min(volume * 2, 100) + '%';
                
                // More sensitive detection - lower thresholds
                const volumeThreshold = 2;  // Much lower threshold
                const frequencyThreshold = 5; // Much lower threshold
                
                if (volume > volumeThreshold || frequencyActivity > frequencyThreshold) {
                    testPassed = true;
                    stream.getTracks().forEach(track => track.stop());
                    audioContext.close();
                    feedbackDiv.remove();
                    this.hideLoading();
                    this.showSuccess(`✅ Microphone test passed! 
                        Volume: ${volume.toFixed(1)}%, Frequency: ${frequencyActivity.toFixed(1)}
                        Your microphone is working great!`);
                    return;
                }
                
                // Update status based on detected levels
                if (testStatus) {
                    if (maxVolumeDetected > 1 || maxFrequencyDetected > 2) {
                        testStatus.textContent = `Detecting some audio... Keep trying! (Max: ${maxVolumeDetected.toFixed(1)}%)`;
                        testStatus.style.color = '#ffe66d';
                    } else {
                        testStatus.textContent = 'Listening for audio... Try speaking louder!';
                        testStatus.style.color = '#ffffff';
                    }
                }
                
                attempts++;
                if (attempts >= maxAttempts) {
                    stream.getTracks().forEach(track => track.stop());
                    audioContext.close();
                    feedbackDiv.remove();
                    this.hideLoading();
                    
                    if (maxVolumeDetected > 0.5 || maxFrequencyDetected > 1) {
                        this.showWarning(`⚠️ Weak audio signal detected. 
                            Max volume: ${maxVolumeDetected.toFixed(1)}%, Max frequency: ${maxFrequencyDetected.toFixed(1)}
                            Your microphone works but may need volume adjustment.
                            Try increasing microphone volume in system settings.`);
                    } else {
                        this.showError(`❌ No audio detected after 7.5 seconds.
                            Please check:
                            • Microphone volume in system settings
                            • Microphone permissions for this website
                            • Try a different microphone
                            • Make sure microphone is not muted`);
                    }
                    return;
                }
                
                requestAnimationFrame(testLoop);
            };
            
            testLoop();
            
        } catch (error) {
            this.hideLoading();
            this.showError(`Microphone test failed: ${error.message}`);
        }
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            max-width: 300px;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        setTimeout(() => successDiv.remove(), 4000);
    }

    showWarning(message) {
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 165, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            max-width: 300px;
        `;
        warningDiv.textContent = message;
        document.body.appendChild(warningDiv);
        
        setTimeout(() => warningDiv.remove(), 6000);
    }

    async calibrateMicrophone() {
        try {
            this.showLoading('Starting microphone calibration...');
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.3;
            analyser.minDecibels = -100;
            analyser.maxDecibels = -10;
            
            source.connect(analyser);
            
            const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
            
            let calibrationActive = true;
            let volumes = [];
            let phase = 'silence'; // 'silence', 'speaking', 'complete'
            let phaseStartTime = Date.now();
            
            const calibrationDiv = document.createElement('div');
            calibrationDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: white;
                padding: 40px;
                border-radius: 15px;
                z-index: 1001;
                text-align: center;
                font-family: Arial, sans-serif;
                min-width: 400px;
            `;
            
            calibrationDiv.innerHTML = `
                <h3 style="margin-top: 0; color: #4ecdc4;">🎙️ Microphone Calibration</h3>
                <div id="calibration-phase">Measuring background noise... Stay quiet for 3 seconds</div>
                <div style="margin: 20px 0;">
                    <div>Current Volume: <span id="cal-volume">0</span>%</div>
                    <div style="margin-top: 10px;">
                        <div id="cal-volume-bar" style="width: 100%; height: 20px; background: #333; border-radius: 10px; overflow: hidden;">
                            <div id="cal-volume-fill" style="height: 100%; background: linear-gradient(90deg, #4ecdc4, #44a08d); width: 0%; transition: width 0.1s;"></div>
                        </div>
                    </div>
                    <div style="margin-top: 10px;">
                        <div>Noise Floor: <span id="noise-floor">--</span>%</div>
                        <div>Speaking Level: <span id="speaking-level">--</span>%</div>
                        <div>Recommended Sensitivity: <span id="recommended-sensitivity">--</span></div>
                    </div>
                </div>
                <div id="calibration-progress" style="margin: 15px 0; font-size: 14px; color: #ffe66d;"></div>
                <button onclick="this.closest('div').remove(); window.stopCalibration()" 
                        style="background: #ff4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cancel
                </button>
            `;
            
            document.body.appendChild(calibrationDiv);
            this.hideLoading();
            
            window.stopCalibration = () => {
                calibrationActive = false;
                stream.getTracks().forEach(track => track.stop());
                audioContext.close();
            };
            
            const calibrationLoop = () => {
                if (!calibrationActive) return;
                
                analyser.getByteTimeDomainData(timeDomainData);
                
                // Calculate volume using the same method as the main analyzer
                let sum = 0;
                let peakAmplitude = 0;
                
                for (let i = 0; i < timeDomainData.length; i++) {
                    const amplitude = Math.abs((timeDomainData[i] - 128) / 128);
                    sum += amplitude * amplitude;
                    peakAmplitude = Math.max(peakAmplitude, amplitude);
                }
                
                const rms = Math.sqrt(sum / timeDomainData.length);
                const combinedVolume = (rms * 0.7) + (peakAmplitude * 0.3);
                const volume = combinedVolume * 25; // Same as main analyzer
                
                volumes.push(volume);
                
                // Update UI
                const calVolume = document.getElementById('cal-volume');
                const calVolumeFill = document.getElementById('cal-volume-fill');
                const calPhase = document.getElementById('calibration-phase');
                const calProgress = document.getElementById('calibration-progress');
                const noiseFloor = document.getElementById('noise-floor');
                const speakingLevel = document.getElementById('speaking-level');
                const recommendedSens = document.getElementById('recommended-sensitivity');
                
                if (calVolume) calVolume.textContent = volume.toFixed(1);
                if (calVolumeFill) calVolumeFill.style.width = Math.min(volume * 10, 100) + '%';
                
                const elapsed = (Date.now() - phaseStartTime) / 1000;
                
                if (phase === 'silence') {
                    if (calPhase) calPhase.textContent = 'Measuring background noise... Stay quiet';
                    if (calProgress) calProgress.textContent = `${Math.max(0, 3 - elapsed).toFixed(1)}s remaining`;
                    
                    if (elapsed >= 3) {
                        const silenceVolumes = volumes.slice();
                        const avgSilence = silenceVolumes.reduce((a, b) => a + b, 0) / silenceVolumes.length;
                        
                        if (noiseFloor) noiseFloor.textContent = avgSilence.toFixed(1) + '%';
                        
                        phase = 'speaking';
                        phaseStartTime = Date.now();
                        volumes = [];
                        
                        if (calPhase) calPhase.textContent = 'Now speak normally for 5 seconds';
                    }
                } else if (phase === 'speaking') {
                    if (calPhase) calPhase.textContent = 'Speak normally... measuring your voice level';
                    if (calProgress) calProgress.textContent = `${Math.max(0, 5 - elapsed).toFixed(1)}s remaining - Keep talking!`;
                    
                    if (elapsed >= 5) {
                        const speakingVolumes = volumes.slice();
                        const avgSpeaking = speakingVolumes.reduce((a, b) => a + b, 0) / speakingVolumes.length;
                        const maxSpeaking = Math.max(...speakingVolumes);
                        
                        if (speakingLevel) speakingLevel.textContent = avgSpeaking.toFixed(1) + '%';
                        
                        // Calculate recommended sensitivity
                        const targetResponse = 0.5; // Want speaking to produce ~50% response
                        const recommendedSensitivity = Math.max(0.1, Math.min(5.0, targetResponse / (avgSpeaking * 0.01)));
                        
                        if (recommendedSens) recommendedSens.textContent = recommendedSensitivity.toFixed(1) + 'x';
                        
                        // Apply the recommended sensitivity
                        this.setSensitivity(recommendedSensitivity);
                        if (this.sensitivitySlider) {
                            this.sensitivitySlider.value = recommendedSensitivity;
                        }
                        
                        phase = 'complete';
                        if (calPhase) calPhase.textContent = '✅ Calibration complete! Sensitivity has been optimized.';
                        if (calProgress) calProgress.textContent = 'You can now start the audio visualizer';
                        
                        // Auto-close after 3 seconds
                        setTimeout(() => {
                            calibrationDiv.remove();
                            stream.getTracks().forEach(track => track.stop());
                            audioContext.close();
                            this.showSuccess(`Calibration complete! Sensitivity set to ${recommendedSensitivity.toFixed(1)}x`);
                        }, 3000);
                    }
                }
                
                if (phase !== 'complete') {
                    requestAnimationFrame(calibrationLoop);
                }
            };
            
            calibrationLoop();
            
        } catch (error) {
            this.hideLoading();
            this.showError(`Calibration failed: ${error.message}`);
        }
    }

    stopAudio() {
        if (!this.isRunning) return;
        
        try {
            this.audioAnalyzer.stop();
            this.animations.setActive(false);
            
            // Stop random cycling when audio stops
            if (this.isRandomCycling) {
                this.stopRandomCycling();
            }
            
            this.isRunning = false;
            this.updateUI();
            
            console.log('Audio visualization stopped');
            
        } catch (error) {
            console.error('Error stopping audio:', error);
        }
    }

    setSensitivity(value) {
        this.settings.sensitivity = value;
        this.animations.setSensitivity(value);
        
        if (this.sensitivityValue) {
            this.sensitivityValue.textContent = value.toFixed(1);
        }
        
        this.saveSettings();
    }

    setAnimationMode(mode) {
        this.settings.animationMode = mode;
        this.animations.setAnimationMode(mode);
        this.threeScene.setAnimationMode(mode);
        
        // Update the dropdown to reflect the change
        if (this.animationModeSelect) {
            this.animationModeSelect.value = mode;
        }
        
        this.saveSettings();
    }

    randomCycle() {
        if (this.isRandomCycling) {
            // Stop random cycling
            this.stopRandomCycling();
        } else {
            // Start random cycling
            this.startRandomCycling();
        }
    }

    startRandomCycling() {
        this.isRandomCycling = true;
        
        // Update button appearance
        this.updateRandomCycleButton();
        
        // Immediately switch to a random mode
        this.switchToRandomMode();
        
        // Set up interval for automatic cycling
        this.randomCycleInterval = setInterval(() => {
            this.switchToRandomMode();
        }, this.cycleIntervalMs);
        
        console.log('Random cycling started - switching every 15 seconds');
    }

    stopRandomCycling() {
        this.isRandomCycling = false;
        
        // Clear the interval
        if (this.randomCycleInterval) {
            clearInterval(this.randomCycleInterval);
            this.randomCycleInterval = null;
        }
        
        // Update button appearance
        this.updateRandomCycleButton();
        
        console.log('Random cycling stopped');
    }

    switchToRandomMode() {
        // Get current mode to avoid selecting the same one
        const currentMode = this.settings.animationMode;
        let availableModes = this.animationModes.filter(mode => mode !== currentMode);
        
        // If somehow we only have one mode, use all modes
        if (availableModes.length === 0) {
            availableModes = this.animationModes;
        }
        
        // Select random mode
        const randomIndex = Math.floor(Math.random() * availableModes.length);
        const newMode = availableModes[randomIndex];
        
        // Apply the new mode
        this.setAnimationMode(newMode);
        
        console.log(`Random cycle: switched to ${newMode}`);
    }

    updateRandomCycleButton() {
        if (!this.randomCycleButton) return;
        
        if (this.isRandomCycling) {
            // Active state - cycling
            this.randomCycleButton.textContent = 'Stop Cycle';
            this.randomCycleButton.classList.add('active');
        } else {
            // Inactive state - ready to start
            this.randomCycleButton.textContent = 'Random Cycle';
            this.randomCycleButton.classList.remove('active');
        }
    }

    hideGUI() {
        console.log('hideGUI() called');
        const controls = document.getElementById('controls');
        const status = document.getElementById('status');
        const securityNotice = document.getElementById('security-notice');
        
        console.log('Controls element:', controls);
        console.log('Status element:', status);
        
        if (controls) {
            controls.style.setProperty('display', 'none', 'important');
            console.log('Controls hidden with !important');
        }
        if (status) {
            status.style.setProperty('display', 'none', 'important');
            console.log('Status hidden with !important');
        }
        if (securityNotice) {
            securityNotice.style.setProperty('display', 'none', 'important');
            console.log('Security notice hidden with !important');
        }
        
        this.isGUIHidden = true;
        console.log('GUI hidden - click or tap screen to show');
        
        // Show a temporary message
        this.showTemporaryMessage('GUI hidden - click or tap anywhere to show');
    }

    showGUI() {
        console.log('showGUI() called');
        const controls = document.getElementById('controls');
        const status = document.getElementById('status');
        
        console.log('Controls element:', controls);
        console.log('Status element:', status);
        
        if (controls) {
            controls.style.removeProperty('display');
            console.log('Controls shown - display property removed');
        }
        if (status) {
            status.style.removeProperty('display');
            console.log('Status shown - display property removed');
        }
        
        this.isGUIHidden = false;
        console.log('GUI shown');
    }

    handleScreenClick(event) {
        console.log('Screen clicked, isGUIHidden:', this.isGUIHidden);
        // Only show GUI if it's currently hidden
        if (this.isGUIHidden) {
            console.log('Showing GUI from screen click');
            // Prevent the click from triggering other actions
            event.preventDefault();
            event.stopPropagation();
            this.showGUI();
        }
    }

    showTemporaryMessage(text) {
        // Create temporary message element
        const message = document.createElement('div');
        message.id = 'temporary-message';
        message.textContent = 'Click anywhere to show controls';
        message.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(0, 255, 255, 0.15);
            color: rgba(0, 255, 255, 0.8);
            padding: 8px 12px;
            font-family: 'Orbitron', 'Courier New', monospace;
            font-size: 11px;
            font-weight: 400;
            z-index: 10000;
            opacity: 1;
            transition: opacity 1.5s ease-out;
            border: 1px solid rgba(0, 255, 255, 0.3);
            backdrop-filter: blur(5px);
        `;
        
        document.body.appendChild(message);
        
        // Remove after 2.5 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 1500);
        }, 1000);
    }

    setupScrollDarkness() {
        // Create darkness overlay element
        this.darknessOverlay = document.createElement('div');
        this.darknessOverlay.id = 'darkness-overlay';
        this.darknessOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0;
            pointer-events: none;
            z-index: 5;
            transition: opacity 0.1s ease-out;
        `;
        document.body.appendChild(this.darknessOverlay);

        // Add scroll event listener
        window.addEventListener('wheel', (event) => {
            this.handleScrollDarkness(event);
        }, { passive: false });

        console.log('Scroll darkness control initialized');
    }

    handleScrollDarkness(event) {
        // Prevent default scroll behavior
        event.preventDefault();

        // Determine scroll direction
        const delta = event.deltaY;
        
        if (delta > 0) {
            // Scroll down = darker
            this.darknessLevel = Math.min(this.darknessLevel + this.darknessStep, this.maxDarkness);
        } else {
            // Scroll up = lighter
            this.darknessLevel = Math.max(this.darknessLevel - this.darknessStep, 0);
        }

        // Update darkness overlay opacity
        this.updateDarknessOverlay();

        // Show darkness level indicator
        this.showDarknessIndicator();
    }

    updateDarknessOverlay() {
        if (this.darknessOverlay) {
            this.darknessOverlay.style.opacity = this.darknessLevel;
            
            // Add thin outline cursor when dark
            if (this.darknessLevel > 0.5) {
                document.body.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><circle cx=\"10\" cy=\"10\" r=\"8\" stroke=\"white\" stroke-width=\"1\" fill=\"none\"/></svg>') 10 10, auto";
            } else {
                document.body.style.cursor = '';
            }
        }
    }

    showDarknessIndicator() {
        // No visual indicator - darkness control is silent
    }

    resetDarkness() {
        this.darknessLevel = 0;
        this.updateDarknessOverlay();
        document.body.style.cursor = '';
    }

    setDarkness(level) {
        this.darknessLevel = Math.max(0, Math.min(level, this.maxDarkness));
        this.updateDarknessOverlay();
    }

    applyPreset(presetName) {
        this.animations.applyPreset(presetName);
        console.log(`Applied preset: ${presetName}`);
    }

    handleKeyPress(event) {
        // Prevent actions when user is typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            return;
        }
        
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (this.isRunning) {
                    this.stopAudio();
                } else {
                    this.startAudio();
                }
                break;
            case 'Digit1':
                this.setAnimationMode('cubes');
                if (this.animationModeSelect) this.animationModeSelect.value = 'cubes';
                break;
            case 'Digit2':
                this.setAnimationMode('sphere');
                if (this.animationModeSelect) this.animationModeSelect.value = 'sphere';
                break;
            case 'Digit3':
                this.setAnimationMode('particles');
                if (this.animationModeSelect) this.animationModeSelect.value = 'particles';
                break;
            case 'Digit4':
                this.setAnimationMode('waves');
                if (this.animationModeSelect) this.animationModeSelect.value = 'waves';
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.adjustSensitivity(0.1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.adjustSensitivity(-0.1);
                break;
            case 'Minus':
            case 'NumpadSubtract':
                event.preventDefault();
                this.darknessLevel = Math.min(this.darknessLevel + this.darknessStep * 2, this.maxDarkness);
                this.updateDarknessOverlay();
                this.showDarknessIndicator();
                break;
            case 'Equal':
            case 'NumpadAdd':
                event.preventDefault();
                this.darknessLevel = Math.max(this.darknessLevel - this.darknessStep * 2, 0);
                this.updateDarknessOverlay();
                this.showDarknessIndicator();
                break;
            case 'Digit0':
            case 'Numpad0':
                event.preventDefault();
                this.resetDarkness();
                this.showDarknessIndicator();
                break;
        }
    }

    adjustSensitivity(delta) {
        const newValue = Math.max(0.1, Math.min(5.0, this.settings.sensitivity + delta));
        this.setSensitivity(newValue);
        
        if (this.sensitivitySlider) {
            this.sensitivitySlider.value = newValue;
        }
    }

    updateUI() {
        // Update button states
        if (this.startButton) {
            this.startButton.disabled = this.isRunning;
        }
        
        if (this.stopButton) {
            this.stopButton.disabled = !this.isRunning;
        }
        
        // Update slider value display
        if (this.sensitivityValue) {
            this.sensitivityValue.textContent = this.settings.sensitivity.toFixed(1);
        }
        
        // Update animation mode select
        if (this.animationModeSelect) {
            this.animationModeSelect.value = this.settings.animationMode;
        }
    }

    updateAudioDisplays(audioData) {
        if (!this.settings.showStats) return;
        
        // Update audio level display
        if (this.audioLevelDisplay) {
            const level = Math.round(audioData.volume * 100);
            this.audioLevelDisplay.textContent = `Audio Level: ${level}%`;
        }
        
        // Update frequency display
        if (this.frequencyDisplay) {
            const freq = Math.round(audioData.dominantFrequency);
            this.frequencyDisplay.textContent = `Dominant Frequency: ${freq} Hz`;
        }
    }

    showError(message) {
        // Remove existing error messages
        this.hideError();
        
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 25px;
            border-radius: 15px;
            z-index: 1000;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
        `;
        
        // Create detailed error message based on common issues
        let detailedMessage = message;
        let solution = '';
        
        if (message.includes('secure context') || message.includes('HTTPS')) {
            solution = `
                <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px;">
                    <strong>Solutions:</strong><br>
                    • Use <code>https://</code> instead of <code>http://</code><br>
                    • Or access via <code>localhost</code> or <code>127.0.0.1</code><br>
                    • Or use a local development server with HTTPS
                </div>
            `;
        } else if (message.includes('denied') || message.includes('NotAllowedError')) {
            solution = `
                <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px;">
                    <strong>Solutions:</strong><br>
                    • Click the microphone icon in your browser's address bar<br>
                    • Select "Always allow" for microphone access<br>
                    • Refresh the page and try again<br>
                    • Check browser settings for microphone permissions
                </div>
            `;
        } else if (message.includes('No microphone') || message.includes('NotFoundError')) {
            solution = `
                <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px;">
                    <strong>Solutions:</strong><br>
                    • Connect a microphone or headset<br>
                    • Check system audio settings<br>
                    • Ensure microphone is not disabled in device manager<br>
                    • Try using built-in laptop microphone
                </div>
            `;
        } else if (message.includes('already in use') || message.includes('NotReadableError')) {
            solution = `
                <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px;">
                    <strong>Solutions:</strong><br>
                    • Close other applications using microphone (Zoom, Skype, etc.)<br>
                    • Close other browser tabs with microphone access<br>
                    • Restart your browser<br>
                    • Check for background applications using audio
                </div>
            `;
        }
        
        errorDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #ffaaaa;">🎤 Audio Error</h3>
            <p style="margin: 15px 0; line-height: 1.4;">${detailedMessage}</p>
            ${solution}
            <div style="margin-top: 20px;">
                <button onclick="document.getElementById('error-message').remove()" 
                        style="background: #ff4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-right: 10px;">
                    OK
                </button>
                <button onclick="window.location.reload()" 
                        style="background: #4444ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-hide after 10 seconds instead of 5 for more complex errors
        setTimeout(() => this.hideError(), 10000);
    }

    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    showLoading(message = 'Loading...') {
        this.hideLoading();
        
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.className = 'loading';
        loadingDiv.textContent = message;
        
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loadingDiv = document.getElementById('loading-message');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('audioVisualizerSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Could not save settings:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('audioVisualizerSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                Object.assign(this.settings, settings);
                
                // Apply loaded settings
                this.setSensitivity(this.settings.sensitivity);
                this.setAnimationMode(this.settings.animationMode);
                
                // Update UI
                if (this.sensitivitySlider) {
                    this.sensitivitySlider.value = this.settings.sensitivity;
                }
            }
        } catch (error) {
            console.warn('Could not load settings:', error);
        }
    }

    destroy() {
        this.stopAudio();
        
        if (this.audioAnalyzer) {
            this.audioAnalyzer.destroy();
        }
        
        if (this.threeScene) {
            this.threeScene.destroy();
        }
        
        // Clean up darkness overlay
        if (this.darknessOverlay && this.darknessOverlay.parentNode) {
            this.darknessOverlay.parentNode.removeChild(this.darknessOverlay);
        }

        // Reset cursor
        document.body.style.cursor = '';

        // Remove existing darkness indicator
        const indicator = document.getElementById('darkness-indicator');
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }

        // Remove scroll event listener
        window.removeEventListener('wheel', this.handleScrollDarkness);

        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        
        console.log('Audio Visualizer destroyed');
    }
}

// Global app instance
let app = null;

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    app = new AudioVisualizerApp();
    console.log('App initialized:', app);
});

// Clean up when the page unloads
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (app && app.isRunning) {
        if (document.hidden) {
            console.log('Tab hidden, pausing visualization');
            // Could pause here if needed
        } else {
            console.log('Tab visible, resuming visualization');
            // Could resume here if needed
        }
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioVisualizerApp;
}
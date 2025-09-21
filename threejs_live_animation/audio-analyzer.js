class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.isListening = false;
        
        // Audio processing parameters - optimized for sensitivity
        this.fftSize = 2048;
        this.smoothingTimeConstant = 0.3; // Reduced for faster response
        this.minDecibels = -100; // Lower threshold to catch quieter sounds
        this.maxDecibels = -10;
        
        // Processed audio data
        this.frequencyData = null;
        this.timeDomainData = null;
        this.volume = 0;
        this.dominantFrequency = 0;
        
        // Callbacks
        this.onAudioData = null;
        this.onError = null;
        
        // Volume calculation parameters
        this.volumeHistory = [];
        this.volumeHistoryLength = 10;
    }

    async initialize() {
        try {
            console.log('Starting audio analyzer initialization...');
            
            // Check for browser support
            if (!navigator.mediaDevices) {
                throw new Error('MediaDevices API not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
            }
            
            if (!navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported in this browser. Please update to a newer browser version.');
            }

            // Check for secure context (HTTPS or localhost)
            if (!window.isSecureContext) {
                throw new Error('Microphone access requires a secure context (HTTPS). Please serve the page over HTTPS or use localhost.');
            }

            console.log('Browser support check passed');

            // Create audio context
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('Web Audio API not supported in this browser');
            }

            this.audioContext = new AudioContextClass();
            console.log(`Audio context created. State: ${this.audioContext.state}, Sample rate: ${this.audioContext.sampleRate} Hz`);
            
            // Resume audio context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                console.log('Audio context is suspended, attempting to resume...');
                await this.audioContext.resume();
                console.log(`Audio context resumed. New state: ${this.audioContext.state}`);
            }

            // Request microphone access with fallback options
            console.log('Requesting microphone access...');
            let stream;
            
            try {
                // Try with optimal settings first
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false,
                        sampleRate: 44100,
                        // Add additional constraints for better sensitivity
                        channelCount: 1,
                        volume: 1.0
                    }
                });
            } catch (optimalError) {
                console.warn('Optimal audio settings failed, trying enhanced settings:', optimalError);
                
                try {
                    // Try with enhanced settings
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false
                        }
                    });
                } catch (enhancedError) {
                    console.warn('Enhanced audio settings failed, trying basic settings:', enhancedError);
                    
                    try {
                        // Fallback to basic audio settings
                        stream = await navigator.mediaDevices.getUserMedia({
                            audio: true
                        });
                    } catch (basicError) {
                        if (basicError.name === 'NotAllowedError') {
                            throw new Error('Microphone access denied. Please allow microphone access and try again.');
                        } else if (basicError.name === 'NotFoundError') {
                            throw new Error('No microphone found. Please connect a microphone and try again.');
                        } else if (basicError.name === 'NotReadableError') {
                            throw new Error('Microphone is already in use by another application. Please close other audio applications and try again.');
                        } else {
                            throw new Error(`Microphone access failed: ${basicError.message}`);
                        }
                    }
                }
            }

            console.log('Microphone access granted');

            // Create audio nodes
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            
            console.log('Audio nodes created');
            
            // Configure analyser
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
            this.analyser.minDecibels = this.minDecibels;
            this.analyser.maxDecibels = this.maxDecibels;
            
            // Connect audio nodes
            this.microphone.connect(this.analyser);
            
            // Setup data arrays
            this.bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(this.bufferLength);
            this.timeDomainData = new Uint8Array(this.bufferLength);
            
            console.log('Audio analyzer initialized successfully');
            console.log(`Buffer length: ${this.bufferLength}`);
            console.log(`Sample rate: ${this.audioContext.sampleRate} Hz`);
            console.log(`FFT size: ${this.analyser.fftSize}`);
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize audio analyzer:', error);
            if (this.onError) {
                this.onError(error);
            }
            return false;
        }
    }

    start() {
        if (!this.analyser) {
            console.error('Audio analyzer not initialized');
            return false;
        }

        this.isListening = true;
        this.processAudio();
        console.log('Audio analysis started');
        return true;
    }

    stop() {
        this.isListening = false;
        console.log('Audio analysis stopped');
    }

    processAudio() {
        if (!this.isListening || !this.analyser) {
            return;
        }

        // Get frequency and time domain data
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.timeDomainData);

        // Calculate volume (RMS of time domain data)
        this.volume = this.calculateVolume();
        
        // Calculate dominant frequency
        this.dominantFrequency = this.calculateDominantFrequency();

        // Prepare audio data object
        const audioData = {
            frequencyData: this.frequencyData,
            timeDomainData: this.timeDomainData,
            volume: this.volume,
            dominantFrequency: this.dominantFrequency,
            bufferLength: this.bufferLength,
            sampleRate: this.audioContext.sampleRate
        };

        // Call callback with processed data
        if (this.onAudioData) {
            this.onAudioData(audioData);
        }

        // Continue processing
        requestAnimationFrame(() => this.processAudio());
    }

    calculateVolume() {
        let sum = 0;
        let peakAmplitude = 0;
        
        // Calculate both RMS and peak amplitude for better sensitivity
        for (let i = 0; i < this.timeDomainData.length; i++) {
            const amplitude = Math.abs((this.timeDomainData[i] - 128) / 128);
            sum += amplitude * amplitude;
            peakAmplitude = Math.max(peakAmplitude, amplitude);
        }
        
        const rms = Math.sqrt(sum / this.timeDomainData.length);
        
        // Combine RMS and peak for better responsiveness
        const combinedVolume = (rms * 0.7) + (peakAmplitude * 0.3);
        
        // Add to volume history for smoothing
        this.volumeHistory.push(combinedVolume);
        if (this.volumeHistory.length > this.volumeHistoryLength) {
            this.volumeHistory.shift();
        }
        
        // Calculate smoothed volume with less aggressive smoothing
        const smoothedVolume = this.volumeHistory.reduce((a, b) => a + b) / this.volumeHistory.length;
        
        // More sensitive normalization - increased multiplier and lower cap
        const sensitivity = 25; // Increased from 10 to 25 for better sensitivity
        const normalizedVolume = smoothedVolume * sensitivity;
        
        // Use a softer cap to preserve dynamic range
        return Math.min(normalizedVolume, 2); // Allow values up to 2 for better response
    }

    calculateDominantFrequency() {
        let maxAmplitude = 0;
        let maxIndex = 0;
        
        // Find the frequency bin with the highest amplitude
        for (let i = 0; i < this.frequencyData.length; i++) {
            if (this.frequencyData[i] > maxAmplitude) {
                maxAmplitude = this.frequencyData[i];
                maxIndex = i;
            }
        }
        
        // Convert bin index to frequency in Hz
        const nyquistFrequency = this.audioContext.sampleRate / 2;
        const frequency = (maxIndex / this.bufferLength) * nyquistFrequency;
        
        return frequency;
    }

    getFrequencyRange(minFreq, maxFreq) {
        if (!this.frequencyData) return [];
        
        const nyquistFrequency = this.audioContext.sampleRate / 2;
        const minIndex = Math.floor((minFreq / nyquistFrequency) * this.bufferLength);
        const maxIndex = Math.floor((maxFreq / nyquistFrequency) * this.bufferLength);
        
        return Array.from(this.frequencyData.slice(minIndex, maxIndex + 1));
    }

    getBassLevel() {
        // Get bass frequencies (20Hz - 250Hz)
        const bassData = this.getFrequencyRange(20, 250);
        if (bassData.length === 0) return 0;
        
        const average = bassData.reduce((sum, val) => sum + val, 0) / bassData.length;
        return average / 255;
    }

    getMidLevel() {
        // Get mid frequencies (250Hz - 4000Hz)
        const midData = this.getFrequencyRange(250, 4000);
        if (midData.length === 0) return 0;
        
        const average = midData.reduce((sum, val) => sum + val, 0) / midData.length;
        return average / 255;
    }

    getTrebleLevel() {
        // Get treble frequencies (4000Hz - 20000Hz)
        const trebleData = this.getFrequencyRange(4000, 20000);
        if (trebleData.length === 0) return 0;
        
        const average = trebleData.reduce((sum, val) => sum + val, 0) / trebleData.length;
        return average / 255;
    }

    setFFTSize(size) {
        if (this.analyser && [256, 512, 1024, 2048, 4096, 8192, 16384, 32768].includes(size)) {
            this.analyser.fftSize = size;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(this.bufferLength);
            this.timeDomainData = new Uint8Array(this.bufferLength);
            console.log(`FFT size changed to ${size}, buffer length: ${this.bufferLength}`);
        }
    }

    setSmoothingTimeConstant(value) {
        if (this.analyser && value >= 0 && value <= 1) {
            this.analyser.smoothingTimeConstant = value;
            console.log(`Smoothing time constant set to ${value}`);
        }
    }

    setMinMaxDecibels(min, max) {
        if (this.analyser && min < max) {
            this.analyser.minDecibels = min;
            this.analyser.maxDecibels = max;
            console.log(`Decibel range set to ${min} - ${max} dB`);
        }
    }

    getAudioContext() {
        return this.audioContext;
    }

    getAnalyser() {
        return this.analyser;
    }

    isInitialized() {
        return this.audioContext !== null && this.analyser !== null;
    }

    destroy() {
        this.stop();
        
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        
        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.frequencyData = null;
        this.timeDomainData = null;
        this.volumeHistory = [];
        
        console.log('Audio analyzer destroyed');
    }
}

// Utility functions for audio processing
class AudioUtils {
    static frequencyToMelScale(frequency) {
        return 2595 * Math.log10(1 + frequency / 700);
    }

    static melScaleToFrequency(mel) {
        return 700 * (Math.pow(10, mel / 2595) - 1);
    }

    static normalizeFrequencyData(data, min = 0, max = 255) {
        const range = max - min;
        return data.map(value => (value - min) / range);
    }

    static applyWindow(data, windowType = 'hanning') {
        const length = data.length;
        const windowed = new Array(length);

        switch (windowType) {
            case 'hanning':
                for (let i = 0; i < length; i++) {
                    const window = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (length - 1));
                    windowed[i] = data[i] * window;
                }
                break;
            case 'hamming':
                for (let i = 0; i < length; i++) {
                    const window = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (length - 1));
                    windowed[i] = data[i] * window;
                }
                break;
            default:
                return data;
        }

        return windowed;
    }

    static detectOnset(volume, threshold = 0.3, history = []) {
        if (history.length < 2) {
            history.push(volume);
            return false;
        }

        const previousVolume = history[history.length - 1];
        const increase = volume - previousVolume;
        
        history.push(volume);
        if (history.length > 10) {
            history.shift();
        }

        return increase > threshold;
    }

    static calculateSpectralCentroid(frequencyData, sampleRate) {
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < frequencyData.length; i++) {
            const frequency = (i / frequencyData.length) * (sampleRate / 2);
            const magnitude = frequencyData[i];
            
            numerator += frequency * magnitude;
            denominator += magnitude;
        }
        
        return denominator > 0 ? numerator / denominator : 0;
    }
}
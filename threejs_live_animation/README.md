# Audio-Reactive Three.js Visualizer

A real-time audio visualization application that creates stunning 3D animations that respond to microphone input using Three.js and the Web Audio API.

## Features

### Visual Effects
- **Dancing Cubes**: A grid of cubes that scale and rotate based on audio frequency bands
- **Reactive Sphere**: A deformable sphere with vertex displacement and dynamic scaling
- **Particle Storm**: 2000+ particles with spiral motion and color changes
- **Audio Waves**: A wave-like surface that ripples and moves with the audio

### Audio Processing
- Real-time microphone input processing
- Frequency analysis with configurable FFT size
- Separate bass, mid, and treble frequency band extraction
- Volume and dominant frequency detection
- Smoothing filters for stable animations

### Interactive Controls
- **Start/Stop Audio**: Control audio input processing
- **Sensitivity Slider**: Adjust animation responsiveness (0.1x - 5x)
- **Animation Modes**: Switch between different visualization types
- **Preset Buttons**: Quick settings for Gentle, Smooth, or Intense animations
- **Keyboard Shortcuts**: Space to toggle, 1-4 for modes, arrows for sensitivity

### Technical Features
- Responsive design that works on desktop and mobile
- Automatic camera rotation around the scene
- Dynamic lighting that responds to audio
- Performance optimization with configurable update intervals
- Local storage for settings persistence
- Error handling and user feedback

## Getting Started

### Prerequisites
- A modern web browser with Web Audio API support (Chrome, Firefox, Safari, Edge)
- Microphone access permissions
- HTTPS connection (required for microphone access in production)

### Installation
1. Clone or download the project files
2. Ensure all files are in the same directory:
   ```
   ├── index.html
   ├── style.css
   ├── main.js
   ├── threejs-scene.js
   ├── audio-analyzer.js
   └── animations.js
   ```
3. Serve the files using a local web server (required for file loading)

### Quick Start (Recommended)

**Windows Users:**
1. Double-click `start-server.bat`
2. Your browser will open automatically
3. Click "Start Audio" and allow microphone access

**Mac/Linux Users:**
1. Run `./start-server.sh` in terminal
2. Open the displayed URL in your browser
3. Click "Start Audio" and allow microphone access

### Manual Setup
You can also use any local server:

**Python 3:**
```bash
cd threejs_live_animation
python -m http.server 8000
# Then visit: http://localhost:8000
```

**Node.js (with http-server):**
```bash
cd threejs_live_animation
npx http-server
# Then visit: http://localhost:8080
```

**VS Code Live Server Extension:**
Right-click on `index.html` and select "Open with Live Server"

### ⚠️ IMPORTANT REQUIREMENTS
- **Must use HTTP server** - Cannot open `index.html` directly in browser
- **Must use localhost or HTTPS** - Required for microphone access
- **Modern browser required** - Chrome 47+, Firefox 36+, Safari 11+, Edge 12+

### Usage
1. Open the application in your web browser
2. Click "Start Audio" to begin visualization
3. Allow microphone access when prompted
4. Make some noise and watch the visuals respond!
5. Use the controls to adjust sensitivity and change animation modes

## Controls

### Mouse/Touch
- The application is primarily controlled through the UI panel

### Keyboard Shortcuts
- **Space**: Start/Stop audio processing
- **1**: Switch to Dancing Cubes mode
- **2**: Switch to Reactive Sphere mode
- **3**: Switch to Particle Storm mode
- **4**: Switch to Audio Waves mode
- **↑/↓**: Increase/Decrease sensitivity

### UI Controls
- **Sensitivity Slider**: Adjusts how responsive animations are to audio (0.1-5.0)
- **Animation Mode Dropdown**: Select visualization type
- **Preset Buttons**: Apply pre-configured animation settings
- **Audio Level**: Real-time volume display
- **Dominant Frequency**: Shows the strongest frequency detected

## Customization

### Animation Parameters
Each animation mode has configurable parameters in the `animations.js` file:

```javascript
// Example: Customize cube animations
this.params.cubes = {
    scaleMultiplier: 3,     // How much cubes scale with audio
    rotationSpeed: 0.01,    // Rotation speed
    colorShift: true,       // Enable color changes
    heightVariation: true   // Enable vertical movement
};
```

### Audio Settings
Modify audio processing parameters in `audio-analyzer.js`:

```javascript
this.fftSize = 2048;                    // Frequency resolution
this.smoothingTimeConstant = 0.8;       // Audio smoothing
this.minDecibels = -90;                 // Minimum volume threshold
this.maxDecibels = -10;                 // Maximum volume threshold
```

### Visual Styling
Customize the appearance in `style.css`:
- Control panel styling
- Color schemes
- Responsive breakpoints
- Animation transitions

## Browser Compatibility

### Fully Supported
- Chrome 66+
- Firefox 60+
- Safari 11+
- Edge 79+

### Requirements
- Web Audio API support
- WebGL support
- getUserMedia API for microphone access
- ES6+ JavaScript support

## Performance Notes

### Optimization Tips
- Use lower FFT sizes (1024 or 512) for better performance on slower devices
- Reduce particle count in particle mode for mobile devices
- Adjust update intervals for smoother performance
- Close other audio applications that might conflict

### Performance Settings
```javascript
// In animations.js, reduce update frequency for better performance
this.setUpdateInterval(2); // Update every 2nd frame instead of every frame

// Reduce particle count in threejs-scene.js
const particleCount = 1000; // Instead of 2000
```

## Troubleshooting

### Common Issues

**"Microphone access denied"**
- Reload the page and click "Allow" when prompted
- Check browser permissions in settings
- Ensure you're using HTTPS in production

**"No audio detected"**
- Check microphone volume levels
- Try a different microphone or audio input
- Verify other applications can access the microphone

**"Performance issues"**
- Close unnecessary browser tabs
- Reduce animation sensitivity
- Switch to a simpler animation mode (Cubes)
- Use a more powerful device

**"Visualizations not responding"**
- Increase sensitivity slider
- Make louder sounds or music
- Check that microphone is not muted
- Try different frequency ranges (bass vs treble)

### Browser-Specific Notes

**Chrome**: Best performance and compatibility
**Firefox**: Good support, may need to enable audio permissions
**Safari**: Works well on macOS/iOS, may have some WebGL limitations
**Edge**: Good compatibility with Chromium-based versions

## File Structure

```
threejs_live_animation/
├── index.html          # Main HTML structure and UI
├── style.css           # Styling and responsive design
├── main.js             # Application initialization and coordination
├── threejs-scene.js    # Three.js scene setup and 3D objects
├── audio-analyzer.js   # Web Audio API processing and analysis
└── animations.js       # Animation logic and audio-reactive effects
```

## Technical Architecture

### Audio Pipeline
1. **Microphone Input** → getUserMedia API captures audio stream
2. **Audio Context** → Creates Web Audio processing context
3. **Analyzer Node** → Performs FFT analysis on audio data
4. **Data Processing** → Extracts frequency bands and volume levels
5. **Animation Updates** → Drives 3D visual effects

### Rendering Pipeline
1. **Three.js Scene** → 3D objects, lighting, and camera
2. **Animation System** → Processes audio data into visual parameters
3. **Object Updates** → Modifies geometry, materials, and transforms
4. **Render Loop** → Continuous 60fps rendering

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## Credits

- Built with [Three.js](https://threejs.org/) for 3D graphics
- Uses the Web Audio API for real-time audio processing
- Responsive design with modern CSS
- Cross-browser compatibility testing
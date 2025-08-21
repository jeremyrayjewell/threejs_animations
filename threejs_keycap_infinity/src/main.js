import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00); // Green background

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 30, 30); // Position camera above and behind the plane
camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// TODO: Add your new animation objects here

// Load keycap model and create sphere
const loader = new GLTFLoader();
loader.load(
  '/models/keycap.glb',
  function (gltf) {
    console.log('GLTF model loaded:', gltf);
    const model = gltf.scene;
    model.scale.set(0.005, 0.005, 0.005); // Make keycaps smaller
    
    // Set material
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xf5f5dc, // Light beige color
          metalness: 0.3,
          roughness: 0.4
        });
      }
    });

    // Create endless plane of keycaps
    const keycaps = [];
    const spacing = 7
    ; // Distance between keycaps
    const gridSize = 100; // Number of keycaps in each direction (40x40 = 1600 keycaps)
    
    for (let x = -gridSize/2; x < gridSize/2; x++) {
      for (let z = -gridSize/2; z < gridSize/2; z++) {
        const keycap = model.clone();
        
        // Position keycaps in a grid on the XZ plane
        keycap.position.set(
          x * spacing + (Math.random() - 0.5) * 0.5, // Add slight random offset
          0, // All keycaps on the same Y level
          z * spacing + (Math.random() - 0.5) * 0.5  // Add slight random offset
        );
        
        scene.add(keycap);
        keycaps.push(keycap);
      }
    }
    
    // Animate the keycap plane
    function animateKeycapPlane() {
      const time = Date.now() * 0.001;
      
      // Simulate random keystrokes
      keycaps.forEach((keycap, index) => {
        // Store original position and keystroke data if not already stored
        if (!keycap.userData.originalPosition) {
          keycap.userData.originalPosition = keycap.position.clone();
          keycap.userData.lastKeystroke = Math.random() * 10; // Random initial timing
          keycap.userData.keystrokeState = 0; // 0 = up, 1 = pressing down, 2 = returning up
          keycap.userData.keystrokeDuration = 0.3 + Math.random() * 0.2; // Variable keystroke speed
        }
        
        const originalPos = keycap.userData.originalPosition;
        
        // Check if it's time for a new keystroke (random chance each frame)
        if (keycap.userData.keystrokeState === 0 && Math.random() < 0.002) { // 0.2% chance per frame
          keycap.userData.lastKeystroke = time;
          keycap.userData.keystrokeState = 1; // Start pressing down
        }
        
        // Calculate keystroke animation
        const timeSinceKeystroke = time - keycap.userData.lastKeystroke;
        let yOffset = 0;
        
        if (keycap.userData.keystrokeState === 1) { // Pressing down
          const progress = Math.min(timeSinceKeystroke / (keycap.userData.keystrokeDuration * 0.3), 1);
          yOffset = -Math.sin(progress * Math.PI * 0.5) * 1.5; // Press down 1.5 units
          
          if (progress >= 1) {
            keycap.userData.keystrokeState = 2; // Switch to returning up
          }
        } else if (keycap.userData.keystrokeState === 2) { // Returning up
          const progress = Math.min((timeSinceKeystroke - keycap.userData.keystrokeDuration * 0.3) / (keycap.userData.keystrokeDuration * 0.7), 1);
          yOffset = -1.5 + Math.sin(progress * Math.PI * 0.5) * 1.5; // Return to normal
          
          if (progress >= 1) {
            keycap.userData.keystrokeState = 0; // Back to idle
          }
        }
        
        // Apply keystroke position
        keycap.position.y = originalPos.y + yOffset;
        keycap.position.x = originalPos.x;
        keycap.position.z = originalPos.z;
      });
    }
    
    // Store animation function globally so it can be called from main loop
    window.animateKeycapPlane = animateKeycapPlane;
    
    console.log('Keycap plane created with', keycaps.length, 'keycaps');
  },
  undefined,
  function (error) {
    console.error('Error loading keycap model:', error);
  }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Create flying camera movement - straight flight over the field
    const time = Date.now() * 0.001;
    
    // Flying straight with constant speed
    const speed = 5; // Forward speed
    const altitude = 25 + Math.sin(time * 0.5) * 2; // Gentle altitude variation
    
    // Move forward in a straight line (along Z axis)
    camera.position.x = Math.sin(time * 0.1) * 3; // Very slight side-to-side drift
    camera.position.z = (time * speed) % 200 - 100; // Move forward, reset position to create loop
    camera.position.y = altitude;
    
    // Look straight ahead and slightly down
    const lookAheadX = camera.position.x;
    const lookAheadZ = camera.position.z + 20; // Look ahead
    const lookAheadY = altitude - 8; // Look down at the keycaps
    
    camera.lookAt(lookAheadX, lookAheadY, lookAheadZ);
    
    // Animate the keycap plane if it's loaded
    if (window.animateKeycapPlane) {
        window.animateKeycapPlane();
    }
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
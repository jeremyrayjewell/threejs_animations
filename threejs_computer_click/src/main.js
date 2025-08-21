import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00); // Green background

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 2, 10);
camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Much brighter ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Much brighter directional light
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load computer model
let computerModel = null; // Store reference for animation
const loader = new GLTFLoader();
loader.load(
  '/models/my_computer.glb',
  function (gltf) {
    console.log('Computer model loaded:', gltf);
    const model = gltf.scene;
    model.scale.set(1.1, 1.1, 1.1);
    
    // Keep original materials and textures
    scene.add(model);
    computerModel = model; // Store reference for movement animation
    console.log('Computer model added to scene');
  },
  undefined,
  function (error) {
    console.error('Error loading computer model:', error);
  }
);

// Load mouse cursor model
let arrowModel = null; // Store reference for animation
loader.load(
  '/models/3d_mouse_cursor.glb',
  function (gltf) {
    console.log('Mouse cursor model loaded:', gltf);
    const model = gltf.scene;
    model.scale.set(.25, .25, .25);
    model.position.set(-0.5, 0, 6); // Position it next to the computer
    model.rotation.x = -2; // No X rotation
    model.rotation.z = 5.5; // No Z rotation
    model.rotation.y = -6; // No Y rotation - arrow points up naturally

    // Keep original materials and textures
    scene.add(model);
    arrowModel = model; // Store reference for wobbling animation
    console.log('Mouse cursor model added to scene');
  },
  undefined,
  function (error) {
    console.error('Error loading mouse cursor model:', error);
  }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Make the arrow wobble and swing
    if (arrowModel) {
        const time = Date.now() * 0.001;
        const cycleTime = (time * 0.067) % 1; // Same cycle timing as computer
        
        // Make arrow invisible during collision, transition, and camera spin phases
        if (cycleTime >= 0.25 && cycleTime < 0.75) {
            // Collision, transition, and camera spin phases - arrow is invisible
            arrowModel.visible = false;
        } else {
            // Arrow is visible during approach and retreat
            arrowModel.visible = true;
            
            // Add wobbling motion to the arrow (only when visible)
            arrowModel.rotation.x = -2 + Math.sin(time * 3) * 0.2; // Wobble around X axis
            arrowModel.rotation.z = 5.5 + Math.cos(time * 2.5) * 0.15; // Wobble around Z axis
            arrowModel.rotation.y = -6 + Math.sin(time * 2) * 0.1; // Slight wobble around Y axis
            
            // Add swinging motion (pendulum-like movement)
            arrowModel.position.x = -0.5 + Math.sin(time * 1.2) * 1.5; // Swing left and right
            arrowModel.position.y = 0 + Math.abs(Math.sin(time * 1.2)) * 0.3; // Slight up/down arc motion
        }
    }
    
    // Make the computer move in a loop from horizon to collision and back
    if (computerModel) {
        const time = Date.now() * 0.001;
        
        // Create a looping movement cycle (15 seconds per cycle - extended for camera spin)
        const cycleTime = (time * 0.067) % 1; // 0 to 1 cycle (even slower)
        
        if (cycleTime < 0.25) {
            // Moving forward (0 to 0.25 of cycle) - 25% of time approaching (3.75 seconds)
            const progress = cycleTime / 0.25; // 0 to 1
            computerModel.position.z = -500 + progress * 505; // Move from -500 to +5 (massive distant start)
            
            // Reset camera to original position during approach
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);
        } else if (cycleTime < 0.45) {
            // Staying at collision point (0.25 to 0.45 of cycle) - 20% of time at contact (3 seconds)
            computerModel.position.z = 5; // Stay at collision point
            
            // Flash effect during collision
            const flashTime = (cycleTime - 0.25) / 0.2; // 0 to 1 during collision phase
            const flashIntensity = 3 + Math.sin(flashTime * Math.PI * 8) * 2; // Rapid flashing
            
            // Make both lights flash brighter
            ambientLight.intensity = flashIntensity;
            directionalLight.intensity = flashIntensity + 1;
            
            // Keep camera at original position and looking at origin during collision
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);
        } else if (cycleTime < 0.55) {
            // Transition phase (0.45 to 0.55 of cycle) - 10% of time transitioning (1.5 seconds)
            computerModel.position.z = 5; // Keep computer at collision point
            
            // Gradually return lights to normal
            const transitionTime = (cycleTime - 0.45) / 0.1; // 0 to 1 during transition
            ambientLight.intensity = 5 - (3 * transitionTime); // Fade from 5 to 2
            directionalLight.intensity = 6 - (3.5 * transitionTime); // Fade from 6 to 2.5
            
            // Smoothly transition camera position AND look-at target
            const startX = 0, startY = 5, startZ = 10;
            const endX = 10, endY = 5, endZ = 5;
            
            // Smooth position transition
            camera.position.x = startX + (endX - startX) * transitionTime;
            camera.position.y = startY + (endY - startY) * transitionTime;
            camera.position.z = startZ + (endZ - startZ) * transitionTime;
            
            // Smooth look-at transition from (0,0,0) to computer position
            const lookStartX = 0, lookStartY = 0, lookStartZ = 0;
            const lookEndX = computerModel.position.x;
            const lookEndY = computerModel.position.y;
            const lookEndZ = computerModel.position.z;
            
            const lookAtX = lookStartX + (lookEndX - lookStartX) * transitionTime;
            const lookAtY = lookStartY + (lookEndY - lookStartY) * transitionTime;
            const lookAtZ = lookStartZ + (lookEndZ - lookStartZ) * transitionTime;
            
            camera.lookAt(lookAtX, lookAtY, lookAtZ);
        } else if (cycleTime < 0.75) {
            // Camera spinning phase (0.55 to 0.75 of cycle) - 20% of time spinning (3 seconds)
            computerModel.position.z = 5; // Keep computer at collision point
            
            // Lights at normal level
            ambientLight.intensity = 2.0;
            directionalLight.intensity = 2.5;
            
            // Spin camera around the computer twice, continuing smoothly from transition
            const spinTime = (cycleTime - 0.55) / 0.2; // 0 to 1 during spin phase
            // The transition ended at (10, 5, 10), which is angle 0, so start spinning from there
            const angle = spinTime * Math.PI * 4; // Two full rotations (4π) starting from 0
            const radius = 10;
            
            // Position camera in circular motion around computer at (0, 0, 5)
            camera.position.x = Math.cos(angle) * radius;
            camera.position.z = 5 + Math.sin(angle) * radius; // Center the circle around computer's Z position
            camera.position.y = 5 + Math.sin(spinTime * Math.PI * 2) * 2; // Add some vertical movement
            camera.lookAt(computerModel.position);
        } else {
            // Moving backward (0.75 to 1 of cycle) - 25% of time retreating (3.75 seconds)
            const progress = (cycleTime - 0.75) / 0.25; // 0 to 1
            computerModel.position.z = 5 - progress * 505; // Move from +5 back to -500 (massive distant retreat)
            
            // Return lights to normal
            ambientLight.intensity = 2.0;
            directionalLight.intensity = 2.5;
            
            // Reset camera to original position during retreat
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);
        }
        
        // Keep computer at origin for X and Y
        computerModel.position.x = 0;
        computerModel.position.y = 0;
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
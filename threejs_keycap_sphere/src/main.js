import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00); // Green background

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 50);

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

    // Create sphere of keycaps
    const keycaps = [];
    const sphereRadius = 20;
    const numKeycaps = 40; // Reduced to ensure no overlap
    
    // Generate well-distributed points using spiral method with better spacing
    for (let i = 0; i < numKeycaps; i++) {
      const keycap = model.clone();
      
      // Use Fibonacci spiral with better distribution
      const offset = 2.0 / numKeycaps;
      const increment = Math.PI * (3.0 - Math.sqrt(5.0)); // Golden angle
      
      const y = ((i * offset) - 1) + (offset / 2);
      const r = Math.sqrt(1 - Math.pow(y, 2));
      const phi = i * increment;
      
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      
      // Scale to sphere radius
      const finalX = x * sphereRadius;
      const finalY = y * sphereRadius;
      const finalZ = z * sphereRadius;
      
      keycap.position.set(finalX, finalY, finalZ);
      
      // Orient keycap so its top surface faces outward from sphere center
      const outwardDirection = new THREE.Vector3(finalX, finalY, finalZ).normalize();
      
      // Create a rotation matrix to align keycap's up vector (Y-axis) with outward direction
      const up = new THREE.Vector3(0, 1, 0); // Keycap's default up direction
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, outwardDirection);
      keycap.setRotationFromQuaternion(quaternion);
      
      scene.add(keycap);
      keycaps.push(keycap);
    }
    
    // Animate the sphere
    function animateSphere() {
      const time = Date.now() * 0.001;
      
      // Calculate pulsating scale with smooth dramatic expansions
      const basePulse = 1 + Math.max(0, Math.sin(time * 2)) * 0.08; // Visible breathing (1.0 to 1.08)
      
      // Create smooth expansion waves that occasionally get large
      const expansionWave = Math.sin(time * 0.3); // Slow wave for expansion timing
      const expansionIntensity = Math.max(0, Math.sin(time * 0.15) - 0.7) * 5; // More intense spikes
      const dramaticExpansion = Math.max(0, expansionWave * expansionIntensity * 1.5); // Much larger dramatic expansions
      
      const pulseScale = basePulse + dramaticExpansion; // Combine both effects smoothly
      
      // Rotate the entire sphere randomly around multiple axes
      keycaps.forEach((keycap, index) => {
        // Store original position if not already stored
        if (!keycap.userData.originalPosition) {
          keycap.userData.originalPosition = keycap.position.clone();
          keycap.userData.originalQuaternion = keycap.quaternion.clone();
        }
        
        // Create rotation matrix for the entire sphere
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationFromEuler(new THREE.Euler(
          time * 0.3, // X rotation
          time * 0.2, // Y rotation  
          time * 0.1  // Z rotation
        ));
        
        // Apply rotation to original position
        const newPosition = keycap.userData.originalPosition.clone();
        newPosition.applyMatrix4(rotationMatrix);
        
        // Apply pulsating effect
        newPosition.multiplyScalar(pulseScale);
        
        keycap.position.copy(newPosition);
        
        // Update orientation to still face outward
        const outwardDirection = newPosition.clone().normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, outwardDirection);
        keycap.setRotationFromQuaternion(quaternion);
      });
    }
    
    // Store animation function globally so it can be called from main loop
    window.animateSphere = animateSphere;
    
    console.log('Keycap sphere created with', numKeycaps, 'keycaps');
  },
  undefined,
  function (error) {
    console.error('Error loading keycap model:', error);
  }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Animate the keycap sphere if it's loaded
    if (window.animateSphere) {
        window.animateSphere();
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
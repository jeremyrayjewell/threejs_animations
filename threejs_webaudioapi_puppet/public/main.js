

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4.2, 6); // Camera moved down very slightly
camera.lookAt(0, 4, 0); // Look at head level

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Character building area - we'll build your custom character here using Three.js geometries
// Available geometries: BoxGeometry, SphereGeometry, CylinderGeometry, ConeGeometry, etc.

// Example: Let's start with a simple character base
// Head - pill shape (capsule) for better proportions
const headGroup = new THREE.Group();

// Main cylindrical part of the head
const headCylinderGeometry = new THREE.CylinderGeometry(0.7, 0.65, 0.4, 16); // Top wider, bottom narrower for natural jaw taper
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Skin color
const headCylinder = new THREE.Mesh(headCylinderGeometry, headMaterial);
headCylinder.position.y = 0; // Center of head group
headCylinder.scale.set(0.85, 1, 0.85); // Make skinnier by scaling X and Z only, keep Y height
headCylinder.castShadow = true;
headGroup.add(headCylinder);

// Top hemisphere of head
const headTopGeometry = new THREE.SphereGeometry(0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
const headTop = new THREE.Mesh(headTopGeometry, headMaterial);
headTop.position.y = 0.2; // Top of shorter cylinder
headTop.scale.set(0.85, 1, 0.85); // Make skinnier by scaling X and Z only, keep Y height
headTop.castShadow = true;
headGroup.add(headTop);

// Bottom hemisphere of head
const headBottomGeometry = new THREE.SphereGeometry(0.65, 16, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5);
const headBottom = new THREE.Mesh(headBottomGeometry, headMaterial);
headBottom.position.y = -0.2; // Bottom of shorter cylinder
headBottom.scale.set(0.85, 1, 0.85); // Make skinnier by scaling X and Z only, keep Y height
headBottom.castShadow = true;
headGroup.add(headBottom);

// ...existing code continues...

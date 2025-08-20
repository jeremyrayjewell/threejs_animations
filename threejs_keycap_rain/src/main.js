// Utility: Generate a canvas texture with a character
function createKeycapTexture(char) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#111';
  ctx.shadowColor = '#bbb';
  ctx.shadowBlur = 8;
  ctx.fillText(char, size/2, size/2 + 8);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

// Utility: Pick a random letter, number, or symbol
function randomKeycapChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{};:,.<>/?';
  return chars[Math.floor(Math.random() * chars.length)];
}
import * as CANNON from 'cannon-es';
// (removed erroneous code before imports)
// Load keycap.glb model


import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00);

// DEBUG: Add a large red cube at the origin

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
// Move camera much closer for immersive rain
camera.position.set(0, 60, 40);
camera.lookAt(0, 60, 0); // perpendicular to falling direction

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Animation loop (always runs)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



// Load keycap.glb model
const loader = new GLTFLoader();
loader.load(
  '/models/keycap.glb',
  function (gltf) {
    console.log('GLTF model loaded:', gltf);
    const model = gltf.scene;
    model.position.set(0, 0, -10);
    model.scale.set(0.005, 0.005, 0.005); // Smaller size
    // Set all mesh materials to gray and ensure they are illuminated
    model.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.color.set(0xb0b0b0); // gray
          child.material.metalness = 0.2;
          child.material.roughness = 0.4;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    // Compute bounding box for accurate physics and grid
    const bbox = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const keycapSizeX = size.x / 2;
    const keycapSizeY = size.y / 2;
    const keycapSizeZ = size.z / 2;
    // Use loaded model as template for cloning
    const template = model;
    // Raining keycaps with physics
    const NUM_KEYCAPS = 300; // much more keycaps for denser rain
    const keycaps = [];
    const bodies = [];

    // Cannon-es world setup
    // Cannon-es world setup
    const world = new CANNON.World();
    world.gravity.set(0, -12, 0); // much faster falling
    world.solver.iterations = 10;

    // Materials for low bounce and higher friction (must be after world is defined)
    const groundMaterial = new CANNON.Material('ground');
    const keycapMaterial = new CANNON.Material('keycap');
    const contactMaterial = new CANNON.ContactMaterial(groundMaterial, keycapMaterial, {
      friction: 0.6,
      restitution: 0.05 // very little bounce
    });
    world.addContactMaterial(contactMaterial);

    // Keycap shape (approximate as a box)
    // Use measured bounding box for physics and grid
    const keycapShape = new CANNON.Box(new CANNON.Vec3(keycapSizeX, keycapSizeY, keycapSizeZ));

    // Floor
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    groundBody.addShape(new CANNON.Plane());
    groundBody.position.set(0, -6, 0);
    groundBody.position.set(0, -60, 0); // much lower ground
    groundBody.quaternion.set(0, 0, 0, 1); // ensure perfectly horizontal
    world.addBody(groundBody);

    // Spawn keycaps with physics
    // Spawn keycaps in a grid above the ground
    // Spawn keycaps randomly in a much broader area, with staggered Y for continuous rain
    const SPAWN_X = 200; // focus rain in camera view
    const SPAWN_Z = 300; // much deeper for more distant keys
    const SPAWN_Y_MIN = 120;
    const SPAWN_Y_MAX = 220;
// Number of keycaps to spawn (top-level, so no redeclaration)

    // Helper to spawn a single keycap at a random X/Z
    function spawnKeycap() {
      const keycap = template.clone(true);
      // Assign a random character texture to the top face
      // Restore plain keycaps: set all meshes to gray
      keycap.traverse(child => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            metalness: 0.2,
            roughness: 0.4
          });
        }
      });

      // Try up to 10 times to find a non-overlapping spawn position
      let spawnX, spawnZ, spawnY;
      let tries = 0;
      let minDist = 1.2; // even larger minimum distance
      let valid = false;
      while (!valid && tries < 10) {
        spawnX = (Math.random() - 0.5) * SPAWN_X;
        spawnZ = (Math.random() - 0.5) * SPAWN_Z;
        spawnY = -60 + Math.random() * (SPAWN_Y_MAX + 60);
        valid = true;
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          const dx = b.position.x - spawnX;
          const dy = b.position.y - spawnY;
          const dz = b.position.z - spawnZ;
          const dist3d = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist3d < minDist) {
            valid = false;
            break;
          }
        }
        tries++;
      }

      const body = new CANNON.Body({
        mass: 1,
        shape: keycapShape,
        position: new CANNON.Vec3(spawnX, spawnY, spawnZ),
        angularDamping: 0.15, // lower damping for persistent rotation
        linearDamping: 0.8,
        material: keycapMaterial
      });
      // Random initial rotation
      body.quaternion.setFromEuler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      // Random downward speed and spin
      const fallSpeed = -8 - Math.random() * 6; // -8 to -14
      body.velocity.set(0, fallSpeed, 0);
      body.angularVelocity.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      world.addBody(body);
      scene.add(keycap);
      keycaps.push(keycap);
      bodies.push(body);
    }

    // Staggered spawn: each keycap starts falling after a random delay
    // Grid-based spawn to guarantee no overlap
    const cellSize = Math.max(keycapSizeX, keycapSizeZ) * 1.15; // much tighter packing, less gap
    const gridCols = Math.floor(SPAWN_X / cellSize);
    const gridRows = Math.floor(SPAWN_Z / cellSize);
    const totalCells = gridCols * gridRows;
    const numToSpawn = Math.min(NUM_KEYCAPS, totalCells);
    // Generate all possible grid positions
    let gridPositions = [];
    for (let col = 0; col < gridCols; col++) {
      for (let row = 0; row < gridRows; row++) {
        const x = (col - (gridCols-1)/2) * cellSize;
        const z = (row - (gridRows-1)/2) * cellSize;
        gridPositions.push({x, z});
      }
    }
    // Shuffle grid positions
    for (let i = gridPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gridPositions[i], gridPositions[j]] = [gridPositions[j], gridPositions[i]];
    }
    // Spawn keycaps at unique grid positions
    // Track which grid cells are occupied
    let occupiedCells = new Array(gridPositions.length).fill(false);
    // Helper to get a random free cell index
    function getFreeCellIndex() {
      const free = [];
      for (let i = 0; i < occupiedCells.length; i++) if (!occupiedCells[i]) free.push(i);
      if (free.length === 0) return -1;
      return free[Math.floor(Math.random() * free.length)];
    }
    // Initial spawn
    for (let i = 0; i < numToSpawn; i++) {
      const cellIdx = getFreeCellIndex();
      occupiedCells[cellIdx] = true;
      const pos = gridPositions[cellIdx];
      const keycap = template.clone(true);
      keycap.traverse(child => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            metalness: 0.2,
            roughness: 0.4
          });
        }
      });
      // Random Y within rain range
      const spawnY = SPAWN_Y_MIN + Math.random() * (SPAWN_Y_MAX - SPAWN_Y_MIN);
      const body = new CANNON.Body({
        mass: 1,
        shape: keycapShape,
        position: new CANNON.Vec3(pos.x, spawnY, pos.z),
        angularDamping: 0.15,
        linearDamping: 0.8,
        material: keycapMaterial
      });
      // Random initial rotation
      body.quaternion.setFromEuler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      // Random downward speed and spin
      const fallSpeed = -8 - Math.random() * 6;
      body.velocity.set(0, fallSpeed, 0);
      body.angularVelocity.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      world.addBody(body);
      scene.add(keycap);
      keycaps.push(keycap);
      bodies.push(body);
      // Store cell index for each keycap
      keycap.userData.cellIdx = cellIdx;
      body.userData = { cellIdx };
    }

    // Animate keycaps with physics
    function animateRainPhysics() {
      requestAnimationFrame(animateRainPhysics);
      world.step(1/60);
      for (let i = 0; i < keycaps.length; i++) {
        const keycap = keycaps[i];
        const body = bodies[i];
        // Clamp X/Z velocity to keep falling predominantly downward
        body.velocity.x *= 0.1;
        body.velocity.z *= 0.1;
        // Sync mesh with physics body
        keycap.position.copy(body.position);
        keycap.quaternion.copy(body.quaternion);
        // If keycap fell below threshold, respawn in a new free cell
        if (body.position.y < -60) {
          // Mark old cell as free
          if (typeof body.userData.cellIdx === 'number') {
            occupiedCells[body.userData.cellIdx] = false;
          }
          // Find a new free cell
          const cellIdx = getFreeCellIndex();
          occupiedCells[cellIdx] = true;
          const pos = gridPositions[cellIdx];
          const spawnY = SPAWN_Y_MAX;
          body.position.set(pos.x, spawnY, pos.z);
          // Random downward speed and spin
          const fallSpeed = -8 - Math.random() * 6;
          body.velocity.set(0, fallSpeed, 0);
          body.angularVelocity.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          );
          // Random initial rotation
          body.quaternion.setFromEuler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );
          // Store new cell index
          body.userData.cellIdx = cellIdx;
          keycap.userData.cellIdx = cellIdx;
        }
      }
      renderer.render(scene, camera);
    }
    animateRainPhysics();
    console.log('keycap.glb loaded and raining in scene with physics');
  },
  undefined,
  function (error) {
    console.error('An error happened loading keycap.glb:', error);
    if (error && error.target && error.target.status) {
      console.error('HTTP status:', error.target.status);
    }
    if (error && error.message) {
      console.error('Error message:', error.message);
    }
    alert('Failed to load keycap.glb. Check the browser console for details.');
  }
);

// Animation will start after keycaps are loaded
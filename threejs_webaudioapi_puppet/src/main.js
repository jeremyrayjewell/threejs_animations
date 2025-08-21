import * as THREE from 'three';

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

// Position the entire head group
headGroup.position.y = 4.2; // Original value
headGroup.position.z = 0.15; // Move head forward slightly so neck doesn't intersect chin
scene.add(headGroup);

// Eyes
const eyeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White eyes

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-0.25, 0.00, 0.65); // Left side, lower on face, forward on head
leftEye.castShadow = true;
headGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.set(0.25, 0.00, 0.65); // Right side, lower on face, forward on head
rightEye.castShadow = true;
headGroup.add(rightEye);

// Pupils
const pupilGeometry = new THREE.SphereGeometry(0.06, 16, 16);
const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black pupils

const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
leftPupil.position.set(-0.25, 0.00, 0.71); // Slightly forward of eye
leftPupil.castShadow = true;
headGroup.add(leftPupil);

const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
rightPupil.position.set(0.25, 0.00, 0.71); // Slightly forward of eye
rightPupil.castShadow = true;
headGroup.add(rightPupil);

// Eyelids (for blinking)
const eyelidGeometry = new THREE.SphereGeometry(0.13, 16, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5); // Bottom hemisphere for eyelids
const eyelidMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Same as head

const leftEyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
leftEyelid.position.set(-0.25, 0.00, 0.66); // Same position as eye but slightly forward
leftEyelid.rotation.x = Math.PI; // Flip to create top eyelid that closes down
leftEyelid.scale.y = 0; // Start closed (invisible)
leftEyelid.castShadow = true;
headGroup.add(leftEyelid);

const rightEyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
rightEyelid.position.set(0.25, 0.00, 0.66); // Same position as eye but slightly forward
rightEyelid.rotation.x = Math.PI; // Flip to create top eyelid that closes down
rightEyelid.scale.y = 0; // Start closed (invisible)
rightEyelid.castShadow = true;
headGroup.add(rightEyelid);

// Glasses (round-framed)
const glassesMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3 });

// Left lens
const leftLensGeometry = new THREE.TorusGeometry(0.165, 0.018, 16, 32);
const leftLens = new THREE.Mesh(leftLensGeometry, glassesMaterial);
leftLens.position.set(-0.25, 0.00, 0.80); // Further in front of left eye

// Right lens
const rightLensGeometry = new THREE.TorusGeometry(0.165, 0.018, 16, 32);
const rightLens = new THREE.Mesh(rightLensGeometry, glassesMaterial);
rightLens.position.set(0.25, 0.00, 0.80); // Further in front of right eye

// Glass (transparent, reflective) for both lenses
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.2,
  roughness: 0.01,
  transmission: 1.0, // true glass
  opacity: 0.22,
  transparent: true,
  ior: 1.6,
  thickness: 0.018,
  reflectivity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.01
});

// Left glass
const leftGlassGeometry = new THREE.SphereGeometry(0.145, 16, 16);
const leftGlass = new THREE.Mesh(leftGlassGeometry, glassMaterial);
leftGlass.position.set(-0.25, 0.00, 0.80);
leftGlass.scale.set(1, 1, 0.13); // Flatten to fit inside torus
headGroup.add(leftGlass);

// Right glass
const rightGlassGeometry = new THREE.SphereGeometry(0.145, 16, 16);
const rightGlass = new THREE.Mesh(rightGlassGeometry, glassMaterial);
rightGlass.position.set(0.25, 0.00, 0.80);
rightGlass.scale.set(1, 1, 0.13);
headGroup.add(rightGlass);
// Bridge
// Curved bridge using a quarter torus
const bridgeGeometry = new THREE.TorusGeometry(0.09, 0.012, 12, 24, Math.PI * 0.9);
const bridge = new THREE.Mesh(bridgeGeometry, glassesMaterial);
bridge.position.set(0, 0.045, 0.80); // Slightly higher for visible curve
bridge.rotation.set(Math.PI / 2, 0, 0); // Gentle upward curve

// Add glasses to head group
headGroup.add(leftLens);
headGroup.add(rightLens);
headGroup.add(bridge);

// Glasses arms

const armRadius = 0.012;
const glassesArmMaterial = glassesMaterial;

// Calculate arm endpoints
const leftFrameEdge = new THREE.Vector3(-0.25 - 0.165, 0, 0.80);
const leftEarHair = new THREE.Vector3(-0.52, 0.10, 0.62); // lateral, top of ear, near hair
const rightFrameEdge = new THREE.Vector3(0.25 + 0.165, 0, 0.80);
const rightEarHair = new THREE.Vector3(0.52, 0.10, 0.62); // lateral, top of ear, near hair

function createGlassesArm(start, end, material) {
  const armVec = new THREE.Vector3().subVectors(end, start);
  const armLength = armVec.length();
  const geometry = new THREE.CylinderGeometry(armRadius, armRadius, armLength, 12);
  const mesh = new THREE.Mesh(geometry, material);
  // Position at midpoint
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mesh.position.copy(mid);
  // Orient the cylinder
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), // cylinder default up
    armVec.clone().normalize()
  );
  return mesh;
}

// Left arm
const leftArm = createGlassesArm(leftFrameEdge, leftEarHair, glassesArmMaterial);
headGroup.add(leftArm);

// Right arm
const rightArm = createGlassesArm(rightFrameEdge, rightEarHair, glassesArmMaterial);
headGroup.add(rightArm);

// Eyebrows - curved using multiple segments
const eyebrowMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Saddle brown color

// Left eyebrow - create curved shape with multiple small cylinders
const leftEyebrowGroup = new THREE.Group();
const segmentGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 6); // Small cylinder segment

for (let i = 0; i < 5; i++) {
  const segment = new THREE.Mesh(segmentGeometry, eyebrowMaterial);
  const angle = (i - 2) * 0.3; // Spread segments in arc from -0.6 to +0.6 radians
  const radius = 0.15;
  
  // Position segments in an arc
  segment.position.x = Math.sin(angle) * radius;
  segment.position.y = Math.cos(angle) * radius * 0.3; // Flatten the arc
  segment.rotation.z = angle + Math.PI / 2; // Rotate each segment to follow the curve
  segment.castShadow = true;
  leftEyebrowGroup.add(segment);
}

leftEyebrowGroup.position.set(-0.25, 0.20, 0.68); // Position above left eye
headGroup.add(leftEyebrowGroup);

// Right eyebrow - create curved shape with multiple small cylinders (mirrored)
const rightEyebrowGroup = new THREE.Group();

for (let i = 0; i < 5; i++) {
  const segment = new THREE.Mesh(segmentGeometry, eyebrowMaterial);
  const angle = (i - 2) * 0.3; // Same arc
  const radius = 0.15;
  
  // Position segments in an arc (mirrored)
  segment.position.x = -Math.sin(angle) * radius; // Negative X for mirror
  segment.position.y = Math.cos(angle) * radius * 0.3; // Same Y curve
  segment.rotation.z = -angle + Math.PI / 2; // Mirrored rotation
  segment.castShadow = true;
  rightEyebrowGroup.add(segment);
}

rightEyebrowGroup.position.set(0.25, 0.20, 0.68); // Position above right eye
headGroup.add(rightEyebrowGroup);

// Nose
const noseGeometry = new THREE.ConeGeometry(0.12, 0.3, 8); // Much larger cone for visibility
const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xff9999 }); // Pink color to make it clearly visible

const nose = new THREE.Mesh(noseGeometry, noseMaterial);
nose.position.set(0, -0.10, 0.85); // Center, moved down slightly, much more forward
// No rotation - cone naturally points upward which is what we want for a nose
nose.castShadow = true;
headGroup.add(nose);

// Mouth - rounder and lower on face
const mouthGeometry = new THREE.SphereGeometry(0.1, 16, 8, 0, Math.PI * 2, 0, Math.PI); // Hemisphere for round mouth
const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black mouth

const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
mouth.position.set(0, -0.50, 0.68); // Even lower on the face, forward position
mouth.rotation.x = Math.PI; // Flip so opening faces outward
mouth.scale.set(1.2, 0.3, 1.0); // Wider, flatter oval shape
mouth.castShadow = true;
headGroup.add(mouth);

// Ears - more realistic shape and positioning
const earGeometry = new THREE.SphereGeometry(0.18, 12, 8); // Slightly larger spheres for ears
const earMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Same skin color as head

// Left ear
const leftEar = new THREE.Mesh(earGeometry, earMaterial);
leftEar.position.set(-0.55, -0.05, 0.05); // Closer to head, aligned with nose level, slightly forward
leftEar.scale.set(0.6, 1.2, 0.4); // More elongated vertically, flatter front-to-back
leftEar.rotation.y = Math.PI * 0.15; // Slight angle to cup forward
leftEar.castShadow = true;
leftEar.receiveShadow = true;
headGroup.add(leftEar);

// Right ear
const rightEar = new THREE.Mesh(earGeometry, earMaterial);
rightEar.position.set(0.55, -0.05, 0.05); // Closer to head, aligned with nose level, slightly forward
rightEar.scale.set(0.6, 1.2, 0.4); // More elongated vertically, flatter front-to-back
rightEar.rotation.y = -Math.PI * 0.15; // Slight angle to cup forward (mirrored)
rightEar.castShadow = true;
rightEar.receiveShadow = true;
headGroup.add(rightEar);

// Ear canals for more realism
const earCanalGeometry = new THREE.SphereGeometry(0.06, 8, 6);
const earCanalMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Darker brown for canal

// Left ear canal
const leftEarCanal = new THREE.Mesh(earCanalGeometry, earCanalMaterial);
leftEarCanal.position.set(-0.52, -0.05, 0.08); // Slightly forward and inward from ear
leftEarCanal.scale.set(0.8, 0.6, 1.2); // Elongated toward head
headGroup.add(leftEarCanal);

// Right ear canal
const rightEarCanal = new THREE.Mesh(earCanalGeometry, earCanalMaterial);
rightEarCanal.position.set(0.52, -0.05, 0.08); // Slightly forward and inward from ear
rightEarCanal.scale.set(0.8, 0.6, 1.2); // Elongated toward head
headGroup.add(rightEarCanal);

// Realistic brown hair that arches over the head
const hairMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E }); // Lighter brown hair color (chocolate/saddle brown)

// Create hair that curves upward from ears and arches over head
const hairGroup = new THREE.Group();

// Main top hair - covers the crown and top of head
const topHairGeometry = new THREE.SphereGeometry(0.6, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
const topHair = new THREE.Mesh(topHairGeometry, hairMaterial);
topHair.position.set(0, 0.55, 0); // Higher position on crown of head
topHair.scale.set(1.05, 0.95, 1.15); // More moderate sizing
topHair.castShadow = true;
hairGroup.add(topHair);

// Additional top hair for volume and texture (now larger and more offset)
const topHair2Geometry = new THREE.SphereGeometry(0.52, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55);
const topHair2 = new THREE.Mesh(topHair2Geometry, hairMaterial);
topHair2.position.set(0.16, 0.56, 0.13); // Forward and slightly up for visibility
topHair2.scale.set(0.8, 0.7, 0.95); // Slightly larger and more pronounced
topHair2.castShadow = true;
hairGroup.add(topHair2);

// Left side hair - curves up from ear to connect with top
const leftHairGeometry = new THREE.SphereGeometry(0.3, 10, 6);
const leftHair = new THREE.Mesh(leftHairGeometry, hairMaterial);
leftHair.position.set(-0.43, 0.2, 0.02); // Further back from eye area
leftHair.rotation.z = Math.PI * 0.15; // Slight tilt upward
leftHair.scale.set(1.0, 1.6, 1.1); // Even more coverage for better skin coverage
leftHair.castShadow = true;
hairGroup.add(leftHair);

// Right side hair - curves up from ear (smaller for parting effect)
const rightHairGeometry = new THREE.SphereGeometry(0.3, 10, 6);
const rightHair = new THREE.Mesh(rightHairGeometry, hairMaterial);
rightHair.position.set(0.45, 0.2, 0); // At ear level, slightly lower for parting
rightHair.rotation.z = -Math.PI * 0.1; // Slight tilt upward (less than left)
rightHair.scale.set(0.9, 1.5, 1.0); // Slightly bigger scaling
rightHair.castShadow = true;
hairGroup.add(rightHair);

// Additional right front hair to fill the gap
const rightFrontHairGeometry = new THREE.SphereGeometry(0.22, 8, 6);
const rightFrontHair = new THREE.Mesh(rightFrontHairGeometry, hairMaterial);
rightFrontHair.position.set(0.48, 0.35, 0.18); // Closer to head, less poofy
rightFrontHair.rotation.x = -Math.PI * 0.02; // Minimal downward tilt
rightFrontHair.scale.set(1.0, 0.9, 0.8); // Slightly bigger scaling
rightFrontHair.castShadow = true;
hairGroup.add(rightFrontHair);

// Front hair section - covers forehead and connects to top
const frontHairGeometry = new THREE.SphereGeometry(0.35, 8, 6);
const frontHair = new THREE.Mesh(frontHairGeometry, hairMaterial);
frontHair.position.set(-0.15, 0.57, 0.4); // Higher and shifted left for parting effect
frontHair.rotation.x = -Math.PI * 0.1; // Slight downward tilt
frontHair.scale.set(1.3, 0.9, 0.7); // Slightly bigger scaling
frontHair.castShadow = true;
hairGroup.add(frontHair);

// Back hair section - covers back of head and connects to top
const backHairGeometry = new THREE.SphereGeometry(0.4, 10, 6);
const backHair = new THREE.Mesh(backHairGeometry, hairMaterial);
backHair.position.set(0, 0.25, -0.35); // Back position
backHair.scale.set(1.1, 1.2, 0.9); // Slightly bigger scaling
backHair.castShadow = true;
hairGroup.add(backHair);

headGroup.add(hairGroup);

const head = headGroup; // Keep reference for animation

// Neck - simple short cylinder connecting torso to head
const neckGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12); // Taller cylinder to extend into head
const neckMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Same skin color as head
const neck = new THREE.Mesh(neckGeometry, neckMaterial);
neck.position.y = 3.3; // Positioned higher so top extends into head
neck.castShadow = true;
scene.add(neck);

// Business shirt collar - V-shaped collar flaps around neck base
const collarFlapGeometry = new THREE.BoxGeometry(0.45, 0.65, 0.07); // Slightly smaller than previous
const collarMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 }); // Same blue as torso

// Left collar flap
const leftCollarFlap = new THREE.Mesh(collarFlapGeometry, collarMaterial);
leftCollarFlap.position.set(-0.25, 3.05, 0.2); // Slightly lower position as well
leftCollarFlap.rotation.y = -Math.PI * 0.3; // More angled to wrap further around neck
leftCollarFlap.rotation.x = Math.PI * 0.15; // Much more upward angle - very pronounced
leftCollarFlap.rotation.z = -Math.PI * 0.1; // Tilt outward at bottom for collar spread
leftCollarFlap.castShadow = true;
leftCollarFlap.receiveShadow = true;
scene.add(leftCollarFlap);

// Right collar flap
const rightCollarFlap = new THREE.Mesh(collarFlapGeometry, collarMaterial);
rightCollarFlap.position.set(0.25, 3.05, 0.2); // Slightly lower position as well
rightCollarFlap.rotation.y = Math.PI * 0.3; // More angled to wrap further around neck
rightCollarFlap.rotation.x = Math.PI * 0.15; // Much more upward angle - very pronounced
rightCollarFlap.rotation.z = Math.PI * 0.1; // Tilt outward at bottom for collar spread
rightCollarFlap.castShadow = true;
rightCollarFlap.receiveShadow = true;
scene.add(rightCollarFlap);

// Black tie with traditional triangular shape
const tieGeometry = new THREE.CylinderGeometry(0.06, 0.12, 2.3, 8); // A bit longer tie
const tieMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black tie
const tie = new THREE.Mesh(tieGeometry, tieMaterial);
tie.position.set(0, 1.95, 0.41); // Adjusted position for longer length
tie.scale.set(1, 1, 0.2); // Flatten to make it tie-like thickness
tie.castShadow = true;
tie.receiveShadow = true;
scene.add(tie);

// Upside-down triangle at the wide end of the tie
const tieTipGeometry = new THREE.ConeGeometry(0.12, 0.3, 8); // Triangle tip
const tieTip = new THREE.Mesh(tieTipGeometry, tieMaterial);
tieTip.position.set(0, 0.65, 0.41); // Moved down to match the longer tie length
tieTip.rotation.x = Math.PI; // Flip upside down to point downward
tieTip.scale.set(1, 1, 0.2); // Flatten to match tie thickness
tieTip.castShadow = true;
tieTip.receiveShadow = true;
scene.add(tieTip);

// Circular tie knot at the top
const tieKnotGeometry = new THREE.SphereGeometry(0.15, 12, 8); // Circular knot
const tieKnot = new THREE.Mesh(tieKnotGeometry, tieMaterial);
tieKnot.position.set(0, 3.0, 0.35); // Just slightly behind collar flaps but still visible
tieKnot.scale.set(1, 0.8, 0.6); // Slightly flattened for realistic knot shape
tieKnot.castShadow = true;
tieKnot.receiveShadow = true;
scene.add(tieKnot);

// Body - Half-pill shape (capsule with flat bottom)
const bodyGroup = new THREE.Group();
// (No y offset, original value)
// (No y offset, original value)
// Main cylindrical part of the torso
const bodyGeometry = new THREE.CylinderGeometry(0.85, 0.85, 2.7, 20); // Slightly taller, more natural torso
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 }); // Blue shirt
const bodyMain = new THREE.Mesh(bodyGeometry, bodyMaterial);
bodyMain.position.y = 1.7; // Adjusted for new torso height
bodyMain.scale.set(1, 1, 0.4); // Flatten front and back more (Z-axis)
bodyMain.castShadow = true;
bodyGroup.add(bodyMain);

// Waist: matches the bottom outline of the torso, brown, sits directly under torso
// Pelvis: elliptical, max circumference matches waist, sits just under waist
const waistRadius = 0.85; // Matches torso bottom radius
const waistHeight = 0.28;
const waistGeometry = new THREE.CylinderGeometry(waistRadius, waistRadius, waistHeight, 20);
const waistMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5C2A });
const waist = new THREE.Mesh(waistGeometry, waistMaterial);
waist.position.y = 1.7 - 2.2/2 - waistHeight * 1.2; // Lowered further below torso
waist.scale.set(1, 1, 0.4); // Matches torso's elliptical scale
waist.castShadow = true;
bodyGroup.add(waist);

// Waist (cylinder, same radius as bottom of torso)
// Elliptical waist (matches torso's scale)

// Pelvis (brown, slightly flattened sphere)
// Elliptical pelvis (matches waist's scale)

// Thighs (brown cylinders)

// Top hemisphere (connects to head)
const topHemisphereGeometry = new THREE.SphereGeometry(0.9, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
const topHemisphere = new THREE.Mesh(topHemisphereGeometry, bodyMaterial);
topHemisphere.position.y = 2.5; // Positioned at top of shortened torso
topHemisphere.scale.set(1, 1, 0.4); // Flatten front and back more to match body
topHemisphere.castShadow = true;
bodyGroup.add(topHemisphere);

// Sloped shoulder geometry - realistic shoulder slope from neck to arms
const leftShoulderGeometry = new THREE.CylinderGeometry(0.25, 0.5, 0.7, 12); // Smaller cone shape for slope
const leftShoulderSlope = new THREE.Mesh(leftShoulderGeometry, bodyMaterial);
leftShoulderSlope.position.set(-0.6, 2.8, 0); // Between neck and arm attachment
leftShoulderSlope.rotation.z = Math.PI * 0.15; // Angled to create natural shoulder slope
leftShoulderSlope.scale.set(1, 1, 0.6); // Flattened front-to-back like torso
leftShoulderSlope.castShadow = true;
bodyGroup.add(leftShoulderSlope);

const rightShoulderSlope = new THREE.Mesh(leftShoulderGeometry, bodyMaterial);
rightShoulderSlope.position.set(0.6, 2.8, 0); // Between neck and arm attachment (mirrored)
rightShoulderSlope.rotation.z = -Math.PI * 0.15; // Angled opposite direction for right side
rightShoulderSlope.scale.set(1, 1, 0.6); // Flattened front-to-back like torso
rightShoulderSlope.castShadow = true;

bodyGroup.add(rightShoulderSlope);

scene.add(headGroup);
scene.add(bodyGroup);
const body = bodyGroup; // Keep reference for arm attachment

// Left Arm - Hierarchical structure
// Upper arm pivots at shoulder
const upperArmGeometry = new THREE.CylinderGeometry(0.22, 0.22, 1.5, 8); // Non-conical cylinder
const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Skin color for hands
const torsoArmMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 }); // Same blue as torso

const leftShoulder = new THREE.Group(); // Pivot point at shoulder
leftShoulder.position.set(-0.9, 2.9, 0); // Position at edge of torso, moved up higher
body.add(leftShoulder);

// Left shoulder sphere joint
const shoulderGeometry = new THREE.SphereGeometry(0.22, 16, 16); // Match upper arm radius for flush look
const shoulderMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 }); // Same blue as torso
const leftShoulderSphere = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
leftShoulderSphere.position.set(0, 0, 0); // Centered at shoulder pivot
leftShoulderSphere.castShadow = true;
leftShoulder.add(leftShoulderSphere);

const leftUpperArm = new THREE.Mesh(upperArmGeometry, torsoArmMaterial);
leftUpperArm.position.set(0, -0.75, 0); // Arm hangs DOWN from shoulder
leftUpperArm.castShadow = true;
leftShoulder.add(leftUpperArm);

// Lower arm pivots at elbow
const leftElbow = new THREE.Group(); // Pivot point at elbow
leftElbow.position.set(0, -1.5, 0); // Elbow position relative to shoulder
leftShoulder.add(leftElbow);

// Left elbow sphere joint
const elbowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const leftElbowSphere = new THREE.Mesh(elbowGeometry, shoulderMaterial);
leftElbowSphere.position.set(0, 0, 0); // Centered at elbow pivot
leftElbowSphere.castShadow = true;
leftElbow.add(leftElbowSphere);

const lowerArmGeometry = new THREE.CylinderGeometry(0.18, 0.18, 1.2, 8); // Non-conical cylinder
const leftLowerArm = new THREE.Mesh(lowerArmGeometry, torsoArmMaterial);
leftLowerArm.position.set(0, -0.6, 0); // Forearm hangs DOWN from elbow
leftLowerArm.castShadow = true;
leftElbow.add(leftLowerArm);

// Hand pivots at wrist
const leftWrist = new THREE.Group(); // Pivot point at wrist
leftWrist.position.set(0, -1.2, 0); // Wrist position relative to elbow
leftElbow.add(leftWrist);

// Add visible wrist cylinder joint - flattened and longer to connect to hand
const wristGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.6, 12); // Longer cylinder to bridge gap
const leftWristCylinder = new THREE.Mesh(wristGeometry, shoulderMaterial);
leftWristCylinder.position.set(0, 0, 0); // Center in wrist group, above the palm
leftWristCylinder.scale.set(0.8, 0.6, 1.2); // Flatter but visible (0.6), skinnier (0.8), longer front-to-back (1.2)
leftWristCylinder.castShadow = true;
leftWrist.add(leftWristCylinder);

// Create detailed left hand with palm and fingers
const leftHandGroup = new THREE.Group();

// Palm - thicker, especially toward wrist
const palmGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.15);
const leftPalm = new THREE.Mesh(palmGeometry, armMaterial);
leftPalm.position.set(0, -0.15, 0);
leftPalm.castShadow = true;
leftHandGroup.add(leftPalm);

// Wrist connector - thick base
const wristConnectorGeometry = new THREE.BoxGeometry(0.4, 0.15, 0.18);
const leftWristConnector = new THREE.Mesh(wristConnectorGeometry, armMaterial);
leftWristConnector.position.set(0, -0.075, 0);
leftWristConnector.castShadow = true;
leftHandGroup.add(leftWristConnector);

// Detailed fingers with articulation - geometries
const fingerBaseGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.06);
const fingerMiddleGeometry = new THREE.BoxGeometry(0.07, 0.1, 0.05);
const fingerTipGeometry = new THREE.BoxGeometry(0.06, 0.08, 0.04);

// Index finger with pivot groups for articulation
const leftIndexBasePivot = new THREE.Group();
leftIndexBasePivot.position.set(-0.15, -0.3, 0);
leftHandGroup.add(leftIndexBasePivot);

const leftIndexBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
leftIndexBase.position.set(0, -0.06, 0);
leftIndexBase.castShadow = true;
leftIndexBasePivot.add(leftIndexBase);

const leftIndexMiddlePivot = new THREE.Group();
leftIndexMiddlePivot.position.set(0, -0.12, 0);
leftIndexBasePivot.add(leftIndexMiddlePivot);

const leftIndexMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
leftIndexMiddle.position.set(0, -0.05, 0);
leftIndexMiddle.castShadow = true;
leftIndexMiddlePivot.add(leftIndexMiddle);

const leftIndexTipPivot = new THREE.Group();
leftIndexTipPivot.position.set(0, -0.1, 0);
leftIndexMiddlePivot.add(leftIndexTipPivot);

const leftIndexTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
leftIndexTip.position.set(0, -0.04, 0);
leftIndexTip.castShadow = true;
leftIndexTipPivot.add(leftIndexTip);

// Middle finger with pivot groups
const leftMiddleBasePivot = new THREE.Group();
leftMiddleBasePivot.position.set(-0.05, -0.3, 0);
leftHandGroup.add(leftMiddleBasePivot);

const leftMiddleBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
leftMiddleBase.position.set(0, -0.06, 0);
leftMiddleBase.castShadow = true;
leftMiddleBasePivot.add(leftMiddleBase);

const leftMiddleMiddlePivot = new THREE.Group();
leftMiddleMiddlePivot.position.set(0, -0.12, 0);
leftMiddleBasePivot.add(leftMiddleMiddlePivot);

const leftMiddleMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
leftMiddleMiddle.position.set(0, -0.05, 0);
leftMiddleMiddle.castShadow = true;
leftMiddleMiddlePivot.add(leftMiddleMiddle);

const leftMiddleTipPivot = new THREE.Group();
leftMiddleTipPivot.position.set(0, -0.1, 0);
leftMiddleMiddlePivot.add(leftMiddleTipPivot);

const leftMiddleTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
leftMiddleTip.position.set(0, -0.04, 0);
leftMiddleTip.castShadow = true;
leftMiddleTipPivot.add(leftMiddleTip);

// Ring finger with pivot groups
const leftRingBasePivot = new THREE.Group();
leftRingBasePivot.position.set(0.05, -0.3, 0);
leftHandGroup.add(leftRingBasePivot);

const leftRingBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
leftRingBase.position.set(0, -0.06, 0);
leftRingBase.castShadow = true;
leftRingBasePivot.add(leftRingBase);

const leftRingMiddlePivot = new THREE.Group();
leftRingMiddlePivot.position.set(0, -0.12, 0);
leftRingBasePivot.add(leftRingMiddlePivot);

const leftRingMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
leftRingMiddle.position.set(0, -0.05, 0);
leftRingMiddle.castShadow = true;
leftRingMiddlePivot.add(leftRingMiddle);

const leftRingTipPivot = new THREE.Group();
leftRingTipPivot.position.set(0, -0.1, 0);
leftRingMiddlePivot.add(leftRingTipPivot);

const leftRingTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
leftRingTip.position.set(0, -0.04, 0);
leftRingTip.castShadow = true;
leftRingTipPivot.add(leftRingTip);

// Pinky finger with pivot groups
const leftPinkyBasePivot = new THREE.Group();
leftPinkyBasePivot.position.set(0.15, -0.3, 0);
leftHandGroup.add(leftPinkyBasePivot);

const leftPinkyBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
leftPinkyBase.position.set(0, -0.06, 0);
leftPinkyBase.castShadow = true;
leftPinkyBasePivot.add(leftPinkyBase);

const leftPinkyMiddlePivot = new THREE.Group();
leftPinkyMiddlePivot.position.set(0, -0.12, 0);
leftPinkyBasePivot.add(leftPinkyMiddlePivot);

const leftPinkyMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
leftPinkyMiddle.position.set(0, -0.05, 0);
leftPinkyMiddle.castShadow = true;
leftPinkyMiddlePivot.add(leftPinkyMiddle);

const leftPinkyTipPivot = new THREE.Group();
leftPinkyTipPivot.position.set(0, -0.1, 0);
leftPinkyMiddlePivot.add(leftPinkyTipPivot);

const leftPinkyTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
leftPinkyTip.position.set(0, -0.04, 0);
leftPinkyTip.castShadow = true;
leftPinkyTipPivot.add(leftPinkyTip);

// Thumb with multiple segments and articulation
const thumbBaseGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.07);
const thumbTipGeometry = new THREE.BoxGeometry(0.06, 0.1, 0.06);

const leftThumbBasePivot = new THREE.Group();
leftThumbBasePivot.position.set(-0.25, -0.1, 0.05);
leftThumbBasePivot.rotation.z = Math.PI / 6;
leftHandGroup.add(leftThumbBasePivot);

const leftThumbBase = new THREE.Mesh(thumbBaseGeometry, armMaterial);
leftThumbBase.position.set(0, -0.06, 0);
leftThumbBase.castShadow = true;
leftThumbBasePivot.add(leftThumbBase);

const leftThumbTipPivot = new THREE.Group();
leftThumbTipPivot.position.set(0, -0.12, 0);
leftThumbBasePivot.add(leftThumbTipPivot);

const leftThumbTip = new THREE.Mesh(thumbTipGeometry, armMaterial);
leftThumbTip.position.set(0, -0.05, 0);
leftThumbTip.castShadow = true;
leftThumbTipPivot.add(leftThumbTip);

leftHandGroup.position.set(0, -0.2, 0); // Hand hangs DOWN from wrist
leftHandGroup.rotation.y = Math.PI / 2; // Rotate to face inward toward torso
leftWrist.add(leftHandGroup);

// Right Arm - Hierarchical structure
const rightShoulder = new THREE.Group(); // Pivot point at shoulder
rightShoulder.position.set(0.9, 2.9, 0); // Position at edge of torso, moved up higher
body.add(rightShoulder);

// Right shoulder sphere joint
const rightShoulderSphere = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
rightShoulderSphere.position.set(0, 0, 0); // Centered at shoulder pivot
rightShoulderSphere.castShadow = true;
rightShoulder.add(rightShoulderSphere);

const rightUpperArm = new THREE.Mesh(upperArmGeometry, torsoArmMaterial);
rightUpperArm.position.set(0, -0.75, 0); // Arm hangs DOWN from shoulder
rightUpperArm.castShadow = true;
rightShoulder.add(rightUpperArm);

// Lower arm pivots at elbow
const rightElbow = new THREE.Group(); // Pivot point at elbow
rightElbow.position.set(0, -1.5, 0); // Elbow position relative to shoulder
rightShoulder.add(rightElbow);

// Right elbow sphere joint
const rightElbowSphere = new THREE.Mesh(elbowGeometry, shoulderMaterial);
rightElbowSphere.position.set(0, 0, 0); // Centered at elbow pivot
rightElbowSphere.castShadow = true;
rightElbow.add(rightElbowSphere);

const rightLowerArm = new THREE.Mesh(lowerArmGeometry, torsoArmMaterial);
rightLowerArm.position.set(0, -0.6, 0); // Forearm hangs DOWN from elbow
rightLowerArm.castShadow = true;
rightElbow.add(rightLowerArm);

// Hand pivots at wrist
const rightWrist = new THREE.Group(); // Pivot point at wrist
rightWrist.position.set(0, -1.2, 0); // Wrist position relative to elbow
rightElbow.add(rightWrist);

// Add visible wrist cylinder joint - flattened and longer to connect to hand
const rightWristCylinder = new THREE.Mesh(wristGeometry, shoulderMaterial);
rightWristCylinder.position.set(0, 0, 0); // Center in wrist group, above the palm
rightWristCylinder.scale.set(0.8, 0.6, 1.2); // Flatter but visible (0.6), skinnier (0.8), longer front-to-back (1.2)
rightWristCylinder.castShadow = true;
rightWrist.add(rightWristCylinder);

// Create detailed right hand with palm and fingers
const rightHandGroup = new THREE.Group();

// Palm - thicker, especially toward wrist
const rightPalm = new THREE.Mesh(palmGeometry, armMaterial);
rightPalm.position.set(0, -0.15, 0);
rightPalm.castShadow = true;
rightHandGroup.add(rightPalm);

// Wrist connector - thick base
const rightWristConnector = new THREE.Mesh(wristConnectorGeometry, armMaterial);
rightWristConnector.position.set(0, -0.075, 0);
rightWristConnector.castShadow = true;
rightHandGroup.add(rightWristConnector);

// Right Index finger with pivot groups for articulation
const rightIndexBasePivot = new THREE.Group();
rightIndexBasePivot.position.set(-0.15, -0.3, 0);
rightHandGroup.add(rightIndexBasePivot);

const rightIndexBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
rightIndexBase.position.set(0, -0.06, 0);
rightIndexBase.castShadow = true;
rightIndexBasePivot.add(rightIndexBase);

const rightIndexMiddlePivot = new THREE.Group();
rightIndexMiddlePivot.position.set(0, -0.12, 0);
rightIndexBasePivot.add(rightIndexMiddlePivot);

const rightIndexMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
rightIndexMiddle.position.set(0, -0.05, 0);
rightIndexMiddle.castShadow = true;
rightIndexMiddlePivot.add(rightIndexMiddle);

const rightIndexTipPivot = new THREE.Group();
rightIndexTipPivot.position.set(0, -0.1, 0);
rightIndexMiddlePivot.add(rightIndexTipPivot);

const rightIndexTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
rightIndexTip.position.set(0, -0.04, 0);
rightIndexTip.castShadow = true;
rightIndexTipPivot.add(rightIndexTip);

// Right Middle finger with pivot groups
const rightMiddleBasePivot = new THREE.Group();
rightMiddleBasePivot.position.set(-0.05, -0.3, 0);
rightHandGroup.add(rightMiddleBasePivot);

const rightMiddleBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
rightMiddleBase.position.set(0, -0.06, 0);
rightMiddleBase.castShadow = true;
rightMiddleBasePivot.add(rightMiddleBase);

const rightMiddleMiddlePivot = new THREE.Group();
rightMiddleMiddlePivot.position.set(0, -0.12, 0);
rightMiddleBasePivot.add(rightMiddleMiddlePivot);

const rightMiddleMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
rightMiddleMiddle.position.set(0, -0.05, 0);
rightMiddleMiddle.castShadow = true;
rightMiddleMiddlePivot.add(rightMiddleMiddle);

const rightMiddleTipPivot = new THREE.Group();
rightMiddleTipPivot.position.set(0, -0.1, 0);
rightMiddleMiddlePivot.add(rightMiddleTipPivot);

const rightMiddleTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
rightMiddleTip.position.set(0, -0.04, 0);
rightMiddleTip.castShadow = true;
rightMiddleTipPivot.add(rightMiddleTip);

// Right Ring finger with pivot groups
const rightRingBasePivot = new THREE.Group();
rightRingBasePivot.position.set(0.05, -0.3, 0);
rightHandGroup.add(rightRingBasePivot);

const rightRingBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
rightRingBase.position.set(0, -0.06, 0);
rightRingBase.castShadow = true;
rightRingBasePivot.add(rightRingBase);

const rightRingMiddlePivot = new THREE.Group();
rightRingMiddlePivot.position.set(0, -0.12, 0);
rightRingBasePivot.add(rightRingMiddlePivot);

const rightRingMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
rightRingMiddle.position.set(0, -0.05, 0);
rightRingMiddle.castShadow = true;
rightRingMiddlePivot.add(rightRingMiddle);

const rightRingTipPivot = new THREE.Group();
rightRingTipPivot.position.set(0, -0.1, 0);
rightRingMiddlePivot.add(rightRingTipPivot);

const rightRingTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
rightRingTip.position.set(0, -0.04, 0);
rightRingTip.castShadow = true;
rightRingTipPivot.add(rightRingTip);

// Right Pinky finger with pivot groups
const rightPinkyBasePivot = new THREE.Group();
rightPinkyBasePivot.position.set(0.15, -0.3, 0);
rightHandGroup.add(rightPinkyBasePivot);

const rightPinkyBase = new THREE.Mesh(fingerBaseGeometry, armMaterial);
rightPinkyBase.position.set(0, -0.06, 0);
rightPinkyBase.castShadow = true;
rightPinkyBasePivot.add(rightPinkyBase);

const rightPinkyMiddlePivot = new THREE.Group();
rightPinkyMiddlePivot.position.set(0, -0.12, 0);
rightPinkyBasePivot.add(rightPinkyMiddlePivot);

const rightPinkyMiddle = new THREE.Mesh(fingerMiddleGeometry, armMaterial);
rightPinkyMiddle.position.set(0, -0.05, 0);
rightPinkyMiddle.castShadow = true;
rightPinkyMiddlePivot.add(rightPinkyMiddle);

const rightPinkyTipPivot = new THREE.Group();
rightPinkyTipPivot.position.set(0, -0.1, 0);
rightPinkyMiddlePivot.add(rightPinkyTipPivot);

const rightPinkyTip = new THREE.Mesh(fingerTipGeometry, armMaterial);
rightPinkyTip.position.set(0, -0.04, 0);
rightPinkyTip.castShadow = true;
rightPinkyTipPivot.add(rightPinkyTip);

// Right Thumb with multiple segments and articulation
const rightThumbBasePivot = new THREE.Group();
rightThumbBasePivot.position.set(0.25, -0.1, 0.05);
rightThumbBasePivot.rotation.z = -Math.PI / 6;
rightHandGroup.add(rightThumbBasePivot);

const rightThumbBase = new THREE.Mesh(thumbBaseGeometry, armMaterial);
rightThumbBase.position.set(0, -0.06, 0);
rightThumbBase.castShadow = true;
rightThumbBasePivot.add(rightThumbBase);

const rightThumbTipPivot = new THREE.Group();
rightThumbTipPivot.position.set(0, -0.12, 0);
rightThumbBasePivot.add(rightThumbTipPivot);

const rightThumbTip = new THREE.Mesh(thumbTipGeometry, armMaterial);
rightThumbTip.position.set(0, -0.05, 0);
rightThumbTip.castShadow = true;
rightThumbTipPivot.add(rightThumbTip);

rightHandGroup.position.set(0, -0.2, 0); // Hand hangs DOWN from wrist
rightHandGroup.rotation.y = -Math.PI / 2; // Rotate to face inward toward torso (opposite direction)
rightWrist.add(rightHandGroup);

// Store character parts for animation (now using pivot groups)
let characterParts = {
  head: head,
  neck: neck,
  body: body,
  leftShoulder: leftShoulder,
  leftElbow: leftElbow,
  leftWrist: leftWrist,
  rightShoulder: rightShoulder,
  rightElbow: rightElbow,
  rightWrist: rightWrist,
  leftUpperArm: leftUpperArm,
  leftLowerArm: leftLowerArm,
  leftHand: leftHandGroup,
  rightUpperArm: rightUpperArm,
  rightLowerArm: rightLowerArm,
  rightHand: rightHandGroup,
  leftEye: leftEye,
  rightEye: rightEye,
  leftPupil: leftPupil,
  rightPupil: rightPupil,
  leftEyelid: leftEyelid,
  rightEyelid: rightEyelid,
  leftEyebrow: leftEyebrowGroup,
  rightEyebrow: rightEyebrowGroup,
  nose: nose,
  mouth: mouth,
  // Left hand finger articulation
  leftIndexBasePivot: leftIndexBasePivot,
  leftIndexMiddlePivot: leftIndexMiddlePivot,
  leftIndexTipPivot: leftIndexTipPivot,
  leftMiddleBasePivot: leftMiddleBasePivot,
  leftMiddleMiddlePivot: leftMiddleMiddlePivot,
  leftMiddleTipPivot: leftMiddleTipPivot,
  leftRingBasePivot: leftRingBasePivot,
  leftRingMiddlePivot: leftRingMiddlePivot,
  leftRingTipPivot: leftRingTipPivot,
  leftPinkyBasePivot: leftPinkyBasePivot,
  leftPinkyMiddlePivot: leftPinkyMiddlePivot,
  leftPinkyTipPivot: leftPinkyTipPivot,
  leftThumbBasePivot: leftThumbBasePivot,
  leftThumbTipPivot: leftThumbTipPivot,
  // Right hand finger articulation
  rightIndexBasePivot: rightIndexBasePivot,
  rightIndexMiddlePivot: rightIndexMiddlePivot,
  rightIndexTipPivot: rightIndexTipPivot,
  rightMiddleBasePivot: rightMiddleBasePivot,
  rightMiddleMiddlePivot: rightMiddleMiddlePivot,
  rightMiddleTipPivot: rightMiddleTipPivot,
  rightRingBasePivot: rightRingBasePivot,
  rightRingMiddlePivot: rightRingMiddlePivot,
  rightRingTipPivot: rightRingTipPivot,
  rightPinkyBasePivot: rightPinkyBasePivot,
  rightPinkyMiddlePivot: rightPinkyMiddlePivot,
  rightPinkyTipPivot: rightPinkyTipPivot,
  rightThumbBasePivot: rightThumbBasePivot,
  rightThumbTipPivot: rightThumbTipPivot
};

// Web Audio API setup for arm control
let audioContext;
let analyser;
let microphone;
let dataArray;
let audioInitialized = false;

// Audio control parameters
let armMovementData = {
  leftArmRotation: 0,
  rightArmRotation: 0,
  leftForearmRotation: 0,
  rightForearmRotation: 0,
  leftHandRotation: 0,
  rightHandRotation: 0
};

// Smoothed arm gesture values for lingering effect
let smoothedArmGestures = {
  leftArmLift: 0,
  leftArmForward: 0,
  leftElbowBend: 0,
  rightArmLift: 0,
  rightArmForward: 0,
  rightElbowBend: 0
};

// Smoothing parameters for natural movement
let smoothedAudioData = {
  leftArm: 0,
  rightArm: 0,
  leftForearm: 0,
  rightForearm: 0,
  leftHand: 0,
  rightHand: 0
};

const smoothingFactor = 0.85; // Higher = smoother but less responsive
const gestureAmplitude = 0.6; // Overall gesture size

// Initialize audio input
async function initAudio() {
  try {
    // Resume audio context if suspended (required by some browsers)
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.3;
    
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    // Get microphone input
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      } 
    });
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    
    audioInitialized = true;
    console.log('Audio input initialized successfully!');
    
    if (window.audioDebugInfo) {
      window.audioDebugInfo.innerHTML = 'Audio: Initialized - Make some noise!';
    }
  } catch (error) {
    console.error('Error accessing microphone:', error);
    console.log('Audio input disabled - arms will use automatic movement');
    
    if (window.audioDebugInfo) {
      window.audioDebugInfo.innerHTML = 'Audio: Failed to initialize<br>Using automatic movement';
    }
  }
}

// Process audio data for arm movement
function processAudioForArmMovement() {
  if (!audioInitialized || !analyser) {
    // Fallback: Use automatic gesture cycling when no audio
    const time = performance.now() * 0.001;
    armMovementData.leftArmRotation = Math.sin(time * 0.2) * 0.8;
    armMovementData.rightArmRotation = Math.sin(time * 0.15 + Math.PI * 0.7) * 0.8;
    armMovementData.leftForearmRotation = Math.abs(Math.sin(time * 0.3)) * 0.9;
    armMovementData.rightForearmRotation = Math.abs(Math.sin(time * 0.25 + Math.PI * 0.4)) * 0.9;
    armMovementData.leftHandRotation = Math.sin(time * 0.4) * 0.6;
    armMovementData.rightHandRotation = Math.sin(time * 0.35 + Math.PI * 0.3) * 0.6;
    
    // Update debug info
    if (window.audioDebugInfo) {
      window.audioDebugInfo.innerHTML = 'Click anywhere to enable audio control<br>Audio: Using automatic gestures';
    }
    return;
  }
  
  analyser.getByteFrequencyData(dataArray);
  
  // Divide frequency spectrum into different ranges for different gesture types
  const lowFreq = dataArray.slice(0, 42);
  const midFreq = dataArray.slice(42, 86);
  const highFreq = dataArray.slice(86, 128);
  
  // Calculate average amplitude for each frequency range
  const lowAvg = lowFreq.reduce((a, b) => a + b, 0) / lowFreq.length;
  const midAvg = midFreq.reduce((a, b) => a + b, 0) / midFreq.length;
  const highAvg = highFreq.reduce((a, b) => a + b, 0) / highFreq.length;
  
  // Update debug info with audio levels
  if (window.audioDebugInfo) {
    window.audioDebugInfo.innerHTML = `
Audio: Active<br>
Low: ${lowAvg.toFixed(1)} | Mid: ${midAvg.toFixed(1)} | High: ${highAvg.toFixed(1)}<br>
Gesture Intensity: ${((lowAvg + midAvg + highAvg) / 3).toFixed(1)}`;
  }
  
  // Normalize to 0-1 range
  const lowNorm = lowAvg / 255;
  const midNorm = midAvg / 255;
  const highNorm = highAvg / 255;
  
  // Apply smoothing for natural movement
  smoothedAudioData.leftArm = smoothedAudioData.leftArm * smoothingFactor + lowNorm * (1 - smoothingFactor);
  smoothedAudioData.rightArm = smoothedAudioData.rightArm * smoothingFactor + midNorm * (1 - smoothingFactor);
  smoothedAudioData.leftForearm = smoothedAudioData.leftForearm * smoothingFactor + highNorm * (1 - smoothingFactor);
  smoothedAudioData.rightForearm = smoothedAudioData.rightForearm * smoothingFactor + lowNorm * (1 - smoothingFactor);
  smoothedAudioData.leftHand = smoothedAudioData.leftHand * smoothingFactor + midNorm * (1 - smoothingFactor);
  smoothedAudioData.rightHand = smoothedAudioData.rightHand * smoothingFactor + highNorm * (1 - smoothingFactor);
  
  // Convert to gesture ranges for natural human movements
  armMovementData.leftArmRotation = smoothedAudioData.leftArm * gestureAmplitude;
  armMovementData.rightArmRotation = smoothedAudioData.rightArm * gestureAmplitude;
  armMovementData.leftForearmRotation = smoothedAudioData.leftForearm;
  armMovementData.rightForearmRotation = smoothedAudioData.rightForearm;
  armMovementData.leftHandRotation = smoothedAudioData.leftHand;
  armMovementData.rightHandRotation = smoothedAudioData.rightHand;
}

// Click to start audio (required by browsers)
document.addEventListener('click', function() {
  if (!audioInitialized) {
    initAudio();
  }
}, { once: true });

// Add visual feedback for audio activity
document.addEventListener('DOMContentLoaded', function() {
  const infoDiv = document.createElement('div');
  infoDiv.style.position = 'fixed';
  infoDiv.style.top = '10px';
  infoDiv.style.left = '10px';
  infoDiv.style.color = 'white';
  infoDiv.style.background = 'rgba(0,0,0,0.7)';
  infoDiv.style.padding = '10px';
  infoDiv.style.borderRadius = '5px';
  infoDiv.style.fontFamily = 'monospace';
  infoDiv.style.fontSize = '12px';
  infoDiv.style.zIndex = '1000';
  infoDiv.innerHTML = 'Click anywhere to enable audio control<br>Audio: Not initialized';
  document.body.appendChild(infoDiv);
  
  window.audioDebugInfo = infoDiv;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const time = performance.now() * 0.001;
  
  // Process audio for arm movement
  processAudioForArmMovement();
  
  // Simple head rotation - no bobbing
  if (characterParts.head) {
    characterParts.head.rotation.y = Math.sin(time * 0.5) * 0.15;
    // Removed position.y bobbing - head stays in place on neck
  }
  
  // Neck movement - subtle following of head movement
  if (characterParts.neck) {
    characterParts.neck.rotation.y = Math.sin(time * 0.5) * 0.1; // Follows head rotation but less
    characterParts.neck.rotation.x = Math.sin(time * 0.8) * 0.05; // Subtle forward/back nod
  }
  
  // Blinking animation
  const blinkTrigger = Math.sin(time * 0.8) > 0.92; // Occasional blinks
  const blinkSpeed = Math.sin(time * 15); // Fast blink animation
  
  if (characterParts.leftEyelid && characterParts.rightEyelid) {
    if (blinkTrigger) {
      // Blink: scale eyelids to cover eyes
      const blinkAmount = Math.max(0, blinkSpeed) * 1.2;
      characterParts.leftEyelid.scale.y = blinkAmount;
      characterParts.rightEyelid.scale.y = blinkAmount;
    } else {
      // Eyes open: eyelids invisible
      characterParts.leftEyelid.scale.y = 0;
      characterParts.rightEyelid.scale.y = 0;
    }
  }
  
  // Mouth animation based on audio intensity - rapid and disappears when silent
  const totalAudioIntensity = (armMovementData.leftArmRotation + armMovementData.rightArmRotation + armMovementData.leftForearmRotation + armMovementData.rightForearmRotation) * 0.25;
  
  if (characterParts.mouth) {
    // Calculate audio intensity threshold for mouth visibility
    const audioThreshold = 0.02; // Minimum audio level to show mouth
    const currentAudioLevel = Math.abs(totalAudioIntensity);
    
    if (currentAudioLevel < audioThreshold) {
      // No sound - make mouth completely invisible
      characterParts.mouth.scale.set(0, 0, 0);
    } else {
      // Sound detected - rapid mouth movement
      const audioMouthOpening = currentAudioLevel * 4.0; // Stronger response to audio
      
      // Very rapid speech-like variation with multiple frequencies
      const rapidFlutter1 = Math.sin(time * 25) * 0.3; // Fast primary flutter
      const rapidFlutter2 = Math.sin(time * 18) * 0.2; // Secondary rapid variation
      const rapidFlutter3 = Math.cos(time * 30) * 0.15; // Tertiary quick movement
      
      const totalFlutter = (rapidFlutter1 + rapidFlutter2 + rapidFlutter3) * currentAudioLevel;
      
      // Scale mouth with rapid movement - no base height, only audio-driven
      characterParts.mouth.scale.x = 1.2; // Keep consistent width
      characterParts.mouth.scale.z = 1.0; // Keep consistent depth
      characterParts.mouth.scale.y = Math.max(0.05, audioMouthOpening + totalFlutter);
      
      // Keep mouth within reasonable bounds
      characterParts.mouth.scale.y = Math.min(2.0, characterParts.mouth.scale.y);
    }
  }

  // Eyebrow animation based on audio intensity
  if (characterParts.leftEyebrow && characterParts.rightEyebrow) {
    // Simple pitch simulation - use different parts of audio data for pitch estimation
    const audioLevel = Math.abs(totalAudioIntensity);
    
    // Simulate pitch response using audio intensity and time-based variation
    const simulatedPitch = audioLevel + Math.sin(time * 5) * 0.1; // Pitch-like variation
    
    // Eyebrows raise with higher "pitch" simulation
    const eyebrowRaise = simulatedPitch * 0.2; // Up to 0.2 radians (about 11 degrees)
    
    // Combine with subtle oscillation for natural movement
    const eyebrowMovement = eyebrowRaise + Math.sin(time * 4) * 0.02;
    
    // Apply movement to both eyebrows (they move together for expression)
    characterParts.leftEyebrow.rotation.x = -eyebrowMovement; // Negative for upward rotation
    characterParts.rightEyebrow.rotation.x = -eyebrowMovement; // Negative for upward rotation
    
    // Add slight side-to-side variation for more natural look
    characterParts.leftEyebrow.rotation.z = 0.1 + Math.sin(time * 3) * 0.05; // Base angle + variation
    characterParts.rightEyebrow.rotation.z = -0.1 - Math.sin(time * 3) * 0.05; // Opposite base angle + variation
  }

  // Finger animation - subtle response to audio
  const fingerAudioIntensity = Math.abs(totalAudioIntensity) * 0.3; // Gentler response for fingers
  const fingerFlutter = Math.sin(time * 8) * 0.1; // Subtle finger movement
  
  if (characterParts.leftIndexBasePivot) {
    // Left hand finger curling based on audio
    const baseCurl = fingerAudioIntensity + fingerFlutter * fingerAudioIntensity;
    const middleCurl = baseCurl * 1.5; // Middle segments curl more
    const tipCurl = baseCurl * 2; // Tips curl most
    
    // Index finger
    characterParts.leftIndexBasePivot.rotation.x = baseCurl * 0.5;
    characterParts.leftIndexMiddlePivot.rotation.x = middleCurl * 0.5;
    characterParts.leftIndexTipPivot.rotation.x = tipCurl * 0.5;
    
    // Middle finger
    characterParts.leftMiddleBasePivot.rotation.x = baseCurl * 0.6;
    characterParts.leftMiddleMiddlePivot.rotation.x = middleCurl * 0.6;
    characterParts.leftMiddleTipPivot.rotation.x = tipCurl * 0.6;
    
    // Ring finger
    characterParts.leftRingBasePivot.rotation.x = baseCurl * 0.4;
    characterParts.leftRingMiddlePivot.rotation.x = middleCurl * 0.4;
    characterParts.leftRingTipPivot.rotation.x = tipCurl * 0.4;
    
    // Pinky finger
    characterParts.leftPinkyBasePivot.rotation.x = baseCurl * 0.3;
    characterParts.leftPinkyMiddlePivot.rotation.x = middleCurl * 0.3;
    characterParts.leftPinkyTipPivot.rotation.x = tipCurl * 0.3;
    
    // Thumb (different movement pattern)
    characterParts.leftThumbBasePivot.rotation.x = baseCurl * 0.2;
    characterParts.leftThumbTipPivot.rotation.x = baseCurl * 0.4;
  }

  // Right hand finger animation - slightly different timing for variety
  if (characterParts.rightIndexBasePivot) {
    const rightFingerFlutter = Math.sin(time * 8.5) * 0.1; // Slightly different timing
    const rightBaseCurl = fingerAudioIntensity + rightFingerFlutter * fingerAudioIntensity;
    const rightMiddleCurl = rightBaseCurl * 1.5;
    const rightTipCurl = rightBaseCurl * 2;
    
    // Index finger
    characterParts.rightIndexBasePivot.rotation.x = rightBaseCurl * 0.5;
    characterParts.rightIndexMiddlePivot.rotation.x = rightMiddleCurl * 0.5;
    characterParts.rightIndexTipPivot.rotation.x = rightTipCurl * 0.5;
    
    // Middle finger
    characterParts.rightMiddleBasePivot.rotation.x = rightBaseCurl * 0.6;
    characterParts.rightMiddleMiddlePivot.rotation.x = rightMiddleCurl * 0.6;
    characterParts.rightMiddleTipPivot.rotation.x = rightTipCurl * 0.6;
    
    // Ring finger
    characterParts.rightRingBasePivot.rotation.x = rightBaseCurl * 0.4;
    characterParts.rightRingMiddlePivot.rotation.x = rightMiddleCurl * 0.4;
    characterParts.rightRingTipPivot.rotation.x = rightTipCurl * 0.4;
    
    // Pinky finger
    characterParts.rightPinkyBasePivot.rotation.x = rightBaseCurl * 0.3;
    characterParts.rightPinkyMiddlePivot.rotation.x = rightMiddleCurl * 0.3;
    characterParts.rightPinkyTipPivot.rotation.x = rightTipCurl * 0.3;
    
    // Thumb (different movement pattern)
    characterParts.rightThumbBasePivot.rotation.x = rightBaseCurl * 0.2;
    characterParts.rightThumbTipPivot.rotation.x = rightBaseCurl * 0.4;
  }

  // Wrist articulation - 35-degree rotations in response to audio
  // Use the existing totalAudioIntensity variable calculated earlier
  const wristAudioIntensity = Math.abs(totalAudioIntensity);
  
  if (characterParts.leftWrist && characterParts.rightWrist) {
    // 35-degree rotation based on audio intensity
    const wristRotation = wristAudioIntensity * (35 * Math.PI / 180); // Convert to radians
    
    // Apply rotations - left positive, right negative
    characterParts.leftWrist.rotation.y = wristRotation;
    characterParts.rightWrist.rotation.y = -wristRotation;
    
    // Clear other rotations to prevent interference
    characterParts.leftWrist.rotation.x = 0;
    characterParts.leftWrist.rotation.z = 0;
    characterParts.rightWrist.rotation.x = 0;
    characterParts.rightWrist.rotation.z = 0;
  }

  
  // SIMPLE ARM LIFTING - Audio-controlled with LINGERING (REVERSED DIRECTIONS)
  const audioIntensity = (armMovementData.leftArmRotation + armMovementData.rightArmRotation + armMovementData.leftForearmRotation + armMovementData.rightForearmRotation) * 0.25;
  
  // Smoothing factor for lingering gestures (lower = more lingering)
  const gestureSmoothingFactor = 0.08; // How quickly gestures fade (0.02 = very slow, 0.2 = fast)
  
  // LEFT ARM - Reverse all directions (MORE SENSITIVE) with SMOOTHING and LIMITED RANGE
  if (characterParts.leftShoulder) {
    // Calculate target values with limited range
    const targetLeftLift = Math.min(audioIntensity * Math.PI * 1.5, Math.PI * 0.6); // Limit to 108 degrees max
    const targetLeftForward = Math.min(audioIntensity * Math.PI * 0.5, Math.PI * 0.3); // Limit forward motion
    
    // Smooth towards target with lingering effect
    smoothedArmGestures.leftArmLift += (targetLeftLift - smoothedArmGestures.leftArmLift) * gestureSmoothingFactor;
    smoothedArmGestures.leftArmForward += (targetLeftForward - smoothedArmGestures.leftArmForward) * gestureSmoothingFactor;
    
    // Apply smoothed values
    characterParts.leftShoulder.rotation.z = -smoothedArmGestures.leftArmLift; // REVERSED
    characterParts.leftShoulder.rotation.x = -smoothedArmGestures.leftArmForward; // REVERSED
    
    // Y rotation variation
    characterParts.leftShoulder.rotation.y = Math.sin(time * 0.5) * 0.1;
  }
  
  // LEFT ELBOW - Reverse elbow bending with sky gesture (MORE SENSITIVE) with SMOOTHING
  if (characterParts.leftElbow) {
    // Calculate target elbow bend
    const targetLeftElbowBend = audioIntensity * Math.PI * 0.8;
    
    // Smooth elbow movement with lingering
    smoothedArmGestures.leftElbowBend += (targetLeftElbowBend - smoothedArmGestures.leftElbowBend) * gestureSmoothingFactor;
    
    let elbowRotation = smoothedArmGestures.leftElbowBend;
    
    // Sky gesture: Much more common and softer
    const armExtension = audioIntensity > 0.15; // Further reduced from 0.3 to 0.15 - much easier to trigger
    const skyGestureTrigger = Math.sin(time * 0.5 + armMovementData.leftArmRotation * 2) > 0.3; // Much more frequent (0.5 Hz, trigger at 0.3 instead of 0.5)
    const highAudioIntensity = audioIntensity > 0.1; // Further reduced from 0.25 to 0.1 - very low threshold
    
    if (armExtension && skyGestureTrigger && highAudioIntensity) {
      // Sky gesture: Keep elbow straighter to prevent hand going into torso
      const skyIntensity = Math.min(audioIntensity * 2, 1.0); // Cap the intensity for softer motion
      elbowRotation = Math.PI * (0.2 + skyIntensity * 0.2); // REDUCED: Range from 36° to 72° (was 108° to 180°)
      
      // Minimal additional flair to keep arm extended
      elbowRotation += armMovementData.leftForearmRotation * Math.PI * 0.1; // Reduced from 0.2
    } else {
      // Normal elbow bending
      elbowRotation += armMovementData.leftForearmRotation * Math.PI * 0.3;
    }
    
    characterParts.leftElbow.rotation.z = elbowRotation;
  }
  
  // LEFT WRIST - Handled by wrist articulation section above, not here
  
  // RIGHT ARM - Reverse all directions with SMOOTHING
  if (characterParts.rightShoulder) {
    // Calculate target values  
    const targetRightLift = audioIntensity * Math.PI * 0.7;
    const targetRightForward = audioIntensity * Math.PI * 0.25;
    
    // Smooth towards target with lingering effect
    smoothedArmGestures.rightArmLift += (targetRightLift - smoothedArmGestures.rightArmLift) * gestureSmoothingFactor;
    smoothedArmGestures.rightArmForward += (targetRightForward - smoothedArmGestures.rightArmForward) * gestureSmoothingFactor;
    
    // Apply smoothed values
    characterParts.rightShoulder.rotation.z = smoothedArmGestures.rightArmLift; // REVERSED (was negative)
    characterParts.rightShoulder.rotation.x = -smoothedArmGestures.rightArmForward; // REVERSED
    
    // Y rotation for variation
    characterParts.rightShoulder.rotation.y = Math.sin(time * 0.4 + Math.PI * 0.3) * 0.1;
  }
  
  // RIGHT ELBOW - Reverse direction with SMOOTHING
  if (characterParts.rightElbow) {
    // Calculate target elbow bend
    const targetRightElbowBend = audioIntensity * Math.PI * 0.5;
    
    // Smooth elbow movement with lingering
    smoothedArmGestures.rightElbowBend += (targetRightElbowBend - smoothedArmGestures.rightElbowBend) * gestureSmoothingFactor;
    
    characterParts.rightElbow.rotation.z = -smoothedArmGestures.rightElbowBend; // REVERSED (was positive)
    
    // Add audio variation
    characterParts.rightElbow.rotation.z += armMovementData.rightForearmRotation * Math.PI * 0.3;
  }
  
  // RIGHT WRIST - Handled by wrist articulation section above, not here
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
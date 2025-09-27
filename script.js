// Import Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 220);
camera.lookAt(0, 0, 0);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Starfield background
const loader = new THREE.TextureLoader();
loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/space/space.jpg', function(texture) {
  scene.background = texture;
});

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 2.5); // even brighter ambient
scene.add(ambient);

const sunLight = new THREE.PointLight(0xffffff, 16, 8000); // even stronger sun light
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Sun
const sunGeo = new THREE.SphereGeometry(7, 64, 64);
const sunTexture = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_sun.jpg');
const sunMat = new THREE.MeshPhongMaterial({ map: sunTexture, emissive: 0xffff33, emissiveIntensity: 0.8 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Sun glow
const sunGlowGeo = new THREE.SphereGeometry(9, 64, 64);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffff99, transparent: true, opacity: 0.12 });
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
scene.add(sunGlow);

// Planet helper function
function createPlanet(size, color, distance, speed) {
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  const geo = new THREE.SphereGeometry(size, 32, 32);
  let mat;
  let mesh;
  // Assign textures for realism
  let textureUrl = null;
  if (color === 0xaaaaaa) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_mercury.jpg';
  if (color === 0xffa500) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_venus_surface.jpg';
  if (color === 0x0000ff) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_earth_daymap.jpg';
  if (color === 0xff4500) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_mars.jpg';
  if (color === 0xd2b48c) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_jupiter.jpg';
  if (color === 0xdeb887) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_saturn.jpg';
  if (color === 0x40e0d0) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_uranus.jpg';
  if (color === 0x00008b) textureUrl = 'https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_neptune.jpg';
  if (textureUrl) {
    const tex = loader.load(textureUrl);
    let bump = null, spec = null;
    let planetColor = 0xffffff;
    // Assign real planet colors
    if (color === 0xaaaaaa) planetColor = 0xb1b1b1; // Mercury: gray
    if (color === 0xffa500) planetColor = 0xf5deb3; // Venus: pale yellow
    if (color === 0x0000ff) planetColor = 0x3d6ef7; // Earth: blue
    if (color === 0xff4500) planetColor = 0xb22222; // Mars: reddish
    if (color === 0xd2b48c) planetColor = 0xf4e2c6; // Jupiter: pale brown
    if (color === 0xdeb887) planetColor = 0xf7e7b4; // Saturn: pale gold
    if (color === 0x40e0d0) planetColor = 0x7fffd4; // Uranus: cyan
    if (color === 0x00008b) planetColor = 0x4169e1; // Neptune: deep blue
    let matParams = { map: tex, color: planetColor, shininess: 120 }; // much shinier
    // Add bump/specular maps for realism
    if (color === 0x0000ff) { // Earth
      bump = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_earth_normal_map.jpg');
      spec = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_earth_specular_map.jpg');
      matParams.bumpMap = bump;
      matParams.bumpScale = 0.15;
      matParams.specularMap = spec;
      matParams.specular = new THREE.Color(0x333333);
      matParams.shininess = 160;
    }
    if (color === 0xff4500) { // Mars
      bump = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_mars_normal_map.jpg');
      matParams.bumpMap = bump;
      matParams.bumpScale = 0.12;
    }
    if (color === 0xd2b48c) { // Jupiter
      bump = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_jupiter_normal_map.jpg');
      matParams.bumpMap = bump;
      matParams.bumpScale = 0.08;
    }
    if (color === 0xdeb887) { // Saturn
      bump = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_saturn_normal_map.jpg');
      matParams.bumpMap = bump;
      matParams.bumpScale = 0.08;
    }
    mat = new THREE.MeshPhongMaterial(matParams);
  } else {
    // Fallback colors
    let fallbackColor = color;
    if (color === 0xaaaaaa) fallbackColor = 0xb1b1b1;
    if (color === 0xffa500) fallbackColor = 0xf5deb3;
    if (color === 0x0000ff) fallbackColor = 0x3d6ef7;
    if (color === 0xff4500) fallbackColor = 0xb22222;
    if (color === 0xd2b48c) fallbackColor = 0xf4e2c6;
    if (color === 0xdeb887) fallbackColor = 0xf7e7b4;
    if (color === 0x40e0d0) fallbackColor = 0x7fffd4;
    if (color === 0x00008b) fallbackColor = 0x4169e1;
    mat = new THREE.MeshPhongMaterial({ color: fallbackColor, shininess: 120 });
  }
  mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = distance;
  pivot.add(mesh);
  return { mesh, pivot, speed };
}

// Planets
const mercury = createPlanet(0.7, 0xb1b1b1, 18, 0.04);
const venus   = createPlanet(1.1, 0xf5deb3, 28, 0.015);
const earth   = createPlanet(1.2, 0x3d6ef7, 38, 0.01);
const mars    = createPlanet(0.9, 0xb22222, 50, 0.008);
const jupiter = createPlanet(2.7, 0xf4e2c6, 65, 0.004);
const saturn  = createPlanet(2.2, 0xf7e7b4, 82, 0.003);
const uranus  = createPlanet(1.5, 0x7fffd4, 100, 0.002);
const neptune = createPlanet(1.5, 0x4169e1, 120, 0.001);

// Add atmospheric glow to Earth
const earthGlowGeo = new THREE.SphereGeometry(1.25, 32, 32);
const earthGlowMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.18 });
const earthGlow = new THREE.Mesh(earthGlowGeo, earthGlowMat);
earthGlow.position.copy(earth.mesh.position);
earth.mesh.add(earthGlow);

// Add cloud layer to Earth
const cloudGeo = new THREE.SphereGeometry(1.22, 32, 32);
const cloudTex = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_earth_clouds.jpg');
const cloudMat = new THREE.MeshPhongMaterial({ map: cloudTex, transparent: true, opacity: 0.4 });
const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
earth.mesh.add(cloudMesh);

// Add faint rings to Uranus and Neptune
const uranusRingGeo = new THREE.RingGeometry(1.7, 2.1, 64);
const uranusRingMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide, transparent: true, opacity: 0.18 });
const uranusRing = new THREE.Mesh(uranusRingGeo, uranusRingMat);
uranusRing.rotation.x = Math.PI / 2.2;
uranus.mesh.add(uranusRing);

const neptuneRingGeo = new THREE.RingGeometry(1.7, 2.1, 64);
const neptuneRingMat = new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide, transparent: true, opacity: 0.12 });
const neptuneRing = new THREE.Mesh(neptuneRingGeo, neptuneRingMat);
neptuneRing.rotation.x = Math.PI / 2.2;
neptune.mesh.add(neptuneRing);

// Add planet shadows (faint circles under each planet)
function addShadow(planet, size) {
  const shadowGeo = new THREE.CircleGeometry(size, 32);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.18 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -size * 0.8;
  planet.mesh.add(shadow);
}
addShadow(mercury, 0.7);
addShadow(venus, 1.1);
addShadow(earth, 1.2);
addShadow(mars, 0.9);
addShadow(jupiter, 2.7);
addShadow(saturn, 2.2);
addShadow(uranus, 1.5);
addShadow(neptune, 1.5);

// Add a moon to Earth 🌙
// Moon orbit around earth
const moonPivot = new THREE.Object3D();
earth.mesh.add(moonPivot);
const moonGeo = new THREE.SphereGeometry(0.3, 32, 32);
const moonTex = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/2k_moon.jpg');
const moonMat = new THREE.MeshPhongMaterial({ map: moonTex, shininess: 40 });
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.x = 2.2;
moonPivot.add(moon);

// Saturn rings
const ringGeo = new THREE.RingGeometry(2.7, 3.5, 128);
const ringTexture = loader.load('https://raw.githubusercontent.com/ajaytripathy/NASA-Planet-Textures/main/saturn_ring_alpha.png');
const ringMat = new THREE.MeshBasicMaterial({ map: ringTexture, color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
saturn.mesh.add(ring);

// Orbit lines for planets
function addOrbit(distance) {
  const orbitGeo = new THREE.TorusGeometry(distance, 0.02, 16, 200);
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
  const orbit = new THREE.Mesh(orbitGeo, orbitMat);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
}
addOrbit(18); addOrbit(28); addOrbit(38); addOrbit(50); addOrbit(65); addOrbit(82); addOrbit(100); addOrbit(120);
// Animate
function animate() {
  requestAnimationFrame(animate);

  mercury.pivot.rotation.y += mercury.speed;
  venus.pivot.rotation.y   += venus.speed;
  earth.pivot.rotation.y   += earth.speed;
  mars.pivot.rotation.y    += mars.speed;
  jupiter.pivot.rotation.y += jupiter.speed;
  saturn.pivot.rotation.y  += saturn.speed;
  uranus.pivot.rotation.y  += uranus.speed;
  neptune.pivot.rotation.y += neptune.speed;

  // Axial rotation for planets
  mercury.mesh.rotation.y += 0.02;
  venus.mesh.rotation.y   += 0.02;
  earth.mesh.rotation.y   += 0.02;
  mars.mesh.rotation.y    += 0.02;
  jupiter.mesh.rotation.y += 0.01;
  saturn.mesh.rotation.y  += 0.01;
  uranus.mesh.rotation.y  += 0.01;
  neptune.mesh.rotation.y += 0.01;

  // Moon orbit
  moonPivot.rotation.y += 0.05;
  moon.rotation.y += 0.02;

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

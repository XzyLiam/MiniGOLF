import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ---------- Audio ----------
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, dur = 0.12, type = 'sine', vol = 0.15) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(); o.stop(audioCtx.currentTime + dur);
}
function sfxHit() { playTone(180, 0.08, 'square', 0.12); }
function sfxHole() { playTone(523, 0.15); setTimeout(() => playTone(659, 0.2), 80); setTimeout(() => playTone(784, 0.25), 160); }
function sfxUI() { playTone(440, 0.06, 'sine', 0.08); }

// ---------- Course Data (better layouts) ----------
const holes = [
  { par: 2, start: [0, 0.2, 0.6], hole: [0, 5.8], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'straight.glb', x: 0, z: 4 },
    { m: 'hole-round.glb', x: 0, z: 6 }
  ]},
  { par: 3, start: [0, 0.2, 0.6], hole: [5.8, 4], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'corner.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: 2, z: 4, r: Math.PI/2 },
    { m: 'bump.glb', x: 4, z: 4, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 6, z: 4, r: Math.PI/2 }
  ]},
  { par: 3, start: [0, 0.2, 0.6], hole: [0, 8.8], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'ramp.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: 0, z: 6 },
    { m: 'obstacle-block.glb', x: 0, z: 7.2 },
    { m: 'hole-round.glb', x: 0, z: 9 }
  ]},
  { par: 4, start: [0, 0.2, 0.6], hole: [3.8, 8], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'hill-square.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: 0, z: 6 },
    { m: 'corner.glb', x: 0, z: 8 },
    { m: 'straight.glb', x: 2, z: 8, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 4, z: 8, r: Math.PI/2 }
  ]},
  { par: 3, start: [0, 0.2, 0.6], hole: [0, 7.8], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'split.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: -1.6, z: 6 },
    { m: 'straight.glb', x: 1.6, z: 6 },
    { m: 'hole-round.glb', x: 0, z: 8 }
  ]},
  { par: 4, start: [0, 0.2, 0.6], hole: [0, 9.8], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'ramp-medium.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: 0, z: 6 },
    { m: 'bump-walls.glb', x: 0, z: 8 },
    { m: 'hole-round.glb', x: 0, z: 10 }
  ]},
  { par: 3, start: [0, 0.2, 0.6], hole: [3.8, 5], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'round-corner-a.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: 2, z: 5, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 4, z: 5, r: Math.PI/2 }
  ]},
  { par: 4, start: [0, 0.2, 0.6], hole: [0, 9.8], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'obstacle-triangle.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: 0, z: 6 },
    { m: 'ramp-high.glb', x: 0, z: 8 },
    { m: 'hole-round.glb', x: 0, z: 10 }
  ]},
  { par: 5, start: [0, 0.2, 0.6], hole: [9.8, 4], pieces: [
    { m: 'start.glb', x: 0, z: 0 },
    { m: 'straight.glb', x: 0, z: 2 },
    { m: 'corner.glb', x: 0, z: 4 },
    { m: 'straight.glb', x: 2, z: 4, r: Math.PI/2 },
    { m: 'hill-round.glb', x: 4, z: 4, r: Math.PI/2 },
    { m: 'straight.glb', x: 6, z: 4, r: Math.PI/2 },
    { m: 'bump.glb', x: 8, z: 4, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 10, z: 4, r: Math.PI/2 }
  ]}
];

const state = {
  hole: 0,
  strokes: 0,
  total: 0,
  moving: false,
  aiming: false,
  power: 0,
  angle: 0
};

// ---------- Three.js Setup ----------
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 30, 90);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);

const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xfff8e1, 1.15);
sun.position.set(25, 40, 15);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -30; sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30;
scene.add(sun);

// Ground
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(60, 64),
  new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Aim indicator
const aimGroup = new THREE.Group();
scene.add(aimGroup);
const aimLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, 1)]);
const aimLine = new THREE.Line(aimLineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }));
aimGroup.add(aimLine);
const aimArrow = new THREE.Mesh(
  new THREE.ConeGeometry(0.12, 0.35, 8),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
aimArrow.rotation.x = Math.PI / 2;
aimGroup.add(aimArrow);

const loader = new GLTFLoader();
const cache = {};

function loadModel(name) {
  return new Promise(resolve => {
    if (cache[name]) return resolve(cache[name].clone());
    loader.load(`models/${name}`, gltf => {
      const root = gltf.scene;
      root.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      cache[name] = root;
      resolve(root.clone());
    }, undefined, () => {
      const g = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 1.8), new THREE.MeshStandardMaterial({ color: 0x666 }));
      box.position.y = 0.075;
      g.add(box);
      cache[name] = g;
      resolve(g.clone());
    });
  });
}

const course = new THREE.Group();
scene.add(course);
const deco = new THREE.Group();
scene.add(deco);

let ball;
const ballVel = new THREE.Vector3();

async function spawnBall() {
  const m = await loadModel('ball-blue.glb');
  m.scale.setScalar(0.75);
  ball = m;
  scene.add(ball);
}

async function placeDecorations() {
  deco.clear();
  const trees = ['tree_default.glb', 'tree_cone.glb'];
  const bushes = ['plant_bush.glb', 'plant_bushLarge.glb'];
  for (let i = 0; i < 28; i++) {
    const isTree = Math.random() > 0.4;
    const name = isTree ? trees[Math.floor(Math.random() * trees.length)] : bushes[Math.floor(Math.random() * bushes.length)];
    try {
      const m = await loadModel(name);
      const angle = Math.random() * Math.PI * 2;
      const dist = 12 + Math.random() * 22;
      m.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      m.rotation.y = Math.random() * Math.PI * 2;
      m.scale.setScalar(0.8 + Math.random() * 0.6);
      deco.add(m);
    } catch (e) {}
  }
  // A few rocks
  for (let i = 0; i < 6; i++) {
    try {
      const m = await loadModel('cliff_large_rock.glb');
      const angle = Math.random() * Math.PI * 2;
      const dist = 16 + Math.random() * 18;
      m.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      m.scale.setScalar(0.6 + Math.random() * 0.5);
      deco.add(m);
    } catch (e) {}
  }
}

async function buildHole(idx) {
  course.clear();
  const data = holes[idx];
  for (const p of data.pieces) {
    const model = await loadModel(p.m);
    model.position.set(p.x, 0, p.z);
    if (p.r) model.rotation.y = p.r;
    course.add(model);
  }
  if (ball) {
    ball.position.set(...data.start);
    ballVel.set(0, 0, 0);
  }
  state.strokes = 0;
  state.moving = false;
  updateHUD();
  // Reset camera behind start
  camera.position.set(data.start[0], 6.5, data.start[2] + 8);
  camera.lookAt(data.start[0], 0.5, data.start[2] + 3);
}

function updateHUD() {
  document.getElementById('hole-num').textContent = state.hole + 1;
  document.getElementById('par').textContent = holes[state.hole].par;
  document.getElementById('strokes').textContent = state.strokes;
  document.getElementById('total').textContent = state.total;
}

function shoot() {
  if (state.moving || state.power < 0.04) return;
  const force = state.power * 14;
  ballVel.set(Math.sin(state.angle) * force, 0, Math.cos(state.angle) * force);
  state.moving = true;
  state.strokes++;
  state.aiming = false;
  aimGroup.visible = false;
  document.getElementById('power-meter').style.display = 'none';
  sfxHit();
  updateHUD();
}

function checkHole() {
  const h = holes[state.hole].hole;
  const dx = ball.position.x - h[0];
  const dz = ball.position.z - h[1];
  if (dx * dx + dz * dz < 0.32) {
    state.moving = false;
    ballVel.set(0, 0, 0);
    state.total += state.strokes;
    sfxHole();
    showComplete();
  }
}

function showComplete() {
  const par = holes[state.hole].par;
  const diff = state.strokes - par;
  let title = 'Hole Complete';
  if (diff <= -2) title = 'Eagle!';
  else if (diff === -1) title = 'Birdie!';
  else if (diff === 0) title = 'Par';
  else if (diff === 1) title = 'Bogey';
  document.getElementById('complete-title').textContent = title;
  document.getElementById('complete-text').textContent = `${state.strokes} strokes (Par ${par})`;
  document.getElementById('complete').classList.add('active');
}

// ---------- Input ----------
let dragOrigin = null;
const powerMeter = document.getElementById('power-meter');
const powerFill = document.getElementById('power-fill');

function screenToWorld(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  const ray = new THREE.Raycaster();
  ray.setFromCamera(new THREE.Vector2(x, y), camera);
  const hits = ray.intersectObject(ground);
  return hits.length ? hits[0].point : null;
}

canvas.addEventListener('pointerdown', e => {
  if (state.moving || document.querySelector('.screen.active')) return;
  dragOrigin = { x: e.clientX, y: e.clientY };
  state.aiming = true;
  aimGroup.visible = true;
  powerMeter.style.display = 'block';
});

canvas.addEventListener('pointermove', e => {
  if (!state.aiming || !dragOrigin || !ball) return;
  const dx = e.clientX - dragOrigin.x;
  const dy = e.clientY - dragOrigin.y;
  const dist = Math.min(Math.hypot(dx, dy), 220);
  state.power = dist / 220;
  state.angle = Math.atan2(dx, -dy);

  // Update aim visual
  const len = 1.2 + state.power * 4.5;
  aimLine.geometry.setFromPoints([
    new THREE.Vector3(0, 0.15, 0),
    new THREE.Vector3(0, 0.15, len)
  ]);
  aimArrow.position.set(0, 0.15, len);
  aimGroup.position.copy(ball.position);
  aimGroup.rotation.y = state.angle;

  powerFill.style.width = (state.power * 100) + '%';
});

function endAim() {
  if (!state.aiming) return;
  state.aiming = false;
  aimGroup.visible = false;
  powerMeter.style.display = 'none';
  if (state.power > 0.05) shoot();
  state.power = 0;
  dragOrigin = null;
}
canvas.addEventListener('pointerup', endAim);
canvas.addEventListener('pointercancel', endAim);

// ---------- Loop ----------
let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - last) / 1000, 0.04);
  last = now;

  if (state.moving && ball) {
    ballVel.multiplyScalar(Math.pow(0.96, dt * 60));
    ball.position.add(ballVel.clone().multiplyScalar(dt));
    ball.position.y = 0.2;

    if (ballVel.length() < 0.12) {
      state.moving = false;
      ballVel.set(0, 0, 0);
    }
    checkHole();

    // Camera follow
    const behind = new THREE.Vector3(
      -Math.sin(state.angle || 0) * 0.2,
      5.8,
      -Math.cos(state.angle || 0) * 0.2 + 7.5
    );
    const camTarget = ball.position.clone().add(behind);
    camera.position.lerp(camTarget, 0.12);
    camera.lookAt(ball.position.x, 0.4, ball.position.z);
  }

  renderer.render(scene, camera);
}

// ---------- UI ----------
function hideScreens() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
}

document.getElementById('btn-play').onclick = async () => {
  sfxUI();
  hideScreens();
  document.getElementById('loading').style.display = 'flex';
  await spawnBall();
  await placeDecorations();
  await buildHole(0);
  document.getElementById('loading').style.display = 'none';
};

document.getElementById('btn-how').onclick = () => {
  sfxUI();
  hideScreens();
  document.getElementById('howto').classList.add('active');
};
document.querySelectorAll('.back').forEach(b => {
  b.onclick = () => {
    sfxUI();
    hideScreens();
    document.getElementById('menu').classList.add('active');
  };
});

document.getElementById('btn-next').onclick = async () => {
  sfxUI();
  document.getElementById('complete').classList.remove('active');
  state.hole++;
  if (state.hole >= holes.length) {
    document.getElementById('complete-title').textContent = 'Course Complete!';
    document.getElementById('complete-text').textContent = `Total: ${state.total} strokes`;
    document.getElementById('btn-next').textContent = 'PLAY AGAIN';
    document.getElementById('btn-next').onclick = () => location.reload();
    document.getElementById('complete').classList.add('active');
    return;
  }
  await buildHole(state.hole);
};

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

document.getElementById('loading').style.display = 'none';
loop(performance.now());

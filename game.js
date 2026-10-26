import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const holes = [
  { par: 2, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'straight.glb', x: 0, z: 4, r: 0 },
    { m: 'hole-round.glb', x: 0, z: 6, r: 0 }
  ]},
  { par: 3, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'corner.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: 2, z: 4, r: Math.PI/2 },
    { m: 'bump.glb', x: 4, z: 4, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 6, z: 4, r: Math.PI/2 }
  ]},
  { par: 3, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'ramp.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: 0, z: 6, r: 0 },
    { m: 'obstacle-block.glb', x: 0, z: 7.5, r: 0 },
    { m: 'hole-round.glb', x: 0, z: 9, r: 0 }
  ]},
  { par: 4, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'hill-square.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: 0, z: 6, r: 0 },
    { m: 'corner.glb', x: 0, z: 8, r: 0 },
    { m: 'straight.glb', x: 2, z: 8, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 4, z: 8, r: Math.PI/2 }
  ]},
  { par: 3, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'split.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: -1.5, z: 6, r: 0 },
    { m: 'straight.glb', x: 1.5, z: 6, r: 0 },
    { m: 'hole-round.glb', x: 0, z: 8, r: 0 }
  ]},
  { par: 4, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'ramp-medium.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: 0, z: 6, r: 0 },
    { m: 'bump-walls.glb', x: 0, z: 8, r: 0 },
    { m: 'hole-round.glb', x: 0, z: 10, r: 0 }
  ]},
  { par: 3, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'round-corner-a.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: 2, z: 5, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 4, z: 5, r: Math.PI/2 }
  ]},
  { par: 4, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'obstacle-triangle.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: 0, z: 6, r: 0 },
    { m: 'ramp-high.glb', x: 0, z: 8, r: 0 },
    { m: 'hole-round.glb', x: 0, z: 10, r: 0 }
  ]},
  { par: 5, pieces: [
    { m: 'start.glb', x: 0, z: 0, r: 0 },
    { m: 'straight.glb', x: 0, z: 2, r: 0 },
    { m: 'corner.glb', x: 0, z: 4, r: 0 },
    { m: 'straight.glb', x: 2, z: 4, r: Math.PI/2 },
    { m: 'hill-round.glb', x: 4, z: 4, r: Math.PI/2 },
    { m: 'straight.glb', x: 6, z: 4, r: Math.PI/2 },
    { m: 'bump.glb', x: 8, z: 4, r: Math.PI/2 },
    { m: 'hole-round.glb', x: 10, z: 4, r: Math.PI/2 }
  ]}
];

const state = {
  holeIndex: 0,
  strokes: 0,
  total: 0,
  ballMoving: false,
  aiming: false,
  power: 0,
  aimAngle: 0
};

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 20, 80);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 8, 12);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 1.1);
sun.position.set(15, 25, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({ color: 0x4caf50 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const loader = new GLTFLoader();
const cache = {};

function load(name) {
  return new Promise(res => {
    if (cache[name]) return res(cache[name].clone());
    loader.load(`models/${name}`, gltf => {
      const m = gltf.scene;
      m.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      cache[name] = m;
      res(m.clone());
    }, undefined, () => {
      const g = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 1.8), new THREE.MeshStandardMaterial({ color: 0x888 }));
      box.position.y = 0.1;
      g.add(box);
      cache[name] = g;
      res(g.clone());
    });
  });
}

const courseGroup = new THREE.Group();
scene.add(courseGroup);

let ball, ballVel = new THREE.Vector3();
const ballRadius = 0.15;

async function loadBall() {
  const m = await load('ball-blue.glb');
  m.scale.setScalar(0.8);
  ball = m;
  scene.add(ball);
}

async function buildHole(index) {
  courseGroup.clear();
  const hole = holes[index];
  for (const p of hole.pieces) {
    const model = await load(p.m);
    model.position.set(p.x, 0, p.z);
    model.rotation.y = p.r || 0;
    courseGroup.add(model);
  }
  // Place ball at start
  if (ball) {
    ball.position.set(0, 0.2, 0.5);
    ballVel.set(0, 0, 0);
  }
  state.strokes = 0;
  updateHUD();
  // Camera
  camera.position.set(0, 7, 10);
  camera.lookAt(0, 0, 4);
}

function updateHUD() {
  document.getElementById('hole').textContent = state.holeIndex + 1;
  document.getElementById('strokes').textContent = state.strokes;
  document.getElementById('par').textContent = holes[state.holeIndex].par;
  document.getElementById('total').textContent = state.total;
}

function shoot(angle, power) {
  if (state.ballMoving) return;
  const force = power * 12;
  ballVel.set(Math.sin(angle) * force, 0, Math.cos(angle) * force);
  state.ballMoving = true;
  state.strokes++;
  updateHUD();
}

function checkHole() {
  // Simple distance to hole position (approximate from last piece)
  const hole = holes[state.holeIndex];
  const last = hole.pieces[hole.pieces.length - 1];
  const dx = ball.position.x - last.x;
  const dz = ball.position.z - last.z;
  if (dx * dx + dz * dz < 0.35) {
    state.ballMoving = false;
    ballVel.set(0, 0, 0);
    state.total += state.strokes;
    showMessage(`Hole ${state.holeIndex + 1} complete!`, `${state.strokes} strokes (Par ${hole.par})`);
  }
}

function showMessage(title, text) {
  document.getElementById('msg-title').textContent = title;
  document.getElementById('msg-text').textContent = text;
  document.getElementById('message').classList.add('active');
}

// Aiming
let dragStart = null;
const powerBar = document.getElementById('power-bar');
const powerFill = document.getElementById('power-fill');

canvas.addEventListener('pointerdown', e => {
  if (state.ballMoving) return;
  dragStart = { x: e.clientX, y: e.clientY };
  state.aiming = true;
  powerBar.style.display = 'block';
});

canvas.addEventListener('pointermove', e => {
  if (!state.aiming || !dragStart) return;
  const dx = e.clientX - dragStart.x;
  const dy = e.clientY - dragStart.y;
  const dist = Math.min(Math.hypot(dx, dy), 200);
  state.power = dist / 200;
  state.aimAngle = Math.atan2(dx, -dy);
  powerFill.style.width = (state.power * 100) + '%';
});

canvas.addEventListener('pointerup', () => {
  if (!state.aiming) return;
  state.aiming = false;
  powerBar.style.display = 'none';
  if (state.power > 0.05) shoot(state.aimAngle, state.power);
  state.power = 0;
  dragStart = null;
});

// Physics loop
let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;

  if (state.ballMoving && ball) {
    ballVel.multiplyScalar(0.985); // friction
    ball.position.add(ballVel.clone().multiplyScalar(dt));
    ball.position.y = 0.2;

    // Simple bounds
    if (Math.abs(ball.position.x) > 30 || Math.abs(ball.position.z) > 30) {
      ballVel.multiplyScalar(0.5);
    }

    if (ballVel.length() < 0.15) {
      state.ballMoving = false;
      ballVel.set(0, 0, 0);
    }
    checkHole();

    // Camera follow
    const target = ball.position.clone().add(new THREE.Vector3(0, 6, 8));
    camera.position.lerp(target, 0.08);
    camera.lookAt(ball.position);
  }

  renderer.render(scene, camera);
}

// UI
document.getElementById('btn-play').onclick = async () => {
  document.getElementById('menu').classList.remove('active');
  document.getElementById('loading').style.display = 'flex';
  await loadBall();
  await buildHole(0);
  document.getElementById('loading').style.display = 'none';
};

document.getElementById('btn-how').onclick = () => {
  document.getElementById('menu').classList.remove('active');
  document.getElementById('howto').classList.add('active');
};
document.querySelectorAll('.back').forEach(b => b.onclick = () => {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  document.getElementById('menu').classList.add('active');
});

document.getElementById('btn-next').onclick = async () => {
  document.getElementById('message').classList.remove('active');
  state.holeIndex++;
  if (state.holeIndex >= holes.length) {
    showMessage('Course Complete!', `Total strokes: ${state.total}`);
    document.getElementById('btn-next').textContent = 'PLAY AGAIN';
    document.getElementById('btn-next').onclick = () => location.reload();
    return;
  }
  await buildHole(state.holeIndex);
};

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

document.getElementById('loading').style.display = 'none';
loop(performance.now());

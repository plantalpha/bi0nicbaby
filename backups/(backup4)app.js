/* -------------------------------------------------
 STARFIELD BACKGROUND (Three.js)
 adapted from your AlienPilgrims site
 Reference: :contentReference[oaicite:1]{index=1}
------------------------------------------------- */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

const canvas = document.getElementById("space");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = 5;

const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const starVertices = [];
for (let i = 0; i < starCount; i++) {
  let theta = Math.random() * 2 * Math.PI;
  let phi = Math.acos(2 * Math.random() - 1);
  let radius = 500 + Math.random() * 1000;
  let x = radius * Math.sin(phi) * Math.cos(theta);
  let y = radius * Math.sin(phi) * Math.sin(theta);
  let z = radius * Math.cos(phi);
  starVertices.push(x, y, z);
}
starGeometry.setAttribute("position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

let starBoost = 1;

function animateStars() {
  requestAnimationFrame(animateStars);
  stars.rotation.y += 0.0006 * starBoost;
  stars.rotation.x += 0.0003 * starBoost;
  renderer.render(scene, camera);
}
animateStars();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* -------------------------------------------------
   BLOB INFINITE CONVEYOR
------------------------------------------------- */

const blobs = Array.from(document.querySelectorAll('.blob'));
let offset = -window.innerWidth; 
let speed = 1.2;
let paused = false;
let mouseY = window.innerHeight / 2;

function getSpacing() {
  return Math.max(window.innerWidth / blobs.length, 440);
}

function layoutBlobs() {
  const spacing = getSpacing();
  const trackLength = spacing * blobs.length;
  blobs.forEach((blob, i) => {
    let x = (i * spacing) + offset;
    x = ((x % trackLength) + trackLength) % trackLength;
    const p = ((mouseY / window.innerHeight) - 0.5) * 10;
    blob.style.left = (x - spacing) + "px";
    blob.style.top = (50 + p) + "%";
  });
}

function animateConveyor() {
  if (!paused) offset += speed;
  layoutBlobs();
  requestAnimationFrame(animateConveyor);
}
animateConveyor();

let chime = null;
try {
  chime = new Audio("sounds/chime.mp3");
} catch (e) {}

blobs.forEach(blob => {
  blob.addEventListener("mouseenter", () => {
    paused = true;
    if (chime) {
      chime.currentTime = 0;
      chime.play().catch(() => {});
    }
  });
  blob.addEventListener("mouseleave", () => paused = false);
});

window.addEventListener("pointermove", (e) => {
  mouseY = e.clientY;
});

/* -------------------------------------------------
   SPARKLE TRAIL
------------------------------------------------- */

document.addEventListener("pointermove", (e) => {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.style.left = e.clientX + "px";
  s.style.top = e.clientY + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 600);
});

/* -------------------------------------------------
   CONTROL BOARD BUTTONS
------------------------------------------------- */

const shuffleBtn = document.getElementById("shuffleBtn");
shuffleBtn.addEventListener("click", () => {
  offset = Math.random() * window.innerWidth;
  mouseY = window.innerHeight * Math.random();
});

/* -------------------------------------------------
   DANCE PARTY MODE (Toggle)
------------------------------------------------- */

const danceBtn = document.getElementById("danceBtn");
const danceAudio = document.getElementById("danceAudio");
const danceMessage = document.getElementById("danceMessage");
const trippyOverlay = document.getElementById("trippyOverlay");

let danceMode = false;
let originalSpeed = speed;
let messageTimer = null;

danceBtn.addEventListener("click", () => {
  // TURN OFF IF ACTIVE
  if (danceMode) {
    endDanceMode();
    return;
  }

  // TURN ON
  startDanceMode();
});

function startDanceMode() {
  danceMode = true;

  // message flash
  danceMessage.classList.add("show");
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => {
    danceMessage.classList.remove("show");
  }, 5000);

  // random start ANYWHERE in track
  const duration = 15;
  const total = danceAudio.duration || 250; 
  const maxStart = Math.max(0, total - duration);
  const randomStart = Math.random() * maxStart;
  danceAudio.currentTime = randomStart;
  danceAudio.play();

  // speed boost + visuals
  originalSpeed = speed;
  speed = 4;
  starBoost = 2.5;
  document.body.classList.add("dance-glitch");

  // randomize motion
  offset = Math.random() * window.innerWidth;
  mouseY = window.innerHeight * Math.random();

  // automatically end after 15s
  setTimeout(() => {
    if (danceMode) endDanceMode();
  }, duration * 1000);
}

function endDanceMode() {
  danceMode = false;

  danceAudio.pause();

  speed = originalSpeed;
  starBoost = 1;
  document.body.classList.remove("dance-glitch");
  danceMessage.classList.remove("show");
}

danceAudio.addEventListener("loadedmetadata", () => {
  // nothing needed, but ensures duration available
});


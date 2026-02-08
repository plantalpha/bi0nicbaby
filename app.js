/* -------------------------------------------------
   STARFIELD BACKGROUND (Three.js)
   adapted from your AlienPilgrims site
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
starGeometry.setAttribute(
  "position",
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
   DIAOLOG BOXES FOR THE PLNAET BABY
------------------------------------------------- */

document.querySelectorAll("model-viewer .hotspot").forEach(btn => {
  btn.addEventListener("click", () => {
    window.open(btn.dataset.url, "_blank");
  });
});



// hover chime
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
  blob.addEventListener("mouseleave", () => {
    paused = false;
  });
});

// parallax
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
   FLOATIES / KANDI LANE SWAP
   (keeps same float, occasionally swaps positions)
------------------------------------------------- */


/* -------------------------------------------------
   DANCE PARTY MODE (random part of Life Wubz On.wav)
------------------------------------------------- */

const danceBtn = document.getElementById("danceBtn");
const danceAudio = document.getElementById("danceAudio");
const danceMessage = document.getElementById("danceMessage");
const stopDanceBtn = document.getElementById("stopDanceBtn");

let danceMode = false;
let originalSpeed = speed;
let danceTimeout = null;

// track length 34:15 = 2055 seconds
const TRACK_LENGTH = 2055;
const PARTY_LENGTH = 15; // seconds

function startDanceParty() {
  if (danceMode) return;
  danceMode = true;

  document.body.classList.add("dance-glitch");
  danceMessage.classList.add("show");
  stopDanceBtn.classList.add("visible");

  originalSpeed = speed;
  speed = 3.6;
  starBoost = 2.5;

  // choose a random start that leaves room for 15s
  const randomStart = Math.random() * (TRACK_LENGTH - PARTY_LENGTH);

  // play immediately to satisfy browser gesture requirement
  danceAudio.pause();
  danceAudio.currentTime = 0;
  danceAudio.play().then(() => {
    // after ~200ms, jump to random point
    setTimeout(() => {
      try {
        danceAudio.currentTime = randomStart;
      } catch (e) {
        // if seek fails, it's still fine, you just hear the start
      }
    }, 200);
  }).catch(() => {});

  clearTimeout(danceTimeout);
  danceTimeout = setTimeout(stopDanceParty, PARTY_LENGTH * 1000);

  // fade out the text after 5s, but keep party going
  setTimeout(() => {
    if (danceMode) {
      danceMessage.classList.remove("show");
    }
  }, 5000);
}

function stopDanceParty() {
  if (!danceMode) return;
  danceMode = false;

  clearTimeout(danceTimeout);
  danceAudio.pause();

  speed = originalSpeed;
  starBoost = 1;
  document.body.classList.remove("dance-glitch");
  danceMessage.classList.remove("show");
  stopDanceBtn.classList.remove("visible");
}

// 💃 button toggles party on/off
danceBtn.addEventListener("click", () => {
  if (danceMode) {
    stopDanceParty();
  } else {
    startDanceParty();
  }
});

// red button always stops
stopDanceBtn.addEventListener("click", stopDanceParty);

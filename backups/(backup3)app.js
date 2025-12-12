/* -------------------------------------------------
   STARFIELD BACKGROUND (Three.js)
   pulled & adapted from your AlienPilgrims site
   Reference: :contentReference[oaicite:0]{index=0}
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

// starfield geometry
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

// animate stars
function animateStars() {
  requestAnimationFrame(animateStars);
  stars.rotation.y += 0.0006;
  stars.rotation.x += 0.0003;
  renderer.render(scene, camera);
}
animateStars();

// resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* -------------------------------------------------
   BLOB INFINITE CONVEYOR
------------------------------------------------- */

const blobs = Array.from(document.querySelectorAll('.blob'));
const spacing = 400;  // pixel gap between blobs
let offset = 0;
let speed = 1.2;
let paused = false;
let mouseY = window.innerHeight / 2;

// layout blobs
function layoutBlobs() {
  const trackLength = spacing * blobs.length;
  blobs.forEach((blob, i) => {
    let x = (i * spacing) + offset;
    // wrap
    x = ((x % trackLength) + trackLength) % trackLength;
    // parallax
    const p = ((mouseY / window.innerHeight) - 0.5) * 10;
    blob.style.left = x + "px";
    blob.style.top = (50 + p) + "%";
  });
}

// animate
function animateConveyor() {
  if (!paused) offset += speed;
  layoutBlobs();
  requestAnimationFrame(animateConveyor);
}
animateConveyor();

// hover pause + chime
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

// track mouse for parallax
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

const crtToggle = document.getElementById("crtToggle");
const shuffleBtn = document.getElementById("shuffleBtn");

crtToggle.addEventListener("click", () => {
  document.body.classList.toggle("crt-on");
});

shuffleBtn.addEventListener("click", () => {
  offset = Math.random() * spacing * blobs.length;
  mouseY = window.innerHeight * Math.random();
});

/* -------------------------------------------------
 STARFIELD BACKGROUND (Three.js)
 adapted from your AlienPilgrims site
 Reference: :contentReference[oaicite:2]{index=2}
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
  // your wider spacing value preserved
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
   DANCE PARTY MODE (Toggle, random position)
------------------------------------------------- */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

/* Starfield stays same */
... (KEEP YOUR STARFIELD CODE EXACTLY AS YOU HAVE IT)

/* Blobs stay same except these two lines: */
let offset = -window.innerWidth;
function getSpacing() {
  return Math.max(window.innerWidth / blobs.length, 440);
}

/* DANCE MODE */
const danceBtn = document.getElementById("danceBtn");
const danceAudio = document.getElementById("danceAudio");
const danceMessage = document.getElementById("danceMessage");
const stopDanceBtn = document.getElementById("stopDanceBtn");

let danceMode = false;
let originalSpeed = speed;
let danceTimeout = null;

// 34:15 total seconds
const TRACK_LENGTH = 2055;
const PARTY_LENGTH = 15;

function startParty() {
  danceMode = true;

  danceMessage.classList.add("show");
  document.body.classList.add("dance-glitch");

  originalSpeed = speed;
  speed = 3.8;
  starBoost = 2.5;

  // play immediately to gain audio permission
  danceAudio.play().catch(()=>{});

  // delay random seek a bit
  const randomStart = Math.random() * (TRACK_LENGTH - PARTY_LENGTH);
  setTimeout(()=>{
    danceAudio.currentTime = randomStart;
  }, 180); 

  // auto end
  clearTimeout(danceTimeout);
  danceTimeout = setTimeout(endParty, PARTY_LENGTH*1000);
}

function endParty() {
  danceMode = false;
  clearTimeout(danceTimeout);

  danceAudio.pause();
  speed = originalSpeed;
  starBoost = 1;

  document.body.classList.remove("dance-glitch");
  danceMessage.classList.remove("show");
}

// Toggle
danceBtn.addEventListener("click", ()=>{
  if (danceMode) endParty()
  else startParty();
});

// Explicit stop button
stopDanceBtn.addEventListener("click", endParty);


/* RANDOM FLOATIES LOGIC */
function randomizeFloaties() {
  document.querySelectorAll('.floatie').forEach(el=>{
    el.style.setProperty('--lane', Math.floor(Math.random()*90));
    el.style.setProperty('--speed', Math.random()*15);
  });
  document.querySelectorAll('.kandi').forEach(el=>{
    el.style.setProperty('--lane', Math.floor(Math.random()*90));
  });
}

// re-randomize every time they restart animation
document.querySelectorAll('.floatie, .kandi').forEach(el=>{
  el.addEventListener('animationiteration', randomizeFloaties);
});

// initial random positions
randomizeFloaties();

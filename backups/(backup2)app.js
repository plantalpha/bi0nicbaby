// ---------- BLOB MOVEMENT + PARALLAX ----------

const blobElements = Array.from(document.querySelectorAll('.blob'));
const blobData = [];
const speed = 0.4; // pixels per frame
let paused = false;
let mouseY = window.innerHeight / 2;

// set starting positions spaced out
blobElements.forEach((blob, index) => {
  const startX = index * 180; // spacing
  blobData.push({
    el: blob,
    x: startX,
    baseTop: 50 + (Math.random() * 10 - 5) // 50% +/- small offset
  });
});

// update positions each frame
function animateBlobs() {
  if (!paused) {
    blobData.forEach(data => {
      data.x += speed;
      const containerWidth = window.innerWidth + 200;
      if (data.x > containerWidth) {
        data.x = -200; // loop from left
      }

      // parallax offset based on mouseY in range [-8, 8]
      const parallax = ((mouseY / window.innerHeight) - 0.5) * 16;
      const topValue = data.baseTop + parallax * 0.1;

      data.el.style.left = data.x + 'px';
      data.el.style.top = topValue + '%';
    });
  }
  requestAnimationFrame(animateBlobs);
}
animateBlobs();

// hover pause + chime
let chimeAudio;
try {
  chimeAudio = new Audio('sounds/chime.mp3'); // put your file here
} catch (e) {
  chimeAudio = null;
}

blobElements.forEach(blob => {
  blob.addEventListener('mouseenter', () => {
    paused = true;
    if (chimeAudio) {
      chimeAudio.currentTime = 0;
      chimeAudio.play().catch(() => {});
    }
  });

  blob.addEventListener('mouseleave', () => {
    paused = false;
  });
});

// track mouse for parallax
window.addEventListener('pointermove', (e) => {
  mouseY = e.clientY;
});

// ---------- GLITTER CURSOR TRAIL ----------

document.addEventListener('pointermove', (e) => {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = e.clientX + 'px';
  sparkle.style.top = e.clientY + 'px';
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 700);
});

// ---------- CONTROL BOARD BUTTONS ----------

const crtToggle = document.getElementById('crtToggle');
const shuffleBtn = document.getElementById('shuffleBtn');

crtToggle.addEventListener('click', () => {
  document.body.classList.toggle('crt-on');
});

shuffleBtn.addEventListener('click', () => {
  // quick chaotic shuffle of blobs & floaties
  blobData.forEach(data => {
    data.x = Math.random() * window.innerWidth;
    data.baseTop = 40 + Math.random() * 20; // between 40%–60%
  });

  const floaties = document.querySelectorAll('.floatie');
  floaties.forEach(f => {
    f.style.animationDuration = (16 + Math.random() * 30) + 's';
    f.style.left = Math.random() * 100 + '%';
  });
});

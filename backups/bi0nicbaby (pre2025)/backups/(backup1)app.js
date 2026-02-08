const container = document.querySelector('.blob-container');
let blobs = document.querySelectorAll('.blob');
let speed = 0.4;
let paused = false;

function animate() {
    if (!paused) {
        blobs.forEach(blob => {
            let x = blob.offsetLeft;
            blob.style.transform = `translateX(${x + speed}px)`;
            if (x > window.innerWidth) {
                blob.style.transform = `translateX(-200px)`;
            }
        });
    }
    requestAnimationFrame(animate);
}

blobs.forEach(blob => {
    blob.addEventListener('mouseenter', () => {
        paused = true;
    });
    blob.addEventListener('mouseleave', () => {
        paused = false;
    });
});

animate();

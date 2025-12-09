const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let drops = [];
let lastTime = 0;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dropSpeed = prefersReducedMotion ? 80 : 240; // pixels per second
const fontSize = 18;
const columnWidth = 26;
const lineHeight = fontSize * 1.35;

const characters = 'AI010101CYBERDATASECUREAUTOMATE';

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  const columns = Math.floor(width / columnWidth);
  drops = Array.from({ length: columns }, () => Math.random() * -height);
}

function drawMatrix(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = Math.min((timestamp - lastTime) / 1000, 0.045);
  lastTime = timestamp;

  ctx.fillStyle = 'rgba(5, 13, 24, 0.16)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(29, 212, 255, 0.7)';
  ctx.font = `${fontSize}px "Space Grotesk"`;
  ctx.textBaseline = 'top';

  drops.forEach((y, i) => {
    const text = characters.charAt(Math.floor(Math.random() * characters.length));
    const x = i * columnWidth;

    const fadeTopFactor = Math.min(1, Math.max(0, (y + lineHeight * 2) / (lineHeight * 3)));
    ctx.globalAlpha = 0.25 + 0.75 * fadeTopFactor;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;

    const reachedBottom = y > height + lineHeight;
    const needsGap = y < 0 && Math.random() > 0.6;
    const nextY = reachedBottom
      ? Math.random() * -height
      : needsGap
      ? y + dropSpeed * delta * 0.65
      : y + dropSpeed * delta;

    drops[i] = nextY;
  });

  requestAnimationFrame(drawMatrix);
}

resizeCanvas();
requestAnimationFrame(drawMatrix);
window.addEventListener('resize', resizeCanvas);

// Intersection animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.panel, .service-card, .project-card, .pill').forEach((el, idx) => {
  el.style.setProperty('--delay', `${idx * 60}ms`);
  observer.observe(el);
});

// Smooth scroll for anchor links
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId !== '#') {
      e.preventDefault();
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Contact form mock submit
const form = document.querySelector('.contact__form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  form.reset();
  const existing = form.querySelector('.success');
  if (existing) existing.remove();
  form.insertAdjacentHTML('beforeend', '<p class="success">Thanks! We will reach out shortly.</p>');
});


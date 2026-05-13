/* ─────────────────────────────────────────
   GSAP + ScrollTrigger
───────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    revealHero();
  }, 1300);
});

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const cursor  = document.getElementById('cursor');
const trail   = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();

document.querySelectorAll('a, button, .wcard, .f-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ─────────────────────────────────────────
   CANVAS PARTICLES
───────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  heroEl.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  const COLORS = ['#10b981','#34d399','#6ee7b7','#22d3ee','#06b6d4'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.4 + 0.4;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.a  = Math.random() * 0.5 + 0.15;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.life = 1;
    }
    update() {
      const dx  = this.x - mouse.x;
      const dy  = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.8;
        this.vx += dx / dist * force * 0.05;
        this.vy += dy / dist * force * 0.05;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.fillStyle = this.c;
      ctx.shadowColor = this.c;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 80) {
          ctx.save();
          ctx.globalAlpha = (1 - d/80) * 0.12;
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─────────────────────────────────────────
   HERO REVEAL
───────────────────────────────────────── */
function revealHero() {
  document.querySelector('.hero-h1').classList.add('visible');
  document.querySelector('.hero-p').classList.add('visible');
  document.querySelector('.hero-btns').classList.add('visible');

  // Staggered stats
  setTimeout(() => {
    document.querySelector('.hero-stats').classList.add('visible');
    animateCounters();
  }, 900);
}

/* ─────────────────────────────────────────
   COUNTERS
───────────────────────────────────────── */
const toPersian = n =>
  String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

function animateCounters() {
  document.querySelectorAll('.stat-n').forEach(el => {
    const target = parseInt(el.dataset.to);
    const suffix = el.nextSibling && el.nextSibling.textContent === '+' ? '' : '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * ease);
      el.textContent = val + (target >= 10 ? '+' : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* Live countdown in card */
(function startCountdown() {
  const h = document.getElementById('c-h');
  const m = document.getElementById('c-m');
  const s = document.getElementById('c-s');
  if (!h) return;
  let hh = 2, mm = 14, ss = 38;
  const pad = n => toPersian(String(n).padStart(2,'0'));
  setInterval(() => {
    ss--;
    if (ss < 0) { ss = 59; mm--; }
    if (mm < 0) { mm = 59; hh--; }
    if (hh < 0) hh = 23;
    if (h) h.textContent = pad(hh);
    if (m) m.textContent = pad(mm);
    if (s) s.textContent = pad(ss);
  }, 1000);
})();

/* ─────────────────────────────────────────
   NAV: scroll & burger
───────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });

const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mob-menu');
burger.addEventListener('click', () => mobMenu.classList.toggle('open'));
document.querySelectorAll('.mob-menu a').forEach(a => {
  a.addEventListener('click', () => mobMenu.classList.remove('open'));
});

/* ─────────────────────────────────────────
   GSAP SCROLL ANIMATIONS
───────────────────────────────────────── */
// anim-up elements
gsap.utils.toArray('.anim-up').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => el.classList.add('visible'),
  });
});

/* ─────────────────────────────────────────
   SKILLS: RADIAL + BARS
───────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.skills-layout',
  start: 'top 75%',
  onEnter: () => {
    // Radial ring
    const ring = document.getElementById('gsap-ring');
    const pctEl = document.getElementById('gsap-pct');
    if (ring) {
      const total = 326.7;
      const pct = 92;
      ring.style.strokeDashoffset = total - (total * pct / 100);

      let cur = 0;
      const dur = 1500;
      const start = performance.now();
      function animPct(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        cur = Math.round(pct * ease);
        if (pctEl) pctEl.textContent = cur;
        if (p < 1) requestAnimationFrame(animPct);
      }
      requestAnimationFrame(animPct);
    }

    // Inject SVG gradient
    const svg = document.querySelector('.radial-svg');
    if (svg && !document.getElementById('radGrad')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `<linearGradient id="radGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a78bfa"/>
        <stop offset="100%" stop-color="#22d3ee"/>
      </linearGradient>`;
      svg.prepend(defs);
    }

    // Bars
    document.querySelectorAll('.bar-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.w + '%';
      }, i * 120);
    });
  }
});

/* ─────────────────────────────────────────
   WORKS FILTER
───────────────────────────────────────── */
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.wcard').forEach(card => {
      const match = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ─────────────────────────────────────────
   WCARD: inject live banner iframes
───────────────────────────────────────── */
document.querySelectorAll('.wcard-thumb[data-preview]').forEach(thumb => {
  const p = new URLSearchParams(thumb.getAttribute('data-preview')).get('p');
  if (!p) return;
  const iframe = document.createElement('iframe');
  iframe.src = p + '/index.html';
  iframe.className = 'thumb-iframe';
  iframe.loading = 'lazy';
  iframe.scrolling = 'no';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.tabIndex = -1;
  thumb.insertBefore(iframe, thumb.querySelector('.wcard-hover-overlay'));
});

/* ─────────────────────────────────────────
   WCARD CLICK → PREVIEW
───────────────────────────────────────── */
document.querySelectorAll('.wcard').forEach(card => {
  const thumb = card.querySelector('.wcard-thumb[data-preview]');
  if (!thumb) return;
  const params = thumb.getAttribute('data-preview');
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    window.open('preview.html?' + params, '_blank');
  });
  // Show cursor feedback
  card.addEventListener('mouseenter', () => {
    const overlay = card.querySelector('.wcard-hover-overlay');
    if (overlay) overlay.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    const overlay = card.querySelector('.wcard-hover-overlay');
    if (overlay) overlay.style.opacity = '0';
  });
});

/* ─────────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.25;
    const y = (e.clientY - r.top  - r.height / 2) * 0.25;
    gsap.to(el, { x, y, duration: .3, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' });
  });
});

/* ─────────────────────────────────────────
   GSAP: Section text parallax
───────────────────────────────────────── */
gsap.utils.toArray('.about-text-bg').forEach(el => {
  gsap.to(el, {
    y: -60,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  });
});

/* ─────────────────────────────────────────
   WCARD TILT
───────────────────────────────────────── */
document.querySelectorAll('.wcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    gsap.to(card, {
      rotateY:  x * 6,
      rotateX: -y * 6,
      duration: .4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: 'elastic.out(1,.4)' });
  });
});

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
document.getElementById('cf').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const txt = btn.querySelector('.btn-txt');
  txt.textContent = '✓ پیام ارسال شد!';
  btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
  gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: .4, ease: 'back.out(2)' });
  setTimeout(() => {
    txt.textContent = 'ارسال ✦';
    btn.style.background = '';
    e.target.reset();
  }, 3500);
});

/* ─────────────────────────────────────────
   NAV active link highlight
───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navAnchors.forEach(a => {
    const active = a.getAttribute('href') === '#' + current;
    a.style.color = active ? 'var(--p2)' : '';
  });
}, { passive: true });

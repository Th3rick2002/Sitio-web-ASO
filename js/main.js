/**
 * Forge One — animations & interactive placeholders
 * anime.js (CDN) + canvas / DOM visuals
 */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* —— Nav scroll state —— */
  const nav = document.getElementById('site-nav');
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* —— Hero entrance —— */
  function heroIntro() {
    if (reduced || typeof anime === 'undefined') {
      document.querySelectorAll('.hero-eyebrow, .hero-title, .hero-sub, .hero-cta, #phone-hero')
        .forEach((el) => { el.style.opacity = '1'; });
      return;
    }

    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: '.hero-eyebrow',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 900,
      })
      .add({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1100,
      }, '-=500')
      .add({
        targets: '.hero-sub',
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 900,
      }, '-=700')
      .add({
        targets: '.hero-cta',
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 800,
      }, '-=600')
      .add({
        targets: '#phone-hero',
        opacity: [0, 1],
        translateY: [60, 0],
        duration: 1200,
      }, '-=900');

    if (!reduced) {
      anime({
        targets: '#phone-hero',
        translateY: [0, -12],
        duration: 3200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: 1400,
      });
    }
  }

  /* —— Hero canvas: particle constellation (anime.js-style demo) —— */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const particles = [];
    const count = 48;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        hue: Math.random() > 0.55 ? 18 : 0,
      });
    }

    let mouse = { x: w / 2, y: h / 2 };
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * w;
      mouse.y = ((e.clientY - rect.top) / rect.height) * h;
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // soft vignette background
      const g = ctx.createRadialGradient(w / 2, h * 0.35, 20, w / 2, h / 2, h * 0.7);
      g.addColorStop(0, 'rgba(255,77,0,0.22)');
      g.addColorStop(0.45, 'rgba(10,10,10,0.9)');
      g.addColorStop(1, '#000');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // logo wordmark
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.font = '600 28px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Forge', w / 2, h * 0.42);
      ctx.fillStyle = '#ff4d00';
      ctx.fillText('.', w / 2 + 42, h * 0.42);

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '300 11px Outfit, sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('ONE', w / 2, h * 0.48);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // gentle attract to pointer
        p.vx += (mouse.x - p.x) * 0.00008;
        p.vy += (mouse.y - p.y) * 0.00008;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue ? 'rgba(255,77,0,0.85)' : 'rgba(255,255,255,0.7)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 70) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,77,0,${(1 - dist / 70) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (!reduced) requestAnimationFrame(draw);
    }

    draw();
  }

  /* —— Design lines + orbit —— */
  function initDesign() {
    const linesHost = document.getElementById('design-lines');
    if (linesHost) {
      for (let i = 0; i < 14; i++) {
        const span = document.createElement('span');
        span.style.top = `${(i + 1) * (100 / 15)}%`;
        linesHost.appendChild(span);
      }

      if (!reduced && typeof anime !== 'undefined') {
        anime({
          targets: '#design-lines span',
          scaleX: [0, 1],
          opacity: [0, 0.55],
          delay: anime.stagger(80),
          duration: 1200,
          easing: 'easeOutExpo',
          loop: true,
          direction: 'alternate',
        });
      }
    }

    const dots = document.querySelectorAll('.orbit-dot');
    if (dots.length && !reduced && typeof anime !== 'undefined') {
      dots.forEach((dot, i) => {
        const radius = i % 2 === 0 ? 170 : 220;
        const angle = { value: (i / dots.length) * Math.PI * 2 };

        anime({
          targets: angle,
          value: angle.value + Math.PI * 2,
          duration: 8000 + i * 1200,
          easing: 'linear',
          loop: true,
          update() {
            const x = Math.cos(angle.value) * radius;
            const y = Math.sin(angle.value) * radius;
            dot.style.transform = `translate(${x}px, ${y}px)`;
          },
        });
      });

      anime({
        targets: '.orbit-ring',
        rotate: '1turn',
        duration: 20000,
        easing: 'linear',
        loop: true,
      });
    }
  }

  /* —— Display ribbon wave —— */
  function initRibbon() {
    const panels = document.querySelectorAll('.ribbon-panel');
    if (!panels.length || reduced || typeof anime === 'undefined') return;

    anime({
      targets: panels,
      scaleY: [0.55, 1],
      opacity: [0.4, 1],
      delay: anime.stagger(100, { from: 'center' }),
      duration: 1400,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,
    });
  }

  /* —— Camera canvas: radial pulse rings —— */
  function initCameraCanvas() {
    const canvas = document.getElementById('camera-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const rings = [];
    for (let i = 0; i < 5; i++) {
      rings.push({ r: 40 + i * 36, a: 0.15 + i * 0.08, speed: 0.4 + i * 0.1 });
    }

    let t = 0;
    function draw() {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      const bg = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220);
      bg.addColorStop(0, 'rgba(255,77,0,0.15)');
      bg.addColorStop(1, 'rgba(5,5,5,0)');
      ctx.fillStyle = bg;
      ctx.fill();

      rings.forEach((ring, i) => {
        const pulse = 1 + Math.sin(t * ring.speed + i) * 0.04;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,77,0,${ring.a})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // dashed arc segment
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r * pulse, t * ring.speed, t * ring.speed + Math.PI * 0.6);
        ctx.strokeStyle = `rgba(255,255,255,${0.25 + ring.a})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // floating nodes
      for (let i = 0; i < 12; i++) {
        const ang = t * 0.3 + (i / 12) * Math.PI * 2;
        const rad = 90 + (i % 3) * 40;
        const x = cx + Math.cos(ang) * rad;
        const y = cy + Math.sin(ang) * rad;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 ? '#ff4d00' : 'rgba(255,255,255,0.7)';
        ctx.fill();
      }

      if (!reduced) requestAnimationFrame(draw);
    }

    draw();

    if (!reduced && typeof anime !== 'undefined') {
      anime({
        targets: '.lens-ring',
        scale: [1, 1.08],
        opacity: [0.7, 1],
        duration: 2000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.stagger(200),
      });
    }
  }

  /* —— Chip grid heat map —— */
  function initChip() {
    const grid = document.getElementById('chip-grid');
    if (!grid) return;

    const cells = [];
    for (let i = 0; i < 64; i++) {
      const cell = document.createElement('div');
      cell.className = 'chip-cell';
      grid.appendChild(cell);
      cells.push(cell);
    }

    function pulse() {
      cells.forEach((c) => c.classList.remove('is-hot'));
      const hotCount = 10 + Math.floor(Math.random() * 14);
      for (let i = 0; i < hotCount; i++) {
        const idx = Math.floor(Math.random() * cells.length);
        cells[idx].classList.add('is-hot');
      }
    }

    pulse();
    if (!reduced) setInterval(pulse, 700);

    if (!reduced && typeof anime !== 'undefined') {
      anime({
        targets: '.chip-core',
        scale: [1, 1.06],
        duration: 1800,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
      });
    }
  }

  /* —— Battery charge animation —— */
  function initBattery(root) {
    const fill = document.getElementById('battery-fill');
    const label = document.getElementById('battery-percent');
    if (!fill || !label) return;

    const state = { pct: 0 };

    if (reduced || typeof anime === 'undefined') {
      fill.style.width = '92%';
      label.textContent = '92%';
      return;
    }

    anime({
      targets: state,
      pct: 92,
      duration: 2800,
      easing: 'easeOutExpo',
      update() {
        const v = Math.round(state.pct);
        fill.style.width = `${v}%`;
        label.textContent = `${v}%`;
      },
    });
  }

  /* —— Color swatches —— */
  function initColors() {
    const swatches = document.querySelectorAll('.color-swatch');
    const frame = document.getElementById('color-frame');
    if (!swatches.length || !frame) return;

    swatches.forEach((btn) => {
      btn.addEventListener('click', () => {
        swatches.forEach((s) => s.classList.remove('is-active'));
        btn.classList.add('is-active');
        const color = btn.getAttribute('data-color');
        frame.style.background = `linear-gradient(145deg, ${color}, #0a0a0a 55%, ${color})`;

        if (!reduced && typeof anime !== 'undefined') {
          anime({
            targets: '#phone-color',
            scale: [0.96, 1],
            duration: 450,
            easing: 'easeOutBack',
          });
        }
      });
    });
  }

  /* —— Scroll reveals —— */
  function initReveals() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      initBattery();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            if (entry.target.contains(document.getElementById('battery-widget'))) {
              if (!entry.target.dataset.charged) {
                entry.target.dataset.charged = '1';
                initBattery();
              }
            }

            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));
  }

  /* —— Pre-order demo button —— */
  function initPreorder() {
    const btn = document.getElementById('preorder-btn');
    const note = document.getElementById('preorder-note');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (note) note.hidden = false;
      btn.textContent = 'Reserved — demo';
      btn.disabled = true;
      btn.classList.add('btn-disabled');

      if (!reduced && typeof anime !== 'undefined') {
        anime({
          targets: btn,
          scale: [1, 1.05, 1],
          duration: 500,
          easing: 'easeOutElastic(1, .6)',
        });
      }
    });
  }

  /* —— Boot —— */
  function boot() {
    heroIntro();
    initHeroCanvas();
    initDesign();
    initRibbon();
    initCameraCanvas();
    initChip();
    initColors();
    initReveals();
    initPreorder();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

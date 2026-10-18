const WS_URL    = 'wss://cryptian.com/ws';
const GOLD_MARKET = 'goldirr';
const PERSIAN_DIGIT_MAP = {'۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'};

let webSocket = null;
let wsReconnectTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  initIntroAnimation();
  initLivePriceTicker();
  initWebSocket();
  initCopyTicket();
  setTimeout(() => location.reload(), 25000);
});

/* ─────────────────────────────────────────────
   COPY TICKET
───────────────────────────────────────────── */
function initCopyTicket() {
  const ticket = document.querySelector('.ticket');
  const codeEl = document.querySelector('.ticket-code');
  let copying  = false;

  ticket.addEventListener('click', (e) => {
    e.stopPropagation();
    if (copying) return;
    copying = true;

    navigator.clipboard.writeText('invi5').catch(() => {});
    fire_tag(ALL_EVENT_TYPES.CLICK1);

    // stamp rings explode outward
    gsap.fromTo('.stamp-ring',
      { scale: 0.85, opacity: 0.78 },
      { scale: 2.9, opacity: 0, stagger: 0.11, duration: 0.7, ease: 'power2.out' }
    );

    // code text swaps
    gsap.to(codeEl, {
      opacity: 0, scale: 0.6, duration: 0.13, ease: 'power2.in',
      onComplete: () => {
        codeEl.textContent      = '✓ کپی شد';
        codeEl.style.fontFamily = "'Peyda', sans-serif";
        codeEl.style.letterSpacing = '0';
        codeEl.style.fontSize   = '10px';
        gsap.fromTo(codeEl,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.24, ease: 'back.out(3)' }
        );

        setTimeout(() => {
          gsap.to(codeEl, {
            opacity: 0, scale: 0.6, duration: 0.13, ease: 'power2.in',
            onComplete: () => {
              codeEl.textContent         = 'invi5';
              codeEl.style.fontFamily    = '';
              codeEl.style.letterSpacing = '';
              codeEl.style.fontSize      = '';
              gsap.fromTo(codeEl,
                { opacity: 0, scale: 0.6 },
                { opacity: 1, scale: 1, duration: 0.24, ease: 'back.out(3)',
                  onComplete: () => { copying = false; } }
              );
            }
          });
        }, 1700);
      }
    });
  });
}

/* ─────────────────────────────────────────────
   INTRO — 3-phase cinematic entrance
   PHASE 1 : coin drops from above (hero moment)
   PHASE 2 : environment appears behind coin
   PHASE 3 : content fills in one by one
───────────────────────────────────────────── */
function initIntroAnimation() {

  /* ── hide everything except the coin ── */
  gsap.set(['.light-burst', '.stamp-ring'], { opacity: 0 });
  gsap.set('.spark',          { opacity: 0, scale: 0 });
  gsap.set('.cta-nudge',      { opacity: 0 });
  gsap.set('.coin-text',      { clipPath: 'inset(0 100% 0 0)' });
  gsap.set('.ring',           { opacity: 0, scale: 0.3 });
  gsap.set('.bgPriceWrapper', { scaleX: 0.03, opacity: 0, transformOrigin: 'center center' });
  gsap.set('.bg',             { scaleY: 0.02, transformOrigin: 'center center', opacity: 0 });
  gsap.set('.bg-glow',        { opacity: 0 });
  gsap.set('.logo',           { opacity: 0 });
  gsap.set('.ticket',         { scale: 0.03, rotation: 22, opacity: 0 });

  /* ── coin starts ABOVE CENTER, then drops to center, then slides LEFT ── */
  // xToCenter: offset from coin's natural left position to viewport center
  // coin natural x ≈ 43px from left (10px .left padding + 33px half-coin)
  const xToCenter = window.innerWidth / 2 - 43;
  // yToCenter: coin natural y is ~46px from viewport bottom, so center offset =
  // 46 - viewportHeight/2  (negative = coin needs to move UP from natural pos)
  const yToCenter = Math.round(46 - window.innerHeight / 2);

  gsap.set('.coin-float-wrap', {
    x: xToCenter, y: yToCenter - 120,
    scale: 2.4, rotation: -180,
    transformOrigin: 'center center',
  });

  const master = gsap.timeline({ defaults: { ease: 'power3.out' } });

  /* ══════════════════════════════════════════
     PHASE 1 — COIN DROPS TO CENTER
  ══════════════════════════════════════════ */

  // ① coin ROCKETS into center of banner — spinning fall
  master.to('.coin-float-wrap', {
    x: xToCenter, y: yToCenter,
    scale: 1.65, rotation: 0, opacity: 1,
    duration: 0.6, ease: 'power3.in',
  });

  // IMPACT at center — squash & burst
  master.to('.coin-float-wrap', {
    y: yToCenter + 14, scaleY: 0.65, scaleX: 1.28,
    duration: 0.07, ease: 'none',
  })
  .call(() => {
    gsap.to('.light-burst', {
      opacity: 1, scale: 2.2, duration: 0.1,
      onComplete: () =>
        gsap.to('.light-burst', { opacity: 0, scale: 4.5, duration: 0.55, ease: 'power2.out' }),
    });
  })
  // BIG bounce up (staying at center x)
  .to('.coin-float-wrap', { y: yToCenter - 34, scaleY: 1.2, scaleX: 0.86, duration: 0.3, ease: 'power2.out' })
  .to('.coin-float-wrap', { y: yToCenter, scaleY: 1, scaleX: 1, duration: 0.22, ease: 'power2.in' })
  // second bounce
  .to('.coin-float-wrap', { y: yToCenter - 10, duration: 0.13, ease: 'power2.out' })
  .to('.coin-float-wrap', { y: yToCenter + 3,  duration: 0.1,  ease: 'power2.in' })
  // micro settle
  .to('.coin-float-wrap', { y: yToCenter - 2, duration: 0.06, ease: 'power2.out' })
  .to('.coin-float-wrap', { y: yToCenter,     duration: 0.06 });

  // shrink to final size while still at center
  master.to('.coin-float-wrap', {
    scale: 1, duration: 0.35, ease: 'power2.inOut',
  }, '-=0.12');

  // ② SLIDE LEFT to natural position — smooth glide
  master.to('.coin-float-wrap', {
    x: 0, y: 0, duration: 0.62, ease: 'power3.inOut',
  }, '+=0.08');

  /* ══════════════════════════════════════════
     PHASE 2 — ENVIRONMENT APPEARS
  ══════════════════════════════════════════ */

  // ② BG unrolls from a razor-thin line behind the coin
  master.to('.bg', {
    scaleY: 1, opacity: 1, duration: 0.72, ease: 'expo.out',
  }, '+=0.06');

  // bg-glow fades in simultaneously over bg
  master.to('.bg-glow', {
    opacity: 1, duration: 0.9, ease: 'power2.out',
  }, '<');

  // ③ Orbit rings materialize around settled coin
  master.to('.ring', {
    opacity: 1, scale: 1,
    stagger: 0.1, duration: 0.4, ease: 'back.out(2.5)',
  }, '-=0.55');

  // ④ Logo focus-blurs in
  master.fromTo('.logo', {
    opacity: 0, scale: 1.6, filter: 'blur(10px)',
  }, {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    duration: 0.48, ease: 'power3.out',
  }, '-=0.32');

  /* ══════════════════════════════════════════
     PHASE 3 — CONTENT FILLS IN
  ══════════════════════════════════════════ */

  // ⑤ Coin text WIPES in (RTL reveal)
  master.to('.coin-text', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 0.54, ease: 'power3.out',
  }, '-=0.1')
  .call(() => { gsap.set('.coin-text', { clipPath: 'none' }); });

  // ⑥ Price panel SCROLL-UNROLLS
  master.fromTo('.bgPriceWrapper', {
    scaleX: 0.03, opacity: 0,
    transformOrigin: 'center center',
  }, {
    scaleX: 1, opacity: 1,
    duration: 0.6, ease: 'expo.out',
  }, '-=0.3');

  // ⑦ Ticket STAMPS in hard
  master.to('.ticket', {
    scale: 1, rotation: 0, opacity: 1,
    duration: 0.56, ease: 'back.out(3.5)',
  }, '-=0.26');

  master.call(() => {
    gsap.fromTo('.stamp-ring',
      { scale: 0.85, opacity: 0.7 },
      { scale: 2.6, opacity: 0, stagger: 0.12, duration: 0.65, ease: 'power2.out' }
    );
  });

  // ⑧ CTA nudge drifts in
  master.fromTo('.cta-nudge', {
    opacity: 0, y: 8,
  }, {
    opacity: 0.62, y: 0,
    duration: 0.4, ease: 'back.out(2.5)',
  }, '-=0.28');

  // ⑨ Sparkles POP
  master.to('.spark', {
    opacity: 1, scale: 1,
    stagger: { each: 0.07, from: 'random' },
    duration: 0.28, ease: 'back.out(6)',
  }, '-=0.22');

  /* ── after intro: launch all infinite tweens ── */
  master.call(() => {
    // coin gentle levitation
    gsap.to('.coin-float-wrap', {
      y: -6, yoyo: true, repeat: -1, duration: 2.3, ease: 'sine.inOut',
    });

    // orbit ring opacity breathe
    gsap.to('.ring-outer', { opacity: 0.65, yoyo: true, repeat: -1, duration: 2.0, ease: 'sine.inOut' });
    gsap.to('.ring-mid',   { opacity: 0.38, yoyo: true, repeat: -1, duration: 3.2, ease: 'sine.inOut', delay: 0.8 });

    // bg-glow atmosphere breathing (GSAP — no CSS animation needed)
    gsap.to('.bg-glow', { opacity: 0.65, yoyo: true, repeat: -1, duration: 5, ease: 'sine.inOut' });

    // sparkle x-drift (all 14 sparks)
    gsap.to('.sp1,.sp3,.sp5,.sp9,.sp11,.sp13', { x:  6, yoyo: true, repeat: -1, duration: 3.2, ease: 'sine.inOut' });
    gsap.to('.sp2,.sp4,.sp6,.sp8,.sp10,.sp14', { x: -5, yoyo: true, repeat: -1, duration: 2.8, ease: 'sine.inOut', delay: 0.5 });
    gsap.to('.sp7,.sp12', { x: 4, yoyo: true, repeat: -1, duration: 3.6, ease: 'sine.inOut', delay: 1.1 });

    // cta-nudge pulse
    gsap.to('.cta-nudge', { opacity: 0.96, yoyo: true, repeat: -1, duration: 1.05, ease: 'sine.inOut' });

    // ticket shakes every 4s
    const shakeTicket = () => {
      gsap.to('.ticket-stamp-wrap', {
        x: 4, yoyo: true, repeat: 5, duration: 0.055, ease: 'none',
        onComplete: () => gsap.delayedCall(4, shakeTicket),
      });
    };
    gsap.delayedCall(4, shakeTicket);
  });

  master.eventCallback('onComplete', () => gsap.delayedCall(7, promoSpotlight));
}

/* ─────────────────────────────────────────────
   SPOTLIGHT — every ~13s
───────────────────────────────────────────── */
function promoSpotlight() {
  const tl = gsap.timeline();

  // dim secondary elements
  tl.to(['.logo', '.text-gift'], { opacity: 0.28, duration: 0.38, ease: 'power2.in' })

  // coin LAUNCHES upward + spins with wobble
    .to('.coin-float-wrap', { y: -11, duration: 0.22, ease: 'power2.out' }, '-=0.28')
    .to('.gold-coin', {
      scale: 1.4, rotation: 20,
      duration: 0.38, ease: 'back.out(2.4)', transformOrigin: 'center center',
    }, '-=0.18')
    .to('.gold-coin', { rotation: -12, duration: 0.2 })
    .to('.gold-coin', { rotation: 0, duration: 0.32, ease: 'elastic.out(1, 0.38)' })

  // text-gold surges
    .to('.text-gold', {
      scale: 1.12, duration: 0.32, ease: 'back.out(1.6)', transformOrigin: 'left center',
    }, '-=0.62')

  // sparkle BURST
    .to('.spark', {
      scale: 2.9, opacity: 1,
      stagger: { each: 0.04, from: 'random' }, duration: 0.17, ease: 'power3.out',
    }, '-=0.52')
    .to('.spark', {
      scale: 1, opacity: 0.65,
      stagger: { each: 0.05, from: 'random' }, duration: 0.32,
    })

  // stamp rings burst (urgency signal)
    .call(() => {
      gsap.fromTo('.stamp-ring',
        { scale: 0.82, opacity: 0.72 },
        { scale: 2.5, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
      );
    })

  // ticket bounces frantically — the strongest click incentive
    .to('.ticket-stamp-wrap', { y: -8, duration: 0.12, ease: 'power2.out' }, '-=0.28')
    .to('.ticket-stamp-wrap', { y: 0, duration: 0.1, ease: 'bounce.out' })
    .to('.ticket-stamp-wrap', { y: -5, duration: 0.08, ease: 'power2.out' })
    .to('.ticket-stamp-wrap', { y: 0, duration: 0.08 })
    .to('.ticket-stamp-wrap', { y: -2, duration: 0.05 })
    .to('.ticket-stamp-wrap', { y: 0, duration: 0.05 })

  // CTA nudge flashes and scales
    .to('.cta-nudge', {
      opacity: 1, scale: 1.15, duration: 0.26, ease: 'back.out(2.5)', transformOrigin: 'center center',
    }, '-=0.18')
    .to('.cta-nudge', { scale: 1, duration: 0.18 })

  // price pop
    .call(() => playValuePop(document.querySelector('.live-price')))

  // ── hold 3.5s ──
    .to('.gold-coin', {
      scale: 1, rotation: 0, duration: 0.5, ease: 'power2.inOut', delay: 3.5,
    })
    .to('.coin-float-wrap', { y: 0, duration: 0.4 }, '-=0.45')
    .to('.text-gold',  { scale: 1, duration: 0.32 }, '-=0.4')
    .to(['.logo', '.text-gift'], { opacity: 1, duration: 0.4 }, '-=0.4')
    .to('.cta-nudge',  { opacity: 0.62, scale: 1, duration: 0.3 }, '-=0.4')

    .call(() => gsap.delayedCall(7, promoSpotlight));
}

/* ─────────────────────────────────────────────
   LIVE PRICE
───────────────────────────────────────────── */
function initLivePriceTicker() {
  const livePriceEl  = document.querySelector('.live-price');
  const liveValueEl  = document.querySelector('.live-value');
  const liveIndicator = document.querySelector('.live-indicator');

  if (!livePriceEl || !liveValueEl) return;
  let lastRendered = '';

  const renderPrice = (display, numeric) => {
    const val = display || '';
    if (val !== lastRendered) {
      lastRendered = val;
      liveValueEl.textContent = val;
      playValuePop(livePriceEl);
    }
    if (liveIndicator)
      liveIndicator.classList.toggle('is-offline', !Number.isFinite(numeric));
  };

  const handleWsPrice = (bidPrice) => {
    const n = parseToNumber(bidPrice);
    const x = Number.isFinite(n) ? n * 100 : null;
    renderPrice(formatPriceValue(Number.isFinite(x) ? x : bidPrice), x);
  };

  window.__priceUpdateHandler = handleWsPrice;
  renderPrice('---', null);
}

function playValuePop(el) {
  if (!el) return;
  gsap.fromTo(el,
    { opacity: 0.38, scale: 0.84 },
    { opacity: 1, scale: 1, duration: 0.72, ease: 'elastic.out(1, 0.5)' }
  );
}

/* ─────────────────────────────────────────────
   WEBSOCKET
───────────────────────────────────────────── */
function initWebSocket() {
  const msg = { channel: 'markets', model: 'all', request: 'SUBSCRIBE' };
  const connect = () => {
    try {
      webSocket = new WebSocket(WS_URL);
      webSocket.addEventListener('open', () => webSocket.send(JSON.stringify(msg)));
      webSocket.addEventListener('message', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.message?.markets) {
            const g = data.message.markets.find(m => m.market === GOLD_MARKET);
            if (g?.bid_price) window.__priceUpdateHandler(g.bid_price);
          }
        } catch (_) {}
      });
      webSocket.addEventListener('close', () => { wsReconnectTimeout = setTimeout(connect, 3000); });
      webSocket.addEventListener('error', () => {});
    } catch (_) { wsReconnectTimeout = setTimeout(connect, 3000); }
  };
  connect();
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function formatPriceValue(v) {
  if (Number.isFinite(v)) return v.toLocaleString('fa-IR').replace(/[٬,]/g, '.');
  const n = parseToNumber(v);
  if (Number.isFinite(n)) return n.toLocaleString('fa-IR').replace(/[٬,]/g, '.');
  return v == null ? '--' : String(v);
}
function parseToNumber(value) {
  if (value == null || value === '') return NaN;
  const s = toEnglishDigits(String(value)).replace(/[٬,]/g, '').replace(/[^\d]/g, '');
  return s ? Number.parseFloat(s) : NaN;
}
function toEnglishDigits(v) {
  return String(v).replace(/[۰-۹]/g, d => PERSIAN_DIGIT_MAP[d] || d);
}

window.addEventListener('load', function () {
  let wheelTween   = null;
  let ctaTween     = null;
  let bobbingTween = null;
  let lastDisplayed = -1;
  let statsDims    = { width: 80, height: 22 };

  function toPersian(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function pulseBox() {
    const box = document.querySelector('.stats-box');
    if (!box || parseFloat(gsap.getProperty(box, 'opacity')) < 0.5) return;
    const num   = box.querySelector('.stats-number');
    const texts = box.querySelectorAll('.stats-number, .stats-label');
    gsap.killTweensOf(num, 'scale');
    gsap.killTweensOf(texts, 'color');
    gsap.fromTo(num,
      { scale: 1.5 },
      { scale: 1, duration: 0.3, ease: 'back.out(1.6)', overwrite: 'auto', transformOrigin: '50% 50%' }
    );
    gsap.fromTo(texts,
      { color: '#ffffff' },
      { color: '#75FF08', duration: 0.3, ease: 'power2.out', overwrite: 'auto' }
    );
  }

  function updateStats(value) {
    if (value === lastDisplayed) return;
    lastDisplayed = value;
    const el = document.querySelector('.stats-number');
    if (el) el.textContent = toPersian(value);
    if (value > 0) pulseBox();
  }

  function startBobbing() {
    if (bobbingTween) bobbingTween.kill();
    bobbingTween = gsap.to('.carBody', {
      y: -2.5, rotation: 0.7,
      duration: 0.42, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }

  function stopBobbing() {
    if (bobbingTween) { bobbingTween.kill(); bobbingTween = null; }
    gsap.to('.carBody', { y: 0, rotation: 0, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
  }

  function brakeEffect() {
    const tl = gsap.timeline();
    tl.to('.carBody', { x: -11, rotation:  3.5, duration: 0.11, ease: 'power3.out', overwrite: 'auto' });
    tl.to('.carBody', { x:   6, rotation: -2,   duration: 0.16, ease: 'power2.inOut' });
    tl.to('.carBody', { x:  -3, rotation:  1,   duration: 0.11, ease: 'power2.inOut' });
    tl.to('.carBody', { x:   1, rotation: -0.4, duration: 0.09, ease: 'power2.inOut' });
    tl.to('.carBody', { x:   0, rotation:  0,   duration: 0.09, ease: 'power2.out'   });
  }

  function onCarArrived() {
    slowThenStopWheels();
    stopBobbing();
    brakeEffect();
  }

  function syncGradient() {
    const bar = document.querySelector('.bar');
    const car = document.querySelector('.carContainer');
    if (!bar || !car) return;
    const barRect = bar.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const inset = 3;
    const raw  = (barRect.right - inset) - (carRect.left + 5);
    const maxW = barRect.width - inset * 2;
    gsap.set('.gradient-fill', { width: Math.max(0, Math.min(maxW, raw)) });
  }

  function startWheelSpin() {
    if (wheelTween) wheelTween.kill();
    wheelTween = gsap.to('.wheel', {
      rotation: '-=360', duration: 0.9, repeat: -1, ease: 'none', transformOrigin: '50% 50%'
    });
    gsap.to(wheelTween, { timeScale: 5, duration: 0.45, ease: 'power2.in' });
  }

  function stopWheelSpin() {
    if (wheelTween) { wheelTween.kill(); wheelTween = null; }
    gsap.set('.wheel', { rotation: 0 });
  }

  function slowThenStopWheels() {
    if (!wheelTween) return;
    gsap.to(wheelTween, {
      timeScale: 0.4, duration: 0.35, ease: 'power2.out',
      onComplete() {
        if (wheelTween) { wheelTween.kill(); wheelTween = null; }
        gsap.set('.wheel', { rotation: 0 });
      }
    });
  }

  function startCtaPulse() {
    if (ctaTween) ctaTween.kill();
    ctaTween = gsap.to('.cta', {
      scale: 1.06, duration: 0.75, repeat: -1, yoyo: true, ease: 'power1.inOut'
    });
  }

  function reattachStatsBox() {
    const box = document.querySelector('.stats-box');
    const car = document.querySelector('.carContainer');
    if (!box || !car || box.parentElement === car) return;
    car.appendChild(box);
    gsap.killTweensOf(box);
    gsap.set(box, { clearProps: 'all' });
  }

  function resetAll() {
    if (ctaTween)     { ctaTween.kill();     ctaTween     = null; }
    if (bobbingTween) { bobbingTween.kill(); bobbingTween = null; }
    stopWheelSpin();
    lastDisplayed = -1;
    reattachStatsBox();
    gsap.set('.carBody',                    { x: 0, y: 0, rotation: 0 });
    gsap.set('.carContainer',               { right: '-200px', top: '50%', x: 0, scale: 1, opacity: 1 });
    gsap.set('.bar',                        { top: '50%', left: '50%', xPercent: -50, yPercent: -50, width: '80%', x: 0, y: 0, opacity: 0 });
    gsap.set('.gradient-fill',              { width: 0 });
    gsap.set('.stats-box',                  { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, xPercent: -50, backgroundColor: '#6421A1', display: '' });
    gsap.set('.stats-number, .stats-label', { color: '#75FF08', scale: 1 });
    gsap.set('.logo',                       { left: '-150px', opacity: 0 });
    gsap.set('.bg-overlay',                 { translateY: '100%', scaleX: 0, opacity: 0 });
    gsap.set('.cta',                        { opacity: 0, scale: 1, rotation: 0, rotationY: 0, y: 0, clearProps: 'width,height,left,top,xPercent,yPercent' });
    gsap.set('.overline',                   { opacity: 0, y: 0 });
    gsap.set('.logo2',                      { opacity: 0, y: 0, clearProps: 'left,top,yPercent,width,height' });
    updateStats(0);
  }

  function buildTimeline() {
    resetAll();

    const counter = { value: 0 };
    const tl = gsap.timeline({ onComplete: buildTimeline });

    tl.call(startWheelSpin);
    tl.fromTo('.carContainer',
      { right: '-200px' },
      { right: '1.5%', duration: 1.4, ease: 'power3.out', onComplete: stopWheelSpin }
    );
    tl.fromTo('.bar',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    );
    tl.fromTo('.stats-box',
      { opacity: 0, y: 6, scale: 0.9, xPercent: -50, backgroundColor: '#6421A1' },
      { opacity: 1, y: 3, scale: 1,   xPercent: -50, backgroundColor: '#6421A1', duration: 0.6, ease: 'back.out(1.6)' },
      '<'
    );

    tl.call(syncGradient,   null, '+=0.1');
    tl.call(startWheelSpin, null, '+=0.1');
    tl.call(startBobbing,   null, '<');
    tl.to('.carContainer', {
      right: 'calc(60.8%)', duration: 3, ease: 'power1.out',
      onUpdate: syncGradient, onComplete: onCarArrived
    }, '<');
    tl.to(counter, {
      value: 16, duration: 3, ease: 'power1.out',
      onUpdate() { updateStats(Math.round(counter.value)); }
    }, '<');

    tl.addLabel('exit', '+=0.65');

    tl.call(() => {
      const box = document.querySelector('.stats-box');
      const car = document.querySelector('.carContainer');
      if (!box || !car || box.parentElement !== car) return;
      const rect = box.getBoundingClientRect();
      statsDims = { width: rect.width, height: rect.height };

      document.body.appendChild(box);
      gsap.killTweensOf(box);

      gsap.set(box, {
        clearProps: 'transform',
        position:  'fixed',
        left:       rect.left,
        top:        rect.top,
        width:      rect.width,
        height:     rect.height,
        margin:     0
      });

      const ovH        = document.querySelector('.overline').getBoundingClientRect().height || 28;
      const ctaWFlight = rect.width  * 1.3;
      const ctaHFlight = rect.height * 1.3;
      const logoW = 115, gap = 14, rowGap = 18;
      const groupTopFlight = window.innerHeight / 2 - (ovH + rowGap + ctaHFlight) / 2;
      const ctaTopFlight   = groupTopFlight + ovH + rowGap;
      const groupW  = logoW + gap + ctaWFlight;
      const ctaLeft = window.innerWidth / 2 - groupW / 2 + logoW + gap;
      const toLeft  = ctaLeft + ctaWFlight / 2 - rect.width  / 2;
      const toTop   = ctaTopFlight + ctaHFlight / 2 - rect.height / 2;

      gsap.to(box, {
        left:     toLeft,
        top:      toTop,
        rotation: 5,
        duration: 0.95,
        delay:    0.35,
        ease:     'sine.inOut'
      });
    }, null, 'exit');

    tl.to(['.bar', '.carContainer'],
      { x: '+=100vw', duration: 0.6, ease: 'power3.in', stagger: 0.06 },
      'exit'
    );

    tl.fromTo('.bg-overlay',
      { translateY: '100%', scaleX: 0, opacity: 0 },
      { translateY: '0%',   scaleX: 1, opacity: 1, duration: 0.85, ease: 'power3.out' },
      'exit+=0.2'
    );

    tl.addLabel('flipOut', 'exit+=1.3');

    tl.call(() => {
      const box = document.querySelector('.stats-box');
      gsap.to(box, {
        rotationY:            90,
        transformPerspective: 380,
        scale:                1.06,
        y:                    -12,
        duration:             0.22,
        ease:                 'power3.in'
      });
    }, null, 'flipOut');

    tl.addLabel('flyFlip', 'exit+=1.52');

    tl.call(() => {
      const box    = document.querySelector('.stats-box');
      const ctaW   = statsDims.width  * 1.3;
      const ctaH   = statsDims.height * 1.3;
      const logoW  = 115, gap = 14, rowGap = 18;

      const ovH      = document.querySelector('.overline').getBoundingClientRect().height || 28;
      const groupTop = window.innerHeight / 2 - (ovH + rowGap + ctaH) / 2;
      const ctaTop   = groupTop + ovH + rowGap;
      const ctaCY    = ctaTop + ctaH / 2;

      const groupW    = logoW + gap + ctaW;
      const groupLeft = window.innerWidth / 2 - groupW / 2;
      const logoLeft  = groupLeft;
      const ctaLeft   = groupLeft + logoW + gap;

      gsap.set('.overline', { top: groupTop });

      gsap.set(box, { display: 'none' });

      gsap.set('.logo2', {
        position: 'fixed',
        zIndex:    8,
        left:      logoLeft,
        top:       ctaCY,
        yPercent:  -50,
        width:     logoW,
        height:    'auto'
      });

      gsap.set('.cta', {
        position:             'fixed',
        zIndex:                8,
        left:                  ctaLeft,
        top:                   ctaTop,
        width:                 ctaW,
        height:                ctaH,
        rotation:               5,
        rotationY:             -90,
        transformPerspective:   380,
        scale:                  1.06,
        y:                     -12,
        opacity:                1
      });
      gsap.to('.cta', {
        rotationY: 0,
        rotation:  0,
        scale:     1,
        y:         0,
        duration:  0.52,
        ease:      'elastic.out(1, 0.6)'
      });
    }, null, 'flyFlip');

    tl.fromTo('.overline',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' },
      'flyFlip+=0.42'
    );
    tl.fromTo('.logo2',
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' },
      'flyFlip+=0.56'
    );
    tl.call(startCtaPulse, null, 'flyFlip+=0.86');

    tl.addLabel('hold',  'flyFlip+=2.2');
    tl.addLabel('bgOut', 'hold+=7');

    tl.to(['.cta', '.overline', '.logo2'],
      { opacity: 0, y: -6, stagger: 0.07, duration: 0.3, ease: 'power2.in' },
      'bgOut'
    );
    tl.to('.bg-overlay',
      { translateY: '110%', scaleX: 0.85, opacity: 0, duration: 0.75, ease: 'power2.in' },
      'bgOut+=0.2'
    );

    return tl;
  }

  buildTimeline();
});

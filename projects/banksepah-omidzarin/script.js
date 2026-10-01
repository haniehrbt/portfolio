window.addEventListener('load', function () {
  const cta = document.querySelector('.cta');
  cta.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });
  gsap.set('.slide2', {
    opacity: 0,
    y: 30,
    scale: 0.95,
  });
  gsap.set('.bg', { opacity: 0 });
  gsap.set('.left', { opacity: 0, x: -50 });
  gsap.set('.right', { opacity: 1, x: 0 });

  gsap.set('.mainLogo', { opacity: 0, scale: 0.5, y: -20 });
  gsap.set('.title', { opacity: 0, y: 20 });
  gsap.set('.overline1', { opacity: 0, scale: 0.8 });
  gsap.set('.line', { opacity: 0, scaleX: 0, transformOrigin: 'right center' });
  gsap.set('.overline2', { opacity: 0, scale: 0.8 });
  gsap.set('.cta', { opacity: 0, scale: 0.5, y: 10 });

  gsap.set('.logo', {
    opacity: 0,
    x: -30,
    scale: 0.8,
  });

  gsap.to('.motion', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    onComplete: function () {
      gsap.to('.logo', {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.2)',
      });
    },
  });

  setTimeout(function () {
    gsap.to('.slide1', {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.in',
      onComplete: function () {
        gsap.set('.slide1', { display: 'none' });
        animateSlide2();
      },
    });
  }, 3500);

  function animateSlide2() {
    gsap.to('.bg', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to('.slide2', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      onComplete: function () {
        animateLeftElements();
      },
    });
  }

  function animateLeftElements() {
    gsap.to('.left', {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'back.out(1.2)',
      onComplete: function () {
        startProductAnimations();
        animateRightElements();
      },
    });
  }

  function animateRightElements() {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.mainLogo', {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.4)',
    });

    tl.to(
      '.title',
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    tl.to(
      '.overline1',
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    tl.to(
      '.line',
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    tl.to(
      '.overline2',
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    tl.to(
      '.cta',
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.5)',
        onComplete: function () {
          gsap.to('.cta', {
            scale: 1.15,
            duration: 0.8,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
          });
        },
      },
      '-=0.2'
    );
  }

  function startProductAnimations() {
    gsap.set('.product1', { scale: 1.4 });
    gsap.to('.product1', {
      scale: 1.6,
      duration: 0.8,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    function createBlinkAnimation(selector) {
      const randomDelay = Math.random() * 3; // 0 to 3 seconds
      const randomDuration = 1 + Math.random() * 1.5; // 1 to 2.5 seconds
      const randomPause = 1.5 + Math.random() * 2; // 1.5 to 3.5 seconds

      gsap.set(selector, { opacity: 1 });

      const timeline = gsap.timeline({ repeat: -1, delay: randomDelay });
      timeline.to(selector, {
        opacity: 0,
        duration: randomDuration,
        ease: 'power1.inOut',
      });
      timeline.to(selector, {
        opacity: 1,
        duration: randomDuration,
        ease: 'power1.inOut',
      });
      timeline.to(selector, {
        opacity: 1,
        duration: randomPause,
        ease: 'none',
      });
    }

    for (let i = 2; i <= 9; i++) {
      createBlinkAnimation('.product' + i);
    }
  }
});

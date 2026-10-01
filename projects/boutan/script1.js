window.addEventListener('load', function () {
  const cta = document.querySelector('.cta');
  const audio = new Audio('./audio.mp3');
  const product = document.querySelector('.product');

  cta.addEventListener('click', function (e) {
    audio.play();
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });
  product.addEventListener('click', function (e) {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });

  const tl = gsap.timeline();

  tl.to('.product', {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out',
  })
    .to('.product', {
      y: -15,
      duration: 0.15,
      ease: 'power2.in',
    })
    .to('.product', {
      y: 8,
      duration: 0.15,
      ease: 'power2.out',
    })
    .to('.product', {
      y: -5,
      duration: 0.1,
      ease: 'power2.in',
    })
    .to('.product', {
      y: 0,
      duration: 0.1,
      ease: 'power2.out',
    });

  tl.to(
    '.bg',
    {
      width: '97%',
      opacity: 1,
      duration: 1.3,
      ease: 'power3.out',
    },
    0.8
  );

  tl.to(
    '.logo',
    {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.7,
      ease: 'back.out(1.7)',
    },
    '-=0.2'
  )
    .to(
      '.overline',
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.5'
    )
    .to(
      '.badge',
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.5)',
      },
      '-=0.4'
    )
    .to(
      '.badge',
      {
        y: -10,
        duration: 1.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      },
      '-=0.3'
    )
    .to(
      '.cta',
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      },
      '-=0.3'
    );
});

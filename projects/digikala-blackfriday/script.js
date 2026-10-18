document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('.intro');
  const logo = document.querySelector('.logo');
  const seventeen = document.querySelector('.seventeen');
  const overline = document.querySelector('.overline');
  const cta = document.querySelector('.cta');
  const percent = document.querySelector('.percent');
  const bg = document.querySelector('.bg');
  const banner = document.querySelector('.banner');
  const products = document.querySelector('.products');
  const audio = new Audio('boogh.m4a');
  intro.addEventListener('click', () => {
    audio.play();
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });
  cta.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });
  logo.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK3);
  });
  seventeen.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK4);
  });
  percent.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK4);
  });
  products.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK5);
  });

  gsap.to(intro, {
    duration: 11,
    right: '105%',
    ease: 'linear',
    onComplete: init,
  });

  function init() {
    const tl = gsap.timeline({});
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);

    tl.to(bg, {
      duration: 1,
      transform: 'scaleY(1)',
    });

    tl.to(banner, {
      duration: 1,
      opacity: 1,
      ease: 'linear',
    });
    tl.to(logo, {
      duration: 1,
      top: '10px',
      ease: 'linear',
    });

    tl.to(seventeen, {
      duration: 1,
      opacity: 1,
      top: 'calc(15vw + 20px)',
      ease: 'back.out(1.2)',
    });

    tl.to(percent, {
      top: '28px',
      duration: 1,
      ease: 'back.out(1.9)',
      onComplete: () => {
        setTimeout(final, 5000);
      },
    });
  }

  function final() {
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE03);
    gsap.to(banner, {
      opacity: 0,
      duration: 1,
    });
    gsap.to(percent, {
      duration: 1,
      top: '200px',
    });
    gsap.to(seventeen, {
      duration: 1,
      top: '200px',
    });

    gsap.to(cta, {
      duration: 1,
      bottom: '10px',
    });
    gsap.to(overline, {
      duration: 1,
      bottom: '35px',
    });

    gsap.to(logo, {
      duration: 1,
      right: '5%',
      width: '84.16px',
      left: 'initial',
      top: '30px',
      transform: 'initial',
    });

    gsap.to(products, {
      duration: 1,
      left: '5%',
      onComplete: () => {
        const star = document.querySelector('.star');
        setInterval(() => {
          star.style.opacity = 1;
          setTimeout(() => {
            star.style.opacity = 0;
          }, 500);
        }, 2000);
        setInterval(toggle, 11000);
        setTimeout(() => {
          fire_tag(ALL_EVENT_TYPES.LOOP);
          location.reload();
        }, 63000);
      },
    });
  }

  function toggle() {
    gsap.to(products, {
      duration: 1,
      left: '-100%',
    });
    gsap.to(percent, {
      delay: 1,
      duration: 1,
      top: 'initial',
      bottom: '-20px',
      left: '45%',
      width: '45%',
      ease: 'back.out(1.2)',
    });
    gsap.to(seventeen, {
      delay: 1,
      duration: 1,
      top: 'initial',
      bottom: '0',
      left: '25%',
      width: '25%',
      ease: 'back.out(1.2)',
    });

    setTimeout(() => {
      gsap.to(products, {
        duration: 1,
        left: '5%',
      });
      gsap.to(percent, {
        duration: 1,
        bottom: '-200px',
      });
      gsap.to(seventeen, {
        bottom: '-200px',
        duration: 1,
      });
    }, 5000);
  }
});

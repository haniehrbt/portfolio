document.addEventListener('DOMContentLoaded', function () {
  const bag = document.querySelector('.bag');
  const percent = document.querySelector('.percent');
  const bg = document.querySelector('.bg');
  const snapp = document.querySelector('.logo');
  const logo = document.querySelector('.snapp');
  const overline = document.querySelector('.overline');
  const cta = document.querySelector('.cta');
  let interval = null;

  bag.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });
  percent.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });
  logo.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK3);
  });
  cta.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK4);
  });
  snapp.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK5);
  });

  gsap.to(bag, {
    duration: 1,
    bottom: 0,
    onComplete: function () {
      setTimeout(init, 2000);
    },
  });

  function init() {
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
    gsap.to(bag, {
      left: '35%',
      bottom: '-20px',
      duration: 1,
      onComplete: function () {
        gsap.to(percent, {
          left: '-20px',
          duration: 1,
        });
        gsap.to(bg, {
          duration: 1,
          transform: 'scaleX(1)',
        });
        gsap.to(snapp, {
          duration: 1,
          delay: 2,
          bottom: '98px',
        });
        gsap.to(logo, {
          duration: 1,
          delay: 1,
          bottom: '98px',
        });
        gsap.to(overline, {
          duration: 1,
          delay: 1,
          opacity: 1,
        });
        gsap.to(cta, {
          duration: 1,
          delay: 1,
          opacity: 1,
        });

        interval = setInterval(toggle, 10000);
      },
    });
  }

  const fadeoutelements = [logo, snapp, overline, cta, bg];

  function toggle() {
    fadeoutelements.forEach((el) => {
      el.style.display = 'none';
    });
    gsap.to(percent, {
      duration: 1,
      left: '35%',
      transform: 'translateX(-50%)',
      onComplete: function () {
        percent.classList.add('tapesh2');
      },
    });
    gsap.to(bag, {
      duration: 1,
      left: '50%',
      scale: 1.2,
      bottom: '-10px',
    });

    setTimeout(() => {
      percent.classList.remove('tapesh2');
      gsap.to(percent, {
        duration: 1,
        left: '-20px',
        transform: 'translateX(0)',
        onComplete: function () {
          fadeoutelements.forEach((el) => {
            el.style.display = 'initial';
          });
        },
      });
      gsap.to(bag, {
        duration: 1,
        left: '35%',
        scale: 1,
        bottom: '-20px',
      });
    }, 5000);
  }
});

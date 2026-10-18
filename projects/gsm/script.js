document.addEventListener('DOMContentLoaded', function () {
  const logo = document.querySelector('.logo');
  const overline = document.querySelector('.overline');
  const tl = gsap.timeline();
  tl.to(logo, {
    bottom: '119px',
    duration: 1,
  });

  tl.to(overline, {
    duration: 1,
    transform: 'scaleX(1)',
  });

  setInterval(() => {
    gsap.fromTo(
      logo,
      {
        duration: 0,
        bottom: '50px',
      },
      {
        bottom: '119px',
        duration: 1,
      }
    );

    gsap.fromTo(
      overline,
      {
        duration: 0,
        transform: 'scaleX(0)',
      },
      {
        duration: 1,
        transform: 'scaleX(1)',
      }
    );
  }, 10000);
});

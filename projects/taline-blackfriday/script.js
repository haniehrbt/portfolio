document.addEventListener('DOMContentLoaded', function () {
  const logo = document.querySelector('.logo');
  const cta = document.querySelector('.cta');
  const overline = document.querySelector('.overline');
  const video = document.querySelector('.bg-video');
  const circle = document.querySelector('.circle');

  function startAnimations() {
    const tl = gsap.timeline();

    tl.to(circle, {
      left: -55,
      duration: 1,
      ease: 'power2.out',
    });

    tl.to(
      overline,
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '+=0.2'
    );

    tl.to(
      cta,
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(1.7)',
      },
      '-=0.4'
    );

    tl.to(
      logo,
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.3'
    );
  }

  function onVideoPlaying() {
    setTimeout(() => {
      startAnimations();
    }, 3000);
  }

  if (!video.paused) {
    onVideoPlaying();
  } else {
    video.addEventListener('playing', onVideoPlaying, { once: true });

    video.play().catch(() => {
      if (video.readyState >= 1) {
        video.play().then(() => {});
      } else {
        video.addEventListener('loadeddata', () => {
          video.play().then(() => {});
        });
      }
    });
  }
  cta.addEventListener('click', (event) => {
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });
});

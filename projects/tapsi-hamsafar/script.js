window.addEventListener('load', function () {
  const cta = document.querySelector('.cta');
  cta.addEventListener('click', (event) => {
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });
  gsap.set('.bg', {
    opacity: 0,
    y: 30,
    scale: 0.95,
  });

  gsap.set('video', {
    opacity: 0,
    x: -30,
    scale: 0.8,
  });

  gsap.set('.mainLogo', {
    opacity: 0,
    x: 30,
    scale: 0.8,
  });

  gsap.set('.right', {
    opacity: 0,
  });

  gsap.set('.overline1', {
    opacity: 0,
    y: 20,
  });

  gsap.set('.overline2', {
    opacity: 0,
    y: 20,
  });

  gsap.set('.cta', {
    opacity: 0,
    y: 20,
  });

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
    gsap.to('.logo', {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.in',
      onComplete: function () {
        gsap.set('.logo', { display: 'none' });
        gsap.to('.motion', {
          scale: 0.3,
          bottom: -30,
          transform: 'translate(-50%, 45%)',
          duration: 1,
          ease: 'power2.out',
        });
        gsap.set('.bg', { display: 'block' });
        gsap.to('.bg', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: function () {
            gsap.set('video', { display: 'block' });
            gsap.to('video', {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              ease: 'back.out(1.2)',
              onComplete: function () {
                gsap.set('.mainLogo', { display: 'block' });
                gsap.to('.mainLogo', {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  duration: 0.8,
                  ease: 'back.out(1.2)',
                  onComplete: function () {
                    gsap.set('.right', { display: 'flex' });
                    gsap.to('.right', {
                      opacity: 1,
                      duration: 0.5,
                      ease: 'power2.out',
                      onComplete: function () {
                        gsap.to('.overline1', {
                          opacity: 1,
                          y: 0,
                          duration: 0.6,
                          ease: 'power2.out',
                          onComplete: function () {
                            gsap.to('.overline2', {
                              opacity: 1,
                              y: 0,
                              duration: 0.6,
                              ease: 'power2.out',
                              onComplete: function () {
                                gsap.to('.cta', {
                                  opacity: 1,
                                  y: 0,
                                  duration: 0.6,
                                  ease: 'power2.out',
                                  onComplete: function () {
                                    gsap.to('.cta', {
                                      scale: 1.1,
                                      duration: 0.5,
                                      ease: 'power2.inOut',
                                      yoyo: true,
                                      repeat: -1,
                                    });
                                  },
                                });
                              },
                            });
                          },
                        });
                      },
                    });
                  },
                });
              },
            });
          },
        });
      },
    });
  }, 1000);

  setInterval(function () {
    // Fade out one by one
    gsap.to('.overline1', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: function () {
        gsap.set('.overline1', { y: 20 });

        gsap.to('.overline2', {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
          onComplete: function () {
            gsap.set('.overline2', { y: 20 });

            // Fade in one by one
            gsap.to('.overline1', {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              delay: 0.2,
              onComplete: function () {
                gsap.to('.overline2', {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: 'power2.out',
                  delay: 0.2,
                });
              },
            });
          },
        });
      },
    });
  }, 5000);
});

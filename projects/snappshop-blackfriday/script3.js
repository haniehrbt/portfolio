document.addEventListener('DOMContentLoaded', function () {
  const cta = document.querySelector('.cta');
  const leftContainer = document.querySelector('.left');
  const video = document.querySelector('.video');

  video.muted = true;
  video.play();

  cta.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK5);
  });

  let currentProductNum = 1;

  const VISIT_SLIDE_TAGS = [
    'VISIT_SLIDE01',
    'VISIT_SLIDE02',
    'VISIT_SLIDE03',
    'VISIT_SLIDE04',
  ];
  const CLICK_TAGS = ['CLICK1', 'CLICK2', 'CLICK3', 'CLICK4'];

  if (leftContainer) {
    leftContainer.addEventListener('click', function (event) {
      if (!event.target.closest('.cta') && event.target.closest('.product')) {
        const index = currentProductNum - 1;
        const tagKey = CLICK_TAGS[index];

        if (
          typeof fire_tag === 'function' &&
          typeof ALL_EVENT_TYPES === 'object' &&
          ALL_EVENT_TYPES[tagKey]
        ) {
          fire_tag(ALL_EVENT_TYPES[tagKey]);
        }
      }
    });
  }

  function flickerOff() {
    let flickerOffTimeline = gsap.timeline();
    flickerOffTimeline
      .to('.light', { opacity: 0.8, duration: 0.08 })
      .to('.light', { opacity: 1, duration: 0.08 })
      .to('.light', { opacity: 0.5, duration: 0.08 })
      .to('.light', { opacity: 0.9, duration: 0.08 })
      .to('.light', { opacity: 0.3, duration: 0.08 })
      .to('.light', { opacity: 0.7, duration: 0.08 })
      .to('.light', { opacity: 0.2, duration: 0.08 })
      .to('.light', { opacity: 0.6, duration: 0.08 })
      .to('.light', { opacity: 0.1, duration: 0.08 })
      .to('.light', { opacity: 0, duration: 0.3, ease: 'power2.in' });
    return flickerOffTimeline;
  }

  function flickerAndBrighten(productSelector) {
    let flickerTimeline = gsap.timeline();
    flickerTimeline
      .to('.light', { opacity: 0.3, duration: 0.08 })
      .to('.productContainer', { opacity: 0.3, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0.1)', duration: 0.08 }, '<')
      .to('.light', { opacity: 1, duration: 0.08 })
      .to('.productContainer', { opacity: 1, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0.3)', duration: 0.08 }, '<')
      .to('.light', { opacity: 0.2, duration: 0.08 })
      .to('.productContainer', { opacity: 0.2, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0)', duration: 0.08 }, '<')
      .to('.light', { opacity: 0.9, duration: 0.08 })
      .to('.productContainer', { opacity: 0.9, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0.5)', duration: 0.08 }, '<')
      .to('.light', { opacity: 0.1, duration: 0.08 })
      .to('.productContainer', { opacity: 0.1, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0)', duration: 0.08 }, '<')
      .to('.light', { opacity: 0.8, duration: 0.08 })
      .to('.productContainer', { opacity: 0.8, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0.4)', duration: 0.08 }, '<')
      .to('.light', { opacity: 0.4, duration: 0.08 })
      .to('.productContainer', { opacity: 0.4, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0)', duration: 0.08 }, '<')
      .to('.light', { opacity: 0.6, duration: 0.08 })
      .to('.productContainer', { opacity: 0.6, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0.2)', duration: 0.08 }, '<')
      .to('.light', { opacity: 0.3, duration: 0.08 })
      .to('.productContainer', { opacity: 0.3, duration: 0.08 }, '<')
      .to(productSelector, { filter: 'brightness(0)', duration: 0.08 }, '<')
      .to('.light', { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(
        '.productContainer',
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        '<'
      )
      .to(
        productSelector,
        { filter: 'brightness(1)', duration: 0.5, ease: 'power2.out' },
        '<'
      )
      .to(productSelector, { opacity: 1, duration: 0 }, '<')
      .to(
        '.bage',
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.3'
      )
      .call(function () {
        const productNum = productSelector.match(/\d+/)[0];
        const index = parseInt(productNum) - 1;
        const tagKey = VISIT_SLIDE_TAGS[index];

        if (
          typeof fire_tag === 'function' &&
          typeof ALL_EVENT_TYPES === 'object' &&
          ALL_EVENT_TYPES[tagKey]
        ) {
          fire_tag(ALL_EVENT_TYPES[tagKey]);
        }
      });

    return flickerTimeline;
  }

  function startProductCycle() {
    centerAndReturnProduct(
      '.product:nth-child(1)',
      '.product:nth-child(2)',
      function () {
        centerAndReturnProduct(
          '.product:nth-child(2)',
          '.product:nth-child(3)',
          function () {
            centerAndReturnProduct(
              '.product:nth-child(3)',
              '.product:nth-child(4)',
              function () {
                setTimeout(function () {
                  centerAndReturnProduct(
                    '.product:nth-child(4)',
                    '.product:nth-child(1)',
                    function () {
                      setTimeout(function () {
                        startProductCycle();
                      }, 3000);
                    }
                  );
                }, 3000);
              }
            );
          }
        );
      }
    );
  }

  function centerAndReturnProduct(currentProduct, nextProduct, onComplete) {
    let centerTimeline = gsap.timeline();

    centerTimeline
      .to('.bg', { opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.logo', { opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.right', { opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.video', { opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.light', { opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
      .to(
        '.left',
        {
          left: '50%',
          top: '50%',
          bottom: 'auto',
          xPercent: -50,
          yPercent: -50,
          scale: 1.05,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: function () {
            setTimeout(function () {
              let returnTimeline = gsap.timeline();

              returnTimeline
                .to(
                  '.left',
                  {
                    left: 0,
                    top: 'auto',
                    bottom: 0,
                    xPercent: 0,
                    yPercent: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                  },
                  0
                )
                .to(
                  '.bg',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.logo',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.right',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.video',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.stage',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.stageShadow',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.light',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.productShadow',
                  { opacity: 1, duration: 0.8, ease: 'power2.out' },
                  0.3
                )
                .to(
                  '.bage',
                  {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                  },
                  0.5
                )
                .add(flickerOff(), 1.2)
                .to(
                  currentProduct,
                  {
                    filter: 'brightness(0)',
                    duration: 0.6,
                    ease: 'power2.in',
                  },
                  1.2
                )
                .to(
                  currentProduct,
                  {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.in',
                  },
                  1.8
                )
                .to(
                  nextProduct,
                  {
                    opacity: 1,
                    filter: 'brightness(0)',
                    duration: 0.3,
                    ease: 'power2.out',
                  },
                  2.2
                )
                .call(
                  function () {
                    let productNum = nextProduct.match(/\d+/)[0];
                    currentProductNum = parseInt(productNum);

                    let bage = document.querySelector('.bage');
                    if (bage) {
                      bage.setAttribute('data-product', productNum);
                    }
                    setTimeout(function () {
                      flickerAndBrighten(nextProduct);
                      if (onComplete) {
                        setTimeout(onComplete, 3000);
                      }
                    }, 1000);
                  },
                  null,
                  1.8
                );
            }, 4000);
          },
        },
        0.2
      );

    return centerTimeline;
  }

  gsap.to('.bg', {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: function () {
      gsap.to('.logo', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.2,
        onComplete: function () {
          gsap.to('.title', {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 0.1,
          });

          gsap.to('.date', {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 0.3,
          });

          gsap.to('.offer', {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 0.5,
          });

          gsap.to('.cta', {
            x: 0,
            y: 5,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 0.7,
            onComplete: function () {
              gsap.to('.cta', {
                scale: 1.1,
                duration: 0.5,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true,
              });

              gsap.to('.video', {
                clipPath: 'inset(0 0% 0 0)',
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.3,
              });

              gsap.to('.stage', {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.5,
                onComplete: function () {
                  gsap.to('.stageShadow', {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    delay: 0.2,
                  });
                },
              });

              let lightTimeline = gsap.timeline({ delay: 1.3 });
              lightTimeline
                .add(flickerAndBrighten('.product:nth-child(1)'))
                .to(
                  '.bage',
                  { opacity: 1, duration: 0.4, ease: 'power2.out' },
                  '-=0.1'
                )
                .to(
                  '.bage',
                  {
                    y: 5,
                    x: 4,
                    duration: 1.5,
                    ease: 'power1.inOut',
                    repeat: -1,
                    yoyo: true,
                  },
                  '<0.3'
                )
                .call(function () {
                  setTimeout(function () {
                    startProductCycle();
                  }, 3000);
                });
            },
          });
        },
      });
    },
  });
});

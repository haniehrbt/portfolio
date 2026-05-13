document.addEventListener('DOMContentLoaded', function () {
  const cafe = document.querySelector('.cafe');
  const cafeFull = document.querySelector('.cafe-full');
  const cafeEmptyFront = document.querySelector('.cafe-empty-back');
  const cafeEmptyBack = document.querySelector('.cafe-empty-front');
  const smoke = document.querySelector('.smoke');
  const bg = document.querySelector('.bg');
  const bgFront = document.querySelector('.bg-front');
  const overline = document.querySelector('.overline');
  const logo = document.querySelector('.logo');
  const products = document.querySelectorAll('.product');
  const poodr = document.querySelector('.poodr');
  const cta = document.querySelector('.cta');

  const productX = document.querySelector('.productX');
  const hand = document.querySelector('.hand');

  const tl = gsap.timeline({});
  const firstDelay = 4;
  // const firstDelay = 0;
  tl.to(cafe, {
    delay: 1,
    bottom: '-5px',
    duration: 1,
    onComplete: function () {
      setTimeout(function () {
        gsap.to(cafeFull, {
          duration: 1,
          opacity: 0,
        });
        gsap.to(smoke, {
          duration: 1,
          opacity: 0,
        });
      }, firstDelay * 1000);
    },
  });

  tl.to(cafe, {
    delay: firstDelay,
    duration: 1,
    left: '5px',
    transform: 'translateX(0)',
  });

  tl.to(bg, {
    bottom: '0',
    duration: 1,
  });

  tl.to(bgFront, {
    bottom: '0',
    duration: 1,
    onComplete: function () {
      gsap.to(overline, {
        duration: 1,
        opacity: 1,
      });
      gsap.to(logo, {
        duration: 1,
        opacity: 1,
        onComplete: function () {
          pen_down();
        },
      });
    },
  });

  function pen_down() {
    const duration = 1;
    // const duration = 0;
    products.forEach((product) => {
      tl.to(product, {
        duration: duration,
        bottom: '0',
      });
    });
    setTimeout(
      function () {
        products.forEach((product) => {
          product.classList.add('tapesh');
          hand.classList.add('tapesh3');
          hand.style.opacity = '1';
          product.addEventListener('click', clickHandler);
        });
        setTimeout(function () {
          clickHandler(null);
        }, 10000);
      },
      products.length * duration * 1000
    );
  }

  let clicked = false;

  function clickHandler(e) {
    if (clicked) {
      return;
    }
    clicked = true;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      fire_tag(ALL_EVENT_TYPES.CLICK1);
    }
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
    productX.style.opacity = 1;
    products.forEach((product) => {
      product.classList.remove('tapesh');
      hand.style.opacity = '0';
    });
    gsap.to(productX, {
      left: '125px',
      bottom: '60px',
      duration: 1,
      right: 'initial',
      rotate: '-75deg',
    });
    gsap.to(poodr, {
      delay: 0.6,
      duration: 1,
      clipPath: 'inset(0 0 0% 0)',
      onComplete: function () {
        gsap.to(cafeFull, {
          opacity: 1,
          duration: 0.8,
          onComplete: function () {
            smoke.style.opacity = 1;
          },
        });
        gsap.to(poodr, {
          duration: 1,
          clipPath: 'inset(100% 0 0 0)',
          onComplete: function () {
            gsap.to(productX, {
              left: '65%',
              bottom: '0px',
              duration: 1,
              zIndex: 0,
              rotate: '0deg',
              onComplete: function () {
                productX.remove();
                gsap.to(cta, {
                  opacity: 1,
                  duration: 0.5,
                  onComplete: function () {
                    setTimeout(() => {
                      location.reload();
                    }, 10000);
                  },
                });
              },
            });
          },
        });
      },
    });
  }

  cafe.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });

  cta.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK3);
  });
});

const intro = document.querySelector('.intro');
const slide2 = document.querySelector('.slide2');

let slide2Initialized = false;

function showSlide2() {
  if (slide2Initialized) return;
  slide2Initialized = true;

  const logo = document.querySelector('.logo');
  const cta = document.querySelector('.cta');
  const stick = document.querySelector('.stick');
  const products = document.querySelectorAll('.product');
  const overlines = document.querySelectorAll('.overline, .overline1');
  const offer = document.querySelector('.offer');
  const stage = document.querySelector('.stage');
  let counter = 0;
  let isShowingProducts = false;

  if (stage) {
    gsap.set(stage, { opacity: 1 });
  }

  products.forEach((product) => {
    const isProduct2 = product.classList.contains('product2');
    const transformValue = isProduct2 ? 'translateX(-15px)' : 'none';

    gsap.set(product, {
      bottom: '20px',
      opacity: 0,
      left: '38px',
      transform: transformValue,
    });
  });

  gsap.set(overlines, { right: '-200px', opacity: 0 });

  overlines.forEach((overline, index) => {
    gsap.to(overline, {
      right: '15px',
      opacity: 1,
      duration: 0.8,
      delay: index * 0.2,
      ease: 'power2.out',
    });
  });

  gsap.to(offer, {
    opacity: 1,
    duration: 0.5,
    delay: 0.5,
  });

  gsap.to(offer, {
    filter:
      'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))',
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut',
  });

  gsap.to(logo, {
    duration: 1,
    bottom: '105px',
    onComplete: () => {
      if (stick) {
        gsap.to(stick, {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            cta.classList.add('tapesh');
            gsap.to(cta, {
              opacity: 1,
              duration: 1,
              onComplete: () => {
                intervalHandler();
                setInterval(intervalHandler, 3000);
              },
            });
          },
        });
      } else {
        cta.classList.add('tapesh');
        gsap.to(cta, {
          opacity: 1,
          duration: 1,
          onComplete: () => {
            intervalHandler();
            setInterval(intervalHandler, 3000);
          },
        });
      }
    },
  });

  function intervalHandler() {
    if (stick) {
      stick.classList.remove('stick-magic');
      void stick.offsetWidth;
      stick.classList.add('stick-magic');
    }

    const tl = gsap.timeline();

    const visibleProducts = [];
    products.forEach((product) => {
      const currentOpacity = gsap.getProperty(product, 'opacity') || 0;
      if (currentOpacity > 0) {
        visibleProducts.push(product);
      }
    });

    if (visibleProducts.length > 0) {
      visibleProducts.forEach((product) => {
        tl.to(
          product,
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          0
        );
      });
    }

    const currentProduct = products[counter];
    const isProduct2 = currentProduct.classList.contains('product2');
    const transformValue = isProduct2 ? 'translateX(-15px)' : 'none';

    const isFirstProduct = visibleProducts.length === 0;

    if (isFirstProduct) {
      gsap.set(currentProduct, {
        top: '-150px',
        bottom: 'auto',
        opacity: 1,
        left: '38px',
        transform: transformValue,
      });

      tl.to(currentProduct, {
        top: 'auto',
        bottom: '20px',
        duration: 0.5,
        ease: 'power2.in',
        onStart: () => {
          fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE01);
          isShowingProducts = true;
        },
      });

      tl.to(currentProduct, {
        y: '+=10',
        duration: 0.1,
        ease: 'power2.out',
      });

      tl.to(currentProduct, {
        y: 0,
        duration: 0.2,
        ease: 'bounce.out',
        onComplete: () => {
          counter = (counter + 1) % products.length;
        },
      });
    } else {
      gsap.set(currentProduct, {
        bottom: '20px',
        opacity: 0,
        left: '38px',
        transform: transformValue,
      });

      tl.to(
        currentProduct,
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          onStart: () => {
            if (counter === 1) {
              fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
            } else if (counter === 2) {
              fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE03);
            } else if (counter === 3) {
              fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE04);
            }
            isShowingProducts = true;
          },
          onComplete: () => {
            counter = (counter + 1) % products.length;
          },
        },
        '-=0.3'
      );
    }
  }

  cta.addEventListener('click', function (e) {
    if (!isShowingProducts) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  logo.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });

  products.forEach((product, index) => {
    product.addEventListener('click', function () {
      if (index === 0) {
        fire_tag(ALL_EVENT_TYPES.CLICK3);
      } else if (index === 1) {
        fire_tag(ALL_EVENT_TYPES.CLICK4);
      } else if (index === 2) {
        fire_tag(ALL_EVENT_TYPES.CLICK5);
      }
    });
  });
}

gsap.set('.intro', { left: '-100%' });
gsap.set('.guitar', { top: '-200px', left: '50%', x: '-50%', y: 0 });
gsap.set('.rightlogo', { right: '-100px' });
gsap.set('.slide2', { opacity: 0, pointerEvents: 'none' });

const tl = gsap.timeline();

tl.to('.guitar', {
  top: '50%',
  x: '-50%',
  y: '-50%',
  duration: 0.5,
  ease: 'power2.in',
});

tl.to('.guitar', {
  y: '-35%',
  duration: 0.15,
  ease: 'power2.out',
});

tl.to('.guitar', {
  y: '-50%',
  duration: 0.3,
  ease: 'bounce.out',
});

tl.to('.intro', {
  left: 0,
  duration: 0.8,
  ease: 'power2.out',
});

tl.to('.rightlogo', {
  right: 0,
  duration: 0.8,
  ease: 'power2.out',
  onComplete: () => {
    setTimeout(() => {
      gsap.to('.guitar', {
        scale: 0.5,
        top: 'auto',
        right: '95px',
        left: 'auto',
        zIndex: '5',
        x: 0,
        y: -35,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set('.slide2', { pointerEvents: 'auto' });
          gsap.to('.slide2', {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          });

          showSlide2();
        },
      });
      gsap.to('.intro', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.to('.rightlogo', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }, 1000);
  },
});

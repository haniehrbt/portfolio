document.addEventListener('DOMContentLoaded', function () {
  const contentElement = document.querySelector('.content');
  const contentScrollHeight = contentElement.scrollHeight;
  const itemsCount = Math.round(contentScrollHeight / 150) + 1;
  let currentSlideNumber = 0;

  const man = document.querySelector('.man');
  const hundred = document.querySelector('.hundred');
  const cloud = document.querySelector('.cloud');
  const products = document.querySelectorAll('.product');
  const overlines = document.querySelectorAll('.overline');
  const yellows = document.querySelectorAll('.overline-yellow');
  let slide2 = false;
  gsap.to(hundred, {
    right: '8%',
    duration: 1,
    onComplete: function () {
      man.src = `${man.src}`;
      man.style.opacity = 1;
      gsap.to(man, {
        left: '-15%',
        duration: 1.5,
      });
      gsap.to(cloud, {
        scale: 1,
        duration: 0.5,
        delay: 1,
      });
      setTimeout(function () {
        const duration = 1;
        gsap.to(man, { opacity: 0, duration: duration });
        gsap.to(hundred, { opacity: 0, duration: duration });
        gsap.to(cloud, { opacity: 0, duration: duration });
        goToSlide2();
      }, 7000);
    },
  });

  function goToSlide2() {
    slide2 = true;
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
    products.forEach((product) => {
      gsap.to(product, {
        left: '9px',
        duration: 1,
      });
      product.play();
    });

    gsap.to('.bg', {
      right: '9px',
      duration: 1,
      delay: 1,
      onComplete: function () {
        gsap.to('.logo', {
          bottom: '110px',
          duration: 1,
        });
        gsap.to('.cta', {
          opacity: '1',
          duration: 1,
        });
        gsap.to([overlines[currentSlideNumber]], {
          opacity: '1',
          duration: 1,
          onComplete: function () {
            gsap.to(yellows[currentSlideNumber], {
              opacity: 1,
              duration: 1,
            });
            setTimeout(function () {
              function goDown(elem) {
                gsap.to(elem, {
                  bottom: '-200px',
                  top: '200px',
                  duration: 1,
                });
              }

              products.forEach((product) => {
                goDown(product);
              });

              overlines.forEach((product) => {
                goDown(product);
              });

              yellows.forEach((product) => {
                goDown(product);
              });
              goDown(document.querySelector('.cta'));
              goDown(document.querySelector('.logo'));
              goDown(document.querySelector('.bg'));
              setTimeout(function () {
                location.reload();
              }, 1000);
            }, 20000);
          },
        });
      },
    });
  }

  window.addEventListener('message', (e) => {
    if (e.data.type !== 'yn-window-scroll') {
      return;
    }
    handleScroll(e.data.scrolled, e.data.scrolledInPx, e.data.heightOfPage);
  });

  function handleProduct(currentNumber, NextNumber) {
    gsap.to(products[currentNumber % products.length], {
      duration: 1,
      opacity: 0,
    });
    gsap.to(products[NextNumber], {
      duration: 1,
      opacity: 1,
    });
    gsap.to(overlines[currentNumber % products.length], {
      duration: 1,
      opacity: 0,
    });
    gsap.to(overlines[NextNumber], {
      duration: 1,
      opacity: 1,
    });

    gsap.to(yellows[currentNumber % products.length], {
      duration: 1,
      opacity: 0,
    });
    gsap.to(yellows[NextNumber], {
      duration: 1,
      opacity: 1,
    });
  }

  function handleScroll(percent, scrollPx, heightOfPage) {
    const withPercent = heightOfPage < 3500;
    let newSlideNumber = withPercent
      ? Math.round((percent / 300) * (itemsCount - 1))
      : Math.trunc(scrollPx / 500);

    newSlideNumber %= products.length;
    if (newSlideNumber === currentSlideNumber) {
      return;
    }
    if (slide2) {
      handleProduct(currentSlideNumber, newSlideNumber);
    }
    currentSlideNumber = newSlideNumber;
  }

  window.addEventListener('message', (e) => {
    if (e.data.type !== 'yn-window-scroll') {
      return;
    }
    handleScroll(e.data.scrolled, e.data.scrolledInPx, e.data.heightOfPage);
  });

  hundred.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });

  man.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });
  document.querySelector('.cta').addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK3);
  });
  document.querySelector('.logo').addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK4);
  });
});

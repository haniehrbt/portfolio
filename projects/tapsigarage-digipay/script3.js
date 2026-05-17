document.addEventListener('DOMContentLoaded', function () {
  const contentElement = document.querySelector('.content');
  const contentScrollHeight = contentElement.scrollHeight;
  const itemsCount = Math.round(contentScrollHeight / 150) + 1;
  let currentSlideNumber = 0;
  const products = document.querySelectorAll('.product');
  const overlines = document.querySelectorAll('.overline');
  const garage = document.querySelector('.garage');
  const kerkere = document.querySelector('.kerkere');
  const video = document.querySelector('.video');
  const bg = document.querySelector('.bg');
  const logo = document.querySelector('.logo');
  const cta = document.querySelector('.cta');

  fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE01);

  cta.addEventListener('click', (event) => {
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });

  function startKerkere() {
    gsap.to(kerkere, {
      delay: 1,
      bottom: '105px',
      duration: 2,
    });
    video.play();

    setTimeout(() => {
      gsap.to(garage, {
        duration: 1,
        left: '2%',
        transform: 'translate(0,-50%)',
        onComplete: () => {
          handleInterval();
          cycleInterval = setInterval(handleInterval, 4000);
        },
      });

      gsap.to(bg, {
        right: '2%',
        left: 'initial',
        opacity: 1,
        transform: 'translate(0, -50%)',
        duration: 1,
      });

      gsap.to(logo, {
        duration: 1,
        bottom: 'initial',
        top: '35%',
        opacity: 1,
        transform: 'translate(10%, -100%)',
      });

      setTimeout(() => {
        location.reload();
      }, 16000);
    }, 3000);
  }

  function handleInterval() {
    const next =
      currentSlideNumber === products.length - 1 ? 0 : currentSlideNumber + 1;
    handleProduct(currentSlideNumber, next);
    console.log(currentSlideNumber, next);
    currentSlideNumber = next;
  }

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
  }

  setTimeout(startKerkere, 4000);

  let cycleInterval = null;
  let scrollStarted = false;

  window.addEventListener('message', (e) => {
    if (e.data.type !== 'yn-window-scroll') return;
    if (!scrollStarted) {
      scrollStarted = true;
      clearInterval(cycleInterval);
    }
    const scrollPx = e.data.scrolledInPx;
    const newSlide = Math.trunc(scrollPx / 200) % products.length;
    if (newSlide === currentSlideNumber) return;
    handleProduct(currentSlideNumber, newSlide);
    currentSlideNumber = newSlide;
  });
});

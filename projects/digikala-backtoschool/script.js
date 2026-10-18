document.addEventListener('DOMContentLoaded', () => {
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const rightButton = document.querySelector('.right-button');
  const leftButton = document.querySelector('.left-button');
  const products = Array.from(document.querySelectorAll('.product'));
  const magnetContainer = document.querySelector('.magnetContainer');
  const slide1 = document.querySelector('.slide1');
  const slide2 = document.querySelector('.slide2');
  const attach = document.querySelector('.attach');
  const productCount = products.length;
  let isAnimating = false;
  const cta = document.querySelector('.cta');
  const magnetProduct = document.querySelector('.grouppProducts');

  cta.addEventListener('click', (e) => {
    fire_tag(ALL_EVENT_TYPES.CLICK_CTA);
  });

  magnetProduct.addEventListener('click', (e) => {
    fire_tag(ALL_EVENT_TYPES.CLICK_MAGNET);
  });

  const pulseTimeline = gsap.timeline({ repeat: -1, yoyo: true });
  products.forEach((p) => {
    pulseTimeline.to(p, { scale: 1.05, duration: 0.5 }, 0);
  });

  const destinations = [
    { left: -23, top: -6 },
    { left: 135, top: 15 },
    { left: 78, top: 14 },
    { left: 60, top: -10 },
    { left: 28, top: 15 },
    { left: 20, top: -20 },
    { left: 85, top: -5 },
    { left: 120, top: -20 },
  ];

  let selectedCount = 0;
  let autoSelectTimeout = null;
  let noClickTimeout = null;

  noClickTimeout = setTimeout(() => {
    autoSelectAll();
    fire_tag(ALL_EVENT_TYPES.CLICK_AUTOPLAY);
  }, 9000);

  function autoSelectAll() {
    pulseTimeline.kill();

    products.forEach((p, i) => {
      if (p.dataset.gray !== 'true') {
        setTimeout(() => {
          p.dataset.gray = 'true';
          p.style.filter = 'grayscale(100%)';
          p.style.pointerEvents = 'none';

          const img2 = p.querySelector('img:not(.stage)');
          const rect2 = img2.getBoundingClientRect();
          const magnetRect = magnetContainer.getBoundingClientRect();

          const flying = img2.cloneNode(true);
          flying.style.position = 'absolute';
          flying.style.top = rect2.top - magnetRect.top + 'px';
          flying.style.left = rect2.left - magnetRect.left + 'px';
          flying.style.width = rect2.width + 'px';
          flying.style.height = rect2.height + 'px';
          flying.style.zIndex = 1900;
          flying.style.pointerEvents = 'none';
          flying.style.transform = 'scale(1)';
          flying.style.transformOrigin = 'center center';
          magnetContainer.appendChild(flying);

          const destAuto = destinations[Number(p.dataset.index)];
          const scaleValue = productScales[i];

          gsap.to(flying, {
            duration: 1.5,
            top: destAuto.top + 'px',
            left: destAuto.left + 'px',
            rotation: 25,
            scale: scaleValue,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.to(flying, {
                y: '+=3',
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            },
          });
        }, i * 100);
      }
    });

    setTimeout(
      () => {
        goToSlide2();
        fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
      },
      products.length * 100 + 2000
    );
  }

  function goToSlide2() {
    gsap.to(slide1, {
      x: '-100%',
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
    });

    gsap.fromTo(
      slide2,
      { x: '-100%' },
      { x: '0%', duration: 1, ease: 'power2.inOut' }
    );

    gsap.fromTo(
      attach,
      { y: '-100px', opacity: 0 },
      { y: '0px', opacity: 1, duration: 1, ease: 'bounce.out', delay: 1 }
    );
  }

  products.forEach((product, index) => {
    product.style.cursor = 'pointer';
    product.dataset.gray = 'false';
    product.dataset.index = index;

    product.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fire_tag(ALL_EVENT_TYPES.CLICK_PRODUCT);

      if (product.dataset.gray === 'true') return;

      clearTimeout(noClickTimeout);
      clearTimeout(autoSelectTimeout);

      selectedCount++;
      product.classList.add('selected');
      product.style.filter = 'grayscale(100%)';
      product.dataset.gray = 'true';
      product.style.pointerEvents = 'none';

      flyToMagnet(product, index);

      if (selectedCount < 2) {
        autoSelectTimeout = setTimeout(() => {
          autoSelectAll();
        }, 2000);
      }

      if (selectedCount >= 2) {
        autoSelectAll();
      }
    });
  });

  const productScales = [1.2, 0.9, 1, 0.5, 0.8, 0.8, 0.5, 0.7];

  function flyToMagnet(product, index) {
    const productImg = product.querySelector('img:not(.stage)');
    const rect = productImg.getBoundingClientRect();
    const magnetRect = magnetContainer.getBoundingClientRect();

    const flyingClone = productImg.cloneNode(true);
    flyingClone.style.position = 'absolute';
    flyingClone.style.top = rect.top - magnetRect.top + 'px';
    flyingClone.style.left = rect.left - magnetRect.left + 'px';
    flyingClone.style.width = rect.width + 'px';
    flyingClone.style.height = rect.height + 'px';
    flyingClone.style.zIndex = 1000;
    flyingClone.style.pointerEvents = 'none';
    flyingClone.style.transform = 'scale(1)';
    flyingClone.style.transformOrigin = 'center center';
    magnetContainer.appendChild(flyingClone);

    const dest = destinations[index];
    const scaleValue = productScales[index];

    const tl = gsap.timeline();
    tl.to(flyingClone, {
      duration: 0.3,
      top: dest.top + 'px',
      left: dest.left + 'px',
      rotation: 25,
      scale: scaleValue,
      ease: 'power2.inOut',
    }).to(flyingClone, {
      duration: 0.5,
      y: '+=3',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  function shiftCarousel(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const product = products[0];
    const productWidth =
      product.offsetWidth + parseFloat(getComputedStyle(product).marginRight);
    const duration = 0.8;
    const easeType = 'power2.out';

    if (direction === 'next') {
      // Create a smooth slide animation
      gsap.to(carouselWrapper, {
        x: `-=${productWidth}px`,
        duration: duration,
        ease: easeType,
        onComplete: () => {
          const first = carouselWrapper.firstElementChild;
          carouselWrapper.appendChild(first);

          gsap.set(carouselWrapper, { x: 0 });
          isAnimating = false;
        },
      });
    } else {
      const last = carouselWrapper.lastElementChild;

      gsap.set(carouselWrapper, { x: `-${productWidth}px` });

      carouselWrapper.insertBefore(last, carouselWrapper.firstElementChild);

      gsap.to(carouselWrapper, {
        x: 0,
        duration: duration,
        ease: easeType,
        onComplete: () => {
          isAnimating = false;
        },
      });
    }
  }

  function handleCarouselClick(direction) {
    if (isAnimating) return; // Prevent multiple clicks during animation

    shiftCarousel(direction);
    clearTimeout(autoSelectTimeout);
    if (selectedCount < 2) {
      autoSelectTimeout = setTimeout(() => {
        autoSelectAll();
      }, 5000);
    }
  }

  rightButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCarouselClick('next');
    fire_tag(ALL_EVENT_TYPES.CLICK_SLIDER);
  });

  leftButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCarouselClick('prev');
    fire_tag(ALL_EVENT_TYPES.CLICK_SLIDER);
  });

  window.addEventListener('resize', () => {
    gsap.set(carouselWrapper, { x: 0 });
  });

  setTimeout(() => {
    fire_tag(ALL_EVENT_TYPES.LOOP);
    location.reload();
  }, 60000);
});

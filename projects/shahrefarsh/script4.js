document.addEventListener('DOMContentLoaded', function () {
  const tower = document.querySelector('.tower');
  const productImgs = document.querySelectorAll('.productimg');
  const leftBanner = document.querySelector('.leftBanner');
  const rightBanner = document.querySelector('.rightBanner');

  const bg = document.querySelector('.bg');
  const bgVideo = document.querySelector('.bg-video');
  const product = document.querySelector('.product');
  const logoImage = document.querySelector('.logo-image');
  const cta = document.querySelector('.cta');
  const ctaLogo = document.querySelector('.cta-logo');
  const badgeSlide2 = document.querySelector('.bageslide2');

  cta.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK5);
  });
  ctaLogo.addEventListener('click', function () {
    fire_tag(ALL_EVENT_TYPES.CLICK6);
  });

  const VISIT_TAGS = [
    ALL_EVENT_TYPES.VISIT_SLIDE01,
    ALL_EVENT_TYPES.VISIT_SLIDE02,
    ALL_EVENT_TYPES.VISIT_SLIDE03,
    ALL_EVENT_TYPES.VISIT_SLIDE04,
  ];

  const PRODUCT_CLICK_TAGS = [
    ALL_EVENT_TYPES.CLICK1,
    ALL_EVENT_TYPES.CLICK2,
    ALL_EVENT_TYPES.CLICK3,
    ALL_EVENT_TYPES.CLICK4,
  ];

  if (product) {
    product.addEventListener('click', function () {
      fire_tag(PRODUCT_CLICK_TAGS[currentProductIndex], {
        product_index: currentProductIndex + 1,
      });
    });
  }

  let currentProductIndex = 0;
  const productImages = [
    'product1.gif',
    'product2-1.gif',
    'product3.gif',
    'product4.gif',
  ];

  function setVideoHeight() {
    if (bg && bgVideo) {
      const bgHeight = bg.offsetHeight;
      bgVideo.style.height = bgHeight + 'px';
    }
  }

  function setLogoAndCtaPosition() {
    if (!bg) return;

    if (logoImage) {
      logoImage.style.bottom = '-15px';
      logoImage.style.right = '8px';
    }

    if (ctaLogo) {
      ctaLogo.style.bottom = '12px';
      ctaLogo.style.right = '-15px';
      ctaLogo.style.opacity = '1';
    }
  }

  const masterTimeline = gsap.timeline();

  if (tower) {
    gsap.set(tower, {
      y: 100,
      opacity: 0,
    });

    masterTimeline.to(tower, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  if (productImgs && productImgs.length > 0) {
    productImgs.forEach(function (img, index) {
      gsap.set(img, {
        opacity: 0,
        y: 30,
        scale: 0.8,
      });

      masterTimeline.to(
        img,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
        },
        '-=0.2'
      );
    });
  }

  if (leftBanner && rightBanner) {
    gsap.set(leftBanner, {
      x: -200,
      opacity: 0,
    });

    gsap.set(rightBanner, {
      x: 200,
      opacity: 0,
    });

    if (cta) {
      gsap.set(cta, {
        x: -200,
        opacity: 0,
      });
    }

    masterTimeline.to(
      [leftBanner, rightBanner, cta].filter(Boolean),
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      },
      '-=0.3'
    );
  }

  const slide1 = document.querySelector('.slide1');
  const bgContainer = document.querySelector('.bgContainer');
  const leftContainer = document.querySelector('.leftContainer');

  setTimeout(function () {
    if (slide1) {
      gsap.to(slide1, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: function () {
          slide1.style.display = 'none';
        },
      });
    }

    if (bgContainer && leftContainer) {
      bgContainer.style.display = 'block';
      leftContainer.style.display = 'block';

      gsap.set([bgContainer, leftContainer], {
        opacity: 0,
      });

      gsap.to([bgContainer, leftContainer], {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: function () {
          if (bgVideo) {
            setVideoHeight();
            setLogoAndCtaPosition();
            bgVideo.play().catch(function (error) {
              console.log('Video autoplay prevented:', error);
            });
          }

          const emptyCircle = document.querySelector('.emptyCircle');
          if (emptyCircle) {
            emptyCircle.style.zIndex = '10';
          }

          if (badgeSlide2) {
            const badgeCircle = document.querySelector('.badgeCircle');
            if (badgeCircle) {
              badgeCircle.style.zIndex = '99998';
              badgeSlide2.style.zIndex = '99999';

              gsap.set(badgeCircle, {
                opacity: 0,
                scale: 0.5,
                rotation: -180,
              });

              gsap.to(badgeCircle, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: 'back.out(2)',
                delay: 0.3,
              });
            }
          }
        },
      });
    }
  }, 7000);

  if (bgVideo) {
    if (bg) {
      bg.addEventListener('load', function () {
        if (bgContainer && bgContainer.style.display !== 'none') {
          setVideoHeight();
          setLogoAndCtaPosition();
        }
      });
    }

    bgVideo.addEventListener('loadeddata', function () {
      if (bgContainer && bgContainer.style.display !== 'none') {
        setVideoHeight();
        setLogoAndCtaPosition();
        bgVideo.play().catch(function (error) {
          console.log('Video autoplay prevented:', error);
        });
      }
    });

    window.addEventListener('resize', function () {
      if (bgContainer && bgContainer.style.display !== 'none') {
        setVideoHeight();
        setLogoAndCtaPosition();
      }
    });
  }

  if (product) {
    product.classList.add('product1');

    gsap.set(product, {
      opacity: 0,
      scale: 0.8,
      y: 40,
      x: -95,
    });

    gsap.to(product, {
      opacity: 1,
      y: -10,
      x: -90,
      scale: 0.8,
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 0.5,
    });

    product.style.height = '180px';
  }

  if (logoImage) {
    gsap.set(logoImage, {
      opacity: 0,
      scale: 0.5,
    });

    gsap.to(logoImage, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(2)',
      delay: 0.4,
    });
  }

  if (cta) {
    gsap.set(cta, {
      opacity: 0,
      scale: 0.5,
    });

    gsap.to(cta, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(2)',
      delay: 0.6,
    });
  }

  function changeProduct(nextIndex, prevIndex) {
    if (!product) return;

    const nextProductSrc = productImages[nextIndex];
    const prevIdx = prevIndex !== undefined ? prevIndex : currentProductIndex;

    const scaleValue =
      nextIndex === 0
        ? 1.1
        : nextIndex === 3
          ? 1.3
          : nextIndex === 2
            ? 1.0
            : 1.2;
    const xValue =
      nextIndex === 0
        ? -105
        : nextIndex === 3
          ? -10
          : nextIndex === 2
            ? -55
            : -60;
    const yValue =
      nextIndex === 0 ? -13 : nextIndex === 3 ? -25 : nextIndex === 2 ? 5 : -10;

    const img = new Image();
    img.onload = function () {
      const currentX = parseFloat(gsap.getProperty(product, 'x')) || 0;
      const currentY = parseFloat(gsap.getProperty(product, 'y')) || 0;
      const currentScale = parseFloat(gsap.getProperty(product, 'scale')) || 1;

      const tl = gsap.timeline();

      tl.set(product, {
        x: currentX,
        y: currentY,
        scale: currentScale,
      })
        .to(product, {
          opacity: 0,
          duration: 0.15,
          ease: 'power2.in',
          onUpdate: function () {
            gsap.set(product, {
              x: currentX,
              y: currentY,
              scale: currentScale,
            });
          },
          onComplete: function () {
            gsap.set(product, {
              x: currentX,
              y: currentY,
              scale: currentScale,
            });
          },
        })
        .call(function () {
          product.classList.remove(
            'product1',
            'product2',
            'product3',
            'product4'
          );
          product.classList.add('product' + (nextIndex + 1));
          product.src = nextProductSrc;

          if (nextIndex === 0) {
            product.style.height = '180px';
          } else if (nextIndex === 3) {
            product.style.height = '180px';
          } else {
            product.style.height = '150px';
          }

          gsap.set(product, {
            scale: scaleValue,
            x: xValue,
            y: yValue,
            opacity: 0,
          });
        })
        .to(product, {
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out',
          delay: 0.05,
          onComplete: function () {
            fire_tag(VISIT_TAGS[nextIndex], { product_index: nextIndex + 1 });
          },
        });
    };
    img.src = nextProductSrc;
  }

  function switchToNext() {
    const prevIndex = currentProductIndex;
    currentProductIndex = (currentProductIndex + 1) % 4;
    changeProduct(currentProductIndex, prevIndex);
  }

  setTimeout(function () {
    switchToNext();

    setInterval(function () {
      switchToNext();
    }, 4800);
  }, 4800);
});

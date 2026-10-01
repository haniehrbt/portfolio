document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    fire_tag(ALL_EVENT_TYPES.LOOP);
    location.reload();
  }, 45000);

  const bg = document.querySelector('.bg');
  const bag = document.querySelector('.bag');
  const notif = document.querySelector('.notif');
  const bgBoxes = document.querySelectorAll('.bgBox');
  const bgProducts = document.querySelectorAll(
    '.bgProductLeft, .bgProductRight'
  );

  const slide2 = document.querySelector('.slide2');

  let notifShownCount = 0;
  let maxNotifShows = 3;
  let notifInterval;
  let hasClicked = false;
  let clickCount = 0;
  let autoAnimateTimer = null;
  let slide2Shown = false;

  const customPaths = {
    product1: {
      startOffsetX: 0,
      startOffsetY: -5,
      endOffsetX: 15,
      endOffsetY: 0,
      arcHeight: 115,
      arcOffsetX: 5,
      arcOffsetY: 0,
      duration: 1.1,
    },
    product2: {
      startOffsetX: -90,
      startOffsetY: 0,
      endOffsetX: -40,
      endOffsetY: 0,
      arcHeight: 130,
      arcOffsetX: 0,
      arcOffsetY: 0,
      duration: 1.1,
    },
    product3: {
      startOffsetX: -20,
      startOffsetY: -70,
      endOffsetX: 20,
      endOffsetY: -75,
      arcHeight: 200,
      arcOffsetX: 0,
      arcOffsetY: 0,
      duration: 1.7,
    },
    product4: {
      startOffsetX: -60,
      startOffsetY: -100,
      endOffsetX: -60,
      endOffsetY: -75,
      arcHeight: 160,
      arcOffsetX: 0,
      arcOffsetY: 0,
      duration: 1.5,
    },
  };

  function showSlide2() {
    if (slide2Shown || !slide2) return;
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
    slide2Shown = true;

    gsap.set(slide2, {
      zIndex: 100,
    });

    const bg2 = slide2.querySelector('.bg2');
    const console = slide2.querySelector('.console');
    const product1_2 = slide2.querySelector('.product1-2');
    const product4_2 = slide2.querySelector('.product4-2');
    const product5_2 = slide2.querySelector('.product5-2');
    const rightSlide2 = slide2.querySelector('.rightSlide2');
    const logo = slide2.querySelector('.logo');
    const overline = slide2.querySelector('.overline');
    const cta = slide2.querySelector('.cta');

    cta.addEventListener('click', (e) => {
      fire_tag(ALL_EVENT_TYPES.CLICK1);
    });

    const slide2Tl = gsap.timeline();

    if (bg2) {
      slide2Tl.to(bg2, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (console) {
      slide2Tl.to(
        console,
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      );
    }

    if (product1_2 && product4_2 && product5_2) {
      slide2Tl.to(
        [product1_2, product4_2, product5_2],
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );
    }

    if (rightSlide2) {
      slide2Tl.to(
        rightSlide2,
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      );

      if (logo && overline && cta) {
        slide2Tl
          .to(
            [logo, overline, cta],
            {
              opacity: 1,
              duration: 0.4,
              stagger: 0.1,
              ease: 'power2.out',
            },
            '-=0.3'
          )
          .call(() => {
            if (cta) {
              cta.style.animation = 'pulse 0.5s infinite';
            }
          });
      }
    }
  }

  function hideSlide1() {
    gsap.to([bg, bag, notif], {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });

    bgBoxes.forEach((bgBox) => {
      gsap.to(bgBox, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  }

  const tl = gsap.timeline();

  tl.to(bg, {
    right: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
  }).to(
    bag,
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    },
    '-=0.3'
  );
  const bgBoxElements = [];
  const bgProductElements = [];
  const productElements = [];
  const shadowElements = [];

  bgBoxes.forEach((bgBox) => {
    bgBoxElements.push(bgBox);
    bgProductElements.push(
      bgBox.querySelector('.bgProductLeft, .bgProductRight')
    );
    productElements.push(bgBox.querySelector('.product'));
    shadowElements.push(bgBox.querySelector('.shadow'));
  });

  tl.to(
    bgBoxElements,
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: {
        amount: 0.4,
        from: 'start',
      },
      ease: 'back.out(1.7)',
    },
    '-=0.2'
  )
    .to(
      bgProductElements,
      {
        opacity: 1,
        duration: 0.5,
        stagger: {
          amount: 0.4,
          from: 'start',
        },
        ease: 'power2.out',
      },
      '<'
    )
    .to(
      productElements,
      {
        opacity: 1,
        duration: 0.5,
        stagger: {
          amount: 0.4,
          from: 'start',
        },
        ease: 'power2.out',
      },
      '<'
    )
    .to(
      shadowElements,
      {
        opacity: 1,
        duration: 0.5,
        stagger: {
          amount: 0.4,
          from: 'start',
        },
        ease: 'power2.out',
      },
      '<'
    )
    .call(() => {
      bgProducts.forEach((bgProduct) => {
        bgProduct.style.animation = 'pulse 1.5s infinite';
      });
    });

  setTimeout(showNotif, 1000);

  function showNotif() {
    if (hasClicked) {
      return;
    }

    if (notifShownCount >= maxNotifShows) {
      autoAnimateAllProducts();
      return;
    }

    gsap.fromTo(
      notif,
      {
        x: 200,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        onComplete: () => {
          notifShownCount++;
          if (notifShownCount < maxNotifShows) {
            setTimeout(() => {
              gsap.to(notif, {
                x: 200,
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                  setTimeout(showNotif, 4000);
                },
              });
            }, 4000);
          } else {
            setTimeout(() => {
              gsap.to(notif, {
                x: 200,
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                  autoAnimateAllProducts();
                },
              });
            }, 4000);
          }
        },
      }
    );
  }

  function animateProductToBag(bgBox) {
    const bgProduct = bgBox.querySelector('.bgProductLeft, .bgProductRight');
    const product = bgBox.querySelector('.product');
    const shadow = bgBox.querySelector('.shadow');

    if (!bgProduct || !product || product.style.opacity === '0') return;

    const productClass = Array.from(product.classList).find((cls) =>
      cls.startsWith('product')
    );
    const pathConfig = customPaths[productClass] || {
      startOffsetX: 0,
      startOffsetY: 0,
      endOffsetX: 0,
      endOffsetY: 0,
      arcHeight: 200,
      arcOffsetX: 0,
      arcOffsetY: 0,
      duration: 1.2,
    };

    const productRect = product.getBoundingClientRect();
    const startX =
      productRect.left + productRect.width / 2 + (pathConfig.startOffsetX || 0);
    const startY =
      productRect.top + productRect.height / 2 + (pathConfig.startOffsetY || 0);

    const bagRect = bag.getBoundingClientRect();
    const endX =
      bagRect.left + bagRect.width / 2 + (pathConfig.endOffsetX || 0);
    const endY =
      bagRect.top + bagRect.height / 2 + (pathConfig.endOffsetY || 0);

    const distance = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    const arcHeight = pathConfig.arcHeight || Math.max(distance * 0.3, 150);
    const controlX = (startX + endX) / 2 + (pathConfig.arcOffsetX || 0);
    const controlY =
      Math.min(startY, endY) - arcHeight + (pathConfig.arcOffsetY || 0);

    gsap.to(bgProduct, {
      opacity: 0.5,
      scale: 0.95,
      duration: 0.3,
    });
    bgProduct.style.animation = 'initial';

    if (shadow) {
      gsap.to(shadow, {
        opacity: 0,
        duration: 0.3,
      });
    }

    gsap.set(product, {
      position: 'fixed',
      left: startX + 'px',
      top: startY + 'px',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
    });

    const tl = gsap.timeline();

    const animationDuration = pathConfig.duration || 1.2;
    let finalX = endX;
    let finalY = endY;

    const mainPathDuration = animationDuration * 0.9;
    const fadeStartTime = 0.3;
    const fadeStartProgress = 1 - fadeStartTime / mainPathDuration;

    const initialNextX =
      (1 - 0.01) * (1 - 0.01) * startX +
      2 * (1 - 0.01) * 0.01 * controlX +
      0.01 * 0.01 * endX;
    const initialNextY =
      (1 - 0.01) * (1 - 0.01) * startY +
      2 * (1 - 0.01) * 0.01 * controlY +
      0.01 * 0.01 * endY;
    let initialAngle =
      Math.atan2(initialNextY - startY, initialNextX - startX) *
      (180 / Math.PI);

    if (productClass === 'product1') {
    }

    gsap.set(product, {
      transform: `translate(-50%, -50%) rotate(${initialAngle}deg)`,
    });

    let previousAngle = initialAngle;

    tl.to(
      {},
      {
        duration: mainPathDuration,
        ease: 'power2.out',
        onUpdate: function () {
          const progress = this.progress();
          const nextProgress = Math.min(progress + 0.02, 1);

          const currentX =
            (1 - progress) * (1 - progress) * startX +
            2 * (1 - progress) * progress * controlX +
            progress * progress * endX;
          const currentY =
            (1 - progress) * (1 - progress) * startY +
            2 * (1 - progress) * progress * controlY +
            progress * progress * endY;

          const nextX =
            (1 - nextProgress) * (1 - nextProgress) * startX +
            2 * (1 - nextProgress) * nextProgress * controlX +
            nextProgress * nextProgress * endX;
          const nextY =
            (1 - nextProgress) * (1 - nextProgress) * startY +
            2 * (1 - nextProgress) * nextProgress * controlY +
            nextProgress * nextProgress * endY;

          let targetAngle =
            Math.atan2(nextY - currentY, nextX - currentX) * (180 / Math.PI);

          if (productClass === 'product1') {
            const rotationOffset = 60 * progress;
            targetAngle += rotationOffset;
          }

          let angle;
          if (progress < 0.05) {
            angle = targetAngle;
          } else {
            let angleDiff = targetAngle - previousAngle;
            while (angleDiff > 180) angleDiff -= 360;
            while (angleDiff < -180) angleDiff += 360;
            angle = previousAngle + angleDiff * 0.7;
          }
          previousAngle = angle;

          let opacity = 1;
          if (progress >= fadeStartProgress) {
            const fadeProgress =
              (progress - fadeStartProgress) / (1 - fadeStartProgress);
            opacity = 1 - fadeProgress;
          }

          const displayValue = opacity <= 0.01 ? 'none' : 'block';

          gsap.set(product, {
            left: currentX + 'px',
            top: currentY + 'px',
            opacity: opacity,
            display: displayValue,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          });

          if (progress >= 0.99) {
            finalX = currentX;
            finalY = currentY;
          }
        },
      }
    )
      .set(product, {
        left: endX + 'px',
        top: endY + 'px',
        transform: 'translate(-50%, -50%)',
      })
      .to(product, {
        scale: 0.65,
        duration: animationDuration * 0.1,
        ease: 'back.out(1.5)',
      })
      .call(() => {
        gsap.set(product, {
          zIndex: 5,
          opacity: 0,
          display: 'none',
        });
      });
  }

  function autoAnimateAllProducts() {
    fire_tag(ALL_EVENT_TYPES.CLICK_AUTOPLAY);
    let maxDuration = 0;
    const staggerDelay = 200;

    bgBoxes.forEach((bgBox, index) => {
      const product = bgBox.querySelector('.product');
      if (product) {
        const productClass = Array.from(product.classList).find((cls) =>
          cls.startsWith('product')
        );
        const pathConfig = customPaths[productClass] || { duration: 1.2 };
        const animationDuration = pathConfig.duration || 1.2;
        const startDelay = index * staggerDelay;
        const totalTime = startDelay + animationDuration * 1000;
        if (totalTime > maxDuration) {
          maxDuration = totalTime;
        }
      }

      setTimeout(() => {
        animateProductToBag(bgBox);
      }, index * staggerDelay);
    });

    setTimeout(() => {
      hideSlide1();
      setTimeout(() => {
        showSlide2();
      }, 300);
    }, maxDuration + 500);
  }

  bgBoxes.forEach((bgBox, index) => {
    bgBox.addEventListener('click', (e) => {
      fire_tag(ALL_EVENT_TYPES.CLICK2);
      e.stopPropagation();
      e.preventDefault();

      clickCount++;

      if (clickCount === 3) {
        hideSlide1();
        setTimeout(() => {
          showSlide2();
        }, 300);
        return;
      }

      if (!hasClicked) {
        hasClicked = true;
        if (notifInterval) {
          clearTimeout(notifInterval);
        }
        gsap.to(notif, {
          x: 200,
          opacity: 0,
          duration: 0.4,
        });

        autoAnimateTimer = setTimeout(() => {
          if (clickCount < 2) {
            autoAnimateAllProducts();
          }
        }, 7000);
      } else if (clickCount >= 2) {
        if (autoAnimateTimer) {
          clearTimeout(autoAnimateTimer);
          autoAnimateTimer = null;
        }
      }

      animateProductToBag(bgBox);
    });
  });
});

function runAnimation() {
  const bg = document.querySelector('.bg');
  const giftsChildren = document.querySelectorAll('.gifts > *');
  const stageEl = document.querySelector('.stage');
  const flowerEl = document.querySelector('.flower');
  const logoEl = document.querySelector('.logo');
  const giftsDuration = 2;
  const giftsInitialDelay = 0.1;
  const giftsPause = -1;
  const giftsStaggerEach = giftsDuration + giftsPause;
  const cta = document.querySelector('.cta');
  if (giftsChildren.length) {
    giftsChildren.forEach((el, index) => {
      const overlap = 0;
      const effectiveStagger = Math.max(giftsStaggerEach - overlap, 0);
      const delay = giftsInitialDelay + index * effectiveStagger;

      gsap.fromTo(
        el,
        { x: -600, opacity: 1 },
        {
          x: 0,
          opacity: 1,
          duration: giftsDuration,
          ease: 'power3.out',
          delay,
        }
      );

      cta.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        fire_tag(ALL_EVENT_TYPES.CLICK1);
      });

      const wheelFront = el.querySelectorAll(
        '.wheel_front, .weelCar1front, .weelCar2front, .weelMotorfront'
      );
      const wheelBack = el.querySelectorAll(
        '.wheel_back, .weelCar1back, .weelCar2back, .weelCar2fback, .weelMotorback'
      );
      if (wheelFront.length || wheelBack.length) {
        gsap.delayedCall(delay, () => {
          wheelFront.forEach((w) => w.classList.add('rotate'));
          wheelBack.forEach((w) => w.classList.add('rotate-back'));
        });
        // Different stop timing for different vehicles
        let stopDelay = delay + giftsDuration - 0.3;
        if (index === 1) {
          // car2
          stopDelay = delay + giftsDuration - 0.5;
        } else if (index === 2) {
          // motor
          stopDelay = delay + giftsDuration - 0.5;
        }

        gsap.delayedCall(stopDelay, () => {
          wheelFront.forEach((w) => w.classList.remove('rotate'));
          wheelBack.forEach((w) => w.classList.remove('rotate-back'));
        });
      }
    });
  }

  if (stageEl) {
    const delayAfterGifts = giftsChildren.length
      ? giftsInitialDelay +
        (giftsChildren.length - 1) * giftsStaggerEach +
        giftsDuration +
        0.1
      : 0;
    gsap.from(stageEl, {
      x: -900,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay: delayAfterGifts,
    });
  }

  const totalGiftsTime = giftsChildren.length
    ? giftsInitialDelay +
      (giftsChildren.length - 1) * giftsStaggerEach +
      giftsDuration
    : 0;
  const stageTime = 0.5;
  const bgStartDelay = totalGiftsTime + stageTime + 0.5;

  if (bg) {
    gsap.to(bg, {
      duration: 1.5,
      y: -200,
      ease: 'power3.out',
      delay: bgStartDelay,
      onComplete: () => {
        gsap.set(bg, { y: 0, bottom: 0 });

        giftsChildren.forEach((el) => {
          const wheelFront = el.querySelectorAll(
            '.wheel_front, .weelCar1front, .weelCar2front, .weelMotorfront'
          );
          const wheelBack = el.querySelectorAll(
            '.wheel_back, .weelCar1back, .weelCar2back, .weelCar2fback, .weelMotorback'
          );
          wheelFront.forEach((w) => w.classList.add('ring-active'));
          wheelBack.forEach((w) => w.classList.add('ring-active'));
        });

        gsap.delayedCall(2, () => {
          const zeroEl = document.querySelector('.zero');
          const oneEl = document.querySelector('.one');

          if (zeroEl) {
            gsap.to(zeroEl, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            });
          }

          if (oneEl) {
            gsap.fromTo(
              oneEl,
              { y: -100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' }
            );
          }

          gsap.delayedCall(3, () => {
            const giftsEl = document.querySelector('.gifts');
            const numbersEl = document.querySelector('.numbers');
            const slide2El = document.querySelector('.slide2');

            if (giftsEl) {
              gsap.to(giftsEl, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
              });
            }
            if (numbersEl) {
              gsap.to(numbersEl, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
              });
            }
            if (slide2El) {
              gsap.to(slide2El, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.2,
              });
            }
            fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
          });
        });
      },
    });
  }
  if (logoEl) {
    gsap.from(logoEl, {
      duration: 1.5,
      y: 200,
      ease: 'power3.out',
      delay: bgStartDelay,
    });
  }

  if (flowerEl) {
    gsap.to(flowerEl, {
      duration: 0.8,
      y: -210,
      ease: 'power3.out',
      delay: bgStartDelay + 0.05,
      onComplete: () => {
        gsap.set(flowerEl, { y: 0, bottom: 0 });
      },
    });
  }
}

window.addEventListener('load', () => {
  runAnimation();

  setInterval(() => {
    location.reload();
  }, 30000);
});

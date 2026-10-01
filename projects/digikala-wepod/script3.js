document.addEventListener('DOMContentLoaded', () => {
  const bg = document.querySelector('.bg');
  const coinContainer = document.querySelector('.coinContainer');
  const coins = document.querySelectorAll('.coin');
  const gifts = document.querySelector('.gifts');
  const phone = document.querySelector('.phone');
  const logo = document.querySelector('.logo');
  const overline = document.querySelector('.overline');
  const person1 = document.querySelector('.person1');
  const person2 = document.querySelector('.person2');
  const finalSlide = document.querySelector('.finalSlide');
  const lastSlideCopy = document.querySelector('.lastSlideCopy');
  const cta = document.querySelector('.cta');
  const infoBox = document.querySelector('.infoBox');
  let coinsVisible = true;
  let hasClicked = false;
  let secondPhaseTriggered = false;

  gsap.set([logo, overline, gifts], { opacity: 0 });
  gsap.set(logo, { y: -50, scale: 0.8 });
  gsap.set(overline, { x: 200 });
  gsap.set(gifts, { y: 50 });

  gsap.set(lastSlideCopy, { xPercent: -50, yPercent: 50, opacity: 0 });
  gsap.set(infoBox, { x: 200, opacity: 0 });

  if (phone) {
    gsap.set(phone, {
      xPercent: -10,
      yPercent: 30,
      opacity: 1,
      scale: 0.5,
      rotation: -10,
    });

    gsap.to(phone, {
      duration: 1,
      opacity: 1,
      scale: 0.8,
      rotation: 0,
      ease: 'back.out(1.2)',
      delay: 0.8,
    });
  }

  function hideCoins() {
    coinsVisible = false;
    coins.forEach((coin, index) => {
      setTimeout(() => {
        coin.classList.add('hide');
      }, index * 50);
    });
  }

  function showBg() {
    bg.classList.add('show');
    document.body.classList.add('bg-showed');
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
    const tl = gsap.timeline();

    tl.to(overline, {
      duration: 0.6,
      opacity: 1,
      x: 0,
      ease: 'elastic.out(1, 0.5)',
    })
      .to(
        logo,
        {
          duration: 0.7,
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      )
      .to(
        gifts,
        {
          duration: 0.8,
          opacity: 1,
          y: 30,
          ease: 'back.out(1.5)',
        },
        '-=0.4'
      );

    if (phone && person1 && person2) {
      gsap.to([phone, person1, person2], {
        duration: 0.6,
        x: '-=40',
        scale: 0.85,
        ease: 'back.out(1.3)',
      });
    } else if (phone) {
      gsap.to(phone, {
        duration: 0.6,
        xPercent: -32,
        yPercent: 30,
        scale: 0.8,
        ease: 'back.out(1.3)',
      });
    }

    setTimeout(() => {
      if (!secondPhaseTriggered) {
        triggerSecondPhase();
      }
    }, 8000);
  }

  function triggerSecondPhase() {
    if (secondPhaseTriggered) return;
    secondPhaseTriggered = true;

    gsap.set(lastSlideCopy, { xPercent: -50, yPercent: 50, opacity: 0 });
    gsap.set(infoBox, { x: 200, opacity: 0 });

    const tl = gsap.timeline();

    gsap.to(overline, {
      duration: 0.8,
      opacity: 0,
      x: 250,
      scale: 0.85,
      ease: 'power1.out',
    });
    gsap.to(gifts, {
      duration: 0.8,
      opacity: 0,
      x: -250,
      scale: 0.85,
      ease: 'power1.out',
    });
    console.log(person1);
    gsap.to(person1, {
      duration: 0.8,
      opacity: 0,
      scale: 0.85,
      ease: 'power1.inOut',
    });
    gsap.to(person2, {
      duration: 0.8,
      opacity: 0,
      scale: 0.85,
      ease: 'power1.inOut',
    });
    gsap.to(phone, {
      duration: 0.8,
      opacity: 0,
      scale: 0.85,
      ease: 'power1.inOut',
      onComplete: () => {
        finalSlide.style.display = 'flex';
        gsap.set(coinContainer, { zIndex: 10 });
        coins.forEach((coin) => {
          coin.classList.remove('hide');
          gsap.set(coin, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            clearProps: 'transform',
          });
        });
        tl.to(
          coins,
          {
            duration: 0.7,
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            onStart: function () {
              coins.forEach((coin) => {
                gsap.set(coin, { zIndex: 5 });
              });
            },
          },
          '+=0.1'
        )
          .to(
            coins,
            {
              x: function (index) {
                const basePositions = [-100, -50, 0, -120, -100];
                return basePositions[index] || 0;
              },
              y: function (index) {
                const positions = [-80, -40, 0, 40, 80];
                return positions[index % positions.length];
              },
              ease: 'power2.out',
            },
            '=>'
          )
          .to({}, { duration: 0.2 })
          .to(
            lastSlideCopy,
            {
              duration: 0.7,
              opacity: 1,
              yPercent: 0,
              ease: 'back.out(1.7)',
            },
            '=>'
          )
          .to(
            cta,
            {
              duration: 0.6,
              opacity: 1,
              ease: 'back.out(1.7)',
            },
            '=>'
          )
          .to(
            infoBox,
            {
              duration: 0.8,
              opacity: 1,
              x: 15,
              y: 10,
              ease: 'back.out(1.7)',
            },
            '-=0.4'
          );
      },
    });
  }

  function triggerAnimation() {
    if (coinsVisible) {
      hideCoins();
      showBg();
    }
  }

  const timer = setTimeout(() => {
    if (!hasClicked && coinsVisible) {
      fire_tag(ALL_EVENT_TYPES.CLICK_AUTOPLAY);
      triggerAnimation();
    }
  }, 8000);

  cta.addEventListener('click', (e) => {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });

  let isFirstClick = true;
  if (phone) {
    phone.addEventListener('click', (e) => {
      if (isFirstClick) {
        fire_tag(ALL_EVENT_TYPES.CLICK1);
        e.preventDefault();
        e.stopPropagation();
        if (!hasClicked) {
          hasClicked = true;
          clearTimeout(timer);
          triggerAnimation();
        }
        isFirstClick = false;
      }
    });
  }

  setTimeout(() => {
    location.reload();
  }, 35000);
});

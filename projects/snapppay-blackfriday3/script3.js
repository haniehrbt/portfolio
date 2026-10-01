document.addEventListener('DOMContentLoaded', function () {
  const bgContainer = document.querySelector('.bg-container');
  const leftCurtain = document.querySelector('.leftcurtain');
  const rightCurtain = document.querySelector('.rightcurtain');
  const logo = document.querySelector('.logo');
  const volume = document.querySelector('.volume');
  const bgVideo = document.querySelector('.bg-video');
  const bgImage = document.querySelector('.bg-image');
  const slide3 = document.querySelector('.slide3');
  const right = document.querySelector('.right');
  const left = document.querySelector('.left');
  const products = document.querySelectorAll('.product');
  const audio = new Audio('./audio.mp3');
  audio.loop = true;
  bgVideo.muted = true;
  bgVideo.play();

  volume.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    fire_tag(ALL_EVENT_TYPES.CLICK2);
    if (audio.paused) {
      if (audio.ended) {
        audio.currentTime = 0;
      }
      audio.play();
    } else {
      audio.pause();
    }
  });

  let mainTimeline = null;
  let productFlickerTimeouts = [];
  let videoEndListener = null;

  function animateVolumeBubble() {
    gsap.set(volume, { opacity: 0, scale: 0, transformOrigin: 'center' });
    gsap.to(volume, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      transformOrigin: 'center',
    });
  }

  function initAnimation() {
    if (mainTimeline) {
      mainTimeline.kill();
    }

    const tl = gsap.timeline();
    mainTimeline = tl;

    bgVideo.load();

    gsap.set(bgContainer, { y: '100%' });
    gsap.set(logo, {
      opacity: 0,
      scale: 1,
      y: 0,
      rotation: 0,
      filter: 'none',
      display: 'block',
    });
    gsap.set(leftCurtain, { x: 0, transformOrigin: 'center' });
    gsap.set(rightCurtain, { x: 0, transformOrigin: 'center' });
    gsap.set(bgImage, { opacity: 1, scale: 1, filter: 'none' });
    gsap.set(bgVideo, {
      x: 0,
      y: 0,
      scale: 1,
      filter: 'none',
      opacity: 1,
      display: 'block',
    });
    gsap.set(slide3, { opacity: 0, pointerEvents: 'none' });
    gsap.set(right, { opacity: 0, x: 50 });
    gsap.set(left, { opacity: 0, x: -50 });
    gsap.set(products, { opacity: 0, scale: 0.8 });

    tl.to(bgContainer, {
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    });

    tl.to(logo, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out',
    });

    tl.to(
      leftCurtain,
      {
        x: '-150%',
        duration: 1.2,
        ease: 'power2.in',
        transformOrigin: 'center',
      },
      0.8
    );

    tl.to(
      rightCurtain,
      {
        x: '150%',
        duration: 1.2,
        ease: 'power2.in',
        transformOrigin: 'center',
      },
      0.8
    );

    tl.call(
      function () {
        gsap.set(bgImage, { opacity: 0 });
        videoEndListener = function onVideoEnd() {
          setTimeout(function () {
            const overline = document.querySelector('.overline');
            const cta = document.querySelector('.cta');

            cta.addEventListener('click', function (e) {
              fire_tag(ALL_EVENT_TYPES.CLICK1);
            });
            const endTimeline = gsap.timeline();

            endTimeline.to(bgVideo, {
              opacity: 0,
              scale: 1.15,
              filter: 'blur(10px)',
              duration: 0.8,
              ease: 'power2.in',
              onComplete: function () {
                bgVideo.style.display = 'none';
              },
            });

            endTimeline.fromTo(
              bgImage,
              { opacity: 0, scale: 0.9, filter: 'blur(5px)' },
              {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'power2.out',
              },
              '-=0.4'
            );

            endTimeline.to(
              logo,
              {
                opacity: 0,
                scale: 0.5,
                y: -30,
                rotation: -15,
                filter: 'blur(8px)',
                duration: 0.8,
                ease: 'power3.in',
                onComplete: function () {
                  logo.style.display = 'none';
                },
              },
              '-=0.2'
            );

            endTimeline.set(
              slide3,
              { opacity: 1, pointerEvents: 'auto' },
              '-=0.1'
            );

            endTimeline.to(
              right,
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power3.out',
              },
              '-=0.1'
            );

            endTimeline.fromTo(
              overline,
              { opacity: 0, y: -15, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.2)',
              },
              '-=0.5'
            );

            endTimeline.fromTo(
              cta,
              { opacity: 0, scale: 0.5, rotation: -10 },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.4)',
              },
              '-=0.3'
            );

            endTimeline.to(
              left,
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power3.out',
              },
              '-=0.4'
            );

            endTimeline.to(
              products,
              {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.2)',
                stagger: {
                  amount: 0.6,
                  from: 'start',
                },
                onComplete: function () {
                  setTimeout(function () {
                    startProductFlickering(products);
                  }, 800);
                },
              },
              '-=0.3'
            );

            bgVideo.removeEventListener('ended', videoEndListener);
          }, 1000);
        };

        bgVideo.addEventListener('ended', videoEndListener);
      },
      null,
      0.8
    );
  }

  function startProductFlickering(products) {
    const productsArray = Array.from(products);
    let currentIndex = -1;

    function flickerNextProduct() {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * productsArray.length);
      } while (randomIndex === currentIndex && productsArray.length > 1);

      currentIndex = randomIndex;
      const product = productsArray[currentIndex];

      const fadeOutDuration = 0.4 + Math.random() * 0.3;
      const scaleDownDuration = 0.3 + Math.random() * 0.2;
      const fadeInDuration = 0.5 + Math.random() * 0.3;
      const scaleUpDuration = 0.4 + Math.random() * 0.2;
      const offDuration = 0.15 + Math.random() * 0.25;

      gsap.to(product, {
        opacity: 0,
        duration: fadeOutDuration,
        ease: 'sine.inOut',
        onComplete: function () {
          gsap.to(product, {
            scale: 0.85,
            duration: scaleDownDuration,
            ease: 'sine.inOut',
            onComplete: function () {
              setTimeout(function () {
                gsap.to(product, {
                  scale: 1.04,
                  opacity: 1,
                  duration: Math.max(scaleUpDuration, fadeInDuration),
                  ease: 'sine.inOut',
                  onComplete: function () {
                    gsap.to(product, {
                      scale: 1,
                      duration: 0.3,
                      ease: 'power1.out',
                    });
                  },
                });
              }, offDuration * 1000);
            },
          });
        },
      });

      const nextFlickerDelay = 600 + Math.random() * 600;
      const timeoutId = setTimeout(flickerNextProduct, nextFlickerDelay);
      productFlickerTimeouts.push(timeoutId);
    }

    const initialTimeout = setTimeout(
      flickerNextProduct,
      400 + Math.random() * 400
    );
    productFlickerTimeouts.push(initialTimeout);
  }

  function stopAllAnimations() {
    if (mainTimeline) {
      mainTimeline.kill();
    }
    productFlickerTimeouts.forEach(function (timeoutId) {
      clearTimeout(timeoutId);
    });
    productFlickerTimeouts = [];

    gsap.killTweensOf([
      bgContainer,
      logo,
      leftCurtain,
      rightCurtain,
      bgImage,
      bgVideo,
      slide3,
      right,
      left,
    ]);
    products.forEach(function (product) {
      gsap.killTweensOf(product);
    });
  }

  function startLoop() {
    stopAllAnimations();
    initAnimation();
    fire_tag(ALL_EVENT_TYPES.LOOP);
  }

  animateVolumeBubble();
  initAnimation();

  setTimeout(function () {
    startLoop();

    setInterval(function () {
      startLoop();
    }, 28000);
  }, 28000);
});

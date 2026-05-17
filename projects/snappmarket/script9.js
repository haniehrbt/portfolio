gsap.registerPlugin();

gsap.set('.video4', { opacity: 0 });
gsap.set('.bgContainer', { y: '100%', opacity: 0 });
const products = document.querySelectorAll('.product');

const bgContainer = document.querySelector('.bgContainer');
bgContainer.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
});

const tl = gsap.timeline();

tl.to('.bgContainer', {
  y: '0%',
  opacity: 1,
  duration: 1,
  ease: 'power2.inOut',
})
  .to('.bgContainer', {
    y: '100%',
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    delay: 2.5,
  })
  .to(
    '.video1',
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        video1.play();
      },
    },
    '-=1',
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE01)
  );

setTimeout(() => {
  const thinkingTl = gsap.timeline();
  thinkingTl
    .to('.circle2', {
      opacity: 1,
      scale: 1,
      visibility: 'visible',
      duration: 0.3,
      ease: 'back.out(1)',
    })
    .to(
      '.circle1',
      {
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'back.out(1)',
      },
      '-=0.1'
    )
    .to(
      '.cloud1',
      {
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'back.out(1)',
        onComplete: () => {
          gsap.to('.cloud1', {
            y: '-=6',
            duration: 0.8,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
          });
        },
      },
      '-=0.2'
    )
    .to(
      '.video1-overlay1',
      {
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'back.out(1)',
        onComplete: () => {
          gsap.to('.video1-overlay1', {
            y: '-=4',
            duration: 1,
            yoyo: true,
            // repeat: -1,
            ease: 'power1.inOut',
          });
        },
      },
      '-=0.2'
    );
}, 3800);

setTimeout(() => {
  const reverseTl = gsap.timeline();

  reverseTl
    .to('.video1-overlay1', {
      opacity: 0,
      scale: 0,
      duration: 0.3,
      ease: 'back.in(1.7)',
    })
    .to(
      '.cloud1',
      {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
      },
      '-=0.1'
    )
    .to(
      '.circle1',
      {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
      },
      '-=0.1'
    )
    .to(
      '.circle2',
      {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: 'back.in(1.7)',
      },
      '-=0.1.1'
    );
}, 2000);

setTimeout(() => {
  const cycle2Tl = gsap.timeline();

  gsap.set(['.video1-overlay1', '.cloud1', '.circle1', '.circle2'], {
    opacity: 0,
    scale: 0,
    visibility: 'hidden',
  });

  cycle2Tl
    .to('.circle2', {
      opacity: 1,
      scale: 1,
      visibility: 'visible',
      duration: 0.3,
      ease: 'back.out(1)',
    })
    .to(
      '.circle1',
      {
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'back.out(1)',
      },
      '-=0.1'
    )
    .to(
      '.cloud1',
      {
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'back.out(1)',
        onComplete: () => {
          gsap.to('.cloud1', {
            y: '-=6',
            duration: 0.8,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
          });
        },
      },
      '-=0.2'
    )
    .to(
      '.video1-overlay2',
      {
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'back.out(1)',
        onComplete: () => {
          gsap.to('.video1-overlay2', {
            y: '-=4',
            duration: 1,
            yoyo: true,
            // repeat: -1,
            ease: 'power1.inOut',
          });
        },
      },
      '-=0.2'
    );

  setTimeout(() => {
    const reverse2Tl = gsap.timeline();
    reverse2Tl
      .to('.video1-overlay2', {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
      })
      .to(
        '.cloud1',
        {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          ease: 'back.in(1.7)',
        },
        '-=0.1'
      )
      .to(
        '.circle1',
        {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          ease: 'back.in(1.7)',
        },
        '-=0.1'
      )
      .to(
        '.circle2',
        {
          opacity: 0,
          scale: 0,
          duration: 0.5,
          ease: 'back.in(1.7)',
        },
        '-=0.1.1'
      );
  }, 2000);
}, 7000);

const video1 = document.querySelector('.video1');
const video2 = document.querySelector('.video2');
const video4 = document.querySelector('.video4');

video1.addEventListener('ended', function () {
  console.log('Video1 ended, setting video2 as clicked = true');

  gsap.set(
    ['.cloud1', '.circle1', '.circle2', '.video1-overlay1', '.video1-overlay2'],
    {
      opacity: 0,
      visibility: 'hidden',
    }
  );

  gsap.to('.video1', {
    scale: 1.1,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in',
  });
  gsap.fromTo(
    '.video2',
    {
      scale: 1.1,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    },
    '-=0.3'
  );

  video2.play();
  video2.currentTime = 0;
});

video2.preload = 'auto';
video2.currentTime = 0;
video4.preload = 'auto';
video4.currentTime = 0;

if (video1) {
  video1.preload = 'auto';
  video1.currentTime = 0;
}

let buttonShown = false;
let video2Paused = false;
let userClickedButton = false;

video2.addEventListener('timeupdate', function () {
  if (this.currentTime >= 1.2 && !video2Paused) {
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
    video2Paused = true;
    this.pause();
    if (!buttonShown) {
      buttonShown = true;
      gsap.to('.custom-button', {
        opacity: 1,
        visibility: 'visible',
        duration: 0.6,
        ease: 'power2.out',
      });

      setTimeout(() => {
        if (!userClickedButton) {
          playVideo4();
        }
        gsap.set('.custom-button', {
          display: 'none',
          animation: 'none',
        });
      }, 10000);
    }

    gsap.to('.custom-button', {
      animation: 'pulse 0.8s ease-in-out infinite',
      duration: 0.1,
    });
  }
});

let currentProductIndex = 0;
let productRotationInterval;

function startProductRotation(interval = 2000) {
  const products = document.querySelectorAll('.product');
  let currentProductIndex = 0;
  function showProduct(index) {
    gsap.to(products, {
      opacity: 0,
      visibility: 'hidden',
      duration: 0.5,
      ease: 'power2.inOut',
    });

    setTimeout(() => {
      products.forEach((p) => (p.style.display = 'none'));
      products[index].style.display = 'block';
      gsap.to(products[index], {
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }, 500);
  }

  // showProduct(currentProductIndex);
  // if (window.productRotationInterval) {
  //   clearInterval(window.productRotationInterval);
  // }

  window.productRotationInterval = setInterval(() => {
    currentProductIndex = (currentProductIndex + 1) % products.length;
    showProduct(currentProductIndex);
  }, interval);
}

function showProduct(index) {
  const products = document.querySelectorAll('.product');

  gsap.to(products, {
    opacity: 0,
    visibility: 'hidden',
    duration: 0.2,
    ease: 'power2.inOut',
  });
}

function startProductRotation(interval = 2000) {
  let currentProductIndex = 0;

  function showProduct(index) {
    gsap.to(products, {
      opacity: 0,
      visibility: 'hidden',
      duration: 0.3,
      ease: 'power2.inOut',
    });

    gsap.set(productContainer, {
      display: 'block',
      visibility: 'visible',
      opacity: 0,
      position: 'fixed',
      bottom: '90px',
      right: '10px',
      zIndex: 999,
    });
    gsap.to(productContainer, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });

    const products = productContainer.querySelectorAll('.product');

    products.forEach((p, i) => {
      p.style.display = i === 0 ? 'block' : 'none';
      gsap.set(p, { opacity: i === 0 ? 1 : 0 });
    });
    currentProductIndex = 0;

    if (productRotationInterval) clearInterval(productRotationInterval);

    productRotationInterval = setInterval(() => {
      const prevIndex = currentProductIndex;
      currentProductIndex = (currentProductIndex + 1) % products.length;

      gsap.to(products[prevIndex], {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          products[prevIndex].style.display = 'none';

          products[currentProductIndex].style.display = 'block';
          gsap.to(products[currentProductIndex], {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut',
          });
        },
      });
    }, 2000);
  }

  showProduct(currentProductIndex);

  if (window.productRotationInterval) {
    clearInterval(window.productRotationInterval);
  }
  window.productRotationInterval = setInterval(() => {
    currentProductIndex = (currentProductIndex + 1) % products.length;
    showProduct(currentProductIndex);
  }, interval);
}

function stopProductRotation() {
  clearInterval(window.productRotationInterval);
  gsap.set(['.productContainer', '.custom-button'], {
    opacity: 0,
    visibility: 'hidden',
    display: 'none',
  });
}
video4.addEventListener('ended', () => {
  location.reload();
});
function startProductRotation() {
  showProduct(0);

  productRotationInterval = setInterval(() => {
    currentProductIndex = (currentProductIndex + 1) % products.length;
    showProduct(currentProductIndex);
  }, 2000);
}

function showProduct(index) {
  gsap.to(products, {
    opacity: 0,
    visibility: 'hidden',
    duration: 0.4,
    ease: 'power2.inOut',
  });

  setTimeout(() => {
    products.forEach((p) => (p.style.display = 'none'));
    products[index].style.display = 'block';
    gsap.to(products[index], {
      opacity: 1,
      visibility: 'visible',
      duration: 0.4,
      ease: 'power2.inOut',
    });
  }, 250);
}

const customButton = document.querySelector('.custom-button');

function playVideo4() {
  gsap.to('.video2', {
    opacity: 0,
    duration: 2,
    ease: 'power2.inOut',
  });

  gsap.to('.video4', {
    opacity: 1,
    duration: 2,
    ease: 'power2.inOut',
    onComplete: () => {
      setTimeout(() => {}, 800);
    },
  });
  fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE03);
  startProductRotation();

  gsap.to('.productContainer', {
    opacity: 1,
    display: 'block',
    visibility: 'visible',
    duration: 0.7,
    ease: 'power2.out',
  });
  products.forEach((product) => {
    product.addEventListener('click', (event) => {
      fire_tag(ALL_EVENT_TYPES.CLICK4);
    });
  });
  video4.currentTime = 0;
  video4.play();
}

function playVoice() {
  const voiceAudio = new Audio('./voice.mp3');
  voiceAudio.volume = 1.0;
  voiceAudio.preload = 'auto';

  voiceAudio.play().catch(() => {
    setTimeout(() => voiceAudio.play().catch(() => {}), 0);
  });
}

customButton.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  fire_tag(ALL_EVENT_TYPES.CLICK1);
  userClickedButton = true;
  playVoice();
  gsap.to('.custom-button', {
    scale: 2,
    duration: 0.3,
    ease: 'power2.out',
  });
  stopProductRotation();
  playVideo4();
});
video1.addEventListener('canplaythrough', () => {
  fire_tag(ALL_EVENT_TYPES.CANPLAYTHROUGH1);
});

video2.addEventListener('canplaythrough', () => {
  fire_tag(ALL_EVENT_TYPES.CANPLAYTHROUGH2);
});

video4.addEventListener('canplaythrough', () => {
  fire_tag(ALL_EVENT_TYPES.CANPLAYTHROUGH3);
});

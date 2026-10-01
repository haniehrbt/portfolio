const lightContainers = document.querySelectorAll('.light-container');
const spinnerContainer = document.querySelector('.spinnerContainer');

lightContainers.forEach((lightContainer, index) => {
  lightContainer.style.transform = `translate(-50%, -50%) rotate(${(index * 360) / lightContainers.length}deg)`;
});

const oddLights = [];
lightContainers.forEach((lightContainer, index) => {
  if (index % 2 === 0) {
    oddLights.push(lightContainer);
  }
});
const evenLights = [];
lightContainers.forEach((lightContainer, index) => {
  if (index % 2 !== 0) {
    evenLights.push(lightContainer);
  }
});

function animateLights() {
  let isOddOn = true;

  function toggleLights() {
    if (isOddOn) {
      oddLights.forEach((lightContainer) => {
        lightContainer.style.opacity = '1';
        lightContainer.style.filter =
          'brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 0, 0.8))';
      });
      evenLights.forEach((lightContainer) => {
        lightContainer.style.opacity = '0.3';
        lightContainer.style.filter = 'brightness(0.5)';
      });
    } else {
      evenLights.forEach((lightContainer) => {
        lightContainer.style.opacity = '1';
        lightContainer.style.filter =
          'brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 0, 0.8))';
      });
      oddLights.forEach((lightContainer) => {
        lightContainer.style.opacity = '0.3';
        lightContainer.style.filter = 'brightness(0.5)';
      });
    }

    isOddOn = !isOddOn;

    setTimeout(toggleLights, 500);
  }
  toggleLights();
}

animateLights();

const spinnerInside = document.querySelector('.spinner-inside');

let spinneranimation = null;
function animateSpinner() {
  spinneranimation = gsap.fromTo(
    spinnerInside,
    {
      rotate: 0,
      filter: 'blur(1px)',
    },
    {
      rotate: 360,
      filter: 'blur(1px)',
      duration: 0.5,
      ease: 'linear',
      repeat: -1,
    }
  );
}

// animateLights();
// animateSpinner()

const bg = document.querySelector('.bg');
function fadeinbg() {
  gsap.to(bg, {
    duration: 0.5,
    transform: `scaleX(1) translate(-50%, -50%)`,
  });
}

// fadeinbg()

gsap.to(spinnerContainer, {
  duration: 1,
  top: '50%',
  onComplete: () => {
    setTimeout(() => {
      fadeinbg();
      gsap.to(spinnerContainer, {
        duration: 1,
        delay: 1,
        left: '25%',
        onComplete: () => {
          headercomedown();
          fadeinoverline();
          setTimeout(final, 10000);
        },
      });
    }, 1000);
  },
});

const overlineContainer = document.querySelector('.overlineContainer');

function fadeinoverline() {
  gsap.to(overlineContainer, {
    duration: 0.5,
    delay: 0.5,
    opacity: 1,
    onComplete: () => {
      const cta = document.querySelector('.cta');
      cta.classList.add('cta-tapesh');
      animateSpinner();
    },
  });
}

const header = document.querySelector('.header');
function headercomedown() {
  gsap.to(header, {
    duration: 0.5,
    bottom: '98px',
  });
}

function final() {
  function fadeandremove(element) {
    gsap.to(element, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        element.remove();
      },
    });
  }

  fadeandremove(bg);
  fadeandremove(header);
  fadeandremove(overlineContainer);
  stopSpinner();
}

function stopSpinner() {
  gsap.to(spinnerContainer, {
    left: '50%',
    duration: 2,
    onComplete: () => {
      spinneranimation.kill();

      // Get current rotation value from transform
      const currentTransform = spinnerInside.style.transform;
      let currentRotation = 0;

      if (currentTransform && currentTransform.includes('rotate')) {
        const match = currentTransform.match(/rotate\(([^)]+)deg\)/);
        if (match) {
          currentRotation = parseFloat(match[1]);
        }
      }

      const randomTolerance = Math.random() * 360;

      gsap.to(spinnerInside, {
        rotate: currentRotation + 360 + randomTolerance,
        filter: 'blur(0px)',
        ease: 'ease-in',
        duration: 2,
        onComplete: () => {
          setTimeout(() => {
            gsap.to(spinnerContainer, {
              marginTop: '-50%',
              duration: 1,
              onComplete: () => {
                window.location.reload();
              },
            });
          }, 2000);
        },
      });
    },
  });
}

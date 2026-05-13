const boxClose = document.querySelector('.box-close');
const boxOpen = document.querySelector('.box-open');
const bitcoinBox = document.querySelector('.bitcoin-box');
const bitcoinBoxBG = document.querySelector('.bitcoin-box-bg');
const bg1 = document.querySelector('.bg-slide1');
const overline_slide1 = document.querySelector('.overline-slide1');
const DEBUG = 1;
const pin = document.querySelector('.pin');
const miniPins = document.querySelectorAll('.pin-mini');

const audio_coin = new Audio('coin.mp3');
const audio_wosh = new Audio('wosh.mp3');
const cardPics = document.querySelectorAll('.cardPic');

function getThreeUniqueRandomNumbers() {
  const numbers = new Set();

  while (numbers.size < 3) {
    const num = Math.floor(Math.random() * 6) + 1;
    numbers.add(num);
  }

  return Array.from(numbers);
}

getThreeUniqueRandomNumbers().forEach((num, index) => {
  cardPics[index].src = `product${num}.png`;
});

gsap.to(boxClose, {
  duration: DEBUG * 1,
  bottom: 0,
});

function gsap_open_box() {
  boxClose.style.display = 'none';
  boxOpen.style.display = 'block';
  gsap.fromTo(
    bitcoinBox,
    {
      duration: DEBUG * 1,
      bottom: 0,
      opacity: 0,
    },
    {
      bottom: '75px',
      opacity: 1,
    }
  );
  gsap.to(bitcoinBoxBG, {
    duration: DEBUG * 0.5,
    clipPath: 'inset(0% 0% 0% 0%)',
  });

  setTimeout(gsap_close_box, 2000 * DEBUG);
}

function gsap_close_box() {
  fire_tag(ACTIONS.VISIT_SLIDE02, 'VISIT_SLIDE02');
  const duration = DEBUG * 1;
  boxClose.style.display = 'block';
  boxOpen.style.display = 'none';
  boxOpen.style.opacity = '0';
  boxOpen.style.height = '113px';
  gsap.to(boxOpen, {
    duration: 0,
    right: '-60px',
    bottom: 0,
  });
  bitcoinBoxBG.remove();

  function go_down(element) {
    gsap.to(element, {
      bottom: '-100px',
      duration: duration,
      onComplete: () => {
        element.remove();
      },
    });
  }

  go_down(boxClose);

  gsap.to(bitcoinBox, {
    duration: DEBUG * 1,
    height: '130px',
    right: '-50px',
    bottom: '0px',
  });

  gsap.to(bg1, {
    duration: DEBUG * 1,
    bottom: 0,
  });

  gsap.to('.slide1-arrows', {
    duration: DEBUG * 0.5,
    opacity: 1,
  });

  gsap.to(overline_slide1, {
    duration: DEBUG * 1,
    opacity: 1,
  });

  gsap.to(pin, {
    right: '21.5%',
    bottom: '93px',
    duration: 0.5,
    delay: 1 * DEBUG,
  });

  setTimeout(go_to_products, 4000 * DEBUG);
}

setTimeout(gsap_open_box, DEBUG * 2000);

const cardsContainer = document.querySelector('.cardsContainer');
const logoContainer = document.querySelector('.logoContainer');

function go_to_products() {
  fire_tag(ACTIONS.VISIT_SLIDE03, 'VISIT_SLIDE03');
  const duration = 1 * DEBUG;
  boxOpen.style.display = 'block';

  gsap.to(overline_slide1, {
    duration: 0.5 * DEBUG,
    opacity: 0,
    onComplete: () => {
      overline_slide1.remove();
    },
  });
  gsap.to(bitcoinBox, {
    duration: 0.5 * DEBUG,
    opacity: 0,
    onComplete: () => {
      overline_slide1.remove();
    },
  });
  gsap.to('.slide1-arrows', {
    duration: 0.5 * DEBUG,
    opacity: 0,
    onComplete: () => {
      overline_slide1.remove();
    },
  });

  gsap.to(pin, {
    duration: 0.5 * DEBUG,
    opacity: 0,
    onComplete: () => {
      overline_slide1.remove();
    },
  });

  gsap.to(boxOpen, {
    duration: 1 * DEBUG,
    opacity: 1,
  });

  gsap.to(bg1, {
    duration: 1,
    background: '#ED1944',
  });

  gsap.to(logoContainer, {
    duration: 1 * DEBUG,
    opacity: 1,
  });

  gsap.to(cardsContainer, {
    duration: 1 * DEBUG,
    opacity: 1,
    onComplete: () => {
      setTimeout(() => {
        cards.forEach((card, index) => {
          handleCardClick(card, index, null);
        });
      }, 15000);
    },
  });

  setTimeout(() => {
    miniPins.forEach((pin, index) => {
      gsap.to(pin, {
        marginLeft: 0,
        marginTop: 0,
        delay: 0.4 * index * DEBUG,
        duration: 1 * DEBUG,
      });
    });
  }, 1000 * DEBUG);
}

const cards = document.querySelectorAll('.card');
const cards_flag = [false, false, false];
let pins_counter = 0;
cards.forEach((card, index) => {
  boxOpen.style.zIndex = '99999';
  card.addEventListener('click', (e) => {
    fire_tag(ACTIONS.CLICK_CARD, 'CLICK1');
    handleCardClick(card, index, e);
  });
});

function handleCardClick(card, index, e) {
  if (cards_flag[index]) {
    return;
  } else {
    cards_flag[index] = true;
    audio_wosh.play();
    cards[index].classList.remove('pulse');
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const pin = card.querySelector('.pin-mini');
  const currentRect = pin.getBoundingClientRect();

  const startX = currentRect.left;
  const startY = currentRect.top;
  const targetLeft = window.innerWidth - 230 + 10 + index * 50;
  const targetTop = window.innerHeight - 90;

  // pin.style.position = 'fixed';
  pin.style.top = startY - 4 + 'px';
  if (index == 0) {
    pin.style.left = `${Number(startX) - 147}` + 'px';
  }
  if (index == 1) {
    pin.style.left = `${Number(startX) - 90}` + 'px';
  }
  if (index == 2) {
    pin.style.left = `${Number(startX) - 33.5}` + 'px';
  }

  const tl = gsap.timeline();

  const midX = targetLeft;
  const midY = startY + 10;

  tl.to(pin, {
    duration: 0.8,
    top: midY,
    left: midX,
    ease: 'linear',
  }).to(pin, {
    duration: 0.8,
    top: targetTop,
    left: targetLeft,
    ease: 'linear',
    onComplete: () => {
      // pin.remove()
      pins_counter++;
      if (pins_counter === 3) {
        go_to_last_slide();
        audio_coin.play();
      }
    },
  });
}

function floatElements(elements) {
  elements.forEach((el) => {
    el.style.display = 'block';
    gsap.to(el, {
      duration: 0.5,
      opacity: 1,
    });
    const duration = gsap.utils.random(2, 5);
    const distance = gsap.utils.random(5, 10);
    const delay = gsap.utils.random(0, 1);

    gsap.to(el, {
      y: `-=${distance}`,
      duration: duration,
      delay: delay,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}

const floats = document.querySelectorAll('.float');
const pinFloat = document.querySelector('.pin-float');

function go_to_last_slide() {
  fire_tag(ACTIONS.VISIT_SLIDE04, 'VISIT_SLIDE04');

  function soft_remove(element) {
    if (element) {
      gsap.to(element, {
        duration: 1,
        opacity: 0,
        onComplete: () => {
          element.remove();
        },
      });
    }
  }

  gsap.to(bg1, {
    duration: 1,
    background: '#01B087',
  });

  soft_remove(logoContainer);
  soft_remove(boxOpen);
  soft_remove(cards);

  const spinner = document.querySelector('.spinner');
  const overline_slide3 = document.querySelector('.overline-slide3');
  overline_slide3.addEventListener('click', () => {
    fire_tag(ACTIONS.CLICK_CTA, 'CLICK2');
  });
  spinner.style.display = 'block';
  overline_slide3.style.display = 'flex';

  gsap.to(overline_slide3, { duration: 1, opacity: 1 });
  gsap.to(spinner, { duration: 1, opacity: 1 });

  floatElements(floats);
  pinFloat.style.display = 'block';
}

// ********************************************************************
const flightLeft = document.querySelector('.flight-lefttoright');
const flightRight = document.querySelector('.flight-righttoleft');
const innerWidth = window.innerWidth;

function animateFlight(el, jahat) {
  const duration = gsap.utils.random(4, 6);
  const delay = gsap.utils.random(0, 1);

  const path_lefttoright = [
    { left: -50, top: 100 },
    { left: innerWidth * 0.3, top: 20 },
    { left: innerWidth * 0.5, top: 5 },
    { left: innerWidth * 0.7, top: 20 },
    { left: innerWidth + 50, top: 100 },
  ];
  const path_righttoleft = [
    { left: innerWidth + 50, top: 100 },
    { left: innerWidth * 0.7, top: 20 },
    { left: innerWidth * 0.5, top: 5 },
    { left: innerWidth * 0.3, top: 20 },
    { left: -50, top: 100 },
  ];

  let path = jahat === 'ltr' ? path_lefttoright : path_righttoleft;

  gsap.set(el, {
    left: path[0].left,
    top: path[0].top,
    rotation: 0,
    transformOrigin: 'center center',
  });

  const tl = gsap.timeline({
    delay,
    onComplete: () => animateFlight(el, jahat),
  });

  tl.to(el, {
    duration,
    motionPath: {
      path,
      curviness: 1.5,
      autoRotate: true,
    },
    ease: 'slow(0.5,0.7,false)',
  });
}

animateFlight(flightLeft, 'ltr');
animateFlight(flightRight, 'rtl');

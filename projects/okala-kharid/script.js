const box = document.querySelector('.box');
const openBox = document.querySelector('.openBox');
const leftSide = document.querySelector('.leftSide');
const centerContainer = document.querySelector('.centerContainer');
const light = document.querySelector('.light');
const bg = document.querySelector('.bg');
const contentElement = document.querySelector('.content');
const contentScrollHeight = contentElement.scrollHeight;
const itemsCount = Math.round(contentScrollHeight / 70) + 1;
let currentSlideNumber = 0;
const products = document.querySelectorAll('.product');
const overlines = document.querySelector('.overlineContainer');
const openDoor = document.querySelector('.openDoor');

const textElement = document.querySelector('.changetext');
const changeTextImages = [
  'changeText1.svg',
  'changeText2.svg',
  'changeText3.svg',
];

gsap.set(openBox, { opacity: 0, display: 'none' });
gsap.set(leftSide, { opacity: 0, display: 'none' });

gsap.set(openDoor, { opacity: 0, display: 'none' });

gsap.set(centerContainer, { x: '-70px', opacity: 0, display: 'none' });
gsap.set(light, { opacity: 0, display: 'none' });

gsap.set(bg, { y: '100%' });
gsap.set(overlines, { y: '100%', x: '100%' });
gsap.set(textElement, { y: '100%', x: '120%', opacity: 0 });

gsap.set(box, {
  x: '-150vw',
  opacity: 1,
});

let timelineStarted = false;
let autoPlayTimeout;

const timeline = gsap.timeline({
  delay: 0.5,
  paused: true,
});

timeline.to(box, {
  x: '-16%',
  duration: 1,
  ease: 'power2.out',
});

timeline.addLabel('waitForClick', '+=0');

function continueTimeline() {
  timeline.addLabel('openBoxInstant', '+=0');

  timeline.to(
    box,
    {
      opacity: 0,
      duration: 0,
      display: 'none',
    },
    'openBoxInstant'
  );

  timeline.to(
    openBox,
    {
      opacity: 1,
      duration: 0,
      display: 'block',
    },
    'openBoxInstant'
  );

  timeline.to(
    [leftSide, openDoor],
    {
      opacity: 1,
      duration: 0.1,
      display: 'block',
    },
    'openBoxInstant'
  );

  timeline.to(
    light,
    {
      x: '-15px',
      opacity: 1,
      duration: 1,
      display: 'block',
    },
    'openBoxInstant'
  );

  timeline.to(
    centerContainer,
    {
      x: '5px',
      opacity: 1,
      duration: 1,
      delay: 1,
      display: 'block',
      ease: 'power2.out',
    },
    'openBoxInstant'
  );

  timeline.addLabel('productIn', '+=0');

  const finalShiftAmount = '-100px';
  const leftSideShiftAmount = '-97px';
  const shiftStartTime = 'productIn+=0.8';

  timeline.to(
    [openBox, centerContainer, light, openDoor],
    {
      x: `+=${finalShiftAmount}`,
      duration: 1,
      ease: 'power1.inOut',
    },
    shiftStartTime
  );

  timeline.to(
    leftSide,
    {
      x: `+=${leftSideShiftAmount}`,
      duration: 1,
      ease: 'power1.inOut',
    },
    shiftStartTime
  );

  timeline.to(
    bg,
    {
      y: '0%',
      duration: 1,
      ease: 'power1.inOut',
    },
    shiftStartTime
  );

  timeline.to(
    overlines,
    {
      y: '0%',
      x: '0%',
      duration: 1,
      ease: 'power1.inOut',
    },
    shiftStartTime
  );

  timeline.to(
    textElement,
    {
      y: '0%',
      x: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power1.inOut',
    },
    shiftStartTime
  );
}

function startTimeline() {
  if (timelineStarted) return;
  timelineStarted = true;
  timeline.play();
}

startTimeline();

autoPlayTimeout = setTimeout(() => {
  continueTimeline();
}, 5000);

box.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  clearTimeout(autoPlayTimeout);
  continueTimeline();
});

(function init() {
  products.forEach((value, key) => {
    if (key !== 0) {
      value.style.opacity = '0';
    }
  });

  textElement.src = changeTextImages[0];
  gsap.set(textElement, { y: '0%', opacity: 1 });
})();

function handleProduct(currentNumber, NextNumber) {
  console.log(NextNumber);

  gsap.to(products[currentNumber % products.length], {
    duration: 0.7,
    opacity: 0,
  });

  gsap.to(products[NextNumber], {
    duration: 0.7,
    opacity: 1,
  });

  const newTextIndex = NextNumber % changeTextImages.length;
  const newSrc = changeTextImages[newTextIndex];

  gsap.to(textElement, {
    y: '-100%',
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      textElement.src = newSrc;
      textElement.onload = () => {
        gsap.set(textElement, { y: '100%' });

        gsap.to(textElement, {
          y: '0%',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      };
    },
  });
}

function handleScroll(percent, scrollPx, heightOfPage) {
  const withPercent = heightOfPage < 3500;
  let newSlideNumber = withPercent
    ? Math.round((percent / 120) * (itemsCount - 1))
    : Math.trunc(scrollPx / 200);

  newSlideNumber %= products.length;
  if (newSlideNumber === currentSlideNumber) {
    return;
  }
  handleProduct(currentSlideNumber, newSlideNumber);
  currentSlideNumber = newSlideNumber;
}

window.addEventListener('message', (e) => {
  if (e.data.type !== 'yn-window-scroll') {
    return;
  }
  handleScroll(e.data.scrolled, e.data.scrolledInPx, e.data.heightOfPage);
});

products.forEach((product) => {
  product.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK3);
  });
});

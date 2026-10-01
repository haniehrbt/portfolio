const contentElement = document.querySelector('.content');
const contentScrollHeight = contentElement.scrollHeight;
const itemsCount = Math.round(contentScrollHeight / 100);

let currentSlideNumber = 0;
let currentBrandNumber = 0;

const products = document.querySelectorAll('.product');
const headers = document.querySelectorAll('.header');
const overlines = document.querySelectorAll('.overline');
const cta = document.querySelector('.cta');
const brands = document.querySelectorAll('.brand');
const brandsOverlines = document.querySelectorAll('.brand-overline');
const productsContainer = document.querySelector('.productsContainer');
const bg = document.querySelector('.bg');
const logo = document.querySelector('.logo');

const tl = gsap.timeline({});

let flag1 = false;
let flag2 = false;

function init() {
  products.forEach((value, key) => {
    if (key !== 0) {
      value.style.opacity = '0';
    } else {
      value.style.opacity = '1';
    }
  });

  tl.to(productsContainer, {
    duration: 1,
    bottom: 0,
  });

  tl.to(bg, {
    delay: 1,
    duration: 1,
    transform: 'scaleX(1)',
    onComplete: () => {
      flag1 = true;
    },
  });

  tl.to(productsContainer, {
    left: '5%',
    transform: 'translateX(0%)',
    duration: 1,
    onComplete: () => {
      show_header(currentSlideNumber);
      setTimeout(() => {
        gsap.to(productsContainer, {
          duration: 1,
          left: '50%',
          transform: 'translateX(calc(-50% + 20px))',
        });
        headers.forEach((header, i) => {
          gsap.to(header, {
            duration: 0.5,
            opacity: 0,
            onComplete: () => {
              header.remove();
            },
          });
        });
        start_brand_interval();
        show_brand(currentBrandNumber);
        show_overline(currentSlideNumber);
        flag2 = true;
        show_brandOverline(currentBrandNumber);
        gsap.to(cta, {
          duration: 0.5,
          opacity: 1,
        });
      }, 8000);
    },
  });
  tl.to(logo, {
    duration: 1,
    bottom: '100px',
  });
}

init();

function show_overline(target) {
  const duration = 1;
  overlines.forEach((value, key) => {
    if (key !== target) {
      gsap.to(value, {
        duration: duration,
        opacity: 0,
      });
    } else {
      gsap.to(value, {
        duration: duration,
        opacity: 1,
      });
    }
  });
}

function show_brand(target) {
  const duration = 1;
  brands.forEach((value, key) => {
    if (key !== target) {
      gsap.to(value, {
        duration: duration,
        opacity: 0,
      });
    } else {
      gsap.to(value, {
        duration: duration,
        opacity: 1,
      });
    }
  });
  switch (Number(target)) {
    case 0:
      fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE01);
      break;
    case 1:
      fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
      break;
    case 2:
      fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE03);
      break;
    case 3:
      fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE04);
      break;
    case 4:
      fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE05);
      break;
    case 5:
      fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE06);
      break;
    default:
      console.log('not found target:', target);
  }
}

function show_brandOverline(target) {
  const duration = 1;
  brandsOverlines.forEach((value, key) => {
    if (key !== target) {
      gsap.to(value, {
        duration: duration,
        opacity: 0,
      });
    } else {
      gsap.to(value, {
        duration: duration,
        opacity: 1,
      });
    }
  });
}

function show_header(target) {
  const duration = 1;
  headers.forEach((value, key) => {
    if (key !== target) {
      gsap.to(value, {
        duration: duration,
        opacity: 0,
      });
    } else {
      gsap.to(value, {
        duration: duration,
        opacity: 1,
      });
    }
  });
}

function handleBackground(currentNumber, NextNumber) {
  gsap.to(products[currentNumber % products.length], {
    duration: 0.7,
    opacity: 0,
  });
  gsap.to(products[NextNumber], {
    duration: 0.7,
    opacity: 1,
  });
  if (flag1) {
    show_header(NextNumber);
  }
  if (flag2) {
    show_overline(NextNumber);
  }
}

function handleScroll(percent, scrollPx, heightOfPage) {
  const withPercent = heightOfPage < 3500;
  let newSlideNumber = withPercent
    ? Math.round((percent / 100) * (itemsCount - 1))
    : Math.trunc(scrollPx / 700);
  newSlideNumber %= products.length;
  if (newSlideNumber === currentSlideNumber) {
    return;
  }
  handleBackground(currentSlideNumber, newSlideNumber);
  currentSlideNumber = newSlideNumber;
}

window.addEventListener('message', (e) => {
  if (e.data.type !== 'yn-window-scroll') {
    return;
  }
  handleScroll(e.data.scrolled, e.data.scrolledInPx, e.data.heightOfPage);
});

function start_brand_interval() {
  function handler() {
    currentBrandNumber = (currentBrandNumber + 1) % brands.length;
    show_brandOverline(currentBrandNumber);
    show_brand(currentBrandNumber);
  }

  setInterval(handler, 4000);
}

cta.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK1);
});

productsContainer.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK2);
});

logo.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK3);
});

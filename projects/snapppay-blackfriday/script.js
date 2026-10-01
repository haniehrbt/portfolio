const gifContainer = document.querySelector('.gif-container');
const productContainer = gifContainer.querySelector('.product-container');
const soundElement = document.querySelector('.sound');
const day = document.querySelector('.day');
const hour = document.querySelector('.hour');
const minute = document.querySelector('.minute');
const second = document.querySelector('.second');
const introLogo = document.querySelector('.intro-logo');
const targetDate = new Date('2025-11-28T00:00:00').getTime();
const percent = document.querySelector('.percent');
const whiteBG = document.querySelector('.white-card');

let audio = null;
let playing = false;

gifContainer.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK2);
});

introLogo.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK5);
});

soundElement.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!audio) {
    audio = new Audio('output.mp3');
    fire_tag(ALL_EVENT_TYPES.CLICK1);
    audio.addEventListener('ended', () => {
      if (playing) {
        audio.currentTime = 0;
        audio.play();
      }
    });
  }

  if (!playing) {
    audio.play();
    playing = true;
  } else {
    audio.pause();
    playing = false;
  }
});

function toPersianDigits(str) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    if (day) day.textContent = '۰';
    if (hour) hour.textContent = '۰۰';
    if (minute) minute.textContent = '۰۰';
    if (second) second.textContent = '۰۰';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (day) day.textContent = toPersianDigits(days);
  if (hour)
    hour.textContent = toPersianDigits(hours.toString().padStart(2, '0'));
  if (minute)
    minute.textContent = toPersianDigits(minutes.toString().padStart(2, '0'));
  if (second)
    second.textContent = toPersianDigits(seconds.toString().padStart(2, '0'));
}

updateCountdown();
setInterval(updateCountdown, 1000);

const gifElements = [null, null, null, null];
const productElements = [null, null, null, null];
let last_index = null;
const productsData = [
  {
    product: 'product1.png',
    gif: 'black_fast.gif',
    logo: 'techno.svg',
    overline: 'techno-overline.png',
  },
  {
    product: 'product2.png',
    gif: 'blue_fast.gif',
    logo: 'jeanwest.png',
    overline: 'jeanwest-overline.png',
  },
  {
    product: 'product3-1.png',
    gif: 'red_fast.gif',
    logo: 'charm.png',
    overline: 'charm-overline.png',
  },
  {
    product: 'product4-1.png',
    gif: 'yellow_fast.gif',
    logo: 'meow.svg',
    overline: 'meow-overline.png',
  },
  {
    product: 'product5.png',
    gif: 'pink_fast.gif',
    logo: 'khanoumi.svg',
    overline: 'khanoumi-overline.png',
  },
  {
    product: 'product6.png',
    gif: 'yellow_fast.gif',
    logo: 'filimo.svg',
    overline: 'filimo-overline.png',
  },
  {
    product: 'product7.png',
    gif: 'blue_fast.gif',
    logo: 'janebi.svg',
    overline: 'janebi-overline.png',
  },
  {
    product: 'product8.png',
    gif: 'yellow_fast.gif',
    logo: 'irancell.svg',
    overline: 'irancell-overline.png',
  },
];

function restartGif(imgElement, index) {
  const newGif = imgElement.cloneNode(true);
  imgElement.parentNode.replaceChild(newGif, imgElement);
  gifElements[index] = newGif;
  return newGif;
}

function insertRandomProduct() {
  productElements.forEach((element) => {
    if (element) {
      element.style.opacity = '0';
    }
  });

  gifElements.forEach((element) => {
    if (element) {
      element.style.opacity = '0';
    }
  });

  let index = Math.floor(Math.random() * productsData.length);
  if (last_index && index === last_index) {
    index = (index + 1) % productsData.length;
  }
  last_index = index;
  console.log(index);
  introLogo.querySelector('.brand').src = productsData[index].logo;
  logos.querySelector('.brand').src = productsData[index].logo;

  let gifImg = null;
  let productImg = null;
  if (!gifElements[index]) {
    gifImg = document.createElement('img');
    gifImg.classList.add('gif');
    gifImg.src = productsData[index].gif;
    gifContainer.querySelector('div').appendChild(gifImg);
    gifElements[index] = gifImg;
    productImg = document.createElement('img');
    productImg.classList.add('product');
    productImg.src = productsData[index].product;
    productContainer.appendChild(productImg);
    productElements[index] = productImg;
  } else {
    gifImg = restartGif(gifElements[index], index);
    productImg = productElements[index];
  }
  gsap.to(overline, { opacity: 0, duration: 0.2 });
  overline.src = productsData[index].overline;
  gsap.to(header, { opacity: 1, duration: 0.2 });
  gsap.to(gifImg, { opacity: 1, duration: 0 });
  gsap.to(productImg, { opacity: 1, duration: 0.5, delay: 2 });
  gsap.to(whiteBG, { opacity: 1, duration: 0.5, delay: 2 });
}

function turnLeftGifs() {
  gsap.to(gifContainer, {
    duration: 1,
    left: '5%',
    width: '93px',
    transform: 'translateX(0)',
  });

  gsap.to(introLogo, {
    duration: 1,
    left: '-130px',
  });

  gsap.to(productContainer, {
    right: '16px',
  });

  gifElements.forEach((gif) => {
    if (gif) {
      gsap.to(gif, {
        right: '-23px',
        transform: 'translateX(0)',
      });
    }
  });
}

function turnRightGifs() {
  whiteBG.style.opacity = '0';
  gsap.to(gifContainer, {
    duration: 1,
    left: '50%',
    width: '278px',
    transform: 'translateX(-50%)',
  });

  gsap.to(introLogo, {
    delay: 1,
    duration: 1,
    left: '0px',
  });

  gsap.to(productContainer, {
    right: '20px',
    left: 'initial',
  });

  gifElements.forEach((gif) => {
    if (gif) {
      gsap.to(gif, {
        right: '50px',
        transform: 'translateX(50%)',
      });
    }
  });
}

const bg = document.querySelector('.bg');
const logos = document.querySelector('.logo-Container');
const texts = document.querySelector('.texts-container');
const countdown = document.querySelector('.countdown-container');

document.querySelector('.cta').addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK3);
});

soundElement.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK4);
});

function handle_slide2() {
  [bg, logos, texts, countdown, percent].forEach((el) => {
    gsap.to(el, { duration: 1, opacity: 1 });
  });
  gsap.to(overline, { duration: 0.5, opacity: 1, delay: 3 });
  gsap.to(header, { duration: 1, opacity: 0, delay: 3 });
}

function fadeoutSlide2() {
  [bg, logos, texts, countdown, percent].forEach((el) => {
    gsap.to(el, { duration: 0.2, opacity: 0 });
  });
}

const overline = document.querySelector('.overline');
const header = document.querySelector('.header');

function handle_loop() {
  turnRightGifs();
  fadeoutSlide2();
  insertRandomProduct();
  setTimeout(turnLeftGifs, 4500);
  setTimeout(handle_slide2, 4500);
}

handle_loop();
setInterval(handle_loop, 10500);

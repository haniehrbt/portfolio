const left = document.querySelector('.container-left');
const right = document.querySelector('.container-right');
const logo = document.querySelector('.logo');
const hands = document.querySelectorAll('.hand');
let firstClick = true;
const introRight = document.querySelector('.intro-right');
const introLeft = document.querySelector('.intro-left');
const leftHeader = document.querySelector('.inner-left .header');
const rightHeader = document.querySelector('.inner-right .header');
const rightOverline = document.querySelector('.inner-right .overline');
const leftOverline = document.querySelector('.inner-left .overline');
const leftCta = document.querySelector('.inner-left .cta');
const rightCta = document.querySelector('.inner-right .cta');

function removeHands() {
  hands.forEach((hand) => hand.remove());
}

function goRight(element, right, duration = 1) {
  gsap.to(element, {
    right: right,
    duration: duration,
    onComplete: () => {
      element.remove();
    },
  });
}

function goLeft(element, left, duration = 1) {
  gsap.to(element, {
    left: left,
    duration: duration,
    onComplete: () => {
      element.remove();
    },
  });
}

left.addEventListener('click', (e) => {
  if (!firstClick) {
    return;
  }
  firstClick = false;
  e.preventDefault();
  e.stopPropagation();
  fire_tag(ALL_EVENT_TYPES.CLICK1);
  removeHands();
  goRight(logo, '-100px');
  goRight(right, '-300px', 2);
  setTimeout(openLeft, 1000);
});

right.addEventListener('click', (e) => {
  if (!firstClick) {
    return;
  }
  firstClick = false;
  e.preventDefault();
  e.stopPropagation();
  fire_tag(ALL_EVENT_TYPES.CLICK2);
  removeHands();
  goRight(logo, '-100px');
  goLeft(left, '-300px');
  setTimeout(openRight, 1000);
});

logo.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK3);
});

function openRight() {
  gsap.to(right, {
    duration: 1,
    right: '5%',
    width: '90%',
  });
  gsap.to('.inner-right .color', {
    borderRadius: '10px',
    duration: 1,
  });
  gsap.to(introRight, {
    duration: 1,
    right: 0,
    onComplete: () => {
      gsap.to('.inner-right .bg', {
        duration: 1,
        opacity: 1,
      });
      gsap.to(rightHeader, {
        duration: 1,
        opacity: 0,
        onComplete: () => {
          rightHeader.remove();
          comeRightOverline();
        },
      });
    },
  });
}

function openLeft() {
  gsap.to(left, {
    duration: 1,
    left: '5%',
    width: '90%',
  });

  gsap.to('.inner-left .intro', {
    right: 0,
    duration: 1,
  });
  gsap.to('.inner-left .color', {
    borderRadius: '10px',
    duration: 1,
    onComplete: () => {
      gsap.to('.inner-left .bg', {
        duration: 1,
        opacity: 1,
      });
      gsap.to(leftHeader, {
        duration: 1,
        opacity: 0,
        onComplete: () => {
          leftHeader.remove();
          comeLeftOverline();
        },
      });
    },
  });
}

function comeLeftOverline() {
  gsap.to(leftOverline, {
    duration: 1,
    opacity: 1,
  });
  gsap.to(leftCta, {
    duration: 1,
    opacity: 1,
    onComplete: () => {
      leftCta.classList.add('tapesh2');
    },
  });
}

function comeRightOverline() {
  gsap.to(rightOverline, {
    duration: 1,
    opacity: 1,
  });
  gsap.to(rightCta, {
    duration: 1,
    opacity: 1,
    onComplete: () => {
      rightCta.classList.add('tapesh2');
    },
  });
}

rightCta.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK4);
});

leftCta.addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK5);
});

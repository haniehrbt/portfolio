const mobile = document.querySelector('.left-1');
const arrows = document.querySelectorAll('.arrows');
const boxes = document.querySelectorAll('.boxes');
const slide1 = document.querySelector('.slide1');
const right = document.querySelector('.right-1');
let previousBoxIndex = null;
let selectedMusic = {};
const cta = document.querySelector('.cta');

function init() {
  gsap.fromTo(
    mobile,
    { top: 100, opacity: 0 },
    { top: 0, opacity: 1, duration: 0.7 }
  );
  gsap.fromTo(
    boxes,
    { top: 100, opacity: 0 },
    { top: 0, opacity: 1, duration: 0.7 }
  );
  gsap.to(right, { right: 0 });
}

init();

function changeBox(index) {
  const img = boxes[index].querySelector('img');

  if (previousBoxIndex === index) {
    console.log('Same box clicked - stopping audio and reverting to white');
    audioFiles[index].pause();
    audioFiles[index].currentTime = 0;
    img.src = originalImages[index];
    previousBoxIndex = null;
    return;
  }

  if (previousBoxIndex !== null && previousBoxIndex !== index) {
    boxes[previousBoxIndex].querySelector('img').src =
      originalImages[previousBoxIndex];
  }

  img.src = newImages[index];

  audioFiles.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  console.log('Playing audio:', audioFiles[index].src);
  audioFiles[index].play();

  const timeline = gsap.timeline();

  timeline.to(arrows, {
    opacity: 0,
    duration: 0.1,
    stagger: 0.05,
    onComplete: () => {
      arrows.forEach((arrow) => (arrow.style.display = 'none'));
    },
  });

  previousBoxIndex = index;
}

boxes.forEach((box, index) => {
  box.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    fire_tag(ALL_EVENT_TYPES.CLICK1);
    RBT_CODE = musics[index].code;
    selectedMusic = musics[index];
    changeBox(index);
  });
});
cta.addEventListener('click', (e) => {
  fire_tag(ALL_EVENT_TYPES.CLICK2);
});

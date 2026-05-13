const ctaButton = document.querySelector('.cta');
const product = document.querySelector('.product');
const copyElement = document.querySelector('.copy p');
const bg1Element = document.querySelector('.bg1');

const copySrc = ['اتاق‌کودکت‌رو', 'دفترکارت‌رو', 'آشپزخونه‌ات‌رو'];
const picSrc = ['./pic1.png', './pic2.png', './pic3.png'];
const alternatePicSrc = ['./pic1-1.png', './pic2-1.png', './pic3-1.png'];

let currentContentIndex = 0;
let isAlternatePic = false;

function updateContent(index, finalSwap = false) {
  const newTextPart = copySrc[index];
  const currentStatus = finalSwap ? !isAlternatePic : isAlternatePic;
  const newPicPath = currentStatus ? alternatePicSrc[index] : picSrc[index];

  if (copyElement) {
    const newContent = `<span class="title">باپالاز</span><br> ${newTextPart} <br>ازاین‌روبه<span class="mirror">‌اون‌رو‌کن</span>`;
    copyElement.innerHTML = newContent;
  }

  if (product) {
    product.src = newPicPath;
  }
}

function initializeRandomContent() {
  if (
    copySrc.length === 0 ||
    picSrc.length === 0 ||
    copySrc.length !== picSrc.length ||
    picSrc.length !== alternatePicSrc.length
  ) {
    console.error('Content arrays are invalid or lengths do not match.');
    return;
  }

  currentContentIndex = Math.floor(Math.random() * copySrc.length);
  isAlternatePic = false;
  updateContent(currentContentIndex);
}

initializeRandomContent();

let isFirstClick = true;

ctaButton.addEventListener('click', (e) => {
  if (isFirstClick) {
    e.preventDefault();
    e.stopPropagation();
    fire_tag(ALL_EVENT_TYPES.CLICK1);
    isFirstClick = false;
  }

  const currentMirrorText = document.querySelector('.mirror');

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      isAlternatePic = !isAlternatePic;
    },
  });

  if (bg1Element) {
    tl.to(
      bg1Element,
      {
        rotation: '+=180',
        duration: 0.75,
        ease: 'power1.in',
        opacity: 1,
      },
      0
    );
  }

  tl.to(
    product,
    {
      rotation: '+=180',
      opacity: 0,
      duration: 0.75,
      ease: 'power1.in',
      onStart: () => {
        if (currentMirrorText) {
          gsap.to(currentMirrorText, {
            scaleY: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      },
    },
    0
  );

  tl.call(() => {
    updateContent(currentContentIndex, true);
    const newMirrorText = document.querySelector('.mirror');
    if (newMirrorText) {
      gsap.set(newMirrorText, { scaleY: 1 });
    }
  });

  if (bg1Element) {
    tl.to(
      bg1Element,
      {
        rotation: '+=180',
        duration: 0.5,
        ease: 'power1.out',
        opacity: 1,
      },
      '<'
    );
  }

  tl.to(
    product,
    {
      rotation: '+=180',
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out',
    },
    '<'
  );
  ctaButton.addEventListener('click', (e) => {
    fire_tag(ALL_EVENT_TYPES.CLICK2);
  });

  tl.play();
});

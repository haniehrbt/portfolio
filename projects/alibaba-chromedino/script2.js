const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const resetBtn = document.getElementById('resetBtn');
const startScreen = document.getElementById('startScreen');
let gateElement = document.querySelector('.gate');
const unmuteElement = document.querySelector('.unmute');
const logoElement = document.querySelector('.logo');
let box1Element = document.querySelector('.box1');
let box2Element = document.querySelector('.box2');
const gameAreaElement = document.querySelector('.game-area');
let startButtonBoostTimeout = null;
let startButtonBoostInterval = null;
let startButtonBoostTween = null;

const audio = new Audio('audio.mp3');
audio.loop = true;

const win = new Audio('win.mp3');
const lose = new Audio('lose.mp3');

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let bonusScore = 0;
let gameSpeed = 4;
let obstacles = [];
let clouds = [];
let gifts = [];
let animationFrame = 0;
let nextCloudFrame = 0;
let nextGiftFrame = 0;
let dinoJumpVelocity = 0;
let dinoY = 150;
let gravityMultiplier = 1; // برای تسریع در سقوط هنگام لمس
let pointerInputLocked = false;
const CITY_HEIGHT = 90;
let cityOffset = 0;
let cityReady = false;
const cityImage = new Image();
cityImage.src = 'city.svg';

cityImage.onload = () => {
  cityReady = true;
};

// Ground collision (will be set dynamically)
let GROUND_Y = 150;

// Set canvas size based on screen
function setCanvasSize() {
  const maxWidth = 800;
  const minHeight = 150;

  const previousGroundY = GROUND_Y;

  const screenWidth = Math.min(window.innerWidth, maxWidth);
  const height = minHeight;

  const targetWidth =
    gameAreaElement && gameAreaElement.clientWidth
      ? Math.min(gameAreaElement.clientWidth, maxWidth)
      : screenWidth;
  const targetHeight =
    gameAreaElement && gameAreaElement.clientHeight
      ? Math.max(gameAreaElement.clientHeight, minHeight)
      : height;

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  GROUND_Y = canvas.height - 50;

  const isOnGround =
    Math.abs(dinoY - (previousGroundY - 10)) < 1 && dinoJumpVelocity === 0;

  if (gameState !== 'playing' || isOnGround) {
    dinoY = GROUND_Y;
  }

  cityOffset = 0;
}

// Initialize canvas size
setCanvasSize();

// Update on resize
window.addEventListener('resize', () => {
  setCanvasSize();
});

if (typeof ResizeObserver !== 'undefined' && gameAreaElement) {
  const canvasResizeObserver = new ResizeObserver(() => {
    setCanvasSize();
  });
  canvasResizeObserver.observe(gameAreaElement);
}

// Dino images
const dinoImages = {
  run1: new Image(),
  run15: new Image(),
  run2: new Image(),
  dead: new Image(),
  start: new Image(),
};

dinoImages.run1.src = 'DinoRun1.5.png';
dinoImages.run15.src = 'DinoRun1.png';
dinoImages.run2.src = 'DinoRun2.png';
dinoImages.dead.src = 'DinoDead.png';
dinoImages.start.src = 'DinoStart.png';

// Load images
let imagesLoaded = 0;
const totalImages = 5;

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    gameLoop();
  }
}

dinoImages.run1.onload = checkImagesLoaded;
dinoImages.run15.onload = checkImagesLoaded;
dinoImages.run2.onload = checkImagesLoaded;
dinoImages.dead.onload = checkImagesLoaded;
dinoImages.start.onload = checkImagesLoaded;

// Cactus obstacle images (three types)
const cactusTypes = [
  { src: 'cactus1.svg', height: 70 },
  { src: 'cactus2.svg', height: 60 },
  { src: 'cactus3.svg', height: 30 },
];

cactusTypes.forEach((type) => {
  type.image = new Image();
  type.image.src = type.src;
});

// Gift images (collectibles)
const giftTypes = [
  { src: 'gift1.svg', height: 35 },
  { src: 'gift2.svg', height: 30 },
  { src: 'gift3.svg', height: 40 },
];

giftTypes.forEach((type) => {
  type.image = new Image();
  type.image.src = type.src;
});

// Cloud image
const cloudImage = new Image();
cloudImage.src = 'clound.svg';

// Tree image (fixed position)
const treeImage = new Image();
treeImage.src = 'tree.svg';

const DINO_VERTICAL_OFFSET = 10;
const DINO_COLLISION_TOP_OFFSET = 20;
const TREE_HEIGHT = 40;
const TREE_MARGIN_LEFT = 10;
const TREE_MARGIN_BOTTOM = 0;
const TREE_VERTICAL_OFFSET = 10;
let treeWidth = 0;
let treeX = TREE_MARGIN_LEFT;

treeImage.onload = () => {
  if (treeImage.naturalHeight > 0) {
    const ratio = treeImage.naturalWidth / treeImage.naturalHeight;
    treeWidth = TREE_HEIGHT * ratio;
  }
};

// Airplane image (intro animation)
const airplaneImage = new Image();
airplaneImage.src = 'airplane.svg';

let introAirplane = null;
let introAirplaneSpawned = false;

function spawnIntroAirplane() {
  if (introAirplaneSpawned) {
    return;
  }

  const ensureDimensions = () => {
    const height = airplaneImage.naturalHeight
      ? Math.max(30, airplaneImage.naturalHeight)
      : 50;
    const width =
      airplaneImage.naturalWidth && airplaneImage.naturalHeight
        ? height * (airplaneImage.naturalWidth / airplaneImage.naturalHeight)
        : 120;

    const y = 25;

    introAirplane = {
      x: -width - 40,
      y,
      width,
      height,
      speed: gameSpeed + 2,
    };
    introAirplaneSpawned = true;
  };

  if (!airplaneImage.complete || airplaneImage.naturalWidth === 0) {
    airplaneImage.onload = () => {
      ensureDimensions();
    };
  } else {
    ensureDimensions();
  }
}

let gateAnimated = false;
let boxToggleInterval = null;
let boxToggleTimeout = null;
let activeBoxIndex = 1;

function animateGateExit() {
  if (gateAnimated || !gateElement || typeof gsap === 'undefined') {
    return;
  }

  gateAnimated = true;

  gsap.to(gateElement, {
    duration: 1,
    x: '150%',
    ease: 'power2.in',
    onComplete: () => {
      gateElement.remove();
      gateElement = null;
      gameState = 'playing';
    },
  });
}

function ensureBoxes() {
  if (!gameAreaElement) {
    return;
  }

  if (!box1Element) {
    box1Element = document.createElement('img');
    box1Element.className = 'box1';
    box1Element.src = 'box1.svg';
    gameAreaElement.appendChild(box1Element);
  }

  if (!box2Element) {
    box2Element = document.createElement('img');
    box2Element.className = 'box2';
    box2Element.src = 'box2.svg';
    gameAreaElement.appendChild(box2Element);
  }

  if (typeof gsap !== 'undefined') {
    gsap.set(box1Element, { opacity: 1, y: 0 });
    gsap.set(box2Element, { opacity: 0, y: 0 });
  } else {
    box1Element.style.opacity = '1';
    box1Element.style.transform = 'translateY(0)';
    box2Element.style.opacity = '0';
    box2Element.style.transform = 'translateY(0)';
  }

  activeBoxIndex = 1;
}

function toggleBoxes() {
  if (!box1Element || !box2Element || typeof gsap === 'undefined') {
    return;
  }

  const currentBox = activeBoxIndex === 1 ? box1Element : box2Element;
  const nextBox = activeBoxIndex === 1 ? box2Element : box1Element;

  gsap.to(currentBox, {
    duration: 0.5,
    opacity: 0,
    y: 15,
    ease: 'power1.inOut',
  });

  gsap.fromTo(
    nextBox,
    { opacity: 0, y: 15 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    }
  );

  activeBoxIndex = activeBoxIndex === 1 ? 2 : 1;
}

function startBoxToggleLoop() {
  if (
    !box1Element ||
    !box2Element ||
    boxToggleInterval !== null ||
    boxToggleTimeout !== null
  ) {
    return;
  }

  boxToggleTimeout = setTimeout(() => {
    toggleBoxes();
    boxToggleInterval = setInterval(toggleBoxes, 3000);
    boxToggleTimeout = null;
  }, 3000);
}

function stopBoxToggleLoop(removeElements = false) {
  if (boxToggleTimeout !== null) {
    clearTimeout(boxToggleTimeout);
    boxToggleTimeout = null;
  }

  if (boxToggleInterval !== null) {
    clearInterval(boxToggleInterval);
    boxToggleInterval = null;
  }

  if (typeof gsap !== 'undefined') {
    gsap.killTweensOf([box1Element, box2Element]);
  }

  if (removeElements) {
    if (box1Element) {
      box1Element.remove();
      box1Element = null;
    }
    if (box2Element) {
      box2Element.remove();
      box2Element = null;
    }
  } else if (box1Element && box2Element) {
    if (typeof gsap !== 'undefined') {
      gsap.set(box1Element, { opacity: 1, y: 0 });
      gsap.set(box2Element, { opacity: 0, y: 0 });
    } else {
      box1Element.style.opacity = '1';
      box1Element.style.transform = 'translateY(0)';
      box2Element.style.opacity = '0';
      box2Element.style.transform = 'translateY(0)';
    }
    activeBoxIndex = 1;
  }
}

function triggerStartButtonBoost() {
  if (
    !startScreen ||
    startScreen.classList.contains('hidden') ||
    typeof gsap === 'undefined'
  ) {
    return;
  }

  if (startButtonBoostTween) {
    startButtonBoostTween.kill();
  }

  startButtonBoostTween = gsap.timeline({
    onComplete: () => {
      startButtonBoostTween = null;
    },
  });
  startButtonBoostTween
    .to(startScreen, {
      duration: 0.35,
      scale: 2,
      transformOrigin: 'center center',
      ease: 'power2.out',
      overwrite: 'auto',
    })
    .to(startScreen, {
      delay: 1,
      duration: 0.45,
      scale: 1,
      transformOrigin: 'center center',
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
}

function startStartButtonBoostLoop() {
  if (!startScreen || typeof gsap === 'undefined') {
    return;
  }

  stopStartButtonBoostLoop();

  startButtonBoostTimeout = setTimeout(() => {
    triggerStartButtonBoost();
    startButtonBoostInterval = setInterval(triggerStartButtonBoost, 10000);
  }, 10000);
}

function stopStartButtonBoostLoop(resetScale = false) {
  if (startButtonBoostTimeout !== null) {
    clearTimeout(startButtonBoostTimeout);
    startButtonBoostTimeout = null;
  }

  if (startButtonBoostInterval !== null) {
    clearInterval(startButtonBoostInterval);
    startButtonBoostInterval = null;
  }

  if (startButtonBoostTween) {
    startButtonBoostTween.kill();
    startButtonBoostTween = null;
  }

  if (resetScale && startScreen && typeof gsap !== 'undefined') {
    gsap.set(startScreen, { scale: 1 });
  }
}

// Initialize game
function init() {
  obstacles = [];
  clouds = [];
  gifts = [];
  introAirplane = null;
  introAirplaneSpawned = false;
  score = 0;
  bonusScore = 0;
  gameSpeed = 4;
  animationFrame = 0;
  nextCloudFrame = Math.random() * 100 + 100;
  nextGiftFrame = Math.random() * 200 + 200;
  dinoJumpVelocity = 0;
  dinoY = GROUND_Y - 1;
  gameState = 'start';
  gameOverElement.classList.remove('active');
  startScreen.classList.remove('hidden');
  stopStartButtonBoostLoop(true);
  startStartButtonBoostLoop();
  ensureBoxes();
  startBoxToggleLoop();
  treeX = TREE_MARGIN_LEFT;
  cityOffset = 0;
}

// Get random obstacle
function getRandomObstacle() {
  const type = cactusTypes[Math.floor(Math.random() * cactusTypes.length)];
  const obstacle = {
    image: type.image,
    height: type.height,
  };

  if (obstacle.image.complete && obstacle.image.naturalHeight > 0) {
    const widthHeightRatio =
      obstacle.image.naturalWidth / obstacle.image.naturalHeight;
    obstacle.width = obstacle.height * widthHeightRatio;
  } else {
    obstacle.width = obstacle.height;
  }

  return obstacle;
}

// Create obstacle
function createObstacle() {
  const obstacle = getRandomObstacle();
  obstacles.push({
    x: canvas.width,
    y: GROUND_Y - obstacle.height - 10,
    ...obstacle,
  });
}

// Create cloud
function createCloud() {
  clouds.push({
    x: canvas.width,
    y: Math.random() * 50,
    width: 50,
    height: 30,
  });
}

function createGift() {
  const type = giftTypes[Math.floor(Math.random() * giftTypes.length)];
  const gift = {
    image: type.image,
    height: type.height,
    x: canvas.width,
  };

  if (gift.image.complete && gift.image.naturalHeight > 0) {
    const ratio = gift.image.naturalWidth / gift.image.naturalHeight;
    gift.width = gift.height * ratio;
  } else {
    gift.width = gift.height;
  }

  const spawnOnGround = Math.random() < 0.5;
  if (spawnOnGround) {
    gift.y = GROUND_Y - gift.height - 10;
  } else {
    const minY = 30;
    const maxY = Math.max(minY, GROUND_Y - gift.height - 60);
    gift.y = Math.random() * (maxY - minY) + minY;
  }

  gifts.push(gift);
}

// Update game
function update() {
  updateIntroAirplane();

  if (gameState !== 'playing') return;

  animationFrame++;

  // Jump physics
  if (dinoJumpVelocity !== 0 || dinoY !== GROUND_Y - 10) {
    dinoY += dinoJumpVelocity;
    dinoJumpVelocity += 0.65 * gravityMultiplier; // gravity with multiplier

    if (dinoY >= GROUND_Y - 10) {
      dinoY = GROUND_Y - 10;
      dinoJumpVelocity = 0;
      gravityMultiplier = 1; // reset when on ground
    }
  }

  // Spawn obstacles
  if (animationFrame % 100 === 0) {
    createObstacle();
  }

  // Spawn clouds
  if (animationFrame >= nextCloudFrame) {
    createCloud();
    nextCloudFrame = animationFrame + Math.random() * 150;
  }

  if (animationFrame >= nextGiftFrame) {
    createGift();
    nextGiftFrame = animationFrame + Math.random() * 250 + 200;
  }

  // Update obstacles
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed;
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }
  });

  // Update clouds
  clouds.forEach((cloud, index) => {
    cloud.x -= gameSpeed * 0.5;
    if (cloud.x + cloud.width < 0) {
      clouds.splice(index, 1);
    }
  });

  // Update gifts
  gifts.forEach((gift, index) => {
    gift.x -= gameSpeed;
    if (gift.x + gift.width < 0) {
      gifts.splice(index, 1);
    }
  });

  if (cityReady && canvas.width > 0) {
    cityOffset -= gameSpeed;
    if (cityOffset <= -canvas.width) {
      cityOffset += canvas.width;
    }
  }

  if (treeX !== null) {
    treeX -= gameSpeed;
    const currentTreeWidth = treeWidth || TREE_HEIGHT;
    if (treeX + currentTreeWidth < -20) {
      treeX = null;
    }
  }

  // Collision detection
  obstacles.forEach((obstacle) => {
    if (gameState === 'gameover') {
      return;
    }

    const dinoRect = {
      x: 105,
      y: dinoY - DINO_COLLISION_TOP_OFFSET + DINO_VERTICAL_OFFSET,
      width: 30,
      height: 40,
    };

    const obstacleRect = {
      x: obstacle.x,
      y: obstacle.y + 30,
      width: obstacle.width,
      height: obstacle.height,
    };

    if (
      dinoRect.x < obstacleRect.x + obstacleRect.width &&
      dinoRect.x + dinoRect.width > obstacleRect.x &&
      dinoRect.y < obstacleRect.y + obstacleRect.height &&
      dinoRect.y + dinoRect.height > obstacleRect.y
    ) {
      lose.currentTime = 0;
      lose.play();
      gameState = 'gameover';
      gameOverElement.classList.add('active');
      handleFinishGame();
      startScreen.classList.add('hidden');
      stopStartButtonBoostLoop(true);
    }
  });

  // Gift collision detection
  gifts.forEach((gift, index) => {
    const giftRect = {
      x: gift.x,
      y: gift.y,
      width: gift.width,
      height: gift.height,
    };

    const dinoRect = {
      x: 105,
      y: dinoY - DINO_COLLISION_TOP_OFFSET + DINO_VERTICAL_OFFSET,
      width: 30,
      height: 40,
    };

    if (
      dinoRect.x < giftRect.x + giftRect.width &&
      dinoRect.x + dinoRect.width > giftRect.x &&
      dinoRect.y < giftRect.y + giftRect.height &&
      dinoRect.y + dinoRect.height > giftRect.y
    ) {
      bonusScore += 30;
      win.currentTime = 0;
      win.play();
      gifts.splice(index, 1);
    }
  });

  // Update score
  const baseScore = Math.floor(animationFrame / 10);
  score = baseScore + bonusScore;
  scoreElement.textContent = score;

  // Increase speed
  if (score % 50 === 0 && gameSpeed < 12) {
    gameSpeed += 0.1;
  }
}

function updateIntroAirplane() {
  if (!introAirplane) {
    return;
  }

  introAirplane.x += introAirplane.speed;
  if (introAirplane.x > canvas.width + introAirplane.width) {
    introAirplane = null;
  }
}

// Draw game
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw clouds
  clouds.forEach((cloud) => {
    ctx.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);
  });

  if (introAirplane) {
    ctx.drawImage(
      airplaneImage,
      introAirplane.x,
      introAirplane.y,
      introAirplane.width,
      introAirplane.height
    );
  }

  if (cityReady && canvas.width > 0) {
    const cityY = canvas.height - CITY_HEIGHT + 15;
    ctx.drawImage(cityImage, cityOffset, cityY, canvas.width, CITY_HEIGHT);
    ctx.drawImage(
      cityImage,
      cityOffset + canvas.width - 4,
      cityY,
      canvas.width,
      CITY_HEIGHT
    );
  }

  if (treeImage.complete && treeWidth > 0 && treeX !== null) {
    const treeY = 78 + TREE_VERTICAL_OFFSET;
    ctx.drawImage(treeImage, treeX, treeY, treeWidth, TREE_HEIGHT);
  }

  // Draw obstacles
  obstacles.forEach((obstacle) => {
    ctx.drawImage(
      obstacle.image,
      obstacle.x,
      obstacle.y + 40,
      obstacle.width,
      obstacle.height
    );
  });

  // Draw gifts
  gifts.forEach((gift) => {
    ctx.drawImage(gift.image, gift.x, gift.y, gift.width, gift.height);
  });

  // Draw dino
  if (gameState === 'start') {
    ctx.drawImage(dinoImages.start, 105, dinoY - 30, 35, 60);
  } else if (gameState === 'gameover') {
    ctx.drawImage(
      dinoImages.dead,
      105,
      dinoY - 30 + DINO_VERTICAL_OFFSET,
      35,
      60
    );
  } else {
    // Animate dino running
    const runFrame = Math.floor(animationFrame / 8) % 3;
    if (runFrame === 0) {
      ctx.drawImage(
        dinoImages.run1,
        105,
        dinoY - 30 + DINO_VERTICAL_OFFSET,
        35,
        60
      );
    } else if (runFrame === 1) {
      ctx.drawImage(
        dinoImages.run15,
        105,
        dinoY - 30 + DINO_VERTICAL_OFFSET,
        35,
        60
      );
    } else {
      ctx.drawImage(
        dinoImages.run2,
        105,
        dinoY - 30 + DINO_VERTICAL_OFFSET,
        35,
        60
      );
    }
  }
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Handle jump/fast fall logic
function handleJump() {
  if (gameState === 'start') {
    audio.play();
    stopStartButtonBoostLoop(true);
    startScreen.classList.add('hidden');
    stopBoxToggleLoop(true);
    spawnIntroAirplane();
    animateGateExit();
  } else if (gameState === 'playing') {
    if (dinoY === GROUND_Y - 10) {
      dinoJumpVelocity = -12;
    } else {
      gravityMultiplier = 3;
    }
  }
}

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (e.repeat) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    handleJump();
  }
});

function shouldIgnorePrimaryInput(target) {
  if (!target) {
    return false;
  }
  if (target === resetBtn) {
    return true;
  }
  if (typeof target.closest === 'function') {
    if (target.closest('.game-over')) {
      return true;
    }
    if (target.closest('.unmute')) {
      return true;
    }
  }
  if (
    target.classList &&
    (target.classList.contains('logo') ||
      target.classList.contains('cta') ||
      target.classList.contains('unmute'))
  ) {
    return true;
  }
  return false;
}

function triggerPrimaryInput(e) {
  const target = e.target instanceof Element ? e.target : null;
  if (shouldIgnorePrimaryInput(target)) {
    return;
  }
  if (pointerInputLocked) {
    e.preventDefault();
    return;
  }
  pointerInputLocked = true;
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  if (typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
  handleJump();
}

function releasePrimaryInput() {
  pointerInputLocked = false;
}

document.addEventListener(
  'click',
  (e) => {
    triggerPrimaryInput(e);
  },
  { passive: false }
);

document.addEventListener('touchend', releasePrimaryInput, { passive: true });
document.addEventListener('touchcancel', releasePrimaryInput, {
  passive: true,
});

document.body.addEventListener(
  'mousedown',
  (e) => {
    triggerPrimaryInput(e);
  },
  true
);

document.body.addEventListener(
  'mouseup',
  () => {
    releasePrimaryInput();
  },
  true
);

document.body.addEventListener(
  'mouseleave',
  () => {
    releasePrimaryInput();
  },
  true
);

document.body.addEventListener(
  'click',
  (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (shouldIgnorePrimaryInput(target)) {
      return;
    }
    e.preventDefault();
    if (typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
  },
  true
);

// Prevent default touch behaviors on mobile to avoid scrolling
document.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  location.reload();
});

const unmuteicon = document.querySelector('.unmute-icon');

if (unmuteElement) {
  const syncUnmuteButtonState = () => {
    if (audio.muted) {
      unmuteElement.classList.add('muted');
    } else {
      unmuteElement.classList.remove('muted');
    }
  };

  syncUnmuteButtonState();

  unmuteElement.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (unmuteicon.classList.contains('muted')) {
      unmuteicon.classList.remove('muted');
    } else {
      unmuteicon.classList.add('muted');
    }
    const nextMutedState = !audio.muted;
    audio.muted = nextMutedState;

    if (!nextMutedState && audio.paused) {
      audio.play().catch(() => {});
    }

    syncUnmuteButtonState();
  });
}

// Initialize on load
window.addEventListener('load', () => {
  init();
});

function handleFinishGame() {
  document.querySelector('.score-bg').remove();
  document.querySelector('.score').remove();
  audio.pause();
  // unmuteElement.remove();
  document.querySelector('.scoreYou').innerText = score;
  post_score();
}

async function post_score() {
  const response = await fetch(
    'https://material.uranus-agency.ir/api/alibaba/scores/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: score }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    document.querySelector('.score1').innerText = data.scores[0];
    document.querySelector('.score2').innerText = data.scores[1];
    document.querySelector('.score3').innerText = data.scores[2];
  } else {
    console.log('Failed to post score');
  }
}

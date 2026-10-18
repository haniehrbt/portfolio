const PRICE_LABEL_TEXT = 'قیمت‌لحظه‌ای‌اتریوم';
const PRICE_UNIT_TEXT = 'تومان';
const CRYPTO_API_URL = 'https://api.sarafapp.com/v3/prices/crypto';
const TARGET_CRYPTO_INDEX = 1;
const PRICE_UPDATE_INTERVAL = 30000;

const bg_video = document.querySelector('.bg');
const gradiant = document.querySelector('.gradiant');
const logo = document.querySelector('.logo');
const cta = document.querySelector('.cta');
const overline = document.querySelector('.overline');
const priceText = document.querySelector('.priceText');
const priceContainer = document.querySelector('.price-container');
const priceUnit = document.querySelector('.price-unit');
const priceLabel = document.querySelector('.price-label');
const timerDisplay = document.querySelector('#timerDisplay');
const timerDigits = timerDisplay
  ? Array.from(timerDisplay.querySelectorAll('.time'))
  : [];

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
let countdownInterval;
let priceUpdateInterval;
let timerSpotlightDelayCall = null;
let timerSpotlightActive = false;

const timerOriginalState = timerDisplay
  ? (() => {
      const styles = window.getComputedStyle(timerDisplay);
      const initialScale = getInitialTimerScale(timerDisplay);
      return {
        x: Number(gsap.getProperty(timerDisplay, 'x')) || 0,
        y: Number(gsap.getProperty(timerDisplay, 'y')) || 0,
        scale: initialScale,
        zIndex: styles.zIndex || 'auto',
      };
    })()
  : null;

if (timerDisplay && timerOriginalState) {
  gsap.set(timerDisplay, {
    transformOrigin: 'center center',
    x: timerOriginalState.x,
    y: timerOriginalState.y,
    scale: timerOriginalState.scale,
  });
}

if (bg_video) {
  bg_video.setAttribute('webkit-playsinline', 'true');
  bg_video.setAttribute('playsinline', 'true');
  bg_video.setAttribute('controls', 'false');
  bg_video.removeAttribute('controls');

  bg_video.load();
  bg_video.play().catch((err) => {
    setTimeout(() => bg_video.play(), 100);
  });

  bg_video.addEventListener('play', function () {
    this.removeAttribute('controls');
  });

  bg_video.addEventListener('pause', function () {
    this.play();
  });
}

window.addEventListener('load', () => {
  const elementsToInit = [
    bg_video,
    gradiant,
    logo,
    priceContainer,
    timerDisplay,
    overline,
    cta,
  ].filter(Boolean);

  if (elementsToInit.length) {
    gsap.set(elementsToInit, { opacity: 0 });
  }

  const introTimeline = gsap.timeline({
    defaults: { ease: 'power2.out' },
  });

  if (bg_video || gradiant) {
    introTimeline.fromTo(
      [bg_video, gradiant].filter(Boolean),
      {
        opacity: 0,
        yPercent: 40,
        scaleX: 0.2,
        transformOrigin: 'center bottom',
      },
      {
        duration: 1.2,
        opacity: 1,
        yPercent: 0,
        scaleX: 1,
        ease: 'power3.out',
        stagger: 0.05,
      }
    );
  }

  if (logo) {
    introTimeline.fromTo(
      logo,
      {
        opacity: 0,
        y: 40,
        rotation: -8,
        scale: 0.8,
        transformOrigin: 'center',
      },
      {
        duration: 0.9,
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        ease: 'back.out(1.7)',
      }
    );
  }

  if (timerDisplay) {
    introTimeline.fromTo(
      timerDisplay,
      {
        opacity: 0,
        y: 60,
        scale: 0.85,
      },
      {
        duration: 0.8,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'back.out(1.4)',
      }
    );
  }

  if (overline) {
    introTimeline.fromTo(
      overline,
      {
        opacity: 0,
        y: 30,
        scaleX: 0.7,
        transformOrigin: 'center',
      },
      {
        duration: 0.6,
        opacity: 1,
        y: 0,
        scaleX: 1,
      }
    );
  }

  if (cta) {
    introTimeline.fromTo(
      cta,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        duration: 0.6,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'back.out(1.2)',
      }
    );
  }

  if (priceContainer) {
    introTimeline.fromTo(
      priceContainer,
      {
        opacity: 0,
        y: 20,
      },
      {
        duration: 0.5,
        opacity: 1,
        y: 0,
      },
      '-=0.3'
    );
  }

  if (timerDigits.length >= 4) {
    startCountdownDays(7);
  }

  scheduleCryptoPriceUpdates();

  if (timerDisplay) {
    scheduleTimerSpotlight();
  }
});

function startCountdownDays(totalDays) {
  if (timerDigits.length < 4) {
    return;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  const totalDurationMs = totalDays * DAY_MS;
  const countdownEndTime = Date.now() + totalDurationMs;

  const updateCountdown = () => {
    const now = Date.now();
    let remainingMs = Math.max(countdownEndTime - now, 0);

    const totalSeconds = Math.floor(remainingMs / SECOND_MS);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);

    renderTimerDigits(days, hours);

    if (totalSeconds === 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, SECOND_MS);
}

function renderTimerDigits(days, hours) {
  if (timerDigits.length < 4) {
    return;
  }

  const daysStr = days.toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');

  timerDigits[0].textContent = daysStr[0];
  timerDigits[1].textContent = daysStr[1];
  timerDigits[2].textContent = hoursStr[0];
  timerDigits[3].textContent = hoursStr[1];
}

function runTimerSpotlight() {
  if (!timerDisplay || !timerOriginalState || timerSpotlightActive) {
    return;
  }

  if (timerSpotlightDelayCall) {
    timerSpotlightDelayCall.kill();
    timerSpotlightDelayCall = null;
  }

  timerSpotlightActive = true;

  const fadeTargets = [
    bg_video,
    gradiant,
    logo,
    priceContainer,
    overline,
    cta,
  ].filter(Boolean);
  const rect = timerDisplay.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const targetX = viewportWidth / 2 - (rect.left + rect.width / 2);
  const targetY = viewportHeight / 2 - (rect.top + rect.height / 2);

  const spotlightTimeline = gsap.timeline({
    onComplete: () => {
      timerSpotlightActive = false;
      scheduleTimerSpotlight();
    },
  });

  if (fadeTargets.length) {
    spotlightTimeline.to(
      fadeTargets,
      {
        duration: 0.4,
        opacity: 0,
        stagger: 0.05,
        ease: 'power2.inOut',
      },
      0
    );
  }

  spotlightTimeline.set(timerDisplay, { zIndex: 1300 }, 0);

  spotlightTimeline.to(
    timerDisplay,
    {
      duration: 0.7,
      x: targetX,
      y: targetY,
      scale: 1.4,
      ease: 'power3.out',
    },
    0
  );

  spotlightTimeline.to(
    timerDisplay,
    {
      duration: 0.7,
      x: timerOriginalState.x,
      y: timerOriginalState.y,
      scale: 1,
      ease: 'power3.inOut',
    },
    '+=3'
  );

  if (fadeTargets.length) {
    spotlightTimeline.to(
      fadeTargets,
      {
        duration: 0.4,
        opacity: 1,
        stagger: -0.05,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  spotlightTimeline.set(timerDisplay, { zIndex: timerOriginalState.zIndex });
}

function scheduleCryptoPriceUpdates() {
  if (!priceText) {
    return;
  }

  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
  }

  updateCryptoPrice();
  priceUpdateInterval = setInterval(updateCryptoPrice, PRICE_UPDATE_INTERVAL);
}

async function updateCryptoPrice() {
  if (!priceText) {
    return;
  }

  try {
    const response = await fetch(CRYPTO_API_URL, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto price: ${response.status}`);
    }

    const payload = await response.json();
    const priceValue = extractPriceValue(payload);

    if (!priceValue) {
      throw new Error('Target crypto price not found in response.');
    }

    const numericPrice = Number(priceValue);
    const formattedPrice = Number.isFinite(numericPrice)
      ? new Intl.NumberFormat('en-US').format(numericPrice)
      : priceValue;
    const currentText = priceText.textContent?.trim() || '';

    if (currentText === formattedPrice) {
      applyPriceTexts(formattedPrice);
      return;
    }

    applyPriceTexts(formattedPrice);
  } catch (error) {
    console.error('Error fetching crypto price:', error);
  }
}

function extractPriceValue(payload) {
  if (!payload || !payload.price) {
    return null;
  }

  const items = payload.price.items || payload.price.Items;

  if (!items) {
    return null;
  }

  if (Array.isArray(items)) {
    return items[TARGET_CRYPTO_INDEX]?.p ?? null;
  }

  if (items.ETH && items.ETH.p) {
    return items.ETH.p;
  }

  const values = Object.values(items);
  return values[TARGET_CRYPTO_INDEX]?.p ?? null;
}

function applyPriceTexts(formattedPrice) {
  if (priceText) {
    priceText.textContent = formattedPrice;
  }
  if (priceUnit) {
    priceUnit.textContent = PRICE_UNIT_TEXT;
  }
  if (priceLabel) {
    priceLabel.textContent = PRICE_LABEL_TEXT;
  }
}

function scheduleTimerSpotlight(delaySeconds = 10) {
  if (!timerDisplay) {
    return;
  }

  if (timerSpotlightDelayCall) {
    timerSpotlightDelayCall.kill();
  }

  timerSpotlightDelayCall = gsap.delayedCall(delaySeconds, runTimerSpotlight);
}

function getInitialTimerScale(element) {
  const styles = window.getComputedStyle(element);
  const directScale =
    parseFloat(styles.getPropertyValue('scale')) || parseFloat(styles.scale);

  if (Number.isFinite(directScale) && directScale > 0) {
    return directScale;
  }

  const transform = styles.transform;
  if (transform && transform !== 'none') {
    const match = transform.match(/matrix\(([^)]+)\)/);
    if (match && match[1]) {
      const values = match[1].split(',');
      const scaleX = parseFloat(values[0]);
      if (Number.isFinite(scaleX) && scaleX > 0) {
        return scaleX;
      }
    }
  }

  return 0.5;
}

window.addEventListener('beforeunload', () => {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
  }
  if (timerSpotlightDelayCall) {
    timerSpotlightDelayCall.kill();
  }
});

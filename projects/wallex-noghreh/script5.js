// فقط APIها برای نقره تنظیم شد (انیمیشن‌ها و بقیه کد دست نخورده)

const BASE_URL = 'https://material.uranus-agency.ir';

const API_THIS_HOUR = `${BASE_URL}/api/current-day/silver_talasea`;
const API_30DAYS = `${BASE_URL}/api/average/30days/silver_talasea`;
const API_7DAYS = `${BASE_URL}/api/average/7days/silver_talasea`; // اضافه شد برای هفته

const LIVE_REFRESH_INTERVAL_MS = 60000;

const PERSIAN_DIGIT_MAP = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};

const ENGLISH_TO_PERSIAN_DIGIT_MAP = {
  0: '۰',
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
};

let currentLivePriceNumeric = null;

document.addEventListener('DOMContentLoaded', () => {
  initIntroAnimation();
  initLivePriceTicker();
  initGrowthIndicator();
});

function initIntroAnimation() {
  const bg = document.querySelector('.bg');
  const cta = document.querySelector('.cta');
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  timeline.fromTo(
    bg,
    {
      opacity: 0,
      yPercent: 40,
      scaleX: 0.2,
      transformOrigin: 'center bottom',
    },
    {
      duration: 1.2,
      opacity: 1,
      yPercent: -50,
      scaleX: 1,
    }
  );

  timeline.from('.logo', {
    opacity: 0,
    y: 45,
    scale: 0.85,
    rotation: -6,
    duration: 0.55,
    ease: 'back.out(1.6)',
    transformOrigin: 'center center',
  });
  timeline.from('.overline', {
    opacity: 0,
    y: 40,
    scale: 0.88,
    rotation: 6,
    duration: 0.5,
    ease: 'back.out(1.5)',
    transformOrigin: 'center center',
  });

  timeline.from(
    '.growth-indicator',
    {
      opacity: 0,
      y: 45,
      scale: 0.85,
      rotation: -6,
      duration: 0.55,
      ease: 'back.out(1.6)',
      transformOrigin: 'center center',
    },
    '-=0.3'
  );

  timeline.from('.bgPriceWrapper', {
    opacity: 0,
    y: 35,
    scale: 1.5,
    rotation: -5,
    duration: 0.65,
    ease: 'back.out(1.8)',
    transformOrigin: 'center center',
  });

  timeline.from(
    '.cta',
    {
      opacity: 0,
      y: 30,
      x: 0,
      scale: 0.85,
      duration: 0.55,
      ease: 'back.out(1.6)',
      transformOrigin: 'center center',
    },
    '+=0.8' //
  );

  timeline.eventCallback('onComplete', () => {
    gsap.delayedCall(10, spotlightSequence);
  });

  function spotlightSequence() {
    const timeline = gsap.timeline();

    timeline
      .to(
        ['.bg', '.logo', '.overline', '.growth-indicator', '.cta'],
        {
          opacity: 0,
          y: 30,
          duration: 0.45,
          ease: 'power2.in',
          stagger: 0.03,
        },
        '-=0.15'
      )
      .to(
        '.bgPriceWrapper',
        {
          opacity: 1,
          scale: 1,
          xPercent: -30,
          yPercent: -5,
          position: 'fixed',
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.6'
      )
      .to('.bgPriceWrapper', {
        scale: 1,
        xPercent: 0,
        yPercent: 0,
        duration: 1,
        ease: 'power3.inOut',
        delay: 5,
        onComplete: () => {
          gsap.set('.bgPriceWrapper', {
            clearProps: 'transform,top,left,position',
          });
          gsap.set(['.bg', '.logo', '.overline', '.growth-indicator', '.cta'], {
            opacity: 0.8,
            y: 0,
          });

          gsap.to(['.bg', '.logo', '.overline', '.growth-indicator', '.cta'], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.05,
          });

          gsap.delayedCall(10, spotlightSequence);
        },
      });
  }
}

function initLivePriceTicker() {
  const livePriceElement = document.querySelector('.live-price');
  const liveValueElement = document.querySelector('.live-value');
  const liveIndicatorElement = document.querySelector('.live-indicator');
  const multiplierInput = document.querySelector('.gr-input');
  const incrementButton = document.querySelector('.gr-button--increment');
  const decrementButton = document.querySelector('.gr-button--decrement');
  const priceResultElement = document.querySelector('.price-value');

  if (!livePriceElement || !liveValueElement) {
    return;
  }

  liveValueElement.textContent = liveValueElement.textContent || '';
  if (priceResultElement) {
    priceResultElement.textContent = priceResultElement.textContent || '';
  }

  let lastRenderedPrice = liveValueElement.textContent.trim();
  let lastRenderedResult = priceResultElement
    ? priceResultElement.textContent.trim()
    : '';

  const updatePriceResult = (text, shouldAnimate = true) => {
    if (!priceResultElement) {
      return;
    }

    const normalizedText = text || '--';

    if (normalizedText === lastRenderedResult) {
      return;
    }

    lastRenderedResult = normalizedText;
    priceResultElement.textContent = normalizedText;

    if (shouldAnimate) {
      playValuePop(priceResultElement);
    }
  };

  const recalcComputedPrice = () => {
    const multiplierMilligrams = multiplierInput
      ? parseToNumber(multiplierInput.value, { treatDotAsDecimal: true })
      : NaN;
    const multiplierGrams = Number.isFinite(multiplierMilligrams)
      ? multiplierMilligrams / 1000
      : NaN;

    if (
      !Number.isFinite(currentLivePriceNumeric) ||
      !Number.isFinite(multiplierGrams)
    ) {
      updatePriceResult('--', false);
      return;
    }

    const result = currentLivePriceNumeric * multiplierGrams;
    updatePriceResult(formatPriceValue(result));
  };

  const renderPrice = (displayValue, numericValue) => {
    const normalizedDisplay = displayValue || '';

    if (normalizedDisplay !== lastRenderedPrice) {
      lastRenderedPrice = normalizedDisplay;
      liveValueElement.textContent = normalizedDisplay;
      playValuePop(livePriceElement);
    }

    if (numericValue === null) {
      currentLivePriceNumeric = null;
    } else if (Number.isFinite(numericValue)) {
      currentLivePriceNumeric = numericValue;
    }

    recalcComputedPrice();

    if (liveIndicatorElement) {
      liveIndicatorElement.classList.toggle(
        'is-offline',
        !Number.isFinite(numericValue)
      );
    }
  };

  const updateLivePrice = async () => {
    try {
      const response = await fetch(API_THIS_HOUR, { cache: 'no-cache' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();

      let numericPrice = null;

      if (typeof payload === 'number') {
        numericPrice = payload;
      } else if (Array.isArray(payload) && payload.length > 0) {
        let latestEntry = null;
        let maxHour = -1;

        for (const entry of payload) {
          if (!entry || typeof entry !== 'object' || entry.hour == null) {
            continue;
          }

          const hour = Number(entry.hour);
          if (Number.isFinite(hour) && hour > maxHour) {
            maxHour = hour;
            latestEntry = entry;
          }
        }

        if (!latestEntry) {
          for (const entry of payload) {
            if (!entry || typeof entry !== 'object') {
              continue;
            }
            if (entry.hour === 24 || entry.hour === '24') {
              latestEntry = entry;
              break;
            }
          }
        }

        if (!latestEntry && payload.length > 0) {
          latestEntry = payload[payload.length - 1];
        }

        if (latestEntry) {
          const priceValue =
            latestEntry.price ??
            latestEntry.averagePrice ??
            latestEntry.average ??
            latestEntry.value;
          if (priceValue != null) {
            numericPrice =
              typeof priceValue === 'number'
                ? priceValue
                : parseToNumber(priceValue);
          }
        }
      } else if (payload && typeof payload === 'object') {
        let rawPriceValue =
          payload.price ??
          payload.average ??
          payload.mean ??
          payload.value ??
          payload.body?.price ??
          payload.body?.average ??
          payload.body?.mean ??
          payload.body?.value ??
          payload.body;

        if (Array.isArray(payload.body)) {
          const rows = payload.body;
          if (rows.length > 0) {
            let latestEntry = null;
            let maxHour = -1;

            for (const row of rows) {
              if (!row || typeof row !== 'object' || row.hour == null) {
                continue;
              }

              const hour = Number(row.hour);
              if (Number.isFinite(hour) && hour > maxHour) {
                maxHour = hour;
                latestEntry = row;
              }
            }

            if (!latestEntry) {
              for (const row of rows) {
                if (!row || typeof row !== 'object') {
                  continue;
                }
                if (row.hour === 24 || row.hour === '24') {
                  latestEntry = row;
                  break;
                }
              }
            }

            if (latestEntry) {
              rawPriceValue =
                latestEntry.price ?? latestEntry.average ?? latestEntry.value;
            }
          }
        }

        if (rawPriceValue != null) {
          numericPrice =
            typeof rawPriceValue === 'number'
              ? rawPriceValue
              : parseToNumber(rawPriceValue);
        }
      }

      if (Number.isFinite(numericPrice)) {
        const formattedPrice = formatPriceValue(numericPrice);
        renderPrice(formattedPrice, numericPrice);
      } else {
        renderPrice('--', null);
      }
    } catch (error) {
      renderPrice(formatPriceValue(42800000), 42800000);
    }
  };

  if (multiplierInput) {
    if (!multiplierInput.value) {
      multiplierInput.value = toPersianDigits('1');
    } else {
      multiplierInput.value = toPersianDigits(multiplierInput.value);
    }
    multiplierInput.setAttribute('readonly', 'true');
    multiplierInput.setAttribute('tabindex', '-1');

    const adjustMultiplier = (delta) => {
      if (!multiplierInput) {
        return;
      }

      const currentValueMilligrams = parseToNumber(multiplierInput.value, {
        treatDotAsDecimal: true,
      });

      const baseValue = Number.isFinite(currentValueMilligrams)
        ? currentValueMilligrams
        : 0;
      let nextValue = baseValue + delta;

      if (nextValue < 0) {
        nextValue = 0;
      }

      if (nextValue > 9999) {
        nextValue = 9999;
      }

      const normalizedValue = Math.round(nextValue * 100) / 100;
      const normalizedValueString = Number.isInteger(normalizedValue)
        ? normalizedValue.toString()
        : normalizedValue.toFixed(2).replace(/\.?0+$/, '');
      multiplierInput.value = toPersianDigits(normalizedValueString);
      recalcComputedPrice();
      playValuePop(multiplierInput);
    };

    incrementButton.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      adjustMultiplier(1);
      fire_tag(ALL_EVENT_TYPES.CLICK1);
    });

    decrementButton.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      adjustMultiplier(-1);
      fire_tag(ALL_EVENT_TYPES.CLICK2);
    });
  }

  updateLivePrice();
  setInterval(updateLivePrice, LIVE_REFRESH_INTERVAL_MS);
}

function playValuePop(element) {
  if (!element) {
    return;
  }

  gsap.fromTo(
    element,
    { opacity: 0.5, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' }
  );
}

function formatPriceValue(rawValue) {
  if (Number.isFinite(rawValue)) {
    return rawValue.toLocaleString('fa-IR').replace(/[٬,]/g, '.');
  }

  const numericValue = parseToNumber(rawValue);

  if (Number.isFinite(numericValue)) {
    return numericValue.toLocaleString('fa-IR').replace(/[٬,]/g, '.');
  }

  return rawValue == null ? '--' : String(rawValue);
}

function parseToNumber(value, { treatDotAsDecimal = false } = {}) {
  if (value == null || value === '') {
    return NaN;
  }

  const normalized = toEnglishDigits(String(value)).replace(/[٬,]/g, '');

  if (treatDotAsDecimal) {
    const sanitized = normalized
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');

    return sanitized ? Number.parseFloat(sanitized) : NaN;
  }

  const sanitized = normalized.replace(/[^\d]/g, '');
  return sanitized ? Number.parseFloat(sanitized) : NaN;
}

function toEnglishDigits(value) {
  return String(value).replace(
    /[۰-۹]/g,
    (digit) => PERSIAN_DIGIT_MAP[digit] || digit
  );
}

function toPersianDigits(value) {
  return String(value).replace(
    /[0-9]/g,
    (digit) => ENGLISH_TO_PERSIAN_DIGIT_MAP[digit] || digit
  );
}

function initGrowthIndicator() {
  const growthLabelElement = document.querySelector('.growth-label');
  const growthValueElement = document.querySelector('.growth-value');

  if (!growthLabelElement || !growthValueElement) {
    return;
  }

  const updateGrowthIndicator = async () => {
    try {
      const response = await fetch(API_30DAYS, { cache: 'no-cache' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();

      if (!Array.isArray(payload) || payload.length < 2) {
        growthLabelElement.textContent = '';
        growthValueElement.textContent = '--';
        const upArrow = document.querySelector('.growth-arrow.up-arrow');
        const downArrow = document.querySelector('.growth-arrow.down-arrow');
        if (upArrow) upArrow.classList.remove('show');
        if (downArrow) downArrow.classList.remove('show');
        return;
      }

      const prices = [];
      for (const entry of payload) {
        if (!entry || typeof entry !== 'object') {
          continue;
        }
        const priceValue =
          entry.averagePrice ?? entry.price ?? entry.average ?? entry.value;
        if (priceValue != null) {
          const parsed =
            typeof priceValue === 'number'
              ? priceValue
              : parseToNumber(priceValue);
          if (Number.isFinite(parsed)) {
            prices.push(parsed);
          }
        }
      }

      if (prices.length < 2) {
        growthLabelElement.textContent = '';
        growthValueElement.textContent = '--';
        const upArrow = document.querySelector('.growth-arrow.up-arrow');
        const downArrow = document.querySelector('.growth-arrow.down-arrow');
        if (upArrow) upArrow.classList.remove('show');
        if (downArrow) downArrow.classList.remove('show');
        return;
      }

      const todayPrice = prices[prices.length - 1];

      const changes = [];

      if (prices.length >= 2) {
        const yesterdayPrice = prices[prices.length - 2];
        const dayChange = Math.abs(todayPrice - yesterdayPrice);
        const dayPercent =
          yesterdayPrice > 0
            ? ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100
            : 0;
        changes.push({
          type: 'day',
          label: 'روزگذشته',
          change: dayChange,
          percent: dayPercent,
          isPositive: todayPrice > yesterdayPrice,
        });
      }

      if (prices.length >= 7) {
        const weekAgoPrice = prices[prices.length - 7];
        const weekChange = Math.abs(todayPrice - weekAgoPrice);
        const weekPercent =
          weekAgoPrice > 0
            ? ((todayPrice - weekAgoPrice) / weekAgoPrice) * 100
            : 0;
        changes.push({
          type: 'week',
          label: 'هفته گذشته',
          change: weekChange,
          percent: weekPercent,
          isPositive: todayPrice > weekAgoPrice,
        });
      }

      if (prices.length >= 30) {
        const monthAgoPrice = prices[0];
        const monthChange = Math.abs(todayPrice - monthAgoPrice);
        const monthPercent =
          monthAgoPrice > 0
            ? ((todayPrice - monthAgoPrice) / monthAgoPrice) * 100
            : 0;
        changes.push({
          type: 'month',
          label: 'ماه گذشته',
          change: monthChange,
          percent: monthPercent,
          isPositive: todayPrice > monthAgoPrice,
        });
      }

      if (changes.length === 0) {
        growthLabelElement.textContent = '';
        growthValueElement.textContent = '--';
        const upArrow = document.querySelector('.growth-arrow.up-arrow');
        const downArrow = document.querySelector('.growth-arrow.down-arrow');
        if (upArrow) upArrow.classList.remove('show');
        if (downArrow) downArrow.classList.remove('show');
        return;
      }

      changes.sort((a, b) => Math.abs(b.percent) - Math.abs(a.percent));
      const biggestChange = changes[0];

      growthLabelElement.textContent = biggestChange.label;
      const percentText = Math.abs(biggestChange.percent).toFixed(1);
      growthValueElement.textContent = '%' + toPersianDigits(percentText);

      const upArrow = document.querySelector('.growth-arrow.up-arrow');
      const downArrow = document.querySelector('.growth-arrow.down-arrow');
      const overlineElement = document.querySelector('.overline');

      if (biggestChange.isPositive) {
        growthValueElement.className = 'growth-value positive';
        if (upArrow) {
          upArrow.classList.add('show');
        }
        if (downArrow) {
          downArrow.classList.remove('show');
        }
        if (overlineElement) {
          overlineElement.src = './increaseOverline.svg';
        }
      } else {
        growthValueElement.className = 'growth-value negative';
        if (upArrow) {
          upArrow.classList.remove('show');
        }
        if (downArrow) {
          downArrow.classList.add('show');
        }
        if (overlineElement) {
          overlineElement.src = './decreaseOverline.svg';
        }
      }

      playValuePop(growthValueElement);
    } catch (error) {
      console.error('Error fetching growth data:', error);
      growthLabelElement.textContent = '';
      growthValueElement.textContent = '--';
      const upArrow = document.querySelector('.growth-arrow.up-arrow');
      const downArrow = document.querySelector('.growth-arrow.down-arrow');
      if (upArrow) upArrow.classList.remove('show');
      if (downArrow) downArrow.classList.remove('show');
    }
  };

  updateGrowthIndicator();
  setInterval(updateGrowthIndicator, LIVE_REFRESH_INTERVAL_MS);
}

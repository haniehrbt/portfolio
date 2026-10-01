const ACTIONS = {
  // WINDOW
  WINDOW_LOADED: ['', '', '', '', '', '', ''],

  // DOM
  DOM_CONTENT_LOADED: ['', '', '', '', '', '', ''],

  // تگ صفر ثانیه
  TIMER_0_SECOND: ['', '', '', '', '', '', ''],

  // تگ 5 ثانیه
  TIMER_5_SECOND: ['', '', '', '', '', '', ''],

  // تگ 10 ثانیه
  TIMER_10_SECOND: ['', '', '', '', '', '', ''],

  // تگ 15 ثانیه
  TIMER_15_SECOND: ['', '', '', '', '', '', ''],

  // تگ 60 ثانیه
  TIMER_60_SECOND: ['', '', '', '', '', '', ''],

  //کلیلک روی دکمه امروز
  CLICK_TODAY: [
    'f2932d18-c697-48fe-bb9c-71825cc102b9',
    'e813fb75-4612-47aa-b567-b2d2aba7dcf1',
    '',
    '',
    '',
    '',
    '',
  ],

  //کلیلک روی دکمه هفته
  CLICK_WEEK: [
    '9ba75fc8-ccc4-454d-ae76-d09b332969a6',
    'ea4cfc26-63df-4250-8155-7d82c04c80c4',
    '',
    '',
    '',
    '',
    '',
  ],

  //کلیلک روی دکمه ماه
  CLICK_MONTH: [
    '3a29555b-50f6-4598-8a58-0d476bae292b',
    '3fd11c61-329e-4014-aaba-759ec444f16b',
    '',
    '',
    '',
    '',
    '',
  ],

  // کلیک روی cta
  CLICK_CTA: [
    'ce890fb2-e83d-41d9-b57b-bf1ca98987d5',
    '8858c4f5-be8f-46cf-a78a-323dde0a989d',
    '',
    '',
    '',
    '',
    '',
  ],

  CLICK_CANVAS: [
    '90f32d3c-afba-4670-97d2-1aedd6e50952',
    'da803fbd-0846-49a4-8dfc-146b77f0dc8d',
    '',
    '',
    '',
    '',
    '',
  ],
};

function fire_tag(ACTION_TAGS) {
  ACTION_TAGS.forEach((tag) => {
    window.parent.postMessage(
      {
        type: 'yn::tag',
        tagId: tag,
      },
      '*'
    );
  });
}

fire_tag(ACTIONS.TIMER_0_SECOND);

window.onload = function () {
  fire_tag(ACTIONS.WINDOW_LOADED);
};

document.addEventListener('DOMContentLoaded', () => {
  fire_tag(ACTIONS.DOM_CONTENT_LOADED);

  function getElapsedTimeInSeconds(loadTime) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - loadTime) / 1000;
    return elapsedTime.toFixed(2);
  }

  let loadTime = Date.now();
  let tag60sec = true;
  let tag5sec = true;
  let tag15sec = true;
  let tag10sec = true;

  let interval = setInterval(() => {
    const currentTime = getElapsedTimeInSeconds(loadTime);
    if (currentTime >= 60 && tag60sec) {
      tag60sec = false;
      fire_tag(ACTIONS.TIMER_60_SECOND);
      clearInterval(interval);
    }
    if (currentTime >= 5 && tag5sec) {
      tag5sec = false;
      fire_tag(ACTIONS.TIMER_5_SECOND);
    }
    if (currentTime >= 10 && tag10sec) {
      fire_tag(ACTIONS.TIMER_10_SECOND);
      tag10sec = false;
    }
    if (currentTime >= 15 && tag15sec) {
      fire_tag(ACTIONS.TIMER_15_SECOND);
      tag15sec = false;
    }
  }, 1001);
});

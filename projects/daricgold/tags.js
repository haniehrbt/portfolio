const ACTIONS = {
  // WINDOW
  WINDOW_LOADED: ['', '', '', '', '', '', ''],

  // DOM
  DOM_CONTENT_LOADED: ['', '', '', '', '', '', ''],

  // تگ صفر ثانیه
  TIMER_0_SECOND: [
    '739f992a-81ae-45ee-9feb-e8cefa7c8d29',
    '34e020ab-941e-4dfd-8f77-9ea75b146aef',
    '',
    '',
    '',
    '',
    '',
  ],

  // تگ 5 ثانیه
  TIMER_5_SECOND: [
    '3ccca892-dcd5-4296-9fdc-b6c30f340bd2',
    'c34da466-1354-456c-b6e0-056fdad33370',
    '',
    '',
    '',
    '',
    '',
  ],

  // تگ 10 ثانیه
  TIMER_10_SECOND: [
    'b98f7470-a5d8-42a3-8cbd-4106914866d1',
    '6f826d87-da62-483c-acee-6ff4c67738b4',
    '',
    '',
    '',
    '',
    '',
  ],

  // تگ 15 ثانیه
  TIMER_15_SECOND: [
    '8dfbf738-e6d1-4d3c-8d96-d5d1e02179fc',
    '0db9f993-7731-419e-9077-fef4f1c262d5',
    '',
    '',
    '',
    '',
    '',
  ],

  // تگ 60 ثانیه
  TIMER_60_SECOND: [
    '7237b4f4-b383-4778-8713-084d1938ee4d',
    '4fdd7e98-24aa-49d8-ba9e-5062745ab720',
    '',
    '',
    '',
    '',
    '',
  ],

  //کلیلک روی دکمه امروز
  CLICK_TODAY: [
    '59449d31-78fc-4221-ab0d-bb1b4633efc0',
    '947496fe-3b49-4311-9ada-79782e90e009',
    '',
    '',
    '',
    '',
    '',
  ],

  //کلیلک روی دکمه هفته
  CLICK_WEEK: [
    'b97380c2-d289-4c92-9af8-40fea3d873cd',
    '3ec6edb0-e693-4ba4-b059-e91a115bdeea',
    '',
    '',
    '',
    '',
    '',
  ],

  //کلیلک روی دکمه ماه
  CLICK_MONTH: [
    '496e52fb-9ae7-44a7-9cd2-d4014398b58d',
    '0e02c521-53d4-42f7-aa55-c4e4e88850a7',
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

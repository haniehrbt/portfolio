const ACTIONS = {
  // WINDOW
  WINDOW_LOADED: ['', '', '', '', '', '', ''],

  // DOM
  DOM_CONTENT_LOADED: ['', '', '', '', '', '', ''],

  // ØªÚ¯ ØµÙØ± Ø«Ø§Ù†ÛŒÙ‡
  TIMER_0_SECOND: [
    '9c81ff52-ed98-47a0-a926-e4db98852631',
    '',
    '',
    '',
    '',
    '',
    '',
  ],

  // ØªÚ¯ 5 Ø«Ø§Ù†ÛŒÙ‡
  TIMER_5_SECOND: [
    '295379ce-ed6a-4c2e-a299-d6efabd72f25',
    '',
    '',
    '',
    '',
    '',
    '',
  ],

  // ØªÚ¯ 10 Ø«Ø§Ù†ÛŒÙ‡
  TIMER_10_SECOND: ['', '', '', '', '', '', ''],

  // ØªÚ¯ 15 Ø«Ø§Ù†ÛŒÙ‡
  TIMER_15_SECOND: [
    '9d2c6087-04fb-4582-9b6d-90759564fd4e',
    '',
    '',
    '',
    '',
    '',
    '',
  ],

  // ØªÚ¯ 60 Ø«Ø§Ù†ÛŒÙ‡
  TIMER_60_SECOND: [
    '00bc8bd7-d212-4ae8-a45b-81c6be1ad503',
    '',
    '',
    '',
    '',
    '',
    '',
  ],

  // Ú©Ù„ÛŒÚ© Ø±ÙˆÛŒ Ú©Ø§Ø±Øª
  CLICK_CARD: ['e2bc5309-2fb2-4909-8120-7fe6ea411ed8', '', '', '', '', '', ''],

  // Ú©Ù„ÛŒÚ© Ø±ÙˆÛŒ cta
  CLICK_CTA: ['419aa242-3c6b-40d7-ab48-2f702b92b518', '', '', '', '', '', ''],

  // Ø¯ÛŒØ¯Ù† Ø§Ø³Ù„Ø§ÛŒØ¯ 2
  VISIT_SLIDE02: [
    'b6d92989-b5f1-4f0b-9c9a-572a06903015',
    '',
    '',
    '',
    '',
    '',
    '',
  ],

  // Ø¯ÛŒØ¯Ù† Ø§Ø³Ù„Ø§ÛŒØ¯ 3
  VISIT_SLIDE03: [
    '6aca7b73-260f-4d40-9c78-e1f3022c74ac',
    '',
    '',
    '',
    '',
    '',
    '',
  ],

  // Ø¯ÛŒØ¯Ù† Ø§Ø³Ù„Ø§ÛŒØ¯ 4
  VISIT_SLIDE04: [
    '2607f0fb-dfff-44fa-a673-cb80966db7c0',
    '',
    '',
    '',
    '',
    '',
    '',
  ],
};

function fire_tag(ACTION_TAGS, event_type) {
  window.parent.postMessage(
    {
      type: 'yn::event',
      event_type: event_type,
    },
    '*'
  );

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

fire_tag(ACTIONS.TIMER_0_SECOND, 'TIMER_0_SECOND');

window.onload = function () {
  fire_tag(ACTIONS.WINDOW_LOADED, 'WINDOW_LOADED');
};

document.addEventListener('DOMContentLoaded', () => {
  fire_tag(ACTIONS.DOM_CONTENT_LOADED, 'DOM_CONTENT_LOADED');

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
      fire_tag(ACTIONS.TIMER_60_SECOND, 'TIMER_60_SECOND');
      clearInterval(interval);
    }
    if (currentTime >= 5 && tag5sec) {
      tag5sec = false;
      fire_tag(ACTIONS.TIMER_5_SECOND, 'TIMER_5_SECOND');
    }
    if (currentTime >= 10 && tag10sec) {
      fire_tag(ACTIONS.TIMER_10_SECOND, 'TIMER_10_SECOND');
      tag10sec = false;
    }
    if (currentTime >= 15 && tag15sec) {
      fire_tag(ACTIONS.TIMER_15_SECOND, 'TIMER_15_SECOND');
      tag15sec = false;
    }
  }, 1001);
});

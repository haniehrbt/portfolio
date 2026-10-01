const ACTIONS = {
  // WINDOW
  WINDOW_LOADED: ['', '', '', '', '', '', ''],
  // DOM
  DOM_CONTENT_LOADED: ['', '', '', '', '', '', ''],

  // ØªÚ¯ ØµÙØ± Ø«Ø§Ù†ÛŒÙ‡
  TIMER_0_SECOND: [
    'a39a2c47-6264-4ba2-a52b-4d2e50e5fabf',
    'd40ad036-1672-49cd-96db-f5f292752bad',
    '',
    '',
    '',
    '',
    '',
  ],

  // ØªÚ¯ 5 Ø«Ø§Ù†ÛŒÙ‡
  TIMER_5_SECOND: [
    '6ec17011-6576-409d-9f34-f4866db2e505',
    'ab88f489-bf25-4db9-8957-3c31f0494c13',
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
    '2abdc620-e782-43fc-bf47-be123cb79312',
    'b53afb2b-2c2b-4bfb-b15a-72d4a47b5445',
    '',
    '',
    '',
    '',
    '',
  ],

  // ØªÚ¯ 60 Ø«Ø§Ù†ÛŒÙ‡
  TIMER_60_SECOND: [
    '7a077894-a9e0-43d6-a101-29b87e68c63c',
    '52100f2a-f7fd-4e37-94a5-f4c3d9e05196',
    '',
    '',
    '',
    '',
    '',
  ],

  //month Ø¨Ù†Ø± Ø¢Ø®Ø±
  CLICK_MONTH: [
    '1c4daedc-3856-4d0f-b2cf-d609c1596053',
    'cbc8f220-ed28-4337-9306-8c9a8b57f9a6',
    '',
    '',
    '',
    '',
    '',
  ],

  //Ú©Ù„ÛŒÚ© Ø±ÙˆÛŒ Ù„ÙˆÚ¯Ùˆ
  CLICK_LOGO: [
    '94968211-0061-4617-987e-dff87de64a3a',
    '6364c559-ce9f-4d5b-8546-acd76deac344',
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

const ALL_EVENT_TYPES = {
  WINDOW_LOADED: `WINDOW_LOADED`, // DONT TOUCH!!!!!!!!!!!!
  DOM_CONTENT_LOADED: `DOM_CONTENT_LOADED`, // DONT TOUCH!!!!!!!!!!!!
  TIMER_0_SECOND: `TIMER_0_SECOND`, // DONT TOUCH!!!!!!!!!!!!
  TIMER_5_SECOND: `TIMER_5_SECOND`, // DONT TOUCH!!!!!!!!!!!!
  TIMER_10_SECOND: `TIMER_10_SECOND`, // DONT TOUCH!!!!!!!!!!!!
  TIMER_15_SECOND: `TIMER_15_SECOND`, // DONT TOUCH!!!!!!!!!!!!
  TIMER_60_SECOND: `TIMER_60_SECOND`, // DONT TOUCH!!!!!!!!!!!!
  VISIT_SLIDE01: `VISIT_SLIDE01`, // DONT TOUCH!!!!!!!!!!!!
  VISIT_SLIDE02: `VISIT_SLIDE02`, // DONT TOUCH!!!!!!!!!!!!
  VISIT_SLIDE03: `VISIT_SLIDE03`, // DONT TOUCH!!!!!!!!!!!!
  VISIT_SLIDE04: `VISIT_SLIDE03`, // DONT TOUCH!!!!!!!!!!!!
  VISIT_SLIDE05: `VISIT_SLIDE05`, // DONT TOUCH!!!!!!!!!!!!
  CLICK1: `CLICK1`, // DONT TOUCH!!!!!!!!!!!!
  CLICK2: `CLICK2`, // DONT TOUCH!!!!!!!!!!!!
  CLICK3: `CLICK3`, // DONT TOUCH!!!!!!!!!!!!
  CLICK4: `CLICK4`, // DONT TOUCH!!!!!!!!!!!!
  CLICK5: `CLICK5`, // DONT TOUCH!!!!!!!!!!!!
  CLICK6: `CLICK6`, // DONT TOUCH!!!!!!!!!!!!
};

function fire_tag(EVENT_TYPE) {
  console.log('Fired Tag:', EVENT_TYPE);
  if (!Object.keys(ALL_EVENT_TYPES).includes(EVENT_TYPE)) {
    console.warn('THIS TAG IS NOT ALLOWED:', EVENT_TYPE);
    return;
  }
  window.parent.postMessage(
    {
      type: 'yn::event',
      event_type: EVENT_TYPE,
    },
    '*'
  );
}

fire_tag(ALL_EVENT_TYPES.TIMER_0_SECOND);

window.onload = function () {
  fire_tag(ALL_EVENT_TYPES.WINDOW_LOADED);
};

document.addEventListener('DOMContentLoaded', () => {
  fire_tag(ALL_EVENT_TYPES.DOM_CONTENT_LOADED);

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
      fire_tag(ALL_EVENT_TYPES.TIMER_60_SECOND);
      clearInterval(interval);
    }
    if (currentTime >= 5 && tag5sec) {
      tag5sec = false;
      fire_tag(ALL_EVENT_TYPES.TIMER_5_SECOND);
    }
    if (currentTime >= 10 && tag10sec) {
      fire_tag(ALL_EVENT_TYPES.TIMER_10_SECOND);
      tag10sec = false;
    }
    if (currentTime >= 15 && tag15sec) {
      fire_tag(ALL_EVENT_TYPES.TIMER_15_SECOND);
      tag15sec = false;
    }
  }, 1001);
});

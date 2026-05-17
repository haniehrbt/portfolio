const ACTIONS = {
    // WINDOW
    WINDOW_LOADED: ["", "", "", "", "", "", "",],

    // DOM
    DOM_CONTENT_LOADED: ["", "", "", "", "", "", "",],

    // تگ صفر ثانیه
    TIMER_0_SECOND: ["", "", "", "", "", "", "",],

    // تگ 5 ثانیه
    TIMER_5_SECOND: ["", "", "", "", "", "", "",],

    // تگ 10 ثانیه
    TIMER_10_SECOND: ["", "", "", "", "", "", "",],

    // تگ 15 ثانیه
    TIMER_15_SECOND: ["", "", "", "", "", "", "",],

    // تگ 60 ثانیه
    TIMER_60_SECOND: ["", "", "", "", "", "", "",],

    // تگ کلیک بر روی لوگو
    CLICK_LOGO: ["", "", "", "", "", "",],

    // کلیک روی اختصاصی
    VISIT_PRODUCT: [
        ["", "", "", "",], // محصول اول
        ["", "", "", "",], // دوم
        ["", "", "", "",], // سوم
        ["", "", "", "",], // چهارم
        ["", "", "", "",], // پنجم
        ["", "", "", "",], // ششم
    ],

    // کلیک روی محصول
    CLICK_PRODUCT: ["", "", "", "", "", "",],

}

function fire_tag(ACTION_TAGS) {
    ACTION_TAGS.forEach((tag) => {
        window.parent.postMessage(
            {
                type: "yn::tag",
                tagId: tag,
            },
            "*"
        );
    })
}

fire_tag(ACTIONS.TIMER_0_SECOND)

window.onload = function () {
    fire_tag(ACTIONS.WINDOW_LOADED)
}

document.addEventListener('DOMContentLoaded', () => {

    fire_tag(ACTIONS.DOM_CONTENT_LOADED)

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
        if ((currentTime >= 60) && tag60sec) {
            tag60sec = false;
            fire_tag(ACTIONS.TIMER_60_SECOND)
            clearInterval(interval)
        }
        if ((currentTime >= 5) && tag5sec) {
            tag5sec = false;
            fire_tag(ACTIONS.TIMER_5_SECOND)
        }
        if ((currentTime >= 10) && tag10sec) {
            fire_tag(ACTIONS.TIMER_10_SECOND)
            tag10sec = false;
        }
        if ((currentTime >= 15) && tag15sec) {
            fire_tag(ACTIONS.TIMER_15_SECOND)
            tag15sec = false;
        }
    }, 1001);
})


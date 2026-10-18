const ACTIONS = {
    // WINDOW
    WINDOW_LOADED:  ["21001599-1972-4346-99f8-b294eeee558d", "fddf0671-ab44-44ff-bfbc-8bc481c9015a", "56de97a3-a608-4bd4-a80a-b31d79764a09", "7508f205-2af0-44c1-b2a2-80c099f3cc1b", "", "", "",],
    // DOM
    DOM_CONTENT_LOADED: ["", "", "", "", "", "", "",],

    // تگ صفر ثانیه
    TIMER_0_SECOND: ["51a55d18-1c91-46ad-8c41-9663f6f50126", "d13412f1-07a9-4671-a9db-de567c6d3e35", "25a013df-5aa8-452a-be71-32f918e9fc1f", "308b13ac-090f-42e7-817c-8bc9a04c768c", "", "", "",],

    // تگ 5 ثانیه
    TIMER_5_SECOND: ["517219b9-df79-4c73-b60b-654fbfdcc7d3", "7f4fdef6-4500-4fd8-9539-9d3a56fbee1d", "d69f76d3-6288-4304-bf5d-57c74f6a193a", "54a0e326-bfc7-4287-b4c4-ee341c5ef053", "", "", "",],

    // تگ 10 ثانیه
    TIMER_10_SECOND:["d808f47f-5d82-4648-bcb1-5925e8be0886", "0d3d8369-702a-4299-a1da-d5972a58c81b", "3c93938b-35d0-4935-bf6d-e35db7404835", "f9ba3160-eb85-4553-afa7-2d14c1f04de6", "", "", "",],

    // تگ 15 ثانیه
    TIMER_15_SECOND: ["ec1764db-1077-4502-ab0e-dc0f6f0f222c", "42290a0c-1f1e-4cd9-9cc1-80634f369613", "86d2a403-719c-4444-99ff-9b1c268e280d", "4462f347-aaec-4fb1-a987-e6553f867153", "", "", "",],

    // تگ 60 ثانیه
    TIMER_60_SECOND: ["50b82da4-7c34-4253-a2e4-cdaddc792fd8", "1f974ed3-bde8-4037-8ac0-3d5d1f6fd69b", "83fb4ce1-8cdd-4bd6-a9a3-e2ee83257ef0", "38681ef4-6595-4b35-b64d-705b6cd9e9d6", "", "", "",],

    //کلیلک روی +
    CLICK_COLDBTN: ["dba49a54-e816-4315-bea5-02038861ae3c", "b2021f76-6473-44b4-aa9c-b798c17f39c4", "5960a60a-9c3d-4dbe-9ede-94b85819d645", "d9137443-da22-46e6-81ec-f57ea3e0e773", "", "", "",],

    //کلیک روی -
    CLICK_WARMBTN: ["a197c9bb-c94d-42e9-b078-4e906ad0017a", "e29dd133-7389-4432-847d-230f1d743203", "29f09e2c-a49a-47eb-a062-a13bed28269e", "285ca50f-2fbb-403c-9471-7687e7abbf1c", "", "", "",],

    //بازدید اسلاید آخر
    VISIT_LASTSLIDE: ["51a07edf-29a6-48a9-a7be-43ef0193d130", "114dcada-9b52-4c9c-8e1c-7990cebec202", "beeeb64a-4247-486d-920f-994dc8e3b6af", "af972a4b-40cb-4689-9a8a-6f565edcf5d1", "", "", "",],

    //کلیک روی لوگو
    CLICK_LOGO: ["4dc7b972-8de7-49cc-a10b-0a9fce738a33", "e872cd4b-098d-442e-ac6c-f2ac63a317ad", "ec8f734d-8269-4164-8fff-4863ea3a9370", "e9c19971-1533-4229-9f1d-5dff0abf5edb", "", "", "",],

    //کلیلک روی خرس‌ها 
    CLICK_BEARS: ["69e9380c-933e-46bd-8664-942ad7743567", "3fd4bca9-e038-4491-a6f2-479959bc2c6e", "3835accf-7068-45dc-ba32-805e817f67ee", "915f1983-42ca-438d-ae0e-c8453e14242a", "", "", "",],

    //کلیلک روی کولرگازی
    CLICK_PRODUCT: ["c2b890c3-5b46-48c7-aa8e-fd95a43448f4", "2236133e-2371-45fe-9edf-e6139044f2f6", "4fc86276-0ea1-45f5-9bc3-3217ce2d28af", "6a9a176f-78d2-496a-b862-0f2b9bb52022", "", "", "",],

    //اتوپلی بدون کلیلک برای هر دکمه
  AUTOPLAY_TAG: ["ff7cda36-892c-4723-b31a-e0988c500080", "8cb98240-b21e-446f-9563-0d2761744ad1", "20461aea-a70f-48af-ba52-5e48230e2920", "729dd6cf-cad0-4491-8aa9-407b70d88e52", "", "", "",],
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


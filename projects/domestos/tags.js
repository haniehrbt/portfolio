const ACTIONS = {
    // WINDOW
    WINDOW_LOADED:  ["8dfbd0b1-19ae-4f49-970e-bbe343e3799f", "cd9a07e9-0496-496c-95f2-72594bf6963b", "4b30a40a-18e1-480e-a8b2-80cbdf405e41", "67a870ea-69f4-46f4-8d8e-a5dc4676a263", "", "", "",],
    // DOM
    DOM_CONTENT_LOADED: ["", "", "", "", "", "", "",],

    // تگ صفر ثانیه
    TIMER_0_SECOND: ["509d29f3-544c-48f4-9b0e-d30ce09a900e", "a4b64e2d-2eee-41b7-b3ac-fe09350cd663", "de14a4c2-bf7c-4443-be60-3e250b7a1ac1", "74d3bc26-bb88-4e31-baea-ce754dc0c9f0", "", "", "",],

    // تگ 5 ثانیه
    TIMER_5_SECOND: ["3b407744-0899-46a0-9aa8-55b62f6a0bf5", "8cd1961f-e33d-48e5-9f95-fb522e5fbc87", "907998d0-a992-4d11-9c78-fd14c63d0995", "8771ed5f-5445-4d90-9a90-06cd05e486ec", "", "", "",],

    // تگ 10 ثانیه
    TIMER_10_SECOND:["7723a260-d741-4b75-b98d-32d9449ae922", "41ed3a4b-7db9-468f-b008-8c12ac717381", "b07cb615-617d-4d49-9748-b549b965045a", "9d41d380-9fda-4e35-b5c8-94c42458d091", "", "", "",],

    // تگ 15 ثانیه
    TIMER_15_SECOND: ["ccd038ca-8f3d-4721-9b94-eb1d9f05e428", "d22654ca-e16c-4259-a3f9-d88a62348a34", "ee5bfd4d-9763-40f6-9f5a-f4fe3630f8d3", "873ade7a-82be-42d4-bb7a-678f88ce39f2", "", "", "",],

    // تگ 60 ثانیه
    TIMER_60_SECOND: ["291c4977-b0bd-4ba7-9aa5-a918c1556a60", "a5cb7fa3-a761-4e6c-acde-04e8b1a9dc38", "2aa7af47-eeff-4a2f-8ef7-fed339827c46", "928ad7d1-4155-42fa-9661-aac096b1845a", "", "", "",],

    //تگ کلیک روی محصول
    CLICK_PRODUCT: ["be68b674-22db-4864-b66f-9aa9eec98e34", "57740f88-6b22-4715-9544-018e6dc2ac29", "85d6741e-c097-4729-9018-7c809a9b97f7", "5968fc9a-ed50-4305-91d2-4fa22cb92330", "", "", "",],

    //دیدن اسلاید2
    VISIT_SLIDE2:["3c59b377-38a2-4613-9e00-0f94ba46ea28", "e0fb22ca-711d-41cb-9fcd-1e10a1882825", "f8823a8b-7294-45d2-9c37-cab37a7946fe", "2d9e374c-8125-4d71-bbfe-6b9efaeab03f", "", "", "",],

    //کلیلک روی نوتیف
    CLICK_NOTIFE: ["874f8b54-f600-4a86-b09d-bd71f1342065", "2b27235d-6394-4d34-8401-9131d4f8ab17", "9c30db4f-4f3e-4918-aa0a-33ad5855d76f", "bff6c409-743f-4399-8acb-fed1a5bbbc64", "", "", "",],

    //اتوپلی
    VISIT_AUTOPLAY:["48411ee1-895b-4496-89f3-f0591eb604fc", "cbe71001-1576-4c4f-a133-d3e588a2dd53", "e202b522-af03-4e73-9c68-a53fa0da2fa9", "8966c747-11c1-4a8c-9318-fa4a39b9f970", "", "", "",],

    //المان های چپ
    CLICK_LEFT:["eee9ee13-6635-4813-ab33-548737fe8f78", "ec455407-900d-463c-b24d-40dcb3f5fb22", "e87955f0-c110-4100-9af1-d5b215cf63f9", "ea32a101-6e8e-4908-8cd1-d3a354f561b0", "", "", "",],


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


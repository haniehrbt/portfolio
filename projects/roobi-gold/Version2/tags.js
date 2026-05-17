const ACTIONS = {
    // WINDOW
    WINDOW_LOADED: ["8313bf6a-7a7b-4417-9923-1869c4de143e", "9d57f840-d03d-45e1-96db-9f27a31b934d", "8a93a7c1-828d-4443-b8c2-3473b2677aab", "", "", "", "",],
    // DOM
    DOM_CONTENT_LOADED: ["", "", "", "", "", "", "",],

    // تگ صفر ثانیه
    TIMER_0_SECOND: ["fc9bb587-bb24-4fa4-a636-f3ae432ca5b1", "40c060d4-7f2f-4dc2-9cde-2d567b41517a", "011632a8-9a00-4abd-a91a-c46077de0e4a", "", "", "", "",],

    // تگ 5 ثانیه
    TIMER_5_SECOND: ["43c01da3-c906-4462-8b50-20065bea73b6", "1ba70f26-f8e7-4a87-ac08-6d0db8394022", "46ec8e7e-c710-4cc0-9c1c-da2e48c6e24c", "", "", "", "",],

    // تگ 10 ثانیه
    TIMER_10_SECOND: ["245909b9-1d5d-48ec-a2f7-5f7d9e55cecd", "6a901dc1-9a0b-43d4-aa15-b56733c78d4e", "e327bd1d-4c4a-4ccc-844c-f4f3aafc8ff7", "", "", "", "",],

    // تگ 15 ثانیه
    TIMER_15_SECOND: ["44cb0843-7cc9-404e-ba31-21598a63bfdb", "9857d3fa-73f1-4145-89a9-78cb4e2a8bf0", "af24c450-19dd-408d-bacc-576b381b7f83", "", "", "", "",],

    // تگ 60 ثانیه
    TIMER_60_SECOND: ["5de4d237-a943-4279-943e-26d87853ab54", "ed6eb85b-c598-4a83-be06-d70140b8f775", "b8e360e6-1883-4ba3-97b9-4756613e762e", "", "", "", "",],

        // کلیک روی cta
       CLICK_CTA: ["a11a038d-bf33-4d53-945a-d1f3b639a018", "133f2e4d-cafe-471d-8854-a37c76f27df0", "28cc2e55-63f6-4188-a935-650bb6e6345a", "", "", "", "",],

    // کلیک روی اختصاصی
    VISIT_PRODUCT: [
        [ "647044a6-b70a-49fd-8502-749114f55af5", "d6399a43-dbf7-4042-94e0-fdbb0226f55a", "dc88eed9-2eea-4005-9ea5-f68bf8f4eef4", "", "",], // محصول اول
        [ "0ea90b7d-1473-4438-931a-b5fef44ed0e4", "a6d8445e-ceeb-4aa7-88fe-53db83687f97", "0de0e519-09bf-4510-b8a8-8c2013bb316c", "", "",], // دوم
        [ "dfed7628-e503-404b-8dfa-8159bbe537b3", "1b184d4e-587f-4169-a2af-e5ec37a0385d", "ac5d2718-b025-49e3-aaeb-0967b8f62ab4", "", "",], // سوم
        [ "f78d324f-599b-49dd-b443-0742de6af5bb", "9b175d0b-653a-4bee-bd5a-590b21c5c595", "aad9a6f7-a9e8-4568-bd3a-a422827d7ba5", "", "",], // چهارم
        [ "26fb9b92-b399-4e56-b077-31b1d93852e6", "bcfb872b-7eff-4dd4-b86c-dd8ee9d8061c", "c6dc5690-5d3e-4154-a9df-c6dc0394acbe", "", "",], // پنجم
        [ "ad2dac41-bd31-4d52-a3d6-5c35f236fcd0", "a310f77e-9f45-4d75-9658-0c8f889411bb", "6e61b207-e725-4327-a4e2-c7236fb21edb", "", "",], // ششم
    ],

    // کلیک روی محصول
    CLICK_PRODUCT: [ "63f5ab48-f2ef-425b-a93d-a14b641cc0a0", "d6bae8ac-7921-4632-aec2-4b473b9f7aea", "e33ec77a-5581-42f9-b188-4c20261186c5", "", "",],

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


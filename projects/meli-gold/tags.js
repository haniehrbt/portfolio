const ACTIONS = {
    // WINDOW
    WINDOW_LOADED:["2ca75db6-b51e-4c00-acb0-dcb393ecde54", "74adf80c-c5bc-4538-8df7-f5f2add99fe6", "be402638-b69a-4346-a2ed-48216bb23eba", "ca90c056-d12b-465a-81a9-05676fb8782d", "4bfe7414-b413-48d4-a401-b809c8001335", "dd221ca9-9d5a-420d-95d4-22241478850a", "34b2bf80-9866-402b-af77-0a3147c2b991",],

    // DOM
    DOM_CONTENT_LOADED: ["0512be1b-51e2-49a3-92b9-dd789bc0cc3c", "9bcdd2a7-f9c9-486f-a8ca-29ba78b5e7b9", "90730c64-9d92-419d-9ad8-8da931cb1fef", "3ea35f44-349d-43a1-a114-8a43da88c8a6", "173ed27a-fd13-4825-bc9c-f1579e261b46", "0ae6936d-53a2-4b04-8cdd-5017d9290997", "49eec677-9025-4566-97fb-dacc5fe67275",],

    // تگ صفر ثانیه
    TIMER_0_SECOND:["d9433407-9fc3-4235-b135-3b1702a728f9", "cbb7fb17-fea9-4955-b450-43b850aa266f", "d2224d8d-ab50-4369-8992-47ad070b805a", "573f634c-9c1e-4e93-81fd-39a6ca8cb1dd", "44dc3251-9efa-4f03-95bd-874726ffc4ea", "eb3c9560-dee4-4e7f-b5ba-772466336fc4", "4cbffe6d-1f71-4e7c-a7c1-d68e08016662",],

    // تگ 5 ثانیه
    TIMER_5_SECOND: ["9d811abb-3cb0-43d7-a23f-ef5a94bb6f1b", "f955e435-4c2c-49b5-adda-13fcedbb30b4", "92a5e11f-cfa3-4d8e-949e-b0ed568f5426", "0b926d2d-7808-462d-b122-0a10d64850c9", "44dc3251-9efa-4f03-95bd-874726ffc4ea", "6abf82f6-5527-42d6-9d98-618abdf67f7d", "439978c4-3e86-4724-96f7-e31f629ffea1",],

    // تگ 10 ثانیه
    TIMER_10_SECOND:["71be22cb-12c1-4449-a585-1959c0dcb664", "92b78eb1-60ad-4e5b-8d6a-e356304ed866", "17800757-8697-46fd-9c65-2da0254a2a05", "ff33c0ec-fd9d-4a27-a702-1d49409f0b82", "4a221864-9def-464c-a767-b4cc8655a3f7", "8f3c6f57-c1ef-4bf8-85cd-44fec32de2fb", "23a6eb6b-808f-44e6-85cf-a604b425082f",],

    // تگ 15 ثانیه
    TIMER_15_SECOND: ["71e3e92e-77b0-40e4-8791-b2da3129e578", "64398b0e-bef7-45fd-a082-587c63b304f9", "7c759064-8697-4f57-9672-e56fecaf2ff2", "9931e0c7-b155-4cc5-9ea2-4d37f6504e04", "c46684e3-e180-4d18-82c2-8bbc49f94b82", "3d830b30-1cd2-44ce-9aba-0d56b9d9b289", "bbed6090-c476-481e-b787-8fda0a9daef4",],

    // تگ 20 ثانیه
    TIMER_20_SECOND: ["56412e20-0d71-4541-82b7-d3fe39b88f1a", "ec292019-5a88-4e04-9f1f-d6c2cd97e892", "1b965787-1a37-484c-bc13-7625cb636b70", "13fbd3a9-ae1c-4765-af57-5a9a89646cb6", "db4bd65b-1f39-4712-8c3c-f164a85787d8", "c8fc4456-fa6b-4c8b-81dd-e8743bcf34f4", "d8f40aad-4a79-4001-9e2b-8d9b0c2afa3d",],

    // تگ 39 ثانیه
    TIMER_39_SECOND: ["b467acd3-4dd6-4ac8-a138-e23009ec4b71", "523e7f2e-cee9-411d-b2d8-7b6de2b62e7e", "240d05d2-e7ec-453d-9ec2-7b714158ad83", "9e40f0fb-b2e9-4ca4-8041-5b45adc5938c", "69929374-6d9e-4b5d-9e32-71b2b5b686e1", "bd980baa-2ae2-48e1-bbd8-160c068ca5e9", "0f24ad7f-6d51-4ddb-9f41-00d94ad63ff0",],

    //کلیک روی دکمه راست
    CLICK_RIGHTBTN: ["64e75fd8-f498-461f-90c5-3373ded7a60b", "5a816f9b-a828-449d-b2d6-a433568e6b56", "7a506bf3-6767-4ad4-880c-33cef77c86a5", "7d803474-eb31-468d-bbfa-067cb317d55f", "447ae371-d765-4235-ae5a-74ddbf000405", "561a4b39-6af7-4123-9b3a-36ebf1ae0c7b", "54f6fb81-0f2b-4b6d-90f7-87013c21cd1e",],

    //کلیک روی دکمه چپ
    CLICK_LEFTBTN: ["6982c7ea-4ed2-40b0-ac12-3071407d65e8", "e5f4a4ac-d6bc-4dec-aab7-17e302c3439b", "5171c353-3bee-4252-ad0f-c6a2012bec93", "3c005c61-a4df-41f4-95ca-2d1a056c4cf6", "ecc4f1da-54bc-4b06-bf90-369fac5eee66", "2e0bff92-f3cf-45a6-8727-8e2e6c152a1c", "942ff9c4-e1bf-4f5d-b251-1b7972a57ade",],


}

function fire_tag(ACTION_TAGS) {
    console.log(ACTION_TAGS)
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
    let tag0sec = true;
    let tag5sec = true;
    let tag10sec = true;
    let tag15sec = true;
    let tag20sec = true;
    let tag39sec = true;
 

    let interval = setInterval(() => {
        const currentTime = getElapsedTimeInSeconds(loadTime);
        if ((currentTime >= 39) && tag39sec) {
            tag39sec = false;
            fire_tag(ACTIONS.TIMER_39_SECOND)
            clearInterval(interval)
        }
        if ((currentTime >= 0) && tag0sec) {
            tag0sec = false;
            fire_tag(ACTIONS.TIMER_0_SECOND)
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
        if ((currentTime >= 20) && tag20sec) {
            fire_tag(ACTIONS.TIMER_20_SECOND)
            tag20sec = false;
        }
        if ((currentTime >= 39) && tag39sec) {
            fire_tag(ACTIONS.TIMER_39_SECOND)
            tag39sec = false;
        }
    }, 1001);
})


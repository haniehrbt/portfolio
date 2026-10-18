const warmWind = document.querySelector('.warmWind');
const coldWind = document.querySelector('.coldWind');
const bg1 = document.querySelector('.bg1');
const bg2 = document.querySelector('.bg2');
const bg3 = document.querySelector('.bg3');
const bearsDefault = document.querySelector('.bears:nth-child(1)');
const warmBears = document.querySelector('.bears:nth-child(2)');
const coldBears = document.querySelector('.bears:nth-child(3)');
const snowGif = document.querySelector('.snowGif'); 
const fireGif = document.querySelector('.fireGifContainer'); 

function playSound(soundFile) {
    const sound = new Audio(soundFile);
    sound.play();
}

document.addEventListener('DOMContentLoaded', function () {
    const tl = gsap.timeline();
    tl.fromTo("body", {
        y: "150vw"
    }, {
        duration: 2,
        y: 0,
        ease: "power2.inOut"
    })
    .fromTo(".overline1", {
        y: "100vh"
    }, {
        duration: 1,
        y: 0,
        ease: "power2.inOut",
        delay: 0.2
    })
    .add([
        gsap.to(".overline1", {
            duration: 0.5,
            opacity: 0,
            ease: "power2.inOut",
            delay: 1.2
        }),
        gsap.to(".imageContainer", {
            duration: 1,
            opacity: 1,
            marginTop: 0,
            ease: "power2.inOut",
            delay: 1.5
        }),
        gsap.to(".btnContainer", {
            duration: 1.2,
            opacity: 1,
            ease: "power2.inOut",
            delay: 1.8
        }),
        gsap.to(".image-text", {
            duration: 1.5,
            opacity: 1,
            delay: 2.5
        })
    ]);

    const imageText = document.querySelector('.image-text');
    let value = parseInt(imageText.textContent);

    let autoplayCount = 0;
    const autoplayMaxCount = 3;
    let autoplayTimer;
    let userHasClicked = false; // متغیر برای تشخیص کلیک کاربر

    function resetToDefault() {
        warmWind.classList.remove('show');
        coldWind.classList.remove('show');
        gsap.to([bg1, bearsDefault], { duration: 0.3, opacity: 1 });
        gsap.to([bg2, bg3, warmBears, coldBears], { duration: 0.3, opacity: 0 });
        fireGif.style.display = 'none';
        snowGif.style.display = 'none';
    }

    function executeAnimation() {
        fire_tag(ACTIONS.VISIT_LASTSLIDE);      
        gsap.to(".imageContainer", {
            duration: 1,
            opacity: 0,
            ease: "power2.inOut",
        });
        gsap.to(".btnContainer", {
            duration: 1.2,
            opacity: 0,
            ease: "power2.inOut",
        });
        gsap.to(".image-text", {
            duration: 1.5,
            opacity: 0,
        });

        gsap.fromTo(".overline2", {
            opacity: 0,
            y: "100vh"
        }, {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power2.inOut",
        });
    }

    function autoplayDecrement() {
        fire_tag(ACTIONS.CLICK_COLDBTN);

        if (value > 16) {
            value -= 3;
            imageText.textContent = value.toString();

            if (value < 22) {
                coldWind.classList.add('show');
                warmWind.classList.remove('show');
                playSound('./snow.mp3');
                gsap.to([bg3, coldBears], { duration: 0.3, opacity: 1 });
                gsap.to([bg1, bg2, bearsDefault, warmBears], { duration: 0.3, opacity: 0 });
                setTimeout(function() {
                    snowGif.style.display = 'block';
                    fireGif.style.display = 'none';
                }, 50);
            } else if (value === 22) {
                resetToDefault();
            }
        } else {
            executeAnimation();
            clearTimeout(autoplayTimer);
            return;
        }

        autoplayCount++;
        if (autoplayCount < autoplayMaxCount) {
            resetAutoplayTimer();
        } else {
            executeAnimation();
        }
    }

    function resetAutoplayTimer() {
        clearTimeout(autoplayTimer);
        autoplayTimer = setTimeout(() => {
            if (!userHasClicked) {
                fire_tag(ACTIONS.AUTOPLAY_TAG);
                console.log("AUTO");
                autoplayDecrement();
            }
        }, 15000);
    }
    

    resetAutoplayTimer();

    document.getElementById('increment').addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        fire_tag(ACTIONS.CLICK_WARMBTN);
        userHasClicked = true; 
        if (value < 31) {
            value += 3;
            imageText.textContent = value.toString();

            if (value > 22) {
                warmWind.classList.add('show');
                coldWind.classList.remove('show');
                playSound('./fire.mp3');
                gsap.to([bg2, warmBears], { duration: 0.3, opacity: 1 });
                gsap.to([bg1, bg3, bearsDefault, coldBears], { duration: 0.3, opacity: 0 });
                setTimeout(function() {
                    fireGif.style.display = 'block';
                    snowGif.style.display = 'none';
                }, 800);
            } else if (value === 22) {
                resetToDefault();
            }
        } else {
            executeAnimation();
        }
        autoplayCount = 0;
        resetAutoplayTimer();
    });

    document.getElementById('decrement').addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        fire_tag(ACTIONS.CLICK_COLDBTN);
        userHasClicked = true; 
        if (value > 16) {
            value -= 3;
            imageText.textContent = value.toString();

            if (value < 22) {
                coldWind.classList.add('show');
                warmWind.classList.remove('show');
                playSound('./snow.mp3');
                gsap.to([bg3, coldBears], { duration: 0.3, opacity: 1 });
                gsap.to([bg1, bg2, bearsDefault, warmBears], { duration: 0.3, opacity: 0 });
                setTimeout(function() {
                    snowGif.style.display = 'block';
                    fireGif.style.display = 'none';
                }, 50);
            } else if (value === 22) {
                resetToDefault();
            }
        } else {
            executeAnimation();
        }
        autoplayCount = 0;
        resetAutoplayTimer();
    });
});

const logo = document.querySelector(".logo").addEventListener("click", (e) => {
    fire_tag(ACTIONS.CLICK_LOGO);
});

const product = document.querySelector(".product").addEventListener("click", (e) => {
    fire_tag(ACTIONS.CLICK_PRODUCT);
});

const bears = document.querySelector(".bears").addEventListener("click", (e) => {
    fire_tag(ACTIONS.CLICK_BEARS);
});

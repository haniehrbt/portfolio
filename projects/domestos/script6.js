const product = document.querySelector('.product');
const banner1 = document.querySelector('.banner1');
const banner2 = document.querySelector('.banner2');
const sink1 = document.querySelector('.sink1');
const sink2 = document.querySelector('.sink2');
const notif = document.querySelector('.notif');
const shenel = document.querySelector('.shenel');
const logo = document.querySelector('.logo');
const arrow = document.querySelector('.arrow');
const left=document.querySelector('.leftContainer');

let floatingTween;
let animationRunning = false;
let clicked = false;
let showCount = 0;
const maxShows = 5;


function startFloating() {
    floatingTween = gsap.to(product, {
        y: "+=7",
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });
}

function stopFloating() {
    if (floatingTween) floatingTween.kill();
}

function swapSinkImages() {
    gsap.to(sink1, {duration: 0.5, opacity: 0, delay: 4.2});
    gsap.to(sink2, {duration: 0.5, opacity: 1, delay: 4});
    fire_tag(ACTIONS.VISIT_SLIDE2)
}

function introAnimation() {
    const tl = gsap.timeline({
        defaults: {ease: "power3.out", duration: 1}
    });
    tl.from(product, {y: -150}, 0)
        .from(banner1, {x: -150}, 0)
        .call(startFloating);
}

function animateDrops() {
    const drops = document.querySelectorAll(".flowsouse");
    drops.forEach((drop, index) => {
        gsap.fromTo(drop,
            {opacity: 0, y: -82},
            {
                opacity: 1,
                y: -10,
                duration: 0.5,
                ease: "power2.out",
                delay: index * 1,
                onComplete: () => {
                    gsap.to(drop, {
                        opacity: 0,
                        y: 15,
                        duration: 1,
                        ease: "power2.in"
                    });
                }
            }
        );
    });
}


function animateProduct() {
    if (animationRunning) return;
    animationRunning = true;

    stopFloating();
    swapSinkImages();

    gsap.set(shenel, {opacity: 0});
    gsap.set(banner1, {opacity: 1});
    gsap.set(banner2, {opacity: 0});
    gsap.set(logo, {opacity: 0});

    const sinkRect = sink1.getBoundingClientRect();
    const productRect = product.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const sinkBottomCenter = viewportHeight - (sinkRect.top + sinkRect.height / 2);
    const productBottomCenter = viewportHeight - (productRect.top + productRect.height / 2);

    const deltaX = sinkRect.left + sinkRect.width / 2 - (productRect.left + productRect.width / 2);
    const deltaY = sinkBottomCenter - productBottomCenter;

    const adjustedDeltaX = deltaX * 0.5;
    const adjustedDeltaY = Math.abs(deltaY) * 0.2;
    const yMovement = deltaY > 0 ? adjustedDeltaY : -adjustedDeltaY;

    const tl = gsap.timeline({defaults: {ease: "power3.inOut"}});

    tl.to(product, {
        duration: 0.5,
        y: "+=1",
        ease: "power2.out",
    })
        .to(product, {
            duration: 1.2,
            rotation: 45,
            x: adjustedDeltaX - 70,
            transformOrigin: "100% 50%",
            ease: "power3.inOut",
        })
        .to(product, {
            duration: 1.5,
            scale: 0.8,
            x: adjustedDeltaX - 40,
            y: yMovement,
            ease: "power2.inOut",
        })

        .to({}, {duration: 0.5})

        .call(() => {
            animateDrops();
        })

        .to(product, {
            duration: 0,
            delay: 2,
        })
        .to(product, {
            duration: 1.5,
            rotation: 0,
            x: 0,
            y: 0,
            scale: 1,
            ease: "power2.out",
            onComplete: () => {
                animationRunning = false;

                const tl2 = gsap.timeline();

                tl2.to(shenel, {
                    duration: 1,
                    opacity: 1,
                    x: 0,
                    ease: "power2.out"
                }, 0);

                tl2.to(banner1, {
                    duration: 1,
                    opacity: 0,
                    ease: "power2.out"
                }, 0);

                tl2.to(logo, {
                    duration: 1,
                    opacity: 1,
                    ease: "power2.out"
                }, 0);

                tl2.to(logo, {
                    duration: 1,
                    opacity: 0,
                display:"none",
                    ease: "power2.out",
                    delay: 3
                }, ">");

                tl2.to(banner2, {
                    duration: 1,
                    opacity: 1,
                    ease: "power2.out",
                    delay: -1
                }, "<");
            }
        });
}

function showNotif() {
    return new Promise((resolve) => {
        if (clicked || showCount >= maxShows) {
            resolve();
            return;
        }
        showCount++;

        gsap.to(notif, {duration: 0.7, bottom: 0, ease: "power3.out"});

        setTimeout(() => {
            gsap.to(notif, {duration: 0.7, bottom: '-120%', ease: "power3.in"});

            setTimeout(() => {
                if (!clicked && showCount < maxShows) {
                    showNotif().then(resolve);
                } else {
                    resolve();
                }
            }, 7000);
        }, 3000);
    });
}

product.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    clicked = true;
    animateProduct();
    arrow.remove();
    fire_tag(ACTIONS.CLICK_PRODUCT);
});

notif.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    gsap.to(notif, {duration: 0.7, bottom: '-120%', ease: "power3.in"});
    fire_tag(ACTIONS.CLICK_NOTIFE);
    console.log("notife");
});

left.addEventListener('click', (e) => {
    fire_tag(ACTIONS.CLICK_LEFT);
    console.log("left");
});
introAnimation();

setTimeout(() => {
    if (!clicked) {
        showNotif().then(() => {
            if (!clicked) {
                fire_tag(ACTIONS.VISIT_AUTOPLAY);
                console.log("auto")
                clicked = true;
                arrow.remove();
                animateProduct();
            }
        });
    }
}, 7000);

const DATA = {
    karaj: {
        dots: [
            {x: -70, y: 85},
            {x: 0, y: 75},
            {x: 5, y: 25},
            {x: -20, y: 12},
            {x: 40, y: 10},
            {x: 60, y: 90},
            {x: 90, y: 8},
        ]
    },
    sari: {
        dots: [
            {x: -50, y: 80},
            {x: 0, y: 75},
            {x: 40, y: 80},
            {x: 100, y: 65},
            {x: -15, y: 15},
            {x: 35, y: 10},
        ]
    },
    rasht: {
        dots: [
            {x: -50, y: 10},
            {x: -10, y: 62},
            {x: 60, y: 80},
            {x: -50, y: 65},
            {x: 50, y: 65},
            {x: 30, y: 80},
            {x: 0, y: 90},
        ]
    },
    shiraz: {
        dots: [
            {x: -50, y: 80},
            {x: -10, y: 77},
            {x: 60, y: 70},
            {x: 90, y: 85},
            {x: 80, y: 65},
            {x: -8, y: 10},
            {x: 30, y: 2},
        ]
    },
    esfehan: {
        dots: [
            {x: -70, y: 65},
            {x: 0, y: 70},
            {x: 85, y: 75},
            {x: -50, y: 15},
            {x: 10, y: 10},
            {x: 100, y: 10},
            {x: 85, y: 13},
        ]
    },
    mashhad: {
        dots: [
            {x: -50, y: 65},
            {x: -10, y: 80},
            {x: 50, y: 85},
            {x: 75, y: 65},
            {x: 95, y: 10},
            {x: 10, y: 10},
        ]
    },
    tehran: {
        dots: [
            {x: -65, y: 75},
            {x: -15, y: 80},
            {x: 0, y: 10},
            {x: 30, y: 80},
            {x: 80, y: 85},
            {x: 120, y: 40},
        ]
    },

}
const DATA_KEYS = Object.keys(DATA);
const DATA_FINAL = [
    {x: -10, y: 85},
    {x: 40, y: 80},
    {x: 100, y: 83},
    {x: 130, y: 20},
    {x: -100, y: 80},
]

const divaar = document.querySelector('.divaar')


const hand = document.querySelector(".hand")
const logo = document.querySelector('.divaar')

// ------------------------------------------------------------------

function tapesh_animation(element) {
    return gsap.to(element, {
        duration: 1,
        repeat: -1,
        opacity: 0,
        scale: 1.3
    })
}

function get_random_index_key() {
    return Math.floor(Math.random() * DATA_KEYS.length)
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function change_src_with_fading(element, newSrc) {
    gsap.to(element, {
        duration: 1,
        opacity: 0,
        onComplete: () => {
            element.src = newSrc;
            gsap.to(element, {
                delay: 0.1,
                duration: 1,
                opacity: 1
            })
        }
    })
}

function remove_dots() {
    const dots = document.querySelectorAll('.dot')
    dots.forEach((dot) => {
        gsap.to(dot, {
            duration: 1,
            opacity: 0,
            onComplete: () => {
                dot.remove()
            }
        })
    })
}

function hard_remove_dots() {
    const dots = document.querySelectorAll('.dot')
    dots.forEach((dot) => {
        dot.remove()
    })
}

function render_dots(dots) {
    if (!Array.isArray(dots)) {
        return;
    }

    shuffle(dots).forEach((dot, index) => {
        const img = document.createElement('img');
        img.src = 'dot.svg';
        img.className = 'dot';
        img.style.zIndex = 10;
        img.style.position = 'fixed';
        img.style.transform = `translateX(-50%)`;
        img.style.marginLeft = `${dot.x}px`;
        img.style.left = `50%`;
        img.style.bottom = `${dot.y}px`;
        document.body.appendChild(img);

        setTimeout(() => {
            if (is_slide1) {
                img.classList.add('show');
                gsap.to(img, {
                    duration: 0.5,
                    opacity: 1
                });
            }
        }, index * 400);
    });

}

const cityImg = document.querySelector('.city');
const titleImg = document.querySelector('.title');
const onDivaarMap = document.querySelector('.onDivaarMap');
let randomIndex = null

function init() {
    while (true) {
        const buff = get_random_index_key();
        if (buff !== randomIndex) {
            randomIndex = buff;
            break;
        }
    }

    const randomKey = DATA_KEYS[randomIndex];

    change_src_with_fading(cityImg, `${randomKey}.svg`)
    change_src_with_fading(titleImg, `${randomKey}-title.svg`)
    remove_dots()

    setTimeout(() => {
        render_dots(DATA[randomKey].dots);
    }, 1500)
}

init()

const city_interval = setInterval(init, 5000)
let is_slide1 = true
let is_slide2 = false
document.body.addEventListener('click', e => {
    if (is_slide1) {
        clearTimeout(autoplay)
        e.preventDefault()
        e.stopPropagation()
        go_to_slide2()
        clearInterval(city_interval)
    }
})


function add_bordered_boxed(dots) {
    dots.forEach((dot, index) => {
        if (is_slide2) {
            const div = document.createElement('div');
            div.className = 'tapesh';
            div.style.position = 'fixed';
            div.style.transform = `translateX(-50%)`;
            div.style.marginLeft = `${dot.x}px`;
            div.style.left = `50%`;
            div.style.zIndex = 0;
            div.style.bottom = `${dot.y}px`;


            const img = document.createElement('img');
            img.src = 'dot.svg';
            img.className = 'dot';
            img.style.zIndex = 10;
            img.style.position = 'fixed';
            img.style.transform = `translateX(-50%)`;
            img.style.marginLeft = `${dot.x}px`;
            img.style.left = `50%`;
            img.style.bottom = `${dot.y}px`;
            document.body.appendChild(img);

            div.addEventListener('click', e => {
                e.preventDefault()
                e.stopPropagation()
                clearBadges()
                handle_dot_click(index, dot)
                cancelNotificationCycle()
                bottomImage2.remove();
            })
            img.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                clearBadges();
                handle_dot_click(index, dot);
                cancelNotificationCycle();                              
                bottomImage2.remove();

            });

            setTimeout(() => {
                if (is_slide2) {
                    img.classList.add('show');
                    gsap.to(img, {
                        duration: 0.5,
                        opacity: 1
                    });
                    document.body.appendChild(div);
                    tapesh_animation(div)
                }
            }, index * 500);

        }
    })

}

function clearBadges() {
    const badges = document.querySelectorAll(`.dot-img`);
    if (!badges) {
        return
    }
    badges.forEach(badge => {
        badge.remove()
    })

}

function handle_dot_click(index, dot) {
    fire_tag(ACTIONS.CLICK_DOT)
    const img = document.createElement('img');
    img.src = `badge${index}.svg`;
    img.className = `badge dot-img dot-img${index}`;
    img.style.zIndex = 20;
    img.style.position = 'fixed';
    img.style.transform = `translateX(-50%)`;
    img.style.marginLeft = `${dot.x + 10}px`;
    img.style.marginBottom = "15px";
    img.style.left = `50%`;
    img.style.bottom = `${dot.y}px`;
    img.addEventListener('click', e => {
        fire_tag(ACTIONS.CLICK_BADGE)
    })
    document.body.appendChild(img);
}

const autoplay = setTimeout(() => {
    go_to_slide2()
    fire_tag(ACTIONS.AUTOPLAY)
    clearInterval(city_interval)
}, 22000)

const container = document.createElement('div');
container.style.position = 'fixed';
container.style.bottom = '0';
container.style.left = '0';
container.style.width = '100vw';
container.style.height = '100vh';
container.style.zIndex = '999999';
container.style.display = 'none';
container.style.opacity = '0';


const bottomImage1 = document.createElement('img');
bottomImage1.src = 'bannerNotife1.png';
bottomImage1.style.position = 'fixed';
bottomImage1.style.bottom = '0';
bottomImage1.style.left = '0';
bottomImage1.style.width = '100%';

const bottomImage2 = document.createElement('img');
bottomImage2.src = 'bannerNotife2.svg'; 
bottomImage2.style.position = 'fixed';
bottomImage2.style.left = '50%';           
bottomImage2.style.bottom = '82px';         
bottomImage2.style.transform = 'translateX(-50%)'; 
bottomImage2.style.marginLeft = '-100px';      
bottomImage2.style.width = '150px';  
bottomImage2.style.zIndex = '10';               
bottomImage2.style.opacity = '0';            
bottomImage2.style.transition = 'opacity 0.5s ease';

document.body.appendChild(bottomImage2);

document.body.appendChild(bottomImage2);
bottomImage1.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fire_tag(ACTIONS.CLICK_NOTIF)
    hideNotification();
});

bottomImage2.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fire_tag(ACTIONS.CLICK_NOTIF)
    hideNotification();
});


container.appendChild(bottomImage1);
document.body.appendChild(container);


let timerShow = null;
let timerHide = null;
let isUserClicked = false;
let notifToggle = true; 

function showNotification() {
    if (notifToggle) {
        container.style.display = 'block';
        bottomImage2.src = 'bannerNotife2.svg';

        bottomImage1.style.display = 'block';
        gsap.fromTo(container, {y: '100%', opacity: 0}, {y: '0%', opacity: 1, duration: 0.8});
        bottomImage2.style.opacity = '0';
        bottomImage2.style.pointerEvents = 'none';
    } else {
        container.style.display = 'none';
        bottomImage2.style.opacity = '1';
        bottomImage2.style.pointerEvents = 'auto';
        bottomImage2.classList.add('pulse-animation');
    }
}

function hideNotification() {
    if (notifToggle) {
        gsap.to(container, {
            y: '100%',
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                container.style.display = 'none';
            }
        });
    } else {
        bottomImage2.style.opacity = '0';
        bottomImage2.style.pointerEvents = 'none';
    }
}


function startNotificationCycle() {
    if (isUserClicked) return;
    clearTimeout(timerShow);
    clearTimeout(timerHide);

    timerShow = setTimeout(() => {
        if (isUserClicked) return;
        showNotification();

        timerHide = setTimeout(() => {
            hideNotification();
            notifToggle = !notifToggle;
            if (!isUserClicked) startNotificationCycle();
        }, 4000);

    }, 7000);
}



function cancelNotificationCycle() {
    isUserClicked = true;
    clearTimeout(timerShow);
    clearTimeout(timerHide);
    removeClickListener();
    bottomImage2.remove();
    bottomImage1.remove();


    
}

function onUserClick() {
    cancelNotificationCycle();
}

function addClickListener() {
    window.addEventListener('click', onUserClick);
}

function removeClickListener() {
    window.removeEventListener('click', onUserClick);
}


function go_to_slide2() {
    fire_tag(ACTIONS.SLIDE2)
    gsap.to(".hand", {
        duration: 0.5,
        delay: 3,
        opacity: 1,
    });
    gsap.to(onDivaarMap, {
        width: "98.12px",
        duration: 1,
    });
    gsap.to(divaar, {
        opacity: 0,
        duration: 1
    });

    is_slide1 = false;
    is_slide2 = true;
    hard_remove_dots();

    setTimeout(() => {
        add_bordered_boxed(DATA_FINAL);
    }, 1000);

    gsap.to(".overline", {
        bottom: 0,
        duration: 1
    });
    gsap.to(".bg", {
        opacity: 0,
        background: "#444444",
        duration: 1
    });
    gsap.to(".bg-img", {
        opacity: 1,
        duration: 1
    });

    addClickListener();
    startNotificationCycle();
}

logo.addEventListener('click', () => {
    fire_tag(ACTIONS.CLICK_LOGO)
})

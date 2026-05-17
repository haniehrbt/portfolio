const contentElement = document.querySelector(".content");
const contentScrollHeight = contentElement.scrollHeight;
const itemsCount = Math.round(contentScrollHeight / 100);
const leftContainer = document.querySelector(".leftContainer");
let currentSlideNumber = 0;
const products = document.querySelectorAll(".product");

setTimeout(() => {
    document.querySelector(".floatRight").classList.add("swing");
}, 500);

const imageCache = {};
let overline = document.querySelector(".overline");
const rightContainer = document.querySelector(".overlineConntainer");
const overlines = [
    "./overline1.png",
    "./overline2.png",
    "./overline3.png",
    "./overline4.png",
    "./overline5.png",
    "./overline6.png",
];

(async function init() {
    products.forEach((value, key) => {
        if (key !== 0) {
            value.style.opacity = "0";
        }
    });
    for (const url of overlines) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const urlObject = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = urlObject;
            img.classList.add("overline");
            imageCache[url] = img;
        } catch (error) {
            console.error("Error loading overline:", error);
        }
    }
    fire_tag(ACTIONS.VISIT_PRODUCT[0]);
})();

function changeOverlineSrc(url) {
    if (overline) overline.remove();
    overline = imageCache[url];
    overline.style.opacity = 0;
    rightContainer.appendChild(overline);
}

function changeOverline(nextNumber) {
    gsap.to(overline, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            changeOverlineSrc(overlines[nextNumber]);
            gsap.to(overline, {
                duration: 0.5,
                opacity: 1,
            });
        },
    });
}

function handleBackground(currentNumber, nextNumber) {
    changeOverline(nextNumber);
    fire_tag(ACTIONS.VISIT_PRODUCT[nextNumber]);

    gsap.to(products[currentNumber % products.length], {
        duration: 0.5,
        opacity: 0,
    });
    gsap.to(products[nextNumber], {
        duration: 0.5,
        opacity: 1,
    });
}

function handleScroll(percent, scrollPx, heightOfPage) {
    const totalSlides = products.length;
    const slideIntervalPercent = 7;

    let newSlideNumber = Math.floor(percent / slideIntervalPercent);
    newSlideNumber = newSlideNumber % totalSlides;

    if (newSlideNumber === currentSlideNumber) {
        return;
    }
    handleBackground(currentSlideNumber, newSlideNumber);
    currentSlideNumber = newSlideNumber;
}

window.addEventListener("message", (e) => {
    if (e.data.type !== "yn-window-scroll") {
        return;
    }
    handleScroll(e.data.scrolled, e.data.scrolledInPx, e.data.heightOfPage);
});

document.querySelector(".logoContainer").addEventListener("click", () => {
    fire_tag(ACTIONS.CLICK_LOGO);
});

products.forEach((product) => {
    product.addEventListener("click", () => {
        fire_tag(ACTIONS.CLICK_PRODUCT);
        console.log("product");
    });
});

const cta = document.querySelector(".cta");
if (cta) {
    cta.addEventListener("click", () => {
        fire_tag(ACTIONS.CLICK_CTA);
        console.log("click");
    });
}

if (window.innerWidth >= 768) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const percent = (scrollTop / (docHeight - winHeight)) * 100;

        handleScroll(percent, scrollTop, docHeight);
    }, { passive: true });
}

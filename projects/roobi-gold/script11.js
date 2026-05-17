const contentElement = document.querySelector(".content");
const contentScrollHeight = contentElement.scrollHeight;
const itemsCount = Math.round(contentScrollHeight / 100);
const productContainer = document.querySelector(".productContainer");
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
    "./overline1.svg",
    "./overline2.svg",
    "./overline3.svg",
    "./overline4.svg",
    "./overline5.svg",
    "./overline6.svg",
];

(function init() {
    products.forEach((value, key) => {
        if (key !== 0) {
            value.style.opacity = "0";
        }
    });
    overlines.forEach(async (url, index) => {
        const response = await fetch(url);
        const data = await response.text();
        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(data, "image/svg+xml");
        imageCache[url] = svgDocument.documentElement.cloneNode(true);
        imageCache[url].classList.add("overline");
        fire_tag(ACTIONS.VISIT_PRODUCT[0]);
    });
})();

function changeOverlineSrc(url) {
    overline.remove();
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

function handleBackground(currentNumber, NextNumber) {
    changeOverline(NextNumber);
    fire_tag(ACTIONS.VISIT_PRODUCT[NextNumber]);

    gsap.to(products[currentNumber % products.length], {
        duration: 0.7,
        opacity: 0,
    });
    gsap.to(products[NextNumber], {
        duration: 0.7,
        opacity: 1,
    });
}

function handleScroll(percent, scrollPx, heightOfPage) {
    const totalSlides = products.length;
    const slideIntervalPercent = 5;

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

products.forEach((product, key) => {
    product.addEventListener("click", () => {
        fire_tag(ACTIONS.CLICK_PRODUCT);
    });
});

productContainer.addEventListener("click", () => {
    fire_tag(ACTIONS.CLICK_PRODUCT);
});
leftContainer.addEventListener("click", () => {
    fire_tag(ACTIONS.CLICK_LOGO);
});

if (window.innerWidth >= 768) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const percent = (scrollTop / (docHeight - winHeight)) * 100;

        handleScroll(percent, scrollTop, docHeight);
    }, { passive: true });
}

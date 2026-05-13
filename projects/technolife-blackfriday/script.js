const persons = document.querySelectorAll('.person');
let current_person = 0;

try {
  const video = document.querySelector('video');
  video.muted = true;
  video.play();
} catch (err) {
  console.log(err);
}

const price = document.querySelector('.price');
const oldPrice = document.querySelector('.old-price');
const badge = document.querySelector('.badge');
const product = document.querySelector('.product');
const title = document.querySelector('.title');
const secondsElement = document.querySelector('.seconds');
const minutesElement = document.querySelector('.minutes');

let startDate = null;

const defaultData = {
  title: 'گوشی موبایل iPhone 17 Pro Max 256Gb',
  price: 250900000,
  discountedPrice: 25090000,
  image:
    'https://www.technolife.com/image/color_image_TLP-149697_ffa600_af790049-ca9e-4c78-86d4-5d8bcf0c2024.png',
};

function formatPrice(num) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formatted.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

function calculateDiscount(originalPrice, discountedPrice) {
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
}

function updateProductData(data) {
  const discountPercent = calculateDiscount(data.price, data.discountedPrice);

  title.textContent = data.title;
  price.textContent = formatPrice(data.discountedPrice) + ' تومان';
  oldPrice.textContent = formatPrice(data.price) + ' تومان';
  badge.textContent = discountPercent + '٪ درصد';
  product.src = data.image;

  [price, oldPrice, badge, product, title].forEach((el) =>
    el.classList.remove('skeleton')
  );
}

async function fetchProductData() {
  try {
    const response = await fetch(
      'https://rest-cmp.technolife.com/campaign/time-tunnel/api/v1/Yektanet/products'
    );
    const result = await response.json();

    if (result.isSuccess && result.data && result.data.length > 0) {
      const productData = result.data[0];
      startDate = productData.startDate
        ? new Date(productData.startDate)
        : null;
      updateProductData({
        title: productData.title,
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        image: productData.image,
      });
    } else {
      startDate = null;
      updateProductData(defaultData);
    }
  } catch (error) {
    console.log('Error fetching product data:', error);
    updateProductData(defaultData);
  } finally {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}

fetchProductData();

setInterval(function () {
  next_person = (current_person + 1) % persons.length;
  gsap.to(persons[next_person], {
    opacity: 1,
    duration: 1,
  });
  gsap.to(persons[current_person], {
    opacity: 0,
    duration: 1,
    onComplete: function () {
      current_person = next_person;
    },
  });
}, 5000);

function updateCountdown() {
  const now = new Date();

  if (!startDate) {
    // اگر startDate نداریم، تایم تا ساعت بعدی رو نشون بده
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const diff = nextHour - now;
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
    return;
  }

  const diff = startDate - now;

  if (diff <= 0) {
    // اگر از startDate رد شده بود، 00:00 نشون بده
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
  } else {
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
  }
}

persons.forEach((person) => {
  person.addEventListener('click', () => {
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });
});

document.querySelector('.card-bg').addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK2);
});

document.querySelector('.logo').addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK3);
});

document.querySelector('.overline').addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK4);
});

document.querySelector('.header').addEventListener('click', () => {
  fire_tag(ALL_EVENT_TYPES.CLICK5);
});

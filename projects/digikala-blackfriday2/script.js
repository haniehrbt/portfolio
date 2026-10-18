document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('.intro');
  const audio = new Audio('boogh.m4a');
  const bg = document.querySelector('.bg');
  const banner = document.querySelector('.banner');
  const million = document.querySelector('.million');
  const logo = document.querySelector('.logo');
  const cta = document.querySelector('.cta');
  const products = document.querySelectorAll('.product');
  const percent = document.querySelectorAll('.percent');
  const seventeen = document.querySelectorAll('.seventeen');
  const overline = document.querySelectorAll('.overline');

  intro.addEventListener('click', () => {
    audio.play();
    fire_tag(ALL_EVENT_TYPES.CLICK1);
  });

  gsap.to(intro, {
    duration: 11,
    right: '105%',
    ease: 'linear',
    onComplete: init,
  });

  function init() {
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE02);
    gsap.fromTo(
      bg,
      { opacity: 0, bottom: '-200px' },
      { opacity: 1, bottom: 0 }
    );
    gsap.to(banner, {
      delay: 1,
      opacity: 1,
      duration: 1,
      onComplete: () => {
        active_interval();
        setTimeout(() => {
          clearInterval(interval);
          show_final();
        }, 25000);
      },
    });
    gsap.to(million, {
      delay: 1,
      opacity: 1,
      duration: 1,
    });
    gsap.to(cta, {
      delay: 1.2,
      duration: 1,
      opacity: 1,
    });
  }

  let current_product = 0;
  let interval = null;

  function active_interval() {
    interval = setInterval(show_product, 5000);
    show_product();

    function show_product() {
      console.log(current_product);
      products.forEach((product, index) => {
        gsap.to(product, {
          opacity: 0,
        });
      });
      gsap.to(products[current_product], {
        duration: 1,
        opacity: 1,
      });

      current_product = (current_product + 1) % 3;
    }
  }

  function show_final() {
    fire_tag(ALL_EVENT_TYPES.VISIT_SLIDE06);
    products.forEach((product, index) => {
      gsap.to(product, {
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          product.remove();
        },
      });
    });

    gsap.to(overline, { opacity: 1, duration: 1 });
    gsap.to(logo, { opacity: 1, duration: 1 });
    gsap.to(banner, { opacity: 0, duration: 1 });
    gsap.to(million, { opacity: 0, duration: 1 });
    gsap.to(percent, { opacity: 1, duration: 1 });
    gsap.to(seventeen, { opacity: 1, duration: 1 });

    setTimeout(() => {
      fire_tag(ALL_EVENT_TYPES.LOOP);
      location.reload();
    }, 8000);
  }
});

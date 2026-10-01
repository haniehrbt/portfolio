const BASE_URL = 'https://material.uranus-agency.ir';

const API_7DAYS = `${BASE_URL}/api/average/7days/BTC_tabdeal_USDT`;
const API_30DAYS = `${BASE_URL}/api/average/30days/BTC_tabdeal_USDT`;
const API_THIS_DAY = `${BASE_URL}/api/current-day/BTC_tabdeal_USDT`;
const DARIC_API = 'https://api-ads.tabdeal.org/r/service/plots/currencies/';

const current_price_element = document.querySelector('.price');

let data_7days = [];
let data_30days = [];
let data_today = [];

function toPersianDigits(number) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return number.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}

// async function set_now_price() {
//     const res = await fetch(DARIC_API);
//     try {
//         const data = await res.json();
//         const price_response = Number.parseInt(data.BTC.USDT.price).toLocaleString('fa-IR');
//         const price_text = `${price_response}` + " USDT";
//         if (price_text !== current_price_element.innerText) {
//             gsap.to(current_price_element, {
//                 duration: 0.5, opacity: 0, onComplete: () => {
//                     current_price_element.innerText = price_text;
//                     gsap.to(current_price_element, {duration: 0.5, opacity: 1});
//                 }
//             });
//         }
//     } catch (err) {
//         console.log(err)
//     }
//
// }
//
// set_now_price();

const FALLBACK_TODAY = [
  {hour:'ساعت ۱',price:62800},{hour:'ساعت ۳',price:63100},{hour:'ساعت ۵',price:62500},
  {hour:'ساعت ۷',price:63400},{hour:'ساعت ۹',price:64200},{hour:'ساعت ۱۱',price:65100},
  {hour:'ساعت ۱۳',price:64800},{hour:'ساعت ۱۵',price:65600},{hour:'ساعت ۱۷',price:66200},
  {hour:'ساعت ۱۹',price:65900},{hour:'ساعت ۲۱',price:66700},{hour:'ساعت ۲۳',price:67100},
];

async function set_today_datas() {
  try {
    const res = await fetch(API_THIS_DAY);
    const body = await res.json();
    for (const row of body) {
      if (row.hour == 24) continue;
      data_today.push({ hour: `ساعت ${row.hour}`, price: row.price });
    }
    if (!data_today.length) throw new Error('empty');
    const price_response = Number.parseInt(data_today[data_today.length - 1].price).toLocaleString('fa-IR');
    const price_text = `${price_response}` + ' USDT';
    if (price_text !== current_price_element.innerText) {
      gsap.to(current_price_element, {
        duration: 0.5, opacity: 0,
        onComplete: () => {
          current_price_element.innerText = price_text;
          gsap.to(current_price_element, { duration: 0.5, opacity: 1 });
        },
      });
    }
    init_chart(data_today);
  } catch (_) {
    data_today = FALLBACK_TODAY;
    if (current_price_element) current_price_element.innerText = '۶۷,۱۰۰ USDT';
    init_chart(data_today);
  }
}

set_today_datas();

async function set_7days_datas() {
  const res_7days = await fetch(API_7DAYS);
  const body_7days = await res_7days.json();
  data_7days = [];
  for (const row of body_7days) {
    data_7days.push({ hour: row.date, price: row.averagePrice });
  }
}

async function set_30days_datas() {
  const res_30days = await fetch(API_30DAYS);
  const body_30days = await res_30days.json();
  data_30days = [];
  for (const row of body_30days) {
    data_30days.push({ hour: row.date, price: row.averagePrice });
  }
}

let flag = true;
const timeout = setTimeout(() => {
  flag = false;
  set_7days_datas();
  set_30days_datas();
}, 5000);

const mychart = document.getElementById('myChart');
mychart.addEventListener('touchstart', (e) => {
  e.stopPropagation();
  e.preventDefault();
});
const ctx = mychart.getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, 120);
gradient.addColorStop(0, '#F1B80C');
gradient.addColorStop(1, 'rgba(0,0,0,0)');

let chart = null;

function init_chart(data) {
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((item) => item.hour),
      datasets: [
        {
          label: 'قیمت',
          data: data.map((item) => item.price),
          fill: true,
          backgroundColor: gradient,
          borderColor: '#F1B80C',
          tension: 0.4,
          pointBackgroundColor: '#0F0F10',
          pointBorderColor: '#F1B80C',
          pointHoverRadius: 4,
          pointRadius: 2,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      responsive: true,
      scales: {
        x: {
          ticks: {
            font: {
              family: 'YekanBakh',
              size: 6,
            },
            display: true,
            color: '#ffdb6f',
            callback: function (value) {
              return toPersianDigits(this.getLabelForValue(value));
            },
          },
          grid: { display: true },
        },
        y: {
          ticks: {
            font: {
              family: 'YekanBakh',
              size: 8,
            },
            display: true,
            color: '#ffdb6f',
            callback: function (value) {
              return toPersianDigits(this.getLabelForValue(value));
            },
          },
          grid: { display: true },
        },
      },
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              family: 'YekanBakh',
              size: 8,
            },
          },
        },
        tooltip: { enabled: true, intersect: false },
      },
    },
  });
}

document
  .querySelectorAll('.segmented-control input[type="radio"]')
  .forEach((radio) => {
    radio.addEventListener('change', (e) => {
      if (!radio.checked) return;
      switch (radio.id) {
        case '24hours':
          updateChart(data_today);
          break;
        case 'lastWeek':
          if (!data_7days.length) {
            set_7days_datas().then(() => updateChart(data_7days));
          } else {
            updateChart(data_7days);
          }
          break;
        case 'lastMonth':
          if (!data_30days.length) {
            set_30days_datas().then(() => updateChart(data_30days));
          } else {
            updateChart(data_30days);
          }
          break;
      }
    });
  });

function updateChart(newData) {
  chart.data.labels = newData.map((item) => item.hour);
  chart.data.datasets[0].data = newData.map((item) => item.price);
  chart.update();
}

document.querySelector('.timeBox').addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
});

const hours = document.querySelector('.hours');
const lastWeek = document.querySelector('.lastWeek');
const lastMonth = document.querySelector('.lastMonth');
hours.addEventListener('click', async (e) => {
  if (flag) {
    await set_7days_datas();
    await set_30days_datas();
    flag = !flag;
    clearTimeout(timeout);
  }
  fire_tag(ACTIONS.CLICK_TODAY);
  e.stopPropagation();
  e.preventDefault();
  console.log('DAY');
  lastMonth.classList.remove('checked');
  lastWeek.classList.remove('checked');
  hours.classList.add('checked');
  updateChart(data_today);
});

lastWeek.addEventListener('click', async (e) => {
  if (flag) {
    await set_7days_datas();
    await set_30days_datas();
    flag = !flag;
    clearTimeout(timeout);
  }
  fire_tag(ACTIONS.CLICK_WEEK);
  e.stopPropagation();
  e.preventDefault();
  console.log('WEEK');
  lastMonth.classList.remove('checked');
  lastWeek.classList.add('checked');
  hours.classList.remove('checked');
  updateChart(data_7days);
});

lastMonth.addEventListener('click', async (e) => {
  e.stopPropagation();
  e.preventDefault();
  fire_tag(ACTIONS.CLICK_MONTH);
  console.log('MONTH');
  lastMonth.classList.add('checked');
  lastWeek.classList.remove('checked');
  hours.classList.remove('checked');

  if (!data_30days.length) {
    await set_30days_datas();
  }
  updateChart(data_30days);
});

const cta = document.querySelector('button');

cta.addEventListener('click', (e) => {
  cta.classList.add('hover-effect');
  console.log('CLICK');
  fire_tag(ACTIONS.CLICK_CTA);
  setTimeout(() => {
    cta.classList.remove('hover-effect');
  }, 2000);
});

const canvas = document.querySelector('.canvasContainer');
console.log(canvas);
canvas.addEventListener('mouseover', (e) => {
  // console.log("canvas");
  fire_tag(ACTIONS.CLICK_CANVAS);
});

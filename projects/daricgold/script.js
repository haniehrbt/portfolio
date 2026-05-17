function setActive(clickedButton) {
  const buttons = document.querySelectorAll('.segmented-control button');

  buttons.forEach((button) => {
    button.classList.remove('active');
  });

  clickedButton.classList.add('active');
}

const API_7DAYS = `https://material.uranus-agency.ir/api/average/7days/gold_daric`;
const API_30DAYS = `https://material.uranus-agency.ir/api/average/30days/gold_daric`;
const API_THIS_DAY = `https://material.uranus-agency.ir/api/current-day/gold_daric`;
const DARIC_API = 'https://apie.daric.gold/api/Dashboard/PairList?src=TMN';

const current_price_element = document.querySelector('.price');
const data_7days = [];
const data_30days = [];

const data_today = [];

async function set_now_price() {
  const res = await fetch(DARIC_API);
  try {
    const data = await res.json();
    const price_response = Number.parseInt(data[0].bestSell).toLocaleString(
      'fa-IR'
    );
    const price_text = `${price_response} تومان`;
    if (price_text !== current_price_element.innerText) {
      gsap.to(current_price_element, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
          current_price_element.innerText = price_text;
          gsap.to(current_price_element, { duration: 0.5, opacity: 1 });
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// setInterval(set_now_price, 30000);
set_now_price();

async function set_today_datas() {
  const res = await fetch(API_THIS_DAY);
  const body = await res.json();
  for (const row of body) {
    if (row.hour == 24) {
      continue;
    }
    data_today.push({ hour: `ساعت ${row.hour}`, price: row.price });
  }
  init_chart(data_today);
}

set_today_datas();

async function set_7days_datas() {
  const res_7days = await fetch(API_7DAYS);
  const body_7days = await res_7days.json();
  for (const row of body_7days) {
    data_7days.push({ hour: row.date, price: row.averagePrice });
  }
}

set_7days_datas();

async function set_30days_datas() {
  const res_30days = await fetch(API_30DAYS);
  const body_30days = await res_30days.json();
  body_30days.forEach((row, index) => {
    data_30days.push({ hour: row.date, price: row.averagePrice });
  });
}

set_30days_datas();

const ctx = document.getElementById('myChart').getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, 80);
gradient.addColorStop(0, '#F5C356');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

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
          borderWidth: 1,
          borderColor: '#e8bc5a',
          tension: 0.4,
          pointBackgroundColor: '#f7aa02',
          // pointBorderColor: '#fff',
          pointHoverRadius: 2,
          pointRadius: 1.2,
        },
      ],
    },
    options: {
      interaction: {
        mode: 'index',
        intersect: false,
      },
      responsive: true,
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          intersect: false,
        },
      },
    },
  });
}

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
hours.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
  fire_tag(ACTIONS.CLICK_TODAY);
  // console.log("day");
  lastMonth.classList.remove('checked');
  lastWeek.classList.remove('checked');
  hours.classList.add('checked');
  updateChart(data_today);
});

lastWeek.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
  fire_tag(ACTIONS.CLICK_WEEK);
  // console.log("week");
  lastMonth.classList.remove('checked');
  lastWeek.classList.add('checked');
  hours.classList.remove('checked');
  updateChart(data_7days);
});

lastMonth.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
  fire_tag(ACTIONS.CLICK_MONTH);
  // console.log("month");
  lastMonth.classList.add('checked');
  lastWeek.classList.remove('checked');
  hours.classList.remove('checked');
  updateChart(data_30days);
});

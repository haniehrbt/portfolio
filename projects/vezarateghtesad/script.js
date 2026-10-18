function getNextThursdayMidnight() {
  const now = new Date();
  const day = now.getDay();
  let daysUntilThursday = (5 - day + 7) % 7;
  if (daysUntilThursday === 0) daysUntilThursday = 7;
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilThursday);
  nextThursday.setHours(0, 0, 0, 0);
  nextThursday.setDate(nextThursday.getDate() - 1);
  return nextThursday;
}

function formatTimeUnit(unit) {
  return unit < 10 ? '0' + unit : unit.toString();
}

function toPersianNumbers(input) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return input.toString().replace(/\d/g, (d) => persianDigits[d]);
}

function startCountdownTimer() {
  const targetTime = getNextThursdayMidnight().getTime();
  const spans = document.querySelectorAll('#timerDisplay span');

  function updateTimer() {
    const now = new Date().getTime();
    let diff = targetTime - now;
    if (diff < 0) diff = 0;

    const totalSeconds = Math.floor(diff / 1000);
    const hours = formatTimeUnit(Math.floor(totalSeconds / 3600));
    const minutes = formatTimeUnit(Math.floor((totalSeconds % 3600) / 60));
    const seconds = formatTimeUnit(totalSeconds % 60);

    spans[0].textContent = toPersianNumbers(hours[0]);
    spans[1].textContent = toPersianNumbers(hours[1]);
    spans[3].textContent = toPersianNumbers(minutes[0]);
    spans[4].textContent = toPersianNumbers(minutes[1]);
    spans[6].textContent = toPersianNumbers(seconds[0]);
    spans[7].textContent = toPersianNumbers(seconds[1]);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

window.addEventListener('DOMContentLoaded', startCountdownTimer);

const month = document.querySelector('.number');
const sound = new Audio('output2.mp3');
const logo = document.querySelector('.logo');

month.addEventListener('click', (e) => {
  fire_tag(ACTIONS.CLICK_MONTH);
  sound.play();
  e.preventDefault();
  e.stopPropagation();
});
logo.addEventListener('click', (e) => {
  fire_tag(ACTIONS.CLICK_LOGO);
});

const data = [
  {
    code: 22768,
    singer: 'هنرمند 1',
    song: 'آهنگ 1',
  },
  {
    code: 22812,
    singer: 'هنرمند 2',
    song: 'آهنگ 2',
  },
  {
    code: 22851,
    singer: 'هنرمند 3',
    song: 'آهنگ 3',
  },
  {
    code: 22936,
    singer: 'هنرمند 4',
    song: 'آهنگ 4',
  },
  {
    code: 23015,
    singer: 'هنرمند 5',
    song: 'آهنگ 5',
  },
  {
    code: 23062,
    singer: 'هنرمند 6',
    song: 'آهنگ 6',
  },
  {
    code: 23671,
    singer: 'هنرمند 7',
    song: 'آهنگ 7',
  },
  {
    code: 41081,
    singer: 'هنرمند 8',
    song: 'آهنگ 8',
  },
  {
    code: 42668,
    singer: 'هنرمند 9',
    song: 'آهنگ 9',
  },
  {
    code: 96065,
    singer: 'هنرمند 10',
    song: 'آهنگ 10',
  },
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSubData(data, count) {
  const indices = [];
  while (indices.length < count) {
    let index = getRandomInt(0, data.length - 1);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices.map((index) => data[index]);
}

// Ensure code 96065 is always present, but randomize the other two
const mandatoryCode = 96065;
const mandatoryMusic = data.find((item) => item.code === mandatoryCode);
const remainingPool = data.filter((item) => item.code !== mandatoryCode);
const [rand1, rand2] = getRandomSubData(remainingPool, 2);

// Randomize the order so 48260 can appear in any position
const allThree = [mandatoryMusic, rand1, rand2];
const shuffled = allThree.sort(() => Math.random() - 0.5);
const musics = shuffled;

const imgboxes = document.querySelectorAll('.imgbox');

const newImages = [
  `${musics[0].code}-yellow.svg`,
  `${musics[1].code}-yellow.svg`,
  `${musics[2].code}-yellow.svg`,
];
const originalImages = [
  `${musics[0].code}-white.svg`,
  `${musics[1].code}-white.svg`,
  `${musics[2].code}-white.svg`,
];

imgboxes.forEach((element, index) => {
  element.src = originalImages[index];
});

const audioFiles = [
  new Audio(`${musics[0].code}.mp3`),
  new Audio(`${musics[1].code}.mp3`),
  new Audio(`${musics[2].code}.mp3`),
];

console.log(
  'Audio files created:',
  audioFiles.map((audio) => audio.src)
);

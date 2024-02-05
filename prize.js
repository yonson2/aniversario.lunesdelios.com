import prand from 'pure-rand';

import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

const to = 20;
const quejesoTickets = [];
const shirtPrizes = 2;
const capPrizes = 3;
const eggPrizes = 3;

const luckyShirts = [];
const luckyCaps = [];
const luckyEggs = [];

const rng = prand.xoroshiro128plus(to);

for (let i = 0; i < shirtPrizes; i++) {
  let winner = prand.unsafeUniformIntDistribution(1, to, rng);
  while (luckyShirts.includes(winner) || luckyEggs.includes(winner) || luckyCaps.includes(winner)) {
    winner = prand.unsafeUniformIntDistribution(1, to, rng);
  }
  luckyShirts.push(winner);
}

for (let i = 0; i < capPrizes; i++) {
  let winner = prand.unsafeUniformIntDistribution(1, to, rng);
  while (luckyShirts.includes(winner) || luckyEggs.includes(winner) || luckyCaps.includes(winner)) {
    winner = prand.unsafeUniformIntDistribution(1, to, rng);
  }
  luckyCaps.push(winner);
}

for (let i = 0; i < eggPrizes; i++) {
  let winner = prand.unsafeUniformIntDistribution(1, to, rng);
  while (luckyShirts.includes(winner) || luckyEggs.includes(winner) || luckyCaps.includes(winner)) {
    winner = prand.unsafeUniformIntDistribution(1, to, rng);
  }
  luckyEggs.push(winner);
}

for (let i = 1; i <= to; i++) {
  let select = document.querySelector("select");
  let option = document.createElement("option");
  [option.value, option.text] = [i, i];
  select.add(option);
  select.selectedIndex = -1;
}

function processForm() {
  let value = document.getElementById('location').value;
  if (value === "") {
    alert("Selecciona una papeleta, melón");
    return;
  }
  value = parseInt(value);

  const prize = document.querySelector('#prize-result');

  let imgRoute;

  // insert img
  if (luckyShirts.includes(value)) {
    imgRoute = 'images/premio-camiseta.png';
  } else if (luckyCaps.includes(value)) {
    imgRoute = 'images/premio-gorra.png';
  } else if (luckyEggs.includes(value)) {
    imgRoute = 'images/premio-huevos.png';
  } else {
    imgRoute = 'images/nada.png';
  }

  const newImg = document.createElement('img');
  [newImg.className, newImg.src] = ['h-48 rounded-lg opacity-0', imgRoute];
  prize.replaceChild(newImg, prize.querySelector('img'));
  gsap.to(prize.querySelector('img'), { duration: 0.50, opacity: 1, ease: 'none' });

  // flash modal with result and sound.
  const container = document.getElementById('prize-modal');
  const element = document.createElement("h3");
  const prizeAudio = new Audio('premio.mp3');
  const quejesoAudio = new Audio('quejeso.mp3');
  const loserAudio = new Audio('loser.mp3');

  let audioToPlay = prizeAudio;
  if (quejesoTickets.includes(value)) {
    audioToPlay = quejesoAudio;
    element.classList.add('text-yellow-500');
    element.textContent = "QUEJESO"
  } else if (imgRoute === 'images/nada.png') {
    audioToPlay = loserAudio;
    element.classList.add('text-red-500');
    element.textContent = "LOSER"
  } else {
    element.classList.add('text-green-600');
    element.textContent = "PREMIO";
  }

  container.appendChild(element);
  const duration = 0.96;
  const time = 0;


  const tl = gsap.timeline({
    delay: 0.1,
    repeat: 4,
    repeatDelay: 0.5,
    onStart: () => audioToPlay.play(),
    onRepeat: () => audioToPlay.play(),
    onComplete: () => {
      gsap.set(container, {
        autoAlpha: 0, duration: 0.2, ease: 'power1.in', onComplete: () => {
          element.remove();
          //display text linking to store.
          document.getElementById('outcome-container').classList.remove('hidden');
          let text;
          if (imgRoute === 'images/nada.png') {
            text = "No te ha tocado nada? No pasa nada, todavía estás a tiempo de ";
          } else {
            text = "Te has quedado con ganas de más? Todavía estás a tiempo de "
          }
          gsap.set('#outcome-text', { text })
          gsap.to('#outcome-sentence', { autoAlpha: 1, duration: 2, delay: 0.2 });
        }
      });
    }
  });

  gsap.set(element, { autoAlpha: 0, scale: 0, z: 0.01 });
  gsap.to(container, { duration: 0, ease: 'none', autoAlpha: 1 })

  tl
    .to(element, { duration, scale: 1.2, ease: "slow(0.25, 0.9)" }, time)
    .to(element, { duration, autoAlpha: 1, ease: "slow(0.25, 0.9, true)" }, time);

  //disable form
  const input = document.getElementById("location");
  input.setAttribute("disabled", "disabled");
  input.classList.add('opacity-50', 'cursor-not-allowed')
  const btn = document.getElementById("form-button");
  btn.setAttribute("disabled", "disabled");
  btn.classList.add('opacity-50', 'cursor-not-allowed')

}

const button = document.getElementById("form-button");
button.addEventListener("click", processForm);

function getCountdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);

  const timeDiff = target - now;

  const hours = Math.min(99, Math.floor(timeDiff / (1000 * 60 * 60))); // max value or css breaks
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

// to trigger a fake event.
// const targetDate = new Date();
// targetDate.setSeconds(targetDate.getSeconds() + 5);
function countdownFn() {
  const targetDate = new Date('2024-02-06T00:00:00');
  const countdown = getCountdown(targetDate);

  // check to see if we have reached our desired time.
  if (countdown.hours <= 0 && countdown.minutes <= 0 && countdown.seconds <= 0) {
    gsap.to(['#countdown-container'], {
      duration: 1,
      autoAlpha: 0,
      onComplete: () => {
        gsap.set(['#countdown-container'], {
          display: "none",
          onComplete: () => {
            gsap.to('#prize-container', { duration: 1, display: "grid", autoAlpha: 1 });
          },
        });
      }
    })
    clearInterval(interval);
  }

  document.getElementById('countdown-hours').style.cssText = `--value:${countdown.hours}`;
  document.getElementById('countdown-minutes').style.cssText = `--value:${countdown.minutes}`;
  document.getElementById('countdown-seconds').style.cssText = `--value:${countdown.seconds}`;

}
let interval = setInterval(countdownFn, 1000);

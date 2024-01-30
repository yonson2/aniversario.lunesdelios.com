import prand from 'pure-rand';

import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const to = 10;
const quejesoTickets = [];
const shirt_prizes = 1;
const cap_prizes = 1;
const beer_prizes = 3;

const lucky_shirts = [];
const lucky_caps = [];
const lucky_beers = [];

const rng = prand.xoroshiro128plus(to);

for (let i = 0; i < shirt_prizes; i++) {
  let winner = prand.unsafeUniformIntDistribution(1, to, rng);
  while (lucky_shirts.includes(winner) || lucky_beers.includes(winner) || lucky_caps.includes(winner)) {
    winner = prand.unsafeUniformIntDistribution(1, to, rng);
  }
  lucky_shirts.push(winner);
}

for (let i = 0; i < cap_prizes; i++) {
  let winner = prand.unsafeUniformIntDistribution(1, to, rng);
  while (lucky_shirts.includes(winner) || lucky_beers.includes(winner) || lucky_caps.includes(winner)) {
    winner = prand.unsafeUniformIntDistribution(1, to, rng);
  }
  lucky_caps.push(winner);
}

for (let i = 0; i < beer_prizes; i++) {
  let winner = prand.unsafeUniformIntDistribution(1, to, rng);
  while (lucky_shirts.includes(winner) || lucky_beers.includes(winner) || lucky_caps.includes(winner)) {
    winner = prand.unsafeUniformIntDistribution(1, to, rng);
  }
  lucky_beers.push(winner);
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

  if (lucky_shirts.includes(value)) {
    imgRoute = 'images/premio-camiseta.png';
  } else if (lucky_caps.includes(value)) {
    imgRoute = 'images/premio-gorra.png';
  } else if (lucky_beers.includes(value)) {
    imgRoute = 'images/premio-cerveza.png';
  } else {
    imgRoute = 'images/nada.png';
  }

  const newImg = document.createElement('img');
  [newImg.className, newImg.src] = ['h-48 rounded-lg opacity-0', imgRoute];
  prize.replaceChild(newImg, prize.querySelector('img'));
  gsap.to(prize.querySelector('img'), { duration: 0.50, opacity: 1, ease: 'none' });

  if (newImg !== 'images/nada.png') {
    const container = document.getElementById('prize-modal');
    const element = document.createElement("h3");
    const prizeAudio = new Audio('premio.mp3');
    const quejesoAudio = new Audio('quejeso.mp3');

    let audioToPlay = prizeAudio;
    if (quejesoTickets.includes(value)) {
      audioToPlay = quejesoAudio;
      element.textContent = "QUEJESO"
    } else {
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
        gsap.set(container, { autoAlpha: 0, duration: 0.2, ease: 'power1.in', onComplete: () =>  element.remove()});
      }
    });

    gsap.set(element, { autoAlpha: 0, scale: 0, z: 0.01 });
    gsap.to(container, { duration: 0, ease: 'none', autoAlpha: 1 })

    tl
      .to(element, duration, { scale: 1.2, ease: "slow(0.25, 0.9)" }, time)
      .to(element, duration, { autoAlpha: 1, ease: "slow(0.25, 0.9, true)" }, time);
  }
}

var button = document.getElementById("form-button");
button.addEventListener("click", processForm);

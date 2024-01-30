import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import SplitType from 'split-type'

import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Flip);

const sentences = [
  "1 año luchando contra el sistema",
  "Quedamos el lunes?",
  "4+1?",
  "Por un lunes más a tu lado",
  "Por un lunes menos lunes",
  "Hoy es Lunes de Líos",
  "Yo quedo con mis amigos",
  "Porque es lunes de líos",
];

const brands = [
  "mcdonalds",
  "jordan",
  "spotify",
  "honda",
  "tinder",
  "wikipedia",
  "kfc",
  "prime",
  "netflix",
  "dior",
  "apple",
  "kia",
  "ferrari",
  "airbnb",
  "chupachups",
]

let hasTouchScreen = false;
if ("maxTouchPoints" in navigator) {
  hasTouchScreen = navigator.maxTouchPoints > 0;
}

function animateText() {
  const headers = ["first", "second", "third"];
  const chars = [];
  for (const elem of headers) {
    const text = new SplitType(`#header-${elem}`, { types: 'chars' });
    chars.push(text.chars);

    let direction = -122;

    gsap.set('.heading', { autoAlpha: 1 });
    // second element "DE" comes from the sides, hacky way to do it.
    if (elem === "second") {
      gsap.set(text.chars[0], { xPercent: -2000 });
      gsap.set(text.chars[1], { xPercent: 2000 });
    } else {
      gsap.set(text.chars, { yPercent: direction });
    }

    gsap.to(text.chars, {
      yPercent: 0,
      xPercent: 0,
      ease: "sine.out",
      delay: 0.4,
      stagger: { from: "random", amount: 0.5, ease: "power1.out" },
      onComplete: onCompleteIntro
    });
  }

  function onCompleteIntro() {
    gsap.to(chars, {
      yPercent: -122,
      stagger: { from: "random", amount: 1 },
      scrollTrigger: {
        trigger: '#header',
        start: "top top",
        end: () => `${document.querySelector('#header').offsetHeight * 0.6}`,
        scrub: 1,
      }
    });
    initialSpin();
    spinTl = gsap.timeline({});;
  }
}

setInterval(() => {
  gsap.to('#hero-trivia', {
    text: sentences[Math.floor(Math.random() * sentences.length)],
    duration: 1.5,
    ease: 'bounce.in',
  });
}, 5000)

document.querySelector('#hero-trivia').textContent = sentences[Math.floor(Math.random() * sentences.length)];

shuffleArray(brands);
let svgs = "";
for (const brand of brands) {
  // <svg>
  // 	<use xlink:href="#mcdonalds" />
  // </svg>
  svgs += `<svg><use xlink:href="#${brand}" /></svg>`;
}

document.getElementById("m1").innerHTML = svgs;
document.getElementById("m2").innerHTML = svgs;

document.addEventListener("DOMContentLoaded", function() {
  const corner = gsap.timeline({ paused: true });
  corner
    .to('.quarter-circle-left', { duration: 0.5, width: '200vh', height: '200vh' })
    .to('.quarter-circle-right', { duration: 0.5, width: '200vh', height: '200vh' }, 0);

  if (!hasTouchScreen) {
    corner.to('.circle', { duration: 1, width: '400vh', height: '200vh' }, 0);
  }

  ScrollTrigger.create({
    trigger: '.quarter-circle-left',
    start: 'bottom bottom',
    endTrigger: '#map',
    // end: "+=300%",
    animation: corner,
    scrub: true,
  });

  gsap.to("#card", {
    scrollTrigger: {
      trigger: "#card",
      endTrigger: "#prize-form",
      start: "clamp(center center)",
      end: "clamp(center center)",
      pin: true,
      scrub: true,
      pinSpacing: true,
    },
  });
});

//
///THREE.js + GSAP animations
//

let height = window.innerHeight * 10 / 12;
if (hasTouchScreen) {
  height = 500;
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, height / height, 0.1, 500);
// camera.position.set(0, 0, 5);
camera.position.set(0, 3, 0); // Set the camera above the scene
camera.rotation.set(-Math.PI / 2, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('pug'), alpha: true, antialias: true });
renderer.setSize(height, height);
renderer.setClearColor(0x000000, 0);

const loader = new GLTFLoader();

let model;
const movementTl = gsap.timeline({ repeat: -1, yoyo: true, ease: 'none' });

loader.load('models/tarjeta-cara.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry.computeVertexNormals();
    }
  });

  gltf.scene.position.set(0, 0, 0);
  // gltf.scene.scale.set(0, 0, 0);

  model = gltf.scene;
  model.position.y -= 1;
  model.scale.set(1, 1, 1);
  scene.add(model);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
  const light2 = new THREE.DirectionalLight(0xfdffe3, 3);
  light2.position.set(-100, -25, 25);
  const light3 = new THREE.DirectionalLight(0xc4f1ff, 4);
  light3.position.set(100, -25, 25);
  const light4 = new THREE.DirectionalLight(0xffffff, 0.4);
  light4.position.set(200, 0, -200);

  scene.add(ambientLight);
  scene.add(light2);
  scene.add(light3);
  scene.add(light4);

  animateText();



  // Subtle movement
  movementTl.to(model.rotation, { duration: 1.5, x: '-=0.2', z: '-=0.20', ease: "none" })
    .to(model.rotation, { duration: 1, x: '+=0.2', ease: 'none' })
    .to(model.rotation, { duration: 1, x: '+=0.2', ease: 'none' })
    .to(model.rotation, { duration: 1.5, x: '-=0.2', ease: 'none' });

});

function initialSpin() {
  if (model) {
    const tl = gsap.timeline({});
    tl
      .to('canvas', { duration: 0.30, opacity: 1, ease: 'power2.inOut' })
      .to(model.rotation, { duration: 0.5, z: -1 * Math.PI * 2, ease: 'none', delay: 0.1 });
  }
}


function getRotation() {
  if (model) {
    return model.rotation.y + (-1 * Math.PI * 2);
  }
  return 0
}

let spinTl;
function spin() {
  if (!spinTl.isActive()) {
    spinTl.to(model.rotation, { duration: 1, y: getRotation(), ease: 'none', delay: 0.1 });

  }
  // gsap.to(model.rotation, { duration: 1, y: getRotation(), ease: 'none', delay: 0.1 });
}

function handleScroll() {
  const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight));
  if (scrollPercentage === 0 || (!hasTouchScreen && scrollPercentage === 1) || (hasTouchScreen && scrollPercentage > 0.95)) {
    movementTl.restart();
  } else {
    movementTl.pause();
  }
  const rotation = scrollPercentage * 4 * Math.PI;

  gsap.to(model.rotation, { x: rotation, duration: 0.2, ease: 'none' });
}

window.addEventListener('scroll', handleScroll);

const maxTimeBetweenTaps = 300;
let lastTapTime = 0;

function handleTap() {
  const currentTime = new Date().getTime();
  const timeSinceLastTap = currentTime - lastTapTime;
  if (timeSinceLastTap < maxTimeBetweenTaps) {
    // Double tap detected
    spin();
  }
  lastTapTime = currentTime;
}

if (hasTouchScreen) {
  document.body.addEventListener('touchstart', handleTap);
} else {
  document.body.addEventListener('click', handleTap);
}

const animate = () => {
  requestAnimationFrame(animate, camera);
  renderer.render(scene, camera);
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
}

animate();

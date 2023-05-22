const submitButton = document.getElementById("submit-btn");
const resetButton = document.getElementById("reset-btn");
const inputID = document.getElementById("inputId");
const prizes = [
  {
    text: "10% Off Sticker Price",
    color: "hsl(197 30% 43%)",
    reaction: "dancing",
  },

  {
    text: "No Money Down",
    color: "hsl(43 74% 66%)",
    reaction: "shocked",
  },
  {
    text: "ninad",
    color: "hsl(33 74% 66%)",
    reaction: "shocked",
  },
  {
    text: "jdbe",
    color: "hsl(88 74% 66%)",
    reaction: "shocked",
  },
];
const reaction = ["dancing", "shocked", "resting", "laughing"];

const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");
const reaper = wheel.querySelector(".grim-reaper");
let prizeSlice = 360 / prizes.length;
let prizeOffset = Math.floor(180 / prizes.length);
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);
let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;

const createPrizeNodes = () => {
  prizeSlice = 360 / prizes.length;
  prizeOffset = Math.floor(180 / prizes.length);
  prizes.forEach(({ text, color, reaction }, i) => {
    const rotation = prizeSlice * i * -1 - prizeOffset;

    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        .map(
          ({ color }, i) =>
            `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`
        )
        .reverse()}
    );`
  );
};

const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const runTickerAnimation = () => {
  // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += 2 * Math.PI;

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => (ticker.style.animation = null), 10);
    currentSlice = slice;
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);
  reaper.dataset.reaction = prizeNodes[selected].dataset.reaction;
};

trigger.addEventListener("click", () => {
  if (reaper.dataset.reaction !== "resting") {
    reaper.dataset.reaction = "resting";
  }

  trigger.disabled = true;
  rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  trigger.disabled = false;
  trigger.focus();
  rotation %= 360;
  selectPrize();
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
});

setupWheel();

function getRandomColor() {
  var hue = Math.floor(Math.random() * 360);
  var saturation = Math.floor(Math.random() * 100);
  var lightness = Math.floor(Math.random() * 100);
  return "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
}
function getRandomReaction() {
  const randomIndex = Math.floor(Math.random() * reaction.length);
  return reaction[randomIndex];
}

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener for the button click using an arrow function
  submitButton.addEventListener("click", () => {
    if (inputID.value === "") {
      alert("input is empty");
    } else {
      // const getRandomReaction = ;
      // const getRandomColor = ;
      const newInput = inputID.value;
      const newObg = {
        text: newInput,
        color: getRandomColor(),
        reaction: getRandomReaction(),
      };
      const nv = {
        text: "baruah",
        color: "hsl(11 74% 66%)",
        reaction: "shocked",
      };
      prizes.push(newObg);
      spinner.innerHTML = "";
      inputID.value = "";
      setupWheel();
    }
  });
});

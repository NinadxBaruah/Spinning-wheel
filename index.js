const submitButton = document.getElementById("submit-btn");
const resetButton = document.getElementById("reset-btn");
const inputID = document.getElementById("inputId");
const insertName = document.getElementById("insert-name");
const deleteIcons = document.querySelectorAll(".delete-icon");
const deleteIconsArray = Array.from(deleteIcons);
const winnerTextArea = document.querySelector(".winner-textarea");
console.log(deleteIconsArray);
const prizes = [
  {
    text: "emma",
    color: "hsl(197 30% 43%)",
    reaction: "dancing",
  },

  {
    text: "ben",
    color: "hsl(43 74% 66%)",
    reaction: "laughing",
  },
  {
    text: "hannah",
    color: "hsl(33 74% 66%)",
    reaction: "resting",
  },
  {
    text: "leon",
    color: "hsl(88 74% 66%)",
    reaction: "shocked",
  },
  {
    text: "mia",
    color: "hsl(18 94% 66%)",
    reaction: "dancing",
  },
];
const reaction = ["dancing", "shocked", "resting", "laughing"];
let perticipents = ["emma", "ben", "hannah", "leon", "mia"];

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
  winnerTextArea.value += perticipents[selected].toLocaleUpperCase() + ", ";
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

document.addEventListener("DOMContentLoaded", function async() {
  // Add event listener for the button click using an arrow function
  submitButton.addEventListener("click", () => {
    if (inputID.value === "") {
      alert("input is empty");
    } else {
      // const getRandomReaction = ;
      // const getRandomColor = ;
      const newInput = inputID.value.toLowerCase();
      const newObg = {
        text: newInput,
        color: getRandomColor(),
        reaction: getRandomReaction(),
      };

      prizes.push(newObg);
      perticipents.push(newInput);
      const newPerticipents = `<div id="perticipents"><p style="display:inline-block; margin-left:50px; " >${inputID.value}</p><i class="material-icons delete-icon"   style="font-size:20px;color:red; margin-left:10px;">delete</i>
    </div>`;
      insertName.insertAdjacentHTML("beforeend", newPerticipents);

      spinner.innerHTML = "";
      inputID.value = "";

      setupWheel();
    }
  });
  resetButton.addEventListener("click", () => {
    insertName.innerHTML = "";
    perticipents.splice(0);
    prizes.splice(0);
    spinner.innerHTML = "";
  });
  function handleDeleteClick(event) {
    const deleteIcon = event.target;
    const thisparentElement = deleteIcon.parentElement;
    const pElement = thisparentElement.querySelector("p");
    const innertext = pElement.innerText;
    console.log(innertext);

    for (let i = 0; i < prizes.length; i++) {
      if (prizes[i].text.toLowerCase() === innertext.toLowerCase()) {
        prizes.splice(i, 1);
        i--; // Adjust the loop index to account for the removed object
      }
    }
    spinner.innerHTML = "";
    setupWheel();

    for (let i = 0; i < perticipents.length; i++) {
      if (perticipents[i].toLowerCase() === innertext.toLowerCase()) {
        perticipents.splice(i, 1);
        i--; // Adjust the loop index to account for the removed element
      }
    }

    console.log(perticipents);

    const parentElement = event.target.parentElement;
    parentElement.remove();
  }
  // deleteIconsArray.forEach((deleteIcon) => {
  //   deleteIcon.addEventListener("click", handleDeleteClick);
  // });

  insertName.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-icon")) {
      handleDeleteClick(event);
    }
  });
  // Array to store participants
  let newPerticipents = [];

  // Function to handle button click
  function handleAddFileButtonClick() {
    const input = document.createElement("input");
    input.type = "file";

    input.addEventListener("change", function (event) {
      const confirmMessage = `Do you want to add the following names to the participants array?`;
      const shouldAdd = window.confirm(confirmMessage);

      if (shouldAdd) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
          const contents = e.target.result;
          newPerticipents = contents.split(",").map((name) => name.trim());
          perticipents.splice(0);

          perticipents = newPerticipents;
          //appending inputs
          insertName.innerHTML = "";
          for (i = 0; i < perticipents.length; i++) {
            const newPerticipentsFromFile = `<div id="perticipents"><p style="display:inline-block; margin-left:50px; " >${perticipents[i]}</p><i class="material-icons delete-icon"   style="font-size:20px;color:red; margin-left:10px;">delete</i>
    </div>`;
            insertName.insertAdjacentHTML("beforeend", newPerticipentsFromFile);
          }
          console.log(perticipents);

          //now appending in the spinner
          if (prizes.length > 0) {
            prizes.splice(0);
          }

          spinner.innerHTML = "";

          for (i = 0; i < newPerticipents.length; i++) {
            const newObg = {
              text: newPerticipents[i],
              color: getRandomColor(),
              reaction: getRandomReaction(),
            };
            prizes.push(newObg);
          }
          console.log(prizes, "prizes");
          setupWheel();
          //....................................
        };

        reader.readAsText(file);
      }
    });

    input.click();
  }

  // Attach the handleButtonClick function to the button click event
  const uploadButton = document.getElementById("add-file");
  uploadButton.addEventListener("click", handleAddFileButtonClick);
});

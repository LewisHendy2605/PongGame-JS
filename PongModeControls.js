import { eventEmitter } from "./EventEmitter.js";

export default class PongModeControls {
  constructor() {
    this.bodyElem = document.body;
    this.gameElem = document.getElementById("game-div");

    // Lsterning state variables
    this.isListeningForBallPaddleColis = false;
  }

  startControls() {
    this.startColorSwitchMode();
    this.startRandomSpeedMode();
  }

  handleColorModeClick() {
    if (this.isListeningForBallPaddleColis) {
      this.isListeningForBallPaddleColis = false;
      eventEmitter.off("ballCollision", setBodyColourVariableRandom);
    } else {
      this.isListeningForBallPaddleColis = true;
      //Event Lister for paddle/ball collision
      eventEmitter.on("ballCollision", setBodyColourVariableRandom);
    }
  }

  startColorSwitchMode() {
    const colourButton = document.getElementById("ColorModeSwitchBtn");
    colourButton.addEventListener("click", (e) => {
      this.handleColorModeClick();
    });
  }

  startRandomSpeedMode() {
    const speedButton = document.getElementById("RandomSpeedModeBtn");
    speedButton.addEventListener("click", (e) => {
      console.log("Random Speed Btn pressed");
    });
  }
}

function getBodyColourVariable() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--background-color")
    .trim();
}

const setBodyColourVariableRandom = () => {
  const hue = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--hue")
  );

  // Define the range for the random change (e.g., -10 to +10)
  const minChange = -250;
  const maxChange = 250;

  // Generate a random number within the specified range
  const delta = Math.random() * (maxChange - minChange) + minChange;

  // Calculate the new hue value
  const newHue = (hue + delta) % 360; // Ensure the hue stays within 0-360 degrees

  // Set the new hue value
  document.documentElement.style.setProperty("--hue", newHue);

  //console.log(`Hue changed by ${delta.toFixed(2)} to ${newHue.toFixed(2)}`);
};

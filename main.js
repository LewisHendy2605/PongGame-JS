import Ball from "./ball.js";
import Paddle from "./paddle.js";

let gameRect = document.getElementById("gameDiv").getBoundingClientRect();
let gameDiv = document.getElementById("gameDiv");
const WINDOW_HEIGHT = gameDiv.clientHeight;
const WINDOW_WIDTH = gameDiv.clientWidth;

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(
  document.getElementById("player-paddle"),
  document.getElementById("gameDiv"),
  WINDOW_HEIGHT
);
const computerPaddle = new Paddle(
  document.getElementById("computer-paddle"),
  document.getElementById("gameDiv"),
  WINDOW_HEIGHT
);
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");

//const WINDOW_HEIGHT = gameRect.height;
//const WINDOW_WIDTH = gameRect.width;

let bodyRect = document.body.getBoundingClientRect();

const BODY_HEIGHT = bodyRect.height;
const BODY_WIDTH = bodyRect.width;

console.log("Window Height: " + window.innerHeight);
console.log("Window Width: " + window.innerWidth);
console.log("Body Height: " + BODY_HEIGHT);
console.log("Body Width: " + BODY_WIDTH);
console.log("Div Height: " + WINDOW_HEIGHT);
console.log("Div Width: " + WINDOW_WIDTH);

let lastTime;
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.update(delta, ball.y);
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );

    document.documentElement.style.setProperty("--hue", hue + delta * 0.01);

    if (isLose()) handleLose();
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

function isLose() {
  const rect = ball.rect();
  return rect.right >= WINDOW_WIDTH || rect.left <= 0;
}
function handleLose() {
  const rect = ball.rect();
  if (rect.right >= WINDOW_WIDTH) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
  }
  ball.reset();
  computerPaddle.reset();
}

document.addEventListener("mousemove", (e) => {
  playerPaddle.move(e);
});

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const rect = gameDiv.getBoundingClientRect();
  const touchY = touch.clientY - rect.top; // Touch Y position relative to gameDiv top
  playerPaddle.position = (touchY / WINDOW_HEIGHT) * 100;
});

window.requestAnimationFrame(update);

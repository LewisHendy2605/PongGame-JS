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

let bodyRect = document.body.getBoundingClientRect();

const BODY_HEIGHT = bodyRect.height;
const BODY_WIDTH = bodyRect.width;

let lastTime;
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.updateComputerPaddle(delta, ball.y);
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );

    document.documentElement.style.setProperty("--hue", hue + delta * 0.01);

    if (isLose()) handleLose();
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

// ball centre lose cobdition
function isLose() {
  const center = ball.center;
  return center.x >= WINDOW_WIDTH || center.x <= 0;
}

// ball edges lose condition
/*
function isLose() {
  const rect = ball.rect();
  return rect.right >= WINDOW_WIDTH || rect.left <= 0;
}
*/
function handleLose() {
  const center = ball.center; // Get the center of the ball
  if (center.x >= WINDOW_WIDTH) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
  } else if (center.x <= 0) {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
  }
  ball.reset();
  computerPaddle.reset();
}

// Listerners
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

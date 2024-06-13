const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.00001;
let gameRect = document.getElementById("gameDiv").getBoundingClientRect();

const WINDOW_HEIGHT = gameRect.height;
const WINDOW_WIDTH = gameRect.width;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    const rect = this.ballElem.getBoundingClientRect();
    const gameRect = document.getElementById("gameDiv").getBoundingClientRect();

    // Adjust rect coordinates relative to gameDiv
    return {
      top: rect.top - gameRect.top,
      right: rect.right - gameRect.left,
      bottom: rect.bottom - gameRect.top,
      left: rect.left - gameRect.left,
    };
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0 };

    while (
      Math.abs(this.direction.x <= 0.2) ||
      Math.abs(this.direction.x >= 0.9)
    ) {
      // gets randome number bertween 0* and 360* in radians
      const heading = randomNumberBetween(0, 2 * Math.PI);
      // uses cos and sin to get x and y position from direction
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();

    if (rect.bottom >= WINDOW_HEIGHT || rect.top <= 0) {
      this.direction.y *= -1;
    }

    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}

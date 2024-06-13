const SLOW_MODE = false;

let INITIAL_VELOCITY = null;
let VELOCITY_INCREASE = null;

if (SLOW_MODE) {
  INITIAL_VELOCITY = 0.0025;
  VELOCITY_INCREASE = 0.000001;
} else {
  INITIAL_VELOCITY = 0.025;
  VELOCITY_INCREASE = 0.00001;
}

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

  get center() {
    const rect = this.rect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  rect() {
    const ballRect = this.ballElem.getBoundingClientRect();
    const gameRect = document.getElementById("gameDiv").getBoundingClientRect();

    // Adjust rect coordinates relative to gameDiv
    return {
      top: ballRect.top - gameRect.top,
      right: ballRect.right - gameRect.left,
      bottom: ballRect.bottom - gameRect.top,
      left: ballRect.left - gameRect.left,
      width: ballRect.width,
      height: ballRect.height,
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
    const ballRect = this.rect();

    if (ballRect.bottom >= WINDOW_HEIGHT || ballRect.top <= 0) {
      this.direction.y *= -1;
    }

    paddleRects.forEach((paddleRect) => {
      if (isCollision(paddleRect, ballRect)) {
        this.direction.x *= -1;

        if (collisionNeedsYFlip(paddleRect, ballRect)) {
          this.direction.y *= -1;
        }

        //this.direction.y *= -1;
      }
    });
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollision(paddleRect, ballRect) {
  return (
    paddleRect.left <= ballRect.right &&
    paddleRect.right >= ballRect.left &&
    paddleRect.top <= ballRect.bottom &&
    paddleRect.bottom >= ballRect.top
  );
}

function collisionNeedsYFlip(paddleRect, ballRect) {
  return (
    isCollisionWithTop(paddleRect, ballRect) ||
    isCollisionWithBottom(paddleRect, ballRect)
  );
}

function isCollisionWithTop(paddleRect, ballRect) {
  // Check if the top edge of the ball is below or at the top edge of the paddle
  return ballRect.bottom >= paddleRect.top && ballRect.top <= paddleRect.top;
}
function isCollisionWithBottom(paddleRect, ballRect) {
  // Check if the top edge of the ball is above or at the bottom edge of the paddle
  return (
    ballRect.top <= paddleRect.bottom && ballRect.bottom >= paddleRect.bottom
  );
}

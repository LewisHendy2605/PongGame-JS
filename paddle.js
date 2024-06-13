const SPEED = 0.02;

export default class Paddle {
  constructor(paddleElem, gameDiv, wh) {
    this.paddleElem = paddleElem;
    this.gameDiv = gameDiv;
    this.WindowHeight = wh;
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }

  set position(value) {
    // Constrain paddle position within gameDiv boundaries
    const minPosition = 0;
    const maxPosition =
      this.gameDiv.clientHeight - this.paddleElem.clientHeight;

    const constrainedValue = Math.min(
      Math.max(value, minPosition),
      maxPosition
    );
    this.paddleElem.style.setProperty("--position", constrainedValue);
  }

  rect() {
    const rect = this.paddleElem.getBoundingClientRect();
    const gameRect = this.gameDiv.getBoundingClientRect();

    // Adjust rect coordinates relative to gameDiv
    return {
      top: rect.top - gameRect.top,
      right: rect.right - gameRect.left,
      bottom: rect.bottom - gameRect.top,
      left: rect.left - gameRect.left,
      width: rect.width,
      height: rect.height,
    };
  }

  reset() {
    this.position = 50;
  }

  updateComputerPaddle(delta, ballHeight) {
    // ----
    const newPos = this.position + SPEED * delta * (ballHeight - this.position);
    /// ----
    const gameDivRect = this.gameDiv.getBoundingClientRect();
    const paddleRect = this.paddleElem.getBoundingClientRect();

    const paddleHeightPercentage =
      (paddleRect.height / gameDivRect.height) * 100;

    const paddleTop = newPos - paddleHeightPercentage / 2;
    const paddleBottom = newPos + paddleHeightPercentage / 2;

    // Ensure the paddle stays within the gameDiv boundaries
    if (paddleTop >= 0 && paddleBottom <= 100) {
      this.position = newPos;
    } else if (paddleTop < 0) {
      this.position = paddleHeightPercentage / 2;
    } else if (paddleBottom > 100) {
      this.position = 100 - paddleHeightPercentage / 2;
    }
  }

  move(e) {
    const gameDivRect = this.gameDiv.getBoundingClientRect();
    const paddleRect = this.paddleElem.getBoundingClientRect();
    const mouseY = e.clientY - gameDivRect.top; // Mouse Y position relative to gameDiv top

    // Calculate the new position as a percentage
    const newPos = (mouseY / gameDivRect.height) * 100;

    // Calculate the paddle height as a percentage of the gameDiv height
    const paddleHeightPercentage =
      (paddleRect.height / gameDivRect.height) * 100;

    // Calculate the top and bottom positions of the paddle
    const paddleTop = newPos - paddleHeightPercentage / 2;
    const paddleBottom = newPos + paddleHeightPercentage / 2;

    // Ensure the paddle stays within the gameDiv boundaries
    if (paddleTop >= 0 && paddleBottom <= 100) {
      this.position = newPos;
    } else if (paddleTop < 0) {
      this.position = paddleHeightPercentage / 2;
    } else if (paddleBottom > 100) {
      this.position = 100 - paddleHeightPercentage / 2;
    }
  }
}

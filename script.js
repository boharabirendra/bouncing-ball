
// getting random number between min and max
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

// different colors
const colors = [
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#FF5733",
  "#33FFD1",
  "#FFD133",
  "#33FF85",
  "#8533FF",
  "#FF3333",
  "#33FFAA",
  "#FFAA33",
  "#33AAFF",
  "#FF33D1",
  "#AA33FF",
  "#33FF70",
  "#FF7033",
  "#3370FF"
];



//Creating container
const container = document.createElement("div");
container.style.width = `${MAX_X_BOUNDARY}px`;
container.style.height = `${MAX_Y_BOUNDARY}px`;
container.style.position = "relative";
container.style.border = "1px solid gray";
container.style.margin = "auto";
container.style.borderRadius = "10px";
container.style.width = `${MAX_X_BOUNDARY}px`;
container.style.height = `${MAX_Y_BOUNDARY}px`;
container.style.backgroundColor = "#FFF";
document.body.appendChild(container);   //adding container to body



class Ball {
  constructor(numOfBall) {
    this.numOfBall = numOfBall;
    this.balls = [];
    this.move = this.move.bind(this);
  }

  draw() {
    for (let i = 0; i < this.numOfBall; i++) {
      // Create the circle element
      const circle = document.createElement("div");
      // getting random heght and width of ball
      // min width and height wil be 15
      // max width and height will be 20
      const ballSize = getRandomInt(MIN_BALL_SIZE, MAX_BALL_SIZE);
      circle.style.width = `${ballSize}px`;
      circle.style.height = `${ballSize}px`;
      circle.style.borderRadius = "50%";
      // circle.style.border = "0.1px solid black";
      circle.style.backgroundColor = colors[i % colors.length];
      circle.style.position = "absolute";

      //getting random position
      const posX = getRandomInt(0, (MAX_X_BOUNDARY - MAX_BALL_SIZE));
      const posY = getRandomInt(0, (MAX_Y_BOUNDARY - MAX_BALL_SIZE));
      circle.style.left = `${posX}px`;
      circle.style.top = `${posY}px`;

      // calculating random direction of ball
      const dx = getRandomInt(MIN_VELOCITY, MAX_VELOCITY);
      const dy = getRandomInt(MIN_VELOCITY, MAX_VELOCITY);

      // pushing ball into balls stack
      this.balls.push({ circle, posX, posY, dx, dy, ballSize })

      // adding ball to container
      container.appendChild(circle);
    }
  }

  move() {
    this.balls.forEach((ball, index) => {

      ball.posX += ball.dx;
      ball.posY += ball.dy;


      // checking boundaries limit
      if (ball.posX >= (MAX_X_BOUNDARY - ball.ballSize)) {
        ball.posX = MAX_X_BOUNDARY - ball.ballSize;
        ball.dx *= -1;
      } else if (ball.posX < 0) {
        ball.posX = 0;
        ball.dx *= -1;
      }

      if (ball.posY >= (MAX_Y_BOUNDARY - ball.ballSize)) {
        ball.posY = MAX_Y_BOUNDARY - ball.ballSize;
        ball.dy *= -1;
      } else if (ball.posY < 0) {
        ball.posY = 0;
        ball.dy *= -1;
      }

      // setting new position
      ball.circle.style.left = `${ball.posX}px`;
      ball.circle.style.top = `${ball.posY}px`;

    })
    this.collision();
    requestAnimationFrame(this.move);
  }

  collision() {
    // Check for collisions with other balls
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {

        const distX = this.balls[i].posX + this.balls[i].ballSize / 2 - (this.balls[j].posX + this.balls[j].ballSize / 2);
        const distY = this.balls[i].posY + this.balls[i].ballSize / 2 - (this.balls[j].posY + this.balls[j].ballSize / 2);

        const distance = Math.ceil(Math.sqrt(distX * distX + distY * distY));
        if (distance <= (this.balls[i].ballSize / 2 + this.balls[j].ballSize / 2)) {

          const overlap = (this.balls[i].ballSize / 2 + this.balls[j].ballSize / 2) - distance;
          const correctionX = (distX / distance) * overlap / 2;
          const correctionY = (distY / distance) * overlap / 2;

          //adjusting overlapping
          this.balls[i].posX += correctionX;
          this.balls[i].posY += correctionY;
          this.balls[j].posX -= correctionX;
          this.balls[j].posY -= correctionY;

          const angle = Math.atan2(distY, distX);

          //initial velocity along line of collision
          const u1 = this.balls[i].dx * Math.cos(angle) + this.balls[i].dy * Math.sin(angle);
          const u2 = this.balls[j].dx * Math.cos(angle) + this.balls[j].dy * Math.sin(angle);


          const v1 = this.balls[i].dy * Math.cos(angle) - this.balls[i].dx * Math.sin(angle);
          const v2 = this.balls[j].dy * Math.cos(angle) - this.balls[j].dx * Math.sin(angle);

          //final velocity along perpendicular to the line of collision
          this.balls[i].dx = u2 * Math.cos(angle) - v1 * Math.sin(angle);
          this.balls[i].dy = u2 * Math.sin(angle) + v1 * Math.cos(angle);
          this.balls[j].dx = u1 * Math.cos(angle) - v2 * Math.sin(angle);
          this.balls[j].dy = u1 * Math.sin(angle) + v2 * Math.cos(angle);

        }
      }
    }
  }
}

const balls = new Ball(250);
balls.draw();
balls.move();

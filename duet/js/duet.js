import collisionDetection from "/js/collision.js";

export default class Duet {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.width = 20;
    this.ball = [];
    this.ball[0] = document.getElementById("ball");
    this.ball[1] = document.getElementById("ball2");
    this.maxSpeed = { x: 3, y: 2 };
    this.speed = { x: 0, y: 0 };
    this.center = { x: 300, y: 400 };
    this.radius = 50;
    this.position = [
      { x: this.center.x - this.radius, y: this.center.y },
      { x: this.center.x + this.radius, y: this.center.y },
    ];
    this.direction = 1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();
    for (var i = 0; i < 2; i++)
      ctx.drawImage(
        this.ball[i],
        this.position[i].x - this.width / 2,
        this.position[i].y - this.width / 2,
        this.width,
        this.width
      );
  }

  update(deltaTime, game) {
    if (this.position[0].y < this.center.y - this.radius) {
      this.direction *= -1;
    }
    if (this.position[0].y > this.center.y + this.radius) {
      this.direction *= -1;
    }
    this.position[0].y += this.direction * this.speed.y;
    this.position[0].x =
      -this.direction *
        Math.sqrt(2500 - (this.position[0].y - this.center.y) ** 2) +
      this.center.x;
    this.position[1].y += -this.direction * this.speed.y;
    this.position[1].x =
      this.direction *
        Math.sqrt(2500 - (this.position[1].y - this.center.y) ** 2) +
      this.center.x;
    game.objects.forEach((object) => {
      if (collisionDetection(this, object)) game.lives--;
    });
  }

  moveLeft() {
    this.speed.y = this.maxSpeed.y;
  }
  moveRight() {
    this.speed.y = -this.maxSpeed.y;
  }
  stop() {
    this.speed.x = 0;
    this.speed.y = 0;
  }
  reset() {
    this.position[0] = {
      x: 250 - this.width / 2,
      y: 300 - this.width / 2,
    };

    this.position[1] = {
      x: 350 - this.width / 2,
      y: 300 - this.width / 2,
    };
  }
}

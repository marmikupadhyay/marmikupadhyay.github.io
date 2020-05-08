export default class Ball {
  constructor(game) {
    this.gameHeight = game.gameHeight;
    this.gameWidth = game.gameWidth;
    this.radius = 10;
    this.gravity = 9.8;
    this.color = "#32dbf0";
    this.jumpHeight = 2.5;
    this.game = game;
    this.position = {
      x: this.gameWidth / 2,
      y: this.gameHeight - 100
    };
    this.maxSpeed = {
      x: 0,
      y: 0
    };
    this.speed = {
      x: 0,
      y: this.maxSpeed.y
    };
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update(game) {
    this.speed.y += this.gravity / 100;
    this.position.y += this.speed.y;
    if (this.position.y <= 0) {
      this.position.y = this.radius;
    }
  }
}

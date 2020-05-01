export default class Obstacle {
  constructor(game, params) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.radius = 90;
    this.thick = 20;
    this.indices = new Array();
    this.passed = false;
    this.position = {
      x: params.x,
      y: params.y
    };
    this.pixels;
    this.speed = {
      x: 0,
      y: 0
    };
    this.gravity = -9.8;
    this.startAngle = params.angle;
    this.colors = ["red", "blue", "green", "#ffff00"];
    this.angularSpeed = 2;
    this.markedForDeletion = false;
  }

  draw(ctx) {
    for (var i = 0; i < 4; i++) {
      this.startAngle = this.startAngle + Math.PI / 2;
      var endAngle = this.startAngle + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.arc(
        this.position.x,
        this.position.y,
        this.radius,
        this.startAngle,
        endAngle
      );
      ctx.closePath();
      ctx.fillStyle = this.colors[i];
      ctx.fill();
      ctx.strokeStyle = this.colors[i];
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius - this.thick,
      0,
      Math.PI * 2,
      true
    );
    ctx.fillStyle = "#343a40";
    ctx.strokeStyle = "#343a40";
    ctx.fill();
  }
  update(game) {
    this.speed.y += this.gravity / 100;
    if (this.speed.y < 0) this.speed.y = 0;
    this.position.y += this.speed.y;
    this.startAngle += (this.angularSpeed / 180) * Math.PI;
    if (this.position.y - this.radius > this.gameHeight) {
      this.markedForDeletion = true;
    }
    if (game.ball.position.y < this.position.y - this.radius) {
      if (this.passed != true) {
        game.score++;
      }
      this.passed = true;
    }
  }
}

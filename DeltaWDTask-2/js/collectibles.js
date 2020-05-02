var COLORS = ["#0000ff", "#ff0000", "#008000", "#ffff00"];

export default class Collectible {
  constructor(game, params) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.color = COLORS[getRndInt(0, 3)];
    this.radius = 10;
    this.position = {
      x: this.gameWidth / 2,
      y: params.y
    };
    this.speed = {
      x: 0,
      y: 0
    };
    this.gravity = -9.8;
    this.type = params.type;
  }
  draw(ctx) {
    if (this.type == 1) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  update(game) {
    this.speed.y += this.gravity / 100;
    if (this.speed.y < 0) this.speed.y = 0;
    this.position.y += this.speed.y;
    if (this.color == game.ball.color) this.setColor();
    if (this.type == 1) {
      if (
        Math.abs(game.ball.position.y - this.position.y) <
        this.radius + game.ball.radius + 1
      ) {
        game.ball.color = this.color;
        return 1;
        console.log(1);
      }
    }
    return 0;
  }
  setColor() {
    this.color = COLORS[getRndInt(0, 3)];
  }
}
function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

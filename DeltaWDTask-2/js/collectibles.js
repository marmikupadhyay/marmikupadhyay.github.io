var COLORS = ["#fae100", "#900dff", "#ff0181", "#32dbf0"];

export default class Collectible {
  constructor(game, params) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.color = COLORS[getRndInt(0, 3)];
    this.radius = 10;
    this.number = 4;
    this.width = 50;
    this.height = 60;
    this.imageX = 3;
    this.imageY = 10;
    console.log(params);
    this.frame;
    this.framerate;
    this.powerups = document.getElementById("powerups");
    this.startAngle = 0;
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
    if (this.type == 2) {
      this.imageX = 3 + 90 * 2;

      // ctx.fillRect(
      //   this.position.x - this.width / 2,
      //   this.position.y - this.height / 2,
      //   this.width,
      //   this.height
      // );
      ctx.drawImage(
        this.powerups,
        this.imageX,
        this.imageY,
        73,
        80,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      );
    }
    if (this.type == 3) {
      this.imageX = 3 + 90 * 0;
      this.imageY = 10 + 80 * 1;

      // ctx.fillRect(
      //   this.position.x - this.width / 2,
      //   this.position.y - this.height / 2,
      //   this.width,
      //   this.height
      // );
      ctx.drawImage(
        this.powerups,
        this.imageX,
        this.imageY,
        73,
        80,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      );
    }
    if (this.type == 4) {
      this.imageX = 3 + 90 * 3;
      this.imageY = 12 + 80 * 1;
      // ctx.fillRect(
      //   this.position.x - this.width / 2,
      //   this.position.y - this.height / 2,
      //   this.width,
      //   this.height
      // );
      ctx.drawImage(
        this.powerups,
        this.imageX,
        this.imageY,
        73,
        80,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      );
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
        game.immune = false;
        game.ball.jumpHeight = 2.5;
        return 1;
      }
    }
    if (this.type == 2) {
      if (
        Math.abs(game.ball.position.y - this.position.y) <
        this.height / 2 + game.ball.radius + 1
      ) {
        game.immune = true;
        return 1;
      }
    }
    if (this.type == 3) {
      if (
        Math.abs(game.ball.position.y - this.position.y) <
        this.height / 2 + game.ball.radius + 1
      ) {
        game.ball.jumpHeight = 4;
        return 1;
      }
    }
    if (this.type == 4) {
      if (
        Math.abs(game.ball.position.y - this.position.y) <
        this.height / 2 + game.ball.radius + 1
      ) {
        game.obstacles.forEach(obstacle => {
          obstacle.angularSpeed /= 2;
        });
        return 1;
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

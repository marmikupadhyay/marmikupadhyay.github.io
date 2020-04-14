import collisionDetection from "/duet/js/collision.js";

export default class Object {
  constructor(width, height, xcor, ycor) {
    this.width = width;
    this.height = height;
    this.position = {
      x: xcor,
      y: ycor,
    };
    this.speed = 2;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update(deltaTime, game) {
    this.position.y += this.speed;
  }

  intersects(game) {
    return !(
      game.duet.position[0].x > this.position.x + this.width ||
      game.duet.position[0].x + game.duet.width < this.position.x ||
      game.duet.position[0].y > this.position.y + this.height ||
      game.duet.position[0].y + game.duet.width < this.position.y ||
      game.duet.position[1].x > this.position.x + this.width ||
      game.duet.position[1].x + game.duet.width < this.position.x ||
      game.duet.position[1].y > this.position.y + this.height ||
      game.duet.position[1].y + game.duet.width < this.position.y
    );
  }
}

import Duet from "/js/duet.js";
import InputHandler from "/js/input.js";
import Object from "/js/objects.js";
import { level1, level2 } from "/js/level.js";

const GAMESTATE = {
  paused: 0,
  running: 1,
  menu: 2,
  gameover: 3,
  newlevel: 4,
  gamecomplete: 5,
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.gameState = GAMESTATE.menu;
    this.duet = new Duet(this);
    this.objects = [];
    new InputHandler(this.duet, this);
    this.levels = [level1, level2];
    this.currentLevel = 0;
    this.lives = 1;
  }
  start() {
    if (
      this.gameState != GAMESTATE.menu &&
      this.gameState != GAMESTATE.newlevel
    )
      return;
    this.objects = [];
    for (var i = 0; i < this.levels[this.currentLevel].x.length; i++) {
      this.objects.push(
        new Object(
          this.levels[this.currentLevel].width[i],
          this.levels[this.currentLevel].height[i],
          this.levels[this.currentLevel].x[i],
          this.levels[this.currentLevel].y[i]
        )
      );
    }
    this.gameState = GAMESTATE.running;
  }
  update(deltaTime) {
    if (
      this.gameState == GAMESTATE.paused ||
      this.gameState === GAMESTATE.menu ||
      this.gameState === GAMESTATE.gameover ||
      this.gameState === GAMESTATE.gamecomplete
    )
      return;
    this.duet.update(deltaTime, this);
    this.objects.forEach((object) => {
      object.update(deltaTime, this);
    });
    if (this.lives < 0) {
      this.gameState = GAMESTATE.gameover;
    }
    if (this.objects[this.objects.length - 1].position.y > 600) {
      this.currentLevel++;
      if (this.currentLevel >= this.levels.length) {
        console.log(1);
        this.gameState = GAMESTATE.gamecomplete;
      } else {
        this.gameState = GAMESTATE.newlevel;
        this.start();
      }
    }
  }
  draw(ctx) {
    if (this.gameState === GAMESTATE.menu) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(
        "Press SPACEBAR to start",
        this.gameWidth / 2,
        this.gameHeight / 2 - 100
      );
      ctx.font = "48px Arial";
      ctx.fillText("DUET RIPOFF", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === GAMESTATE.gameover) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GameOver", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === GAMESTATE.gamecomplete) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GameComplete", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === GAMESTATE.paused) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }
    this.duet.draw(ctx);
    this.objects.forEach((object) => {
      object.draw(ctx);
    });
    ctx.rect(400, 0, 20, 20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`Level: ${this.currentLevel + 1}`, 400, 20);
  }

  togglePause() {
    if (this.gameState === GAMESTATE.paused) {
      this.gameState = GAMESTATE.running;
    } else this.gameState = GAMESTATE.paused;
  }
}

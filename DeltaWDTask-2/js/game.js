import Ball from "../js/ball.js";
import Input from "../js/input.js";
import Obstacle from "../js/obstacle.js";

const GAMESTATE = {
  paused: 0,
  running: 1,
  menu: 2,
  gameover: 3,
  newlevel: 4,
  gamecomplete: 5
};

var COLORS = ["#0000ff", "#ff0000", "#008000", "#ffff00"];

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.gameState = GAMESTATE.menu;
    this.ball = new Ball(this);
    this.score = 0;
    this.dataX;
    this.dataY;
    this.jumpSound = document.getElementById("jump");
    this.bgSound = document.getElementById("bgMusic");
    this.deadSound = document.getElementById("dead");

    this.bgSound.addEventListener("ended", e => {
      this.play();
    });
    this.obstacles = [];
    var params = {
      x: this.gameWidth / 2,
      y: 300,
      angle: 10
    };
    this.obstacles.push(new Obstacle(this, params));
    for (var i = 0; i < 10; i++) {
      var params = {
        x: this.gameWidth / 2,
        y:
          this.obstacles[this.obstacles.length - 1].position.y -
          getRndInt(350, 550),
        angle:
          (this.obstacles[this.obstacles.length - 1].startAngle + 180) % 360
      };
      this.obstacles.push(new Obstacle(this, params));
    }

    this.lives = 1;
    this.gameState = 2;

    this.counter = 1;
    this.ops = 400;
    document.getElementById("play").addEventListener("click", e => {
      e.target.parentElement.parentElement.className += " hide";
      this.gameState = 1;
      new Input(this);
      this.bgSound.play();
    });
    document.getElementById("scores").addEventListener("click", e => {
      e.target.parentElement.parentElement.nextElementSibling.classList.remove(
        "hide"
      );
      e.target.parentElement.parentElement.className += " hide";
      this.gameState = 2;
    });
    document.getElementById("back").addEventListener("click", e => {
      e.target.parentElement.parentElement.previousElementSibling.classList.remove(
        "hide"
      );
      e.target.parentElement.parentElement.className += " hide";
      this.gameState = 2;
    });
    this.putScores();
  }
  start() {
    if (
      this.gameState != GAMESTATE.menu &&
      this.gameState != GAMESTATE.newlevel
    )
      return;
    this.gameState = GAMESTATE.running;
  }

  update() {
    var index = COLORS.indexOf(this.ball.color);
    if (index !== -1) COLORS.splice(index, 1);
    if (
      this.gameState == GAMESTATE.paused ||
      this.gameState === GAMESTATE.menu ||
      this.gameState === GAMESTATE.gameover ||
      this.gameState === GAMESTATE.gamecomplete
    )
      return;
    this.ball.update(this);
    if (this.counter % 60 == 0) {
      this.counter = 0;
    }
    if (this.obstacles.length < 10) {
      var params = {
        x: this.gameWidth / 2,
        y:
          this.obstacles[this.obstacles.length - 1].position.y -
          getRndInt(350, 550),
        angle:
          (this.obstacles[this.obstacles.length - 1].startAngle + 180) % 360
      };
      this.obstacles.push(new Obstacle(this, params));
    }
    this.counter++;
    this.obstacles.forEach((obstacle, i) => {
      obstacle.update(this);
      if (obstacle.markedForDeletion == true) {
        this.obstacles.splice(i, 1);
      }
    });
    if (this.lives <= 0) {
      this.gameState = 3;
      this.deadSound.play();
      this.bgSound.removeEventListener("ended", {});
      this.bgSound.pause();
      this.updateScores();
    }
    if (this.ball.position.y > this.gameHeight) {
      this.lives--;
      this.ball.speed.y = 0;
      this.ball.gravity = 0;
    }
  }
  draw(ctx) {
    ctx.fillStyle = "#343a40";
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    this.obstacles.forEach(obstacle => {
      obstacle.draw(ctx);
    });
    this.ball.draw(ctx);

    ctx.font = "30px Arial";
    ctx.fillText(`Score : ${this.score}`, 0, 30);
    if (this.gameState === GAMESTATE.gameover) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
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

    this.dataX = ctx.getImageData(
      this.ball.position.x,
      this.ball.position.y - this.ball.radius - 1,
      1,
      1
    );

    this.dataY = ctx.getImageData(
      this.ball.position.x,
      this.ball.position.y + this.ball.radius + 1,
      1,
      1
    );
    var x = rgbToHex(
      this.dataX.data[0],
      this.dataX.data[1],
      this.dataX.data[2]
    );
    var y = rgbToHex(
      this.dataY.data[0],
      this.dataY.data[1],
      this.dataY.data[2]
    );
    if (COLORS.indexOf(x) != -1 || COLORS.indexOf(y) != -1) {
      this.lives--;
    }
  }

  togglePause() {
    if (this.gameState === GAMESTATE.paused) {
      this.gameState = GAMESTATE.running;
    } else this.gameState = GAMESTATE.paused;
  }

  putScores() {
    var scoreList = document.querySelector(".scores");
    var scores = [];
    if (localStorage.getItem("switchscores") != null) {
      scores = JSON.parse(localStorage.getItem("switchscores"));
    }
    scores.sort(function (a, b) {
      return a - b;
    });
    var l = scores.length > 5 ? 5 : scores.length;
    for (var i = scores.length - 1; i >= scores.length - l; i--) {
      var item = document.createElement("li");
      item.className = "score-item";
      item.innerHTML = `${scores[i]}`;
      scoreList.appendChild(item);
    }
  }

  updateScores() {
    var scores;
    if (localStorage.getItem("switchscores") != null) {
      scores = JSON.parse(localStorage.getItem("switchscores"));
    } else {
      scores = [];
    }
    scores.push(this.score);
    scores.sort(function (a, b) {
      return a - b;
    });
    scores.splice(0, scores.length - 5);
    localStorage.setItem("switchscores", JSON.stringify(scores));
    // this.putScores();
  }
}

function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

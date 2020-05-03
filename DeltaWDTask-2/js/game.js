import Ball from "../js/ball.js";
import Input from "../js/input.js";
import Obstacle from "../js/obstacle.js";
import Collectible from "../js/collectibles.js";

var pc = 0;
const GAMESTATE = {
  paused: 0,
  running: 1,
  menu: 2,
  gameover: 3,
  newlevel: 4,
  gamecomplete: 5,
  info: 6
};

var COLORS = ["#0000ff", "#ff0000", "#008000", "#ffff00"];

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.gameState = GAMESTATE.menu;
    this.score = 0;
    this.immune = false;
    this.dataX;
    this.dataY;
    this.ball = new Ball(this);
    new Input(this);
    this.pauseBTn = document.getElementById("pause");
    this.jumpSound = document.getElementById("jump");
    this.bgSound = document.getElementById("bgMusic");
    this.deadSound = document.getElementById("dead");
    this.collectSound = document.getElementById("collect");

    this.bgSound.addEventListener("ended", e => {
      this.play();
    });

    this.lives = 1;
    this.gameState = 2;

    this.counter = 0;
    this.ops = 400;
    document.getElementById("play").addEventListener("click", e => {
      e.target.parentElement.parentElement.className += " hide";
      this.start();
    });
    document.getElementById("scores").addEventListener("click", e => {
      e.target.parentElement.parentElement.nextElementSibling.classList.remove(
        "hide"
      );
      e.target.parentElement.parentElement.className += " hide";
      this.gameState = 2;
    });
    var backs = document.querySelectorAll(".back");
    backs.forEach(back => {
      back.addEventListener("click", e => {
        if (!document.getElementById("gameinfo").classList.contains("hide")) {
          document.getElementById("gameinfo").className += " hide";
        } else {
          e.target.parentElement.parentElement.previousElementSibling.classList.remove(
            "hide"
          );
          e.target.parentElement.parentElement.className += " hide";
          this.gameState = 2;
        }
      });
    });

    document.getElementById("info").addEventListener("click", e => {
      if (document.getElementById("gameinfo").classList.contains("hide")) {
        document.getElementById("gameinfo").classList.remove("hide");
      }
    });

    this.pauseBTn.addEventListener("click", e => {
      this.togglePause();
    });

    this.putScores();
  }
  start() {
    if (
      this.gameState != GAMESTATE.menu &&
      this.gameState != GAMESTATE.newlevel
    )
      return;
    this.collectibles = [];
    this.obstacles = [];
    var params = {
      x: this.gameWidth / 2,
      y: 300,
      angle: 10,
      type: getRndInt(1, 2)
    };
    this.obstacles.push(new Obstacle(this, params));
    for (var i = 0; i < 10; i++) {
      var params = {
        x: this.gameWidth / 2,
        y:
          this.obstacles[this.obstacles.length - 1].position.y -
          getRndInt(350, 550),
        angle:
          (this.obstacles[this.obstacles.length - 1].startAngle + 180) % 360,
        type: getRndInt(1, 2)
      };
      this.obstacles.push(new Obstacle(this, params));
      if (i % 2 != 0) {
        var params2 = {
          type: getRndInt(2, 4),
          y: this.obstacles[i].position.y + getRndInt(200, 300)
        };
        this.collectibles.push(new Collectible(this, params2));
      } else {
        var params2 = {
          type: 1,
          y: this.obstacles[i].position.y + getRndInt(200, 300)
        };
        this.collectibles.push(new Collectible(this, params2));
      }
    }
    this.lives = 1;
    this.gameState = 1;
    this.ops = 400;
    this.bgSound.play();
    this.pauseBTn.classList.remove("hide");
    this.score = 0;
    this.gameState = GAMESTATE.running;
  }

  update() {
    if (this.gameState != GAMESTATE.running) return;
    this.ball.update(this);
    this.collectibles.forEach((collectible, index) => {
      if (collectible.update(this)) {
        this.collectibles.splice(index, 1);
        this.collectSound.play();
      }
    });

    if (this.counter % 400 == 0) {
      this.obstacles.forEach(obstacle => {
        obstacle.angularSpeed += (1 - obstacle.direction * 2) * 0.5;
      });
    }

    if (this.obstacles.length < 10) {
      var params = {
        x: this.gameWidth / 2,
        y:
          this.obstacles[this.obstacles.length - 1].position.y -
          getRndInt(350, 550),
        angle:
          (this.obstacles[this.obstacles.length - 1].startAngle + 180) % 360,
        type: getRndInt(1, 2)
      };
      this.obstacles.push(new Obstacle(this, params));
      if (this.counter % 2 == 0) {
        var params2 = {
          type: getRndInt(2, 4),
          y:
            this.obstacles[this.obstacles.length - 1].position.y +
            getRndInt(200, 300)
        };
        this.collectibles.push(new Collectible(this, params2));
      } else {
        var params2 = {
          type: 1,
          y:
            this.obstacles[this.obstacles.length - 1].position.y +
            getRndInt(200, 300)
        };
        this.collectibles.push(new Collectible(this, params2));
      }
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
    }
    if (this.ball.position.y > this.gameHeight) {
      this.lives--;
      this.ball.speed.y = 0;
      this.ball.gravity = 0;
    }
  }
  draw(ctx) {
    if (this.gameState == GAMESTATE.menu) {
      return;
    }
    ctx.fillStyle = "#343a40";
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    this.obstacles.forEach(obstacle => {
      obstacle.draw(ctx);
    });
    this.ball.draw(ctx);

    this.collectibles.forEach(collectible => {
      collectible.draw(ctx);
    });

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    var highScore;
    if (localStorage.getItem("switchscores") != null) {
      var scores = JSON.parse(localStorage.getItem("switchscores"));
      highScore = scores[4];
    } else {
      highScore = 0;
    }
    ctx.fillText(`Current Score : ${this.score}`, 10, 40);
    ctx.fillText(`High Score : ${highScore}`, 10, 70);

    if (this.gameState === GAMESTATE.gameover) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GameOver", this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillText(
        "Double Tap to Replay",
        this.gameWidth / 2,
        this.gameHeight / 2 + 50
      );
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
    if (this.immune == false) {
      if (
        (COLORS.indexOf(x) != -1 && x != this.ball.color) ||
        (COLORS.indexOf(y) != -1 && y != this.ball.color)
      ) {
        this.lives--;
      }
    }
  }

  togglePause() {
    if (this.gameState === GAMESTATE.paused) {
      this.gameState = GAMESTATE.running;
    } else this.gameState = GAMESTATE.paused;
    if (pc % 2 == 0) {
      this.pauseBTn.src = "imgs/play.png";
    } else {
      this.pauseBTn.src = "imgs/pause.png";
    }
    pc++;
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
      scores = [0, 0, 0, 0, 0];
    }
    if (scores.length < 5) {
      for (var i = 0; i < 5 - scores.length; i++) {
        scores.push(0);
      }
    }
    for (var i = 4; i >= 0; i--) {
      if (scores[i] < this.score) {
        var j = 0;
        while (j < i) {
          scores[j] = scores[j + 1];
          j++;
        }
        scores[i] = this.score;
        break;
      }
    }
    scores.sort(function (a, b) {
      return a - b;
    });
    scores.splice(0, scores.length - 5);
    localStorage.setItem("switchscores", JSON.stringify(scores));
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

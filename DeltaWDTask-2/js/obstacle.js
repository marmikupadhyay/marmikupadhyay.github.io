export default class Obstacle {
  constructor(game, params) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.radius = 90;
    this.thick = 20;
    this.game = game;
    this.indices = new Array();
    this.passed = false;
    this.type = getRndInt(1, 7);
    // this.type = 7;
    this.direction = 1;
    this.direction = getRndInt(0, 1);
    this.position = {
      x: params.x,
      y: params.y
    };
    this.number = getRndInt(2, 4);
    this.pixels;
    this.speed = {
      x: 0,
      y: 0
    };
    this.size = 125;
    this.triPos = {
      x: [
        this.position.x - this.size,
        this.position.x + this.size,
        this.position.x
      ],
      y: [
        this.position.y - this.size / Math.sqrt(3),
        this.position.y - this.size / Math.sqrt(3),
        this.position.y + (2 * this.size) / Math.sqrt(3)
      ],
      x2: [
        this.position.x - this.size + this.size / 3,
        this.position.x + this.size - this.size / 3,
        this.position.x
      ],
      y2: [
        this.position.y -
          this.size / Math.sqrt(3) +
          this.size / (3 * Math.sqrt(3)),
        this.position.y -
          this.size / Math.sqrt(3) +
          this.size / (3 * Math.sqrt(3)),
        this.position.y + (2 * this.size) / Math.sqrt(3) - this.size / 3
      ]
    };
    this.triRadius = [
      this.position.y - this.triPos.y[2],
      this.position.y - this.triPos.y2[2]
    ];
    this.gravity = -9.8;
    this.startAngle = params.angle;
    this.startAngle2 = params.angle;
    this.colors = ["#fae100", "#900dff", "#ff0181", "#32dbf0"];
    shuffleArray(this.colors);
    this.angularSpeed = (1 - this.direction * 2) * 2;
    this.markedForDeletion = false;

    if (this.type == 4 && this.angularSpeed < 0) {
      this.position.x = this.position.x - 50;
    }
    if (this.type == 4 && this.angularSpeed > 0) {
      this.position.x = this.position.x + 50;
    }
    if (this.type == 3 || this.type == 5 || this.type == 6) {
      this.radius *= 1.5;
      this.angularSpeed /= 2;
    }

    if (this.type == 7) {
      this.position.x = this.position.x + this.radius - 10;
      this.position.x2 = this.position.x - 2 * this.radius + 20;
      this.startAngle = 0;
      this.startAngle2 = this.startAngle + Math.PI;
    }
  }

  draw(ctx) {
    if (this.type == 1) {
      for (var i = 0; i < this.number; i++) {
        this.startAngle = this.startAngle + (2 * Math.PI) / this.number;
        var endAngle = this.startAngle + (2 * Math.PI) / this.number;
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
        if (i == 0) {
          ctx.fillStyle = this.game.ball.color;
          ctx.strokeStyle = this.game.ball.color;
        } else {
          while (this.colors[i] == this.game.ball.color) {
            shuffleArray(this.colors);
          }
          ctx.fillStyle = this.colors[i];
          ctx.strokeStyle = this.colors[i];
        }
        ctx.fill();
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
      ctx.fillStyle = "#272727";
      ctx.strokeStyle = "#272727";
      ctx.fill();
    }
    if (this.type == 2) {
      ctx.beginPath();
      ctx.moveTo(this.triPos.x[0], this.position.y);
      ctx.lineTo(this.triPos.x[1], this.position.y);
      ctx.lineTo(this.triPos.x2[1], this.position.y + 20);
      ctx.lineTo(this.triPos.x2[0], this.position.y + 20);
      ctx.closePath();
      ctx.fillStyle = this.colors[0];
      ctx.fill();
    }
    if (this.type == 3) {
      for (var i = 0; i < this.number; i++) {
        this.startAngle = this.startAngle + (2 * Math.PI) / this.number;
        var endAngle = this.startAngle + (2 * Math.PI) / this.number;
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
        if (i == 0) {
          ctx.fillStyle = this.game.ball.color;
          ctx.strokeStyle = this.game.ball.color;
        } else {
          while (this.colors[i] == this.game.ball.color) {
            shuffleArray(this.colors);
          }
          ctx.fillStyle = this.colors[i];
          ctx.strokeStyle = this.colors[i];
        }
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.radius - this.thick - 1,
        0,
        Math.PI * 2,
        true
      );
      ctx.fillStyle = "#272727";
      ctx.strokeStyle = "#272727";
      ctx.fill();
      for (var i = 0; i < this.number; i++) {
        this.startAngle2 = this.startAngle2 + (2 * Math.PI) / this.number;
        var endAngle = this.startAngle2 + (2 * Math.PI) / this.number;
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.arc(
          this.position.x,
          this.position.y,
          this.radius - 2 * this.thick - 10,
          this.startAngle2,
          endAngle
        );
        ctx.closePath();
        if (i == 0) {
          ctx.fillStyle = this.game.ball.color;
          ctx.strokeStyle = this.game.ball.color;
        } else {
          while (this.colors[i] == this.game.ball.color) {
            shuffleArray(this.colors);
          }
          ctx.fillStyle = this.colors[i];
          ctx.strokeStyle = this.colors[i];
        }
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.radius - 3 * this.thick - 1,
        0,
        Math.PI * 2,
        true
      );
      ctx.fillStyle = "#272727";
      ctx.strokeStyle = "#272727";
      ctx.fill();
    }
    if (this.type == 4) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.startAngle);
      ctx.fillStyle = this.colors[0];
      ctx.fillRect(0, 0, 100, 20);
      ctx.restore();

      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(Math.PI / 2 + this.startAngle);
      ctx.fillStyle = this.colors[1];
      ctx.fillRect(0, 0, 100, 20);
      ctx.restore();

      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(Math.PI + this.startAngle);
      ctx.fillStyle = this.colors[2];
      ctx.fillRect(0, 0, 100, 20);
      ctx.restore();

      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate((3 * Math.PI) / 2 + this.startAngle);
      ctx.fillStyle = this.colors[3];
      ctx.fillRect(0, 0, 100, 20);
      ctx.restore();

      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2, true);
      ctx.fillStyle = "#272727";
      ctx.strokeStyle = "#272727";
      ctx.fill();
      ctx.restore();
    }
    if (this.type == 5) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      // ctx.arc(0, 0, 10, 0, Math.PI * 2);
      // ctx.fillStyle = this.colors[0];
      // ctx.fill();
      ctx.rotate(this.startAngle);
      var length = 180;
      var breadth = 20;
      ctx.fillStyle = this.colors[0];
      ctx.fillRect(-length / 2, -length / 2, length, breadth);
      ctx.fillStyle = this.colors[1];
      ctx.fillRect(-length / 2, length / 2 - breadth, length, breadth);
      ctx.fillStyle = this.colors[2];
      ctx.fillRect(
        -length / 2,
        -length / 2 + breadth,
        breadth,
        length - 2 * breadth
      );
      ctx.fillStyle = this.colors[3];
      ctx.fillRect(
        length / 2 - breadth,
        -length / 2 + breadth,
        breadth,
        length - 2 * breadth
      );
      ctx.restore();
    }

    if (this.type == 6) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.startAngle);
      for (var i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.lineTo(
          this.triPos.x[i % 3] - this.position.x,
          this.triPos.y[i % 3] - this.position.y
        );
        ctx.lineTo(
          this.triPos.x[(i + 1) % 3] - this.position.x,
          this.triPos.y[(i + 1) % 3] - this.position.y
        );
        ctx.lineTo(0, 0);
        if (i == 0) {
          ctx.fillStyle = this.game.ball.color;
          ctx.strokeStyle = this.game.ball.color;
        } else {
          while (this.colors[i] == this.game.ball.color) {
            shuffleArray(this.colors);
          }
          ctx.fillStyle = this.colors[i];
          ctx.strokeStyle = this.colors[i];
        }

        ctx.fill();
        ctx.closePath();
      }
      ctx.beginPath();
      ctx.lineTo(
        this.triPos.x2[0] - this.position.x,
        this.triPos.y2[0] - this.position.y
      );
      ctx.lineTo(
        this.triPos.x2[1] - this.position.x,
        this.triPos.y2[1] - this.position.y
      );
      ctx.lineTo(
        this.triPos.x2[2] - this.position.x,
        this.triPos.y2[2] - this.position.y
      );
      ctx.lineTo(
        this.triPos.x2[0] - this.position.x,
        this.triPos.y2[0] - this.position.y
      );
      ctx.fillStyle = "#272727";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
    if (this.type == 7) {
      for (var i = 0; i < this.number; i++) {
        this.startAngle = this.startAngle + (2 * Math.PI) / this.number;
        this.startAngle2 = this.startAngle2 + (2 * Math.PI) / this.number;
        var endAngle = this.startAngle + (2 * Math.PI) / this.number;
        var endAngle2 = this.startAngle2 + (2 * Math.PI) / this.number;

        if (i == 0) {
          ctx.fillStyle = this.game.ball.color;
          ctx.strokeStyle = this.game.ball.color;
        } else {
          while (this.colors[i] == this.game.ball.color) {
            shuffleArray(this.colors);
          }
          ctx.fillStyle = this.colors[i];
          ctx.strokeStyle = this.colors[i];
        }

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.arc(
          this.position.x,
          this.position.y,
          this.radius,
          this.startAngle,
          endAngle
        );
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.position.x2, this.position.y);
        ctx.arc(
          this.position.x2,
          this.position.y,
          this.radius,
          this.startAngle2,
          endAngle2
        );
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
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
      ctx.fillStyle = "#272727";
      ctx.strokeStyle = "#272727";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        this.position.x2,
        this.position.y,
        this.radius - this.thick,
        0,
        Math.PI * 2,
        true
      );
      ctx.fillStyle = "#272727";
      ctx.strokeStyle = "#272727";
      ctx.fill();
    }
  }
  update(game) {
    this.speed.y += this.gravity / 100;
    if (this.speed.y < 0) this.speed.y = 0;
    this.position.y += this.speed.y;

    for (var i = 0; i < 3; i++) {
      this.triPos.y[i] += this.speed.y;
      this.triPos.y2[i] += this.speed.y;
    }

    if (this.position.y - this.radius > this.gameHeight) {
      this.markedForDeletion = true;
    }
    if (game.ball.position.y < this.position.y - this.radius) {
      if (this.passed != true) {
        game.score++;
        game.updateScores();
      }
      this.passed = true;
    }

    if (this.type == 1 || this.type == 3 || this.type == 5 || this.type == 6) {
      this.startAngle += (this.angularSpeed / 180) * Math.PI;
      this.startAngle2 += (this.angularSpeed / 180) * Math.PI;
    }
    if (this.type == 4 || this.type == 7) {
      this.startAngle += (this.angularSpeed / 360) * Math.PI;
    }

    if (this.type == 3 || this.type == 7) {
      this.startAngle2 += (this.angularSpeed / 360) * Math.PI;
    }

    if (this.type == 2) {
      if (game.counter % 100 == 0) {
        shuffleArray(this.colors);
      }
    }
  }
}
function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

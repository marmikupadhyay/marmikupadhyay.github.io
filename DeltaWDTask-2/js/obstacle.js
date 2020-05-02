export default class Obstacle {
  constructor(game, params) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.radius = 90;
    this.thick = 20;
    this.indices = new Array();
    this.passed = false;
    this.type = params.type;
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
    this.size = 100;
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
    this.colors = ["red", "blue", "green", "#ffff00"];
    shuffleArray(this.colors);
    this.angularSpeed = (1 - this.direction * 2) * 2;
    this.markedForDeletion = false;
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
    if (this.type == 3) {
      ctx.moveTo(this.triPos.x[2], this.triPos.y[2]);

      for (var i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.lineTo(this.triPos.x[i], this.triPos.y[i]);
        ctx.lineTo(this.triPos.x2[i], this.triPos.y2[i]);
        ctx.lineTo(this.triPos.x2[(i + 2) % 3], this.triPos.y2[(i + 2) % 3]);
        ctx.lineTo(this.triPos.x[(i + 2) % 3], this.triPos.y[(i + 2) % 3]);
        ctx.closePath();
        ctx.fillStyle = this.colors[i];
        ctx.fill();
      }
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

    if (this.type == 1) {
      this.startAngle += (this.angularSpeed / 180) * Math.PI;
    }
    // if (this.type == 2) {
    //   if (this.triPos.y[0] < this.position.y - this.triRadius[0]) {
    //     this.direction *= -1;
    //   }
    //   if (this.triPos.y[0] > this.position.y + this.triRadius[0]) {
    //     this.direction *= -1;
    //   }

    //   for (var i = 0; i < 3; i++) {
    //     this.triPos.y[i] += this.angularSpeed;
    //     this.triPos.x[i] =
    //       -this.direction *
    //         Math.sqrt(
    //           this.triRadius[0] * this.triRadius[0] -
    //             (this.triPos.y[i] - this.position.y) ** 2
    //         ) +
    //       this.position.x;
    //     console.log(this.triPos);
    //   }

    //   for (var i = 0; i < 3; i++) {
    //     this.triPos.y2[i] += this.angularSpeed;
    //     this.triPos.x2[i] =
    //       -this.direction *
    //         Math.sqrt(
    //           this.triRadius[1] * this.triRadius[1] -
    //             (this.triPos.y2[i] - this.position.y) ** 2
    //         ) +
    //       this.position.x;
    //   }
    // }
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

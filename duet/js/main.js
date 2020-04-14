import Game from "js/game.js";
console.log(1);
var canvas = document.getElementById("game-screen");
var ctx = canvas.getContext("2d");

const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;
var game = new Game(GAME_WIDTH, GAME_HEIGHT);
var lastTime = 0;

function gameLoop(timeStamp) {
  var deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

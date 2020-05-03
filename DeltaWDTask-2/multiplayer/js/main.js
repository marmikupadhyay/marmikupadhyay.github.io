import Game from "../js/game.js";

var w =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

var h =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;
h=window.outerHeight;
if (w > 600) {
  var GAME_WIDTH = w / 3;
  var GAME_HEIGHT = h / 2;
} else {
  var GAME_WIDTH = w;
  var GAME_HEIGHT = h / 2;
}
var canvas = document.getElementById("game-screen");
var canvas2 = document.getElementById("game-screen2");

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
canvas2.width = GAME_WIDTH;
canvas2.height = GAME_HEIGHT;

var menus = document.querySelectorAll(".menu");
menus.forEach(menu => {
  menu.style.width = GAME_WIDTH + "px";
  menu.style.height = GAME_HEIGHT * 2 + "px";
});
var ctx = canvas.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var game = new Game(GAME_WIDTH, GAME_HEIGHT, canvas);
var game2 = new Game(GAME_WIDTH, GAME_HEIGHT, canvas2);

// var input = new Input(game);
// var input2 = new Input(game2);

function gameLoop(timeStamp) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.draw(ctx);
  game2.draw(ctx2);
  game.update();
  game2.update();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

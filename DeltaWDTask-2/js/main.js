import Game from "../js/game.js";

if (window.innerWidth > 600) {
  var GAME_WIDTH = window.innerWidth / 3;
  var GAME_HEIGHT = 700;
} else {
  var GAME_WIDTH = window.innerWidth;
  var GAME_HEIGHT = window.innerHeight;
}
var canvas = document.getElementById("game-screen");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
var menus = document.querySelectorAll(".menu");
menus.forEach(menu => {
  menu.style.width = GAME_WIDTH + "px";
  menu.style.height = GAME_HEIGHT + "px";
});
var ctx = canvas.getContext("2d");

var game = new Game(GAME_WIDTH, GAME_HEIGHT);

function gameLoop(timeStamp) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  game.draw(ctx);
  game.update();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

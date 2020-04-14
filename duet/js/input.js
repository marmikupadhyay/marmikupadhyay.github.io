export default class InputHandler {
  constructor(duet, game) {
    document.addEventListener("keydown", (event) => {
      switch (event.keyCode) {
        case 37:
          duet.moveLeft();
          break;
        case 39:
          duet.moveRight();
          break;
        case 27:
          game.togglePause();
        case 32:
          game.start();
      }
    });
    document.addEventListener("keyup", (event) => {
      switch (event.keyCode) {
        case 37:
          duet.stop();
          break;
        case 39:
          duet.stop();
          break;
      }
    });
  }
}

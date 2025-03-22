export class GameController {
  constructor(game, domController) {
    this.game = game;
    this.domController = domController;
    this.initializeGame();
  }

  initializeGame() {
    this.game.initializePlayers("Player1", "Computer");
    this.domController.displayPlayerNames();

    this.game.placeShips();

    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();

    this.domController.displayMoveRequest();
    this.domController.addEventListenersToOpponentBoard();
  }
}
export class GameController {
  constructor(game, domController) {
    this.game = game;
    this.domController = domController;
    this.initializeGame();
  }

  async initializeGame() {
    this.game.initializePlayers("Player1", "Computer");
    this.domController.displayPlayerNames();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();

    this.game.placeShips();
    this.domController.displayCurrentPlayerBoard();

    await this.game.switchCurrentPlayer();

    this.domController.displayPlayerNames();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();

    this.game.placeShips();
    this.domController.displayCurrentPlayerBoard();

    await this.game.switchCurrentPlayer();

    this.gameLoop();
  }

  async gameLoop() {
    let gameOver = this.game.isOver();
    while (!gameOver) {
      await this.playRound();
      gameOver = this.game.isOver();
    }
  }

  async playRound() {
    this.domController.displayPlayerNames();
    this.domController.displayMoveRequest();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();
    let coordinate;
    do {
      const handleBoardClick = this.domController.addEventListenersToOpponentBoard.bind(this.domController);
      coordinate = await this.game.currentPlayer.getCoordinateChoice(handleBoardClick);
    }
    while(!this.game.isChoiceValid(coordinate));
    
    this.game.currentOpponent().board.receiveAttack(coordinate);

    this.domController.displayCurrentOpponentBoard(); /* this call also removes the EventListeners as the updated board gets re-created on the DOM */
    await this.game.switchCurrentPlayer();
  }
}
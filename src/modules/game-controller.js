export class GameController {
  constructor(game, domController) {
    this.game = game;
    this.domController = domController;
    this.initializeGame();
  }

  initializeGame() {
    this.game.initializePlayers("Player1", "Computer");
    this.domController.displayPlayerNames();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();

    this.game.placeShips();
    this.domController.displayCurrentPlayerBoard();

    this.game.switchCurrentPlayer();

    this.domController.displayPlayerNames();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();

    this.game.placeShips();
    this.domController.displayCurrentPlayerBoard();

    this.game.switchCurrentPlayer();

    this.playRound();  
  }

  async playRound() {
    this.domController.displayPlayerNames();
    this.domController.displayMoveRequest();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();
    const coordinate = await this.domController.addEventListenersToOpponentBoard();
    this.game.currentOpponent().board.receiveAttack(coordinate);

    this.domController.displayCurrentOpponentBoard(); /* this call also removes the EventListeners as the updated board gets re-created on the DOM */
    this.game.switchCurrentPlayer();


    /* make ComputerMove */
    this.domController.displayPlayerNames();
    this.domController.displayMoveRequest();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();
    let coordinateComputer;

    do {
      coordinateComputer = this.game.currentPlayer.getCoordinateChoice();
    } 
    while(!this.game.isChoiceValid(coordinateComputer));

    this.game.currentOpponent().board.receiveAttack(coordinateComputer);
    this.domController.displayCurrentOpponentBoard();
    this.game.switchCurrentPlayer();
  }
}
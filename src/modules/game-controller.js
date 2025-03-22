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

    this.playRound();  
  }

  async playRound() {
    this.domController.displayMoveRequest();
    const coordinate = await this.domController.addEventListenersToOpponentBoard();
    this.game.currentOpponent().board.receiveAttack(coordinate);

    this.domController.displayCurrentOpponentBoard(); /* this call also removes the EventListeners as the updated board gets re-created on the DOM */
    this.game.switchCurrentPlayer();


    /* make ComputerMove */
    let coordinateComputer;

    do {
      coordinateComputer = this.game.currentPlayer.getCoordinateChoice();
    } 
    while(!this.game.isChoiceValid(coordinateComputer));

    this.game.currentOpponent().board.receiveAttack(coordinateComputer);
  }
}
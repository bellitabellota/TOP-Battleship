export class GameController {
  constructor(game, domController, shipClass) {
    this.game = game;
    this.domController = domController;
    this.shipClass = shipClass;
    this.playGame();
  }

  async playGame() {
    this.game.initializePlayers("Player1", "Computer");

    this.domController.displayPlayerNames();
    this.domController.displayCurrentPlayerBoard();
    this.domController.displayCurrentOpponentBoard();

    await this.placeFleetLoop();

    this.gameLoop();
  }

  async placeFleetLoop() {
    return new Promise(async (resolve) => {
      for(let i = 0; i <= 1; i++ ) {
        this.domController.displayPlayerNames();
        this.domController.displayCurrentPlayerBoard();
        this.domController.displayCurrentOpponentBoard();
  
        const handlePlacementClick = this.domController.addPlaceFleetButton.bind(this.domController);
        const fleet = this.shipClass.createFleet();
        const placeFleetOnBoard = this.game.currentPlayer.board.placeFleetOnBoard.bind(this.game.currentPlayer.board);
        const removePlaceFleetButton = this.domController.removePlaceFleetButton.bind(this.domController);
  
  
        await this.game.currentPlayer.makePlacement(fleet, placeFleetOnBoard, handlePlacementClick, removePlaceFleetButton);
        this.domController.displayCurrentPlayerBoard();
  
        await this.game.switchCurrentPlayer();
      }
      resolve();
    });
  }

  async gameLoop() {
    let gameOver = this.game.isOver();
    while (!gameOver) {
      await this.playRound();
      gameOver = this.game.isOver();
    }
    this.domController.displayWinMessage(this.game.currentOpponent());
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
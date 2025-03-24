export class GameController {
  constructor(game, domController, shipClass) {
    this.game = game;
    this.domController = domController;
    this.shipClass = shipClass;
    this.playGame();
  }

  async playGame() {
    this.game.initializePlayers("Player1", "Computer");

    this.domController.displayGameStatus();

    await this.placeFleetLoop();

    this.gameLoop();
  }

  async placeFleetLoop() {
    for(let i = 0; i <= 1; i++ ) {
      this.domController.displayGameStatus();
      await this.placeFleetForCurrentPlayer();
      this.domController.displayCurrentPlayerBoard();
      await this.game.switchCurrentPlayer();
    }
  }

  async placeFleetForCurrentPlayer() {
    const handlePlacementClick = this.domController.addPlaceFleetButton.bind(this.domController);
    const fleet = this.shipClass.createFleet();
    const placeFleetOnBoard = this.game.currentPlayer.board.placeFleetOnBoard.bind(this.game.currentPlayer.board);
    const removePlaceFleetButton = this.domController.removePlaceFleetButton.bind(this.domController);

    await this.game.currentPlayer.makePlacement(fleet, placeFleetOnBoard, handlePlacementClick, removePlaceFleetButton);
  }

  async gameLoop() {
    while (!this.game.isOver()) {
      await this.playRound();
    }
    this.domController.displayWinMessage(this.game.currentOpponent());
  }

  async playRound() {
    this.domController.displayGameStatus();
    this.domController.displayMoveRequest();
    
    const coordinate = await this.getValidCoordinate();
    
    this.game.currentOpponent().board.receiveAttack(coordinate);
    this.domController.displayCurrentOpponentBoard(); /* this call also removes the EventListeners as the updated board gets re-created on the DOM */
    await this.game.switchCurrentPlayer();
  }

  async getValidCoordinate() {
    let coordinate;
    do {
      const handleBoardClick = this.domController.addEventListenersToOpponentBoard.bind(this.domController);
      coordinate = await this.game.currentPlayer.getCoordinateChoice(handleBoardClick);
    } while (!this.game.isChoiceValid(coordinate));
    return coordinate;
  }
}
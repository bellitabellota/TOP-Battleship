import {createFleet} from "./utils/create-fleet.js"

export class GameController {
  constructor(game, domController) {
    this.game = game;
    this.domController = domController;
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
    const fleet = createFleet();
    const placeFleetOnBoard = this.game.currentPlayer.board.placeFleetOnBoard.bind(this.game.currentPlayer.board);
    const removePlaceFleetButton = this.domController.removePlaceFleetButton.bind(this.domController);

    await this.game.currentPlayer.makePlacement(fleet, placeFleetOnBoard, handlePlacementClick, removePlaceFleetButton);
  }

  async gameLoop() {
    while (!this.game.isOver()) {
      await this.playRound();
    }
    this.announceWinner();
  }

  announceWinner() {
    this.game.getWinMessage();
    this.domController.displayWinMessage(message);
  }

  async playRound() {
    this.domController.displayGameStatus();

    const message = this.game.getMoveRequestMessage()
    this.domController.displayMoveRequest(message);
    
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
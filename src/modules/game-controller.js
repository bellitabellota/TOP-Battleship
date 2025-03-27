import {createFleet} from "./utils/create-fleet.js"

export class GameController {
  constructor(game, domController) {
    this.game = game;
    this.domController = domController;
    this.playGame();
  }

  async playGame() {
    this.game.initializePlayers("Player1", "Computer");
    this.displayGameStatus();

    await this.placeFleetForCurrentPlayer();
    await this.game.switchCurrentPlayer();

    await this.placeFleetForCurrentPlayer();
    await this.game.switchCurrentPlayer();

    this.gameLoop();
  }


  displayGameStatus() {
    this.domController.displayPlayerNames(this.game.currentPlayer.name, this.game.currentOpponent().name);
    this.displayCurrentBoard(this.game.currentPlayer.board.current, true);
    this.displayCurrentBoard(this.game.currentOpponent().board.current, false);
  }

  displayCurrentBoard(playerBoard, isBoardOfCurrentPlayer) {
    this.domController.displayCurrentDOMBoard(playerBoard, isBoardOfCurrentPlayer, this.game.currentPlayerIsComputerPlayer());
  }

  placeFleetForCurrentPlayer() {
    return new Promise((resolve) => {
      if (this.game.currentPlayerIsComputerPlayer()) {
        const fleet = createFleet();
        this.game.currentPlayer.board.placeFleetOnBoard(fleet);
        console.log("Computer placing")
        resolve();
      } else {
        this.placeFleetHumanPlayer(resolve); 
      }
    });   
  }

  async placeFleetHumanPlayer(resolve)  {  
    const fleet = createFleet();
    const removeFleetFromBoard = this.game.currentPlayer.board.removeFleetFromBoard.bind(this.game.currentPlayer.board);
    const placeFleetOnBoard = this.game.currentPlayer.board.placeFleetOnBoard.bind(this.game.currentPlayer.board);

    this.domController.addPlaceFleetButton(removeFleetFromBoard, placeFleetOnBoard, fleet, this.game);
    await this.domController.addProceedButton();
    resolve();
  }

  async gameLoop() {
    while (!this.game.isOver()) {
      await this.playRound();
    }
    this.announceWinner();
  }

  announceWinner() {
    const message = this.game.getWinMessage();
    this.domController.displayWinMessage(message);
  }

  async playRound() {
    this.displayGameStatus();

    const message = this.game.getMoveRequestMessage()
    this.domController.displayMoveRequest(message);
    
    const coordinate = await this.getValidCoordinate();
    
    this.game.currentOpponent().board.receiveAttack(coordinate);
    this.displayCurrentBoard(this.game.currentOpponent().board.current, false); /* this call also removes the EventListeners as the updated board gets re-created on the DOM */
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
import {createFleet} from "./utils/create-fleet.js"

export class GameController {
  constructor(game, domController) {
    this.game = game;
    this.domController = domController;
    this.initializePlayers();
  }

  initializePlayers() {
    const initializePlayers = this.game.initializePlayers.bind(this.game);
    const playGame = this.playGame.bind(this);

    this.domController.addTwoPlayerEventListener(initializePlayers, playGame);
    this.domController.addPlayWithComputerEventListener(initializePlayers, playGame);
  }

  async playGame() {
    this.domController.displayPlayerNames(this.game.players[0].name, this.game.players[1].name);
    this.displayGameStatus();

    this.displayPlacementPrompt();
    await this.placeFleetForCurrentPlayer();
    await this.game.switchCurrentPlayer();

    if(this.game.isTwoPlayerGame()) { 
      this.displayPlacementPrompt();
      this.displayGameStatus(); 
    }

    await this.placeFleetForCurrentPlayer();
    await this.game.switchCurrentPlayer();

    this.gameLoop();
  }

  displayPlacementPrompt() {
    const message = this.game.getPlacementPromptMessage();
    this.domController.displayInformationForPlayer(message);
  }


  displayGameStatus() { 
    if (this.game.isTwoPlayerGame()) {
      this.domController.displayCurrentDOMBoard(this.game.players[0].board.current, 1, this.game.isCurrentPlayer(1));
      this.domController.displayCurrentDOMBoard(this.game.players[1].board.current, 2, this.game.isCurrentPlayer(2));
    } else {
      this.domController.displayCurrentDOMBoard(this.game.players[0].board.current, 1, true);
      this.domController.displayCurrentDOMBoard(this.game.players[1].board.current, 2, false);
    }
  }

  placeFleetForCurrentPlayer() {
    return new Promise((resolve) => {
      if (this.game.currentPlayerIsComputerPlayer()) {
        const fleet = createFleet();
        this.game.currentPlayer.board.placeFleetOnBoard(fleet);
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
    const playerNumber = this.game.currentPlayer === this.game.players[0] ? 1 : 2;

    this.domController.addPlaceFleetControls(removeFleetFromBoard, playerNumber, placeFleetOnBoard, fleet, this.game);
    await this.domController.addProceedButtonEventListener();
    resolve();
  }

  async gameLoop() {
    while (!this.game.isOver()) {
      await this.playRound();
    }
    this.announceWinner();
  }

  announceWinner() {
    const winMessage = this.game.getWinMessage();
    this.domController.displayInformationForPlayer(winMessage);
  }

  async playRound() {
    this.displayGameStatus();

    const message = this.game.getMoveRequestMessage()
    this.domController.displayInformationForPlayer(message);
    
    const coordinate = await this.getValidCoordinate();
    
    this.game.currentOpponent().board.receiveAttack(coordinate);

    this.displayGameStatus(); /* this call also removes the EventListeners as the updated board gets re-created on the DOM */

    if(this.game.isTwoPlayerGame()) { this.domController.displaySwitchScreen();  }

    await this.game.switchCurrentPlayer();
  }

  async getValidCoordinate() {
    let coordinate;
    do {
      const handleBoardClick = this.domController.addEventListenersToOpponentBoard.bind(this.domController);
      const opponentPlayerNumber = this.game.currentOpponent() === this.game.players[0] ? 1 : 2;
      coordinate = await this.game.currentPlayer.getCoordinateChoice(handleBoardClick, opponentPlayerNumber);
    } while (!this.game.isChoiceValid(coordinate));
    return coordinate;
  }
}
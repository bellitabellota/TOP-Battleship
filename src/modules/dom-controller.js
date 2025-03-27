export class DOMController {
  constructor() {
    this.domBoardCurrentPlayer = document.querySelector(".js-current-player-board");
    this.domBoardOpponentPlayer = document.querySelector(".js-opponent-board");
    this.currentPlayerNameElem = document.querySelector(".js-current-player-name");
    this.currentOpponentNameElem = document.querySelector(".js-opponent-name");
    this.playerInfoElem = document.querySelector(".js-player-information");
    this.controlsButtonContainer = document.querySelector(".js-controls-button-container");
    this.twoPlayerButton = document.querySelector(".js-two-player-button");
    this.playWithComputerButton = document.querySelector(".js-play-with-computer-button");
    this.initializationScreen = document.querySelector(".js-initialize-screen");
    this.containerOngoingGame = document.querySelector(".js-container-ongoing-game");
    this.missionStatement = document.querySelector(".js-mission-statement");
  }

  addTwoPlayerEventListener(initializePlayers, playGame) {
    this.twoPlayerButton.addEventListener("click", ()=> {
      initializePlayers("Player1", "Player2");
      playGame();
      this.initializationScreen.classList.add('hidden');
      this.containerOngoingGame.hidden = false;
      this.missionStatement.hidden = false;
    })
  }

  addPlayWithComputerEventListener(initializePlayers, playGame) {
    this.playWithComputerButton.addEventListener("click", ()=> {
      initializePlayers("Player1", "Computer");
      playGame();
      this.initializationScreen.classList.add('hidden');
      this.containerOngoingGame.hidden = false;
      this.missionStatement.hidden = false;
    })
  }

  removePlaceFleetControls() {
    this.controlsButtonContainer.innerHTML = "";
  }

  addPlaceFleetControls(removeFleetFromBoard, placeFleetOnBoard, fleet, game) {
    this.controlsButtonContainer.innerHTML = `
            <button class="js-place-fleet-button place-fleet-button">Place Fleet</button>
            <button class="js-proceed-button proceed-button">Proceed</button>`;

    const placeFleetButton = document.querySelector(".js-place-fleet-button");
    
    placeFleetButton.addEventListener("click", () => {
      removeFleetFromBoard();
      placeFleetOnBoard(fleet);
      this.displayCurrentDOMBoard(game.currentPlayer.board.current, true, false);
    });
  }

  addProceedButton() {
    return new Promise((resolve) => {
      const proceedButton = document.querySelector(".js-proceed-button");
  
      proceedButton.addEventListener("click", () => {
        this.removePlaceFleetControls();
        resolve();
      });
    });
  }

  displayMoveRequest(message) {
    this.playerInfoElem.innerHTML = message;
  }

  addEventListenersToOpponentBoard() {  
    return new Promise((resolve) => {
      const opponentFieldElements = this.domBoardOpponentPlayer.querySelectorAll(".js-field");
      
      opponentFieldElements.forEach((field) => {
        field.classList.add("opponent-field");
        field.addEventListener("click", () => {
          resolve(this.getClickedCoordinate(field));
        });
      })
    });
  }

  getClickedCoordinate(field) {
    const xCoordinate = Number(field.dataset.index.split("")[0]);
    const yCoordinate = Number(field.dataset.index.split("")[1]);
    return [xCoordinate, yCoordinate];
  }

  displayCurrentDOMBoard(playerBoard, isBoardOfCurrentPlayer, currentPlayerIsComputerPlayer) {
    let domBoard = isBoardOfCurrentPlayer ? this.domBoardCurrentPlayer : this.domBoardOpponentPlayer;
    domBoard.innerHTML = "";

    playerBoard.forEach((row, rowIndex) => {
      const divRowElem = document.createElement("div");
      divRowElem.classList =`row`;
      domBoard.appendChild(divRowElem);

      row.forEach((field, fieldIndex) => {
        const divElem = this.createField(field, rowIndex, fieldIndex, isBoardOfCurrentPlayer, currentPlayerIsComputerPlayer);
        divRowElem.appendChild(divElem);
      });
    })
  }

  createField (field, rowIndex, fieldIndex, isBoardOfCurrentPlayer, currentPlayerIsComputerPlayer){
    const divElem = document.createElement("div");

    if (field !== null) {
      divElem.innerHTML = this.getFieldContent(field, isBoardOfCurrentPlayer, currentPlayerIsComputerPlayer);
    }        

    divElem.classList=`field js-field`;
    divElem.dataset.index=`${rowIndex}${fieldIndex}`;
    return divElem;
  };

  getFieldContent(field, isBoardOfCurrentPlayer, currentPlayerIsComputerPlayer){
    if (field === "m") {
      return `O`;
    } else if (field === "h") {
      return `\u{1F3CA}`;
    } else if(isBoardOfCurrentPlayer && !currentPlayerIsComputerPlayer) {
      return `\u{1F6A2}`;
    }  else {
      return "";
    }      
  }

  displayPlayerNames(currentPlayerName, opponentPlayerName) {
    this.currentPlayerNameElem.innerHTML = currentPlayerName;
    this.currentOpponentNameElem.innerHTML = opponentPlayerName;
  }

  displayWinMessage(message){
    this.playerInfoElem.innerHTML = message;
  }
}

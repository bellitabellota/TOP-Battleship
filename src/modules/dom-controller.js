export class DOMController {
  constructor() {
    this.domBoardPlayer1 = document.querySelector(".js-player1-board");
    this.domBoardPlayer2 = document.querySelector(".js-player2-board");
    this.player1NameElem = document.querySelector(".js-player1-name");
    this.player2NameElem = document.querySelector(".js-player2-name");
    this.playerInfoElem = document.querySelector(".js-player-information");
    this.controlsButtonContainer = document.querySelector(".js-controls-button-container");
    this.twoPlayerButton = document.querySelector(".js-two-player-button");
    this.playWithComputerButton = document.querySelector(".js-play-with-computer-button");
    this.initializationScreen = document.querySelector(".js-initialize-screen");
    this.containerOngoingGame = document.querySelector(".js-container-ongoing-game");
    this.missionStatement = document.querySelector(".js-mission-statement");
  }

  displaySwitchScreen() {
    const switchScreen = document.createElement('div');
    switchScreen.classList.add('switch-screen');
  
    switchScreen.innerHTML = `
      <p>Switching turns in:</p>
      <span class="countdown">3</span>
    `;
  
    document.body.appendChild(switchScreen);
  
    let countdownValue = 3;
    const intervalId = setInterval(() => {
      countdownValue -= 1;
      const countdown = switchScreen.querySelector('.countdown');
      countdown.textContent = countdownValue;
  
      if (countdownValue === 0) {
        clearInterval(intervalId);
  
        switchScreen.classList.add('fade-out');
  
        switchScreen.addEventListener('transitionend', () => {
          document.body.removeChild(switchScreen);
        });
      }
    }, 1000);
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

  addPlaceFleetControls(removeFleetFromBoard, playerNumber, placeFleetOnBoard, fleet, game) {
    this.controlsButtonContainer.innerHTML = `
            <button class="js-place-fleet-button place-fleet-button">Place Fleet</button>
            <button class="js-proceed-button proceed-button">Proceed</button>`;

    const placeFleetButton = document.querySelector(".js-place-fleet-button");
    
    placeFleetButton.addEventListener("click", () => {
      removeFleetFromBoard();
      placeFleetOnBoard(fleet);
      this.displayCurrentDOMBoard(game.currentPlayer.board.current, playerNumber, true);
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

  displayInformationForPlayer(message) {
    this.playerInfoElem.innerHTML = message;
  }

  addEventListenersToOpponentBoard(opponentPlayerNumber) {  
    const domBoard = opponentPlayerNumber === 1 ? this.domBoardPlayer1 : this.domBoardPlayer2;
    return new Promise((resolve) => {
      const opponentFieldElements = domBoard.querySelectorAll(".js-field");
      
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

  displayCurrentDOMBoard(playerBoard, playerNumber, showShip) {
    let domBoard = playerNumber === 1 ? this.domBoardPlayer1 : this.domBoardPlayer2;
    domBoard.innerHTML = "";

    playerBoard.forEach((row, rowIndex) => {
      const divRowElem = document.createElement("div");
      divRowElem.classList =`row`;
      domBoard.appendChild(divRowElem);

      row.forEach((field, fieldIndex) => {
        const divElem = this.createField(field, rowIndex, fieldIndex, showShip);
        divRowElem.appendChild(divElem);
      });
    })
  }

  createField (field, rowIndex, fieldIndex, showShip){
    const divElem = document.createElement("div");

    if (field !== null) {
      divElem.innerHTML = this.getFieldContent(field, showShip);
    }        

    divElem.classList=`field js-field`;
    divElem.dataset.index=`${rowIndex}${fieldIndex}`;
    return divElem;
  };

  getFieldContent(field, showShip){
    if (field === "m") {
      return `O`;
    } else if (field === "h") {
      return `\u{1F3CA}`;
    } else if(showShip) {
      return `\u{1F6A2}`;
    }  else {
      return "";
    }      
  }

  displayPlayerNames(player1Name, player2Name) {
    this.player1NameElem.innerHTML = player1Name;
    this.player2NameElem.innerHTML = player2Name;
  }

  displayWinMessage(message){
    this.playerInfoElem.innerHTML = message;
  }
}

export class DOMController {
  constructor() {
    this.domBoardCurrentPlayer = document.querySelector(".js-current-player-board");
    this.domBoardOpponentPlayer = document.querySelector(".js-opponent-board");
    this.currentPlayerNameElem = document.querySelector(".js-current-player-name");
    this.currentOpponentNameElem = document.querySelector(".js-opponent-name");
    this.playerInfoElem = document.querySelector(".js-player-information");
    this.placeFleetBtnContainer = document.querySelector(".js-place-fleet-button-container");
    }

    removePlaceFleetButton() {
      this.placeFleetBtnContainer.innerHTML = "";
    }

    addPlaceFleetButton() {
      return new Promise((resolve) => { 
        this.placeFleetBtnContainer.innerHTML = `<button class="js-place-fleet-button place-fleet-button">Place Fleet</button>`;

        const placeFleetButton = document.querySelector(".js-place-fleet-button");
        
        placeFleetButton.addEventListener("click", () => {
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

  displayCurrentBoard(playerBoard, isBoardOfCurrentPlayer, currentPlayerIsComputerPlayer) {
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

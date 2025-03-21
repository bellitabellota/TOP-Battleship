export class DOMController {
  constructor(game) {
    this.game = game;
    this.domBoardCurrentPlayer = document.querySelector(".js-current-player-board");
    this.domBoardOpponentPlayer = document.querySelector(".js-opponent-board");
    this.currentPlayerNameElem = document.querySelector(".js-current-player-name");
    this.currentOpponentNameElem = document.querySelector(".js-opponent-name");
    this.playerInfoElem = document.querySelector(".js-player-information");
    }

    displayMoveRequest() {
      const playerName = this.game.currentPlayer.name;
      console.log(playerName);
      this.playerInfoElem.innerHTML = `${playerName}, it is time to attack your enemy. Click on a field of your choice.`;
    }

    addEventListenersToOpponentBoard() {
      const opponentFieldElements = this.domBoardOpponentPlayer.querySelectorAll(".js-field");

      opponentFieldElements.forEach((field) => {
        field.addEventListener("click", () => {
          const coordinate = this.getClickedCoordinate(field);

          this.game.currentOpponent().board.receiveAttack(coordinate);

          this.displayCurrentOpponentBoard(); /* this call also removes the EventListeners as the updated board gets re-created on the DOM */
        });
      });
    }

    getClickedCoordinate(field) {
      const xCoordinate = Number(field.dataset.index.split("")[0]);
      const yCoordinate = Number(field.dataset.index.split("")[1]);
      console.log([xCoordinate, yCoordinate]);
      return [xCoordinate, yCoordinate];
    }

    displayCurrentOpponentBoard() {
      const opponent = this.game.currentOpponent();
      const currentOpponentBoard = opponent.board.current;
      this.domBoardOpponentPlayer.innerHTML = "";
  
      currentOpponentBoard.forEach((row, rowIndex) => {
        const divRowElem = document.createElement("div");
        divRowElem.classList =`row`;
        this.domBoardOpponentPlayer.appendChild(divRowElem);
  
        row.forEach((field, fieldIndex) => {
          const divElem = this.createField(opponent, field, rowIndex, fieldIndex);
          divRowElem.appendChild(divElem);
        });
      })
    }

  displayCurrentPlayerBoard() {
    const currentPlayerBoard = this.game.currentPlayer.board.current;
    this.domBoardCurrentPlayer.innerHTML = "";

    currentPlayerBoard.forEach((row, rowIndex) => {
      const divRowElem = document.createElement("div");
      divRowElem.classList =`row`;
      this.domBoardCurrentPlayer.appendChild(divRowElem);

      row.forEach((field, fieldIndex) => {
        const divElem = this.createField(this.game.currentPlayer, field, rowIndex, fieldIndex);
        divRowElem.appendChild(divElem);
      });
    })
  }

  createField (player, field, rowIndex, fieldIndex){
    const divElem = document.createElement("div");

    if (field !== null) {
      divElem.innerHTML = this.getFieldContent(field, player);
    }        

    divElem.classList=`field js-field`;
    divElem.dataset.index=`${rowIndex}${fieldIndex}`;
    return divElem;
  };

  getFieldContent(field, player){
    if (field === "m") {
      return field;
    } else if(player === this.game.currentPlayer) {
      return `\u{1F6A2}`;
    } else if (field === "h") {
      return `\u{1F3CA}`;
    } else {
      return "";
    }      
  }

  displayPlayerNames() {
    this.currentPlayerNameElem.innerHTML = this.game.currentPlayer.name;
    this.currentOpponentNameElem.innerHTML = this.game.currentOpponent().name;
  }
}

export class DOMController {
  constructor(game) {
    this.game = game;
    this.domBoardCurrentPlayer = document.querySelector(".js-current-player-board");
    this.domBoardOpponentPlayer = document.querySelector(".js-opponent-board");
    this.currentPlayerNameElem = document.querySelector(".js-current-player-name");
    this.currentOpponentNameElem = document.querySelector(".js-opponent-name");
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

  createField = (player, field, rowIndex, fieldIndex) => {
    const divElem = document.createElement("div");

    if (field !== null) {
      divElem.innerHTML = this.getFieldContent(field, player);
    }        

    divElem.classList=`field`;
    return divElem;
  };

  getFieldContent(field, player){
    if (field === "m") {
      return field;
    } else if(player === this.game.currentPlayer) {
      return `\u{1F6A2}`;
    } else {
      return "";
    }      
  }

  displayPlayerNames() {
    this.currentPlayerNameElem.innerHTML = this.game.currentPlayer.name;
    this.currentOpponentNameElem.innerHTML = this.game.currentOpponent().name;
  }
}

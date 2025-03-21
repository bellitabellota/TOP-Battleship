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
          const divElem = this.createField(field, rowIndex, fieldIndex);
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
        const divElem = this.createField(field, rowIndex, fieldIndex);
        divRowElem.appendChild(divElem);
      });
    })
  }

  createField = (field, rowIndex, fieldIndex) => {
    const divElem = document.createElement("div");        
    divElem.classList=`field`;
    return divElem;
  };

  displayPlayerNames() {
    this.currentPlayerNameElem.innerHTML = this.game.currentPlayer.name;
    this.currentOpponentNameElem.innerHTML = this.game.currentOpponent().name;
  }
}

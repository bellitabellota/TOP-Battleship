import { HumanPlayer, ComputerPlayer } from "./player.js";
import { Ship } from "./ship.js";
import { getRandomInteger } from "./random-integer.js";

export class Game {
  constructor() {
    this.players = [];
    this.currentPlayer;
  }

  initializePlayers(player1Name, player2Name) {
    const player1 = this.initializePlayer(player1Name);
    this.players.push(player1);

    const player2 = this.initializePlayer(player2Name);
    this.players.push(player2);

    this.setInitialCurrentPlayer(0);
  }

  initializePlayer(name) {
    if (name === "Computer") {
      return new ComputerPlayer(name);
    } else {
      return new HumanPlayer(name);
    }
  }

  setInitialCurrentPlayer(playerIndex) {
    this.currentPlayer = this.players[playerIndex];
  }

  currentOpponent() {
    return this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  switchCurrentPlayer() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
        resolve();
      }, 500)
    });
  }

  isChoiceValid(coordinate) {
    const valueOnOpponentBoard = this.currentOpponent().board.current[coordinate[0]][coordinate[1]];
    if (valueOnOpponentBoard === "h" || valueOnOpponentBoard === "m") {
      return false;
    } else {
      return true;
    }
  }

  isOver() {
    return this.currentPlayer.board.allShipsSunk();
  }
}

import { HumanPlayer, ComputerPlayer } from "./player.js";

export class Game {
  constructor() {
    this.players = [];
  }

  initializePlayers(player1Name, player2Name) {
    const player1 = this.initializePlayer(player1Name);
    this.players.push(player1);

    const player2 = this.initializePlayer(player2Name);
    this.players.push(player2);
  }

  initializePlayer(name) {
    if (name === "Computer") {
      return new ComputerPlayer(name);
    } else {
      return new HumanPlayer(name);
    }
  }
}

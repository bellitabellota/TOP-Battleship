import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
  }
}

export class HumanPlayer extends Player {}

export class ComputerPlayer extends Player {}

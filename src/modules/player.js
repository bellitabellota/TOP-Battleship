import { Gameboard } from "./gameboard.js";
import { getRandomInteger } from "./utils/random-integer.js";

export class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.shipsPlaced = false;
  }
}

export class HumanPlayer extends Player {
  getCoordinateChoice(cb) {
    return new Promise(async (resolve) => {
      
      const coordinate = await cb();

      resolve(coordinate);
    }); 
  }
}

export class ComputerPlayer extends Player {
  getCoordinateChoice() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const xCoordinate = getRandomInteger();
        const yCoordinate = getRandomInteger();
  
      resolve([xCoordinate, yCoordinate]);
      }, 1000);
    }); 
  }
}

import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
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
        const xCoordinate = Math.floor(Math.random() * 10);
        const yCoordinate = Math.floor(Math.random() * 10);
  
      resolve([xCoordinate, yCoordinate]);
      }, 2000);
    }); 
  }
}

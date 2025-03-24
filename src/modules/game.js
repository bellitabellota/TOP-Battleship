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

  placeFleetOnBoard(fleet, board){
    fleet.forEach((ship) => {
      const shipCoordinates = this.getRandomValidCoordinates(ship, board);
      this.currentPlayer.board.placeShip(shipCoordinates, ship);
    });
  }

  getRandomValidCoordinates(ship, currentBoard) {
    let randomCoordinates;

    do {
      randomCoordinates = this.getRandomCoordinatesForShip(ship);
    } while (!this.coordinatesValid(randomCoordinates, currentBoard));

    return randomCoordinates;
  }

  coordinatesValid(randomCoordinates, currentBoard) {
    for (const [x, y] of randomCoordinates) {
      const adjacentCoordinates = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1]
      ];

      const validAdjacentCoordinates = this.filterCoordinatesOnBoard(adjacentCoordinates);
  
      for (const coordinate of validAdjacentCoordinates) {
        const fieldValue = currentBoard[coordinate[0]][coordinate[1]];
        if (fieldValue !== null && fieldValue !== undefined) {
          return false;
        }
      }
    }
    return true;
  }

  filterCoordinatesOnBoard(adjacentCoordinates) {
    return adjacentCoordinates.filter(([x, y]) => {
      return x >= 0 && x < 10 && y >= 0 && y < 10;
    });
  }

  getRandomCoordinatesForShip(ship) {
    let coordinatesShip;
    do {
      const shipOrientation = this.getShipOrientation(getRandomInteger());
      const startCoordinate = this.getStartCoordinate(getRandomInteger(), getRandomInteger());
      coordinatesShip = this.calculateCoordinatesShip(startCoordinate, ship.length, shipOrientation);
    } while (!this.doCoordinatesExist(coordinatesShip));
    return coordinatesShip;
  }

  doCoordinatesExist(coordinatesShip) {
    for (let coordinate of coordinatesShip) {
      if (!coordinate.every(value => value >= 0 && value <= 9)) {
        return false;
      }
    }
    return true;
  }

  calculateCoordinatesShip(start, length, shipOrientation) {
    const coordinates = [start.slice()];
  
    for (let i = 1; i < length; i++) {
      const newCoordinate = start.map((value, index) => index === shipOrientation ? value + i : value );

      coordinates.push(newCoordinate);
    }
    return coordinates;
  }

  getStartCoordinate(randomNumber1, randomNumber2) {
    return [randomNumber1, randomNumber2];
  }

  getShipOrientation(randomNumber) {
    if (randomNumber <= 4) {
      return 0;
    } else {
      return 1;
    }
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

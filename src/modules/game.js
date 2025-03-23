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

  /* test method below once it is finally implemented */
  placeShips() {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const destroyer = new Ship(3);
    const submarine = new Ship(3);
    const patrolBoat = new Ship(2);

    this.getRandomCoordinatesForShip(carrier);

    const coordinatesCarrier = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    const coordinatesBattleShip = [[2, 2], [2, 3], [2, 4], [2, 5]];
    const coordinatesDestroyer = [[5, 3], [5, 4], [5, 5]];
    const coordinatesSubmarine = [[7, 3], [7, 4], [7, 5]];
    const coordinatesPatrolBoat = [[9, 4], [9, 5]];

    this.currentPlayer.board.placeShip(coordinatesCarrier, carrier);
    this.currentPlayer.board.placeShip(coordinatesBattleShip, battleship);
    this.currentPlayer.board.placeShip(coordinatesDestroyer, destroyer);
    this.currentPlayer.board.placeShip(coordinatesSubmarine, submarine);
    this.currentPlayer.board.placeShip(coordinatesPatrolBoat, patrolBoat);
  }

  getRandomCoordinatesForShip(ship) {
    const shipOrientation = this.getShipOrientation(getRandomInteger());
    const startCoordinate = this.getStartCoordinate(getRandomInteger(), getRandomInteger());
    const coordinatesShip = this.calculateCoordinatesShip(startCoordinate, ship.length, shipOrientation);
    this.doCoordinatesExist(coordinatesShip);
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

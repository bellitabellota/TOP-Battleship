import { Ship } from "./ship.js";
import { getRandomInteger } from "./utils/random-integer.js";

export class Gameboard {
  constructor() {
    this.current = [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ];

    this.placedShips = [];
  }

  placeShip(coordinates, ship) {
    coordinates.forEach((coordinate) => {
      this.current[coordinate[0]][coordinate[1]] = ship;
    });

    this.placedShips.push(ship);
  }

  receiveAttack(coordinate) {
    const valueSelectedField = this.current[coordinate[0]][coordinate[1]];

    if (valueSelectedField instanceof Ship) {
      valueSelectedField.hit();
      valueSelectedField.isSunk();
      this.current[coordinate[0]][coordinate[1]] = "h";
    } else {
      const missedShot = "m";
      this.current[coordinate[0]][coordinate[1]] = missedShot;
    }
  }

  allShipsSunk() {
    return this.placedShips.every((ship) => ship.sunk);
  }

  placeFleetOnBoard(fleet){
    fleet.forEach((ship) => {
      const shipCoordinates = this.getRandomValidCoordinates(ship);
      this.placeShip(shipCoordinates, ship);
    });
  }

  getRandomValidCoordinates(ship) {
    let randomCoordinates;

    do {
      randomCoordinates = this.getRandomCoordinatesForShip(ship);
    } while (!this.coordinatesValid(randomCoordinates));

    return randomCoordinates;
  }

  coordinatesValid(randomCoordinates) {
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
        const fieldValue = this.current[coordinate[0]][coordinate[1]];
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
}

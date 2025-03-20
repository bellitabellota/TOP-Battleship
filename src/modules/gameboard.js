import { Ship } from "./ship.js";

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
    } else {
      const missedShot = "m";
      this.current[coordinate[0]][coordinate[1]] = missedShot;
    }
  }

  allShipsSunk() {
    return this.placedShips.every((ship) => ship.sunk);
  }
}

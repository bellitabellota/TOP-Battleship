import { HumanPlayer, ComputerPlayer } from "./player.js";
import { Ship } from "./ship.js";

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
    return this.currentPlayer = this.players[0] ? this.players[1] : this.players[0];
  }

  /* test method below once it is finally implemented */
  placeShips() {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const destroyer = new Ship(3);
    const submarine = new Ship(3);
    const patrolBoat = new Ship(2);

    const coordinatesCarrier = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    const coordinatesBattleShip = [[2, 2], [2, 3], [2, 4], [2, 5]];
    const coordinatesDestroyer = [[5, 3], [5, 4], [5, 5]];
    const coordinatesSubmarine = [[7, 3], [7, 4], [7, 5]];
    const coordinatesPatrolBoat = [[9, 4], [9, 5]];

    this.players[0].board.placeShip(coordinatesCarrier, carrier);
    this.players[0].board.placeShip(coordinatesBattleShip, battleship);
    this.players[0].board.placeShip(coordinatesDestroyer, destroyer);
    this.players[0].board.placeShip(coordinatesSubmarine, submarine);
    this.players[0].board.placeShip(coordinatesPatrolBoat, patrolBoat);

    this.players[1].board.placeShip(coordinatesCarrier, carrier);
    this.players[1].board.placeShip(coordinatesBattleShip, battleship);
    this.players[1].board.placeShip(coordinatesDestroyer, destroyer);
    this.players[1].board.placeShip(coordinatesSubmarine, submarine);
    this.players[1].board.placeShip(coordinatesPatrolBoat, patrolBoat);
  }
}

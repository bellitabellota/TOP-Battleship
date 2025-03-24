export class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
    this.sunk = false;
  }

  hit() {
    this.hitCount += 1;
  }

  isSunk() {
    if (this.hitCount === this.length) {
      this.sunk = true;
    }
  }

  static createFleet(){
    const fleet = [];
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const destroyer = new Ship(3);
    const submarine = new Ship(3);
    const patrolBoat = new Ship(2);
    
    fleet.push(carrier, battleship, destroyer, submarine, patrolBoat);

    return fleet;
  }
}

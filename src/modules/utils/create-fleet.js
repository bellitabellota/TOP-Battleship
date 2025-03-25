import { Ship } from "../ship.js";

export function createFleet(){
  const fleet = [];
  const carrier = new Ship(5);
  const battleship = new Ship(4);
  const destroyer = new Ship(3);
  const submarine = new Ship(3);
  const patrolBoat = new Ship(2);
  
  fleet.push(carrier, battleship, destroyer, submarine, patrolBoat);

  return fleet;
}
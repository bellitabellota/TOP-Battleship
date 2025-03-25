import { Ship } from "../modules/ship.js";

let ship;

beforeEach(() => {
  ship = new Ship(3);
});

/* testing the instance initialization is actually not necessary as the constructor only creates instance variables but does not call any method */

test("ship is correctly initialized with length, hitCount, and sunk properties", () => {
  expect(ship).toEqual({ length: 3, hitCount: 0, sunk: false });
});

test("ship.hit() increases ship.hitCount by 1", () => {
  ship.hit();
  expect(ship.hitCount).toBe(1);
});

describe("if ship.hitCount equals ship.length", () => {
  test("ship.isSunk() sets ship.sunk to true", () => {
    ship.hitCount = 3;
    ship.isSunk();
    expect(ship.sunk).toBe(true);
  });
});

describe("if ship.hitCount does NOT equal ship.length", () => {
  test("ship.isSunk() does NOT change ship.sunk (remains false)", () => {
    ship.hitCount = 2;
    ship.isSunk();
    expect(ship.sunk).toBe(false);
  });
});

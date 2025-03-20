import { Gameboard } from "../modules/gameboard.js";
import { Ship } from "../modules/ship.js";
jest.mock("../modules/ship.js");

beforeEach(() => {
  Ship.mockClear();
});

/* testing the instance initialization is actually not necessary as the constructor only creates instance variables but does not call any method */

test("instance initialization", () => {
  const gameboard = new Gameboard();

  expect(gameboard.current.length).toBe(10);

  gameboard.current.forEach((row) => {
    expect(row.length).toBe(10);

    expect(row.every((field) => field === null)).toBeTruthy();
  });

  expect(gameboard.placedShips).toEqual([]);
});

describe("gameboard.placeShip(coordinates, anyObject)", () => {
  test("places a reference of any Object at the corresponding coordinates of gameboard.current", () => {
    const gameboard = new Gameboard();
    const anyObject = { name: "Any Object" };
    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    gameboard.placeShip(coordinates, anyObject);

    expect(gameboard.current[0][0]).toBe(anyObject);
    expect(gameboard.current[0][1]).toBe(anyObject);
    expect(gameboard.current[0][2]).toBe(anyObject);
    expect(gameboard.placedShips).toContain(anyObject);
  });
});

describe("gameboard.receiveAttack(coordinate)", () => {
  let mockShip;
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    mockShip = new Ship(3);
    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    gameboard.placeShip(coordinates, mockShip);
  });

  test("records damage in the event of success", () => {
    gameboard.receiveAttack([0, 2]);

    expect(mockShip.hit).toHaveBeenCalledTimes(1);
  });

  test("records missedShot in the event of failure", () => {
    gameboard.receiveAttack([5, 5]);

    expect(mockShip.hit).toHaveBeenCalledTimes(0);
    expect(gameboard.current[5][5]).toBe("m");
  });
});

describe("gameboard.allShipsSunk", () => {
  let sunkenMockShip;
  let sunkenMockShip2;
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    sunkenMockShip = new Ship(3);
    sunkenMockShip.sunk = true;
    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    gameboard.placeShip(coordinates, sunkenMockShip);

    sunkenMockShip2 = new Ship(4);
    sunkenMockShip2.sunk = true;
    const coordinates2 = [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
    ];

    gameboard.placeShip(coordinates2, sunkenMockShip2);
  });

  test("returns true if of ALL placed ships.sunk is true", () => {
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test("returns false if NOT ALL placed ships.sunk is true", () => {
    const floatingMockShip = new Ship(5);
    const coordinates2 = [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
    ];

    gameboard.placeShip(coordinates2, floatingMockShip);

    expect(gameboard.allShipsSunk()).toBe(false);
  });
});

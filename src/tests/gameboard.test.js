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

  test("records damage in the event of success on current board and ship", () => {
    gameboard.receiveAttack([0, 2]);

    expect(mockShip.hit).toHaveBeenCalledTimes(1);
    expect(mockShip.isSunk).toHaveBeenCalledTimes(1);
    expect(gameboard.current[0][2]).toBe("h");
  });

  test("records missedShot in the event of failure", () => {
    gameboard.receiveAttack([5, 5]);

    expect(mockShip.hit).toHaveBeenCalledTimes(0);
    expect(gameboard.current[5][5]).toBe("m");
  });
});

describe("gameboard.allShipsSunk()", () => {
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

describe("board.getShipOrientation()", () => {
  const board = new Gameboard();
  test("returns 0 for numbers below or equal 4", () => {
    const returnValue = board.getShipOrientation(4);
    expect(returnValue).toBe(0);
  })

  test("returns 1 for numbers greater than 4", () => {
    const returnValue = board.getShipOrientation(5);
    expect(returnValue).toBe(1);
  });
})

describe("board.getStartCoordinate()", () => {
  const board = new Gameboard();
  test("returns an array with 2 numbers", () => {
    const returnValue = board.getStartCoordinate(3, 6);
    expect(Array.isArray(returnValue)).toBe(true);
    expect(returnValue.length).toBe(2);
    expect(typeof returnValue[0]).toBe("number");
    expect(typeof returnValue[1]).toBe("number");
  })
})

describe("board.calculateCoordinatesShip()", () => {
  const board = new Gameboard();
  test("should calculate ship coordinates correctly for horizontal orientation", () => {
    const result = board.calculateCoordinatesShip([0, 0], 4, 1);

    expect(result).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
  });

  test("should calculate ship coordinates correctly for vertical orientation", () => {
    const result = board.calculateCoordinatesShip([1, 1], 3, 0);
    expect(result).toEqual([[1, 1], [2, 1], [3, 1]]);
  });
})

describe("board.doCoordinatesExist(coordinates)", () => {
  const board = new Gameboard();
  test("should return true for valid coordinates", () => {
    const validCoordinates = [[0, 1], [5, 9], [3, 7]];
    expect(board.doCoordinatesExist(validCoordinates)).toBe(true);
  });

  test("should return false for coordinates greater than 9", () => {
    const invalidCoordinates = [[10, 5], [11, 5]];
    expect(board.doCoordinatesExist(invalidCoordinates)).toBe(false);

    const invalidCoordinates2 = [[2, 9], [2, 10]];
    expect(board.doCoordinatesExist(invalidCoordinates2)).toBe(false);
  });
});

describe("board.getRandomCoordinatesForShip(ship)", () => {
  const board = new Gameboard();

  test("should stop the loop when doCoordinatesExist returns true and return the coordinates", () => {
    const mockShip = { length: 3 };
    const validCoordinates = [[0, 0], [0, 1], [0, 2]];

    jest.spyOn(board, "getShipOrientation");
    jest.spyOn(board, "getStartCoordinate");
    jest.spyOn(board, "calculateCoordinatesShip").mockReturnValueOnce([[10,0]]).mockReturnValueOnce(validCoordinates);
    jest.spyOn(board, "doCoordinatesExist").mockReturnValueOnce(false).mockReturnValueOnce(true);

    const returnedCoordinates = board.getRandomCoordinatesForShip(mockShip);


    expect(returnedCoordinates).toEqual(validCoordinates);

    expect(board.getShipOrientation).toHaveBeenCalledTimes(2);
    expect(board.getStartCoordinate).toHaveBeenCalledTimes(2);
    expect(board.calculateCoordinatesShip).toHaveBeenCalledTimes(2);
    expect(board.doCoordinatesExist).toHaveBeenCalledTimes(2);
  });
});

describe("board.filterCoordinatesOnBoard(adjacentCoordinates)", () => {
  const board = new Gameboard();
  test("should remove coordinates that are not on the board", () => {
    const adjacentCoordinates = [[4, 4], [-1, 3], [4, 10], [10, 10], [8, 8], [0, -1]];

    const expectedValidCoordinates = [[4, 4], [8, 8]];

    const validCoordinates = board.filterCoordinatesOnBoard(adjacentCoordinates);

    expect(validCoordinates).toEqual(expectedValidCoordinates);
  });
});

describe("board.coordinatesValid(randomCoordinates)", () => {
  const board = new Gameboard();
  test("should return true if all adjacent fields are null or undefined", () => {
    const randomCoordinates = [[0, 0], [0, 1]];

    const result = board.coordinatesValid(randomCoordinates);
    expect(result).toBe(true);
  });

  test("should return false if any adjacent field is NOT null or undefined", () => {
    const randomCoordinates = [[4, 4], [4, 5]];
    board.current[3][4] = "ship";

    const result = board.coordinatesValid(randomCoordinates);

    expect(result).toBe(false);
  });
});

describe("board.getRandomValidCoordinates(ship)", () => {
  const board = new Gameboard();
  test("returns valid coordinates for a given ship and board", () => {
    const validCoordinates = [[0, 0], [0, 1], [0, 2]];
    board.getRandomCoordinatesForShip = jest.fn().mockReturnValue(validCoordinates);
    board.coordinatesValid = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);
    
    const returnValue = board.getRandomValidCoordinates("ship");

    expect(returnValue).toEqual(validCoordinates);
    expect(board.coordinatesValid).toHaveBeenCalledTimes(2);
  });
});

describe("board.placeFleetOnBoard(fleet)", () => {
  const board = new Gameboard();
  test("places fleet on board", () => {
    const fleet = [{length: 5}, {length: 3}];

    board.getRandomValidCoordinates = jest.fn().mockReturnValueOnce([0,0]).mockReturnValueOnce([6,8]);
    board.placeShip = jest.fn();

    board.placeFleetOnBoard(fleet);

    expect(board.getRandomValidCoordinates).toHaveBeenCalledTimes(fleet.length);
    expect(board.placeShip).toHaveBeenCalledTimes(fleet.length);


    expect(board.placeShip).toHaveBeenCalledWith([0, 0], fleet[0]);
    expect(board.placeShip).toHaveBeenCalledWith([6, 8], fleet[1]);
  });
});

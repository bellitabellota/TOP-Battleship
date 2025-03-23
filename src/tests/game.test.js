import { Game } from "../modules/game";
import { HumanPlayer, ComputerPlayer } from "../modules/player";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("game.initializePlayer()", () => {
  const game = new Game();

  test("returns a ComputerPlayer when argument is 'Computer'", () => {
    const returnValue = game.initializePlayer("Computer");
    expect(returnValue).toBeInstanceOf(ComputerPlayer);
  });

  test("returns a HumanPlayer when argument is not 'Computer'", () => {
    const returnValue = game.initializePlayer("Human");
    expect(returnValue).toBeInstanceOf(HumanPlayer);
  });
});

describe("game.initializePlayers()", () => {
  const game = new Game();
  const mockInitializePlayer = jest
    .spyOn(game, "initializePlayer")
    .mockReturnValueOnce({ name: "Player1" })
    .mockReturnValueOnce({ name: "Computer" });
  const mockSetInitialCurrentPlayer = jest.spyOn(game, "setInitialCurrentPlayer")  
  game.initializePlayers("Player1", "Computer");

  test("game.initializePlayer() is called twice", () => {
    expect(mockInitializePlayer).toHaveBeenCalledTimes(2);
  });

  test("this.players is updated", () => {
    expect(game.players).toEqual([{ name: "Player1" }, { name: "Computer" }]);
  });

  test("game.setInitialCurrentPlayer() is called once", () => {
    expect(mockSetInitialCurrentPlayer).toHaveBeenCalledTimes(1);
  })
});

describe("game.setInitialCurrentPlayer()", () => {
  const game = new Game();
  game.players = ["Player1", "Player2"];

  test("sets currentPlayer to the player at the given index", () => {
    expect(game.currentPlayer).toBeUndefined();

    game.setInitialCurrentPlayer(0);
    expect(game.currentPlayer).toBe("Player1");

    game.setInitialCurrentPlayer(1);
    expect(game.currentPlayer).toBe("Player2");
  });
});

describe("game.currentOpponent()", () => {
  const game = new Game();
  game.players = ["Player1", "Player2"];
  game.currentPlayer = game.players[0];

  expect(game.currentOpponent()).toBe("Player2");
})

describe("game.switchCurrentPlayer()", () => {
  const game = new Game();
  game.players = ["Player1", "Player2"];
  game.currentPlayer = game.players[0];
  jest.useFakeTimers();
  test ("updates game.currentPlayer", async () => {
    const promise = game.switchCurrentPlayer();
    jest.runAllTimers();
    await promise;
    expect(game.currentPlayer).toBe("Player2");

    const promise2 = game.switchCurrentPlayer();
    jest.runAllTimers();
    await promise2;
    game.switchCurrentPlayer();
    expect(game.currentPlayer).toBe("Player1");
  }) 
})

describe("game.isChoiceValid", () => {
  const game = new Game();

  game.currentOpponent = jest.fn(() => ({
    board: {
      current: [
        [null, "h", null],
        [null, null, "m"],
        [null, null, null],
      ],
    },
  }));

  test("returns true when the currentOpponent's board is null at that index", () =>{
    const coordinate = [1, 1];
    const returnValue = game.isChoiceValid(coordinate);
    expect(returnValue).toBe(true);
  })

  test("returns false when the currentOpponent's board contains a value at that index", () =>{
    const coordinateHit = [0, 1];
    const returnValue = game.isChoiceValid(coordinateHit);
    expect(returnValue).toBe(false);

    const coordinateMissedShot = [1, 2];
    const returnValue2 = game.isChoiceValid(coordinateMissedShot);
    expect(returnValue2).toBe(false);
  })
})

describe("game.isOver()", () => {
  test("returns true if allShipsSunk is true", () => {
    const game = new Game();

    game.currentPlayer = {
      board: {
        allShipsSunk: jest.fn().mockReturnValue(true),
      },
    };

    expect(game.isOver()).toBe(true);
  });

  test("returns false if allShipsSunk is false", () => {
    const game = new Game();
    game.currentPlayer = {
      board: {
        allShipsSunk: jest.fn().mockReturnValue(false),
      },
    };

    expect(game.isOver()).toBe(false);
  });
})

describe("game.getShipOrientation()", () => {
  const game = new Game();
  test("returns 0 for numbers below or equal 4", () => {
    const returnValue = game.getShipOrientation(4);
    expect(returnValue).toBe(0);
  })

  test("returns 1 for numbers greater than 4", () => {
    const returnValue = game.getShipOrientation(5);
    expect(returnValue).toBe(1);
  });
})

describe("game.getStartCoordinate()", () => {
  const game = new Game();
  test("returns an array with 2 numbers", () => {
    const returnValue = game.getStartCoordinate(3, 6);
    expect(Array.isArray(returnValue)).toBe(true);
    expect(returnValue.length).toBe(2);
    expect(typeof returnValue[0]).toBe("number");
    expect(typeof returnValue[1]).toBe("number");
  })
})

describe("game.calculateCoordinatesShip()", () => {
  const game = new Game();
  test("should calculate ship coordinates correctly for horizontal orientation", () => {
    const result = game.calculateCoordinatesShip([0, 0], 4, 1);

    expect(result).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
  });

  test("should calculate ship coordinates correctly for vertical orientation", () => {
    const result = game.calculateCoordinatesShip([1, 1], 3, 0);
    expect(result).toEqual([[1, 1], [2, 1], [3, 1]]);
  });
})

describe("game.doCoordinatesExist(coordinates)", () => {
  const game = new Game();

  test("should return true for valid coordinates", () => {
    const validCoordinates = [[0, 1], [5, 9], [3, 7]];
    expect(game.doCoordinatesExist(validCoordinates)).toBe(true);
  });

  test("should return false for coordinates greater than 9", () => {
    const invalidCoordinates = [[10, 5], [11, 5]];
    expect(game.doCoordinatesExist(invalidCoordinates)).toBe(false);

    const invalidCoordinates2 = [[2, 9], [2, 10]];
    expect(game.doCoordinatesExist(invalidCoordinates2)).toBe(false);
  });
});

describe("game.getRandomCoordinatesForShip(ship)", () => {
  const game = new Game();

  test("should stop the loop when doCoordinatesExist returns true and return the coordinates", () => {
    const mockShip = { length: 3 };
    const validCoordinates = [[0, 0], [0, 1], [0, 2]];

    jest.spyOn(game, "getShipOrientation");
    jest.spyOn(game, "getStartCoordinate");
    jest.spyOn(game, "calculateCoordinatesShip").mockReturnValueOnce([[10,0]]).mockReturnValueOnce(validCoordinates);
    jest.spyOn(game, "doCoordinatesExist").mockReturnValueOnce(false).mockReturnValueOnce(true);

    const returnedCoordinates = game.getRandomCoordinatesForShip(mockShip);


    expect(returnedCoordinates).toEqual(validCoordinates);

    expect(game.getShipOrientation).toHaveBeenCalledTimes(2);
    expect(game.getStartCoordinate).toHaveBeenCalledTimes(2);
    expect(game.calculateCoordinatesShip).toHaveBeenCalledTimes(2);
    expect(game.doCoordinatesExist).toHaveBeenCalledTimes(2);
  });
});
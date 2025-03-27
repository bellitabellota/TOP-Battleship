import { Game } from "../modules/game";
import { HumanPlayer, ComputerPlayer } from "../modules/player";
jest.mock("../modules/player");

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
  const mockInitializePlayer = jest.fn().mockReturnValueOnce({ name: "Player1" }).mockReturnValueOnce({ name: "Computer" });
  game.initializePlayer = mockInitializePlayer;
    
  const mockSetInitialCurrentPlayer = jest.fn();
  game.setInitialCurrentPlayer = mockSetInitialCurrentPlayer;

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

test("game.currentOpponent() returns the opponent player", () => {
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

describe("game.getMoveRequestMessage()", () => {
  const game = new Game();

  test("returns the correct message for a human player", () => {
    game.currentPlayer = { name: "Alice" };
    const result = game.getMoveRequestMessage();
    expect(result).toBe("Alice, it is time to attack your enemy. Click on a field of your choice.");
  });

  test("returns the correct message for the computer player", () => {
    game.currentPlayer = { name: "Computer" };
    const result = game.getMoveRequestMessage();
    expect(result).toBe("The Computer is making his move.");
  });
});

describe("game.getWinMessage()", () => {
  const game = new Game();

  game.currentOpponent = jest.fn(() => ({ name: "Bob" }));

  test("returns the correct win message", () => {
    const result = game.getWinMessage();
    expect(result).toBe("GAME OVER! Bob won the game.");
  });
});

describe("game.currentPlayerIsComputerPlayer()", () => {
  test("should return true when currentPlayer is an instance of ComputerPlayer", () => {
    const game = new Game();
    game.currentPlayer = new ComputerPlayer();
    expect(game.currentPlayerIsComputerPlayer()).toBe(true);
  });

  test("should return false when currentPlayer is not an instance of ComputerPlayer", () => {
    const game = new Game();
    game.currentPlayer = new HumanPlayer();

    expect(game.currentPlayerIsComputerPlayer()).toBe(false);
  });
});

describe("game.isTwoPlayerGame()", () => {
  test("should return true if the second player is a HumanPlayer", () => {
    const game = new Game();
    game.initializePlayers("Player1", "Player2");
    expect(game.isTwoPlayerGame()).toBe(true);
  });

  test("should return false if the second player is a ComputerPlayer", () => {
    const game = new Game();
    game.initializePlayers("Player1", "Computer");
    expect(game.isTwoPlayerGame()).toBe(false);
  });
});

describe("game.getPlacementPromptMessage()", () => {
  const game = new Game();

  test("returns the correct message", () => {
    game.currentPlayer = { name: "Player1" };
    const result = game.getPlacementPromptMessage();
    expect(result).toBe("Player1, click 'Place Fleet' to place your ships and confirm with 'Proceed'.");
  });
});

describe("game.isCurrentPlayer(playerNumber)", () => {
  const game = new Game();

  beforeEach(() => {
    game.players = [new HumanPlayer("Player 1"), new ComputerPlayer("Player 2")];
    game.setInitialCurrentPlayer(0);
  });

  test("returns true when the specified player number matches the current player", () => {
    expect(game.isCurrentPlayer(1)).toBe(true);
  });

  test("returns false when the specified player number does not match the current player", () => {
    expect(game.isCurrentPlayer(2)).toBe(false);
  });
});
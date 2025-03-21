import { Game } from "../modules/game";
import { HumanPlayer, ComputerPlayer } from "../modules/player";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("initializePlayer()", () => {
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

describe("initializePlayers()", () => {
  const game = new Game();
  const mockInitializePlayer = jest
    .spyOn(game, "initializePlayer")
    .mockReturnValueOnce({ name: "Player1" })
    .mockReturnValueOnce({ name: "Computer" });
  game.initializePlayers("Player1", "Computer");

  test("initializePlayer() is called twice", () => {
    expect(mockInitializePlayer).toHaveBeenCalledTimes(2);
  });

  test("this.players is updated", () => {
    expect(game.players).toEqual([{ name: "Player1" }, { name: "Computer" }]);
  });
});

describe("setInitialCurrentPlayer", () => {
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

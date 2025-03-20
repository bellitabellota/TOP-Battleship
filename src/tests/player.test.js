import { Player, HumanPlayer, ComputerPlayer } from "../modules/player.js";
import { Gameboard } from "../modules/gameboard.js";

jest.mock("../modules/gameboard.js");

describe("Player", () => {
  test("object initialization", () => {
    const player = new Player("Test Player");

    expect(Gameboard).toHaveBeenCalled();
    expect(player.board).toBeInstanceOf(Gameboard);
  });
});

describe("HumanPlayer", () => {
  test("object initialization", () => {
    const humanPlayer = new HumanPlayer("Human Test Player");

    expect(Gameboard).toHaveBeenCalled();
    expect(humanPlayer.board).toBeInstanceOf(Gameboard);
  });

  test("inherits from Player", () => {
    const humanPlayer = new HumanPlayer("Human Test Player");
    expect(humanPlayer).toBeInstanceOf(Player);
  });
});

describe("ComputerPlayer", () => {
  test("object initialization", () => {
    const computerPlayer = new ComputerPlayer("Human Test Player");

    expect(Gameboard).toHaveBeenCalled();
    expect(computerPlayer.board).toBeInstanceOf(Gameboard);
  });

  test("inherits from Player", () => {
    const computerPlayer = new ComputerPlayer("Human Test Player");
    expect(computerPlayer).toBeInstanceOf(Player);
  });
});

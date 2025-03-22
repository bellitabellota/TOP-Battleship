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
    const computerPlayer = new ComputerPlayer("Computer Test Player");
    expect(computerPlayer).toBeInstanceOf(Player);
  });
});

describe("computerPlayer.getCoordinateChoice", () => {
  test("should return an array of integers between 0 and 9", () => {
    const computerPlayer = new ComputerPlayer("Computer Test Player");
    for (let i = 0; i < 1000; i++) {
      const returnValue = computerPlayer.getCoordinateChoice();
      const xCoordinate = returnValue[0];
      const yCoordinate = returnValue[1];

      expect(Array.isArray(returnValue)).toBe(true);
      expect(Number.isInteger(xCoordinate)).toBe(true);
      expect(Number.isInteger(yCoordinate)).toBe(true);
      expect(xCoordinate).toBeGreaterThanOrEqual(0);
      expect(xCoordinate).toBeLessThanOrEqual(9);
      expect(yCoordinate).toBeGreaterThanOrEqual(0);
      expect(yCoordinate).toBeLessThanOrEqual(9);
    }
  })
})

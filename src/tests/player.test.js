import { Player, HumanPlayer, ComputerPlayer } from "../modules/player.js";
import { Gameboard } from "../modules/gameboard.js";

jest.mock("../modules/gameboard.js");

/* Player tests */

describe("Player", () => {
  test("object initialization", () => {
    const player = new Player("Test Player");

    expect(Gameboard).toHaveBeenCalled();
    expect(player.board).toBeInstanceOf(Gameboard);
  });
});

/* HumanPlayer tests */

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

/* ComputerPlayer tests */

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


describe("computerPlayer.getCoordinateChoice()", () => {
  jest.useFakeTimers();
  test("should return an array of integers between 0 and 9", async() => {
    const computerPlayer = new ComputerPlayer("Computer Test Player");
    
    for (let i = 0; i < 100; i++) {
      const promise = computerPlayer.getCoordinateChoice();
      jest.runAllTimers();

      const returnValue = await promise;
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

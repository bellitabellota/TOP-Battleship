import { GameController } from "../modules/game-controller";

describe("object initialization", () => {
  test("invokes gameController.initializePlayers()", () => {
    const initializePlayersMock = jest.fn();
    GameController.prototype.initializePlayers = initializePlayersMock;
    const gameController = new GameController("game", "domController");
    expect(gameController.initializePlayers).toHaveBeenCalled();
  })
})

describe("gameController.gameLoop()", () => {
  test("the loop stops when the condition is met", async () => {
    const mockGame = { isOver: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true) };

    const gameController = new GameController(mockGame, "domController");

    gameController.announceWinner = jest.fn();
    gameController.playRound = jest.fn();
        
    await gameController.gameLoop();

    expect(mockGame.isOver).toHaveBeenCalledTimes(3);
    expect(gameController.playRound).toHaveBeenCalledTimes(2);
    expect(gameController.announceWinner).toHaveBeenCalledTimes(1);
  });
})

describe("gameController.getValidCoordinate()", () => {
  test("the loop stops when the condition is met and returns the coordinate", async () => {
    const domControllerMock = { addEventListenersToOpponentBoard: jest.fn() }
    const gameMock = { 
      isChoiceValid: jest.fn(),
      currentOpponent: jest.fn().mockReturnValueOnce({name: "Computer"}),
      players: [{name: "Player1"}, {name: "Computer"}],
      currentPlayer: { getCoordinateChoice: jest.fn().mockResolvedValue([3, 4]) }
    }

    gameMock.isChoiceValid.mockReturnValueOnce(false).mockReturnValueOnce(true)
    const gameController = new GameController(gameMock, domControllerMock);
    const returnValue = await gameController.getValidCoordinate();

    expect(gameMock.currentPlayer.getCoordinateChoice).toHaveBeenCalledTimes(2);
    expect(gameMock.isChoiceValid).toHaveBeenCalledTimes(2);
    expect(returnValue).toEqual([3, 4]);
  });
})





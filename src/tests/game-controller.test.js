import { GameController } from "../modules/game-controller";

describe("object initialization", () => {
  test("invokes gameController.startGame()", () => {
    const startGameMock = jest.fn();
    GameController.prototype.startGame = startGameMock;
    const gameController = new GameController("game", "domController");
    expect(gameController.startGame).toHaveBeenCalled();
  })
})

describe("gameController.startGame()", ()=> {
  const initializePlayersMock = jest.fn();
  const gameMock = { initializePlayers: initializePlayersMock }
  const initializePlayersBoundMock = gameMock.initializePlayers.bind(gameMock);
  jest.spyOn(gameMock.initializePlayers, "bind").mockReturnValueOnce(initializePlayersBoundMock);

  const domControllerMock = { 
    addTwoPlayerEventListener: jest.fn(),
    addPlayWithComputerEventListener: jest.fn(),  
  }
  
  jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn()); //avoids invoking startGame during object initialization
  const gameController = new GameController(gameMock, domControllerMock)
  const playGameBoundMock = gameController.playGame.bind(gameController);
  jest.spyOn(gameController.playGame, "bind").mockReturnValueOnce(playGameBoundMock);
  gameController.startGame();
  
  test("it sends initializePlayers and playGame to domController.addTwoPlayerEventListener()", () => {
    expect(gameController.domController.addTwoPlayerEventListener).toHaveBeenCalledWith(initializePlayersBoundMock, playGameBoundMock);
  })

  test("it sends initializePlayers and playGame to domController.addPlayWithComputerEventListener()", () => {
    expect(gameController.domController.addPlayWithComputerEventListener).toHaveBeenCalledWith(initializePlayersBoundMock, playGameBoundMock);
  })
})

describe("gameController.playGame()", () => {
  const gameMock = {
    isTwoPlayerGame: jest.fn(),
    switchCurrentPlayer: jest.fn(),
    players: [ { name: 'Player1' }, { name: 'Player2' } ]
  };

  const domControllerMock = {
    displayPlayerNames: jest.fn(),
  };
  
  jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
  const gameController = new GameController(gameMock, domControllerMock);
  gameController.displayGameStatus = jest.fn();
  gameController.displayPlacementPrompt = jest.fn();
  gameController.placeFleetForCurrentPlayer = jest.fn();
  gameController.gameLoop = jest.fn();
    
  test("calls 'outgoing' command methods", async () => {
    await gameController.playGame();

    expect(domControllerMock.displayPlayerNames).toHaveBeenCalledWith('Player1', 'Player2');
    expect(gameMock.switchCurrentPlayer).toHaveBeenCalledTimes(2);
    expect(gameMock.isTwoPlayerGame).toHaveBeenCalledTimes(1);
  })
})

describe("game.displayPlacementPrompt()", () => {
  const gameMock = { getPlacementPromptMessage: jest.fn().mockReturnValueOnce("Placement Prompt Message")}
  const domControllerMock = { displayInformationForPlayer: jest.fn() }

  jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
  const gameController = new GameController(gameMock, domControllerMock);
  gameController.displayPlacementPrompt();

  test("calls this.game.getPlacementPromptMessage()", () => {
    expect(gameMock.getPlacementPromptMessage).toHaveBeenCalled();
  })

  test("calls this.domController.displayInformationForPlayer(message)", () => {
    expect(domControllerMock.displayInformationForPlayer).toHaveBeenCalledWith("Placement Prompt Message");
  })
})

describe("game.displayGameStatus()", () => {
  test("calls this.domController.displayCurrentDOMBoard() with the correct parameters for Two Player Game", () => {
    const gameMock = { 
      isTwoPlayerGame: jest.fn(), 
      isCurrentPlayer: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
      players: [
        { board: { current: "mockHumanBoard1" } },
        { board: { current: "mockHumanBoard2" } }
      ]
    }
  
    const domControllerMock = { displayCurrentDOMBoard: jest.fn() }
  
    jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
    const gameController = new GameController(gameMock, domControllerMock);
    gameMock.isTwoPlayerGame.mockReturnValueOnce(true);
    gameController.displayGameStatus();

    expect(domControllerMock.displayCurrentDOMBoard).toHaveBeenCalledWith("mockHumanBoard1", 1, true);
    expect(domControllerMock.displayCurrentDOMBoard).toHaveBeenCalledWith("mockHumanBoard2", 2, false);
  })

  test("calls this.domController.displayCurrentDOMBoard() with the correct parameters for 'Play With Computer' mode'", () => {
    const gameMock = { 
      isTwoPlayerGame: jest.fn(), 
      isCurrentPlayer: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
      players: [
        { board: { current: "mockBoard1Human" } },
        { board: { current: "mockBoard2Computer" } }
      ]
    }
  
    const domControllerMock = { displayCurrentDOMBoard: jest.fn() }
  
    jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
    const gameController = new GameController(gameMock, domControllerMock);

    gameMock.isTwoPlayerGame.mockReturnValueOnce(false);
    gameController.displayGameStatus();

    expect(domControllerMock.displayCurrentDOMBoard).toHaveBeenCalledWith("mockBoard1Human", 1, true);
    expect(domControllerMock.displayCurrentDOMBoard).toHaveBeenCalledWith("mockBoard2Computer", 2, false);
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





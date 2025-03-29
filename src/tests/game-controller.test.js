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

describe("gameController.displayPlacementPrompt()", () => {
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

describe("gameController.displayGameStatus()", () => {
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

describe("gameController.placeFleetForCurrentPlayer()", () => {
  test("calls createFleet(), this.game.currentPlayer.board.placeFleetOnBoard(fleet) and resolve() when currentPlayerIsComputerPlayer", async() => {
    const gameMock = {  
      currentPlayerIsComputerPlayer: jest.fn().mockReturnValueOnce(true),
      currentPlayer: {
        board: {
          placeFleetOnBoard: jest.fn()
        }
      }
    }

    jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
    const gameController = new GameController(gameMock, "domControllerMock");
    const spyCreateFleet =  jest.spyOn(require("../modules/utils/create-fleet.js"), "createFleet").mockReturnValueOnce(["fleet"]);

    let promise = gameController.placeFleetForCurrentPlayer();


    expect(spyCreateFleet).toHaveBeenCalled();
    expect(gameMock.currentPlayer.board.placeFleetOnBoard).toHaveBeenCalledWith(["fleet"]);
    await expect(promise).resolves.toBeUndefined();
  });

  test("this.placeFleetHumanPlayer(resolve) when currentPlayerIsComputerPlayer is false", async() => {
    const gameMock = {  
      currentPlayerIsComputerPlayer: jest.fn().mockReturnValueOnce(false),
      currentPlayer: {
        board: {
          placeFleetOnBoard: jest.fn()
        }
      }
    }

    jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
    const gameController = new GameController(gameMock, "domControllerMock");
    gameController.placeFleetHumanPlayer = jest.fn();

    let promise = gameController.placeFleetForCurrentPlayer();

    expect(gameController.placeFleetHumanPlayer).toHaveBeenCalled();
    // while the following does not unambiguously check that gameController.placeFleetHumanPlayer was invoked with resolve as a parameter, this is at least an approximation
    expect(typeof gameController.placeFleetHumanPlayer.mock.calls[0][0]).toBe("function");
    expect(promise).toBeInstanceOf(Promise);
  });
})

describe("gameController.placeFleetHumanPlayer(resolve)", () => {
  jest.spyOn(require("../modules/utils/create-fleet.js"), "createFleet").mockReturnValueOnce(["fleet"]);

  const removeFleetFromBoardMock = jest.fn();
  const placeFleetOnBoardMock = jest.fn();
  const currentPlayer = {
    board: {
      removeFleetFromBoard: removeFleetFromBoardMock,
      placeFleetOnBoard: placeFleetOnBoardMock
    }
  };

  const gameMock = {
    players: [currentPlayer, "Player2"],  
    currentPlayer: currentPlayer
  }

  const removeFleetFromBoardBoundMock = removeFleetFromBoardMock.bind(gameMock);
  jest.spyOn(gameMock.currentPlayer.board.removeFleetFromBoard, "bind").mockReturnValueOnce(removeFleetFromBoardBoundMock);

  const placeFleetOnBoardBoundMock = placeFleetOnBoardMock.bind(gameMock);
  jest.spyOn(gameMock.currentPlayer.board.placeFleetOnBoard, "bind").mockReturnValueOnce(placeFleetOnBoardBoundMock);

  const domControllerMock = { 
    addPlaceFleetControls: jest.fn(),
    addProceedButtonEventListener: jest.fn(),  
  }

  jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
  const gameController = new GameController(gameMock, domControllerMock)
  const resolveMock = jest.fn();
   
  test("calls this.domController.addPlaceFleetControls with the correct arguments", async () => {
    await gameController.placeFleetHumanPlayer(resolveMock);

    expect(domControllerMock.addPlaceFleetControls.mock.calls[0][0]).toBe(removeFleetFromBoardBoundMock);
    expect(domControllerMock.addPlaceFleetControls.mock.calls[0][1]).toBe(1);
    expect(domControllerMock.addPlaceFleetControls.mock.calls[0][2]).toBe(placeFleetOnBoardBoundMock);
    expect(domControllerMock.addPlaceFleetControls.mock.calls[0][3]).toEqual(["fleet"]);
    expect(domControllerMock.addPlaceFleetControls.mock.calls[0][4]).toBe(gameMock);
  });

  test("calls this.domController.addProceedButtonEventListener()", async () => {
    await gameController.placeFleetHumanPlayer(resolveMock);
    expect(domControllerMock.addProceedButtonEventListener).toHaveBeenCalled();
  });

  test("calls the resolve function it receives as argument", async () => {
    await gameController.placeFleetHumanPlayer(resolveMock);
    expect(resolveMock).toHaveBeenCalled();
  });
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

describe("gameController.announceWinner()", () => {
  const gameMock = { getWinMessage: jest.fn().mockReturnValueOnce("GAME OVER")}
  const domControllerMock = { displayInformationForPlayer: jest.fn() }

  jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
  const gameController = new GameController(gameMock, domControllerMock);
  gameController.announceWinner();

  test("calls this.game.getWinMessage()", () => {
    expect(gameMock.getWinMessage).toHaveBeenCalled();
  })

  test("calls this.domController.displayInformationForPlayer(message)", () => {
    expect(domControllerMock.displayInformationForPlayer).toHaveBeenCalledWith("GAME OVER");
  })
})

describe("gameController.playRound()", () => {
  const gameMock = {
    getMoveRequestMessage: jest.fn(),
    currentOpponent: jest.fn(),
    players: [ { name: 'Player1' }, { board: { receiveAttack: jest.fn()} } ],
    isTwoPlayerGame: jest.fn(),
    switchCurrentPlayer: jest.fn()
  };

  gameMock.getMoveRequestMessage.mockReturnValueOnce("Next");
  gameMock.currentOpponent.mockReturnValueOnce(gameMock.players[1]);
  gameMock.isTwoPlayerGame.mockReturnValueOnce(true);

  const domControllerMock = {
    displayInformationForPlayer: jest.fn(),
    displaySwitchScreen: jest.fn()
  };
  
  jest.spyOn(GameController.prototype, "startGame").mockImplementationOnce(jest.fn());
  const gameController = new GameController(gameMock, domControllerMock);
  gameController.displayGameStatus = jest.fn();
  gameController.getValidCoordinate = jest.fn().mockReturnValueOnce([3, 4]);
  test("calls 'outgoing' command methods with correct arguments if applicable", async() => {
    await gameController.playRound();

 

    expect(gameMock.getMoveRequestMessage).toHaveBeenCalled();
    expect(domControllerMock.displayInformationForPlayer).toHaveBeenCalledWith("Next");
    expect(gameMock.currentOpponent).toHaveBeenCalled();
    expect(gameMock.players[1].board.receiveAttack).toHaveBeenCalledWith([3, 4]);
    expect(gameMock.isTwoPlayerGame).toHaveBeenCalled();
    expect(domControllerMock.displaySwitchScreen).toHaveBeenCalled();
    expect(gameMock.switchCurrentPlayer).toHaveBeenCalled();
  })
})


describe("gameController.getValidCoordinate()", () => {
  test("'outgoing' command methods are called, the loop stops when the condition is met and it returns the coordinate", async () => {
    const domControllerMock = { addEventListenersToOpponentBoard: jest.fn() }
    jest.spyOn(domControllerMock.addEventListenersToOpponentBoard, "bind").mockReturnValue(domControllerMock.addEventListenersToOpponentBoard);

    const gameMock = { 
      isChoiceValid: jest.fn(),
      currentOpponent: jest.fn().mockReturnValue({name: "Computer"}),
      players: [{name: "Player1"}, {name: "Computer"}],
      currentPlayer: { getCoordinateChoice: jest.fn().mockReturnValue([3, 4]) }
    }

    gameMock.isChoiceValid.mockReturnValueOnce(false).mockReturnValueOnce(true)
    const gameController = new GameController(gameMock, domControllerMock);
    const returnValue = await gameController.getValidCoordinate();

    expect(gameMock.currentPlayer.getCoordinateChoice).toHaveBeenNthCalledWith(1, domControllerMock.addEventListenersToOpponentBoard, 2);
    expect(gameMock.currentPlayer.getCoordinateChoice).toHaveBeenNthCalledWith(2, domControllerMock.addEventListenersToOpponentBoard, 2);

    expect(gameMock.isChoiceValid).toHaveBeenNthCalledWith(1, [3, 4]);
    expect(gameMock.isChoiceValid).toHaveBeenNthCalledWith(2, [3, 4]);

    expect(returnValue).toEqual([3, 4]);
  });
})





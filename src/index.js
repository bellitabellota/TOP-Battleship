import "./styles.css";
import { Game } from "./modules/game.js";
import { DOMController } from "./modules/dom-controller.js";

const game = new Game();
game.initializePlayers("Player1", "Computer");
game.setInitialCurrentPlayer(0);
game.placeShips();

const dom = new DOMController(game);
dom.displayPlayerNames();
dom.displayCurrentPlayerBoard();
dom.displayCurrentOpponentBoard();

console.log(game.currentPlayer.board.current);
console.log(game.currentOpponent().board.current);

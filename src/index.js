import "./styles.css";
import { Game } from "./modules/game.js";
import { DOMController } from "./modules/dom-controller.js";
import { GameController } from "./modules/game-controller.js";
import { Ship } from "./modules/ship.js";

const game = new Game();
const domController = new DOMController(game);
const gameController = new GameController(game, domController);


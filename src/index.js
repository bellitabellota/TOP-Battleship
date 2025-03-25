import "./styles.css";
import { Game } from "./modules/game.js";
import { DOMController } from "./modules/dom-controller.js";
import { GameController } from "./modules/game-controller.js";

const game = new Game();
const domController = new DOMController();
const gameController = new GameController(game, domController);


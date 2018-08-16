import Player from "./player";
import Level from "./level";
import Render from "./render";
import Tile from "./tile";
import Line from "./line";
import Vector2 from "./vector2";

const TILE_SIZE = 1;
// TLC - top left corner, TL - top line, TRC - top right corner, LL - left line, RL - right line, BLC - bottom left corner, BL - bottom line, BRC - bottom right corner
const PLAYER_MARK = "*";
const MAP = [
	["TLC", "TL", "TL", "TL", "TRC"],
	["LL", "", "", "", "RL"],
	["LL", "", PLAYER_MARK, "", "RL"],
	["LL", "", "", "", "RL"],
	["BLC", "BL", "BL", "BL", "BRC"]
];

export default class Game {
	constructor() {
		this._player = this._getPlayer();
		this._level = this._getLevel();
		this._render = new Render(800, 600);
		document.getElementById("container").appendChild(this._render.container);
	}

	_getPlayer() {
		let player = new Player();
		let pos = null;

		MAP.forEach((line, y) => {
			let mainLoop = true;

			line.forEach((i, x) => {
				if (i == PLAYER_MARK) {
					pos = new Vector2(x, y);
					mainLoop = false;
				}
				else return true;
			});

			return mainLoop;
		});
		player.setPosition(pos || new Vector2());

		return player;
	}

	_getLevel() {
		let h = MAP.length;
		let items = [];

		for (let y = 0; y < h; y++) {
			items.push(MAP[y].map((code, x) => {
				let tile = new Tile(x, y, TILE_SIZE, TILE_SIZE);
				let lines = [];

				switch (code) {
					case "TLC":
						lines.push(new Line(0, 0, TILE_SIZE, 0));
						lines.push(new Line(0, 0, 0, TILE_SIZE));
						break;

					case "TL":
						lines.push(new Line(x, 0, x + TILE_SIZE, 0));
						break;

					case "TRC":
						lines.push(new Line(x, 0, x + TILE_SIZE, 0));
						lines.push(new Line(x + TILE_SIZE, 0, x + TILE_SIZE, TILE_SIZE));
						break;

					case "LL":
						lines.push(new Line(0, y, 0, y + TILE_SIZE));
						break;

					case "RL":
						lines.push(new Line(x + TILE_SIZE, y, x + TILE_SIZE, y + TILE_SIZE));
						break;

					case "BLC":
						lines.push(new Line(0, y, 0, y + TILE_SIZE));
						lines.push(new Line(0, y + TILE_SIZE, TILE_SIZE, y + TILE_SIZE));
						break;

					case "BL":
						lines.push(new Line(x, y + TILE_SIZE, x + TILE_SIZE, y + TILE_SIZE));
						break;

					case "BRC":
						lines.push(new Line(x, y + TILE_SIZE, x + TILE_SIZE, y + TILE_SIZE));
						lines.push(new Line(x + TILE_SIZE, y, x + TILE_SIZE, y + TILE_SIZE));
						break;
				}

				if (lines.length) {
					lines.forEach(l => tile.addItem(l));
				}

				return tile;
			}));
		}

		return new Level(items);
	}
}

import Player from "./player";
import Level from "./level";
import Render from "./render";
import Tile from "./tile";
import * as Material from "./material";
import Line from "./line";

export default class Game {
	constructor() {
		this._player = this._getPlayer();
		this._level = this._getLevel();
		this._render = new Render(800, 600);
		document.getElementById("container").appendChild(this._render.container);

		// loop
		let midAngle = this._player.yaw;
		let fromAngle = midAngle - this._player.fovHalf;
		let toAngle = midAngle + this._player.fovHalf;

		let r1 = this._player.generateRay(fromAngle);
		let r2 = this._player.generateRay(midAngle);
		let r3 = this._player.generateRay(toAngle);

		//this._level.getIntersection(this._player.generateRay(320));
		console.log(this._level.xyz(this._player.generateRay(0), new Line(0, 0, 4, 0)));
		console.log(this._level.xyz(this._player.generateRay(40), new Line(0, 0, 4, 0)));
		console.log(this._level.xyz(this._player.generateRay(-40), new Line(0, 0, 4, 0)));
		console.log(this._level.xyz(this._player.generateRay(-10), new Line(0, 0, 4, 0)));
	}

	_getPlayer() {
		let player = new Player();
		player.setPosition(2.5, 2.5);

		return player;
	}

	_getLevel() {
		let rawItems = [
			[1, 1, 1, 1, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 1, 1, 1, 1]
		];

		let h = rawItems.length;
		let items = [];

		for (let y = 0; y < h; y++) {
			items.push(rawItems[y].map((i, x) => {
				let material = null;

				switch (i) {
					case 0:
						material = Material.EMPTY
						break;

					case 1:
						material = Material.WALL;
						break;
				}

				return new Tile(material, x, y);
			}));
		}

		return new Level(items);
	}
}

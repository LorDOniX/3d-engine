import * as myMath from "./math";
import * as Material from "./material";

export default class Level {
	// items - pole poli, [y0: [x0, x1], y1: [x0, y1]]
	constructor(items) {
		items = Array.isArray(items) && items.length && Array.isArray(items[0]) ? items : [[]];

		this._items = items;
		this._width = items[0].length;
		this._height = items.length;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	getTile(x, y) {
		if (typeof x === "number" && typeof y === "number" && x >= 0 && y >= 0 && x < this._width && y < this._height) {
			return this._items[y][x];
		}
		else return null;
	}

	getIntersection(ray) {
		let items = [];
		let rom = [];

		this._items.forEach(line => {
			let lm = [];

			line.forEach(tile => {
				let test = myMath.raySquareIntersection(ray, tile.aabb);

				if (test) {
					myMath.raySquareIntersection(ray, tile.aabb);
					let dist = ray.origin.distance(tile.center);

					items.push({
						x: tile.position.x,
						y: tile.position.y,
						tile,
						dist,
						isWall: tile.type == Material.WALL
					});

					lm.push(parseFloat(dist.toFixed(2)));
				}
				else {
					lm.push(0);
				}
			});

			rom.push(lm);
		});

		console.log(items);
		console.log(rom);
	}

	xyz(ray, line) {
		return myMath.rayLineIntersection(ray, line);
	}
}

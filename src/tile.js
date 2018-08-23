import Vector2 from "./vector2";
import Line from "./line";
import Params from "./params";

export default class Tile {
	constructor(position, width = 1, height = 1) {
		this._position = position;
		this._width = width;
		this._height = height;
		this._center = null;
		this._aabb = null;
		this._walls = [];

		this._update();
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get center() {
		return this._center;
	}

	get aabb() {
		return this._aabb;
	}

	get position() {
		return this._position;
	}

	get walls() {
		return this._walls;
	}

	get hasWalls() {
		return (this._walls.length > 0);
	}

	createWalls(x, y, lineMaterial) {
		this._walls.push(new Line(new Vector2(x, y), new Vector2(x + this._width, y), lineMaterial));
		this._walls.push(new Line(new Vector2(x + this._width, y), new Vector2(x + this._width, y + this._height), lineMaterial));
		this._walls.push(new Line(new Vector2(x + this._width, y + this._height), new Vector2(x, y + this._height), lineMaterial));
		this._walls.push(new Line(new Vector2(x, y + this._height), new Vector2(x, y), lineMaterial));
	}

	_update() {
		this._center = new Vector2(this._position.x + this._width * 0.5, this._position.y + this._height * 0.5);

		this._aabb = {
			lb: new Vector2(this._position.x, this._position.y + this._height),
			rt: new Vector2(this._position.x + this._width, this._position.y)
		};
	}
}

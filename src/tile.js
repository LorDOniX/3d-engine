import Vector2 from "./vector2";
import Line from "./line";
import Params from "./params";

export default class Tile {
	constructor(x, y, width = 1, height = 1) {
		this._width = width;
		this._height = height;
		this._position = new Vector2(x, y);
		this._center = null;
		this._aabb = null;
		this._wall = [];
		this._material = Params.MATERIAL.EMPTY;

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

	get wall() {
		return this._wall;
	}

	get material() {
		return this._material;
	}

	createWall(x, y) {
		this._wall.push(new Line(x, y, x + this._width, y));
		this._wall.push(new Line(x + this._width, y, x + this._width, y + this._height));
		this._wall.push(new Line(x + this._width, y + this._height, x, y + this._height));
		this._wall.push(new Line(x, y + this._height, x, y));
	}

	setMaterial(material) {
		this._material = material;
	}

	_update() {
		this._center = new Vector2(this._position.x + this._width * 0.5, this._position.y + this._height * 0.5);

		this._aabb = {
			lb: new Vector2(this._position.x, this._position.y + this._height),
			rt: new Vector2(this._position.x + this._width, this._position.y)
		};
	}
}

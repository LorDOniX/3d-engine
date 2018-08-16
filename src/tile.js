import Vector2 from "./vector2";

export default class Tile {
	constructor(x, y, width = 1, height = 1) {
		this._width = width;
		this._height = height;
		this._position = new Vector2(x, y);
		this._center = null;
		this._aabb = null;
		this._items = [];

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

	get items() {
		return this._items;
	}

	// type - Line
	addItem(item) {
		this._items.push(item);
	}

	_update() {
		this._center = new Vector2(this._position.x + this._width * 0.5, this._position.y + this._height * 0.5);

		this._aabb = {
			lb: new Vector2(this._position.x, this._position.y + this._height),
			rt: new Vector2(this._position.x + this._width, this._position.y)
		};
	}
}

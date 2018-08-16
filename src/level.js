export default class Level {
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
}

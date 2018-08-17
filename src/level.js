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

	getTile(pos) {
		if (typeof pos.x === "number" && typeof pos.y === "number" && pos.x >= 0 && pos.y >= 0 && pos.x < this._width && pos.y < this._height) {
			return this._items[pos.y][pos.x];
		}
		else return null;
	}
}

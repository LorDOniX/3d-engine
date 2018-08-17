import * as $dom from "./onix/dom";

const WHITE = "#fff";
const BLACK = "#000";

export default class Render {
	constructor(width = 320, height = 160) {
		this._width = width;
		this._height = height;
		this._el = this._create();
		this._ctx = this._el.getContext("2d");

		this.clear();
	}

	get container() {
		return this._el;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	// metody pro vykreslovani
	clear() {
		this._ctx.fillStyle = WHITE;
		this._ctx.fillRect(0, 0, this._width, this._height);
	}

	rectangle(x, y, width, height, color) {
		this._ctx.fillStyle = color || BLACK;
		this._ctx.fillRect(x, y, width, height);
	}

	_create() {
		let canvas = $dom.create({
			el: "canvas"
		});
		canvas.width = this._width;
		canvas.height = this._height;

		return canvas;
	}
}

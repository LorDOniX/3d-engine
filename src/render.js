import * as $dom from "./onix/dom";

export default class Render {
	constructor(width = 320, height = 160) {
		this._width = width;
		this._height = height;
		this._el = this._create();
		this._ctx = this._el.getContext("2d");
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

	_create() {
		let canvas = $dom.create({
			el: "canvas"
		});
		canvas.width = this._width;
		canvas.height = this._height;

		return canvas;
	}
}

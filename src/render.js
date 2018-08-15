import * as $dom from "./onix/dom";
import * as myMath from "./math";
import Ray from "./ray";
import Vector2 from "./vector2";

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

	_t() {
		let o = myMath.raySquareIntersection(new Ray(new Vector2(0.5, 0.5), new Vector2(0, 1)), {
			lb: { x: 0, y: 3 },
			rt: { x: 1, y: 4 }
		});
		console.log(o);
	}
}

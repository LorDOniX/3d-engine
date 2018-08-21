import * as $dom from "./onix/dom";
import Params from "./params";

/**
 * drawImage() - obrazek, textura obrazek x, textura obrazek y, textura sirka, textura vyska; vykresleni souradnice x, vykresleni souradnice y, vykresleni sirka a vyska
 */
export default class Render {
	constructor(optsArg) {
		this._opts = Object.assign({
			width: 320,
			height: 160,
			noShadow: false
		}, optsArg);
		this._textures = {};
		this._el = this._create();
		this._ctx = this._el.getContext("2d");

		this.clear();
	}

	get container() {
		return this._el;
	}

	get width() {
		return this._opts.width;
	}

	get height() {
		return this._opts.height;
	}

	async load() {
		this._textures.walls = await this._getImage(Params.WALLS_IMG);
	}

	// metody pro vykreslovani
	clear() {
		let middleY = this._opts.height * 0.5;

		this._ctx.globalAlpha = 1;
		this._ctx.fillStyle = Params.COLORS.CELLAR;
		this._ctx.fillRect(0, 0, this._opts.width, middleY);
		this._ctx.fillStyle = Params.COLORS.FLOOR;
		this._ctx.fillRect(0, middleY, this._opts.width, this._opts.height);
	}

	drawRectangle(x, y, width, height, color) {
		this._ctx.globalAlpha = 1;
		this._ctx.fillStyle = color || Params.COLORS.BLACK;
		this._ctx.fillRect(x, y, width, height);
	}

	drawWall(columnData) {
		// render zdi
		this._ctx.globalAlpha = 1;
		this._ctx.drawImage(this._textures.walls, columnData.tx, columnData.ty, Params.DRAW_WIDTH, Params.TEXTURE_SIZE, columnData.x, columnData.top, Params.DRAW_WIDTH, columnData.height);

		// svetelnost zdi
		if (!this._opts.noShadow) {
			this._ctx.fillStyle = Params.COLORS.BLACK;
			this._ctx.globalAlpha = columnData.lightRatio;
			this._ctx.fillRect(columnData.x, columnData.top, Params.DRAW_WIDTH, columnData.height);
		}
	}

	_create() {
		let canvas = $dom.create({
			el: "canvas"
		});
		canvas.width = this._opts.width;
		canvas.height = this._opts.height;

		return canvas;
	}

	_getImage(src) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = e => {
				resolve(img);
			};
			img.onerror = e => {
				reject(e);
			};
			img.src = src;
		});
	}
}

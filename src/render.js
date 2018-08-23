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

	get ctx() {
		return this._ctx;
	}

	get textures() {
		return this._textures;
	}

	async load() {
		this._textures.main = await this._getImage(Params.TEXTURES.MAIN);
		this._textures.gun = await this._getImage(Params.TEXTURES.GUN);
	}

	// metody pro vykreslovani
	clear() {
		let middleY = this._opts.height * 0.5;

		this._ctx.fillStyle = Params.COLORS.CELLAR;
		this._ctx.fillRect(0, 0, this._opts.width, middleY);
		this._ctx.fillStyle = Params.COLORS.FLOOR;
		this._ctx.fillRect(0, middleY, this._opts.width, this._opts.height);
	}

	drawTexture(x, data) {
		// render textury
		let tx = data.material.x + Math.round(data.perc * (Params.TEXTURE_SIZE - 1));
		let ty = data.material.y;

		for (let i = 0; i < Params.DRAW_WIDTH; i++) {
			// po 1px
			this._ctx.drawImage(this._textures.main, tx, ty, 1, Params.TEXTURE_SIZE, x + i, data.top, 1, data.height);
		}
	}

	drawWall(x, wallData) {
		this.drawTexture(x, wallData);

		// svetelnost zdi
		if (!this._opts.noShadow) {
			this._ctx.fillStyle = Params.COLORS.BLACK;
			this._ctx.globalAlpha = this._countLightning(wallData.distance);
			this._ctx.fillRect(x, wallData.top, Params.DRAW_WIDTH, wallData.height);
			this._ctx.globalAlpha = 1;
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

	_countLightning(distance) {
		let lightning;
		let len = Params.LIGHT_INTENSITY.length - 1;

		Params.LIGHT_INTENSITY.every((intData, ind) => {
			if ((intData.from <= distance && intData.to > distance) || ind == len) {
				lightning = intData.value;
			}
			else return true;
		});

		return (1 - lightning);
	}
}

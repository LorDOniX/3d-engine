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
		this._gunData = {
			start: 0,
			now: 0,
			end: 0,
			// 6 obrazku, 5 kroku
			steps: 6,
			duration: 550 // [s]
		};

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

	drawRectangle(x, y, width, height, color) {
		this._ctx.fillStyle = color || Params.COLORS.BLACK;
		this._ctx.fillRect(x, y, width, height);
	}

	drawWall(columnData) {
		// render zdi
		for (let i = 0; i < Params.DRAW_WIDTH; i++) {
			// po 1px
			this._ctx.drawImage(this._textures.main, columnData.tx, columnData.ty, 1, Params.TEXTURE_SIZE, columnData.x + i, columnData.top, 1, columnData.height);
		}

		// svetelnost zdi
		if (!this._opts.noShadow) {
			this._ctx.fillStyle = Params.COLORS.BLACK;
			this._ctx.globalAlpha = columnData.lightRatio;
			this._ctx.fillRect(columnData.x, columnData.top, Params.DRAW_WIDTH, columnData.height);
			this._ctx.globalAlpha = 1;
		}
	}

	drawSprite(columnData, sprite) {
		let material;

		switch (sprite.type) {
			case Params.SPRITES.LIGHT:
				material = Params.MATERIAL.LIGHT;
				break;
		}
		
		let tx = material.x;
		let ty = material.y;

		for (let i = 0; i < Params.DRAW_WIDTH; i++) {
			// po 1px
			this._ctx.drawImage(this._textures.main, columnData.tx, columnData.ty, 1, Params.TEXTURE_SIZE, columnData.x + i, columnData.top, 1, columnData.height);
		}
	}

	drawGun(seconds) {
		let width = this._opts.width * 0.25;
		let height = width;
		let x = this._opts.width * 7 / 8 - width;
		let y = this._opts.height - height;
		let tx = 0;

		if (this._gunData.start) {
			this._gunData.now += seconds;

			if (this._gunData.now > this._gunData.end) {
				this._gunData.start = 0;
				this._gunData.now = this._gunData.end;
			}

			let stepSeconds = this._gunData.duration / this._gunData.steps;
			let diff = this._gunData.now - this._gunData.start;

			tx = diff / stepSeconds >>> 0;
		}

		// zbran
		this._ctx.drawImage(this._textures.gun, tx * Params.TEXTURE_SIZE, 0, Params.TEXTURE_SIZE, Params.TEXTURE_SIZE, x, y, width, height);
	}

	drawCrosshair() {
		let x = Math.round(this._opts.width * 0.5);
		let y = Math.round(this._opts.height * 0.5);
		let len = Math.round(this._opts.width * 0.02);
		let gap = Math.round(this._opts.width * 0.008);

		this._ctx.fillStyle = Params.COLORS.WHITE;
		this._ctx.fillRect(x - gap - len, y, len, Params.CROSSHAIR_WIDTH);
		this._ctx.fillRect(x + gap, y, len, Params.CROSSHAIR_WIDTH);
		this._ctx.fillRect(x, y - gap - len, Params.CROSSHAIR_WIDTH, len);
		this._ctx.fillRect(x, y + gap, Params.CROSSHAIR_WIDTH, len);
		this._ctx.fillRect(x, y, Params.CROSSHAIR_WIDTH, Params.CROSSHAIR_WIDTH);
	}

	shoot() {
		if (this._gunData.start) return;

		this._gunData.start = Date.now();
		this._gunData.now = this._gunData.start;
		this._gunData.end = this._gunData.start + this._gunData.duration;
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

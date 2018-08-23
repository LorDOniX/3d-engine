import Params from "./params";

export default class Gun {
	constructor(render) {
		this._render = render;
		this._start = 0;
		this._now = 0;
		this._end = 0;
	}

	shoot() {
		if (this._start) return;

		this._start = Date.now();
		this._now = this._start;
		this._end = this._start + Params.GUN.DURATION;
	}

	draw(seconds) {
		this._drawGun(seconds);
		this._drawCrosshair();
	}

	_drawGun(seconds) {
		let width = this._render.width * 0.25;
		let height = width;
		let x = this._render.width * 7 / 8 - width;
		let y = this._render.height - height;
		let tx = 0;

		if (this._start) {
			this._now += seconds;

			if (this._now > this._end) {
				this._start = 0;
				this._now = this._end;
			}

			let stepSeconds = Params.GUN.DURATION / Params.GUN.STEPS;
			let diff = this._now - this._start;

			// cele cislo
			tx = diff / stepSeconds >>> 0;
		}

		// zbran
		this._render.ctx.drawImage(this._render.textures.gun, tx * Params.TEXTURE_SIZE, 0, Params.TEXTURE_SIZE, Params.TEXTURE_SIZE, x, y, width, height);
	}

	_drawCrosshair() {
		let x = Math.round(this._render.width * 0.5);
		let y = Math.round(this._render.height * 0.5);
		let len = Math.round(this._render.width * 0.02);
		let gap = Math.round(this._render.width * 0.008);

		this._render.ctx.fillStyle = Params.COLORS.WHITE;
		this._render.ctx.fillRect(x - gap - len, y, len, Params.CROSSHAIR_WIDTH);
		this._render.ctx.fillRect(x + gap, y, len, Params.CROSSHAIR_WIDTH);
		this._render.ctx.fillRect(x, y - gap - len, Params.CROSSHAIR_WIDTH, len);
		this._render.ctx.fillRect(x, y + gap, Params.CROSSHAIR_WIDTH, len);
		this._render.ctx.fillRect(x, y, Params.CROSSHAIR_WIDTH, Params.CROSSHAIR_WIDTH);
	}
}

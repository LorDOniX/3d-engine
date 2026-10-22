import Params from "./params";
import type Render from "./render";

export default class Gun {
	// ms od vystrelu, -1 = neaktivni
	private _elapsed = -1;

	constructor(private _render: Render) {}

	get isShooting(): boolean {
		return this._elapsed >= 0;
	}

	// aktualni obrazek animace
	get frame(): number {
		if (!this.isShooting) return 0;

		const stepDuration = Params.GUN.DURATION / Params.GUN.STEPS;

		return Math.min(Math.floor(this._elapsed / stepDuration), Params.GUN.STEPS - 1);
	}

	shoot(): void {
		if (this.isShooting) return;

		this._elapsed = 0;
	}

	update(seconds: number): void {
		if (!this.isShooting) return;

		this._elapsed += seconds * 1000;

		if (this._elapsed >= Params.GUN.DURATION) {
			this._elapsed = -1;
		}
	}

	draw(): void {
		this._drawGun();
		this._drawCrosshair();
	}

	private _drawGun(): void {
		const width = this._render.width * 0.25;
		const height = width;
		const x = this._render.width * 7 / 8 - width;
		const y = this._render.height - height;

		this._render.ctx.drawImage(this._render.textures.gun, this.frame * Params.TEXTURE_SIZE, 0, Params.TEXTURE_SIZE, Params.TEXTURE_SIZE, x, y, width, height);
	}

	private _drawCrosshair(): void {
		const ctx = this._render.ctx;
		const x = Math.round(this._render.width * 0.5);
		const y = Math.round(this._render.height * 0.5);
		const len = Math.round(this._render.width * 0.02);
		const gap = Math.round(this._render.width * 0.008);

		ctx.fillStyle = Params.COLORS.WHITE;
		ctx.fillRect(x - gap - len, y, len, Params.CROSSHAIR_WIDTH);
		ctx.fillRect(x + gap, y, len, Params.CROSSHAIR_WIDTH);
		ctx.fillRect(x, y - gap - len, Params.CROSSHAIR_WIDTH, len);
		ctx.fillRect(x, y + gap, Params.CROSSHAIR_WIDTH, len);
		ctx.fillRect(x, y, Params.CROSSHAIR_WIDTH, Params.CROSSHAIR_WIDTH);
	}
}

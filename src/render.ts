import Params, { type Material } from "./params";

export interface RenderOptions {
	width: number;
	height: number;
	noShadow: boolean;
}

export interface Column {
	// horni hrana a vyska na obrazovce
	top: number;
	height: number;
	material: Material | null;
	// pozice v texture, 0 - 1
	perc: number;
	// vzdalenost pro svetelnost
	distance: number;
}

export interface Texture {
	width: number;
	height: number;
	// predpocitane ztmavene varianty podle intenzity svetla; pruhledny pixel = 0
	shades: Map<number, Uint32Array>;
}

export interface Textures {
	main: Texture;
	gun: HTMLImageElement;
}

// prevod "#rgb" / "#rrggbb" na pixel ve stejnem poradi bajtu jako ImageData
export function packColor(hex: string): number {
	let value = hex.replace("#", "");

	if (value.length === 3) {
		value = value.split("").map(ch => ch + ch).join("");
	}

	const num = parseInt(value, 16);
	const bytes = new Uint8ClampedArray([num >> 16 & 0xff, num >> 8 & 0xff, num & 0xff, 0xff]);

	return new Uint32Array(bytes.buffer)[0];
}

// ztmaveni RGBA dat; pruhledne pixely jsou 0
export function shadeTexture(data: Uint8ClampedArray, shade: number): Uint32Array {
	const out = new Uint8ClampedArray(data.length);

	for (let i = 0; i < data.length; i += 4) {
		if (data[i + 3] === 0) continue;

		out[i] = data[i] * shade;
		out[i + 1] = data[i + 1] * shade;
		out[i + 2] = data[i + 2] * shade;
		out[i + 3] = 255;
	}

	return new Uint32Array(out.buffer);
}

export function lightIntensity(distance: number): number {
	let value = 1;

	for (const item of Params.LIGHT_INTENSITY) {
		if (item.from <= distance) {
			value = item.value;
		}
	}

	return value;
}

export default class Render {
	private _opts: RenderOptions;
	private _textures: Textures | null = null;
	private _el: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private _frame: ImageData;
	private _frame32: Uint32Array;
	private _cellar = packColor(Params.COLORS.CELLAR);
	private _floor = packColor(Params.COLORS.FLOOR);

	constructor(optsArg: Partial<RenderOptions> = {}) {
		this._opts = {
			width: 320,
			height: 160,
			noShadow: false,
			...optsArg
		};
		this._el = document.createElement("canvas");
		this._el.width = this._opts.width;
		this._el.height = this._opts.height;

		const ctx = this._el.getContext("2d");

		if (!ctx) {
			throw new Error("Canvas 2D context is not supported");
		}

		this._ctx = ctx;
		this._frame = ctx.createImageData(this._opts.width, this._opts.height);
		this._frame32 = new Uint32Array(this._frame.data.buffer);
	}

	get container(): HTMLCanvasElement {
		return this._el;
	}

	get width(): number {
		return this._opts.width;
	}

	get height(): number {
		return this._opts.height;
	}

	get ctx(): CanvasRenderingContext2D {
		return this._ctx;
	}

	get textures(): Textures {
		if (!this._textures) {
			throw new Error("Textures are not loaded, call load() first");
		}

		return this._textures;
	}

	async load(): Promise<void> {
		const [main, gun] = await Promise.all([
			this._loadImage(Params.TEXTURES.MAIN),
			this._loadImage(Params.TEXTURES.GUN)
		]);

		this._textures = {
			main: this._getTexture(main),
			gun
		};
	}

	// strop a podlaha
	clear(): void {
		const half = Math.floor(this._opts.height * 0.5) * this._opts.width;

		this._frame32.fill(this._cellar, 0, half);
		this._frame32.fill(this._floor, half);
	}

	// vertikalni sloupec textury, pruhledne pixely se preskakuji
	drawColumn(x: number, column: Column): void {
		if (!column.material || column.height <= 0) return;

		const tex = this.textures.main;
		const texels = tex.shades.get(this._opts.noShadow ? 1 : lightIntensity(column.distance));

		if (!texels) return;

		const size = Params.TEXTURE_SIZE;
		const frame = this._frame32;
		const width = this._opts.width;
		const tx = column.material.x + Math.round(column.perc * (size - 1));
		const yFrom = Math.max(0, Math.floor(column.top));
		const yTo = Math.min(this._opts.height, Math.ceil(column.top + column.height));
		const xTo = Math.min(width, x + Params.DRAW_WIDTH);
		const texScale = size / column.height;

		for (let y = yFrom; y < yTo; y++) {
			const ty = column.material.y + Math.min(size - 1, Math.max(0, Math.floor((y + 0.5 - column.top) * texScale)));
			const texel = texels[ty * tex.width + tx];

			if (texel === 0) continue;

			for (let px = x; px < xTo; px++) {
				frame[y * width + px] = texel;
			}
		}
	}

	// prenese snimek na canvas
	present(): void {
		this._ctx.putImageData(this._frame, 0, 0);
	}

	private _getTexture(img: HTMLImageElement): Texture {
		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Canvas 2D context is not supported");
		}

		ctx.drawImage(img, 0, 0);

		const data = ctx.getImageData(0, 0, img.width, img.height).data;
		const shades = new Map<number, Uint32Array>();

		[1, ...Params.LIGHT_INTENSITY.map(item => item.value)].forEach(value => {
			if (!shades.has(value)) {
				shades.set(value, shadeTexture(data, value));
			}
		});

		return {
			width: img.width,
			height: img.height,
			shades
		};
	}

	private _loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.addEventListener("load", () => resolve(img), { once: true });
			img.addEventListener("error", () => reject(new Error(`Cannot load image ${src}`)), { once: true });
			img.src = src;
		});
	}
}

import Color from "./color";

export default class Graphics {
	constructor(canvas, camera) {
		this._el = canvas;
		this._ctx = canvas.getContext("2d");
		this._width = camera.width;
		this._height = camera.height;
		this._el.width = this._width;
		this._el.height = this._height

		this.clear();
	}

	clear() {
		this._ctx.fillStyle = Color.white().rgba;
		this._ctx.fillRect(0, 0, this._width, this._height);
	}

	putPixel(x, y, color) {
		let imgData = this._ctx.createImageData(1, 1);
		let d = imgData.data;
		d[0] = color.r;
		d[1] = color.g;
		d[2] = color.b;
		d[3] = color.a;

		this._ctx.putImageData(imgData, x, y);
	}

	putImageData(imgData) {
		this._ctx.putImageData(imgData, 0, 0);
	}

	createImageData(width, height) {
		return this._ctx.createImageData(width, height);
	}
}

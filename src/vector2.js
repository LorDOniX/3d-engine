export default class Vector2 {
	constructor(x = 0, y = 0) {
		this._x = x;
		this._y = y;
	}

	get x() { return this._x; }
	get y() { return this._y; }

	setXY(x = 0, y = 0) {
		this._x = x;
		this._y = y;
	}

	axis(value) {
		switch (value) {
			case 0:
				return this._x;

			case 1:
				return this._y;

			default:
				return null;
		}
	}

	// vybrani master axis, 0 x, 1 y
	masterAxis() {
		return (Math.abs(this._x) > Math.abs(this._y) ? 0 : 1);
	}

	clone() {
		return new Vector2(this._x, this._y);
	}

	norm() {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	}

	distance(v) {
		return Math.sqrt((v.x - this._x) * (v.x - this._x) + (v.y - this._y) * (v.y - this._y));
	}

	normalize() {
		let rn = 1 / this.norm();

		this._x *= rn;
		this._y *= rn;
	}

	isEqual(v) {
		return (this._x == v.x && this._y == v.y);
	}

	/**
	 * Determinant 2x2 [[x1, y1], [x2, y2]]
	 * 
	 * @param  {Vector2} v Druhy vektor
	 * @return {Number}
	 */
	crossProduct(v) {
		return (this._x * v.y - this._y * v.x);
	}

	/**
	 * Skalarni soucet, uhel mezi 2 vektory.
	 * 
	 * @param  {Vector2} v Druhy vektor
	 * @return {Number}
	 */
	dotProduct(v) {
		return (this._x * v.x + this._y * v.y);
	}

	inverted() {
		return new Vector2(1 / this._x, 1 / this._y);
	}

	isEmpty() {
		return (this._x === 0 && this._y === 0);
	}

	// *
	plus() {
		return this._oper("plus", Array.prototype.slice.call(arguments), true);
	}

	minus() {
		return this._oper("minus", Array.prototype.slice.call(arguments), true);
	}

	mul() {
		return this._oper("mul", Array.prototype.slice.call(arguments), true);
	}

	div() {
		return this._oper("div", Array.prototype.slice.call(arguments), true);
	}

	// +=
	plusApply() {
		return this._oper("plus", Array.prototype.slice.call(arguments));
	}

	// -=
	minusApply() {
		return this._oper("minus", Array.prototype.slice.call(arguments));
	}

	// *=
	mulApply() {
		return this._oper("mul", Array.prototype.slice.call(arguments));
	}

	toString() {
		return (`(${this._x.toFixed(5)}, ${this._y.toFixed(5)})`);
	}

	_oper(type, args, create) {
		let x = this._x;
		let y = this._y;

		args.forEach(arg => {
			let isNumber = typeof arg === "number";

			if (!isNumber && !(arg instanceof Vector2)) return;

			switch (type) {
				case "plus":
					x += isNumber ? arg : arg.x;
					y += isNumber ? arg : arg.y;
					break;

				case "minus":
					x -= isNumber ? arg : arg.x;
					y -= isNumber ? arg : arg.y;
					break;

				case "mul":
					x *= isNumber ? arg : arg.x;
					y *= isNumber ? arg : arg.y;
					break;

				case "div":
					x /= isNumber ? arg : arg.x;
					y /= isNumber ? arg : arg.y;
					break;
			}
		});

		if (create) {
			return new Vector2(x, y);
		}
		else {
			this.setXY(x, y);
		}
	}
}

export default class Vector2 {
	constructor(readonly x = 0, readonly y = 0) {}

	plus(v: Vector2): Vector2 {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	minus(v: Vector2): Vector2 {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	mul(scalar: number): Vector2 {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	length(): number {
		return Math.hypot(this.x, this.y);
	}

	distance(v: Vector2): number {
		return Math.hypot(v.x - this.x, v.y - this.y);
	}

	normalized(): Vector2 {
		const len = this.length();

		return (len > 0 ? this.mul(1 / len) : new Vector2());
	}

	/**
	 * Determinant 2x2 [[x1, y1], [x2, y2]]
	 */
	crossProduct(v: Vector2): number {
		return (this.x * v.y - this.y * v.x);
	}

	/**
	 * Skalarni soucin, uhel mezi 2 vektory.
	 */
	dotProduct(v: Vector2): number {
		return (this.x * v.x + this.y * v.y);
	}

	isEqual(v: Vector2): boolean {
		return (this.x === v.x && this.y === v.y);
	}
}

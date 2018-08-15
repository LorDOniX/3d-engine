import Vector3 from "./vector3";
import AABB from "./aabb";

export default class Triangle {
	constructor(p0, p1, p2, color) {
		this._vertices = [
			p0 || new Vector3(),
			p1 || new Vector3(),
			p2 || new Vector3()
		];
		this._bounds = this._getBounds();
		this._area = this._getArea();
		this._color = color;
	}

	get color() {
		return this._color;
	}

	get vertices() {
		return this._vertices;
	}

	bounds() {
		return this._bounds;
	}

	area() {
		return this._area;
	}

	_getBounds() {
		// min vektor
		let minVec = new Vector3(
			Math.min(Math.min(this._vertices[0].x, this._vertices[1].x), this._vertices[2].x),
			Math.min(Math.min(this._vertices[0].y, this._vertices[1].y), this._vertices[2].y),
			Math.min(Math.min(this._vertices[0].z, this._vertices[1].z), this._vertices[2].z)
		);

		// max vektor
		let maxVec = new Vector3(
			Math.max(Math.max(this._vertices[0].x, this._vertices[1].x), this._vertices[2].x),
			Math.max(Math.max(this._vertices[0].y, this._vertices[1].y), this._vertices[2].y),
			Math.max(Math.max(this._vertices[0].z, this._vertices[1].z), this._vertices[2].z)
		);

		return new AABB(minVec, maxVec);
	}

	_getArea() {
		let a = this._vertices[0].minus(this._vertices[1]).norm();
		let b = this._vertices[1].minus(this._vertices[2]).norm();
		let c = this._vertices[2].minus(this._vertices[0]).norm();
		let s = (a + b + c) * 0.5;

		return Math.sqrt(s * (s - a) * (s - b) * (s - c));
	}
}

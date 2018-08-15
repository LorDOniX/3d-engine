import Vector3 from "./vector3";

export default class Ray {
	constructor(origin, direction) {
		this._origin = origin || new Vector3();
		this._direction = direction || new Vector3();
		this._inverted = this._direction.inverted(); // invertovany paprsek
		this._distance = Infinity;
		this._changed = false;
		this._triangle = null;
	}

	get origin() {
		return this._origin;
	}

	get direction() {
		return this._direction;
	}

	get inverted() {
		return this._inverted;
	}

	get changed() {
		return this._changed;
	}

	get triangle() {
		return this._triangle;
	}

	// nastavi distance, ale nova vzdalenost musi byt mensi jak posledni, jinak se nic nestane
	setTarget(distance, triangle) {
		if (distance < this._distance) {
			this._changed = true;
			this._distance = distance;
			this._triangle = triangle;
		}
	}

	// souradnice zasahu
	getTarget() {
		if (this._changed) {
			return (this._origin.plus(this._direction.mul(this._distance)));
		}
		else {
			return null;
		}
	}

	getTriangle() {
		if (this._changed) {
			return this._triangle;
		}
		else {
			return null;
		}
	}
}

import Vector2 from "./vector2";

export default class Ray {
	constructor(origin, direction) {
		this._origin = origin || new Vector2();
		this._direction = direction || new Vector2();
		// invertovany paprsek
		this._inverted = this._direction.inverted();
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
}

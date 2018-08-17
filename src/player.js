import Vector2 from "./vector2";

export default class Player {
	constructor() {
		// smer hodinovych rucicek
		this._yaw = 0;
		this._position = new Vector2();
	}

	set yaw(value) {
		this._yaw = value;
	}

	setPosition(v) {
		this._position = v;
	}

	get yaw() {
		return this._yaw;
	}

	get position() {
		return this._position;
	}
}

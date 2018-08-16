import Ray from "./ray";
import Vector2 from "./vector2";

// def smer pro yaw 0
const DIRECTION = new Vector2(0, 1);

export default class Player {
	constructor(fov = 90) {
		// stepne deg
		this._fov = fov;
		this._fovHalf = fov * 0.5;
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

	get fov() {
		return this._fov;
	}

	get fovHalf() {
		return this._fovHalf;
	}

	get position() {
		return this._position;
	}

	generateRay(angle) {
		let origin = new Vector2(this._position.x, this._position.y);
		let rad = (360 - angle) / 180 * Math.PI;
		let x = DIRECTION.x * Math.cos(rad) - DIRECTION.y * Math.sin(rad);
		let y = DIRECTION.x * Math.sin(rad) + DIRECTION.y * Math.cos(rad);
		let direction = new Vector2(x, -y); // -y = protoze chceme nahoru odecitat, ne pricitat

		return new Ray(origin, direction);
	}
}

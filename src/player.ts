import Vector2 from "./vector2";

export default class Player {
	// smer hodinovych rucicek, 0 = nahoru
	private _yaw = 0;

	constructor(public position = new Vector2()) {}

	// normalizace do intervalu <0, 360)
	set yaw(value: number) {
		this._yaw = ((value % 360) + 360) % 360;
	}

	get yaw(): number {
		return this._yaw;
	}
}

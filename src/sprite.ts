import Params, { type Material } from "./params";
import Vector2 from "./vector2";
import Line from "./line";

export default class Sprite {
	constructor(readonly material: Material | null, readonly center: Vector2) {}

	/**
	 * Billboard - usecka kolma na smer od pozorovatele ke spritu; start je vlevo z pohledu pozorovatele.
	 */
	getLine(viewer: Vector2): Line {
		let dir = this.center.minus(viewer).normalized();

		// pozorovatel stoji primo ve spritu
		if (dir.x === 0 && dir.y === 0) {
			dir = new Vector2(0, -1);
		}

		const left = new Vector2(dir.y, -dir.x).mul(Params.SPRITE_WIDTH * 0.5);

		return new Line(this.center.plus(left), this.center.minus(left), this.material);
	}
}

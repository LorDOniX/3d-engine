import Params from "./params";
import Vector2 from "./vector2";
import Line from "./line";
import * as myMath from "./math";

export default class Sprite {
	constructor(material, center) {
		this._material = material;
		this._center = center;
	}

	get center() {
		return this._center;
	}

	get material() {
		return this._material;
	}

	getLine(angle) {
		let start = myMath.moveVector(new Vector2(-Params.SPRITE_WIDTH * 0.5, 0), angle);
		let end = myMath.moveVector(new Vector2(Params.SPRITE_WIDTH * 0.5, 0), angle);
		let startPos = this._center.plus(start);
		let endPos = this._center.plus(end);

		return new Line(startPos, endPos, this._material);
	}
}

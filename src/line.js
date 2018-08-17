import Vector2 from "./vector2";

export default class Line {
	constructor(x1, y1, x2, y2) {
		this._start = new Vector2(x1, y1);
		this._end = new Vector2(x2, y2);
		this._direction = this._end.minus(this._start);
		this._distance = this._start.distance(this._end);
	}

	get start() {
		return this._start;
	}

	get end() {
		return this._end;
	}

	get direction() {
		return this._direction;
	}

	get length() {
		return this._distance;
	}
}

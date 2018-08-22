import Vector2 from "./vector2";

export default class Line {
	constructor(start, end) {
		this._start = start;
		this._end = end;
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

	getPerc(hitPoint) {
		return Math.min(this._start.distance(hitPoint) / this._distance, 1);
	}
}

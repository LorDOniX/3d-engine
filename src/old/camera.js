import Vector3 from "./vector3";
import Matrix from "./matrix";
import Ray from "./ray";
import * as math from "./math";

export default class Camera {
	constructor(width = 640, height = 480, fovY = 45) {
		// sirka vyska obrazku
		this._width = width;
		this._height = height;
		// pomer
		this._aspect = this._width / this._height;
		// uhel otoceni oka
		this._fovY = fovY;
		this._fovX = this._fovY * this._aspect;
		// oko
		this._eye = new Vector3();
		// transformacni matice
		this._tm = new Matrix(3, 3);
		this._tm.single();

		this._showInfo();
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	setEye(eye) {
		this._eye = eye;
	}

	rotateX(angle) {
		this._tm.rotateX(angle);
	}

	rotateY(angle) {
		this._tm.rotateY(angle);
	}

	rotateZ(angle) {
		this._tm.rotateZ(angle);
	}

	generateRay(sx, sy) {
		let x = ((2 * sx - this._width) / this._width) * Math.tan(math.deg2Rad(this._fovX * 0.5));
		let y = ((2 * sy - this._height) / this._height) * Math.tan(math.deg2Rad(this._fovY * 0.5));
		// smer noveho paprsku - x, -y, 1
		let direction = new Vector3(x, -y, 1);
		direction.normalize();

		let directionTransformed = new Vector3(
			this._tm.get(0, 0) * direction.x + this._tm.get(1, 0) * direction.y + this._tm.get(2, 0) * direction.z,
			this._tm.get(0, 1) * direction.x + this._tm.get(1, 1) * direction.y + this._tm.get(2, 1) * direction.z,
			this._tm.get(0, 2) * direction.x + this._tm.get(1, 2) * direction.y + this._tm.get(2, 2) * direction.z
		);

		// paprsek
		return (new Ray(this._eye, directionTransformed));
	}

	_showInfo() {
		console.log(`Camera`);
		console.log(`Width      : ${ this._width }px`);
		console.log(`Height     : ${ this._height }px`);
	}
}

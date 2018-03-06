import Vector3 from "./vector3";
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
		this._tm = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

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

	setTransformationMatrix(tm) {
		this._tm = tm;
	}

	getAngles() {
		let tm = this._tm;
		let yaw = Math.atan2(-tm[2][0], tm[0][0]);
		let pitch = Math.asin(tm[1][0]);
		let roll = Math.atan2(-tm[1][2], tm[1][1]);

		yaw = Math.round(yaw / Math.PI * 180);
		pitch = Math.round(pitch / Math.PI * 180);
		roll = Math.round(roll / Math.PI * 180);

		return {
			yaw,
			pitch,
			roll
		};
	}

	generateRay(sx, sy) {
		let x = ((2 * sx - this._width) / this._width) * Math.tan(math.deg2Rad(this._fovX * 0.5));
		let y = ((2 * sy - this._height) / this._height) * Math.tan(math.deg2Rad(this._fovY * 0.5));
		// smer noveho paprsku
		let direction = new Vector3(x, -y, 1);
		direction.normalize();

		let directionTransformed = new Vector3(
			this._tm[0][0] * direction.x + this._tm[0][1] * direction.y + this._tm[0][2] * direction.z,
			this._tm[1][0] * direction.x + this._tm[1][1] * direction.y + this._tm[1][2] * direction.z,
			this._tm[2][0] * direction.x + this._tm[2][1] * direction.y + this._tm[2][2] * direction.z
		);
		// paprsek pozadi
		let bgDirectionRaw = new Vector3(x, y, 1); // smer noveho paprsku
		bgDirectionRaw.normalize();

		let bgDirection = new Vector3(
			-1 * bgDirectionRaw.x + 0 * bgDirectionRaw.y + 0 * bgDirectionRaw.z,
			0 * bgDirectionRaw.x + -1 * bgDirectionRaw.y + 0 * bgDirectionRaw.z,
			0 * bgDirectionRaw.x + 0 * bgDirectionRaw.y + -0.5 * bgDirectionRaw.z
		);

		// paprsek
		return (new Ray(this._eye, directionTransformed, bgDirection));
	}

	_getRotateX(angle) {
		let angleRad = angle / 180 * Math.PI;

		return [
			[1, 0, 0],
			[0, Math.cos(angleRad), -Math.sin(angleRad)],
			[0, Math.sin(angleRad), Math.cos(angleRad)]
		];
	}

	_getRotateY(angle) {
		let angleRad = angle / 180 * Math.PI;

		return [
			[Math.cos(angleRad), 0, Math.sin(angleRad)],
			[0, 1, 0],
			[-Math.sin(angleRad), 0, Math.cos(angleRad)]
		];
	}

	_getRotateZ(angle) {
		let angleRad = angle / 180 * Math.PI;

		return [
			[Math.cos(angleRad), -Math.sin(angleRad), 0],
			[Math.sin(angleRad), Math.cos(angleRad), 0],
			[0, 0, 1]
		];
	}

	rotateX(angle) {
		this._tm = this.rotateMatrix(this._tm, this._getRotateX(angle));
	}

	rotateY(angle) {
		this._tm = this.rotateMatrix(this._tm, this._getRotateY(angle));
	}

	rotateZ(angle) {
		this._tm = this.rotateMatrix(this._tm, this._getRotateZ(angle));
	}

	rotateMatrix(a, b) {
		// a - radky
		// b - sloupce
		// c - A radky, B sloupce
		let aRows = a.length;
		let aCols = a.length ? a[0].length : 0;
		let bRows = b.length;
		let bCols = b.length ? b[0].length : 0;

		if (aRows == bCols && aCols == bRows) {
			// init
			let output = new Array(aRows);

			for (let i = 0; i < aRows; i++) {
				output[i] = new Array(bCols);
			}

			// data
			for (let i = 0; i < aRows; i++) {
				for (let j = 0; j < bCols; j++) {
					let value = 0;

					for (let k = 0; k < aCols; k++) {
						value += a[i][k] * b[k][j];
					}

					output[i][j] = value;
				}
			}

			return output;
		}
		else {
			console.error("Wrong matrix size!");
			return null;
		}
	}

	_showInfo() {
		console.log(`Camera`);
		console.log(`Width      : ${ this._width }px`);
		console.log(`Height     : ${ this._height }px`);
	}
}

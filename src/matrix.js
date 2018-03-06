function createData(cols, rows) {
	let matrixData = new Array(rows);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			if (x == 0) {
				matrixData[y] = new Array(cols);
			}

			matrixData[y][x] = 0;
		}
	}

	return matrixData;
}

function rotateMatrix(type, angle) {
	let angleRad = angle / 180 * Math.PI;

	switch (type) {
		case "x":
			return new Matrix([
				[1, 0, 0],
				[0, Math.cos(angleRad), -Math.sin(angleRad)],
				[0, Math.sin(angleRad), Math.cos(angleRad)]
			]);

		case "y":
			return new Matrix([
				[Math.cos(angleRad), 0, Math.sin(angleRad)],
				[0, 1, 0],
				[-Math.sin(angleRad), 0, Math.cos(angleRad)]
			]);

		case "z":
			return new Matrix([
				[Math.cos(angleRad), -Math.sin(angleRad), 0],
				[Math.sin(angleRad), Math.cos(angleRad), 0],
				[0, 0, 1]
			]);
	}
}

export default class Matrix {
	constructor() {
		let len = arguments.length;
		
		if (len == 2 && typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			this._data = createData(arguments[0], arguments[1]);
		}
		else if (len == 1 && Array.isArray(arguments[0])) {
			this._data = arguments[0];
		}
		else {
			this._data = [[]];
		}
	}

	get data() {
		return this._data;
	}

	get size() {
		let rows = Array.isArray(this._data) ? this._data.length : 0;
		let cols = Array.isArray(this._data) && this._data.length && Array.isArray(this._data[0]) ? this._data[0].length : 0;

		return {
			rows,
			cols
		};
	}

	empty() {
		let size = this.size;

		if (size.rows == size.cols) {
			for (let y = 0; y < size.rows; y++) {
				for (let x = 0; x < size.cols; x++) {
					this._data[y][x] = 0;
				}
			}
		}
	}

	single() {
		let size = this.size;

		if (size.rows == size.cols) {
			for (let y = 0; y < size.rows; y++) {
				for (let x = 0; x < size.cols; x++) {
					this._data[y][x] = y == x ? 1 : 0;
				}
			}
		}
	}

	getAngles() {
		let yaw = Math.atan2(-this._data[2][0], this._data[0][0]);
		let pitch = Math.asin(this._data[1][0]);
		let roll = Math.atan2(-this._data[1][2], this._data[1][1]);

		yaw = Math.round(yaw / Math.PI * 180);
		pitch = Math.round(pitch / Math.PI * 180);
		roll = Math.round(roll / Math.PI * 180);

		return {
			yaw,
			pitch,
			roll
		};
	}

	rotateX(angle) {
		let b = rotateMatrix("x", angle);
		let c = rotate(this, b);

		this._data = c.data;
	}

	rotateY(angle) {
		let b = rotateMatrix("y", angle);
		let c = rotate(this, b);

		this._data = c.data;
	}

	rotateZ(angle) {
		let b = rotateMatrix("z", angle);
		let c = rotate(this, b);

		this._data = c.data;
	}
}

export function rotate(a, b) {
	let aSize = a.size;
	let bSize = b.size;

	if (aSize.rows == bSize.cols && aSize.cols == bSize.rows) {
		let output = createData(aSize.rows, bSize.cols);

		for (let y = 0; y < aSize.rows; y++) {
			for (let x = 0; x < bSize.cols; x++) {
				let value = 0;

				for (let z = 0; z < aSize.cols; z++) {
					value += a.data[y][z] * b.data[z][x];
				}

				output[y][x] = value;
			}
		}

		return new Matrix(output);
	}
	else {
		console.error("Wrong matrix size!");
		return null;
	}
}

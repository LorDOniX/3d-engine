function createData(cols, rows) {
	let len = cols * rows;
	let matrixData = new Array(len);

	for (let x = 0; x < len; x++) {
		matrixData[x] = 0;
	}

	return matrixData;
}

function rotateMatrix(type, angle) {
	let angleRad = angle / 180 * Math.PI;

	switch (type) {
		case "x":
			return new Matrix([1, 0, 0, 0, Math.cos(angleRad), -Math.sin(angleRad), 0, Math.sin(angleRad), Math.cos(angleRad)], 3);

		case "y":
			return new Matrix([Math.cos(angleRad), 0, Math.sin(angleRad), 0, 1, 0, -Math.sin(angleRad), 0, Math.cos(angleRad)], 3);

		case "z":
			return new Matrix([Math.cos(angleRad), -Math.sin(angleRad), 0, Math.sin(angleRad), Math.cos(angleRad), 0, 0, 0, 1], 3);
	}
}

export default class Matrix {
	// -
	// data cols
	// rows cols
	constructor() {
		let len = arguments.length;
		let data = [];
		let rows = 0;
		let cols = 0;
		
		if (len == 2 && typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			rows = arguments[0];
			cols = arguments[1];

			data = createData(rows, cols);
		}
		else if (len == 2 && Array.isArray(arguments[0]) && typeof arguments[1] === "number") {
			data = arguments[0];
			cols = arguments[1];
			rows = data.length / cols;
		}

		this._data = data;
		this._cols = cols;
		this._rows = rows;
	}

	get(x, y) {
		y = typeof y === "number" ? y : 0;

		let cols = this.size.cols;

		return (this._data[x + y * cols]);
	}

	get size() {
		return {
			len: this._data.length,
			rows: this._rows,
			cols: this._cols
		};
	}

	empty() {
		this._data.forEach((i, ind) => {
			this._data[ind] = 0;
		});
	}

	single() {
		let size = this.size;

		if (size.rows == size.cols) {
			let x = 0;
			let y = 0;

			this._data.forEach((i, ind) => {
				this._data[ind] = x == y ? 1 : 0;
				x++;

				if (x == size.cols) {
					x = 0;
					y++;
				}
			});
		}
	}

	getAngles() {
		let yaw = Math.atan2(-this.get(0, 2), this.get(0, 0));
		let pitch = Math.asin(this.get(0, 1));
		let roll = Math.atan2(-this.get(2, 1), this.get(1, 1));

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

		this.apply(rotate(this, b));
	}

	rotateY(angle) {
		let b = rotateMatrix("y", angle);

		this.apply(rotate(this, b));
	}

	rotateZ(angle) {
		let b = rotateMatrix("z", angle);

		this.apply(rotate(this, b));
	}

	apply(matrix) {
		this._data.forEach((i, ind) => {
			this._data[ind] = matrix.get(ind);
		});
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
					value += a.get(z, y) * b.get(x, z);
				}

				output[x + y * bSize.cols] = value;
			}
		}

		return new Matrix(output, bSize.cols);
	}
	else {
		console.error("Wrong matrix size!");
		return null;
	}
}

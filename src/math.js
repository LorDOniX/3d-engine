import Vector2 from "./vector2";
import Params from "./params";

/**
 * square { lb: { x, y }, rt: { x, y } 
 */
export function raySquareIntersection(ray, square) {
	let tx1 = (square.lb.x - ray.origin.x) * ray.inverted.x
	let tx2 = (square.rt.x - ray.origin.x) * ray.inverted.x;

	let tmin = Math.min(tx1, tx2);
	let tmax = Math.max(tx1, tx2);

	let ty1 = (square.lb.y - ray.origin.y) * ray.inverted.y;
	let ty2 = (square.rt.y - ray.origin.y) * ray.inverted.y;

	tmin = Math.max(tmin, Math.min(ty1, ty2));
	tmax = Math.min(tmax, Math.max(ty1, ty2));

	if (tmax < 0 || tmin > tmax) {
		return false;
	}

	return true;
}

// https://stackoverflow.com/questions/14307158/how-do-you-check-for-intersection-between-a-line-segment-and-a-line-ray-emanatin
export function rayLineIntersection(ray, line) {
	let v1 = ray.origin.minus(line.start);
	let v2 = line.end.minus(line.start);
	let v3 = new Vector2(-ray.direction.y, ray.direction.x);
	let dot = v2.dotProduct(v3);

	if (Math.abs(dot) < 0.000001) return null;

	let t1 = v2.crossProduct(v1) / dot;
	let t2 = v1.dotProduct(v3) / dot;

	if (t1 >= 0.0 && (t2 >= 0.0 && t2 <= 1.0)) {
		return ray.origin.plus(ray.direction.mul(t1));
	}

	return null;
};

// https://theshoemaker.de/2016/02/ray-casting-in-2d-grids/
export function castRayTrack(ray, stepCb) {
	let dirSignX = ray.direction.x > 0 ? 1 : -1;
	let dirSignY = ray.direction.y > 0 ? 1 : -1;
	let tileOffsetX = ray.direction.x > 0 ? 1 : 0;
	let tileOffsetY = ray.direction.y > 0 ? 1 : 0;
	let curX = ray.origin.x;
	let curY = ray.origin.y;
	let tileX = curX >>> 0;
	let tileY = curY >>> 0;
	let t = 0;

	while (true) {
		if (stepCb(new Vector2(tileX, tileY))) break;

		let dtX = ((tileX + tileOffsetX) * Params.GRID_SIZE - curX) / ray.direction.x;
		let dtY = ((tileY + tileOffsetY) * Params.GRID_SIZE - curY) / ray.direction.y;

		if (dtX < dtY) {
			t += dtX;
			tileX += dirSignX;
		}
		else {
			t += dtY;
			tileY += dirSignY;
		}

		curX = ray.origin.x + ray.direction.x * t;
		curY = ray.origin.y + ray.direction.y * t;
	}
	
}

export function bresenhamLine(ray, stepCb) {
	let allPos = [new Vector2(ray.origin.x >>> 0, ray.origin.y >>> 0)];
	let dx = Math.abs(ray.direction.x);
	let dy = Math.abs(ray.direction.y);
	let x = ray.origin.x;
	let y = ray.origin.y;
	let x_inc = ray.direction.x > 0 ? 1 : -1;
	let y_inc = ray.direction.y > 0 ? 1 : -1;
	let error = dx - dy;

	while (true) {
		let posVec = new Vector2(x >>> 0, y >>> 0);
		let filtered = allPos.filter(i => posVec.isEqual(i));

		if (filtered.length == 0) {
			allPos.push(posVec);

			// callback - vraci true, ukoncime
			if (stepCb(posVec)) break;
		}

		if (error > 0) {
			x += x_inc;
			error -= dy;
		}
		else {
			y += y_inc;
			error += dx;
		}
	}
}

export function moveVector(v, angle = 0) {
	let rad = (360 - angle) / 180 * Math.PI;
	let x = v.x * Math.cos(rad) - v.y * Math.sin(rad);
	let y = v.x * Math.sin(rad) + v.y * Math.cos(rad);

	// -y = protoze chceme nahoru odecitat, ne pricitat
	return (new Vector2(x, -y));
}

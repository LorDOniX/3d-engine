import Vector2 from "./vector2";

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

// https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/
export function rayLineIntersection(ray, line) {
	let v1 = ray.origin.minus(line.start);
	let v2 = line.direction;
	let v3;

	if (v2.crossProduct(ray.direction) > 0) {
		v3 = new Vector2(ray.direction.y, -ray.direction.x);
	}
	else {
		v3 = new Vector2(-ray.direction.y, ray.direction.x);
	}

	let t1 = Math.abs(v2.crossProduct(v1) / v2.dotProduct(v3));
	let t2 = v1.dotProduct(v3) / v2.dotProduct(v3);

	return (t1 > 0 && t2 < 1 ? ray.origin.plus(ray.direction.mul(t1)) : null);
};

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

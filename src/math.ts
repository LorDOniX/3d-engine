import Vector2 from "./vector2";
import Params from "./params";
import type Ray from "./ray";
import type Line from "./line";

export interface LineHit {
	// vzdalenost od pocatku paprsku
	distance: number;
	// pozice zasahu na care, 0 = start, 1 = end
	perc: number;
}

// vraci true pro ukonceni
export type StepCallback = (tileX: number, tileY: number) => boolean | void;

/**
 * Smerovy vektor pro uhel ve stupnich; 0 = nahoru (-y), po smeru hodinovych rucicek.
 */
export function angleToDirection(angle: number): Vector2 {
	const rad = angle / 180 * Math.PI;

	return new Vector2(Math.sin(rad), -Math.cos(rad));
}

// https://stackoverflow.com/questions/14307158/how-do-you-check-for-intersection-between-a-line-segment-and-a-line-ray-emanatin
export function rayLineIntersection(ray: Ray, line: Line): LineHit | null {
	const { origin, direction } = ray;
	const v1x = origin.x - line.start.x;
	const v1y = origin.y - line.start.y;
	const v2x = line.end.x - line.start.x;
	const v2y = line.end.y - line.start.y;
	// v3 = (-direction.y, direction.x)
	const dot = -v2x * direction.y + v2y * direction.x;

	if (Math.abs(dot) < 0.000001) return null;

	const t1 = (v2x * v1y - v2y * v1x) / dot;
	const t2 = (-v1x * direction.y + v1y * direction.x) / dot;

	if (t1 >= 0.0 && t2 >= 0.0 && t2 <= 1.0) {
		return {
			distance: t1 * direction.length(),
			perc: t2
		};
	}

	return null;
}

// https://theshoemaker.de/2016/02/ray-casting-in-2d-grids/
export function castRayTrack(ray: Ray, stepCb: StepCallback): void {
	const { origin, direction } = ray;
	const dirSignX = direction.x > 0 ? 1 : -1;
	const dirSignY = direction.y > 0 ? 1 : -1;
	const tileOffsetX = direction.x > 0 ? 1 : 0;
	const tileOffsetY = direction.y > 0 ? 1 : 0;
	let curX = origin.x;
	let curY = origin.y;
	let tileX = Math.floor(curX);
	let tileY = Math.floor(curY);
	let t = 0;

	while (true) {
		if (stepCb(tileX, tileY)) break;

		// paprsek rovnobezny s osou nikdy neprotne hranu v dane ose
		const dtX = direction.x === 0 ? Infinity : ((tileX + tileOffsetX) * Params.GRID_SIZE - curX) / direction.x;
		const dtY = direction.y === 0 ? Infinity : ((tileY + tileOffsetY) * Params.GRID_SIZE - curY) / direction.y;

		if (dtX < dtY) {
			t += dtX;
			tileX += dirSignX;
		}
		else {
			t += dtY;
			tileY += dirSignY;
		}

		curX = origin.x + direction.x * t;
		curY = origin.y + direction.y * t;
	}
}

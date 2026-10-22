import { describe, expect, it } from "vitest";
import Vector2 from "./vector2";
import Ray from "./ray";
import Line from "./line";
import { angleToDirection, castRayTrack, rayLineIntersection } from "./math";

function track(ray: Ray, limit: number): string[] {
	const tiles: string[] = [];

	castRayTrack(ray, (x, y) => {
		tiles.push(`${x},${y}`);

		return tiles.length >= limit;
	});

	return tiles;
}

describe("angleToDirection", () => {
	it.each([
		[0, 0, -1],
		[90, 1, 0],
		[180, 0, 1],
		[270, -1, 0],
		[360, 0, -1]
	])("%d° -> (%d, %d)", (angle, x, y) => {
		const dir = angleToDirection(angle);

		expect(dir.x).toBeCloseTo(x);
		expect(dir.y).toBeCloseTo(y);
	});
});

describe("rayLineIntersection", () => {
	const line = new Line(new Vector2(0, 0), new Vector2(4, 0));

	it("returns distance and position on the line", () => {
		const hit = rayLineIntersection(new Ray(new Vector2(1, 2), new Vector2(0, -1)), line);

		expect(hit?.distance).toBeCloseTo(2);
		expect(hit?.perc).toBeCloseTo(0.25);
	});

	it("misses behind the ray, outside the segment and when parallel", () => {
		expect(rayLineIntersection(new Ray(new Vector2(1, 2), new Vector2(0, 1)), line)).toBeNull();
		expect(rayLineIntersection(new Ray(new Vector2(5, 2), new Vector2(0, -1)), line)).toBeNull();
		expect(rayLineIntersection(new Ray(new Vector2(1, 2), new Vector2(1, 0)), line)).toBeNull();
	});
});

describe("castRayTrack", () => {
	it("walks a diagonal ray through neighbouring tiles", () => {
		expect(track(new Ray(new Vector2(0.5, 0.25), new Vector2(1, 1).normalized()), 4)).toEqual(["0,0", "1,0", "1,1", "2,1"]);
	});

	// regrese: smer s nulovou slozkou delil nulou a trasovani ujelo do vedlejsich dlazdic
	it.each([
		["up", new Vector2(0, -1), ["3,5", "3,4", "3,3"]],
		["down", new Vector2(0, 1), ["3,5", "3,6", "3,7"]],
		["left", new Vector2(-1, 0), ["3,5", "2,5", "1,5"]],
		["right", new Vector2(1, 0), ["3,5", "4,5", "5,5"]]
	])("axis aligned ray %s stays in its column/row", (_name, dir, expected) => {
		expect(track(new Ray(new Vector2(3.8, 5.2), dir as Vector2), 3)).toEqual(expected);
	});
});

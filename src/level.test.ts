import { describe, expect, it } from "vitest";
import Level0 from "./level-0";
import Ray from "./ray";
import Vector2 from "./vector2";
import Params from "./params";
import { angleToDirection } from "./math";

describe("Level", () => {
	it("treats walls and out of map as blocking", () => {
		expect(Level0.isWall(0.5, 0.5)).toBe(true);
		expect(Level0.isWall(1.5, 1.5)).toBe(false);
		expect(Level0.isWall(-1, 1.5)).toBe(true);
		expect(Level0.isWall(100, 1.5)).toBe(true);
	});

	it("collides when the player box overlaps a wall", () => {
		const radius = Params.PLAYER_RADIUS;

		expect(Level0.collides(1.5, 1.5, radius)).toBe(false);
		expect(Level0.collides(1.2, 1.5, radius)).toBe(true);
		expect(Level0.collides(1.5, 1.2, radius)).toBe(true);
	});

	it("hits the nearest wall", () => {
		const hit = Level0.castWall(new Ray(new Vector2(2.5, 2.5), new Vector2(0, -1)));

		expect(hit?.distance).toBeCloseTo(1.5);
		expect(hit?.material).toBe(Params.MATERIAL.PRISON);
	});

	// regrese: pro vsechny pozice a uhly (vcetne presne v ose) musi paprsek trefit zed
	it("every ray from a free position hits a wall", () => {
		const angles = [0, 90, 180, 270, 360, -0, 1e-15, 360 - 1e-13];

		for (let a = 0; a < 360; a += 7.3) angles.push(a);

		for (let y = 1.25; y < 8; y += 0.25) {
			for (let x = 1.25; x < 8; x += 0.25) {
				if (Level0.isWall(x, y)) continue;

				for (const angle of angles) {
					const hit = Level0.castWall(new Ray(new Vector2(x, y), angleToDirection(angle)));

					expect(hit, `x=${x} y=${y} angle=${angle}`).not.toBeNull();
				}
			}
		}
	});
});

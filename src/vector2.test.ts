import { describe, expect, it } from "vitest";
import Vector2 from "./vector2";

describe("Vector2", () => {
	it("does basic arithmetic without mutating", () => {
		const a = new Vector2(1, 2);
		const b = new Vector2(3, -1);

		expect(a.plus(b)).toEqual(new Vector2(4, 1));
		expect(a.minus(b)).toEqual(new Vector2(-2, 3));
		expect(a.mul(2)).toEqual(new Vector2(2, 4));
		expect(a).toEqual(new Vector2(1, 2));
	});

	it("computes length, distance and products", () => {
		const a = new Vector2(3, 4);

		expect(a.length()).toBe(5);
		expect(a.distance(new Vector2(0, 0))).toBe(5);
		expect(a.dotProduct(new Vector2(1, 1))).toBe(7);
		expect(a.crossProduct(new Vector2(1, 1))).toBe(-1);
	});

	it("normalizes, zero vector stays zero", () => {
		expect(new Vector2(0, 5).normalized()).toEqual(new Vector2(0, 1));
		expect(new Vector2().normalized()).toEqual(new Vector2());
	});
});

import { describe, expect, it } from "vitest";
import Sprite from "./sprite";
import Vector2 from "./vector2";
import Params from "./params";

describe("Sprite.getLine", () => {
	const sprite = new Sprite(Params.MATERIAL.BARREL, new Vector2(2, 2));

	it("is perpendicular to the viewer with start on the viewer's left", () => {
		// pozorovatel pod spritem kouka nahoru, vlevo je -x
		const line = sprite.getLine(new Vector2(2, 5));

		expect(line.start.x).toBeCloseTo(1.5);
		expect(line.start.y).toBeCloseTo(2);
		expect(line.end.x).toBeCloseTo(2.5);
		expect(line.end.y).toBeCloseTo(2);
		expect(line.material).toBe(Params.MATERIAL.BARREL);
	});

	it("faces the viewer from any direction", () => {
		const viewer = new Vector2(4, 3);
		const line = sprite.getLine(viewer);
		const toSprite = sprite.center.minus(viewer);

		expect(line.end.minus(line.start).dotProduct(toSprite)).toBeCloseTo(0);
		expect(line.start.distance(line.end)).toBeCloseTo(Params.SPRITE_WIDTH);
	});

	it("does not break when the viewer stands inside the sprite", () => {
		const line = sprite.getLine(new Vector2(2, 2));

		expect(Number.isFinite(line.start.x) && Number.isFinite(line.end.y)).toBe(true);
	});
});

import { describe, expect, it } from "vitest";
import Gun from "./gun";
import type Render from "./render";
import Params from "./params";

describe("Gun", () => {
	const stepSeconds = Params.GUN.DURATION / Params.GUN.STEPS / 1000;

	it("animates through all frames and stops after the duration", () => {
		const gun = new Gun({} as Render);

		expect(gun.frame).toBe(0);
		gun.shoot();
		expect(gun.isShooting).toBe(true);

		const frames = [];

		for (let i = 0; i < Params.GUN.STEPS; i++) {
			frames.push(gun.frame);
			gun.update(stepSeconds);
		}

		expect(frames).toEqual([0, 1, 2, 3, 4, 5]);
		expect(gun.isShooting).toBe(false);
		expect(gun.frame).toBe(0);
	});

	it("ignores shooting while the animation runs", () => {
		const gun = new Gun({} as Render);

		gun.shoot();
		gun.update(stepSeconds * 2.5);
		gun.shoot();
		expect(gun.frame).toBe(2);
	});
});

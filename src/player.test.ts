import { describe, expect, it } from "vitest";
import Player from "./player";

describe("Player.yaw", () => {
	it.each([
		[10, 10],
		[370, 10],
		[-10, 350],
		[360, 0],
		[-720, 0],
		// regrese: 1.6 - 1.6 v plovouci carce dalo -2.9e-15 a puvodni normalizace vratila presne 360
		[1.6 - 1.6000000000000028, 0]
	])("%d -> %d", (input, expected) => {
		const player = new Player();
		player.yaw = input;

		expect(player.yaw).toBeGreaterThanOrEqual(0);
		expect(player.yaw).toBeLessThan(360);
		expect(player.yaw).toBeCloseTo(expected);
	});
});

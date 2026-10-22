import { describe, expect, it } from "vitest";
import { lightIntensity, packColor, shadeTexture } from "./render";

describe("lightIntensity", () => {
	it.each([
		[0, 1],
		[2.9, 1],
		[3, 0.9],
		[14.9, 0.6],
		[15, 0.5],
		[1000, 0.5]
	])("distance %d -> %d", (distance, expected) => {
		expect(lightIntensity(distance)).toBe(expected);
	});
});

describe("shadeTexture", () => {
	it("darkens opaque pixels and keeps transparent ones as 0", () => {
		const data = new Uint8ClampedArray([200, 100, 50, 255, 9, 9, 9, 0]);
		const shaded = shadeTexture(data, 0.5);
		const bytes = new Uint8ClampedArray(shaded.buffer);

		expect(Array.from(bytes.subarray(0, 4))).toEqual([100, 50, 25, 255]);
		expect(shaded[1]).toBe(0);
	});
});

describe("packColor", () => {
	it("packs in ImageData byte order", () => {
		const bytes = new Uint8ClampedArray(new Uint32Array([packColor("#123456")]).buffer);

		expect([...bytes]).toEqual([0x12, 0x34, 0x56, 0xff]);
		expect(packColor("#fff")).toBe(packColor("#ffffff"));
	});
});

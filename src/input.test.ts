import { describe, expect, it, vi } from "vitest";
import Input from "./input";

function key(target: EventTarget, type: "keydown" | "keyup", code: string, repeat = false): Event {
	const event = Object.assign(new Event(type, { cancelable: true }), { code, repeat });

	target.dispatchEvent(event);

	return event;
}

describe("Input", () => {
	it("maps arrows and WASD to actions and prevents page scrolling", () => {
		const keys = new EventTarget();
		const input = new Input(() => {}, keys, new EventTarget());

		const down = key(keys, "keydown", "ArrowUp");
		key(keys, "keydown", "KeyA");

		expect(down.defaultPrevented).toBe(true);
		expect(input.isPressed("forward")).toBe(true);
		expect(input.isPressed("left")).toBe(true);

		key(keys, "keyup", "ArrowUp");
		expect(input.isPressed("forward")).toBe(false);
	});

	it("shoots once per key press", () => {
		const keys = new EventTarget();
		const shoot = vi.fn();
		new Input(shoot, keys, new EventTarget());

		key(keys, "keydown", "Space");
		key(keys, "keydown", "Space", true);
		key(keys, "keydown", "ControlLeft");

		expect(shoot).toHaveBeenCalledTimes(2);
	});

	it("ignores other keys and releases everything on blur", () => {
		const keys = new EventTarget();
		const focus = new EventTarget();
		const input = new Input(() => {}, keys, focus);

		expect(key(keys, "keydown", "KeyQ").defaultPrevented).toBe(false);

		key(keys, "keydown", "KeyD");
		focus.dispatchEvent(new Event("blur"));
		expect(input.isPressed("right")).toBe(false);
	});
});

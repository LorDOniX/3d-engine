export type Action = "left" | "right" | "forward" | "backward";

const ACTIONS: Record<string, Action> = {
	ArrowLeft: "left",
	KeyA: "left",
	ArrowRight: "right",
	KeyD: "right",
	ArrowUp: "forward",
	KeyW: "forward",
	ArrowDown: "backward",
	KeyS: "backward"
};

const SHOOT_KEYS = new Set(["Space", "ControlLeft", "ControlRight"]);

export default class Input {
	private _pressed = new Set<Action>();

	constructor(private _onShoot: () => void, keyTarget: EventTarget = document, focusTarget: EventTarget = window) {
		keyTarget.addEventListener("keydown", e => this._onKey(e as KeyboardEvent, true));
		keyTarget.addEventListener("keyup", e => this._onKey(e as KeyboardEvent, false));
		// po ztrate fokusu by klavesy zustaly "drzene"
		focusTarget.addEventListener("blur", () => this._pressed.clear());
	}

	isPressed(action: Action): boolean {
		return this._pressed.has(action);
	}

	private _onKey(e: KeyboardEvent, down: boolean): void {
		const action = ACTIONS[e.code];

		if (action) {
			e.preventDefault();

			if (down) {
				this._pressed.add(action);
			}
			else {
				this._pressed.delete(action);
			}
		}
		else if (SHOOT_KEYS.has(e.code)) {
			e.preventDefault();

			if (down && !e.repeat) {
				this._onShoot();
			}
		}
	}
}

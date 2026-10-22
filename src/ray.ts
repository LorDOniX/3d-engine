import type Vector2 from "./vector2";

export default class Ray {
	constructor(readonly origin: Vector2, readonly direction: Vector2) {}
}

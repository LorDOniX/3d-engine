import type Vector2 from "./vector2";
import type { Material } from "./params";

export default class Line {
	constructor(readonly start: Vector2, readonly end: Vector2, public material: Material | null = null) {}
}

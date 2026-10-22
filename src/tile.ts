import Vector2 from "./vector2";
import Line from "./line";
import type { Material } from "./params";

export default class Tile {
	private _walls: Line[] = [];

	constructor(readonly x: number, readonly y: number, readonly size = 1) {}

	get walls(): Line[] {
		return this._walls;
	}

	get hasWalls(): boolean {
		return (this._walls.length > 0);
	}

	createWalls(material: Material | null): void {
		const { x, y, size } = this;

		this._walls.push(new Line(new Vector2(x, y), new Vector2(x + size, y), material));
		this._walls.push(new Line(new Vector2(x + size, y), new Vector2(x + size, y + size), material));
		this._walls.push(new Line(new Vector2(x + size, y + size), new Vector2(x, y + size), material));
		this._walls.push(new Line(new Vector2(x, y + size), new Vector2(x, y), material));
	}

	setMaterial(material: Material | null): void {
		this._walls.forEach(wall => wall.material = material);
	}
}

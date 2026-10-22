import type Tile from "./tile";
import type Ray from "./ray";
import type { Material } from "./params";
import { type LineHit, castRayTrack, rayLineIntersection } from "./math";

export interface WallHit extends LineHit {
	material: Material | null;
}

export default class Level {
	private _items: Tile[][];
	private _width: number;
	private _height: number;

	constructor(items: Tile[][]) {
		this._items = items.length && items[0].length ? items : [[]];
		this._width = this._items[0].length;
		this._height = this._items.length;
	}

	getTile(x: number, y: number): Tile | null {
		if (x >= 0 && y >= 0 && x < this._width && y < this._height) {
			return this._items[y][x];
		}
		else return null;
	}

	// mimo mapu je vzdy zed
	isWall(x: number, y: number): boolean {
		const tile = this.getTile(Math.floor(x), Math.floor(y));

		return (!tile || tile.hasWalls);
	}

	// ctverec o "polomeru" radius koliduje se zdi
	collides(x: number, y: number, radius: number): boolean {
		return this.isWall(x - radius, y - radius) || this.isWall(x + radius, y - radius) ||
			this.isWall(x - radius, y + radius) || this.isWall(x + radius, y + radius);
	}

	// nejblizsi zasah zdi paprskem
	castWall(ray: Ray): WallHit | null {
		let wall: WallHit | null = null;

		castRayTrack(ray, (tileX, tileY) => {
			const tile = this.getTile(tileX, tileY);

			// mimo mapu, dal nepokracujeme
			if (!tile) return true;

			if (!tile.hasWalls) return false;

			tile.walls.forEach(line => {
				const hit = rayLineIntersection(ray, line);

				if (hit && (!wall || hit.distance < wall.distance)) {
					wall = { ...hit, material: line.material };
				}
			});

			// paprsek se zdi jen dotkl (napr. v rohu), pokracujeme dal
			return wall !== null;
		});

		return wall;
	}
}

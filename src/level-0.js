import Level from "./level";
import Tile from "./tile";
import Line from "./line";
import Vector2 from "./vector2";
import Params from "./params";

// velikost dlazdice
const TILE_SIZE = 1;

// parametry mapy
const EMPTY = 0;
const WALL = 1;

// mapa
const MAP = [
	[WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, WALL, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, WALL, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, WALL, WALL, WALL, WALL, WALL, EMPTY, WALL, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL]
];

function get() {
	// poloha hrace
	let playerPosition = null;

	// naplneni
	let height = MAP.length;
	let items = [];

	for (let y = 0; y < height; y++) {
		items.push(MAP[y].map((code, x) => {
			let tile = new Tile(new Vector2(x, y), TILE_SIZE, TILE_SIZE);

			switch (code) {
				case WALL:
					tile.createWall(x, y);
					tile.setMaterial(Params.MATERIAL.WALL);
					break;
			}

			return tile;
		}));
	}

	items[0][1].setMaterial(Params.MATERIAL.EAGLE);
	items[0][2].setMaterial(Params.MATERIAL.PRISON);
	items[0][3].setMaterial(Params.MATERIAL.EAGLE);
	items[1][4].setMaterial(Params.MATERIAL.STONE);

	return new Level(items);
}

export default get();

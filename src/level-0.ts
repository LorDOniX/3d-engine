import Level from "./level";
import Tile from "./tile";
import Params from "./params";

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

function create(): Level {
	const items = MAP.map((row, y) => row.map((code, x) => {
		const tile = new Tile(x, y, Params.GRID_SIZE);

		if (code === WALL) {
			tile.createWalls(Params.MATERIAL.WALL);
		}

		return tile;
	}));

	items[0][1].setMaterial(Params.MATERIAL.EAGLE);
	items[0][2].setMaterial(Params.MATERIAL.PRISON);
	items[0][3].setMaterial(Params.MATERIAL.EAGLE);
	items[1][4].setMaterial(Params.MATERIAL.STONE);

	return new Level(items);
}

export default create();

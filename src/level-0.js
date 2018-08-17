import Level from "./level";
import Tile from "./tile";
import Line from "./line";
import Vector2 from "./vector2";
import * as Material from "./material";

// velikost dlazdice
const TILE_SIZE = 1;

// parametry mapy
const EMPTY = 0;
const WALL = 1;
const PLAYER_MARK = 2;

const PLAYER_COR = 0.5

// mapa
const MAP = [
	[WALL, WALL, WALL, WALL, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, EMPTY, PLAYER_MARK, EMPTY, WALL],
	[WALL, EMPTY, EMPTY, EMPTY, WALL],
	[WALL, WALL, WALL, WALL, WALL]
];

function get() {
	// poloha hrace
	let playerPosition = null;

	MAP.forEach((line, y) => {
		let mainLoop = true;

		line.forEach((i, x) => {
			if (i == PLAYER_MARK) {
				playerPosition = new Vector2(x + PLAYER_COR, y + PLAYER_COR);
				mainLoop = false;
			}
			else return true;
		});

		return mainLoop;
	});

	// naplneni
	let height = MAP.length;
	let items = [];

	for (let y = 0; y < height; y++) {
		items.push(MAP[y].map((code, x) => {
			let tile = new Tile(x, y, TILE_SIZE, TILE_SIZE);

			switch (code) {
				case WALL:
					tile.createWall(x, y);
					tile.setMaterial(Material.WALL);
					break;
			}

			return tile;
		}));
	}

	items[0][2].setMaterial(Material.PRISON);
	items[1][4].setMaterial(Material.STONE);

	console.log(items);

	return {
		level: new Level(items),
		playerPosition
	};
}

export default get();

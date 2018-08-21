import Vector2 from "./vector2";

const TEXTURE_SIZE = 64;

let params = {
	FOV: 60,
	PLAYER_SIZE: 32,
	// seconds
	PLAYER_MOVE_YAW: 100,
	PLAYER_MOVE_DIRECTION: 2,
	MIN_DISTANCE: 10,
	// seconds end
	WALL_SIZE: 64,
	// nasobky 2, init 1
	DRAW_WIDTH: 8,
	TEXTURE_SIZE,
	TILE_HEIGHT: 1.2,
	LIGHT_RANGE: 5,
	GRID_SIZE: 1,
	RAY_DIRECTION: new Vector2(0, 1),
	MATERIAL: {
		EMPTY: { x: -1, y: -1 },
		WALL: { x: 0, y: 0 },
		PRISON: { x: 0, y: TEXTURE_SIZE },
		STONE: { x: 0, y: TEXTURE_SIZE * 2 }
	},
	COLORS: {
		CELLAR: "#505050",
		FLOOR: "#808080",
		BLACK: "#000"
	},
	WALLS_IMG: "/img/walls.png"
};

export default params;

import Vector2 from "./vector2";

const TEXTURE_SIZE = 64;

let params = {
	FOV: 60,
	PLAYER_SIZE: 32,
	// seconds
	PLAYER_MOVE_YAW: 100,
	PLAYER_MOVE_DIRECTION: 2,
	// seconds end
	MIN_DISTANCE: 0.25,
	WALL_SIZE: 64,
	// nasobky 2, init 1
	DRAW_WIDTH: 1,
	TEXTURE_SIZE,
	TILE_HEIGHT: 1.2,
	LIGHT_RANGE: 5,
	GRID_SIZE: 1,
	RAY_DIRECTION: new Vector2(0, 1),
	CROSSHAIR_WIDTH: 1,
	MATERIAL: {
		EMPTY: { x: -1, y: -1 },
		BARREL: { x: 0, y: 0 },
		WALL: { x: TEXTURE_SIZE, y: 0 },
		EAGLE: { x: TEXTURE_SIZE * 3, y: 0 },
		LIGHT: { x: TEXTURE_SIZE * 4, y: 0 },
		STONE: { x: TEXTURE_SIZE * 5, y: 0 },
		PRISON: { x: TEXTURE_SIZE * 8, y: 0 }
	},
	COLORS: {
		CELLAR: "#505050",
		FLOOR: "#808080",
		BLACK: "#000",
		WHITE: "#fff"
	},
	SIZE: {
		// 320x200
		WIDTH: 1024,
		HEIGHT: 768
	},
	TEXTURES: {
		MAIN: "/img/texture.png",
		GUN: "/img/gun.png"
	}
};

export default params;

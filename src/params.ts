import textureUrl from "./assets/texture.png";
import gunUrl from "./assets/gun.png";

export interface Material {
	x: number;
	y: number;
}

export interface LightIntensity {
	// vzdalenost od (vcetne)
	from: number;
	value: number;
}

const TEXTURE_SIZE = 64;

const MATERIAL = {
	EMPTY: null,
	BARREL: { x: 0, y: 0 },
	WALL: { x: TEXTURE_SIZE, y: 0 },
	EAGLE: { x: TEXTURE_SIZE * 3, y: 0 },
	LIGHT: { x: TEXTURE_SIZE * 4, y: 0 },
	STONE: { x: TEXTURE_SIZE * 5, y: 0 },
	PRISON: { x: TEXTURE_SIZE * 8, y: 0 },
	TABLE: { x: TEXTURE_SIZE * 11, y: 0 },
	COLUMN: { x: TEXTURE_SIZE * 7, y: 0 }
} satisfies Record<string, Material | null>;

// serazeno vzestupne podle from
const LIGHT_INTENSITY: LightIntensity[] = [
	{ from: 0, value: 1 },
	{ from: 3, value: 0.9 },
	{ from: 6, value: 0.8 },
	{ from: 9, value: 0.7 },
	{ from: 12, value: 0.6 },
	{ from: 15, value: 0.5 }
];

const params = {
	FOV: 60,
	// za sekundu
	PLAYER_MOVE_YAW: 100,
	PLAYER_MOVE_DIRECTION: 2,
	// minimalni vzdalenost hrace od zdi
	PLAYER_RADIUS: 0.25,
	// nasobky 2, init 1
	DRAW_WIDTH: 1,
	TEXTURE_SIZE,
	TILE_HEIGHT: 1.2,
	GRID_SIZE: 1,
	SPRITE_WIDTH: 1,
	CROSSHAIR_WIDTH: 1,
	SPRITE_MIN_DISTANCE: 0.5,
	LIGHT_INTENSITY,
	MATERIAL,
	COLORS: {
		CELLAR: "#505050",
		FLOOR: "#808080",
		WHITE: "#fff"
	},
	SIZE: {
		WIDTH: 1024,
		HEIGHT: 768
	},
	TEXTURES: {
		MAIN: textureUrl,
		GUN: gunUrl
	},
	GUN: {
		// pocet obrazku animace
		STEPS: 6,
		// ms
		DURATION: 550
	}
};

export default params;

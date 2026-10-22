import Player from "./player";
import Level0 from "./level-0";
import type Level from "./level";
import Render, { type Column } from "./render";
import Vector2 from "./vector2";
import Ray from "./ray";
import type Line from "./line";
import Params from "./params";
import Sprite from "./sprite";
import Gun from "./gun";
import Input from "./input";
import { type LineHit, angleToDirection, rayLineIntersection } from "./math";

interface SpriteHit extends LineHit {
	line: Line;
}

const DEG = Math.PI / 180;

export default class Game {
	private _lastTime = 0;
	private _level: Level = Level0;
	private _player = new Player(new Vector2(2.5, 2.5));
	private _sprites = [
		new Sprite(Params.MATERIAL.LIGHT, new Vector2(1.5, 1.5)),
		new Sprite(Params.MATERIAL.TABLE, new Vector2(3.5, 1.5)),
		new Sprite(Params.MATERIAL.BARREL, new Vector2(1.5, 3.5)),
		new Sprite(Params.MATERIAL.COLUMN, new Vector2(2, 2.5))
	];
	private _render: Render;
	private _gun: Gun;
	private _input: Input;

	constructor(container: HTMLElement) {
		this._render = new Render({
			width: Params.SIZE.WIDTH,
			height: Params.SIZE.HEIGHT
		});
		this._gun = new Gun(this._render);
		this._input = new Input(() => this._gun.shoot());
		container.appendChild(this._render.container);

		this._run();
	}

	private async _run(): Promise<void> {
		await this._render.load();
		requestAnimationFrame(this._gameLoop);
	}

	private _gameLoop = (time: number): void => {
		const seconds = (time - this._lastTime) / 1000;

		this._lastTime = time;

		// po dlouhe pauze (napr. neaktivni zalozka) nechceme skok
		if (seconds < 0.2) {
			this._update(seconds);
			this._drawFrame();
		}

		requestAnimationFrame(this._gameLoop);
	};

	private _update(seconds: number): void {
		const input = this._input;

		if (input.isPressed("left") !== input.isPressed("right")) {
			this._player.yaw += Params.PLAYER_MOVE_YAW * seconds * (input.isPressed("left") ? -1 : 1);
		}

		if (input.isPressed("forward") !== input.isPressed("backward")) {
			const dir = input.isPressed("forward") ? 1 : -1;
			const move = angleToDirection(this._player.yaw).mul(Params.PLAYER_MOVE_DIRECTION * seconds * dir);

			this._player.position = this._movePlayer(this._player.position, move);
		}

		this._gun.update(seconds);
	}

	// posun po osach zvlast - u zdi hrac klouze
	private _movePlayer(pos: Vector2, move: Vector2): Vector2 {
		const radius = Params.PLAYER_RADIUS;
		let x = pos.x + move.x;
		let y = pos.y + move.y;

		if (this._level.collides(x, pos.y, radius)) {
			x = pos.x;
		}

		if (this._level.collides(x, y, radius)) {
			y = pos.y;
		}

		return new Vector2(x, y);
	}

	private _drawFrame(): void {
		const render = this._render;
		const position = this._player.position;
		const yaw = this._player.yaw;
		const steps = Math.ceil(render.width / Params.DRAW_WIDTH);
		const tanHalfFov = Math.tan(Params.FOV * 0.5 * DEG);
		// billboardy jsou natocene k hraci, staci jednou za snimek
		const spriteLines = this._sprites.map(sprite => sprite.getLine(position));

		render.clear();

		for (let stepX = 0; stepX < steps; stepX++) {
			// paprsky rovnomerne v rovine obrazovky, ne v uhlu - rovne zdi zustanou rovne
			const screenX = (2 * (stepX + 0.5) / steps - 1) * tanHalfFov;
			const angleOffset = Math.atan(screenX) / DEG;
			// korekce rybiho oka
			const cosOffset = Math.cos(angleOffset * DEG);
			const x = stepX * Params.DRAW_WIDTH;
			const ray = new Ray(position, angleToDirection(yaw + angleOffset));
			const wall = this._level.castWall(ray);

			if (wall) {
				render.drawColumn(x, this._column(wall, wall.distance * cosOffset, wall.material));
			}

			this._spriteHits(ray, spriteLines, wall ? wall.distance : Infinity).forEach(hit => {
				render.drawColumn(x, this._column(hit, hit.distance * cosOffset, hit.line.material));
			});
		}

		render.present();
		this._gun.draw();
	}

	// zasahy spritu pred zdi, serazene od nejvzdalenejsiho
	private _spriteHits(ray: Ray, lines: Line[], maxDistance: number): SpriteHit[] {
		const hits: SpriteHit[] = [];

		lines.forEach(line => {
			const hit = rayLineIntersection(ray, line);

			if (hit && hit.distance > Params.SPRITE_MIN_DISTANCE && hit.distance < maxDistance) {
				hits.push({ ...hit, line });
			}
		});

		// oxlint-disable-next-line unicorn/no-array-sort -- lokalni pole, toSorted by zbytecne alokoval pro kazdy sloupec
		return hits.sort((a, b) => b.distance - a.distance);
	}

	private _column(hit: LineHit, z: number, material: Column["material"]): Column {
		const screenHeight = this._render.height;
		// vyska zdi
		const height = screenHeight * Params.TILE_HEIGHT / z;
		// horni hrana
		const top = (screenHeight / 2 * (1 + 1 / z)) - height;

		return {
			top,
			height,
			material,
			perc: hit.perc,
			distance: hit.distance
		};
	}
}

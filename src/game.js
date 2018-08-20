import Player from "./player";
import Level0 from "./level-0";
import Render from "./render";
import Vector2 from "./vector2";
import Ray from "./ray";
import Line from "./line";
import * as myMath from "./math";

// def smer pro yaw 0, pulka ctverce
const DIRECTION = new Vector2(0, 1);
const FOV = 60;
const TILE_HEIGHT = 1.2

export default class Game {
	constructor(texture) {
		this._texture = texture;
		this._gameLoopBind = this._gameLoop.bind(this);
		this._lastTime = 0;
		this._level = Level0.level;
		this._player = this._getPlayer(Level0.playerPosition);
		this._render = new Render(1024, 768);
		document.getElementById("container").appendChild(this._render.container);

		this._player.yaw = 0;
		this._player.setPosition(new Vector2(1.5, 1.5));

		requestAnimationFrame(this._gameLoopBind);
		/*setInterval(() => {
			this._loop();
			this._player.yaw += 5;
			if (this._player.yaw > 360) {
				this._player.yaw -= 360;
			}
		}, 250);
		*/
	}

	_gameLoop(time) {
		var seconds = (time - this._lastTime) / 1000;
		this._lastTime = time;

		if (seconds < 0.2) {
			// vykresleni
			this._drawFrame(seconds);
		}

		requestAnimationFrame(this._gameLoopBind);
	}

	_drawFrame(seconds) {
		let angle = this._player.yaw - FOV * 0.5;
		let angleInc = FOV / this._render.width;

		// sirka hrace 32px, vyska 32px
		// zed sirka 64px, vyska 64px
		const TEXTURE_SIZE = 64;
		const LIGHT_RANGE = 5;

		this._render.clear();

		for (let x = 0; x < this._render.width; x++) {
			// pro kazdy sloupec
			let ray = this._generateRay(angle);
			let track = this._track(ray);
			let z = track.hit.distance * Math.cos((this._player.yaw - angle) / 180 * Math.PI);
			let wallHeight = this._render.height * TILE_HEIGHT / z;
			let bottom = this._render.height / 2 * (1 + 1 / z);
			let top = bottom - wallHeight;
			let mat = track.hit.tile.material;

			// render zdi
			this._render._ctx.globalAlpha = 1;
			// obrazek, textura obrazek x, textura obrazek y, textura sirka, textura vyska; vykresleni souradnice x, vykresleni souradnice y, vykresleni sirka a vyska
			this._render._ctx.drawImage(this._texture, mat.x + Math.round(track.hit.perc * TEXTURE_SIZE), mat.y, 1, TEXTURE_SIZE, x, top, 1, wallHeight);

			// svetelnost zdi
			this._render._ctx.fillStyle = '#000000';
			this._render._ctx.globalAlpha = Math.max(track.hit.distance / LIGHT_RANGE, 0);
			this._render._ctx.fillRect(x, top, 1, wallHeight);

			angle += angleInc;
		}

		// rotace
		this._player.yaw += seconds * 10;
		if (this._player.yaw > 360) {
			this._player.yaw -= 360;
		}
	}

	_getPlayer(pos) {
		let player = new Player();
		player.setPosition(pos);

		return player;
	}

	_generateRay(angle = 0) {
		let origin = this._player.position.clone();
		let rad = (360 - angle) / 180 * Math.PI;
		let x = DIRECTION.x * Math.cos(rad) - DIRECTION.y * Math.sin(rad);
		let y = DIRECTION.x * Math.sin(rad) + DIRECTION.y * Math.cos(rad);
		let direction = new Vector2(x, -y); // -y = protoze chceme nahoru odecitat, ne pricitat

		return new Ray(origin, direction);
	}

	_track(ray) {
		let tiles = [];
		let hit = null;

		myMath.bresenhamLine(ray, posVec => {
			let output;
			let tile = this._level.getTile(posVec);
			tiles.push(tile);
			// je tam zed, dal nepokracujeme
			if (tile.wall.length) {
				let allHits = [];

				tile.wall.forEach(line => {
					let lineHit = myMath.rayLineIntersection(ray, line);

					if (lineHit) {
						let perc = line.start.distance(lineHit) / line.length;

						allHits.push({
							lineHit,
							perc,
							line,
							tile,
							distance: ray.origin.distance(lineHit)
						});
					}
				});

				if (allHits.length) {
					allHits.sort((a, b) => {
						return (a.distance - b.distance);
					});

					hit = allHits[0];
				}

				// ukoncime
				output = true;
			}

			return output;
		});

		return {
			tiles,
			hit
		};
	}
}

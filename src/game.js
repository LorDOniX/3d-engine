import Player from "./player";
import Level0 from "./level-0";
import Render from "./render";
import Vector2 from "./vector2";
import Ray from "./ray";
import Line from "./line";
import Params from "./params";
import * as myMath from "./math";

export default class Game {
	constructor() {
		this._gameLoopBind = this._gameLoop.bind(this);
		this._lastTime = 0;
		this._level = Level0.level;
		this._player = this._getPlayer(Level0.playerPosition);
		//this._player.setPosition(new Vector2(1.2, 1.3));
		this._render = new Render({
			width: 1024,
			height: 768,
			noShadow: true
		});
		this._keys = {
			left: false,
			right: false,
			up: false,
			down: false
		};
		document.getElementById("container").appendChild(this._render.container);

		this._run();
		//this._columnData(198, -18.3984375);
	}

	async _run() {
		await this._render.load();
		document.addEventListener("keydown", this);
		document.addEventListener("keyup", this);
		requestAnimationFrame(this._gameLoopBind);
	}

	handleEvent(e) {
		let keyCode;

		switch (e.type) {
			case "keydown":
				keyCode = e.which || e.keyCode;

				switch (keyCode) {
					case 37: this._keys.left = true; break; // vlevo
					case 39: this._keys.right = true; break; // vpravo
					case 38: this._keys.up = true; break; // vpred
					case 40: this._keys.down = true; break; // vpred
				}
				break;

			case "keyup":
				keyCode = e.which || e.keyCode;

				switch (keyCode) {
					case 37: this._keys.left = false; break; // vlevo
					case 39: this._keys.right = false; break; // vpravo
					case 38: this._keys.up = false; break; // vpred
					case 40: this._keys.down = false; break; // vpred
				}
				break;
		}
	}

	_gameLoop(time) {
		let seconds = (time - this._lastTime) / 1000;

		this._lastTime = time;

		if (seconds < 0.2) {
			// update pozice hrace
			this._playerUpdate(seconds);
			// vykresleni
			this._drawFrame(seconds);
		}

		requestAnimationFrame(this._gameLoopBind);
	}

	_playerUpdate(seconds) {
		if (this._keys.left || this._keys.right) {
			this._player.yaw = this._player.yaw + Params.PLAYER_MOVE_YAW * seconds * (this._keys.left ? -1 : 1);
		}

		if (this._keys.up || this._keys.down) {
			let testVec = this._moveVector(new Vector2(0, (Params.PLAYER_MOVE_DIRECTION + Params.MIN_DISTANCE) * seconds * (this._keys.up ? 1 : -1)), this._player.yaw);
			let testPos = this._player.position.plus(testVec);

			// neni to blokujici?
			if (!this._isBlocking(testPos)) {
				let moveVec = this._moveVector(new Vector2(0, Params.PLAYER_MOVE_DIRECTION * seconds * (this._keys.up ? 1 : -1)), this._player.yaw);
				let newPos = this._player.position.plus(moveVec);

				this._player.setPosition(newPos);
			}
		}
	}

	_isBlocking(v) {
		let tile = this._level.getTile(new Vector2(v.x >>> 0, v.y >>> 0));

		return (tile.wall.length);
	}

	_drawFrame(seconds) {
		let angle = this._player.yaw - Params.FOV * 0.5;
		let steps = this._render.width / Params.DRAW_WIDTH;
		let angleInc = Params.FOV / steps;

		this._render.clear();

		// pro kazdy sloupec
		for (let x = 0; x < steps; x++) {
			let columnData = this._columnData(x * Params.DRAW_WIDTH, angle);

			// vykreslime zed
			this._render.drawWall(columnData);

			// pro dalsi uhel
			angle += angleInc;
		}
	}

	_columnData(x, angle) {
		let ray = this._generateRay(angle);
		let track = this._track(ray, angle / 180 * Math.PI);
		// vzdalenost oka ke zdi - vynasobeni cos kvuli rybimu oku
		let z = track.distance * Math.cos((this._player.yaw - angle) / 180 * Math.PI);
		// vyska zdi
		let height = this._render.height * Params.TILE_HEIGHT / z;
		// spodni hrana
		let top = (this._render.height / 2 * (1 + 1 / z)) - height;
		// u x chceme pouze prouzek
		let tx = track.tile.material.x + Math.round(track.perc * Params.TEXTURE_SIZE);
		// y se bere cele
		let ty = track.tile.material.y;
		let lightRatio = Math.max(track.distance / Params.LIGHT_RANGE, 0);

		return {
			x,
			height,
			top,
			tx,
			ty,
			lightRatio
		};
	}

	_getPlayer(pos) {
		let player = new Player();
		player.setPosition(pos);

		return player;
	}

	_generateRay(angle = 0) {
		return new Ray(this._player.position.clone(), this._moveVector(Params.RAY_DIRECTION, angle));
	}

	_moveVector(v, angle = 0) {
		let rad = (360 - angle) / 180 * Math.PI;
		let x = v.x * Math.cos(rad) - v.y * Math.sin(rad);
		let y = v.x * Math.sin(rad) + v.y * Math.cos(rad);

		// -y = protoze chceme nahoru odecitat, ne pricitat
		return (new Vector2(x, -y));
	}

	_track(ray) {
		let output = {
			distance: 0,
			tile: null,
			perc: 0
		};

		myMath.castRayTrack(ray, posVec => {
			let lineOutput;
			let tile = this._level.getTile(posVec);

			// je tam zed, dal nepokracujeme
			if (tile.wall.length) {
				let allHits = [];

				tile.wall.forEach(line => {
					let lineHit = myMath.rayLineIntersection(ray, line);

					if (lineHit) {
						allHits.push({
							distance: ray.origin.distance(lineHit),
							perc: line.getPerc(lineHit)
						});
					}
				});

				if (allHits.length) {
					allHits.sort((a, b) => {
						return (a.distance - b.distance);
					});

					// prvni hit je vystupem
					output = Object.assign(allHits[0], {
						tile
					});
				}

				// ukoncime
				lineOutput = true;
			}

			return lineOutput;
		});

		return output;
	}
}

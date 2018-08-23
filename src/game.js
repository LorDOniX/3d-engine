import Player from "./player";
import Level0 from "./level-0";
import Render from "./render";
import Vector2 from "./vector2";
import Ray from "./ray";
import Line from "./line";
import Params from "./params";
import Sprite from "./sprite";
import Gun from "./gun";
import * as myMath from "./math";

export default class Game {
	constructor() {
		this._gameLoopBind = this._gameLoop.bind(this);
		this._lastTime = 0;
		this._level = Level0;
		this._player = this._getPlayer(new Vector2(2.5, 2.5));
		this._sprites = [
			new Sprite(Params.MATERIAL.LIGHT, new Vector2(1.5, 1.5)),
			new Sprite(Params.MATERIAL.TABLE, new Vector2(3.5, 1.5)),
			new Sprite(Params.MATERIAL.BARREL, new Vector2(1.5, 3.5))
		];
		this._render = new Render({
			width: Params.SIZE.WIDTH,
			height: Params.SIZE.HEIGHT
		});
		this._gun = new Gun(this._render);
		this._keys = {
			left: false,
			right: false,
			up: false,
			down: false
		};
		document.getElementById("container").appendChild(this._render.container);

		this._run();
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
					case 17:
						this._gun.shoot();
						break;
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
			let testVec = this._getMoveVector(seconds, true);
			let playerPos = this._player.position;
			let testPos = this._player.position.plus(testVec);
			let xTest = !this._isBlocking(testPos.x, playerPos.y);
			let yTest = !this._isBlocking(playerPos.x, testPos.y);

			if (xTest || yTest) {
				let newVec = this._getMoveVector(seconds);
				let newPos = this._player.position.plus(newVec);

				this._player.setPosition(new Vector2(xTest ? newPos.x : playerPos.x, yTest ? newPos.y : playerPos.y));
			}
		}
	}

	_getMoveVector(seconds, withMinDistance) {
		let minDistance = withMinDistance ? Params.MIN_DISTANCE : 0;
		let dir = this._keys.up ? 1 : -1;
		let y = Params.PLAYER_MOVE_DIRECTION * seconds * dir + minDistance * dir;

		// novy smerovy vektor posunuty podle hrace
		return (myMath.moveVector(new Vector2(0, y), this._player.yaw))
	}

	_isBlocking(x, y) {
		let tile = this._level.getTile(new Vector2(x >>> 0, y >>> 0));

		return (tile.hasWalls);
	}

	_drawFrame(seconds) {
		let angle = this._player.yaw - Params.FOV * 0.5;
		let steps = this._render.width / Params.DRAW_WIDTH;
		let angleInc = Params.FOV / steps;

		this._render.clear();

		// pro kazdy sloupec
		for (let stepX = 0; stepX < steps; stepX++) {
			// tabulka spritu pro kazdy uhel
			let spritesTable = this._getSpritesTable(angle);
			// aktualni x
			let x = stepX * Params.DRAW_WIDTH;
			// paprsek
			let ray = new Ray(this._player.position.clone(), myMath.moveVector(Params.RAY_DIRECTION, angle));
			// seznam tile
			let tileData = this._tileData(ray, angle, Params.TILE_HEIGHT);

			// vykreslime zed
			this._render.drawWall(x, tileData.wall);

			// sprites
			this._drawSprites(x, ray, angle, Params.TILE_HEIGHT, tileData.tiles, spritesTable);

			// zbran a zamerovac
			this._gun.draw(seconds);

			// pro dalsi uhel
			angle += angleInc;
		}
	}

	_getSpritesTable(angle) {
		let table = {};

		this._sprites.forEach(sprite => {
			let line = sprite.getLine(angle);
			let startPos = (line.start.x >>> 0) + "|" + (line.start.y >>> 0);
			let endPos = (line.end.x >>> 0) + "|" + (line.end.y >>> 0);

			// vytvorime
			if (!(startPos in table)) {
				table[startPos] = [];
			}

			if (!(endPos in table)) {
				table[endPos] = [];
			}

			table[startPos].push(line);

			if (startPos != endPos) {
				table[endPos].push(line);
			}
		});

		return table;
	}

	_getPlayer(pos) {
		let player = new Player();
		player.setPosition(pos);

		return player;
	}

	_tileData(ray, angle, tileHeight) {
		let tiles = [];
		let wall = null;

		myMath.castRayTrack(ray, position => {
			let tile = this._level.getTile(position);

			// je tam zed, dal nepokracujeme
			if (tile.hasWalls) {
				wall = this._getWall(ray, tile, angle, tileHeight);
				// ukoncime
				return true;
			}
			else {
				tiles.push({
					tile,
					position
				});
			}
		});

		// preskladame pole, chceme vykreslovat od konce
		tiles.reverse();

		return {
			tiles,
			wall
		};
	}

	_getWall(ray, tile, angle, tileHeight) {
		let hits = [];

		tile.walls.forEach(line => {
			let lineHit = this._getLineHit(ray, line);

			if (lineHit) {
				hits.push(lineHit);
			}
		});

		hits.sort((a, b) => {
			return (a.distance - b.distance);
		});

		// vybrana line
		let selLine = hits[0];

		// vratime data
		return Object.assign(this._project(selLine.distance, angle, tileHeight), selLine);
	}

	_getLineHit(ray, line) {
		let lineHit = myMath.rayLineIntersection(ray, line);

		if (lineHit) {
			return {
				distance: ray.origin.distance(lineHit),
				perc: line.getPerc(lineHit),
				material: line.material
			};
		}
		else return null;
	}

	_project(distance, angle, tileHeight) {
		// vzdalenost oka ke zdi - vynasobeni cos kvuli rybimu oku
		let z = distance * Math.cos((this._player.yaw - angle) / 180 * Math.PI);
		// vyska zdi
		let height = this._render.height * tileHeight / z;
		// spodni hrana
		let top = (this._render.height / 2 * (1 + 1 / z)) - height;

		return {
			height,
			top
		};
	}

	_drawSprites(x, ray, angle, tileHeight, tiles, spritesTable) {
		tiles.forEach(item => {
			let pos = item.position.x + "|" + item.position.y;

			if (pos in spritesTable) {
				let hits = [];

				spritesTable[pos].forEach(line => {
					let lineHit = this._getLineHit(ray, line);

					if (lineHit) {
						hits.push(Object.assign(this._project(lineHit.distance, angle, tileHeight), lineHit));
					}
				});

				if (hits.length) {
					hits.forEach(data => {
						this._render.drawTexture(x, data);
					});
				}
			}
		});
	}
}

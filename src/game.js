import Player from "./player";
import Level0 from "./level-0";
import Render from "./render";
import Vector2 from "./vector2";
import Ray from "./ray";
import Line from "./line";
import Params from "./params";
import Sprite from "./sprite";
import * as myMath from "./math";

export default class Game {
	constructor() {
		this._gameLoopBind = this._gameLoop.bind(this);
		this._lastTime = 0;
		this._level = Level0;
		this._player = this._getPlayer(new Vector2(2.5, 2.5));
		this._sprites = [new Sprite(Params.SPRITES.LIGHT, new Vector2(1.5, 1.5))];
		this._render = new Render({
			width: Params.SIZE.WIDTH,
			height: Params.SIZE.HEIGHT
		});
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
						this._render.shoot();
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

		return (tile.wall.length != 0);
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
			// sprite
			columnData.sprites.forEach(sprite => {
				this._render.drawSprite(columnData, sprite);
			});
			// zbran a zamerovac
			this._render.drawCrosshair(seconds);
			this._render.drawGun(seconds);

			// pro dalsi uhel
			angle += angleInc;
		}
	}

	_columnData(x, angle) {
		let ray = new Ray(this._player.position.clone(), myMath.moveVector(Params.RAY_DIRECTION, angle));
		let spritesTable = this._getSpritesTable(angle);
		let track = this._track(ray, spritesTable);
		// vzdalenost oka ke zdi - vynasobeni cos kvuli rybimu oku
		let z = track.distance * Math.cos((this._player.yaw - angle) / 180 * Math.PI);
		// vyska zdi
		let height = this._render.height * Params.TILE_HEIGHT / z;
		// spodni hrana
		let top = (this._render.height / 2 * (1 + 1 / z)) - height;
		// u x chceme pouze prouzek
		let tx = track.tile.material.x + Math.round(track.perc * (Params.TEXTURE_SIZE - 1));
		// y se bere cele
		let ty = track.tile.material.y;
		let lightRatio = Math.max(track.distance / Params.LIGHT_RANGE, 0);

		return {
			x,
			height,
			top,
			tx,
			ty,
			lightRatio,
			sprites: track.sprites
		};
	}

	_getSpritesTable(angle) {
		let table = {};

		this._sprites.forEach(sprite => {
			let line = sprite.getLine(angle);
			let item = {
				line,
				type: sprite.type
			};
			let startPos = (line.start.x >>> 0) + "|" + (line.start.y >>> 0);
			let endPos = (line.end.x >>> 0) + "|" + (line.end.y >>> 0);

			// vytvorime
			if (!(startPos in table)) {
				table[startPos] = [];
			}

			if (!(endPos in table)) {
				table[endPos] = [];
			}

			table[startPos].push(item);

			if (startPos != endPos) {
				table[endPos].push(item);
			}
		});

		return table;
	}

	_getPlayer(pos) {
		let player = new Player();
		player.setPosition(pos);

		return player;
	}

	_track(ray, spritesTable) {
		let output = {
			distance: 0,
			tile: null,
			perc: 0,
			sprites: []
		};

		myMath.castRayTrack(ray, posVec => {
			let lineOutput;
			let tile = this._level.getTile(posVec);
			let pos = posVec.x + "|" + posVec.y;

			if (pos in spritesTable) {
				spritesTable[pos].forEach(item => {
					let spriteHit = myMath.rayLineIntersection(ray, item.line);

					if (spriteHit) {
						output.sprites.push({
							distance: ray.origin.distance(spriteHit),
							perc: item.line.getPerc(spriteHit),
							type: item.type
						});
					}
				});
			}

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

				allHits.sort((a, b) => {
					return (a.distance - b.distance);
				});

				// prvni hit je vystupem
				let topItem = allHits[0];
				output.distance = topItem.distance;
				output.tile = tile;
				output.perc = topItem.perc;

				// ukoncime
				lineOutput = true;
			}

			return lineOutput;
		});

		output.sprites.sort((a, b) => {
			return (a.distance - b.distance);
		});

		return output;
	}
}

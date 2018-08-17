class Save {
	getIntersection(ray) {
		let items = [];
		let rom = [];

		this._items.forEach(line => {
			let lm = [];

			line.forEach(tile => {
				let test = myMath.raySquareIntersection(ray, tile.aabb);

				if (test) {
					myMath.raySquareIntersection(ray, tile.aabb);
					let dist = ray.origin.distance(tile.center);

					items.push({
						x: tile.position.x,
						y: tile.position.y,
						tile,
						dist,
						isWall: tile.type == Material.WALL
					});

					lm.push(parseFloat(dist.toFixed(2)));
				}
				else {
					lm.push(0);
				}
			});

			rom.push(lm);
		});

		console.log(items);
		console.log(rom);
	}

	xyz(ray, line) {
		return myMath.rayLineIntersection(ray, line);
	}

	xyz2() {
		let material = null;

		switch (i) {
			case 0:
				material = Material.EMPTY
				break;

			case 1:
				material = Material.WALL;
				break;
		}

		this._player.setPosition(0.5, 4.5);
		let track = this._player.track(this._player.generateRay(45), this._level.width, this._level.height);
		console.log(track);

		if (0) {
			// loop
			let midAngle = this._player.yaw;
			let fromAngle = midAngle - this._player.fovHalf;
			let toAngle = midAngle + this._player.fovHalf;

			let r1 = this._player.generateRay(fromAngle);
			let r2 = this._player.generateRay(midAngle);
			let r3 = this._player.generateRay(toAngle);

			//this._level.getIntersection(this._player.generateRay(320));
			console.log(this._level.xyz(this._player.generateRay(0), new Line(0, 0, 4, 0)));
			console.log(this._level.xyz(this._player.generateRay(40), new Line(0, 0, 4, 0)));
			console.log(this._level.xyz(this._player.generateRay(-40), new Line(0, 0, 4, 0)));
			console.log(this._level.xyz(this._player.generateRay(-10), new Line(0, 0, 4, 0)));
		}

		let angle = this._player.yaw - FOV * 0.5;
		let angleInc = FOV / this._render.width;
		let heightMiddle = this._render.height * 0.5;
		let playerViewDistance = (this._render.width * 0.5) / Math.tan(FOV / 360 * Math.PI);

		// sirka hrace 32px, vyska 32px
		// zed sirka 64px, vyska 64px

		console.log(playerViewDistance);
	}

	_t() {
		let o = myMath.raySquareIntersection(new Ray(new Vector2(0.5, 0.5), new Vector2(0, 1)), {
			lb: { x: 0, y: 3 },
			rt: { x: 1, y: 4 }
		});
		console.log(o);
	}

	track(ray, width, height) {
		let items = [];
		let v = ray.origin.plus(ray.direction);

		while (true) {
			let newVec = this._getPos(v, width, height);

			if (!newVec) break;

			let f = items.filter(i => i.isEqual(newVec));

			if (!f.length) {
				items.push(newVec);
			}
			
			v.plusApply(ray.direction);
		}

		return items;
	}

	_getPos(v2, width, height) {
		if (v2.x < 0 || v2.y < 0 || v2.x > width || v2.y > height) return null;
		
		return new Vector2(v2.x >>> 0, v2.y >>> 0);
	}
}

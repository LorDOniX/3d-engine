import * as $dom from "./onix/dom";
import Ply from "./ply";
import Geometry from "./geometry";
import Camera from "./camera";
import Vector3 from "./vector3";
import BVH from "./bvh";
import Render from "./render";

const SIZE = {
	TRI_69K: "/model/bun_zipper.ply",
	TRI_16K: "/model/bun_zipper_res2.ply",
	TRI_4K: "/model/bun_zipper_res3.ply",
	TRI_1K: "/model/bun_zipper_res4.ply"
};

class Main {
	constructor() {
		this._startTime = Date.now();
		this._ply = new Ply();
		this._camera = new Camera(640 * 0.25, 480 * 0.25);
		this._camera.setEye(new Vector3(0.5, 0.5, -0.5));
		this._render = new Render(this._camera);

		this._frame();

		document.addEventListener("keydown", e => {
			let keyCode = e.keyCode;
			let step = 5;

			switch (keyCode) {
				case 37:
					// vlevo
					this._camera.rotateY(-step);
					this._frame();
					break;

				case 39:
					// vpravo
					this._camera.rotateY(step);
					this._frame();
					break;

				case 38:
					this._camera.rotateX(-step);
					this._frame();
					break;

				case 40:
					// down
					this._camera.rotateX(step);
					this._frame();
					break;
			}


			console.log();
		});
	}

	_frame() {
		this._render.render();
	}
};

$dom.load(() => {
	new Main();
});

/**
		// x - pozice xy
		// z - nahoru a dolu
		
		camera.rotateX(90 * 0);
		camera.rotateY(10); // yaw
		camera.rotateZ(-90 * 0);
		new Render(camera);
		/*camera.setTransformationMatrix([
			[-0.982, 0.064, 0.177],
			[-0.189, -0.334, -0.924],
			[0, 0.940, -0.340]
		]);
		//Object { yaw: -180, pitch: -11, roll: 110 }
		// x roll, y yaw, z pitch
		//camera.rotateY(-180);
		//camera.rotateX(110); // nahoru a dolu
		//camera.rotateY(10);
		//camera.rotateZ(10);
		//camera.rotateX(15); // nahoru a dolu
		//camera.rotateY(15) // levo a vpravo
		//camera.rotateZ(25) dokola
 */

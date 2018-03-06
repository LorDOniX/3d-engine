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

		this._run();
	}

	async _run() {
		let camera = new Camera(320, 240);
		// y - vzdalenost od kamery
		// x - pozice xy
		// z - nahoru a dolu
		camera.setEye(new Vector3(-0.067, 0.237, 0.184));
		/*camera.setTransformationMatrix([
			[-0.982, 0.064, 0.177],
			[-0.189, -0.334, -0.924],
			[0, 0.940, -0.340]
		]);
		*/
		//Object { yaw: -180, pitch: -11, roll: 110 }
		// x roll, y yaw, z pitch
		//camera.rotateY(-180);
		camera.rotateX(110); // nahoru a dolu
		camera.rotateY(10);
		camera.rotateZ(10);
		//camera.rotateX(15); // nahoru a dolu
		//camera.rotateY(15) // levo a vpravo
		//camera.rotateZ(25) dokola
		await this._ply.load(SIZE.TRI_69K);
		let geometry = new Geometry(this._ply);
		let bvh = new BVH(geometry);
		let render = new Render(camera, bvh, {
			startTime: this._startTime
		});
		await render.render();
	}
};

$dom.load(() => {
	new Main();
});

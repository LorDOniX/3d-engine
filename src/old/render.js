import Graphics from "./graphics";
import Color from "./color";
import Cubemap from "./cubemap";
import Material from "./material";
import Light from "./light";
import Vector3 from "./vector3";
import Ray from "./ray";
import Triangle from "./triangle";
import { rayTriangleIntersection97 } from "./math";

export default class Render {
	constructor(camera, opts) {
		this._opts = Object.assign({
		}, opts);
		this._camera = camera;
		this._graphics = new Graphics(document.getElementById("canvas"), camera);
		this._triangles = [];
		
		let triangle = new Triangle(new Vector3(0, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 1, 1), Color.red());
		let triangle2 = new Triangle(new Vector3(0, 0, 0), new Vector3(0, 1, 1), new Vector3(0, 0, 1), Color.red());

		let triangle3 = new Triangle(new Vector3(1, 0, 0), new Vector3(1, 1, 0), new Vector3(1, 1, 1), Color.green());
		let triangle4 = new Triangle(new Vector3(1, 0, 0), new Vector3(1, 1, 1), new Vector3(1, 0, 1), Color.green());
		this._triangles.push(triangle);
		this._triangles.push(triangle2);
		this._triangles.push(triangle3);
		this._triangles.push(triangle4);
	}

	render() {
		let width = this._camera.width;
		let height = this._camera.height;
		let start = Date.now();
		let imgData = this._graphics.createImageData(width, height);
		let d = imgData.data;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let ray = this._camera.generateRay(x, y);
				let color;

				this._triangles.forEach(triangle => {
					rayTriangleIntersection97(ray, triangle);
				});

				if (ray.changed) {
					color = ray.getTriangle().color;
				}
				else {
					color = Color.white();
				}

				// nastavime barvu
				let start = (x + y * width) * 4;
				d[start] = color.r;
				d[start + 1] = color.g;
				d[start + 2] = color.b;
				d[start + 3] = color.a || 255;
			}
		}

		this._graphics.putImageData(imgData);

		console.log(`${(Date.now() - start) / 1000}`);
	}
}

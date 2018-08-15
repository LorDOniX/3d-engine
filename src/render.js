import * as myMath from "./math";
import Ray from "./ray";
import Vector2 from "./vector2";

export default class Render {
	constructor() {
		let o = myMath.raySquareIntersection(new Ray(new Vector2(0.5, 0.5), new Vector2(0, 1)), {
			lb: { x: 0, y: 3 },
			rt: { x: 1, y: 4 }
		});
		console.log(o);
	}
}

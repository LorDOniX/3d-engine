import * as $dom from "./onix/dom";
import Game from "./game";

class Main {
	constructor() {
		let img = new Image();
		img.onload = e => {
			new Game(img);
		};
		img.src = "/img/walls.png";
	}
};

$dom.load(() => {
	new Main();
});

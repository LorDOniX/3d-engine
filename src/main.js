import * as $dom from "./onix/dom";
import Game from "./game";

class Main {
	constructor() {
		this._game = new Game();
	}
};

$dom.load(() => {
	new Main();
});

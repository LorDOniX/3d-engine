import * as $dom from "./onix/dom";
import Render from "./render";

class Main {
	constructor() {
		this._render = new Render();
	}
};

$dom.load(() => {
	new Main();
});

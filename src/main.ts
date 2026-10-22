import "../less/main.less";
import Game from "./game";

function start(): void {
	const container = document.getElementById("container");

	if (!container) {
		throw new Error("Missing #container element");
	}

	new Game(container);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", start);
}
else {
	start();
}

#!/usr/bin/env node
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8004;

const MAIN_PATH = "static";

// paths
app.use("/js", express.static(path.join(__dirname, MAIN_PATH, 'js')));
app.use("/lib", express.static(path.join(__dirname, MAIN_PATH, 'lib')));
app.use("/css", express.static(path.join(__dirname, MAIN_PATH, 'css')));
app.use("/model", express.static(path.join(__dirname, MAIN_PATH, 'model')));
app.use("/img", express.static(path.join(__dirname, MAIN_PATH, 'img')));

app.get("/api/bunny/", function(req, res) {
	res.json({
		name: "test API item",
		value: 42
	});
});

// default
app.get('/*', function(req, res) {
	res.sendfile("./index.html");
});

console.log("Server running on the port " + port);
app.listen(port);

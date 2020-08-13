#!/usr/bin/env node

var child_process = require("child_process");
var fs = require("fs");
var path = require("path");


var configstring = fs.readFileSync("package.json");
/**
 * @type {{
 * 		dependencies?:{[id:string]:string},
 * 		devDependencies?:{[id:string]:string},
 * 		peerDependencies?:{[id:string]:string}
 * }
 */
var config = JSON.parse(configstring);

/** @type {string[]} */
var alldeps = [];
if (config.dependencies) { alldeps.push.apply(alldeps, Object.keys(config.dependencies)); }
if (config.devDependencies) { alldeps.push.apply(alldeps, Object.keys(config.devDependencies)); }
if (config.peerDependencies) { alldeps.push.apply(alldeps, Object.keys(config.peerDependencies)); }

/** @type {string[]} */
var linkpacks = [];
for (var i in alldeps) {
	var dep = alldeps[i];
	var match = dep.match(/^(@alt1\/[\w-]+)$/);
	if (!match) { continue; }
	linkpacks.push(match[1]);
}

if (linkpacks.length > 0) {
	var linkstring = linkpacks.join(" ");
	//sanity check on shell command
	linkstring = linkstring.replace(/[^@\/\w -]/g);
	var command = "npm link " + linkstring;
	console.log(">> " + command);
	child_process.spawnSync(command, [], { stdio: "inherit", shell: true });
	console.log("done");
} else {
	console.log("no @alt1/* packages found");
}
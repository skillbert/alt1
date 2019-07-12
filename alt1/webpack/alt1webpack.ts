import * as webpack from "webpack";
import * as path from "path";
import * as glob from "glob";
import * as fs from "fs";
import Alt1Chain from "./index";


var nodeCompatExternals = ["pngjs", "node-fetch"];

export function addAlt1Externals(config: Alt1Chain) {
	var packages = findSubPackages(path.resolve(__dirname, ".."));
	for (var a in packages) {
		config.addExternal(a, packages[a].name, packages[a].umdName);
	}
	for (var ext of nodeCompatExternals) {
		config.addExternal(ext, ext, ext);
	}
}

export function chainAlt1Lib(rootdir: string) {
	var config = new Alt1Chain(rootdir);
	var packagefile = path.resolve(config.rootdir, "package.json");
	var pack = getPackageInfo(packagefile);
	config.makeUmd(pack.name, pack.umdName);
	config.chain.resolveLoader.modules.add(path.resolve(__dirname, "../../node_modules"));
	config.chain.resolveLoader.modules.add(path.resolve(__dirname, "../"));

	var alldeps = { ...pack.optionalDependencies, ...pack.dependencies };
	for (var dep in alldeps) {
		var str = alldeps[dep];
		var m = str.match(/^file:(.*)$/);
		if (m) {
			var subpack = getPackageInfo(path.resolve(pack.dir, m[1], "package.json"));
			config.addExternal(dep, subpack.name, subpack.umdName);
		} else {
			config.addExternal(dep, dep, "unkown");
		}
	}

	var entryfiles = ["index.tsx", "index.ts", "index.jsx", "index.js"];

	var foundentry = false;
	for (var entryfile of entryfiles) {
		var entrypath = path.resolve(rootdir, entryfile);
		if (fs.existsSync(entrypath)) {
			foundentry = true;
			config.entry(entrypath);
			break;
		}
	}
	if (!foundentry) { throw new Error("couldn't find entry file in " + rootdir); }
	config.output("./dist");
	return config;
}
var cachedPackageMeta: { [name: string]: { dir: string, umdName: string, name: string } } = null;

export type NpmConfig = {
	name?: string,
	umdGlobal?: string,
	runeappsLibNameRoot?: string,
	dependencies: { [name: string]: string },
	optionalDependencies: { [name: string]: string }
};

function getPackageInfo(fileabs: string) {
	var cnf = JSON.parse(fs.readFileSync(fileabs, { encoding: "utf-8" })) as Partial<NpmConfig>
	if (!cnf.name) { throw "no package name on " + fileabs; }
	if (!cnf.umdGlobal && !cnf.runeappsLibNameRoot) { throw "no umdGlobal on " + fileabs; }

	return {
		dir: path.dirname(fileabs),
		name: cnf.name,
		umdName: cnf.umdGlobal || cnf.runeappsLibNameRoot,
		dependencies: cnf.dependencies || {},
		optionalDependencies: cnf.optionalDependencies || {}
	};
}

export function findSubPackages(pathstr: string) {
	if (!cachedPackageMeta) {
		var filenames = glob.sync(pathstr + "/**/package.json");
		cachedPackageMeta = {};
		for (var file of filenames) {
			var cnf = getPackageInfo(file);
			if (cnf) {
				cachedPackageMeta[cnf.name] = cnf;
			}
		}
	}
	return cachedPackageMeta;
}

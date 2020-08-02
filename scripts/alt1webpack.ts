import * as webpack from "webpack";
import * as path from "path";
import * as glob from "glob";
import * as fs from "fs";
import Alt1Chain, { getPackageInfo } from "@alt1/webpack";



export function addAlt1Externals(config: Alt1Chain) {
	var packages = findSubPackages(path.resolve(__dirname, "../alt1"));
	for (var a in packages) {
		config.addExternal(a, packages[a].name, packages[a].umdName);
	}
}

export function chainAlt1Lib(rootdir: string) {
	var pack = getPackageInfo(path.resolve(rootdir, "package.json"));
	var rootpack = null as ReturnType<typeof getPackageInfo> | null;
	for (let parentdir = rootdir; true;) {
		if (fs.existsSync(path.resolve(parentdir, "lerna.json"))) {
			rootpack = getPackageInfo(path.resolve(parentdir, "package.json"));
			break;
		}
		let newparent = path.resolve(parentdir, "..");
		if (newparent == parentdir) { break; }
		parentdir = newparent;
	}
	var filenamematch = pack.name.match(/^@alt1\/([\w-]+)$/);
	if (!filenamematch) { throw new Error("Can't get file name for " + pack.name); }
	var config = new Alt1Chain(rootdir);
	config.makeUmd(pack.name, pack.umdName);
	config.chain.resolveLoader.modules.add(path.resolve(__dirname, "../node_modules"));
	config.chain.resolveLoader.modules.add(path.resolve(__dirname, "../alt1"));

	var alldeps = { ...pack.optionalDependencies, ...pack.dependencies };
	for (var dep in alldeps) {
		var localdep = rootpack?.dependencies[dep]?.match(/^file:(.*)$/);
		if (localdep) {
			var subpack = getPackageInfo(path.resolve(rootpack.dir, localdep[1], "package.json"));
			config.addExternal(dep, subpack.name, subpack.umdName);
		} else {
			config.addExternal(dep, dep, "unknown");
		}
	}

	var entryfiles = ["index.tsx", "index.ts", "index.jsx", "index.js"];

	var foundentry = false;
	for (var entryfile of entryfiles) {
		var entrypath = path.resolve(rootdir, entryfile);
		if (fs.existsSync(entrypath)) {
			foundentry = true;
			config.entry("index", entrypath);
			break;
		}
	}
	if (!foundentry) { throw new Error("couldn't find entry file in " + rootdir); }
	config.output("./dist");
	return config;
}
var cachedPackageMeta: { [name: string]: ReturnType<typeof getPackageInfo> } = null;

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

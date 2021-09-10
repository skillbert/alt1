import * as webpack from "webpack";
import * as path from "path";
import * as glob from "glob";
import * as fs from "fs";
//import actual index.ts here as otherwise it will get redirected to ./dist/min.js which is the old version
import Alt1Chain, { getPackageInfo } from "@alt1/webpack/index";



export function addAlt1Externals(config: Alt1Chain) {
	var packages = findSubPackages(path.resolve(__dirname, "../alt1"));
	for (var a in packages) {
		config.addExternal(a, packages[a].name, packages[a].umdName);
	}
}

export function chainAlt1Lib(rootdir: string) {
	var pack = getPackageInfo(path.resolve(rootdir, "package.json"));
	var rootpack: ReturnType<typeof getPackageInfo> | null = null;
	for (let parentdir = rootdir; true;) {
		if (fs.existsSync(path.resolve(parentdir, "lerna.json"))) {
			rootpack = getPackageInfo(path.resolve(parentdir, "package.json"));
			break;
		}
		let newparent = path.resolve(parentdir, "..");
		if (newparent == parentdir) { break; }
		parentdir = newparent;
	}
	if (!rootpack) { throw new Error("can't find root package"); }
	var filenamematch = pack.name.match(/^@alt1\/([\w-]+)$/);
	if (!filenamematch) { throw new Error("Can't get file name for " + pack.name); }
	var config = new Alt1Chain(rootdir, { nodejs: pack.target == "node" });
	config.makeUmd(pack.name, pack.umdName);
	//config.chain.resolveLoader.modules.add(path.resolve(__dirname, "../node_modules"));
	//config.chain.resolveLoader.modules.add(path.resolve(__dirname, "../alt1"));

	var alldeps = { ...pack.optionalDependencies, ...pack.dependencies };
	for (var dep in alldeps) {
		var localdep = dep.match(/^@alt1\/([\w-]+)$/);
		if (localdep) {
			var subpack = getPackageInfo(path.resolve(rootpack.dir, "alt1", localdep[1], "package.json"));
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
	config.chain.output.filename("[name].js");
	return config;
}
var cachedPackageMeta: { [name: string]: ReturnType<typeof getPackageInfo> } | null = null;

export function findSubPackages(pathstr: string) {
	if (!cachedPackageMeta) {
		var filenames = glob.sync(pathstr + "/**/package.json", { ignore: "**/node_modules/**" });
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

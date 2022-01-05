import * as webpack from "webpack";
import * as path from "path";
import * as glob from "glob";
import * as fs from "fs";
//import actual src here as otherwise it will get redirected to ./dist/min.js which is the old version
import Alt1Chain, { getPackageInfo } from "../alt1/webpack/src";
import EmitAllPlugin from "./emitallplugin";



export function addAlt1Externals(config: Alt1Chain) {
	var packages = findSubPackages(path.resolve(__dirname, "../alt1"));
	for (var a in packages) {
		config.addExternal(a, packages[a].name, packages[a].umdName);
	}
}

export function chainAlt1Lib(rootdir: string, env: Record<string, string | boolean>) {
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

	//find entry file
	//TODO use package.json "runeappsLibEntry" instead
	var entryfiles = ["src/index.tsx", "src/index.ts", "src/index.jsx", "src/index.js", "index.tsx", "index.ts", "index.jsx", "index.js"];

	var entrypath = "";
	for (var entryfile of entryfiles) {
		var file = path.resolve(rootdir, entryfile);
		if (fs.existsSync(file)) {
			entrypath = file;
			break;
		}
	}
	if (!entrypath) { throw new Error("couldn't find entry file in " + rootdir); }

	var config = new Alt1Chain(path.dirname(entrypath), env, { nodejs: pack.target == "node" });
	config.entry("index", path.basename(entrypath));

	config.makeUmd(pack.name, pack.umdName);
	config.chain.plugin("EmitAllPlugin").use(EmitAllPlugin);

	//TODO obsolete now?
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

	let outdir = path.resolve(pack.dir, path.dirname(pack.main));
	//speed up compilation and prevent error spam from (uncompiled) other libs
	config.tsOptions.context = config.rootdir;
	config.tsOptions.compilerOptions.declarationDir = outdir;
	config.output(outdir);
	config.chain.output.filename("[name].bundle.js");
	//prevent libs from using their own dist as source for index.ts
	//TODO obsolete?
	config.chain.resolve.mainFields.prepend("runeappsLibEntry").add("module").add("main");
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

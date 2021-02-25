import * as path from "path";
import * as util from "./alt1webpack";
import * as glob from "glob";
import * as fs from "fs";
var rootdir = path.resolve(__dirname, "..");
var typesdir = path.resolve(rootdir, "types");
var packs = util.findSubPackages(path.resolve(rootdir, "alt1"));

for (var name in packs) {
	var pack = packs[name];
	//currently all packages use the source as types directly instead
	if (pack.types == "./types/") {
		var rel = path.relative(rootdir, pack.dir);
		var types = path.resolve(typesdir, rel);
		var outdir = path.resolve(pack.dir, pack.types);
		console.log(types, "->", outdir, "\t\t");

		var files = glob.sync(types + "/*");
		//console.log(files);
		for (var file of files) {
			var dtsrel = path.relative(types, file);
			var to = path.resolve(outdir, dtsrel);
			fs.mkdirSync(path.dirname(to), { recursive: true } as any);
			fs.copyFileSync(file, to)
		}
	}
}
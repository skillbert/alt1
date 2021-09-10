import * as path from "path";
import * as util from "./alt1webpack";
import * as glob from "glob";
import * as fs from "fs";
var rootdir = path.resolve(__dirname, "..");
var typesdir = path.resolve(rootdir, "types");
var packs = util.findSubPackages(path.resolve(rootdir, "alt1"));

for (var name in packs) {
	var pack = packs[name];
	if (pack.types != "./dist/") {
		console.log("skipping typs copy on " + pack.name + " as it has an unexpected types dir");
		continue;
	}
	var rel = path.relative(path.resolve(rootdir, "alt1"), pack.dir);
	var types = path.resolve(typesdir, rel);
	var outdir = path.resolve(pack.dir, pack.types);
	console.log(types, "->", outdir, "\t\t");

	var files = glob.sync(types + "/*");
	for (var file of files) {
		var dtsrel = path.relative(types, file);
		var to = path.resolve(outdir, dtsrel);
		fs.mkdirSync(path.dirname(to), { recursive: true } as any);

		if (file.match(/\.d\.ts\.map$/)) {
			let dtsmap: { sources: string[] } = JSON.parse(fs.readFileSync(file, "utf-8"));
			dtsmap.sources = dtsmap.sources.map(src => {
				let srcfile = path.resolve(path.parse(file).dir, src);
				let relpath = path.relative(path.parse(to).dir, srcfile);
				//whyyyyyyyy
				return relpath.split(path.sep).join(path.posix.sep);
			});
			fs.writeFileSync(to, JSON.stringify(dtsmap));
		} else {
			fs.copyFileSync(file, to);
		}
	}
}
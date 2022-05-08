import A1webpack from "../webpack/src";
import * as fs from "fs";
import * as path from "path";
import Alt1Chain from "../webpack/src";

module.exports = (env: Record<string, string | boolean>) => {
	var configs: Alt1Chain[] = [];

	//standard build steps
	// configs.push(chainAlt1Lib(__dirname, env));

	//force a build of font-loader
	//we have to do this since i fked up and created a circular dependency with fonts
	// configs.push(chainAlt1Lib(path.resolve(__dirname, "../font-loader"), env));

	//extra builds for fonts
	var fontdir = path.resolve(__dirname, "src/fontssrc");
	var addfonts = function (relpath: string) {
		var subdir = path.resolve(fontdir, relpath);
		var files = fs.readdirSync(subdir);
		for (var file of files) {
			var m = file.match(/([\w-]+)\.fontmeta\.json$/i);
			var fullfile = path.resolve(subdir, file);
			if (m) {
				var fontname = m[1];
				var fontcnf = new A1webpack(__dirname, {}, env);
				fontcnf.chain.output.path(path.resolve(__dirname, "./fonts/", relpath));
				fontcnf.chain.output.filename("[name].js");
				fontcnf.makeUmd(fontname, "OCR_" + fontname);
				fontcnf.entry(fontname, fullfile);
				fontcnf.chain.set("devtool", undefined);
				fontcnf.chain.module.rule("jsonfile")
					.oneOf("fontmeta")
					.use("font-loader").loader("@alt1/font-loader/src");
				configs.push(fontcnf);
			} else if (fs.statSync(fullfile).isDirectory()) {
				addfonts(path.join(relpath, file));
			}

		}
	}
	addfonts("");

	configs.forEach(c => c.chain.resolveLoader.modules.add(path.resolve(__dirname, "../../node_modules")).add(path.resolve(__dirname, "../")));
	let configobjs = configs.map(c => c.toConfig());

	// console.log(configobjs);
	return configobjs;
}
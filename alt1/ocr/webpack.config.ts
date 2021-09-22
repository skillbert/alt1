import A1webpack from "../webpack/src";
import * as fs from "fs";
import * as path from "path";
import { chainAlt1Lib, addAlt1Externals } from "../../scripts/alt1webpack";
import EmitAllPlugin from "../../scripts/emitallplugin";
import Alt1Chain from "../webpack/src";

var configs: Alt1Chain[] = [];

//standard build steps
configs.push(chainAlt1Lib(__dirname));

//extra builds for fonts
var fontdir = path.resolve(__dirname, "src/fontssrc");
var files = fs.readdirSync(fontdir);
for (var file of files) {
	var m = file.match(/([\w-]+)\.fontmeta\.json$/i);
	if (m) {
		var fontname = m[1];
		var fontcnf = new A1webpack(__dirname);
		fontcnf.chain.output.path(path.resolve(__dirname, "./fonts"));
		fontcnf.chain.output.filename("[name].js");
		fontcnf.makeUmd(fontname, "OCR_" + fontname);
		fontcnf.entry(fontname, path.resolve(fontdir, file));
		fontcnf.chain.set("devtool", undefined);
		fontcnf.chain.module.rule("jsonfile")
			.oneOf("fontmeta")
			.use("font-loader").loader("../font-loader/src");
		configs.push(fontcnf);
	}
}

configs.forEach(c => c.chain.resolveLoader.modules.add(path.resolve(__dirname, "../../node_modules")).add(path.resolve(__dirname, "../")));
var rawcnf = configs.map(c => c.toConfig());
module.exports = rawcnf;

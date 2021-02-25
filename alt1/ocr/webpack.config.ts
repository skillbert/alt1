import A1webpack from "../webpack/index";
import * as fs from "fs";
import * as path from "path";
import { chainAlt1Lib, addAlt1Externals } from "../../scripts/alt1webpack";

//standard build steps
var cnf = chainAlt1Lib(__dirname);

var configs = [cnf];
//extra builds for fonts

var fontdir = path.resolve(__dirname, "fonts");
var files = fs.readdirSync(fontdir);
for (var file of files) {
	var m = file.match(/([\w-]+)\.fontmeta\.json$/i);
	if (m) {
		var fontname = m[1];
		var fontcnf = new A1webpack(__dirname);
		fontcnf.chain.output.path(path.resolve(__dirname, "./dist/fonts"));
		fontcnf.chain.output.filename("[name].js");
		fontcnf.makeUmd(fontname, "OCR_" + fontname);
		fontcnf.entry(fontname, path.resolve(fontdir, file));
		configs.push(fontcnf);
	}
}

configs.forEach(c => c.chain.resolveLoader.modules.add(path.resolve(__dirname, "../../node_modules")).add(path.resolve(__dirname, "../")));
var rawcnf = configs.map(c => c.toConfig());
module.exports = rawcnf;
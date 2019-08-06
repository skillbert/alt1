import A1webpack from "../webpack/index";
import * as fs from "fs";
import * as path from "path";
import { chainAlt1Lib, addAlt1Externals } from "../webpack/alt1webpack";

var cnf = chainAlt1Lib(__dirname);

var configs = [cnf];

var fontdir = path.resolve(__dirname, "fonts");
var files = fs.readdirSync(fontdir);debugger;
for (var file of files) {
	var m = file.match(/([\w-]+)\.fontmeta\.json$/i);
	if (m) {
		var name="fonts/" + m[1];
		var fontcnf = new A1webpack(__dirname);
		fontcnf.chain.output.path(path.resolve(__dirname, "./dist"));
		fontcnf.makeUmd(m[1], m[1]);
		fontcnf.entry(name,path.resolve(fontdir,file));
		addAlt1Externals(fontcnf);
		configs.push(fontcnf);
	}
}


configs.forEach(c => c.chain.resolveLoader.modules.add(path.resolve(__dirname, "../../node_modules")).add(path.resolve(__dirname, "../")));
var rawcnf = configs.map(c => c.toConfig());
module.exports = rawcnf;
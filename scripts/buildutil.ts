import * as path from "path"
import * as fs from "fs";
//import actual index.ts here as otherwise it will get redirected to ./dist/min.js which isn't compiled yet
import * as webpackutil from "../alt1/webpack";
import * as webpack from "webpack";
import * as alt1webpack from "./alt1webpack";


var buildTypesOnly = process.argv.indexOf("--typesonly") != -1;
var buildTypes = buildTypesOnly || process.argv.indexOf("--types") != -1;
var customWebpackConfig = process.argv.indexOf("--custom-webpack") != -1;

var projectdir = process.cwd();
var tsCompilerOpts = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../tsconfig.json"), "utf-8")).compilerOptions;
var packageObject = webpackutil.getPackageInfo(path.resolve(projectdir, "package.json"));

//build main
if (!buildTypesOnly) {
	if (customWebpackConfig) {
		var config = require(path.resolve(projectdir, "webpack.config")) as webpack.Configuration;
	} else {
		var config = alt1webpack.chainAlt1Lib(projectdir).toConfig() as webpack.Configuration;//extra cast here because of weird type conflict
	}

	if (!config.plugins) { config.plugins = []; }

	var compilation = webpack(config);

	if (process.argv.indexOf("--watch") != -1) {
		var buildcount = 0;
		compilation.watch({}, (err, stats) => {
			console.log("webpack recomp done " + (++buildcount) + " " + projectdir, err);
		});
	} else {
		compilation.run((err, stats) => {
			console.log(stats?.toString());
			console.log("webpack done " + projectdir, err);
		});
	}
}

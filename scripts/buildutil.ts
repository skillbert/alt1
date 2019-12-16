
var path = require("path");
var fs = require("fs");

var webpackutil = require("@alt1/webpack");

var buildTypesOnly = process.argv.indexOf("--typesonly") != -1;
var buildTypes = buildTypesOnly || process.argv.indexOf("--types") != -1;
var customWebpackConfig = process.argv.indexOf("--custom-webpack") != -1

var projectdir = process.cwd();
var tsCompilerOpts = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../tsconfig.json"))).compilerOptions;
var packageObject = webpackutil.getPackageInfo(path.resolve(projectdir, "package.json"));

//build main
if (!buildTypesOnly) {
	var webpack = require("webpack");
	var path = require("path");
	var alt1webpack = require("./alt1webpack");

	if (customWebpackConfig) {
		var config = require(path.resolve(projectdir, "webpack.config"));
	} else {
		var config = alt1webpack.chainAlt1Lib(projectdir).toConfig();
	}

	var compilation = webpack(config);

	if (process.argv.indexOf("--watch") != -1) {
		var buildcount = 0;
		compilation.watch({}, (err, stats) => {
			console.log("webpack recomp done " + (++buildcount) + " " + projectdir, err);
		});
	} else {
		compilation.run((err, stats) => {
			console.log(stats.toString());
			console.log("webpack done " + projectdir, err);
		});
	}
}


require("ts-node/register");
require("tsconfig-paths/register");

var webpack = require("webpack");
var path = require("path");

if (process.argv.indexOf("--custom-webpack") != -1) {
	var config = require(path.resolve(process.cwd(), "webpack.config"));
} else {
	var alt1webpack = require("@alt1/webpack/alt1webpack");
	var config = alt1webpack.chainAlt1Lib(process.cwd()).toConfig();
}

var compilation = webpack(config);

if (process.argv.indexOf("--watch") != -1) {
	var buildcount = 0;
	compilation.watch({}, (err, stats) => {
		console.log("webpack recomp done " + (++buildcount) + " " + process.cwd(), err);
	});
} else {
	compilation.run((err, stats) => {
		console.log(stats.toString());
		console.log("webpack done " + process.cwd(), err);
	});
}
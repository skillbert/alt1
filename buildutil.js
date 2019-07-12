
require("ts-node/register");
require("tsconfig-paths/register");

var alt1webpack = require("@alt1/webpack/alt1webpack");
var webpack = require("webpack");
var path = require("path");

if (process.argv.indexOf("--custom-webpack") != -1) {
	var config = require(path.resolve(process.cwd(), "webpack.config"));
} else {
	var config = alt1webpack.chainAlt1Lib(process.cwd()).toConfig();
}

var compilation = webpack(config);
compilation.run((err, stats) => {
	debugger;
	console.log("webpack done "+process.cwd(), err);
	console.log(compilation==null);
})
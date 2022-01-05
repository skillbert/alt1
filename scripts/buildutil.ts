import * as path from "path"
import * as webpack from "webpack";
import * as alt1webpack from "./alt1webpack";

var projectdir = process.cwd();
export default function config(env: Record<string, string>): webpack.Configuration {
	var customWebpackConfig = !!env["custom-webpack"];
	let config = (customWebpackConfig ? require(path.resolve(projectdir, "webpack.config")) : alt1webpack.chainAlt1Lib(projectdir, env).toConfig());
	if (typeof config == "function") {
		config = config(env);
	}
	return config;
}
import * as webpack from "webpack";
import * as  ts from "typescript";

// A JavaScript class.
class DtsPlugin extends webpack.Plugin {
	// Define `apply` as its prototype method which is supplied with compiler as its argument
	apply(compiler: webpack.Compiler) {
		// Specify the event hook to attach to
		compiler.hooks.emit.tapPromise('dtsplugin', async (compilation) => {
			compilation.compiler.


		});
	}
}
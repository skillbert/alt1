import * as webpack from "webpack";
import * as path from "path";

import * as base from "./webpack/main";


var rootdir = path.resolve(__dirname, "./");
var libdir = path.resolve(__dirname, "alt1");

module.exports = [].concat(
	addLibs()
);


function addLibs() {
	var libPackages: {
		name: string,
		directory: string,
		rootName: string,
		configPath: string,
		config: base.NpmConfig,
		entryPath: string,
		mainPath: string
	}[] = [];

	for (var cnf of base.findSubPackages(libdir)) {
		if (cnf.config.runeappsType != "lib") { continue; }
		if (!cnf.config.runeappsLibNameRoot) { throw `lib package at ${cnf.configFilePath} does not have a root export name`; }

		var entry = path.resolve(path.dirname(cnf.configFilePath), cnf.config.runeappsLibEntry || "index");
		var dir = path.dirname(cnf.configFilePath);

		libPackages.push({
			config: cnf.config,
			name: cnf.config.name,
			configPath: cnf.configFilePath,
			rootName: cnf.config.runeappsLibNameRoot,
			entryPath: entry,
			directory: dir,
			mainPath: path.resolve(dir, cnf.config.main)
		});
	}

	var libexternals = {};
	for (let entry of libPackages) {
		libexternals[entry.name] = {
			root: entry.rootName,
			commonjs: entry.name,
			commonjs2: entry.name,
			amd: entry.name
		};
	}

	var libconfigs = [];
	for (let lib of libPackages) {
		var config = lib.config;
		var externals = Object.assign({}, libexternals);
		delete externals[lib.name];
		var nodetarget = config.runeappsTarget == "node";
		var basecnf = base.baseConfig(rootdir, { nodejs: nodetarget });
		var conf = Object.assign(basecnf, {
			entry: { [lib.rootName]: lib.entryPath },
			output: {
				filename: path.basename(lib.mainPath),
				publicPath: "/",
				path: path.dirname(lib.mainPath),
				libraryTarget: "umd",
				library: {
					root: lib.rootName,
					commonjs: lib.name,
					amd: lib.name
				} as any,
				globalObject: "(typeof self !== 'undefined' ? self : this)"
			},
			externals: (basecnf.externals as any).concat(externals as any)
		} as Partial<webpack.Configuration>);
		libconfigs.push(conf);
	}
	return libconfigs;
}

import * as webpack from "webpack";
import * as path from "path";
import * as glob from "glob";
import TsconfigPathsPlugin, * as TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import * as fs from "fs";
import * as webpackNodeExternals from "webpack-node-externals";

//no types so import like this
var VueLoaderPlugin = require("vue-loader/lib/plugin");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");


/**
 * Returns a map of with direct subdirectory names as keys and paths of /index.tsx?/ as values for matching directories
 * @param pathstr
 */
export function findTopLevelModules(pathstr: string) {
	var allfiles = glob.sync(pathstr + "/*/index.*");
	var entries: { [name: string]: string } = {};
	for (var file of allfiles) {
		var rel = path.relative(pathstr, file);
		var m = path.basename(rel).match(/^index.tsx?/);
		if (!m) { continue; }
		var name = path.dirname(rel);
		if (!name.match(/^\w+$/)) { continue; }
		entries[name] = file;
	}
	return entries;
}

/**
 * Finds all files that match the regex filter and returns their full path mapped to their path relative to given path
 * @param pathstr
 * @param reg
 */
export function findEntries(pathstr: string, reg: RegExp) {
	var allfiles = glob.sync(pathstr + "/**/*");
	var entryarray = allfiles.filter(e => e.match(reg));
	var entries: { [name: string]: string } = {};
	for (var entry of entryarray) {
		var rel = path.relative(pathstr, entry);
		var filename = path.basename(entry);
		var m = filename.match(reg);
		if (!m) { continue; }
		var entryname = path.join(path.dirname(rel), m[1]).replace(/\\/g, "/");
		entries[entryname] = entry;
	}
	return entries;
}


export type NpmConfig = {
	name: string,
	main: string,
	runeappsType: string,
	runeappsLibNameRoot: string,
	runeappsLibEntry: string,
	runeappsTarget: "node" | "web" | null
};

/**
 * Finds all packages in given directory
 * @param pathstr
 */
export function findSubPackages(pathstr: string) {
	//var filenames = glob.sync(pathstr + "/**/package.json");
	//TODO rename these packages back to package.json and fix typescript/webpack require order to use index.ts instead of package.json#main
	var filenames = glob.sync(pathstr + "/**/libpackage.json");
	var files: { config: NpmConfig, configFilePath: string }[] = [];
	for (var file of filenames) {
		var cnf = JSON.parse(fs.readFileSync(file, { encoding: "utf-8" })) as Partial<NpmConfig>
		if (!cnf.main) { continue; }
		if (!cnf.main) { throw "no main in " + file; }
		if (!cnf.name) { throw "no name in " + file; }
		if (!cnf.runeappsLibEntry) { throw "no runeappsLibEntry in " + file; }
		if (!cnf.runeappsLibNameRoot) { throw "no runeappsLibNameRoot in " + file; }
		if (!cnf.runeappsType) { throw "no runeappsType in " + file; }

		files.push({
			configFilePath: file,
			config: cnf as NpmConfig
		});
	}
	return files;
}

export type Alt1WebpackOpts = { dropConsole: boolean, production: boolean, esnext: boolean, ugly: boolean, hotProxy: string, nodejs: boolean };

export function getCmdConfig() {
	var baseopts: Alt1WebpackOpts = {
		production: false,
		dropConsole: false,
		esnext: false,
		ugly: false,
		hotProxy: "",
		nodejs: false
	};
	for (var arg of process.argv) {
		switch (arg) {
			case "-p":
				baseopts.production = true;
				baseopts.ugly = true;
				baseopts.esnext = false;
				break;
			case "--ugly":
				baseopts.ugly = true;
				break;
			case "--nougly":
				baseopts.ugly = false;
				break;
			case "--esnext":
				baseopts.esnext = true;
				break;
			case "--noesnext":
				baseopts.esnext = false;
				break;
		}
	}
	return baseopts;
}

type TsConfigJson = {
	compilerOptions: {
		paths: { [match: string]: string },
		baseUrl: string,
		target: string,

	}
};


type Alt1WebpackConfiguration = webpack.Configuration & { devServer: any, externals: webpack.ExternalsObjectElement[] };


/**
 * Returns a webpack config stub complete with Alt1 related extensions. Defaults can be changed using command line flags
 * @param rootdir Root directry of project
 * @param webroot where to host missing files from when using hot server
 * @param configOpts
 */
export function baseConfig(rootdir: string, configOpts?: Partial<Alt1WebpackOpts>): Alt1WebpackConfiguration {
	var opts = Object.assign(getCmdConfig(), configOpts);
	var alt1DirectDir = path.resolve(__dirname, "../alt1");

	var tsconfigPath = path.resolve(rootdir, "tsconfig.json");
	var tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8")) as TsConfigJson;
	var tsCompilerOpts = tsconfig.compilerOptions;


	/*
	var alias: { [name: string]: string } = {};
	if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.baseUrl) {
		for (var rule in tsconfig.compilerOptions.paths) {
			var maps = tsconfig.compilerOptions.paths[rule];
			if (maps.length != 1) { throw "more than one tsconfig alias path mapping not supported in webpack."; }
			if (!rule.endsWith("*")) { throw "tsconfig alias didn't match expected alias format"; }
			if (!maps[0].endsWith("*")) { throw "tsconfig alias path didn't match expected alias format"; }
			alias[rule.slice(0, -1)] = path.resolve(rootdir, tsconfig.compilerOptions.baseUrl, maps[0].slice(0, -1));
		}
	}*/

	if (opts.esnext) {
		tsCompilerOpts.target = "esnext";
	}

	var externals = [{
		"pngjs": { commonjs: "pngjs", commonjs2: "pngjs" },
		"node-fetch": { commonjs: "node-fetch", commonjs2: "node-fetch" }
	}] as any;
	if (opts.nodejs) {
		externals.push(webpackNodeExternals({ modulesFromFile: true, modulesDir: rootdir }) as any);
	}

	return {
		mode: opts.production ? "production" : "development",
		devtool: opts.production ? false : 'eval-source-map',
		target: (opts.nodejs ? "node" : "web"),
		entry: undefined,
		output: undefined,
		context: rootdir,
		externals: externals,
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.fontmeta.json', '.data.png', '.jsx'],
			modules: [
				path.resolve(rootdir, "node_modules"),
			],
			plugins: [
				new TsconfigPathsPlugin({ configFile: tsconfigPath })
			],
			//alias: alias,
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
							// the "scss" and "sass" values for the lang attribute to the right configs here.
							// other preprocessors should work out of the box, no loader config like this necessary.
							'scss': 'vue-style-loader!css-loader!sass-loader',
							'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
						}
						// other vue-loader options go here
					}
				},
				{
					test: /\.(ts|tsx)$/,
					loader: 'ts-loader',
					options: {
						compilerOptions: tsCompilerOpts,
						appendTsSuffixTo: [/\.vue$/],
					}
				},
				{
					test: /\.css$/,
					loader: ['style-loader', 'css-loader?-url']
				},
				{
					test: /\.scss$/,
					loader: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.data.png$/,
					loader: ['imagedata-loader']
				},
				{
					test: /\.fontmeta.json$/,
					loader: ["font-loader"]
				}
			]
		},
		plugins: [
			(!opts.production ? new webpack.HotModuleReplacementPlugin() : null),
			(!opts.ugly ? new webpack.NamedModulesPlugin() : null),
			new VueLoaderPlugin()
		].filter(p => p),
		devServer: (opts.production ? undefined : {
			hot: true,
			proxy: { "*": (opts.hotProxy || "http://localhost/") },
			port: 8088
		}),
		resolveLoader: {
			modules: [
				path.resolve(rootdir, "node_modules"),
				path.resolve(__dirname, "../node_modules"),
				alt1DirectDir
			],
			extensions: ['.js', '.json', '.ts']
		},
		optimization: {
			minimize: opts.ugly,
			minimizer: [
				new UglifyJSPlugin({ uglifyOptions: { drop_console: opts.dropConsole } }),
			]
		},
		node: false
	};
}


export function externalNodeModules(dir: string) {
	var nodeModules = {};
	fs.readdirSync(dir).filter(function (x) {
		return ['.bin'].indexOf(x) === -1;
	})
		.forEach(function (mod) {
			nodeModules[mod] = 'commonjs ' + mod;
		});
	return nodeModules;
}
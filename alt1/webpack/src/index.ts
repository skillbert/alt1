import * as webpack from "webpack";
import * as path from "path";
import * as fs from "fs";
import * as TerserPlugin from "terser-webpack-plugin";

//these packages have outdated webpack v4 typings but still work, use require syntax to shut up typescript errors
//*
import * as webpackNodeExternals from "webpack-node-externals";
import * as WebpackChain from "webpack-chain";
type AllowlistOption = any;
// declare module "webpack-chain" {
// 	export interface Rule {
// 		oneOf(name: string): WebpackChain.Rule;
// 	}
// }
/*/
const WebpackChain = require("webpack-chain");
const webpackNodeExternals = require("webpack-node-externals");
type WebpackChain = any;
type webpackNodeExternals = any;
type AllowlistOption = any;
//*/

//TODO get rid of webpack-chain

function constructApply(fn: Function, args: any) {
	return new (Function.prototype.bind.apply(fn, args));
}

export default class Alt1Chain {
	rootdir: string;
	tsconfigfile: string | undefined = undefined;
	tsOptions: any;
	chain: WebpackChain;
	opts!: Alt1WebpackOpts;
	constructor(rootdir: string, opts: Partial<Alt1WebpackOpts>, env?: Record<string, string | boolean>) {
		this.chain = new WebpackChain();
		this.chain.context(rootdir);
		this.rootdir = rootdir;
		var dir = path.resolve(rootdir);
		while (true) {
			var file = path.resolve(dir, "tsconfig.json");
			if (fs.existsSync(file)) {
				this.tsconfigfile = file;
				var tsconfig = JSON.parse(fs.readFileSync(file, "utf8").replace(/^[^{}]+/, ""));
				if (!tsconfig.compilerOptions) { tsconfig.compilerOptions = {}; }
				tsconfig.compilerOptions.module = "esnext";//enables tree shaking

				this.tsOptions = {
					compilerOptions: tsconfig.compilerOptions,
					appendTsSuffixTo: [/\.vue$/],
					allowTsInNodeModules: !!tsconfig.allowTsInNodeModules
				};
				break;
			}

			if (path.resolve(dir, "..") == dir) { break; }
			dir = path.resolve(dir, "..");
		}
		this.chain.target("web");
		this.chain.node.clear().set("false", true);

		this.defaultModule();
		this.configureOpts(opts, env);
	}

	entry(name: string, filename: string, append?: boolean) {
		if (!append) { this.chain.entry(name).clear(); }
		this.chain.entry(name).add(path.resolve(this.rootdir, filename));
	}

	output(dirname: string) {
		this.chain.output.path(path.resolve(this.rootdir, dirname));
	}

	makeUmd(name: string, windowExport: string) {
		this.chain.output.libraryTarget("umd");
		this.chain.output.set("library", { root: windowExport, commonjs: name, amd: name });
		this.chain.output.set("chunkLoadingGlobal", name);
	}

	toConfig() {
		var conf = this.chain.toConfig();
		//webpack-chain doesn't allow turning off .node completely otherwise
		if ((conf as any).node["false"]) { conf.node = false; }
		return conf;
	}
	addExternal(id: string, packname: string | null, windowExport = "null") {
		let arr = this.chain.get("externals");
		arr.push({ [id]: { root: windowExport, commonjs: packname, commonjs2: packname, amd: packname } });
	}

	production(prod: boolean, sourcemaps: boolean, enablehot: boolean, hotproxy?: string) {
		this.chain.mode(prod ? "production" : "development");
		//this.chain.devtool(sourcemaps ? (prod ? "source-map" : 'eval-source-map') : undefined as any);
		this.chain.devtool(sourcemaps ? (prod ? "source-map" : 'eval-source-map') : false as any);
		//this.chain.devtool(prod ? "source-map" : false as any);

		if (!prod && enablehot && webpack.HotModuleReplacementPlugin) {
			this.chain.plugin("hotmodule").use(webpack.HotModuleReplacementPlugin as any).init(constructApply);
		}
		else { this.chain.plugins.delete("hotmodule"); }
		this.chain.devServer.clear();
		if (!prod && enablehot) {
			this.chain.devServer
				.hot(true)
				.proxy({ "*": (hotproxy || "http://localhost/") })
				.port(8088);
		}
		this.chain.output.filename("[name].bundle.js");
		this.chain.output.chunkFilename(prod ? "[name]_[chunkhash].bundle.js" : "[name].bundle.js");
	}

	ugly(ugly: boolean) {
		//TODO just set config.mode instead
		this.chain.optimization.set("moduleIds", ugly ? "natural" : "named");
		this.chain.optimization.minimize(ugly);
		this.chain.optimization.minimizer("terser").use(TerserPlugin as any, [{
			terserOptions: {
				output: {
					ascii_only: true,//need to properly fix headers everywhere otherwise and doesn't really matter size wise
					max_line_len: 250//makes dev tools not crash when viewing
				}
			}
		} as any]);
	}

	dropconsole() {
		//TODO this causes errors as webpack now uses terser plugin for minification
		/*
		this.chain.optimization.minimizer("uglifyjs-webpack-plugin")
			.clear()
			.use(UglifyJSPlugin, [{ uglifyOptions: { drop_console: drop } }])
			.init(constructApply)
			*/
	}
	nodejs() {
		this.chain.target("node");
		let arr = this.chain.get("externals");
		this.chain.set("externalsPresets", { node: true });
		//devdependencies are not dependencies of dependent modules, so if they do show up in the bundler they must be bundled
		arr.push(webpackNodeExternals({
			modulesFromFile: {
				include: ["dependencies", "peerDependencies", "optionalDependencies"],
				exclude: ["devDependencies"]
			},
			modulesDir: this.rootdir,
			allowlist: this.opts.nodejsExcludeExceptions
		}));
	}

	configureOpts(defaults: Partial<Alt1WebpackOpts>, env?: Record<string, string | boolean>) {
		var opts = getCmdConfig(defaults, env);
		this.opts = opts;
		this.production(opts.production, opts.sourcemaps, opts.hotEnable, opts.hotProxy);;
		this.ugly(opts.ugly);
		if (opts.dropConsole) { this.dropconsole(); }
		if (opts.nodejs) { this.nodejs(); }

		if (opts.esnext) { this.tsOptions.compilerOptions.target = "es2018"; }
	}

	defaultModule() {
		this.chain.resolveLoader.extensions.merge([".js", ".json", ".ts"]);
		this.chain.set("node", false);
		this.chain.resolve.extensions.clear().merge([".wasm", ".tsx", ".ts", ".mjs", ".jsx", ".js", ".json"]);

		this.chain.output.globalObject("(typeof self!='undefined'?self:this)");
		this.chain.externals([]);
		let parser = this.chain.module.getOrCompute("parser", () => ({}));
		(parser.javascript ??= {}).commonjsMagicComments = true;
		this.chain.module.rule("typescript")
			.test(/\.(ts|tsx)$/)
			.use("ts-loader").loader("ts-loader").options(this.tsOptions);
		this.chain.module.rule("css")
			.test(/\.css$/)
			.use("style").loader("style-loader").end()
			.use("css").loader("css-loader").end();
		this.chain.module.rule("scss")
			.test(/\.scss$/)
			.use("style").loader("style-loader").end()
			.use("css").loader("css-loader").end()
			.use("sass").loader("sass-loader").end();
		this.chain.module.rule("imagefiles")
			.oneOf("datapng")
			.test(/\.data\.png$/i)
			.use("datapng").loader("@alt1/imagedata-loader");
		this.chain.module.rule("imagefiles")
			.oneOf("image")
			.test(/\.(png|jpg|jpeg|gif|webp)$/i)
			.use("url-loader").loader("url-loader").options({ limit: 8192, esModule: false, name: "[path][name].[ext]" });
		this.chain.module.rule("jsonfiles")
			.test(/\.json$/)
			.type("javascript/auto")
			.use("json-loader").loader("json-loader");
		this.chain.module.rule("jsonfile")
			.test(/\.fontmeta\.json$/)
			.oneOf("fontmeta")
			.use("font-loader").loader("@alt1/font-loader");
		this.chain.module.rule("html")
			.test(/\.html$/)
			.use("file").loader("file-loader").options({ name: "[path][name].[ext]" });
	}

}

export type Alt1WebpackOpts = {
	dropConsole: boolean,
	production: boolean,
	esnext: boolean,
	ugly: boolean,
	hotEnable: boolean,
	hotProxy: string,
	nodejs: boolean,
	sourcemaps: boolean,
	nodejsExcludeExceptions: AllowlistOption[]
};

export type NpmConfig = {
	name?: string,
	umdGlobal?: string,
	runeappsRootPackage?: boolean,
	types?: string,
	main?: string,
	runeappsLibNameRoot?: string,
	runeappsTarget?: "combined" | "node",
	dependencies: { [name: string]: string },
	optionalDependencies: { [name: string]: string }
};

export function defaultCmdConfig(prod: boolean) {
	let opts: Alt1WebpackOpts = {
		sourcemaps: prod,
		production: prod,
		dropConsole: false,
		esnext: !prod,
		ugly: prod,
		hotEnable: false,
		hotProxy: "",
		nodejs: false,
		nodejsExcludeExceptions: []
	}
	return opts;
}

export function getCmdConfig(defaults: Partial<Alt1WebpackOpts>, env?: Record<string, string | boolean>) {
	let prod = !!(env?.prod ?? env?.production ?? (env?.mode ? env.mode == "prod" : defaults.production ?? false));
	let cnf: Alt1WebpackOpts = { ...defaultCmdConfig(prod), ...defaults };

	if (env) {
		if (typeof env.esnext == "boolean") { cnf.esnext = env.esnext; }
		if (typeof env.ugly == "boolean") { cnf.ugly = env.ugly; }
		if (typeof env.nodejs == "boolean") { cnf.nodejs = env.nodejs; }
	}
	return cnf;
}

export function getPackageInfo(fileabs: string) {
	var cnf = JSON.parse(fs.readFileSync(fileabs, { encoding: "utf-8" })) as Partial<NpmConfig>
	if (!cnf.name) { throw "no package name on " + fileabs; }
	if (!cnf.runeappsRootPackage && !cnf.umdGlobal && !cnf.runeappsLibNameRoot) { throw new Error("no umdGlobal on " + fileabs); }

	return {
		dir: path.dirname(fileabs),
		name: cnf.name,
		types: cnf.types,
		main: cnf.main || "./dist",
		target: cnf.runeappsTarget || "combined",
		umdName: cnf.umdGlobal || cnf.runeappsLibNameRoot || cnf.name || "",
		dependencies: cnf.dependencies || {},
		optionalDependencies: cnf.optionalDependencies || {}
	};
}

type TsConfigJson = {
	compilerOptions: {
		paths: { [match: string]: string },
		baseUrl: string,
		target: string,
	}
};


export type Alt1WebpackConfiguration = webpack.Configuration & {
	devServer?: {
		port: number,
		hot: boolean,
		proxy: { [match: string]: string }
	};
};


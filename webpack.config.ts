import * as webpack from "webpack";
import * as path from "path";
import * as glob from "glob";
import * as UglifyJSPlugin from "uglifyjs-webpack-plugin";

var isdebug = process.argv.indexOf("-p") == -1;
var rootdir = path.resolve(__dirname, "./");
var webroot = path.resolve(__dirname, "../htdocs");
var inwebroot = path.resolve(rootdir, "webroot");

var allfiles = glob.sync(inwebroot + "/**/*");

function findEntries(type = "entry") {
	var reg = new RegExp(`(\\w+)\\.${type}\\.tsx?$`);
	var entryarray = allfiles.filter(e => e.match(reg));
	var entries: { [name: string]: string } = {};
	for (var entry of entryarray) {
		var rel = path.relative(inwebroot, entry);
		var filename = path.basename(entry);
		var m = filename.match(reg);
		if (!m) { continue; }
		var entryname = path.join(path.dirname(rel), m[1]).replace(/\\/g, "/");
		entries[entryname] = entry;
	}
	return entries;
}

function baseconfig(uglyopts = {}): webpack.Configuration & { devServer: any } {
	return {
		mode: isdebug ? "development" : "production",
		devtool: isdebug ? 'eval-source-map' : false,
		entry: undefined,
		output: undefined,
		context:rootdir,
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.font.json', '.data.png', '.jsx'],
			modules: [
				path.resolve(rootdir, "node_modules"),
			],
			alias: {
				libs: path.resolve(rootdir, "libs"),
			},
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					loader: 'ts-loader',
					options: {
						configFile: path.resolve(rootdir, isdebug ? "tsconfig_dev.json" : "tsconfig.json")
					}
				},
				{
					test: /\.css$/,
					loader: ['style-loader', 'css-loader?-url']
				},
				{
					test: "/\.scss$",
					loader: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.data.png$/,
					loader: ['imagedata-loader']
				}, {
					test: /\.font.json$/,
					loader: []
				}, {
					test: /\.fontmeta.json$/,
					loader: ["font-loader"]
				}
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
			//new webpack.NamedModulesPlugin(),//aprantly used for hmr but works without
		],
		devServer: !isdebug ? undefined : {
			hot: true,
			contentBase: webroot,
			port: 8088
		},
		resolveLoader: {
			modules: [
				path.resolve(rootdir, "node_modules"),
				path.resolve(rootdir, "libs")
			],
			extensions: ['.js', '.json', '.ts']
		},
		optimization: isdebug ? undefined : {
			minimizer: [
				new UglifyJSPlugin({ uglifyOptions: uglyopts, }),
			],
		},
		node: false
	};
}

var webentries = findEntries(isdebug ? "(\\w+-)?entry" : "entry");
console.log("web", webentries);

var websiteConfig = Object.assign({}, baseconfig(), {
	entry: webentries,
	output: {
		filename: '[name].bundle.js',
		publicPath: "/",
		path: webroot
	}
});

var libentries = findEntries("lib");
console.log("lib", libentries);
var libConfig = Object.assign({}, baseconfig(), {
	entry:libentries,//TODO
	output: {
		filename: '[name].bundle.js',
		publicPath: "/",
		path: webroot + "\\"
	}
});

var twitchentries = findEntries("twitch-entry");
console.log("twitch", twitchentries);
var twitchPublishConfig = Object.assign({}, baseconfig({ compress: { drop_console: true }, output: { comments: false } }), {
	entry: twitchentries,
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},
	output: {
		filename: '[name].bundle.js',
		publicPath: "/",
		path: webroot
	}
});


module.exports = [];

module.exports.push(websiteConfig);
if (!isdebug) {
	module.exports.push(twitchPublishConfig);
}
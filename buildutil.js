
require("ts-node/register");
require("tsconfig-paths/register");

var path = require("path");
var fs = require("fs");

var webpackutil = require("@alt1/webpack");

var buildTypesOnly = process.argv.indexOf("--typesonly") != -1;
var buildTypes = buildTypesOnly || process.argv.indexOf("--types") != -1;
var customWebpackConfig = process.argv.indexOf("--custom-webpack") != -1

var projectdir = process.cwd();
var tsCompilerOpts = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./tsconfig.json"))).compilerOptions;
var packageObject = webpackutil.getPackageInfo(path.resolve(projectdir, "package.json"));

//build main
if (!buildTypesOnly) {
	var webpack = require("webpack");
	var path = require("path");
	var alt1webpack = require("@alt1/webpack/alt1webpack");

	if (customWebpackConfig) {
		var config = require(path.resolve(process.cwd(), "webpack.config"));
	} else {
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
}

//build types
if (buildTypes) {
	var ts = require("typescript");
	var dts = require("dts-bundle");


	var entryfileorder = ["index.tsx", "index.ts", "index.jsx", "index.js"];
	var entryfile = "";
	for (var entryfilename of entryfileorder) {
		var entrypath = path.resolve(projectdir, entryfilename);
		if (fs.existsSync(entrypath)) {
			entryfile = entrypath;
			break;
		}
	}
	if (!entryfile) {
		throw new Error("Could not find entry file");
	}

	//building typings
	var tempdir = path.resolve(__dirname, "buildtemp", path.relative(__dirname, projectdir));
	var config = {
		...tsCompilerOpts,
		declaration: true,
		declarationDir: tempdir
	};
	var program = ts.createProgram([entryfile], config);

	var writes = [];
	var indexfile = "";

	var writer = (f, data, bom, e, sourcefiles) => {
		console.log("write ", f);
		fs.mkdirSync(path.dirname(f), { recursive: true });
		fs.writeFileSync(f, data);
		writes.push(f);
		if (sourcefiles.find(f => path.normalize(f.fileName) == entryfile)) { indexfile = f; }
	}
	var res = program.emit(undefined, writer, undefined, true, undefined);

	res.diagnostics.forEach(d => console.log("types build notice: " + d.messageText + " in " + d.file.fileName + ":" + d.start));

	dts.bundle({
		name: packageObject.name,
		main: indexfile,
		out: path.resolve(projectdir, "dist", path.basename(indexfile)),
		indent: "\t"
	});

	for (var wr of writes) {
		//fs.unlinkSync(wr);
	}
}
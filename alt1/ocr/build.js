//need this script in order to resolve circular dependency between ocr and font-loader
//the bundled ocr fonts rely on font-loader, while font-loader relies on the ocr code
//this scripts runs the 3 sub-builds in correct order and appends all the webpack
//env args to each of them
var child_process = require("child_process");

//https://stackoverflow.com/questions/17516772/using-nodejss-spawn-causes-unknown-option-and-error-spawn-enoent-err/17537559#17537559
var npm = (process.platform === "win32" ? "npm.cmd" : "npm");
var webpackargs = process.argv.slice(2);

(async function () {
	//build self
	await subcommand(["exec", "--", "webpack", "--config", "../../buildutil.js"].concat(webpackargs));
	//build font-loader
	process.chdir("../font-loader");
	await subcommand(["exec", "--", "webpack", "--config", "../../buildutil.js"].concat(webpackargs));
	//build fonts
	process.chdir("../ocr");
	await subcommand(["exec", "--", "webpack", "--config", "../../buildutil.js", "--env", "custom-webpack"].concat(webpackargs));
})();

function subcommand(args) {
	return new Promise((resolve, reject) => {
		console.log(`${process.cwd()}> ${npm} ${args.join(" ")}`);
		const sub = child_process.spawn(npm, args);
		sub.stdout.pipe(process.stdout);
		sub.stderr.pipe(process.stderr);
		sub.on('exit', resolve);
	})
}
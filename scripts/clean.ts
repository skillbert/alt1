import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

var rootdir = path.resolve(__dirname, "..");

var globs = {
	// "/**/*" pattern to not match the folder itself, only subfolders and files
	packdist: path.resolve(rootdir, "alt1/*/dist/**/*"),
	typebuild: path.resolve(rootdir, "types/**/*"),
	ocrfonts:path.resolve(rootdir,"alt1/ocr/fonts/**/*")
};

var files = [] as string[];

for (var g in globs) {
	var pattern = globs[g];
	var f = glob.sync(pattern);
	//reverse so directories are last and not first
	files = files.concat(f.reverse());
}

//some sanity checks
if (files.length > 400) {
	throw new Error("More files listed for deletion than expected " + files.length + "/400. Might have to adjust this limit.");
}
for (var file of files) {
	if (path.relative(rootdir, file).startsWith("..")) {
		throw new Error("A file outside the project was listed for deletion");
	}
}

console.log("Cleaning " + files.length + " file");

for (var file of files) {
	var st = fs.statSync(file);
	if (st.isDirectory()) {
		fs.rmdirSync(file);
		console.log("rmdir", file);
	}
	if (st.isFile()) {
		fs.unlinkSync(file);
		console.log("file", file);
	}
}
console.log("done");
import * as a1lib from "libs/alt1lib";

module.exports = function (source) {
	//const options = getOptions(this);
	//validateOptions(schema, options, 'Example Loader');

	a1lib.ImageDetect.clearPngColorspace(source);

	var imgstr = source.toString("base64");
	
	return `module.exports=require("alt1lib.ts").ImageDetect.imageDataFromBase64("${imgstr}")`;
}
module.exports.raw = true;
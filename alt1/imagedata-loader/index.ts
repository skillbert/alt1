import { ImageDetect } from "@alt1/base";

module.exports = function (source) {
	//const options = getOptions(this);
	//validateOptions(schema, options, 'Example Loader');

	ImageDetect.clearPngColorspace(source);

	var imgstr = source.toString("base64");
	
	return `module.exports=require("@alt1/base").ImageDetect.imageDataFromBase64("${imgstr}")`;
}
module.exports.raw = true;
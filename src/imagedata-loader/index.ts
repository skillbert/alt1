import { ImageDetect } from "alt1/base";
import { LoaderContext } from "webpack";

export default function (this: LoaderContext<void>, source: Buffer) {
	this.cacheable(true);
	ImageDetect.clearPngColorspace(source);
	var imgstr = source.toString("base64");
	return `module.exports=require("alt1/base").ImageDetect.imageDataFromBase64("${imgstr}")`;
	//return `import {ImageDetect} from "alt1/base"; module.exports=ImageDetect.imageDataFromBase64("${imgstr}")`;
}
export var raw = true;
import { ImageDetect } from "@alt1/base";

module.exports = function (source:Uint8Array) {
	ImageDetect.clearPngColorspace(source);
	return source;
}
module.exports.raw = true;
import { ImageDetect } from "alt1/base";

export default function (source: Uint8Array) {
	ImageDetect.clearPngColorspace(source);
	return source;
}
export var raw = true;
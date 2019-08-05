
//<reference path="./shims.d.ts"/>
//use actual imports instead of .d.ts so typings build doesn't trip out
import * as _unused from "./declarations";

import * as ImageDetect from "./imagedetect";
import * as PasteInput from "./pasteinput";
import Rect, { RectLike, PointLike } from "./rect";
import { ImageData } from "./imagedata-extensions";

export { PasteInput, ImageDetect, Rect, RectLike, ImageData, PointLike };
export * from "./imgref";
export * from "./wrapper";






























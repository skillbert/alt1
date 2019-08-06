

import "./declarations";

import * as ImageDetect from "./imagedetect";
import * as PasteInput from "./pasteinput";
import Rect, { RectLike, PointLike } from "./rect";
import { ImageData } from "./imagedata-extensions";

export { PasteInput, ImageDetect, Rect, RectLike, ImageData, PointLike };
export * from "./imgref";
export * from "./wrapper";


//export type StringMap<T> = { [key: string]: T; }
//export type NumberMap<T> = { [key: number]: T; }

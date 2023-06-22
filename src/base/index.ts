
import "./declarations";
export * as ImageDetect from "./imagedetect";
export * as PasteInput from "./pasteinput";
export { default as Rect, RectLike, PointLike } from "./rect";
export { ImageData } from "./imagedata-extensions";
export * as NodePolyfill from "./nodepolyfill";

export * from "./imgref";
export * from "./wrapper";

export { webpackImages, findSubimage, simpleCompare, findSubbuffer, ImageDataSet, imageDataFromUrl } from "./imagedetect";

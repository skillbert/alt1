declare module "*.data.png" {
	var t: Promise<ImageData>;
	export = t;
}

declare module "*.fontmeta.json" {
	import * as OCR from "alt1/ocr";
	var t: OCR.FontDefinition;
	export default t;
}
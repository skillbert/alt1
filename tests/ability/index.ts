import * as a1lib from "alt1/base";
import { webpackImages, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";
import { ActionbarReader } from "alt1/ability";

globalThis.OCR = OCR;
globalThis.ImageDetect = a1lib.ImageDetect;
globalThis.a1lib = a1lib;

let tests = webpackImages({
	flat: import("./imgs/flat.data.png"),
	hor: import("./imgs/hor.data.png"),
	vert: import("./imgs/vert.data.png"),
	tall: import("./imgs/tall.data.png"),
});


export default async function run() {
	await tests.promise;
	for (let testid in tests.raw) {
		console.log(`==== ${testid} ====`)
		let img = new ImgRefData(tests[testid]);
		let imgdata = img.toData();
		imgdata.show();
		let t = performance.now();
		let reader = new ActionbarReader();
		console.log(ActionbarReader.getCurrentLayoutData(img));
		let pos = reader.find(img);

		console.log(performance.now() - t, pos);

		if (!pos) {
			console.log("couldn't find pos " + testid);
			continue;
		}

		t = performance.now();
		let res = [] as any[];
		for (let a = 0; a < 1; a++) {
			res.push(reader.read(imgdata, 0, 0));
		}
		console.log(performance.now() - t, res);

		globalThis.reader = reader;
	}
}
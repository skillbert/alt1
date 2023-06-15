import * as a1lib from "alt1/base";
import { webpackImages, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";
import BuffReader from "alt1/buffs";

globalThis.OCR = OCR;
globalThis.ImageDetect = a1lib.ImageDetect;
globalThis.a1lib = a1lib;

let tests = webpackImages({
	pt11: import("./imgs/small.data.png"),
	pt13: import("./imgs/med.data.png"),
	pt15: import("./imgs/large.data.png")
});


export default async function run() {
	await tests.promise;
	for (let testid in tests.raw) {
		console.log(`==== ${testid} ====`)
		let img = new ImgRefData(tests[testid]);
		let imgdata = img.toData();
		imgdata.show();
		let t = performance.now();
		let reader = new BuffReader();
		reader.debuffs = false;
		let pos = reader.find(img);

		console.log(performance.now() - t, pos);

		if (!pos) {
			console.log("couldn't find pos " + testid);
			continue;
		}

		t = performance.now();
		let res = [] as any[];
		for (let a = 0; a < 1; a++) {
			res.push(reader.read(imgdata));
		}
		console.log(performance.now() - t, res);

		globalThis.reader = reader;
	}
}
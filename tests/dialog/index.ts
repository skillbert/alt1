import * as a1lib from "alt1/base";
import DialogReader from "alt1/dialog";
import { webpackImages, ImgRef, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";

globalThis.OCR = OCR;
globalThis.ImageDetect = a1lib.ImageDetect;
globalThis.a1lib = a1lib;

// OCR.debug.trackread = true;
// globalThis.debug = OCR.debugout;
// globalThis.match = false;

let tests = webpackImages({
	test0: import("./imgs/test0.data.png"),
	test1: import("./imgs/test1.data.png"),
	test2: import("./imgs/test2.data.png"),
	test3: import("./imgs/test3.data.png"),
	test4: import("./imgs/test4.data.png"),
	test5: import("./imgs/test5.data.png")
});

export default async function run() {
	await tests.promise;
	for (let testid in tests.raw) {
		let img = new ImgRefData(tests[testid]);
		let reader = new DialogReader();
		dotest(testid, reader, img);
	}
}

function dotest(testid: string, reader: DialogReader, img: ImgRef) {
	console.log(`==== ${testid} ====`);
	img.toData().show();
	let t = performance.now();
	let pos = reader.find(img);
	console.log(performance.now() - t, pos);

	if (!pos) {
		console.log("couldn't find pos " + testid);
		return;
	}

	t = performance.now();
	let res = [] as any[];
	for (let a = 0; a < 1; a++) {
		res.push(reader.read(img));
	}
	console.log(performance.now() - t);
	console.log(res[0]);

	globalThis.reader = reader;
}

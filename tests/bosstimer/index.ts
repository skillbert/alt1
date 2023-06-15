import * as a1lib from "alt1/base";
import BossTimerReader from "alt1/bosstimer";
import { webpackImages, ImgRef, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";

globalThis.OCR = OCR;
globalThis.ImageDetect = a1lib.ImageDetect;
globalThis.a1lib = a1lib;

let tests = webpackImages({
	nis1: import("./imgs/nis1.data.png"),
	nis2: import("./imgs/nis2.data.png"),
	legacy1: import("./imgs/legacy1.data.png"),
});

export default async function run() {
	await tests.promise;
	for (let testid in tests.raw) {
		let img = new ImgRefData(tests[testid]);
		let reader = new BossTimerReader();
		dotest(testid, reader, img);
	}
}

function dotest(testid: string, reader: BossTimerReader, img: ImgRef) {
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
	let res = reader.read(img);
	console.log(performance.now() - t, res);
	globalThis.reader = reader;
}

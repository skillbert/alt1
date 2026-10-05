import * as a1lib from "alt1/base";
import TooltipReader from "alt1/tooltip";
import { webpackImages, ImgRef, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";
import * as alt1 from "alt1/base/alt1api";

globalThis.OCR = OCR;
globalThis.ImageDetect = a1lib.ImageDetect;
globalThis.a1lib = a1lib;
(globalThis as any).alt1 = {
	rsWidth: 0,
	rsHeight: 0,
};

let tests = webpackImages({
	test1: import("./imgs/test1.data.png"), // talk to NPC
	test2: import("./imgs/test2.data.png"), // interact member item
	test3: import("./imgs/test3.data.png"), // interact scenery
	test4: import("./imgs/test4.data.png"), // interact non-member item
  test5: import("./imgs/test5.data.png"), // interact tooltip above
	test6: import("./imgs/test6.data.png"), // default cursor
	test7: import("./imgs/test7.data.png"), // double line bank item
	test8: import("./imgs/test8.data.png"), // double line bank item above
	test9: import("./imgs/test9.data.png"), // wide tooltip
});
let hasFar = ["test1", "test2", "test3", "test4", "test5"];
let hasAbove = ["test5", "test8"];

export default async function run() {
	await tests.promise;
	for (let testid in tests.raw) {
		let img = new ImgRefData(tests[testid]);
		globalThis.alt1.rsWidth = img.width; 
		globalThis.alt1.rsHeight = img.height;
		let reader = new TooltipReader();
		reader.farTooltip = hasFar.includes(testid);
    reader.lookabove = hasAbove.includes(testid);
		dotest(testid, reader, img);
	}
}

function dotest(testid: string, reader: InstanceType<typeof TooltipReader>, img: ImgRef) {
	console.log(`==== ${testid} ====`);
	img.toData().show();
	let t = performance.now();

	let far = reader.farTooltip;
	let up = reader.lookabove;
	let mouseAbs = { x: Math.floor(img.width / 2), y: up ? img.height - (far ? 31 : 19) : 0 };
	let state = TooltipReader.readImage(img, mouseAbs, 1) || TooltipReader.readImage(img, mouseAbs, -1);
	console.log(performance.now() - t, { farTooltip: far, lookabove: up, mouseAbs, state });

	if (!state) {
		console.log("couldn't find tooltip in " + testid);
		return;
	}

	console.log("mousepos", state.mousepos);
	console.log("readInteraction", state.readInteraction().text);
	console.log("readBankItem", state.readBankItem());
	globalThis.reader = reader;
}

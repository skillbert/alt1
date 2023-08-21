import * as a1lib from "alt1/base";
import ChatBoxReader from "alt1/chatbox";
import { webpackImages, simpleCompare, ImgRef, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";


globalThis.OCR = OCR;
globalThis.ImageDetect = a1lib.ImageDetect;
globalThis.a1lib = a1lib;

let tests = webpackImages({
	pt10: import("./imgs/default10pt.data.png"),
	pt12: import("./imgs/default12pt.data.png"),
	pt14: import("./imgs/default14pt.data.png"),
	pt16: import("./imgs/default16pt.data.png"),
	pt18: import("./imgs/default18pt.data.png"),
	pt20: import("./imgs/default20pt.data.png"),
	pt22: import("./imgs/default22pt.data.png"),

	bugged: import("./imgs/buggedmode.data.png"),
	mini: import("./imgs/minimized.data.png"),
	bronzebroadcast_aug2023: import("./imgs/bronzebroadcast_aug2023.data.png")
});

globalThis.testfont = testfont;

function testfont(font: OCR.FontDefinition) {

	let pixels: { [pos: string]: number } = {};

	font.chars.forEach(chr => {
		for (let a = 0; a < chr.pixels.length; a += 4) {
			let pos = chr.pixels[a] + "," + chr.pixels[a + 1];
			if (!pixels[pos]) { pixels[pos] = 0; }
			pixels[pos]++;
		}
	});
	console.log(pixels);

	//font.chars.forEach(ch=>ch.pixels=new Float64Array(ch.pixels) as any);
}

export default async function run() {
	await tests.promise;
	for (let testid in tests.raw) {
		let img = new ImgRefData(tests[testid]);
		let reader = new ChatBoxReader();
		dotest(testid, reader, img);
	}
}

function dotest(testid: string, reader: ChatBoxReader, img: ImgRef) {
	console.log(`==== ${testid} ====`);
	img.toData().show();
	let t = performance.now();
	let pos = reader.find(img);
	globalThis.font = reader.font?.def;
	//testfont(reader.font.def);
	console.log(performance.now() - t, pos);

	if (!pos) {
		console.log("couldn't find pos " + testid);
		return;
	}

	t = performance.now();
	reader.diffRead = false;
	let res = [] as any[];
	for (let a = 0; a < 1; a++) {
		res.push(reader.read(img));
	}
	console.log(performance.now() - t, res[0]);

	globalThis.reader = reader;
}

let commaimg: ImageData | null = null;
let commareplace: ImageData | null = null;

globalThis.setComma = setComma;
globalThis.replaceCommas = replaceCommas;

function setComma() {
	commaimg = null;
	commareplace = null;
	let cb = (i: ImgRef) => {
		if (!commaimg) {
			commaimg = i.toData();
			for (let a = 0; a < commaimg.data.length; a += 4) {
				let pix = new Uint8Array(commaimg.data.buffer, a, 4);
				if (pix[0] == 255 && pix[1] == 255 && pix[2] == 255) {
					pix[0] = 0;
					pix[1] = 0;
					pix[3] = 0;
					pix[3] = 0;
				}
			}
			commaimg.show();
			console.log("search img set");
		}
		else if (!commareplace) {
			commareplace = i.toData();
			commareplace.show();
			console.log("replace img set - done");
			a1lib.PasteInput.unlisten(cb);
		}
	}
	a1lib.PasteInput.listen(cb);
}

function replaceCommas(img: ImageData, comma: ImageData) {
	let cb = (i: ImgRef) => {
		//a1lib.PasteInput.unlisten(cb);

		let buf = i.toData();
		//don't use findsubimg built-ins as they only go up to 50 matches
		let matches: { x: number, y: number }[] = [];
		for (var y = 0; y <= buf.height - commaimg!.height; y++) {
			for (var x = 0; x <= buf.width - commaimg!.width; x++) {
				if (simpleCompare(buf, commaimg!, x, y, 10) != Infinity) {
					matches.push({ x, y });
				}
			}
		}
		for (let pos of matches) {
			commareplace!.copyTo(buf, 0, 0, commareplace!.width, commareplace!.height, pos.x, pos.y);
		}
		buf.show();
	}
	a1lib.PasteInput.listen(cb);
}
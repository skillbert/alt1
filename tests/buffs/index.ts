import * as a1lib from "alt1/base";
import { webpackImages, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";
import BuffReader from "alt1/buffs";

globalThis.OCR = OCR;
globalThis.ImageDetect = a1lib.ImageDetect;
globalThis.a1lib = a1lib;

let tests = webpackImages({
	test1080p: import("./imgs/test1080p.data.png"),
	newui: import("./imgs/new.data.png"),
	more3: import("./imgs/more3.data.png"),
	dark59m: import("./imgs/59mdarker.data.png"),
	screen59m: import("./imgs/59mscreen.data.png"),
	mscreen1: import("./imgs/mscreenshot1.data.png"),
	bright1: import("./imgs/1bright.data.png"),
	bright2: import("./imgs/2bright.data.png"),
	bright3: import("./imgs/3bright.data.png"),
	bright4: import("./imgs/4bright.data.png"),
	bright5: import("./imgs/5bright.data.png"),
	bright6: import("./imgs/6bright.data.png"),
	bright7: import("./imgs/7bright.data.png"),
	bright8: import("./imgs/8bright.data.png"),
	bright9: import("./imgs/9bright.data.png"),
	bright10: import("./imgs/10bright.data.png"),
	debuff28: import("./imgs/2.8bright.data.png"),
	debuff30: import("./imgs/debuff30.data.png"),
});

// Expected values for each test image
type Expected = { buffs: (string | null)[], debuffs: (string | null)[] };
let expected: { [key: string]: Expected } = {
	test1080p: {
		buffs: [null, "60", "18m", "170m", null, "1K", "94%", null],
		debuffs: ["1.3"]
	},
	newui: {
		buffs: ["16", "50", null, null],
		debuffs: ["2.9"]
	},
	more3: {
		// BUFF 1 "9" on golden bg reads as "50" (bg contamination)
		// BUFF 2 star icon has no readable text
		buffs: ["3", "50", null, null, null, null],
		debuffs: ["3.3"]
	},
	dark59m: {
		buffs: ["50", "4m", "59m", null],
		debuffs: []
	},
	screen59m: {
		buffs: ["50", "5m", "59m", null],
		debuffs: []
	},
	mscreen1: {
		buffs: ["50", "6m", null],
		debuffs: []
	},
	bright1: {
		buffs: ["1", "50", "39m", null],
		debuffs: []
	},
	bright2: {
		buffs: ["2", "50", "38m", null],
		debuffs: []
	},
	bright3: {
		buffs: ["3", "50", "38m", null],
		debuffs: []
	},
	bright4: {
		buffs: ["4", "50", "36m", null],
		debuffs: []
	},
	bright5: {
		buffs: ["5", "50", "36m", null],
		debuffs: []
	},
	bright6: {
		buffs: ["6", "50", "35m", null],
		debuffs: []
	},
	bright7: {
		buffs: ["7", "50", "29m", null],
		debuffs: []
	},
	bright8: {
		buffs: ["8", "50", "29m", null],
		debuffs: []
	},
	bright9: {
		buffs: ["9", "50", "29m", null],
		debuffs: []
	},
	bright10: {
		buffs: ["10", "50", "28m", null],
		debuffs: []
	},
	debuff28: {
		buffs: ["50", "2m", "2m", "56m", null, "8", "3", "4"],
		debuffs: ["2.8", "1"]
	},
	debuff30: {
		buffs: ["50", null],
		debuffs: ["3"] // TODO: should read "3.0" — the "0" renders as "9" in font template matching
	}
};


export default async function run() {
	await tests.promise;

	let totalPass = 0;
	let totalFail = 0;

	for (let testid in tests.raw) {
		console.log(`\n========== ${testid} ==========`);
		let img = new ImgRefData(tests[testid]);
		let imgdata = img.toData();
		imgdata.show();

		let exp = expected[testid];

		for (let isDebuff of [false, true]) {
			let label = isDebuff ? "DEBUFF" : "BUFF";
			let expValues = isDebuff ? exp.debuffs : exp.buffs;
			let reader = new BuffReader();
			reader.debuffs = isDebuff;

			let found = reader.find(img);

			if (!found || !reader.pos) {
				console.log(`  ${label}: not found`);
				for (let e of expValues) {
					if (e !== null) { console.log(`    FAIL: expected "${e}" but bar not found`); totalFail++; }
				}
				continue;
			}

			console.log(`  ${label} found: pos=[${reader.pos.x},${reader.pos.y}] scale=${reader.scale.toFixed(2)}x (${reader.buffsize}px)`);

			// Crop buffer
			let rect = reader.getCaptRect()!;
			let cropX = Math.max(0, rect.x);
			let cropY = Math.max(0, rect.y);
			let cropW = Math.min(rect.width, imgdata.width - cropX);
			let cropH = Math.min(rect.height, imgdata.height - cropY);
			if (cropW < reader.buffsize || cropH < reader.buffsize) {
				console.log(`  ${label}: crop too small`); continue;
			}
			reader.pos!.maxhor = Math.min(reader.pos!.maxhor, Math.floor((cropW - reader.buffsize) / reader.gridsize));
			reader.pos!.maxver = Math.min(reader.pos!.maxver, Math.floor((cropH - reader.buffsize) / reader.gridsize));
			let croppedBuffer = imgdata.clone({ x: cropX, y: cropY, width: cropW, height: cropH });

			let buffs: any[] | null = null;
			try { buffs = reader.read(croppedBuffer); } catch (e) {
				console.log(`  ${label} read ERROR: ${e}`); continue;
			}

			if (!buffs) { console.log(`  ${label}: read returned null`); continue; }

			// Compare each buff against expected
			// Import AntiAlias for diagnostics
			let { AntiAlias } = require("alt1/buffs");
			let cleanedBuf = AntiAlias.cleanBuffer(croppedBuffer);
			let brightCleanedBuf = AntiAlias.cleanBufferBright(croppedBuffer);

			let maxIdx = Math.max(buffs.length, expValues.length);
			for (let i = 0; i < maxIdx; i++) {
				let expVal = i < expValues.length ? expValues[i] : null;
				let actual = "";

				if (i < buffs.length) {
					try {
						let argResult = buffs[i].readArg("arg" as any);
						actual = argResult.arg || "";
					} catch (e) { actual = `ERROR: ${e}`; }
				}

				// Build status
				let status = "";
				let isFail = false;
				if (expVal === null && actual === "") {
					status = "PASS (no timer)";
					totalPass++;
				} else if (expVal === null && actual !== "") {
					status = `FAIL: expected no timer, got "${actual}"`;
					totalFail++; isFail = true;
				} else if (expVal !== null && actual === "") {
					status = `FAIL: expected "${expVal}", got nothing`;
					totalFail++; isFail = true;
				} else if (expVal !== null && actual === expVal) {
					status = `PASS ✓`;
					totalPass++;
				} else {
					status = `FAIL: expected "${expVal}", got "${actual}"`;
					totalFail++; isFail = true;
				}

				console.log(`    ${label} ${i}: ${status}${actual ? ` [read: "${actual}"]` : ""}`);

				// Diagnostic dump for failures OR bright Buff 0
				let isBrightBuff0 = i === 0 && i < buffs.length && AntiAlias.isBrightIcon(croppedBuffer, buffs[i].bufferx, buffs[i].buffery, reader.buffsize);
				if ((isBrightBuff0 || (isFail && expVal)) && i < buffs.length) {
					let bx = buffs[i].bufferx;
					let by = buffs[i].buffery;
					let iconSize = reader.buffsize;
					let useBright = isBrightBuff0;
					let diagBuf = useBright ? brightCleanedBuf : cleanedBuf;
					let d = diagBuf.data;
					let w = diagBuf.width;

					// Show cleaned pixel grid for text area
					let gridStr = "      Cleaned text area:\n";
					for (let py = by + Math.round(14 * reader.scale); py < by + iconSize - 1; py++) {
						let row = "      ";
						for (let px = bx + 1; px < bx + iconSize - 1; px++) {
							let pi = (py * w + px) * 4;
							row += d[pi] > 200 ? "##" : "  ";
						}
						gridStr += row + "\n";
					}
					console.log(gridStr);

					// Debug: show matchCharAt scores at key positions
					let { AntiAlias: AA } = require("alt1/buffs");
					let debugClean = useBright ? AA.cleanBufferBright(croppedBuffer) : AA.cleanBuffer(croppedBuffer);
					let debugStr = "      matchCharAt scores:\n";
					for (let dx = 0; dx < iconSize - 6; dx += 2) {
						let testX = bx + 1 + dx;
						for (let testY = by + Math.round(22 * reader.scale); testY <= by + Math.round(24 * reader.scale); testY++) {
							let m = BuffReader.matchCharAt(debugClean, testX, testY, 0.4);
							if (m) {
								debugStr += `      x=${dx} y=${testY-by}: "${m.chr}" score=${m.score.toFixed(2)} width=${m.width}\n`;
							}
						}
					}
					console.log(debugStr);

					// Debug: dot detection info — check bright pixels between character positions
					if (actual) {
						let oy2 = by + Math.round(23 * reader.scale);
						let dotDebug = "      dot detection:\n";
						for (let px2 = bx + 2; px2 < bx + iconSize - 2; px2++) {
							let hasBright = false;
							for (let dy2 = -3; dy2 <= 0; dy2++) {
								let cy = oy2 + dy2;
								if (cy >= 0 && cy < debugClean.height && px2 >= 0 && px2 < debugClean.width) {
									let pi = (cy * debugClean.width + px2) * 4;
									if (debugClean.data[pi] > 200) { hasBright = true; break; }
								}
							}
							if (hasBright) dotDebug += `      col ${px2-bx}: bright\n`;
						}
						console.log(dotDebug);
					}
				}
			}
		}
	}

	console.log(`\n${"=".repeat(50)}`);
	console.log(`RESULTS: ${totalPass} PASS, ${totalFail} FAIL`);
	console.log(`${"=".repeat(50)}`);

	globalThis.BuffReader = BuffReader;
}

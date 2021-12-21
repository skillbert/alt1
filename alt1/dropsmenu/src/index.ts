import * as a1lib from "@alt1/base";
import {ImgRef, RectLike} from "@alt1/base";
import * as OCR from "@alt1/ocr";
import {parseAmount} from "./monetary-util";
import {DEBUG_COLORS, debugOverlayRectLike} from "./debug-util";

const imgs = a1lib.ImageDetect.webpackImages({
	loot: require("./imgs/lootbutton.data.png"),
	reset: require("./imgs/reset.data.png"),
	lootText: require("./imgs/loottext.data.png"),
	qtyText: require("./imgs/quantitytext.data.png")
});

const font = require("@alt1/ocr/fonts/aa_8px_new.js");

const fontColors: OCR.ColortTriplet[] = [
	[255, 255, 255],    // white
	[30, 255, 0],       // green
	[102, 152, 255],    // blue
	[163, 53, 238],     // purple
	[255, 128, 0]       //orange (1b+ and boss pets)
];

const offsetRectLike = (rectLike: RectLike, offset: { x: number, y: number }): RectLike => ({
	x: rectLike.x + offset.x,
	y: rectLike.y + offset.y,
	width: rectLike.width,
	height: rectLike.height
});

interface ICustomDropsMenuReaderConstraints {
	areaLoot?: RectLike;
	resetLoot?: RectLike;
	lootTitle?: RectLike;
	qtyTitle?: RectLike;
	box?: RectLike;
}

export interface IDropsMenuLine {
	name: string;
	amount: number;
}

export default class DropsMenuReader {

	private readonly debugMode: boolean;
	private constraints: ICustomDropsMenuReaderConstraints = {};
	private items: { [name: string]: number } = {};
	public onincrease?: (name: string, increase: number, newTotal: number) => any;

	constructor(debugMode = false) {
		this.debugMode = debugMode;
	}

	findAreaLootImgPosition(img: ImgRef): RectLike {
		const pos = img.findSubimage(imgs.loot);
		if (pos.length == 0) {
			throw new Error('Could not detect "Open Area Loot" image.');
		}

		const constraints = {
			x: pos[0].x,
			y: pos[0].y,
			width: imgs.loot.width,
			height: imgs.loot.height
		};
		if (this.debugMode) {
			console.debug('AreaLoot image detected:', constraints);
			debugOverlayRectLike(DEBUG_COLORS.PINK, constraints);
		}
		return constraints;
	}

	findResetLootImgPosition(img: ImgRef): RectLike {
		const areaLoot = this.constraints.areaLoot!;
		const boundingBox = [
			areaLoot.x + areaLoot.width,
			areaLoot.y,
			img.width - (areaLoot.x + areaLoot.width),
			imgs.reset.height
		];
		const pos = img.findSubimage(imgs.reset, ...boundingBox);
		if (pos.length == 0) {
			throw new Error('Could not detect "Reset Loot" image.');
		}

		const constraints = {
			x: pos[0].x,
			y: pos[0].y,
			width: imgs.reset.width,
			height: imgs.reset.height
		};
		if (this.debugMode) {
			console.debug('ResetLoot image detected:', constraints);
			debugOverlayRectLike(DEBUG_COLORS.PINK, constraints);
		}
		return constraints;
	}

	findLootTitlePosition(img: ImgRef): RectLike {
		const areaLoot = this.constraints.areaLoot!;
		const leftEdge = areaLoot.x - 32; // The left edge of the interface
		const minHeightInterface = 50; // Not exactly the minHeight, but this limits the bounding box a little extra.

		const pos = img.findSubimage(imgs.lootText, leftEdge + 5, 0, imgs.lootText.width, areaLoot.y - 5 - minHeightInterface);
		if (pos.length == 0) {
			throw new Error('Could not detect "Loot" title.');
		}

		const constraints = {
			x: pos[0].x,
			y: pos[0].y,
			width: imgs.lootText.width,
			height: imgs.lootText.height
		};
		if (this.debugMode) {
			console.debug('LootTitle text detected:', constraints);
			debugOverlayRectLike(DEBUG_COLORS.PINK, constraints);
		}
		return constraints;
	}

	calculateFullInterfaceConstraints() {
		const areaLoot = this.constraints.areaLoot!;
		const lootTitle = this.constraints.lootTitle!;
		const resetLoot = this.constraints.resetLoot!;

		const x = areaLoot.x - 32;
		const y = lootTitle.y - 4;
		const width = (resetLoot.x + resetLoot.width + 4) - (x);
		const height = (areaLoot.y + areaLoot.height + 5) - (y);


		const constraints = {x, y, width, height};
		if (this.debugMode) {
			console.debug('Full interface detected:', constraints);
			debugOverlayRectLike(DEBUG_COLORS.WHITE, constraints);
		}
		return constraints;
	}

	find(img?: ImgRef) {
		img = img || a1lib.captureHoldFullRs();
		if (!img) {
			return null;
		}

		try {
			this.constraints.areaLoot = this.findAreaLootImgPosition(img);
			this.constraints.resetLoot = this.findResetLootImgPosition(img);
			this.constraints.lootTitle = this.findLootTitlePosition(img);
			this.constraints.box = this.calculateFullInterfaceConstraints();
		} catch (reason) {
			console.error(reason?.message);
		}

		return this.constraints.box;
	}

	findQtyTitlePosition(boxBuffer: ImageData): RectLike {
		const boundingBox = [
			20,
			4,
			boxBuffer.width - 20,
			imgs.qtyText.height
		];
		const [x, y, width, height] = boundingBox;
		const pos = a1lib.ImageDetect.findSubbuffer(boxBuffer, imgs.qtyText, x, y, width, height);
		if (pos.length == 0) {
			throw new Error('Could not detect "Qty" title.');
		}

		const constraints = {
			x: pos[0].x,
			y: pos[0].y,
			width: imgs.qtyText.width,
			height: imgs.qtyText.height
		};
		if (this.debugMode) {
			console.debug('LootQty text detected (relative constraints):', constraints);
			debugOverlayRectLike(DEBUG_COLORS.PINK, offsetRectLike(constraints, this.constraints.box!));
		}
		return constraints;
	}

	read(img?: ImgRef): IDropsMenuLine[] | null {
		if (!this.constraints?.box) {
			return null;
		}
		let boxBuffer: ImageData;
		const {box} = this.constraints;
		if (img) {
			boxBuffer = img.toData(box.x, box.y, box.width, box.height);
		} else {
			const {box} = this.constraints;
			boxBuffer = a1lib.capture(box.x, box.y, box.width, box.height);
		}

		const qtyTitleRelConstraints = this.findQtyTitlePosition(boxBuffer); // These constraints are relative to the "box"

		const readItems: IDropsMenuLine[] = [];
		for (let lootLineOffset = 34; lootLineOffset + 5 < boxBuffer.height; lootLineOffset += 18) {
			alt1.overLayRect(DEBUG_COLORS.CYAN, box.x + 5, box.y + lootLineOffset, 1, 1, 3000, 1);
			const itemLine = OCR.readLine(boxBuffer, font, fontColors, 5, lootLineOffset, true, false);
			if (itemLine.text) {
				const amount = OCR.readLine(boxBuffer, font, fontColors, qtyTitleRelConstraints.x, lootLineOffset, true, false);
				const item: IDropsMenuLine = {
					name: itemLine.text,
					amount: parseAmount(amount.text)
				}
				readItems.push(item);

				let diff = 0
				if (!this.items[item.name]) {
					this.items[item.name] = item.amount;
					diff = item.amount;
				} else {
					diff = item.amount - this.items[item.name];
					this.items[item.name] = item.amount;
				}

				if (diff === 0) {
					continue;
				}
				this.onincrease?.(item.name, diff, item.amount);
			}
		}
		return readItems;
	}
}
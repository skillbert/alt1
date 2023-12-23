import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import { webpackImages, ImgRef, RectLike } from "alt1/base";

//TODO this is prabably the same as the src/fonts ones
var stdfont = require("./imgs/aa_8px_mono_pof2.fontmeta.json");
var namefont = require("../fonts/aa_12px_mono.fontmeta.json");


var imgs = webpackImages({
	happynessicon: require("./imgs/animalhappy.data.png"),
});

export type AnimalData = NonNullable<ReturnType<AnimalReader["read"]>>;
export var growtStages = {
	Egg: 0,
	Baby: 1,
	Adolescent: 2,
	Adult: 3,
	Elder: 4
};
export type GrowthStage = keyof typeof growtStages;



export default class AnimalReader {
	pos: RectLike | null = null;

	static compareAnimals(a1: AnimalData, a2: AnimalData) {
		var fails = 0;
		if (a1.name != a2.name) { fails++; }
		if (a1.trait0 != a2.trait0) { fails++; }
		if (a1.trait1 != a2.trait1) { fails++; }
		if (a1.trait2 != a2.trait2) { fails++; }
		if (a1.flavourtext != a2.flavourtext) { fails++ }
		if (a1.ismale != a2.ismale) { fails++; }
		return fails <= 1;
	}

	find(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }

		var pos = img.findSubimage(imgs.happynessicon);
		if (pos.length == 0) { return null; }

		this.pos = { x: pos[0].x - 44, y: pos[0].y - 154, width: 496, height: 232 };
		return this.pos;
	}

	private readMultiline(data: ImageData, col: OCR.ColortTriplet, x: number, y: number) {
		var t = OCR.findReadLine(data, stdfont, [col], x, y);
		if (t.text == "") {
			var t0 = OCR.findReadLine(data, stdfont, [col], x, y - 6);
			var t1 = OCR.findReadLine(data, stdfont, [col], x, y + 6);
			return t0.text + " " + t1.text;
		}
		return t.text;
	}

	read(img?: ImgRef) {
		if (!this.pos) { return null; }


		var data = (img ? img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height) : a1lib.capture(this.pos));
		if (!data) { return null; }

		//confirm interface
		if (data.pixelCompare(imgs.happynessicon, 44, 154) > 10) { return null; }


		var name = OCR.findReadLine(data, namefont, [[255, 203, 5]], 250, 20).text.toLowerCase();

		var stage = OCR.findReadLine(data, stdfont, [[255, 255, 255]], 104, 40).text as GrowthStage;
		var happy = parseInt(OCR.findReadLine(data, stdfont, [[255, 255, 255]], 109, 140).text) / 100;
		var health = parseInt(OCR.findReadLine(data, stdfont, [[255, 255, 255]], 104, 157).text) / 100;

		var readTrait = (x: number) => {
			var t = this.readMultiline(data, [117, 146, 160], x, 173);
			if (t.match(/no trait/i)) { return ""; }
			return t;
		}
		var trait0 = readTrait(256);
		var trait1 = readTrait(351);
		var trait2 = trait1 && readTrait(447);

		var breedstr = OCR.readLine(data, stdfont, [255, 255, 255], 219, 49, true, false).text;
		var breedm = breedstr.match(/Breed: ([\w ]+?) \((male|female)\)/);
		var ismale = !breedm || breedm[2] == "male";
		var breed = (breedm ? breedm[1] : "");

		var paddockType = OCR.readLine(data, stdfont, [255, 255, 255], 219, 65, true, false).text;
		var weight = OCR.readLine(data, stdfont, [255, 255, 255], 219, 81, true, false).text;
		var speed = OCR.readLine(data, stdfont, [255, 255, 255], 219, 98, true, false).text;
		var attractiveness = OCR.readLine(data, stdfont, [255, 255, 255], 219, 115, true, false).text;

		var flavourtext = this.readMultiline(data, [255, 255, 255], 243, 215);

		return { stage, happy, health, trait0, trait1, trait2, breed, paddockType, weight, speed, attractiveness, name, flavourtext, ismale };
	}
}
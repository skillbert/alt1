import * as a1lib from "@alt1/base";
import * as OCR from "@alt1/ocr";
import ActionbarReader from "./actionbar";
import { AbilityReadInfo } from "@alt1/abilitytooltip";
import { Rect } from "@alt1/base";


export type AbilityInfo = AbilityReadInfo & {
	id: string,
	flags: ("dmgult" | "bufstart")[],
	channeldmg?: number[],
	colorcss?: string
}

var cdfont = require("../ocr/fonts/pixel_digits_8px_shadow.fontmeta.json");
export var abilities: AbilityInfo[] = require("./data/abilities.json");

var imgs = a1lib.ImageDetect.webpackImages({
	settingscog: require("./imgs/settingscog.data.png"),
	smallbarnumber: require("./imgs/smallbarnumber.data.png"),
	abilities: require("./imgs/abilities.data.png"),
	actionbarnumbers: require("./imgs/actionbarnumbers.data.png")
});

var actionbarNumbers: StringMap<ImageData> = {};

imgs.promise.then(() => {
	var size = 30;
	for (var a = 0; a < abilities.length; a++) {
		var abil = abilities[a];
		abil.icon = imgs.abilities.clone(new a1lib.Rect(a * size, 0, size, size));
	}
	var nsize = 10;
	for (var a = 0; a * 10 < imgs.actionbarnumbers.width; a++) {
		actionbarNumbers[a + 1] = imgs.actionbarnumbers.clone(new Rect(a * 10, 0, 10, 10));
	}
});

export default class AbilityReader {
	bars: AbilityBar[] = [];
	barstates: StringMap<AbilityLoadout> = {};
	captureRect: a1lib.Rect = null;
	actionbarReader = new ActionbarReader();

	static imgs = {
		smallbarnumber: null as ImageData,
		settingscog: null as ImageData
	};

	constructor() { }

	find(img?:a1lib.ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }

		this.bars = [];
		var locs = img.findSubimage(imgs.smallbarnumber);

		var cog = imgs.settingscog;
		for (var loc of locs) {
			for (var key in AbilityBar.types) {
				var t = AbilityBar.types[key];
				if (!t.sec) { continue; }
				var buf = img.read(loc.x - t.detect.x + t.cog.x, loc.y - t.detect.y + t.cog.y, cog.width, cog.height);
				if (buf.pixelCompare(cog) < 10) {
					var bar = new AbilityBar(loc.x - t.detect.x, loc.y - t.detect.y, t, this.barstates);
					bar.overlay();
					this.bars.push(bar);
					break;
				}
			}
		}

		if (!this.actionbarReader.pos) { this.actionbarReader.find(img); }
		if (this.actionbarReader.pos) {
			var mainpos = this.actionbarReader.pos;
            var t = AbilityBar.types[mainpos.layout.type];

			var bar = new AbilityBar(mainpos.x - t.action.x, mainpos.y - t.action.y, AbilityBar.types[mainpos.layout.type], this.barstates);
			bar.overlay();
			this.bars.unshift(bar);
		}


		if (this.bars.length == 0) {
			return null;
		}

		this.captureRect = a1lib.Rect.fromArgs(this.bars[0].bounds);
		for (var i = 1; i < this.bars.length; i++) {
			this.captureRect.union(this.bars[i].bounds);
		}

		return this.bars.length;
	}

	readAllSlots(img?: a1lib.ImgRef) {
		var data: ImageData;
		if (img) { data = img.toData(this.captureRect.x, this.captureRect.y, this.captureRect.width, this.captureRect.height); }
		else { data = a1lib.capture(this.captureRect.x, this.captureRect.y, this.captureRect.width, this.captureRect.height); }
		var i = 0;
		for (var b of this.bars) {
			var nr = b.readBarNr(data, this.captureRect.x, this.captureRect.y);
			if (!nr) { continue; }
			var state = this.barstates[nr];
			for (var a = 0; a < b.slots.length; a++) {
				state.slots[a].readAbility(data, b.slots[a].x - this.captureRect.x, b.slots[a].y - this.captureRect.y);
			}
		}
	}

	*visibleAbilities() {
		for (var bar of this.bars) {
			if (bar.barid) {
				yield* this.barstates[bar.barid].slots;
			}
		}
	}
	*allslots() {
		for (var bar of this.bars) {
			yield* bar.slots;
		}
	}
}

interface AbilityBarTypeMeta {
	sec: boolean,
	step: { x: number, y: number },
	rowstep: { x: number, y: number },
	rowlen: number,
	length: number,
	detect: { x: number, y: number },
	cog?: { x: number, y: number },
	action?: { x: number, y: number },
	num?: {x:number,y:number}
};

class AbilityBarSlot {
	x: number;
	y: number;
	index: number;
	bar: AbilityBar;
	constructor(x: number, y: number, index: number, bar: AbilityBar) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.bar = bar;
	}
	getState() {
		return this.bar.barstates[this.bar.barid].slots[this.index];
	}
}

interface AbilityLoadout {
	barid: string;
	slots: AbilityState[];
}


class AbilityBar{
	static types: { [key: string]: AbilityBarTypeMeta } = {
		flat: { sec: true, step: { x: 36, y: 0 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, cog: { x: 504, y: 17 }, detect: { x: 501, y: -2 }, num: { x: 503, y: 2 } },
		hor: { sec: true, step: { x: 35, y: 0 }, rowstep: { x: 0, y: 35 }, rowlen: 7, length: 14, cog: { x: 245, y: 54 }, detect: { x: 242, y: -1 }, num: { x: 244, y: 3 } },
		ver: { sec: true, step: { x: 0, y: 35 }, rowstep: { x: 35, y: 0 }, rowlen: 7, length: 14, cog: { x: 56, y: 245 }, detect: { x: -3, y: 242 }, num: { x: -1, y: 246 } },
		tower: { sec: true, step: { x: 0, y: 36 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, cog: { x: 20, y: 504 }, detect: { x: -3, y: 501 }, num: { x: -1, y: 505 } },

		mainflat: { sec: false, step: { x: 36, y: 0 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, detect: { x: 12, y: -29 }, action: { x: 54, y: -31 }, num: { x: 14, y: -25 } },
		mainhor: { sec: false, step: { x: 36, y: 0 }, rowstep: { x: 0, y: 36 }, rowlen: 7, length: 14, detect: { x: 10, y: -45 }, action: { x: 44, y: 46 }, num: { x: 12, y: -41 } },
		mainver: { sec: false, step: { x: 0, y: 35 }, rowstep: { x: 35, y: 0 }, rowlen: 7, length: 14, detect: { x: 84, y: 232 }, action: { x: 75, y: 10 }, num: { x: 86, y: 236 } },
		maintower: { sec: false, step: { x: 0, y: 36 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, detect: { x: 40, y: 15 }, action: { x: 43, y: 45 }, num: { x: 42, y: 19 } },
	};

	x: number;
	y: number;
	bounds: Rect;
    barid: string;
    slots: AbilityBarSlot[] = [];
	layout: AbilityBarTypeMeta;
	barstates: StringMap<AbilityLoadout>;

	constructor(x, y, layout: AbilityBarTypeMeta, barstates: StringMap<AbilityLoadout>) {
		this.layout = layout;
		this.barstates = barstates;
		this.x = x;
		this.y = y;
		var bounds = new Rect(x + layout.num.x, y + layout.num.y - 10, 10, 15);
		var cx = x;
		var cy = y;
		for (var a = 0; a < layout.length; a++) {
			this.slots.push(new AbilityBarSlot(cx, cy, a, this));
			bounds.union(new Rect(cx, cy, AbilityState.iconwidth, AbilityState.iconheight));
			cx += layout.step.x;
			cy += layout.step.y;
			if ((a + 1) % layout.rowlen == 0) {
				cx += layout.rowstep.x - layout.rowlen * layout.step.x;
				cy += layout.rowstep.y - layout.rowlen * layout.step.y;
			}
		}
		this.bounds = bounds;
    }

	readBarNr(buffer: ImageData, bufx: number, bufy: number) {
		var match = "";
		for (var a in actionbarNumbers) {
			var m = buffer.pixelCompare(actionbarNumbers[a], this.x + this.layout.num.x - bufx, this.y + this.layout.num.y - bufy);
			if (m != Infinity) {
				match = a;
				break;
			}
		}
		if (!match) { return ""; }
		this.barid = match;
		if (!this.barstates[this.barid]) {
			this.barstates[this.barid] = { barid: this.barid, slots: [] };
			for (var b = 0; b < this.layout.length; b++) {
				this.barstates[this.barid].slots[b] = new AbilityState();
			}
		}
		
		return this.barid;
    }
	
	overlay() {
		if (a1lib.hasAlt1) {
			alt1.overLayRect(a1lib.mixColor(255, 255, 255), this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, 3000, 2);
		}
	}
}

class AbilityState {
	static iconwidth = 30 + 1;
	static iconheight = 30;
	
	donetime = 0;
	hadcd = false;
	cdchange = 0;
	cooldown = 0;
	hotkey = "";
	imgscore = -Infinity;
	ability: AbilityInfo = null;
	nextdetecttry = 0;


	constructor() { }

	readAbility(data: ImageData, x: number, y: number) {
		var res = OCR.readLine(data, cdfont, [206, 213, 135], x + 31, y + 8, false, true);
		var t = 0;
		if (res.text.endsWith("m")) { t = 60 * +res.text.slice(0, -1); }
		else { t = +res.text; }
		var now = Date.now();
		this.cdchange = t - this.cooldown;
		this.cooldown = t;
		if (t != 0) { this.donetime = now + t * 1000; }
		this.hadcd = this.donetime - now > -60 * 1000;//has been on cooldown in the last minute

		if (!this.ability && this.nextdetecttry<now) {
			this.ability = AbilityState.getAbility(data, x, y);
			this.nextdetecttry = now + 1000 * 5 * (1 + Math.random());//5-10 sec delay to spread load
		}
    }

    readClock(data: ImageData, abilx: number, abily: number) {
        var size = 30;
        var template = this.ability.icon;
        var dirs = [
            { n: size / 2, ox: size / 2, oy: 0, sx: 1, sy: 0 },
            { n: size, ox: size, oy: 0, sx: 0, sy: 1 },
            { n: size, ox: size, oy: size, sx: -1, sy: 0 },
            { n: size, ox: 0, oy: size, sx: 0, sy: -1 },
            { n: size / 2, ox: 0, oy: 0, sx: 1, sy: 0 }
        ];
        var n = 0;
        var w = 0;
        for (var dir of dirs) {
            for (var a = 0; a < size; a++) {
                var x = dir.ox + a * dir.sx;
                var y = dir.oy + a * dir.sy;
				var i1 = (abilx + x) * 4 + (abily + y) * data.width * 4;
                var i2 = x * 4 + y * template.width * 4;
            }
        }
    }

	static getAbility(buf: ImageData, abilx: number, abily: number) {
		var a = 0.20;
		var best: AbilityInfo = null;
		var bestscore = 30 * 30 * 10;
		
		for (var abil of abilities) {
			var icon = abil.icon;
			var score = 0;
			for (var x = 0; x < 30; x++) {
				for (var y = 0; y < 30; y++) {
					var i1 = (x + abilx) * 4 + (y + abily) * 4 * buf.width;
					var i2 = x * 4 + y * 4 * icon.width;
					var d1 = Math.abs(buf.data[i1] - icon.data[i2]) + Math.abs(buf.data[i1 + 1] - icon.data[i2 + 1]) + Math.abs(buf.data[i1 + 2] - icon.data[i2 + 2]);
					var d2 = Math.abs(buf.data[i1] - icon.data[i2] * a) + Math.abs(buf.data[i1 + 1] - icon.data[i2 + 1] * a) + Math.abs(buf.data[i1 + 2] - icon.data[i2 + 2] * a);
					var d = Math.min(d1, d2, 20);
					score += d;
				}
			}
			if (score < bestscore) {
				bestscore = score;
				best = abil;
			}
		}
		return best;
	}

	static isBlack(buf: ImageData, abilx: number, abily: number, base: AbilityBarSlot) {
		var n = 0;
		var max = 9;
		for (var x = 0; x < 30; x++) {
			for (var y = 0; y < 30; y++) {
				var i = (x + abilx) * 4 + (y + abily) * 4 * buf.width;
				if (buf.data[i] < max && buf.data[i + 1] < max && buf.data[i + 2] < max) {
					n++;
				}
			}
		}
		return n / 30 / 30;
    }

}















import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import ActionbarReader, { LifeState } from "./actionbar";
import { webpackImages, Rect, ImgRef, captureAsync, ImageDetect } from "alt1/base";

export { default as ActionbarReader, LifeState } from "./actionbar";

export interface AbilityInfoBare { id: string, icon: ImageData, cooldown: number };

var cdfont = require("../fonts/pixel_8px_digits.fontmeta.json");
var hotkeyfont = require("../fonts/aa_8px.fontmeta.json");

var imgs = webpackImages({
	settingscog: require("./imgs/settingscog.data.png"),
	smallbarnumber: require("./imgs/smallbarnumber.data.png"),
	actionbarnumbers: require("./imgs/actionbarnumbers.data.png")
});

var barnumimgs: ImageDetect.ImageDataSet = null!;
var barnummap: { [id: number]: string } = {};

imgs.promise.then(() => {
	barnumimgs = ImageDetect.ImageDataSet.fromFilmStrip(imgs.actionbarnumbers, 10);
	for (let a = 0; a < 13; a++) { barnummap[a] = (a + 1) + ""; }
});

type AbilBarId = "bar0" | "bar1" | "bar2" | "bar3" | "bar4";
type CaptAreas = Partial<{ [T in AbilBarId]: a1lib.RectLike }>;

export default class AbilityReader<T extends AbilityInfoBare> {
	bars: AbilityBar<T>[] = [];
	mainbar: AbilityBar<T> | null = null;
	barstates: { [name: string]: AbilityLoadout<T> } = {};
	captureRect: a1lib.Rect | null = null;
	actionbarReader = new ActionbarReader();
	abilityimgs: T[] | null = null;
	lifestate: LifeState = null!;

	//event when ocluded bar is visible again, before any further reading happens
	hooks = {
		onbarshown: null as ((bar: AbilityLoadout<T>) => any) | null
	}


	static imgs = {
		smallbarnumber: null as ImageData | null,
		settingscog: null as ImageData | null
	};

	constructor(abilityimgs: T[]) {
		this.abilityimgs = abilityimgs;
	}

	find(img?: a1lib.ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }

		this.bars = [];
		var locs = img.findSubimage(imgs.smallbarnumber);

		var cog = imgs.settingscog;
		for (var loc of locs) {
			for (var key in AbilityBar.types) {
				var t = AbilityBar.types[key];
				if (!t.cog) { continue; }
				var rect = new Rect(loc.x - t.detect.x + t.cog.x, loc.y - t.detect.y + t.cog.y, cog.width, cog.height);
				if (Rect.fromArgs(img).contains(rect)) {
					var buf = img.read(loc.x - t.detect.x + t.cog.x, loc.y - t.detect.y + t.cog.y, cog.width, cog.height);
					if (buf.pixelCompare(cog) < 10) {
						var bar = new AbilityBar(this, loc.x - t.detect.x, loc.y - t.detect.y, t, this.barstates);
						bar.overlay();
						this.bars.push(bar);
						break;
					}
				}
			}
		}

		this.actionbarReader.find(img);
		if (this.actionbarReader.pos) {
			var mainpos = this.actionbarReader.pos;
			var t = AbilityBar.types[mainpos.layout.type];

			var bar = new AbilityBar(this, mainpos.x - t.action!.x, mainpos.y - t.action!.y, AbilityBar.types[mainpos.layout.type], this.barstates);
			bar.overlay();
			this.bars.unshift(bar);
			this.mainbar = bar;
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

	getCaptAreas() {
		var r: CaptAreas = {};
		for (var b in this.bars) { r["bar" + b] = this.bars[b].bounds; }
		return r;
	}

	/**
	 * @deprecated kinda needs rewrite to be efficient, use readallslotsinner manually instead
	 * @param img 
	 */
	readAllSlots(img?: a1lib.ImgRef) {
		var data: ImageData;
		if (!this.captureRect) { throw new Error("no capturerect set "); }
		if (img instanceof ImgRef) { data = img.toData(this.captureRect.x, this.captureRect.y, this.captureRect.width, this.captureRect.height); }
		else { data = a1lib.capture(this.captureRect.x, this.captureRect.y, this.captureRect.width, this.captureRect.height)!; }
		var capts = {};
		var captareas = {};
		for (var a in this.bars) {
			capts["bar" + a] = data;
			captareas["bar" + a] = this.captureRect;
		}
		return this.readAllSlotsInner(capts, captareas);
	}

	readAllSlotsInner(capts: Partial<{ [T in AbilBarId]: ImageData | null }>, captareas: CaptAreas) {
		var visiblebars: AbilityLoadout<T>[] = [];
		for (var b in this.bars) {
			var bar = this.bars[b];
			var capt = capts["bar" + b];
			var captarea = captareas["bar" + b];
			var nr = bar.readBarNr(capt, captarea.x, captarea.y);
			if (!nr) { continue; }
			var state = this.barstates[nr];
			visiblebars.push(state);
			if (!state.visible && this.hooks.onbarshown) {
				this.hooks.onbarshown(state);
			}
			for (var a = 0; a < bar.slots.length; a++) {
				state.slots[a].readAbility(capt, bar.slots[a].x - captarea.x, bar.slots[a].y - captarea.y);
			}
		}
		for (var id in this.barstates) {
			var barstate = this.barstates[id];
			barstate.visible = visiblebars.indexOf(this.barstates[id]) != -1
		}
	}
	finishTick() {
		for (var b in this.barstates) {
			var bar = this.barstates[b];
			for (var slot of bar.slots) {
				slot.lastcooldown = slot.cooldown;
				slot.lasttickcooldown = slot.tickcooldown
			}
		}
	}

	readLife(buffer: ImageData, bufx: number, bufy: number) {
		if (this.actionbarReader.pos == null) { return null; }
		this.lifestate = this.actionbarReader.read(buffer, bufx, bufy);
		return this.lifestate;
	}

	overlayState() {
		alt1.overLaySetGroup("abildebug");
		alt1.overLayFreezeGroup("abildebug");
		alt1.overLayClearGroup("abildebug");

		for (var bar of this.bars) {
			var state = this.barstates[bar.barid];
			if (state) {
				for (var a = 0; a < bar.slots.length; a++) {
					state.slots[a].overlayState(bar.slots[a].x, bar.slots[a].y);
				}
			}
		}
		alt1.overLayRefreshGroup("abildebug");
	}

	*visibleAbilities() {
		for (var bar of this.bars) {
			if (bar.barid) {
				yield* this.barstates[bar.barid].slots;
			}
		}
	}
	*allAbilities() {
		for (var barid in this.barstates) {
			var bar = this.barstates[barid];
			yield* bar.slots;
		}
	}
	*mainbarAbilities() {
		if (this.mainbar) {
			var bar = this.barstates[this.mainbar.barid];
			if (bar) { yield* bar.slots; }
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
	num: { x: number, y: number }
	id: string
};

class AbilityBarSlot<T extends AbilityInfoBare> {
	x: number;
	y: number;
	index: number;
	bar: AbilityBar<T>;
	constructor(x: number, y: number, index: number, bar: AbilityBar<T>) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.bar = bar;
	}
	getState() {
		return this.bar.barstates[this.bar.barid].slots[this.index];
	}
}

interface AbilityLoadout<T extends AbilityInfoBare> {
	barid: string;
	visible: boolean;
	slots: AbilityState<T>[];
}


class AbilityBar<T extends AbilityInfoBare> {
	static types: { [key: string]: AbilityBarTypeMeta } = {
		flat: { id: "flat", sec: true, step: { x: 36, y: 0 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, cog: { x: 504, y: 17 }, detect: { x: 501, y: -2 }, num: { x: 503, y: 2 } },
		hor: { id: "hor", sec: true, step: { x: 35, y: 0 }, rowstep: { x: 0, y: 35 }, rowlen: 7, length: 14, cog: { x: 245, y: 54 }, detect: { x: 242, y: -1 }, num: { x: 244, y: 3 } },
		ver: { id: "ver", sec: true, step: { x: 0, y: 35 }, rowstep: { x: 35, y: 0 }, rowlen: 7, length: 14, cog: { x: 56, y: 245 }, detect: { x: -3, y: 242 }, num: { x: -1, y: 246 } },
		tower: { id: "tower", sec: true, step: { x: 0, y: 36 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, cog: { x: 20, y: 504 }, detect: { x: -3, y: 501 }, num: { x: -1, y: 505 } },

		mainflat: { id: "mainflat", sec: false, step: { x: 36, y: 0 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, detect: { x: 12, y: -29 }, action: { x: 54, y: -31 }, num: { x: 14, y: -25 } },
		mainhor: { id: "mainhor", sec: false, step: { x: 36, y: 0 }, rowstep: { x: 0, y: 36 }, rowlen: 7, length: 14, detect: { x: 10, y: -45 }, action: { x: 43, y: -47 }, num: { x: 12, y: -41 } },
		mainver: { id: "mainver", sec: false, step: { x: 0, y: 35 }, rowstep: { x: 35, y: 0 }, rowlen: 7, length: 14, detect: { x: 84, y: 232 }, action: { x: 75, y: 10 }, num: { x: 86, y: 236 } },
		maintower: { id: "maintower", sec: false, step: { x: 0, y: 36 }, rowstep: { x: 0, y: 0 }, rowlen: 14, length: 14, detect: { x: 40, y: 15 }, action: { x: 43, y: 45 }, num: { x: 42, y: 19 } },
	};

	x: number;
	y: number;
	bounds: Rect;
	barid: string = "";//TODO find out when and where this is assigned, currently no proper initialization
	slots: AbilityBarSlot<T>[] = [];
	layout: AbilityBarTypeMeta;
	barstates: { [id: string]: AbilityLoadout<T> };
	reader: AbilityReader<T>;

	constructor(reader: AbilityReader<T>, x: number, y: number, layout: AbilityBarTypeMeta, barstates: { [id: string]: AbilityLoadout<T> }) {
		this.reader = reader;
		this.layout = layout;
		this.barstates = barstates;
		this.x = x;
		this.y = y;
		var bounds = new Rect(this.x + layout.num.x, this.y + layout.num.y, 10, 15);
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
		if (layout.action) {
			var mainlayout = ActionbarReader.layouts[layout.id];
			var mainrect = new a1lib.Rect(x + layout.action.x, y + layout.action.y, mainlayout.width, mainlayout.height);
			mainrect.inflate(10, 10);
			bounds.union(mainrect);
		}
		this.bounds = bounds;
	}

	readBarNr(buffer: ImageData, bufx: number, bufy: number) {
		let match = barnumimgs.matchBest(buffer, this.x + this.layout.num.x - bufx, this.y + this.layout.num.y - bufy);
		//1st secondary ability bar has one pixel offset!!@#!@#
		match = match || barnumimgs.matchBest(buffer, this.x + this.layout.num.x - bufx, this.y + this.layout.num.y - bufy - 1);
		if (!match) { return ""; }
		this.barid = barnummap[match.index];
		if (!this.barstates[this.barid]) {
			this.barstates[this.barid] = { barid: this.barid, slots: [], visible: false };
			for (var b = 0; b < this.layout.length; b++) {
				this.barstates[this.barid].slots[b] = new AbilityState(this.reader);
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

export class AbilityState<T extends AbilityInfoBare = AbilityInfoBare> {
	static iconwidth = 30 + 1;//the cooldown text overlays the box by one pixel
	static iconheight = 30 + 1;//also need one extra px here to read the hotkey
	static overlayState = false;

	//internal
	nextdetecttry = 0;//timestamp of next ability read attempt

	//stateful
	lastcooldown = -1;//cooldown at last confirmed tick
	lasttickcooldown = -1;//number of ticks cooldown on last comfirmed read
	tickcooldown = 0;//number of ticks left on cooldown
	cdchange = 0;//cd change since last tick
	gcd = true;//current cooldown is coused by global cooldown and is 1.8sec
	donetime = 0;//timestamp of when cd will be done
	hadcd = false;//has been on cooldown in the last minute

	//only function of pixel
	cooldown = 0;//current visible cooldown (whole sec)
	available = false;//false if the ability can't be used even when off cd (wrong weapon)
	cdfraction = -1;//fraction of cooldown completed as read by darker pixel clock
	ability: T | null = null;//the detected ability 
	hotkey = "";//hotkey text of ability


	reader: AbilityReader<T> | null = null;

	constructor(reader: AbilityReader<T>) {
		this.reader = reader;
	}

	readAbility(data: ImageData, x: number, y: number) {
		var res = OCR.readLine(data, cdfont, [206, 213, 135], x + 31, y + 8, false, true);
		var t = 0;
		if (res.text == "") {
			//don't trust a failed read as "0", only read it as 0 if we have a pixel match on the icon in the cd area
			var allow = this.cooldown <= 1 || this.ability && this.confirmCdArea(data, x, y);
			t = (allow ? 0 : Math.ceil((this.lasttickcooldown - 1) * 0.6));
		}
		else if (res.text.endsWith("m")) { t = 60 * +res.text.slice(0, -1); }
		else { t = +res.text; }
		var now = Date.now();
		this.cdchange = (this.lastcooldown != -1 ? t - this.lastcooldown : 0);
		this.cooldown = t;
		if (this.cdchange >= 1) { this.gcd = this.cooldown <= 2; }

		if (this.cooldown != Math.ceil((this.lasttickcooldown - 1) * 0.6)) {
			var tickcd = Math.floor(this.cooldown / 0.6);
			//detect 2nd tick in same second
			if (this.cooldown != 0 && this.cdchange == 0 && Math.ceil(tickcd * 0.6) == Math.ceil((tickcd - 1) * 0.6)) { tickcd--; }
			this.tickcooldown = tickcd;
		} else {
			this.tickcooldown--;
		}
		if (this.cooldown != 0) { this.donetime = now + this.cooldown * 1000; }
		this.hadcd = this.donetime - now > -60 * 1000;

		this.cdfraction = -1;
		this.debug = null;

		if (!this.ability && this.nextdetecttry < now) {
			this.ability = this.getAbility(data, x, y);
			this.nextdetecttry = now + 1000 * 20 * (1 + Math.random());//5-10 sec delay to spread load
		}
		if (this.ability) {
			this.readClock(data, x, y);
			if (!this.hotkey && this.available) {
				this.readhotkey(data, x, y);
			}
		}
		//if (this.ability && this.ability.id == "immortality") { console.log(this.tickcooldown, this.cooldown, this.cdchange); }
	}
	confirmCdArea(buffer: ImageData, x: number, y: number) {
		var icon = this.ability!.icon;
		for (var dy = 1; dy < 10; dy++) {
			for (var dx = 24; dx < 30; dx++) {
				var i1 = (x + dx) * 4 + (y + dy) * 4 * buffer.width;
				var i2 = dx * 4 + dy * 4 * icon.width;
				//calculate portion of icon color vs pure white per channel
				var gradr = (255 - buffer.data[i1]) / (255 - icon.data[i2]);
				var gradg = (255 - buffer.data[i1 + 1]) / (255 - icon.data[i2 + 1]);
				var gradb = (255 - buffer.data[i1 + 2]) / (255 - icon.data[i2 + 2]);
				//if it's a pure mix of white and the icon, all channels will have the same portion of white
				var d = Math.max(gradr, gradg, gradb) - Math.min(gradr, gradg, gradb);
				if (d > 0.25) { return false; }
			}
		}
		return true;
	}

	debug: ImageData | null = null;
	readClock(buf: ImageData, abilx: number, abily: number) {
		var alpha = 0.20;
		var size = 30;
		var template = this.ability!.icon;
		var dirs = [
			{ n: size / 2, ox: size / 2, oy: 0, sx: 1, sy: 0 },
			{ n: size, ox: size - 1, oy: 1, sx: 0, sy: 1 },
			{ n: size, ox: size - 1, oy: size - 1, sx: -1, sy: 0 },
			{ n: size, ox: 0, oy: size - 1, sx: 0, sy: -1 },
			{ n: size / 2, ox: 0, oy: 0, sx: 1, sy: 0 }
		];
		var pixels = 0;
		var nbright = 0;
		var nmatch = 0;
		var lastbright = 0;
		var streak = 10;
		var lumpixels = 0;
		var lummatch = 0;
		var nwhite = 0;
		if (AbilityState.overlayState) { this.debug = new ImageData(30, 30); }
		for (var dir of dirs) {
			for (var a = 0; a < dir.n; a++) {
				var x = dir.ox + a * dir.sx;
				var y = dir.oy + a * dir.sy;
				var i1 = (abilx + x) * 4 + (abily + y) * buf.width * 4;
				var i2 = x * 4 + y * template.width * 4;

				var lum = template.data[i2] + template.data[i2 + 1] + template.data[i2 + 2];
				var imglum = buf.data[i1] + buf.data[i1 + 1] + buf.data[i1 + 2];
				var d1 = Math.abs(buf.data[i1] - template.data[i2]) + Math.abs(buf.data[i1 + 1] - template.data[i2 + 1]) + Math.abs(buf.data[i1 + 2] - template.data[i2 + 2]);
				var d2 = Math.abs(buf.data[i1] - template.data[i2] * alpha) + Math.abs(buf.data[i1 + 1] - template.data[i2 + 1] * alpha) + Math.abs(buf.data[i1 + 2] - template.data[i2 + 2] * alpha);
				var match = d1 < 5 || d2 < 5;
				if (match) {
					if (d1 < d2) {
						if (d2 >= 5) {
							streak++;
							nbright++;
						}
						if (streak > 5) { lastbright = pixels; }
					}
					else { streak = 0; }
					nmatch++;
				}
				if (lum > 30) {
					if (match) { lummatch++; }
					lumpixels++;
				}
				if (imglum > 70 * 3) {
					nwhite++;
				}
				//this.debug.setPixel(x, y, [d1, d2, 0, 255]);
				if (AbilityState.overlayState) { this.debug!.setPixel(x, y, (d1 < 5 || d2 < 5 ? (d1 < d2 ? [255, 255, 255, 255] : [128, 128, 128, 255]) : [255, 0, 0, 255])); }
				pixels++;
			}
		}

		lastbright = Math.max(lastbright, nbright);

		this.cdfraction = -1;
		outer: for (var dir of dirs) {
			if (lastbright > dir.n) { lastbright -= dir.n; }
			else {
				var x = dir.ox + dir.sx * lastbright - size / 2;
				var y = dir.oy + dir.sy * lastbright - size / 2;
				if (AbilityState.overlayState) { this.debug!.setPixel(x + size / 2, y + size / 2, [0, 255, 255, 255]); }
				var angle = Math.atan2(y, x);
				this.cdfraction = (1.25 + angle / Math.PI / 2) % 1;
				break outer;
			}
		}

		var avail = false;
		if (lummatch / lumpixels > 0.5) {
			if (this.cooldown == 2 && this.cdchange != 0) { avail = true; }
			else if (this.cdfraction > 0.2) { avail = true; }
			else if (this.gcd && this.cooldown > 2) { avail = true; }
			else if (!this.gcd && this.cooldown > this.ability!.cooldown * 0.6) { avail = true; }
		}
		if (avail) { this.available = true; }
		else if (nwhite / pixels < 0.7) { this.available = false; }//keep old value if the icon is flashed white
	}

	readhotkey(buf: ImageData, abilx: number, abily: number) {
		var col: OCR.ColortTriplet = [255, 255, 255];
		var line1 = OCR.readLine(buf, hotkeyfont, col, abilx + 2, abily + 26, true, false);
		if (line1.text) {
			var line2 = OCR.readLine(buf, hotkeyfont, col, abilx + 2, abily + 15, true, false);
			if (line2.text) { this.hotkey = line2.text + " " + line1.text; }
			else { this.hotkey = line1.text; }
		}
	}

	overlayState(x: number, y: number) {
		if (this.available) {
			var angle = (0.75 + this.cdfraction) * Math.PI * 2;
			alt1.overLayLine(a1lib.mixColor(255, 0, 0), 1, x + 15, y + 15, x + 15 + Math.round(Math.cos(angle) * 15), y + 15 + Math.round(Math.sin(angle) * 15), 600);
		}
		if (!this.available) { alt1.overLayRect((this.ability ? a1lib.mixColor(255, 0, 0) : a1lib.mixColor(1, 1, 1)), x - 1, y - 1, 32, 32, 600, 1); }
		alt1.overLayText(this.tickcooldown + "", a1lib.mixColor(255, 255, 0), 7, x, y, 600);
		//alt1.overLayText(this.matchpercent.toFixed(2), a1lib.mixColor(255, 255, 0), 7, x, y, 600);
		//alt1.overLayText(this.cdfraction.toFixed(2), a1lib.mixColor(255, 255, 0), 7, x, y + 15, 600);
		//if (this.cooldown != 0 && this.gcd) { alt1.overLayText("gcd", a1lib.mixColor(255, 255, 0), 8, x, y, 600); }
		//alt1.overLayText(this.hotkey || "?", a1lib.mixColor(255, 255, 255), 11, x + 12, y + 12, 600);
		//if (this.debug) { alt1.overLayImage(x, y, a1lib.encodeImageString(this.debug), this.debug.width, 600); }
	}

	getAbility(buf: ImageData, abilx: number, abily: number) {
		var a = 0.20;
		var best: T | null = null;
		var bestscore = 30 * 30 * 10;

		for (var abil of this.reader!.abilityimgs!) {
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
}















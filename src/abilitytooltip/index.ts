
import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";

var font = require("./imgs/pixel_8px_mono.fontmeta.json");

var imgs = a1lib.webpackImages({
	timerimg: require("./imgs/timerimg.data.png"),
	borderBL: require("./imgs/borderBL.data.png"),
	att: require("./imgs/att.data.png"),
	str: require("./imgs/str.data.png"),
	ranged: require("./imgs/ranged.data.png"),
	mage: require("./imgs/mage.data.png")
});

type AbilityType = "basic" | "thresh" | "ult" | "auto" | "passive" | "spec";
export interface AbilityReadInfo {
	lines: string[],
	icon: ImageData,
	name: string,
	cooldown: number,
	abiltype: AbilityType,
	weapon: WeaponReq[]
};

export type WeaponReq = "mage" | "melee" | "ranged" | "twohand" | "dual" | "shield";
export type WeaponState = { [key in WeaponReq]: boolean };

export default class AbilityTooltipReader {
	read(img?: a1lib.ImgRef, rect?: a1lib.Rect): AbilityReadInfo|null {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!rect) { rect = a1lib.Rect.fromArgs(img); }

		var pos = img.findSubimage(imgs.timerimg, rect.x - img.x, rect.y - img.y, rect.width, rect.height);
		if (pos.length == 0) { return null; }
		var area = new a1lib.Rect(pos[0].x - 227, pos[0].y - 4, 242, -1);
		var bot = img.findSubimage(imgs.borderBL, area.x - 4, area.y, 4, img.height - area.y);
		if (bot.length == 0) { return null; }
		area.height = bot[0].y - area.y;

		alt1.overLaySetGroup("");
		alt1.overLayRect(a1lib.mixColor(255, 255, 255), area.x, area.y, area.width, area.height, 2000, 2);

		var buf = img.read(area.x, area.y, area.width, area.height + 10);//2 extra pixels for ocr on bottom line

		var icon = buf.clone(new a1lib.Rect(1, 1, 30, 30));

		var name = OCR.readLine(buf, font, [179, 122, 47], 35, 12, true, false);
		var cooldown = OCR.findReadLine(buf, font, [[255, 255, 255]], buf.width - 20, 32);
		var abiltype = OCR.readLine(buf, font, [179, 122, 47], 35, 26, true, false);

		var reqs: WeaponReq[] = [];
		for (var sub = 0; sub < 5; sub++) {
			var txt = OCR.findReadLine(buf, font, [[0, 255, 0]], 24 + 48 * sub, buf.height - 6 - 10);
			if (!txt.text) { txt = OCR.findReadLine(buf, font, [[255, 0, 0]], 24 + 48 * sub, buf.height - 6 - 10); }
			var str = txt.text;
			if (str) {
				if (str.match(/^\d+$/)) {
					if (buf.pixelCompare(imgs.att, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) { reqs.push("melee"); }
					if (buf.pixelCompare(imgs.str, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) { reqs.push("melee"); }
					if (buf.pixelCompare(imgs.mage, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) { reqs.push("mage"); }
					if (buf.pixelCompare(imgs.ranged, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) { reqs.push("ranged"); }
				}
				if (str == "2h") { reqs.push("twohand"); }
				if (str == "2x") { reqs.push("dual"); }
				if (str == "Shield") { reqs.push("shield"); }
			}
			else { break; }
		}

		var lines: string[] = [];
		var y = 49;
		for (var y = 49; y < buf.height - 10; y += 14) {
			var line = OCR.readLine(buf, font, [[179, 122, 47], [255, 255, 255]], 0, y, true, false);//TODO color detection for white higlight
			if (!line.text) { break; }
			lines.push(line.text);
		}

		if (!cooldown || !cooldown.text || !name || !abiltype) {
			return null;
		}

		var cdsec = parseInt(cooldown.text);
		if (isNaN(cdsec)) { return null; }

		var type: AbilityType;
		switch (abiltype.text) {
			case "Threshold Ability":
				type = "basic";
				break;
			case "Basic Ability":
				type = "thresh";
				break;
			case "Ultimate Ability":
				type = "thresh";
				break;
			default:
				throw "ability type didnt match";
		}

		return { lines, icon, name: name.text, cooldown: cdsec, abiltype: type, weapon: reqs };
	}

}
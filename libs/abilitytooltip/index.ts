
import * as a1lib from "../alt1lib";
import * as OCR from "../ocr";

var font = require("../ocr/fonts/pixel_8px_mono.fontmeta.json");

var imgs = a1lib.ImageDetect.webpackImages({
	timerimg: require("./imgs/timerimg.data.png"),
	borderBL: require("./imgs/borderBL.data.png")
});

export type AbilityReadInfo = {
	lines: string[],
	icon: ImageData,
	name: string,
	cooldown: string,
	abiltype: string,
};

export default class AbilityTooltipReader {
	read(img?: a1lib.ImgRef, rect?: a1lib.Rect): AbilityReadInfo {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!rect) { rect = a1lib.Rect.fromArgs(img); }

		var pos = img.findSubimage(imgs.timerimg, rect.x - img.x, rect.y - img.y, rect.width, rect.height);
		if (pos.length == 0) { return null; }
		var area = new a1lib.Rect(pos[0].x - 227, pos[0].y - 4, 242, -1);
		var bot = img.findSubimage(imgs.borderBL, area.x - 4, area.y, 4, img.height - area.y);
		if (bot.length == 0) { return null; }
		area.height = bot[0].y - area.y;

		var buf = img.read(area.x, area.y, area.width, area.height);

		var icon = buf.clone(new a1lib.Rect(1, 1, 30, 30));

		var name = OCR.readLine(buf, font, [179, 122, 47], 35, 12, true, false);
		var cooldown = OCR.findReadLine(buf, font, [[255, 255, 255]], buf.width - 20, 32);
		var abiltype = OCR.readLine(buf, font, [179, 122, 47], 35, 26, true, false);

		var lines: string[] = [];
		var y = 49;
		for (var y = 49; y < buf.height; y += 14) {
			var line = OCR.readLine(buf, font, [[179, 122, 47], [255, 255, 255]], 0, y, true, false);//TODO color detection for white higlight
			if (!line.text) { break; }
			lines.push(line.text);
		}

		if (!cooldown || !name || !abiltype) {
			return null;
		}

		return { lines, icon, name: name.text, cooldown: cooldown.text, abiltype: abiltype.text };
	}

}
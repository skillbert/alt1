import InterfaceReader from "../interfacereader";
import { RectLike, ImgRef } from "../alt1lib";

export default abstract class InterfaceReaderBasic<S> extends InterfaceReader<S, RectLike>{

	abstract matchImg: Promise<ImageData>;
	abstract matchOffset: { x: number, y: number };
	abstract size: { width: number, height: number };

	async findImpl(img: ImgRef) {
		var match = await this.matchImg;
		var pos = img.findSubimage(match);
		if (pos.length == 0) { return null; }
		if (pos.length > 1) { console.warn("Multiple interface matches found"); }
		return { x: pos[0].x - this.matchOffset.x, y: pos[0].y - this.matchOffset.y, width: this.size.width, height: this.size.height };
	}
}
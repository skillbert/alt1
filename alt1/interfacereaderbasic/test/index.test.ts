import InterfaceReaderBasic from "..";
import { ImgRef, ImgRefCtx } from "@alt1/base";


//TODO get some libraries involved to actually run any of this
//TODO actually create the example images

class TestInterfaceReader extends InterfaceReaderBasic<{ r: number, g: number, b: number }> {
	matchImg = require("./matchimg.data.png");
	matchOffset = { x: -10, y: -10 };
	size = { width: 50, height: 50 };
	readImpl(img: ImgRef) {
		var buf = img.toData(this.pos.x + 48, this.pos.y + 6, 1, 1);
		return { r: buf.data[0], g: buf.data[1], b: buf.data[2] };
	}
}

async function test() {
	var reader = new TestInterfaceReader();
	var imgdata = await require("./testimg.data.png") as ImageData;
	var imgref = new ImgRefCtx(imgdata.toImage());
	var state = await reader.findRead(imgref);
	return state.r == 128 && state.g == 128 && state.b == 128;
}
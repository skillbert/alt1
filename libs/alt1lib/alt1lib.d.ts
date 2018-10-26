import * as a1lib from "./index";

declare global {
	//function require(file: string): any;

	export interface StringMap<T> { [key: string]: T; };
	export interface NumberMap<T> { [key: number]: T; };

	function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
	function clearTimeout(timeoutId: number): void;
	function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
	function clearInterval(intervalId: number): void;

	interface HTMLImageElement {
		toBuffer(x?: number, y?: number, w?: number, h?: number): ImageData;
		toCanvas(x?: number, y?: number, w?: number, h?: number): HTMLCanvasElement;
	}

	interface ImageData {


		putImageData(buf: ImageData, cx: number, cy: number): void;
		pixelOffset(x: number, y: number): number;
		getPixelHash(rect: a1lib.RectLike): number;

		clone(rect: a1lib.RectLike): ImageData;

		show(x?: number, y?: number, zoom?: number): HTMLCanvasElement;

		toImage(rect?: a1lib.RectLike): HTMLCanvasElement;

		getPixel(x: number, y: number): [number, number, number, number];

		getPixelInt(x: number, y: number): number;


		setPixel(x: number, y: number, color: [number, number, number, number]): void;
		setPixel(x: number, y: number, r: number, g: number, b: number, a: number): void;

		setPixelInt(x: number, y: number, color: number): void;

		toJSON(rect?: a1lib.RectLike): string;

		pixelCompare(buf: ImageData, x?: number, y?: number, max?: number): number;

		copyTo(target: ImageData, sourcex: number, sourcey: number, width: number, height: number, targetx: number, targety: number): void;
	}


	interface HTMLCanvasElement {
		captureStream(framerate?: number): MediaStream;
	}

	//for some reason this got removed from ts standard declaretion files
	interface Storage {
		[key: string]: string
	}
}

export { };
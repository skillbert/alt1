import * as a1lib from "./index";

declare global {
	//function require(file: string): any;

	export interface StringMap<T> { [key: string]: T; }
	export interface NumberMap<T> { [key: number]: T; }

	function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
	function clearTimeout(timeoutId: number): void;
	function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
	function clearInterval(intervalId: number): void;




	interface HTMLCanvasElement {
		captureStream(framerate?: number): MediaStream;
	}

	//for some reason this got removed from ts standard declaretion files
	interface Storage {
		[key: string]: string
	}
}

export { };

declare interface StringMap<T> { [key: string]: T; }
declare interface NumberMap<T> { [key: number]: T; }

//not yet in default declaration
declare interface HTMLCanvasElement {
	captureStream(framerate?: number): MediaStream;
}

//for some reason this got removed from ts standard declaretion files
//interface Storage { [key: string]: string }
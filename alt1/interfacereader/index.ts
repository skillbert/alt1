import { ImgRef, RectLike, Rect, captureHold, captureHoldFullRs } from "@alt1/base";


export default abstract class InterfaceReader<S, P extends RectLike=RectLike> {
	//An object describing the position of the interface in-game
	pos: P;
	//An object describing the state of the interface. This state can be used for future incremental reads or completely ignored on future reads
	state: S;
	//wether read functions are async or not
	isAsync = false;

	//Only allow one active find action at a time, subsequent attempts are given the same result
	private findPromise: Promise<P> = null;
	//Only allow one active find action at a time, subsequent attempts are given the same result
	private readPromise: Promise<S> = null;

	/**
	 * Finds the interface's location on screen.
	 * This method wraps the findImpl method and ensures it has the correct image to work with and saves the result.
	 * @param img Optional. Use this image for the find action so the image can be reused for read oparations on the same interface. If not provided this method will capture a new image
	 */
	async find(img?: ImgRef) {
		if (!this.findPromise) {
			this.findPromise = (async () => {
				if (!img) { img = captureHoldFullRs(); }
				var posprom = this.findImpl(img);
				this.pos = (this.isAsync ? await posprom : posprom) as P;
				this.findPromise = null;
				return this.pos;
			})();
		}
		return this.findPromise;
	}
	/**
	 * Reads the interface state
	 * This method wraps the readImpl method and ensures it has the correct image to work with and saves the result.
	 * @param img Optional. Can be used to reuse the same image for multiple operation. If not provided this method will capture a new image
	 */
	async read(img: ImgRef) {
		if (!this.readPromise) {
			this.readPromise = (async () => {
				if (!this.pos) { throw "Can't read interface whose position has not been found yet."; }
				var sureimg = this.ensureImage(img);
				var stateprom = this.readImpl(sureimg);
				var state = (this.isAsync ? await stateprom : stateprom) as S;
				if (!state) { return null; }
				this.state = state;
				return state;
			})();
		}
		return this.readPromise;
	}

	/**
	 * Override this with an implementation. This method returns a location object  object or null if the interface is not found.
	 * @param img
	 */
	abstract findImpl(img: ImgRef): Promise<P> | P;
	/**
	 * 
	 * @param img
	 */
	abstract readImpl(img: ImgRef): Promise<S> | S;

	/**
	 * Determines wether the current image is sufficient to use for reading and if not captures a new image.
	 * @param img
	 */
	ensureImage(img?: ImgRef): ImgRef {
		if (!this.pos) {
			throw "Position not known yet.";
		}
		var pos = this.pos as any;
		if (typeof pos.x != "number" || typeof pos.y != "number" || typeof pos.width != "number" || typeof pos.height != "number") {
			throw "Position object is not rectlike. Override the ensureImage method if you're not using a position state that extends rectlike.";
		}
		if (img && Rect.fromArgs(img).contains(this.pos)) {
			return img;
		}
		return captureHold(pos.x, pos.y, pos.width, pos.height);
	}

	/**
	 * Tries to read the interface state from the screen. If the interface is not found it will also try to find it. 
	 * @param img Optional. Uses this image for the reading
	 */
	async findRead(img?:ImgRef) {
		var img: ImgRef = null;
		if (!this.pos) {
			if (!img) { img = captureHoldFullRs(); }
			await this.find(img);
		}
		if (!this.pos) { return null; }
		return await this.read(img);
	}
}
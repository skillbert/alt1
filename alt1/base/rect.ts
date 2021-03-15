//util class for rectangle maths
//TODO shit this sucks can we remove it again?
//more of a shorthand to get {x,y,width,height} than a class
//kinda starting to like it again
//TODO remove rant

export interface PointLike {
	x: number,
	y: number
};

export interface RectLike {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Simple rectangle class with some util functions
 */
export default class Rect implements RectLike {
	x: number;
	y: number;
	width: number;
	height: number;
	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	static fromArgs(...args: [RectLike] | [x: number, y: number, w: number, h: number]): Rect {
		if (typeof args[0] == "object") {
			return new Rect(args[0].x, args[0].y, args[0].width, args[0].height);
		} else if (typeof args[0] == "number" && args.length >= 4) {
			return new Rect(args[0], args[1]!, args[2]!, args[3]!);
		} else {
			throw new Error("invalid rect args");
		}
	}

	/**
	 * Resizes this Rect to include the full size of a given second rectangle
	 */
	union(r2: RectLike) {
		var x = Math.min(this.x, r2.x);
		var y = Math.min(this.y, r2.y);
		this.width = Math.max(this.x + this.width, r2.x + r2.width) - x;
		this.height = Math.max(this.y + this.height, r2.y + r2.height) - y;
		this.x = x;
		this.y = y;
		return this;
	}
	/**
	 * Resizes this Rect to include a given point
	 */
	includePoint(x: number, y: number) {
		this.union(new Rect(x, y, 0, 0));
	}
	/**
	 * Grows the rectangle with the given dimensions
	 */
	inflate(w: number, h: number) {
		this.x -= w;
		this.y -= h;
		this.width += 2 * w;
		this.height += 2 * h;
	}
	/**
	 * Resizes this Rect to the area that overlaps a given Rect
	 * width and height will be set to 0 if the intersection does not exist
	 */
	intersect(r2: RectLike) {
		if (this.x < r2.x) { this.width -= r2.x - this.x; this.x = r2.x; }
		if (this.y < r2.y) { this.height -= r2.y - this.y; this.y = r2.y; }
		this.width = Math.min(this.x + this.width, r2.x + r2.width) - this.x;
		this.height = Math.min(this.y + this.height, r2.y + r2.height) - this.y;
		if (this.width <= 0 || this.height <= 0) {
			this.width = 0;
			this.height = 0;
		}
	}
	/**
	 * Returns wether this Rect has at least one pixel overlap with a given Rect
	 */
	overlaps(r2: RectLike) {
		return this.x < r2.x + r2.width && this.x + this.width > r2.x && this.y < r2.y + r2.height && this.y + this.height > r2.y;
	}
	/**
	 * Returns wether a given Rect fits completely inside this Rect
	 * @param r2
	 */
	contains(r2: RectLike) {
		return this.x <= r2.x && this.x + this.width >= r2.x + r2.width && this.y <= r2.y && this.y + this.height >= r2.y + r2.height;
	}
	/**
	 * Returns wether a given point lies inside this Rect
	 */
	containsPoint(x: number, y: number) {
		return this.x <= x && this.x + this.width > x && this.y <= y && this.y + this.height > y;
	}
}
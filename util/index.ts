export function copyToClipboard(str: string) {
	var el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}



export type DragHandlerState = { x: number, y: number, dx: number, dy: number, sx: number, sy: number, end: boolean };
export function newDragHandler(mousedownevent: MouseEvent|React.MouseEvent, movefunc: (state: DragHandlerState, end: boolean) => any, endfunc: (state: DragHandlerState, end: boolean) => any, mindist: number) {
	var locked = mindist != undefined;
	var mouseloc: DragHandlerState;


	var clientdx = mousedownevent.clientX - mousedownevent.screenX;
	var clientdy = mousedownevent.clientY - mousedownevent.screenY;

	//TODO screenX approach breaks when zoomed or clientx is required
	var x = mousedownevent.screenX + clientdx;
	var y = mousedownevent.screenY + clientdy;
	var init = function () { mouseloc = { x: x, y: y, dx: 0, dy: 0, sx: x, sy: y, end: false }; }
	init();

	var moved = function (e, end) {
		var x = e.screenX + clientdx;
		var y = e.screenY + clientdy;
		var dx = x - mouseloc.x;
		var dy = y - mouseloc.y;
		if (locked && Math.abs(dx) + Math.abs(dy) >= mindist) {
			locked = false;
		}
		if (!locked) {
			mouseloc.end = end;
			mouseloc.dx = dx;
			mouseloc.dy = dy;
			mouseloc.x = x;
			mouseloc.y = y;
			movefunc && movefunc(mouseloc, false);
			end && endfunc && endfunc(mouseloc, true);
		}
	}


	var mousemove = function (e) {
		if (e.touches) {
			e = e.touches[0];
		}
		moved(e, false);
	};
	var mouseup = function (e) {
		if (e.touches) {
			e = e.touches[0];
		}
		if (e) { moved(e, true); }
		for (var a in allframes) {
			var frame = allframes[a];
			frame.removeEventListener("mousemove", mousemove);
			frame.removeEventListener("mouseup", mouseup);
			frame.removeEventListener("touchmove", mousemove);
			frame.removeEventListener("touchend", mouseup);
		}
	}

	//damn this is a mess, other frames consume the event so add handlers to every frame
	//currently still break when hovering over frame which arent parents of the current one
	//EDIT: THIS IS MADNESS
	var allframes = [];
	var recurframe = function (frame) {
		if (allframes.indexOf(frame) != -1) {
			return;
		}
		try {
			var qq = frame.document;
		} catch (e) {
			return;
		}
		allframes.push(frame);
		for (var a = 0; a < frame.frames.length; a++) {
			recurframe(frame.frames[a]);
		}
	}
	recurframe(top);
	recurframe(window);
	for (var a in allframes) {
		var frame = allframes[a];
		frame.addEventListener("mousemove", mousemove);
		frame.addEventListener("mouseup", mouseup);
		frame.addEventListener("touchmove", mousemove);
		frame.addEventListener("touchend", mouseup);
	}
}

export function startCaps(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function delay(t: number, ...args) {
	return new Promise(done => setTimeout(done, t, ...args));
}

export function uuid() {
	//https://gist.github.com/jcxplorer/823878
	var uuid = "", i, random;
	for (i = 0; i < 32; i++) {
		random = Math.random() * 16 | 0;

		if (i == 8 || i == 12 || i == 16 || i == 20) {
			uuid += "-"
		}
		uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
	}
	return uuid;
}

export type ObjMap<T> = { [id: string]: T };

//because js still has no proper way for this (ie11)
export function initArray<T>(l: number, val: T): T[] {
	var r = [];
	r.length = l;
	for (var a = 0; a < l; a += 1) { r[a] = val; }
	return r;
}
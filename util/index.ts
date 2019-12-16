//TODO ideally this should be moved somewhere else
import * as React from "react";

export function copyToClipboard(str: string) {
	var el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}



export type DragHandlerState = { x: number, y: number, dx: number, dy: number, sx: number, sy: number, end: boolean, start: boolean };
export function newDragHandler(mousedownevent: MouseEvent | React.MouseEvent, movefunc: (state: DragHandlerState, end: boolean) => any, endfunc?: (state: DragHandlerState, end: boolean) => any, mindist?: number) {
	var locked = mindist != undefined;
	var mouseloc: DragHandlerState;


	var clientdx = mousedownevent.clientX - mousedownevent.screenX;
	var clientdy = mousedownevent.clientY - mousedownevent.screenY;

	//TODO screenX approach breaks when zoomed or clientx is required
	var x = mousedownevent.screenX + clientdx;
	var y = mousedownevent.screenY + clientdy;
	var init = function () { mouseloc = { x: x, y: y, dx: 0, dy: 0, sx: x, sy: y, end: false, start: true }; }
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
			mouseloc.start = false;
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

//because js still has no proper way for this (ie11)
export function initArray<T>(l: number, val: T): T[] {
	var r = [];
	r.length = l;
	for (var a = 0; a < l; a += 1) { r[a] = val; }
	return r;
}


export function stringdownload(filename: string, text: string) {
	filedownload(filename, 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
}

export function filedownload(filename: string, url: string) {
	var element = document.createElement('a');
	element.setAttribute('href', url);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

export function listdate(time: number) {
	var fullmonthnames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var d = new Date(time);
	return d.getDate() + " " + fullmonthnames[d.getMonth()] + " " + d.getFullYear();
}

export function dlpagejson<D = any>(url: string, obj: any, func: (data: D) => any, errorfunc: () => any) {
	var req = new XMLHttpRequest();
	req.onload = function () {
		var obj = null;
		try { obj = JSON.parse(req.responseText); }
		catch (e) { }
		if (obj == null) {
			if (errorfunc) { errorfunc(); }
			return;
		}
		if (func) { func(obj); }
	}
	req.onerror = errorfunc;
	if (obj) {
		req.open("POST", url, true);
		req.setRequestHeader("Content-type", "application/json");
		req.send(JSON.stringify(obj));
	} else {
		req.open("GET", url, true);
		req.send();
	}
}

export namespace OldDom {
	export function id(id: string) {
		return document.getElementById(id);
	}

	export function clear(el: HTMLElement) {
		while (el.firstChild) { el.removeChild(el.firstChild); }
	}

	type ObjAttr = { [prop: string]: any };
	type ArrCh = (HTMLElement | string)[];
	export function div(strClass?: string, objAttr?: ObjAttr, arrayChildren?: ArrCh): HTMLElement;
	export function div(objAttr: ObjAttr, arrayChildren?: ArrCh): HTMLElement;
	export function div(strClass: string, arrayChildren?: ArrCh): HTMLElement;
	export function div(arrayChildren: ArrCh): HTMLElement;
	export function div(strClass?, objAttr?, arrayChildren?): HTMLElement {
		var classname, attr, children, tag, tagarg, el, childfrag;
		//reorder arguments
		var argi = 0;
		if (typeof arguments[argi] == "string") {
			var typedata = arguments[argi++].split(":");
			classname = typedata[0];
			var tagdata = typedata[1] ? typedata[1].split("/") : [];
			tag = tagdata[0];
			tagarg = tagdata[1];
		}
		if (typeof arguments[argi] == "object" && !Array.isArray(arguments[argi]) && !(arguments[argi] instanceof DocumentFragment)) { attr = arguments[argi++]; }
		if (typeof arguments[argi] == "object" && Array.isArray(arguments[argi])) { children = arguments[argi++]; }
		else if (typeof arguments[argi] == "object" && arguments[argi] instanceof DocumentFragment) { childfrag = arguments[argi++]; }
		attr = attr || {};
		if (classname) { attr["class"] = classname; }

		//start actual work
		tag = attr && attr.tag || tag || "div";
		if (tag == "input" && tagarg) { attr.type = tagarg; }
		if (tag == "frag") { el = document.createDocumentFragment(); }
		else {
			var el = (attr && attr.namespace ? document.createElementNS(attr.namespace, tag) : document.createElement(tag));
		}
		if (attr) {
			for (var a in attr) {
				if (attr[a] === false || attr[a] == null || a == "tag" || a == "namespace") { continue; }
				if (a.substr(0, 2) == "on") { el[a] = attr[a]; }
				else { el.setAttribute(a, attr[a]); }
			}
		}
		if (children != null && children != undefined) {
			if (!Array.isArray(children)) { children = [children]; }
			for (var a in children) {
				if (children[a] == null) { continue; }
				if (typeof children[a] != "object") { el.appendChild(document.createTextNode(children[a].toString())); }
				else { el.appendChild(children[a]); }
			}
		}
		else if (childfrag != null) {
			el.appendChild(childfrag);
		}
		return el;
	}

	export function frag(...args: (HTMLElement | string | number | null)[]) {
		var el = document.createDocumentFragment();
		for (var a = 0; a < arguments.length; a++) {
			if (arguments[a] == null) { continue; }
			if (typeof arguments[a] != "object") { el.appendChild(document.createTextNode(arguments[a].toString())); }
			else { el.appendChild(arguments[a]); }
		}
		return el;
	}

	export function put(el: HTMLElement | string, content: Node) {
		if (typeof el == "string") { el = id(el); }
		clear(el);
		el.appendChild(content);
	}
}

export function smallu(nr: number, gp?: boolean) {
	if (isNaN(nr)) { return "-"; }
	nr = Math.round(nr);
	var sign = (nr < 0 ? "-" : "");
	nr = Math.abs(nr);
	if (nr >= 1000000000000000) { return sign + "quite a bit" }
	if (nr % 1) {
		if (nr < 100) { return sign + (nr + "00").slice(0, 4); }
		nr = Math.floor(nr);
	}
	var nrstr = nr + "";
	var original = nrstr;
	if (nrstr.length <= 3) { return sign + nrstr + (gp ? "gp" : ""); }
	if (nrstr.length == 4) { return sign + nrstr.slice(0, 1) + "," + nrstr.slice(1, 4) + (gp ? "gp" : ""); }
	if (nrstr.length % 3 != 0) { nrstr = nrstr.slice(0, nrstr.length % 3) + "." + nrstr.slice(nrstr.length % 3, 3); }
	else { nrstr = nrstr.slice(0, 3); }
	if (original.length <= 6) { return sign + nrstr + "k" }
	if (original.length <= 9) { return sign + nrstr + "m" }
	if (original.length <= 12) { return sign + nrstr + "b" }
	if (original.length <= 15) { return sign + nrstr + "t" }
	return "error";
}

export function jsonTryDecode(str: string) {
	try { return JSON.parse(str); }
	catch (e) { return null; }
}

export function urlArgs(url?: string): StringMap<string> {
	if (!url) { url = document.location.search; }
	var reg = /(\?|&)(.*?)(=(.*?))?(?=$|&)/g;
	var r = {};
	for (var m; m = reg.exec(url);) {
		r[m[2]] = m[4];
	}
	return r;
}

export function padLeft(str: string | number, n: number, char = "0") {
	str = str + "";
	while (str.length < n) { str = char + str; }
	return str;
}
import { ImgRefCtx } from "./index";
import * as ImageDetect from "./imagedetect";


var listeners = [];
var started = false;
var dndStarted = false;
var pasting = false;
export var lastref: ImgRefCtx = null;
export var lastimg: HTMLCanvasElement = null;

export function listen(func, errorfunc?, dragndrop?) {
	listeners.push({ cb: func, error: errorfunc });

	if (!started) { start(); }
	if (dragndrop && !dndStarted) { startDragNDrop(); }
}

function pasted(img: HTMLImageElement) {
	var a;
	pasting = false;
	lastimg = img.toCanvas();
	lastref = new ImgRefCtx(lastimg);
	for (a in listeners) { listeners[a].cb(lastimg, lastref); }
}

function error(mes, error) {
	pasting = false;
	for (var a in listeners) {
		if (listeners[a].error) { listeners[a].error(mes, error); }
	}
}

export function startDragNDrop() {
	var getitem = function (items) {
		var foundimage = "";
		for (var a = 0; a < items.length; a++) {
			var item = items[a];
			var m = item.type.match(/^image\/(\w+)$/)
			if (m) {
				if (m[1] == "png") { return item; }
				else { foundimage = m[1]; }
			}
		}
		if (foundimage) {
			error("The image you uploaded is not a .png image. Other image type have compression noise and can't be used for image detection.", "notpng");
		}
		return null;
	}

	window.addEventListener("dragover", function (e) {
		e.preventDefault();
	});
	window.addEventListener("drop", function (e) {
		var item = getitem(e.dataTransfer.items);
		e.preventDefault();
		if (!item) { return; }
		fromFile(item.getAsFile());
	});
}

export function start() {
	if (started) { return; }
	started = true;

	var errorhandler = function (mes, error) {
		var a;
		pasting = false;
		for (a in listeners) {
			if (listeners[a].error) { listeners[a].error(mes, error); }
		}
	}

	//determine if we have a clipboard api
	//try{a=new Event("clipboard"); a="clipboardData" in a;}
	//catch(e){a=false;}
	var ischrome = !!navigator.userAgent.match(/Chrome/) && !navigator.userAgent.match(/Edge/);
	//old method breaks after chrome 41, revert to good old user agent sniffing
	//nvm, internet explorer (edge) decided that it wants to be chrome, however fails at delivering

	//turns out this one is interesting, edge is a hybrid between the paste api's
	var apipasted = function (e) {
		for (var a = 0; a < e.clipboardData.items.length; a++) {//loop all data types
			if (e.clipboardData.items[a].type.indexOf("image") != -1) {
				var file = e.clipboardData.items[a].getAsFile();
				var img = new Image();
				img.src = (window.URL || (window as any).webkitURL).createObjectURL(file);
				if (img.width > 0) { pasted(img); }
				else { img.onload = function () { pasted(img); } }
			}
		}
	};

	if (ischrome) {
		document.addEventListener("paste", apipasted);
	}
	else {
		var catcher = document.createElement("div");
		catcher.setAttribute("contenteditable", "");
		catcher.className = "forcehidden";//retarded ie safety/bug, cant apply styles using js//TODO i don't even know what's going on
		catcher.onpaste = function (e) {
			if (e.clipboardData && e.clipboardData.items) { apipasted(e); return; }
			setTimeout(function () {
				var img, a, b;
				b = catcher.children[0];
				if (!b || b.tagName != "IMG") { return; }
				img = new Image();
				img.src = b.src;
				if (a = img.src.match(/^data:([\w\/]+);/)) { img.type = a[1]; } else { img.type = "image/unknown"; }//unreliable, won't use
				if (img.width > 0) { pasted(img); }
				else { img.onload = function () { pasted(img) }; }
				catcher.innerHTML = "";
			}, 1);
		};
		document.body.appendChild(catcher);
	}

	//detect if ctrl-v is pressed and focus catcher if needed
	document.addEventListener("keydown", function (e) {
		if ((e.target as HTMLElement).tagName == "INPUT") { return; }
		if (e.keyCode != "V".charCodeAt(0) || !e.ctrlKey) { return; }
		pasting = true;
		setTimeout(function () {
			if (pasting) { error("You pressed Ctrl+V, but no image was pasted by your browser, make sure your clipboard contains an image, and not a link to an image.\n This may also happen if your browser is (very) outdated.", "noimg"); }
		}, 1000);
		if (catcher) { catcher.focus(); }
	});
}

export function fileDialog() {
	var fileinput = document.createElement("input");
	fileinput.type = "file";
	fileinput.accept = "image/png";
	fileinput.onchange = function () { if (fileinput.files[0]) { fromFile(fileinput.files[0]); } };
	fileinput.click();
	return fileinput;
}

function fromFile(file) {
	var reader = new FileReader();
	reader.onload = function () {//TODO check if it's actually png
		var bytearray = new Uint8Array(reader.result as ArrayBuffer);
		if (ImageDetect.isPngBuffer(bytearray)) {
			ImageDetect.clearPngColorspace(bytearray);
		}
		var blob = new Blob([bytearray], { type: "image/png" });
		var img = new Image();
		img.onerror = e => error("The file you uploaded could not be opened as an image.", "invalidfile");
		var bloburl = URL.createObjectURL(blob);
		img.src = bloburl;
		if (img.width > 0) { pasted(img); URL.revokeObjectURL(bloburl); }
		else { img.onload = function () { pasted(img); URL.revokeObjectURL(bloburl); }; }
	};

	reader.readAsArrayBuffer(file);
}
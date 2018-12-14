(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@alt1/base"), require("@alt1/ocr"), require("pngjs"));
	else if(typeof define === 'function' && define.amd)
		define(["@alt1/base", "@alt1/ocr", ], factory);
	else if(typeof exports === 'object')
		exports["@alt1/font-loader"] = factory(require("@alt1/base"), require("@alt1/ocr"), require("pngjs"));
	else
		root["Alt1FontLoader"] = factory(root["A1lib"], root["OCR"], root[undefined]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__alt1_base__, __WEBPACK_EXTERNAL_MODULE__alt1_ocr__, __WEBPACK_EXTERNAL_MODULE_pngjs__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./alt1/font-loader/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./alt1/font-loader/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__("fs");
const pngjs_1 = __webpack_require__("pngjs");
const OCR = __webpack_require__("@alt1/ocr");
const a1lib = __webpack_require__("@alt1/base");
function cloneImage(img, x, y, w, h) {
    var clone = new a1lib.ImageData(w, h);
    img.copyTo(clone, x, y, w, h, 0, 0);
    return clone;
}
module.exports = async function (source) {
    var me = this;
    var meta = JSON.parse(source);
    if (!meta.img) {
        meta.img = this.resourcePath.replace(/\.fontmeta\.json$/, ".data.png");
    }
    this.addDependency(meta.img);
    this.async();
    //TODO make sure the image doesn't contain the srgb header
    var bytes = await new Promise((done, err) => {
        fs.readFile(meta.img, (e, buf) => {
            if (e) {
                err(e);
            }
            done(buf);
        });
    });
    var byteview = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    a1lib.ImageDetect.clearPngColorspace(byteview);
    var png = new pngjs_1.PNG();
    await new Promise((done, err) => {
        png.on("parsed", e => done(e));
        png.on("error", e => err(e));
        png.parse(bytes);
    });
    var img = new a1lib.ImageData(new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength), png.width, png.height);
    debugger;
    var bg = null;
    var pxheight = img.height - 1;
    if (meta.unblendmode == "removebg") {
        pxheight /= 2;
        bg = cloneImage(img, 0, pxheight + 1, img.width, pxheight);
    }
    var inimg = cloneImage(img, 0, 0, img.width, pxheight);
    var outimg;
    if (meta.unblendmode == "removebg") {
        outimg = OCR.unblendKnownBg(inimg, bg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
    }
    else if (meta.unblendmode == "raw") {
        outimg = OCR.unblendTrans(inimg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
    }
    else {
        throw "no unblend mode";
    }
    var unblended = new a1lib.ImageData(img.width, pxheight + 1);
    outimg.copyTo(unblended, 0, 0, outimg.width, outimg.height, 0, 0);
    img.copyTo(unblended, 0, pxheight, img.width, 1, 0, pxheight);
    var font = OCR.generatefont(unblended, meta.chars, meta.seconds, meta.bonus, meta.basey, meta.spacewidth, meta.treshold, meta.shadow);
    me.callback(null, JSON.stringify(font));
};
function exportimg(img) {
    return "(function(){var b=new ImageData(" + img.width + "," + img.height + "); b.data.set([" + img.data + "]); b.show(); console.clear(); return b;})()";
}


/***/ }),

/***/ "@alt1/base":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__alt1_base__;

/***/ }),

/***/ "@alt1/ocr":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__alt1_ocr__;

/***/ }),

/***/ "fs":
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "pngjs":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_pngjs__;

/***/ })

/******/ });
});
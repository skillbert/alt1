(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@alt1/base"), require("@alt1/ocr"), require("pngjs"));
	else if(typeof define === 'function' && define.amd)
		define(["@alt1/base", "@alt1/ocr", "pngjs"], factory);
	else if(typeof exports === 'object')
		exports["@alt1/font-loader"] = factory(require("@alt1/base"), require("@alt1/ocr"), require("pngjs"));
	else
		root["Alt1FontLoader"] = factory(root["A1lib"], root["OCR"], root["unkown"]);
})((typeof self!='undefined'?self:this), function(__WEBPACK_EXTERNAL_MODULE__alt1_base__, __WEBPACK_EXTERNAL_MODULE__alt1_ocr__, __WEBPACK_EXTERNAL_MODULE_pngjs__) {
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pngjs_1 = __webpack_require__("pngjs");
var OCR = __webpack_require__("@alt1/ocr");
var a1lib = __webpack_require__("@alt1/base");
function cloneImage(img, x, y, w, h) {
    var clone = new a1lib.ImageData(w, h);
    img.copyTo(clone, x, y, w, h, 0, 0);
    return clone;
}
module.exports = function (source) {
    return __awaiter(this, void 0, void 0, function () {
        var me, meta, bytes, byteview, png, img, bg, pxheight, inimg, outimg, unblended, font;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    me = this;
                    meta = JSON.parse(source);
                    if (!meta.img) {
                        meta.img = this.resourcePath.replace(/\.fontmeta\.json$/, ".data.png");
                    }
                    this.addDependency(meta.img);
                    this.async();
                    return [4 /*yield*/, new Promise(function (done, err) {
                            _this.fs.readFile(meta.img, function (e, buf) {
                                if (e) {
                                    err(e);
                                }
                                done(buf);
                            });
                        })];
                case 1:
                    bytes = _a.sent();
                    byteview = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
                    a1lib.ImageDetect.clearPngColorspace(byteview);
                    png = new pngjs_1.PNG();
                    return [4 /*yield*/, new Promise(function (done, err) {
                            png.on("parsed", function (e) { return done(e); });
                            png.on("error", function (e) { return err(e); });
                            png.parse(bytes);
                        })];
                case 2:
                    _a.sent();
                    img = new a1lib.ImageData(new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength), png.width, png.height);
                    bg = null;
                    pxheight = img.height - 1;
                    if (meta.unblendmode == "removebg") {
                        pxheight /= 2;
                        bg = cloneImage(img, 0, pxheight + 1, img.width, pxheight);
                    }
                    inimg = cloneImage(img, 0, 0, img.width, pxheight);
                    if (meta.unblendmode == "removebg") {
                        outimg = OCR.unblendKnownBg(inimg, bg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
                    }
                    else if (meta.unblendmode == "raw") {
                        outimg = OCR.unblendTrans(inimg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
                    }
                    else {
                        throw "no unblend mode";
                    }
                    unblended = new a1lib.ImageData(img.width, pxheight + 1);
                    outimg.copyTo(unblended, 0, 0, outimg.width, outimg.height, 0, 0);
                    img.copyTo(unblended, 0, pxheight, img.width, 1, 0, pxheight);
                    font = OCR.generatefont(unblended, meta.chars, meta.seconds, meta.bonus, meta.basey, meta.spacewidth, meta.treshold, meta.shadow);
                    me.callback(null, JSON.stringify(font));
                    return [2 /*return*/];
            }
        });
    });
};
//debug function used to be able to view an image while inside a webpack process
//paste the returned string in a console with old alt1 libraries loaded
function exportimg(img) {
    return "(function(){var b=new ImageData(" + img.width + "," + img.height + "); b.data.set([" + img.data + "]); b.show(); console.clear(); return b;})()";
}


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./index.ts");


/***/ }),

/***/ "@alt1/base":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__alt1_base__;

/***/ }),

/***/ "@alt1/ocr":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__alt1_ocr__;

/***/ }),

/***/ "pngjs":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_pngjs__;

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@alt1/base"), require("@alt1/ocr"));
	else if(typeof define === 'function' && define.amd)
		define(["@alt1/base", "@alt1/ocr"], factory);
	else if(typeof exports === 'object')
		exports["@alt1/tooltip"] = factory(require("@alt1/base"), require("@alt1/ocr"));
	else
		root["TooltipReader"] = factory(root["A1lib"], root["OCR"]);
})((typeof self!='undefined'?self:this), function(__WEBPACK_EXTERNAL_MODULE__alt1_base__, __WEBPACK_EXTERNAL_MODULE__alt1_ocr__) {
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

/***/ "../ocr/fonts/aa_10px_mono.fontmeta.json":
/***/ (function(module) {

module.exports = {"chars":[{"width":4,"chr":"!","bonus":40,"secondary":false,"pixels":[1,1,238,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,10,238]},{"width":5,"chr":"\"","bonus":30,"secondary":true,"pixels":[1,0,187,1,1,255,2,0,153,2,1,153,3,0,255,3,1,187]},{"width":10,"chr":"#","bonus":160,"secondary":false,"pixels":[1,4,238,1,8,255,2,4,255,2,8,255,2,9,221,2,10,255,3,1,153,3,2,187,3,3,221,3,4,255,3,5,255,3,6,204,3,7,170,3,8,255,4,1,153,4,4,255,4,8,255,5,4,255,5,8,255,5,9,204,5,10,255,6,2,187,6,3,221,6,4,255,6,5,255,6,6,221,6,7,187,6,8,255,7,1,153,7,4,255,7,8,255,8,4,255]},{"width":8,"chr":"$","bonus":105,"secondary":false,"pixels":[1,2,221,1,3,255,1,4,255,1,9,238,2,1,221,2,2,153,2,5,255,2,10,238,3,0,255,3,1,255,3,5,187,3,6,170,3,10,255,3,11,255,4,1,238,4,6,255,4,10,221,5,2,153,5,7,255,5,8,255,5,9,238]},{"width":10,"chr":"%","bonus":125,"secondary":false,"pixels":[1,2,255,1,3,255,1,10,187,2,1,255,2,4,255,2,9,238,3,2,255,3,3,255,3,7,170,3,8,221,4,6,238,5,4,153,5,5,238,5,8,255,5,9,255,6,3,238,6,4,170,6,7,255,6,10,255,7,2,238,7,7,255,7,10,255,8,1,187,8,8,255,8,9,255]},{"width":9,"chr":"&","bonus":150,"secondary":false,"pixels":[1,2,204,1,3,255,1,4,204,1,6,204,1,7,255,1,8,255,1,9,204,2,1,204,2,2,170,2,4,153,2,5,255,2,6,187,2,9,187,2,10,187,3,1,255,3,5,255,3,10,255,4,1,255,4,5,255,4,10,255,5,5,255,5,9,204,5,10,170,6,4,255,6,5,255,6,6,255,6,7,255,6,8,238,6,9,153,7,5,255]},{"width":4,"chr":"'","bonus":10,"secondary":true,"pixels":[2,1,221,2,2,187]},{"width":4,"chr":"(","bonus":55,"secondary":false,"pixels":[1,3,170,1,4,221,1,5,255,1,6,255,1,7,255,1,8,221,1,9,170,2,1,221,2,2,204,2,10,187,2,11,255]},{"width":4,"chr":")","bonus":55,"secondary":false,"pixels":[1,1,221,1,2,204,1,10,187,1,11,255,2,3,170,2,4,221,2,5,255,2,6,255,2,7,255,2,8,221,2,9,170]},{"width":7,"chr":"*","bonus":60,"secondary":false,"pixels":[1,3,170,2,3,238,2,4,170,2,5,238,3,1,255,3,2,255,3,3,255,3,4,238,4,3,238,4,4,170,4,5,238,5,3,153]},{"width":9,"chr":"+","bonus":65,"secondary":false,"pixels":[1,7,255,2,7,255,3,7,255,4,4,255,4,5,255,4,6,255,4,7,255,4,8,255,4,9,255,4,10,255,5,7,255,6,7,255,7,7,255]},{"width":4,"chr":",","bonus":20,"secondary":true,"pixels":[1,10,187,1,11,170,2,9,255,2,10,153]},{"width":6,"chr":"-","bonus":20,"secondary":true,"pixels":[1,7,255,2,7,255,3,7,255,4,7,170]},{"width":4,"chr":".","bonus":5,"secondary":true,"pixels":[1,10,255]},{"width":6,"chr":"/","bonus":55,"secondary":false,"pixels":[1,10,187,1,11,187,2,7,204,2,8,255,2,9,187,3,3,170,3,4,255,3,5,221,3,6,153,4,1,255,4,2,204]},{"width":9,"chr":"0","bonus":110,"secondary":false,"pixels":[1,3,187,1,4,238,1,5,255,1,6,255,1,7,238,1,8,187,2,2,255,2,9,255,3,1,238,3,10,238,4,1,255,4,10,255,5,1,238,5,10,238,6,2,255,6,9,255,7,3,187,7,4,238,7,5,255,7,6,255,7,7,238,7,8,187]},{"width":7,"chr":"1","bonus":80,"secondary":false,"pixels":[1,3,204,1,10,255,2,2,238,2,10,255,3,1,255,3,2,255,3,3,255,3,4,255,3,5,255,3,6,255,3,7,255,3,8,255,3,9,255,3,10,255,4,10,255,5,10,255]},{"width":8,"chr":"2","bonus":110,"secondary":false,"pixels":[2,2,255,2,8,204,2,9,255,2,10,255,3,1,204,3,7,221,3,8,170,3,10,255,4,1,255,4,6,204,4,7,170,4,10,255,5,1,221,5,2,153,5,5,187,5,6,204,5,10,255,6,2,221,6,3,255,6,4,255,6,5,170,6,10,255]},{"width":8,"chr":"3","bonus":120,"secondary":false,"pixels":[1,9,170,2,1,255,2,9,187,2,10,170,3,1,255,3,5,255,3,10,255,4,1,255,4,3,170,4,4,221,4,5,238,4,10,255,5,1,255,5,2,238,5,3,187,5,5,170,5,6,187,5,9,187,5,10,170,6,1,255,6,6,187,6,7,255,6,8,255,6,9,187]},{"width":9,"chr":"4","bonus":115,"secondary":false,"pixels":[1,6,187,1,7,255,2,5,221,2,6,153,2,7,255,3,4,238,3,7,255,4,3,238,4,7,255,5,1,170,5,2,255,5,7,255,6,1,255,6,2,255,6,3,255,6,4,255,6,5,255,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255,7,7,255]},{"width":8,"chr":"5","bonus":120,"secondary":false,"pixels":[1,9,153,2,1,255,2,2,255,2,3,255,2,4,221,2,5,255,2,9,153,2,10,187,3,1,255,3,5,255,3,10,255,4,1,255,4,5,255,4,10,255,5,1,255,5,5,187,5,6,187,5,9,187,5,10,170,6,1,170,6,6,187,6,7,255,6,8,255,6,9,187]},{"width":9,"chr":"6","bonus":150,"secondary":false,"pixels":[1,4,187,1,5,238,1,6,255,1,7,255,1,8,187,2,2,153,2,3,255,2,4,170,2,5,204,2,6,204,2,8,170,2,9,255,3,2,238,3,5,238,3,10,221,4,1,238,4,5,255,4,10,255,5,1,255,5,5,255,5,10,255,6,1,255,6,5,170,6,6,204,6,9,221,6,10,153,7,6,170,7,7,255,7,8,255,7,9,153]},{"width":9,"chr":"7","bonus":95,"secondary":false,"pixels":[1,1,255,2,1,255,2,8,153,2,9,255,2,10,204,3,1,255,3,6,153,3,7,255,3,8,187,4,1,255,4,4,153,4,5,255,4,6,187,5,1,255,5,2,187,5,3,255,5,4,187,6,1,255,6,2,170]},{"width":9,"chr":"8","bonus":170,"secondary":false,"pixels":[1,2,204,1,3,255,1,4,204,1,6,153,1,7,255,1,8,255,1,9,153,2,1,187,2,2,187,2,4,187,2,5,255,2,6,204,2,9,221,2,10,153,3,1,255,3,5,255,3,10,255,4,1,255,4,5,170,4,10,255,5,1,204,5,2,153,5,5,204,5,6,204,5,10,238,6,2,238,6,3,255,6,4,255,6,5,170,6,6,255,6,9,221,7,7,238,7,8,255,7,9,153]},{"width":9,"chr":"9","bonus":140,"secondary":false,"pixels":[1,3,238,1,4,255,1,5,238,2,2,238,2,6,238,2,10,255,3,1,255,3,7,238,3,10,255,4,1,255,4,7,255,4,10,238,5,1,204,5,2,153,5,7,204,5,9,204,5,10,153,6,2,238,6,3,187,6,6,238,6,7,187,6,8,221,6,9,204,7,3,153,7,4,221,7,5,255,7,6,255,7,7,221]},{"width":3,"chr":":","bonus":10,"secondary":true,"pixels":[1,3,255,1,9,255]},{"width":4,"chr":";","bonus":15,"secondary":true,"pixels":[2,3,255,2,9,255,2,10,204]},{"width":8,"chr":"<","bonus":60,"secondary":false,"pixels":[1,5,187,1,6,238,2,5,255,2,6,204,3,4,170,3,7,204,4,4,255,4,7,238,5,4,170,5,8,187,6,3,187,6,8,204]},{"width":9,"chr":"=","bonus":70,"secondary":false,"pixels":[1,6,221,1,8,221,2,6,255,2,8,255,3,6,255,3,8,255,4,6,255,4,8,255,5,6,255,5,8,255,6,6,255,6,8,255,7,6,255,7,8,255]},{"width":8,"chr":">","bonus":75,"secondary":false,"pixels":[1,3,153,2,3,153,2,4,170,2,8,255,3,4,255,3,7,187,3,8,170,4,4,170,4,5,153,4,7,255,5,5,255,5,6,187,5,7,153,6,5,170,6,6,255]},{"width":6,"chr":"?","bonus":55,"secondary":false,"pixels":[1,1,204,2,1,255,2,6,187,2,7,255,2,10,255,3,1,238,3,5,238,3,6,153,4,2,238,4,3,255,4,4,255]},{"width":10,"chr":"@","bonus":165,"secondary":false,"pixels":[1,5,153,1,6,255,1,7,255,1,8,255,1,9,187,2,4,204,2,5,187,2,9,170,2,10,255,3,4,204,3,11,255,4,3,238,4,6,238,4,7,255,4,8,238,4,12,187,5,3,255,5,5,204,5,9,221,5,12,255,6,3,255,6,5,255,6,9,255,7,3,221,7,5,255,7,9,255,8,4,221,8,5,255,8,6,255,8,7,255,8,8,255,8,9,255,9,9,255]},{"width":10,"chr":"A","bonus":140,"secondary":false,"pixels":[1,9,153,1,10,238,2,7,221,2,8,255,2,9,204,3,4,204,3,5,255,3,6,204,3,7,255,4,1,187,4,2,255,4,3,204,4,7,255,5,1,238,5,2,255,5,3,187,5,7,255,6,3,153,6,4,238,6,5,255,6,6,187,6,7,255,7,6,153,7,7,255,7,8,255,7,9,170,8,9,187,8,10,255]},{"width":9,"chr":"B","bonus":160,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,1,255,2,6,255,2,10,255,3,1,255,3,6,255,3,10,255,4,1,255,4,6,255,4,10,255,5,1,221,5,2,153,5,5,170,5,6,255,5,9,153,5,10,204,6,2,238,6,3,255,6,4,255,6,5,204,6,7,238,6,8,255,6,9,238]},{"width":10,"chr":"C","bonus":105,"secondary":false,"pixels":[1,3,153,1,4,255,1,5,255,1,6,255,1,7,238,2,2,204,2,3,204,2,8,204,2,9,204,3,2,187,3,9,204,4,1,221,4,10,221,5,1,255,5,10,255,6,1,238,6,10,238,7,1,187,7,10,187,8,2,221,8,9,255]},{"width":10,"chr":"D","bonus":160,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,1,255,2,10,255,3,1,255,3,10,255,4,1,255,4,10,255,5,1,238,5,10,238,6,1,153,6,2,204,6,9,204,6,10,153,7,2,221,7,3,204,7,8,204,7,9,221,8,3,170,8,4,255,8,5,255,8,6,255,8,7,255,8,8,170]},{"width":8,"chr":"E","bonus":105,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,1,255,2,6,255,2,10,255,3,1,255,3,6,255,3,10,255,4,1,255,4,6,255,4,10,255,5,1,255,5,10,255]},{"width":7,"chr":"F","bonus":85,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,1,255,2,6,255,3,1,255,3,6,255,4,1,255,4,6,255,5,1,255]},{"width":10,"chr":"G","bonus":145,"secondary":false,"pixels":[1,3,153,1,4,255,1,5,255,1,6,255,1,7,255,1,8,153,2,2,204,2,3,187,2,8,204,2,9,221,3,1,153,3,2,187,3,9,187,3,10,170,4,1,255,4,10,255,5,1,255,5,10,255,6,1,238,6,6,170,6,10,204,7,2,204,7,6,255,7,9,238,8,6,255,8,7,255,8,8,255,8,9,255,8,10,255]},{"width":9,"chr":"H","bonus":125,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,6,255,3,6,255,4,6,255,5,6,255,6,6,255,7,1,255,7,2,255,7,3,255,7,4,255,7,5,255,7,6,255,7,7,255,7,8,255,7,9,255,7,10,255]},{"width":5,"chr":"I","bonus":70,"secondary":false,"pixels":[1,1,255,1,10,255,2,1,255,2,2,255,2,3,255,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,3,1,255,3,10,255]},{"width":8,"chr":"J","bonus":100,"secondary":false,"pixels":[1,8,255,1,9,187,2,9,187,2,10,187,3,1,221,3,10,255,4,1,255,4,10,255,5,1,255,5,9,187,5,10,187,6,1,255,6,2,255,6,3,255,6,4,255,6,5,255,6,6,255,6,7,255,6,8,255,6,9,187]},{"width":9,"chr":"K","bonus":120,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,6,255,3,6,255,4,4,187,4,5,255,4,6,170,4,7,255,5,2,187,5,3,255,5,8,221,5,9,204,6,1,255,6,2,153,6,9,153,6,10,255]},{"width":8,"chr":"L","bonus":75,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,10,255,3,10,255,4,10,255,5,10,255,6,10,170]},{"width":11,"chr":"M","bonus":180,"secondary":false,"pixels":[1,3,170,1,4,170,1,5,204,1,6,221,1,7,238,1,8,255,1,9,255,1,10,255,2,1,255,2,2,255,2,3,255,2,4,170,3,3,204,3,4,255,3,5,170,4,5,153,4,6,255,4,7,221,5,7,221,5,8,255,6,5,187,6,6,255,6,7,187,7,3,221,7,4,238,8,1,255,8,2,255,8,3,255,8,4,187,8,5,153,9,5,170,9,6,187,9,7,204,9,8,221,9,9,238,9,10,255]},{"width":10,"chr":"N","bonus":145,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,2,238,2,3,221,3,3,170,3,4,255,4,5,221,4,6,204,5,7,255,6,8,204,6,9,221,7,1,255,7,2,255,7,3,255,7,4,255,7,5,255,7,6,255,7,7,255,7,8,255,7,9,255,7,10,255]},{"width":11,"chr":"O","bonus":130,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,238,2,2,204,2,3,204,2,8,204,2,9,204,3,2,187,3,9,187,4,1,221,4,10,221,5,1,255,5,10,255,6,1,221,6,10,221,7,2,204,7,9,221,8,2,187,8,3,221,8,8,221,8,9,170,9,4,221,9,5,255,9,6,255,9,7,204]},{"width":9,"chr":"P","bonus":125,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,1,255,2,7,255,3,1,255,3,7,255,4,1,255,4,7,255,5,1,187,5,2,187,5,6,187,5,7,187,6,2,187,6,3,255,6,4,255,6,5,255,6,6,187]},{"width":11,"chr":"Q","bonus":140,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,238,2,2,204,2,3,204,2,8,204,2,9,204,3,2,187,3,9,187,4,1,238,4,10,238,5,1,255,5,10,255,6,1,221,6,10,221,7,2,204,7,8,238,7,9,221,8,2,187,8,3,221,8,8,238,8,9,255,9,4,221,9,5,255,9,6,255,9,7,204,9,10,187]},{"width":9,"chr":"R","bonus":140,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,1,255,2,6,255,3,1,255,3,6,255,4,1,255,4,6,255,5,1,204,5,2,153,5,5,153,5,6,221,5,7,238,5,8,238,6,2,221,6,3,255,6,4,255,6,5,221,6,9,238,6,10,221]},{"width":7,"chr":"S","bonus":95,"secondary":false,"pixels":[1,2,221,1,3,255,1,4,255,1,9,238,2,1,204,2,2,153,2,5,255,2,10,238,3,1,255,3,5,187,3,6,153,3,10,255,4,1,238,4,6,255,4,10,221,5,2,170,5,7,255,5,8,255,5,9,238]},{"width":10,"chr":"T","bonus":80,"secondary":false,"pixels":[1,1,255,2,1,255,3,1,255,4,1,255,4,2,255,4,3,255,4,4,255,4,5,255,4,6,255,4,7,255,4,8,255,4,9,255,4,10,255,5,1,255,6,1,255,7,1,255]},{"width":10,"chr":"U","bonus":110,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,238,2,9,238,3,10,204,4,10,255,5,10,255,6,10,204,7,9,238,8,1,255,8,2,255,8,3,255,8,4,255,8,5,255,8,6,255,8,7,255,8,8,221]},{"width":10,"chr":"V","bonus":110,"secondary":false,"pixels":[1,1,238,1,2,153,2,2,187,2,3,255,2,4,221,3,5,187,3,6,255,3,7,204,4,8,204,4,9,255,4,10,204,5,8,204,5,9,255,5,10,204,6,5,187,6,6,255,6,7,204,7,2,187,7,3,255,7,4,221,8,1,238,8,2,153]},{"width":13,"chr":"W","bonus":195,"secondary":false,"pixels":[1,1,255,1,2,187,2,3,187,2,4,255,2,5,255,2,6,204,3,7,170,3,8,221,3,9,255,3,10,221,4,7,170,4,8,238,4,9,255,4,10,187,5,3,187,5,4,255,5,5,255,5,6,187,6,1,255,6,2,255,6,3,255,7,3,170,7,4,238,7,5,255,7,6,204,8,7,153,8,8,221,8,9,255,8,10,204,9,7,187,9,8,255,9,9,255,9,10,204,10,3,204,10,4,255,10,5,255,10,6,187,11,1,255,11,2,187]},{"width":9,"chr":"X","bonus":125,"secondary":false,"pixels":[1,1,221,1,10,255,2,1,153,2,2,255,2,3,187,2,8,238,2,9,221,3,3,170,3,4,255,3,5,153,3,6,204,3,7,238,4,4,187,4,5,255,4,6,255,5,3,238,5,4,221,5,7,255,5,8,170,6,1,221,6,2,238,6,8,187,6,9,255,7,1,153,7,10,221]},{"width":9,"chr":"Y","bonus":80,"secondary":false,"pixels":[1,1,238,2,2,238,2,3,204,3,4,255,3,5,187,4,5,255,4,6,255,4,7,255,4,8,255,4,9,255,4,10,255,5,4,238,5,5,204,6,2,221,6,3,238,7,1,255]},{"width":9,"chr":"Z","bonus":115,"secondary":false,"pixels":[1,10,170,2,1,255,2,8,153,2,9,255,2,10,255,3,1,255,3,7,238,3,8,221,3,10,255,4,1,255,4,5,187,4,6,255,4,10,255,5,1,255,5,4,255,5,5,187,5,10,255,6,1,255,6,2,204,6,3,221,6,10,255,7,1,255,7,10,255]},{"width":4,"chr":"[","bonus":65,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,2,1,255,2,11,255]},{"width":6,"chr":"\\","bonus":50,"secondary":false,"pixels":[1,1,238,1,2,255,1,3,170,2,4,221,2,5,255,2,6,187,3,7,204,3,8,255,3,9,187,4,10,204]},{"width":3,"chr":"]","bonus":65,"secondary":false,"pixels":[0,1,255,0,11,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255]},{"width":8,"chr":"^","bonus":55,"secondary":false,"pixels":[1,6,170,2,4,221,2,5,238,3,2,255,3,3,187,4,1,187,4,2,255,4,3,153,5,4,255,5,5,204,6,6,204]},{"width":9,"chr":"_","bonus":35,"secondary":false,"pixels":[1,11,255,2,11,255,3,11,255,4,11,255,5,11,255,6,11,255,7,11,255]},{"width":8,"chr":"a","bonus":110,"secondary":false,"pixels":[1,8,221,1,9,255,2,4,187,2,7,170,2,8,153,2,10,221,3,4,255,3,7,221,3,10,255,4,4,255,4,7,255,4,10,238,5,4,204,5,5,170,5,7,255,5,9,204,6,5,204,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255]},{"width":8,"chr":"b","bonus":135,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,4,153,2,5,221,2,9,221,2,10,153,3,4,238,3,10,238,4,4,255,4,10,255,5,4,187,5,5,187,5,9,187,5,10,170,6,5,187,6,6,255,6,7,255,6,8,255,6,9,170]},{"width":8,"chr":"c","bonus":60,"secondary":false,"pixels":[1,6,255,1,7,255,1,8,255,2,5,221,2,9,221,3,4,238,3,10,238,4,4,255,4,10,255,5,4,221,5,10,221,6,9,204]},{"width":8,"chr":"d","bonus":135,"secondary":false,"pixels":[1,5,170,1,6,255,1,7,255,1,8,255,1,9,187,2,4,170,2,5,187,2,9,187,2,10,170,3,4,255,3,10,255,4,4,238,4,10,238,5,4,153,5,5,221,5,9,221,5,10,153,6,1,255,6,2,255,6,3,255,6,4,255,6,5,255,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255]},{"width":8,"chr":"e","bonus":100,"secondary":false,"pixels":[1,6,255,1,7,255,1,8,255,1,9,153,2,5,204,2,7,255,2,9,204,3,4,255,3,7,255,3,10,238,4,4,255,4,7,255,4,10,255,5,4,170,5,5,187,5,7,255,5,10,221,6,5,153,6,6,238,6,7,255]},{"width":6,"chr":"f","bonus":70,"secondary":false,"pixels":[1,4,221,2,2,221,2,3,255,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,3,1,221,3,4,255,4,1,255,4,4,221]},{"width":8,"chr":"g","bonus":135,"secondary":false,"pixels":[1,5,187,1,6,255,1,7,255,1,8,255,1,9,187,2,4,204,2,5,170,2,9,170,2,10,221,2,13,238,3,4,255,3,10,255,3,13,255,4,4,187,4,5,153,4,10,204,4,12,170,4,13,187,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255,5,9,255,5,10,255,5,11,255,5,12,204]},{"width":9,"chr":"h","bonus":100,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,5,238,3,4,204,4,4,255,5,4,238,6,5,255,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255]},{"width":4,"chr":"i","bonus":40,"secondary":false,"pixels":[1,1,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255]},{"width":5,"chr":"j","bonus":60,"secondary":false,"pixels":[0,13,221,1,13,238,2,1,255,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,2,11,255,2,12,255]},{"width":7,"chr":"k","bonus":100,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,7,255,3,6,187,3,7,255,3,8,170,4,5,255,4,6,170,4,8,187,4,9,221,5,4,255,5,10,255]},{"width":5,"chr":"l","bonus":50,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,2,10,255]},{"width":12,"chr":"m","bonus":130,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,5,238,3,4,204,4,4,255,5,4,221,6,5,238,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255,7,5,204,8,4,255,9,4,255,10,5,255,10,6,255,10,7,255,10,8,255,10,9,255,10,10,255]},{"width":8,"chr":"n","bonus":85,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,5,238,3,4,204,4,4,255,5,4,238,6,5,255,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255]},{"width":9,"chr":"o","bonus":80,"secondary":false,"pixels":[1,6,255,1,7,255,1,8,255,2,5,221,2,9,221,3,4,221,3,10,221,4,4,255,4,10,255,5,4,221,5,10,221,6,5,238,6,9,238,7,6,221,7,7,255,7,8,221]},{"width":8,"chr":"p","bonus":130,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,153,2,5,204,2,9,221,2,10,153,3,4,238,3,10,238,4,4,255,4,10,255,5,4,187,5,5,187,5,9,187,5,10,170,6,5,187,6,6,255,6,7,255,6,8,255,6,9,170]},{"width":8,"chr":"q","bonus":130,"secondary":false,"pixels":[1,5,170,1,6,255,1,7,255,1,8,255,1,9,187,2,4,170,2,5,187,2,9,187,2,10,187,3,4,255,3,10,255,4,4,238,4,10,238,5,4,153,5,5,204,5,9,221,5,10,153,6,4,255,6,5,255,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255,6,11,255,6,12,255]},{"width":6,"chr":"r","bonus":45,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,5,238,3,4,238]},{"width":6,"chr":"s","bonus":65,"secondary":false,"pixels":[1,5,255,1,6,255,1,9,153,1,10,170,2,4,255,2,7,221,2,10,255,3,4,255,3,7,238,3,10,255,4,4,153,4,8,255,4,9,255]},{"width":5,"chr":"t","bonus":65,"secondary":false,"pixels":[0,4,255,1,2,238,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,221,2,4,255,2,10,221,3,4,221,3,10,255]},{"width":9,"chr":"u","bonus":85,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,238,2,10,221,3,10,255,4,10,221,5,9,221,6,4,255,6,5,255,6,6,255,6,7,255,6,8,255,6,9,255,6,10,255]},{"width":8,"chr":"v","bonus":75,"secondary":false,"pixels":[1,4,238,2,5,187,2,6,255,2,7,204,3,8,221,3,9,255,3,10,170,4,8,153,4,9,255,4,10,238,5,6,221,5,7,255,5,8,170,6,4,255,6,5,204]},{"width":12,"chr":"w","bonus":135,"secondary":false,"pixels":[1,4,238,1,5,153,2,5,170,2,6,255,2,7,238,2,8,153,3,8,153,3,9,255,3,10,255,4,8,204,4,9,255,4,10,170,5,5,187,5,6,255,5,7,187,6,5,255,6,6,221,7,7,187,7,8,255,7,9,187,8,9,255,8,10,255,9,6,187,9,7,255,9,8,221,10,4,255,10,5,204]},{"width":8,"chr":"x","bonus":90,"secondary":false,"pixels":[1,4,153,1,10,221,2,4,204,2,5,238,2,9,255,2,10,153,3,6,238,3,7,238,3,8,221,4,6,238,4,7,238,4,8,221,5,4,204,5,5,238,5,9,255,5,10,153,6,4,153,6,10,221]},{"width":9,"chr":"y","bonus":100,"secondary":false,"pixels":[1,4,238,1,13,204,2,5,221,2,6,255,2,7,170,2,13,255,3,7,153,3,8,238,3,9,238,3,12,238,3,13,153,4,9,255,4,10,255,4,11,187,5,6,170,5,7,255,5,8,221,6,4,238,6,5,255,6,6,170]},{"width":8,"chr":"z","bonus":95,"secondary":false,"pixels":[1,4,255,1,10,255,2,4,255,2,8,187,2,9,255,2,10,255,3,4,255,3,7,221,3,8,187,3,10,255,4,4,255,4,6,238,4,7,153,4,10,255,5,4,255,5,5,255,5,10,255,6,4,238,6,10,255]},{"width":6,"chr":"{","bonus":55,"secondary":false,"pixels":[1,6,255,2,2,255,2,3,255,2,4,255,2,5,221,2,7,238,2,8,255,2,9,255,2,10,255,3,1,255,3,11,255]},{"width":4,"chr":"|","bonus":60,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255]},{"width":5,"chr":"}","bonus":55,"secondary":false,"pixels":[1,1,255,1,11,255,2,2,221,2,3,255,2,4,255,2,5,238,2,7,255,2,8,255,2,9,255,2,10,221,3,6,255]},{"width":8,"chr":"~","bonus":30,"secondary":false,"pixels":[1,6,238,2,5,255,3,5,238,4,6,238,5,6,255,6,5,238]}],"width":13,"spacewidth":3,"shadow":false,"height":14,"basey":10};

/***/ }),

/***/ "./index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var a1lib = __webpack_require__("@alt1/base");
var OCR = __webpack_require__("@alt1/ocr");
var font = __webpack_require__("../ocr/fonts/aa_10px_mono.fontmeta.json");
var TooltipReader = /** @class */ (function () {
    function TooltipReader() {
        this.farTooltip = false; //Tooltips are further away when interacting with inventory items
        this.lookabove = true; //check for tooltips going up when near the bottom of the screen
        this.trackinactive = true; //keep tracking when rs isn't active
        this.tracking = false;
        this.trackcallback = null;
        this.trackinterval = 0;
    }
    TooltipReader.prototype.track = function (callback, interval) {
        if (interval === void 0) { interval = 30; }
        if (!interval) {
            interval = 30;
        }
        this.stopTrack();
        this.trackinterval = setInterval(this.trackTick.bind(this), interval);
        this.trackcallback = callback;
        this.tracking = true;
    };
    TooltipReader.prototype.stopTrack = function () {
        if (this.trackinterval) {
            clearInterval(this.trackinterval);
        }
        this.trackinterval = 0;
        this.tracking = false;
    };
    TooltipReader.prototype.trackTick = function () {
        var dir = 1;
        var mousepos = a1lib.getMousePosition();
        if (!this.trackinactive) {
            if (!alt1.rsActive) {
                return;
            }
            if (!mousepos) {
                return;
            }
        }
        var found = TooltipReader.checkPossible(null, false, this.farTooltip);
        if (this.lookabove && !found && mousepos && mousepos.y > alt1.rsHeight - TooltipReader.maxh) {
            found = TooltipReader.checkPossible(null, true, this.farTooltip);
            dir = -1;
        }
        var r = null;
        if (found) {
            r = TooltipReader.read(dir);
        }
        this.trackcallback(r);
    };
    TooltipReader.drawOverlay = function (tooltip, ignoregroup) {
        if (!ignoregroup) {
            alt1.overLayFreezeGroup("pc_tooltipread");
            alt1.overLaySetGroupZIndex("pc_tooltipread", 1);
            alt1.overLayClearGroup("pc_tooltipread");
            alt1.overLaySetGroup("pc_tooltipread");
        }
        if (tooltip) {
            var col = a1lib.mixColor(0, 0, 0);
            for (var a = -4; a < tooltip.area.height + 4; a += 20) {
                var y1 = tooltip.area.y + a;
                var y2 = Math.min(y1 + 20, tooltip.area.y + tooltip.area.height + 4);
                alt1.overLayRect(col, tooltip.area.x - 4, y1, tooltip.area.width + 8, y2 - y1, 400, Math.ceil((y2 - y1) / 2));
            }
        }
        if (!ignoregroup) {
            alt1.overLayRefreshGroup("pc_tooltipread");
        }
    };
    /**
     * very fast check to see if a tooltip might exist
     * set up to true to check for tooltips above the mouse instead of under
     */
    TooltipReader.checkPossible = function (buf, up, far) {
        var mousepos = a1lib.getMousePosition();
        if (!mousepos) {
            return false;
        }
        if (!buf) {
            buf = a1lib.capture(mousepos.x, mousepos.y + (up ? -1 : 1) * (far ? 37 : (up ? 32 : 28)), 5, 5);
        }
        if (!buf) {
            return false;
        }
        var data = buf.data;
        var blacks = 0;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0) {
                blacks++;
            }
        }
        return blacks > data.length / 4 / 2;
    };
    TooltipReader.getCaptArea = function (dir, mousepos) {
        if (!mousepos) {
            mousepos = a1lib.getMousePosition();
        }
        var captarea = { x: 0, y: 0, width: 0, height: 0 };
        captarea.width = TooltipReader.maxw;
        captarea.x = Math.min(mousepos.x - Math.floor(TooltipReader.maxw / 2), alt1.rsWidth - TooltipReader.maxw);
        if (dir == 0) {
            if (mousepos.y + TooltipReader.offsety + TooltipReader.maxh > alt1.rsHeight) {
                captarea.y = mousepos.y - TooltipReader.offsety - TooltipReader.maxh;
                captarea.height = alt1.rsHeight - captarea.y;
            }
            else {
                captarea.y = mousepos.y + TooltipReader.offsety;
                captarea.height = TooltipReader.maxh;
            }
        }
        else {
            captarea.height = TooltipReader.maxh;
            captarea.y = mousepos.y + (dir == -1 ? -TooltipReader.offsety - TooltipReader.maxh : TooltipReader.offsety);
        }
        if (captarea.x < 0) {
            captarea.x = 0;
        }
        if (captarea.y < 0) {
            captarea.y = 0;
        }
        //TODO also do this for right and bot
        return captarea;
    };
    TooltipReader.readImage = function (img, mouseAbs, dir) {
        var area = TooltipReader.getCaptArea(dir, mouseAbs);
        //make sure we don't try to capture something that isn't in the img
        //TODO use rect class functionality instead?
        if (area.x < img.x) {
            area.width -= img.x - area.x;
            area.x = img.x;
        }
        if (area.y < img.y) {
            area.height -= img.y - area.y;
            area.y = img.y;
        }
        if (area.width > img.width) {
            area.width = img.width;
        }
        if (area.height > img.height) {
            area.height = img.height;
        }
        if (area.x + area.width > img.x + img.width) {
            area.width = img.x + img.width - area.x;
        }
        if (area.y + area.height > img.y + img.height) {
            area.height = img.y + img.height - area.y;
        }
        var buffer = img.toData(area.x, area.y, area.width, area.height);
        var cx = mouseAbs.x - img.x;
        var cy = mouseAbs.y - img.y + 20 * dir;
        var rect = null;
        while (cx >= 0 && cx < buffer.width && cy >= 0 && cy < buffer.height) {
            var i = 4 * cx + 4 * buffer.width * cy;
            if (buffer.data[i] == 0 && buffer.data[i + 1] == 0 && buffer.data[i + 2] == 0) {
                rect = this.attemptFill(buffer, cx, cy, dir);
                if (rect) {
                    break;
                }
            }
            cy += dir;
        }
        if (!rect) {
            return null;
        }
        var uncertainx = rect.x + rect.width + img.x >= alt1.rsWidth - 6 || rect.x + img.x <= 6;
        //alt1.overLayRect(a1lib.mixColor(255,255,255),rect.x+img.x,rect.y+img.y,rect.width,rect.height,200,1);
        var mousepos = {
            x: (uncertainx ? mouseAbs.x : img.x + rect.x + Math.floor(rect.width / 2)),
            y: img.y + rect.y + (dir == 1 ? -26 : +rect.height + 4),
            uncertainx: uncertainx,
        };
        return {
            area: { x: rect.x + img.x, y: rect.y + img.y, width: rect.width, height: rect.height },
            mousepos: mousepos,
            readBankItem: TooltipReader.readBankItem.bind(TooltipReader, img, rect),
            readInteraction: TooltipReader.readInteraction.bind(TooltipReader, img, rect)
        };
    };
    TooltipReader.read = function (dir) {
        if (!dir) {
            dir = 1;
        } //TODO find actual dir
        var mousepos = a1lib.getMousePosition();
        if (!mousepos) {
            return null;
        }
        var captarea = TooltipReader.getCaptArea(dir, mousepos);
        var img = a1lib.captureHold(captarea.x, captarea.y, captarea.width, captarea.height);
        if (!img) {
            return null;
        }
        if (dir) {
            return TooltipReader.readImage(img, mousepos, dir);
        }
        else {
            return TooltipReader.readImage(img, mousepos, 1) || TooltipReader.readImage(img, mousepos, -1);
        }
    };
    TooltipReader.readBankItem = function (img, area) {
        var data = img.toData();
        var line1 = null;
        var line2 = null;
        var name = "";
        for (var a = 0; a < 2; a++) {
            var wiggle = Math.round(Math.random() * 6 - 3);
            line1 = OCR.findReadLine(data, font, [[255, 152, 31]], area.x + Math.floor(area.width / 2) + 20 + 20 * a + wiggle, area.y + 14);
            if (line1 && line1.text) {
                var m = line1.text.match(/\w/g);
                if (m && m.length >= 4) {
                    name += line1.text;
                    break;
                }
            }
        }
        if (area.height > 30) {
            for (var a = 0; a < 2; a++) {
                var wiggle = Math.round(Math.random() * 6 - 3);
                line2 = OCR.findReadLine(data, font, [[255, 152, 31]], area.x + Math.floor(area.width / 2) - 20 + 20 * a + wiggle, area.y + 14 + 15);
                if (line2 && line2.text) {
                    var m = line2.text.match(/[\)\(\w\)]/g);
                    if (m && m.length >= 3) {
                        name += " " + line2.text;
                        break;
                    }
                }
            }
        }
        console.log(name);
        return name;
    };
    /**
     * @deprecated Not completed
     * @param area
     */
    TooltipReader.readInteraction = function (img, area) {
        var data = img.toData();
        var readrules = {
            fontname: "largefont",
            budget: 1,
            allowmulticol: true,
            backwards: true,
            colors: [
                a1lib.mixColor(235, 224, 188),
                a1lib.mixColor(0, 255, 255),
                a1lib.mixColor(248, 213, 107),
                a1lib.mixColor(184, 209, 209),
                a1lib.mixColor(255, 255, 0),
            ]
        };
        var colors = [
            [235, 224, 188],
            [0, 255, 255],
            [248, 213, 107],
            [184, 209, 209],
            [255, 255, 0],
        ];
        //TODO remove this and all refs
        var rulestr = JSON.stringify(readrules);
        //throw "not completely implemented. OCR only supports one colors at a time";
        //TODO only one color allowed atm
        var lines = OCR.findReadLine(data, font, colors, area.x + 12, area.y + 14);
        return lines;
    };
    TooltipReader.searchBuffer = function (buffer, x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = buffer.width; }
        if (h === void 0) { h = buffer.height; }
        var xsteps = Math.ceil(w / 100);
        var data = buffer.data;
        for (var a = 0; a <= xsteps; a++) {
            var cx = x + Math.round((w - 1) / xsteps * a);
            for (var cy = y; cy < y + h; cy++) {
                var i = 4 * cx + 4 * buffer.width * cy;
                if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0) {
                    var r = this.attemptFill(buffer, cx, cy, -1);
                    if (typeof r == "object") {
                        return r;
                    }
                    if (r == "badimg") {
                        return null;
                    }
                }
            }
        }
        return null;
    };
    TooltipReader.attemptFill = function (buf, x, y, diry) {
        var dir = [1, diry];
        //scan in oposite x dir until nonblack pixel is found
        for (var x1 = x; x1 >= 0 && x1 < buf.width; x1 -= dir[0]) {
            var i = 4 * x1 + 4 * buf.width * y;
            if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) {
                continue;
            }
            break;
        }
        x1 += dir[0];
        if (x1 == 0) {
            return null;
        }
        //scan in oposite y dir until nonblack pixel is found
        for (var y1 = y; y1 >= 0 && y1 < buf.height; y1 -= dir[1]) {
            var i = 4 * x + 4 * buf.width * y1;
            if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) {
                continue;
            }
            break;
        }
        y1 += dir[1];
        if (dir[1] == 1 ? y1 == 0 : y1 == buf.height - 1) {
            return null;
        }
        //scan in x dir from known max y to find 2nd x
        for (var x2 = x1; x2 >= 0 && x2 < buf.width; x2 += dir[0]) {
            var i = 4 * x2 + 4 * buf.width * y1;
            if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) {
                continue;
            }
            break;
        }
        x2 -= dir[0];
        //scan in y dir from known max x to find 2nd y
        for (var y2 = y1; y2 >= 0 && y2 < buf.height; y2 += dir[1]) {
            var i = 4 * x1 + 4 * buf.width * y2;
            if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) {
                continue;
            }
            break;
        }
        y2 -= dir[1];
        if (Math.min(x1, x2) == 0 && Math.max(x1, x2) == buf.width) {
            return null;
        }
        if (Math.min(y1, y2) == 0 && Math.max(y1, y2) == buf.height) {
            return null;
        }
        if (Math.abs(x1 - x2) < 50 || Math.abs(y1 - y2) < 20) {
            return null;
        }
        return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x1 - x2) + 1, height: Math.abs(y1 - y2) + 1 };
    };
    TooltipReader.maxw = 400;
    TooltipReader.maxh = 350;
    TooltipReader.offsetx = -10;
    TooltipReader.offsety = -10;
    return TooltipReader;
}());
exports.default = TooltipReader;


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

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map
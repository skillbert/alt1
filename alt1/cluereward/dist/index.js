(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@alt1/base"), require("@alt1/ocr"));
	else if(typeof define === 'function' && define.amd)
		define(["@alt1/base", "@alt1/ocr"], factory);
	else if(typeof exports === 'object')
		exports["@alt1/cluereward"] = factory(require("@alt1/base"), require("@alt1/ocr"));
	else
		root["ClueRewardReader"] = factory(root["A1lib"], root["OCR"]);
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

/***/ "../ocr/fonts/aa_9px_mono_allcaps.fontmeta.json":
/***/ (function(module) {

module.exports = {"chars":[{"width":3,"chr":"!","bonus":55,"secondary":false,"pixels":[0,4,221,0,5,170,0,6,153,0,12,153,1,3,221,1,4,255,1,5,221,1,6,204,1,7,170,1,8,153,1,12,204]},{"width":6,"chr":"\"","bonus":30,"secondary":true,"pixels":[1,2,221,1,3,255,1,4,170,3,2,221,3,3,255,3,4,170]},{"width":9,"chr":"#","bonus":160,"secondary":false,"pixels":[1,5,221,1,8,255,2,5,255,2,7,153,2,8,255,2,9,204,2,10,238,2,11,238,3,2,187,3,3,238,3,4,255,3,5,255,3,6,170,3,7,170,3,8,255,4,5,255,4,8,255,5,4,153,5,5,255,5,6,170,5,7,204,5,8,255,5,9,238,5,10,204,5,11,170,6,2,238,6,3,204,6,4,204,6,5,255,6,8,255,7,5,255,7,8,153]},{"width":7,"chr":"$","bonus":145,"secondary":false,"pixels":[1,3,204,1,4,255,1,5,187,1,10,153,1,11,204,2,2,187,2,5,221,2,6,255,2,10,170,2,11,255,2,12,221,3,1,153,3,2,238,3,3,221,3,4,238,3,5,204,3,6,238,3,7,255,3,8,153,3,11,221,4,2,221,4,7,255,4,8,221,4,10,187,5,2,170,5,3,187,5,8,221,5,9,255,5,10,153]},{"width":12,"chr":"%","bonus":175,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,2,3,153,2,7,204,3,3,170,3,7,204,3,12,187,4,3,187,4,4,255,4,5,255,4,6,255,4,10,238,4,11,204,5,7,170,5,8,238,5,9,153,6,5,204,6,6,221,6,9,187,6,10,255,6,11,204,7,3,238,7,4,170,7,8,187,7,11,153,7,12,204,8,8,187,8,12,187,9,8,204,9,9,153,9,12,187,10,9,187,10,10,255,10,11,187]},{"width":12,"chr":"&","bonus":175,"secondary":false,"pixels":[0,9,221,0,10,255,0,11,153,1,5,153,1,8,238,1,9,187,1,10,238,1,11,255,2,4,255,2,5,255,2,6,255,2,7,255,2,11,170,2,12,221,3,3,204,3,7,255,3,8,221,3,12,255,4,3,221,4,8,238,4,9,221,4,12,238,5,3,238,5,9,238,5,10,187,5,12,170,6,4,153,6,10,255,6,11,238,7,10,221,7,11,255,8,8,238,8,9,170,8,12,238,9,12,221]},{"width":3,"chr":"'","bonus":15,"secondary":true,"pixels":[0,2,153,1,2,187,1,3,204]},{"width":5,"chr":"(","bonus":60,"secondary":false,"pixels":[0,6,204,0,7,255,0,8,238,0,9,187,1,4,238,1,5,204,1,6,153,1,9,170,1,10,238,1,11,204,2,3,153,2,12,187]},{"width":5,"chr":")","bonus":50,"secondary":false,"pixels":[1,3,204,1,4,153,1,11,221,2,4,153,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,204]},{"width":5,"chr":"*","bonus":40,"secondary":false,"pixels":[0,3,170,0,5,153,1,2,187,1,3,187,1,4,221,2,4,170,2,5,221,3,3,153]},{"width":8,"chr":"+","bonus":65,"secondary":false,"pixels":[0,8,153,1,8,255,2,8,255,3,5,153,3,6,255,3,7,255,3,8,255,3,9,255,3,10,255,3,11,153,4,8,255,5,8,255,6,8,187]},{"width":3,"chr":",","bonus":10,"secondary":true,"pixels":[1,10,187,1,11,221]},{"width":6,"chr":"-","bonus":20,"secondary":true,"pixels":[0,9,204,1,9,255,2,9,255,3,9,204]},{"width":3,"chr":".","bonus":10,"secondary":true,"pixels":[1,11,170,1,12,204]},{"width":8,"chr":"/","bonus":50,"secondary":false,"pixels":[0,11,187,1,10,238,2,8,221,2,9,153,3,6,170,3,7,204,4,5,238,5,3,221,5,4,170,6,2,153]},{"width":8,"chr":"0","bonus":145,"secondary":false,"pixels":[0,7,153,0,8,187,0,9,170,1,5,221,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,238,2,4,187,2,11,170,2,12,204,3,4,187,3,12,204,4,4,221,4,12,187,5,5,255,5,6,255,5,7,204,5,8,187,5,9,187,5,10,238,5,11,238,6,6,187,6,7,238,6,8,255,6,9,221,6,10,170]},{"width":7,"chr":"1","bonus":95,"secondary":false,"pixels":[1,5,153,2,5,255,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,187,2,12,238,3,4,204,3,5,255,3,6,255,3,7,255,3,8,255,3,9,255,3,10,255,3,11,255,3,12,255,4,12,153]},{"width":9,"chr":"2","bonus":115,"secondary":false,"pixels":[1,4,170,1,5,204,1,12,255,2,4,204,2,11,221,2,12,255,3,4,204,3,10,204,3,12,255,4,4,221,4,9,238,4,12,255,5,4,153,5,5,255,5,6,255,5,7,255,5,8,255,5,12,255,6,5,153,6,6,221,6,7,170,6,11,187,6,12,204]},{"width":7,"chr":"3","bonus":105,"secondary":false,"pixels":[0,11,187,0,12,187,1,4,204,1,12,238,2,4,221,2,12,221,3,4,238,3,7,187,3,8,221,3,12,204,4,4,170,4,5,255,4,6,255,4,7,153,4,8,238,4,9,255,4,10,221,4,11,255,5,5,170,5,9,221,5,10,238]},{"width":9,"chr":"4","bonus":120,"secondary":false,"pixels":[1,9,204,1,10,255,2,8,204,2,10,255,3,7,187,3,10,255,4,5,170,4,6,238,4,7,153,4,8,153,4,9,170,4,10,255,4,11,153,4,12,221,5,4,204,5,5,255,5,6,255,5,7,255,5,8,255,5,9,255,5,10,255,5,11,255,5,12,255,6,10,255]},{"width":7,"chr":"5","bonus":110,"secondary":false,"pixels":[0,11,170,0,12,221,1,4,255,1,5,204,1,6,221,1,7,187,1,12,238,2,4,255,2,7,255,2,12,204,3,4,255,3,7,255,3,8,204,3,12,170,4,4,255,4,8,255,4,9,255,4,10,255,4,11,238,5,4,153,5,9,187,5,10,153]},{"width":7,"chr":"6","bonus":105,"secondary":false,"pixels":[0,8,187,0,9,255,0,10,238,1,6,170,1,7,255,1,8,221,1,9,187,1,10,204,1,11,255,2,5,187,2,6,153,2,12,221,3,8,221,3,12,204,4,8,204,4,9,238,4,10,187,4,11,221,5,9,221,5,10,255,5,11,153]},{"width":7,"chr":"7","bonus":90,"secondary":false,"pixels":[0,4,204,0,5,187,1,4,255,1,12,170,2,4,255,2,10,221,2,11,255,2,12,187,3,4,255,3,8,221,3,9,238,3,10,153,4,4,255,4,5,153,4,6,204,4,7,187,5,4,255,5,5,187]},{"width":8,"chr":"8","bonus":170,"secondary":false,"pixels":[0,10,153,1,5,204,1,6,238,1,9,238,1,10,255,1,11,255,2,4,170,2,5,153,2,6,170,2,7,255,2,8,204,2,12,221,3,4,187,3,7,204,3,8,187,3,12,204,4,4,204,4,7,153,4,8,255,4,12,204,5,4,204,5,5,187,5,6,187,5,7,187,5,8,187,5,9,255,5,10,170,5,11,204,5,12,153,6,5,238,6,6,204,6,9,187,6,10,255,6,11,170]},{"width":7,"chr":"9","bonus":105,"secondary":false,"pixels":[0,6,238,0,7,238,0,8,153,1,5,204,1,6,153,1,7,187,1,8,255,2,4,204,2,9,187,3,4,221,3,11,187,4,5,255,4,6,238,4,7,187,4,8,187,4,9,238,4,10,255,5,6,221,5,7,255,5,8,238,5,9,170]},{"width":3,"chr":":","bonus":20,"secondary":true,"pixels":[0,5,170,0,6,204,0,10,204,0,11,170]},{"width":3,"chr":";","bonus":25,"secondary":true,"pixels":[0,4,170,0,5,204,0,9,221,0,11,153,1,9,170]},{"width":8,"chr":"<","bonus":55,"secondary":false,"pixels":[1,8,255,1,9,187,2,8,170,2,9,238,3,7,238,4,7,187,4,10,238,5,6,204,5,10,187,6,6,221,6,11,204]},{"width":8,"chr":"=","bonus":60,"secondary":false,"pixels":[1,7,255,1,9,255,2,7,255,2,9,255,3,7,255,3,9,255,4,7,255,4,9,255,5,7,255,5,9,255,6,7,255,6,9,255]},{"width":8,"chr":">","bonus":55,"secondary":false,"pixels":[1,6,238,1,11,170,2,6,170,2,10,221,3,7,238,3,10,204,4,7,204,4,9,187,5,8,221,5,9,238,6,8,221]},{"width":7,"chr":"?","bonus":80,"secondary":false,"pixels":[1,3,170,1,4,153,2,3,221,2,9,238,2,12,153,3,3,238,3,7,170,3,8,221,3,12,204,4,3,204,4,4,238,4,5,221,4,6,255,4,7,187,5,4,221,5,5,238]},{"width":11,"chr":"@","bonus":185,"secondary":false,"pixels":[0,7,187,0,8,238,0,9,255,0,10,187,1,5,153,1,6,170,1,11,238,2,12,170,3,7,221,3,8,255,3,9,255,3,10,238,3,12,204,4,3,153,4,6,170,4,12,187,5,3,153,5,5,170,5,8,170,5,9,204,5,12,170,6,3,170,6,5,187,6,6,238,6,7,255,6,8,255,6,9,255,6,10,238,6,12,153,7,3,170,7,10,204,8,4,187,8,9,170,9,5,204,9,6,221,9,7,221,9,8,170]},{"width":10,"chr":"A","bonus":125,"secondary":false,"pixels":[1,12,238,2,9,187,2,10,238,2,11,170,2,12,187,3,7,221,3,8,204,3,9,238,4,5,238,4,6,238,4,9,221,5,5,187,5,6,255,5,7,255,5,8,187,5,9,238,6,7,153,6,8,255,6,9,255,6,10,238,6,11,153,7,10,221,7,11,255,7,12,255,8,12,221]},{"width":8,"chr":"B","bonus":160,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,238,2,9,187,2,10,187,2,11,187,2,12,255,3,4,204,3,8,204,3,12,204,4,4,221,4,5,187,4,7,187,4,8,255,4,12,204,5,5,238,5,6,238,5,9,255,5,10,255,5,11,255,6,10,187]},{"width":9,"chr":"C","bonus":120,"secondary":false,"pixels":[0,7,221,0,8,255,0,9,221,1,5,221,1,6,255,1,7,238,1,8,221,1,9,255,1,10,255,1,11,204,2,5,187,2,11,255,3,4,204,3,12,204,4,4,221,4,12,238,5,4,221,5,12,221,6,4,221,6,12,238,7,4,187,7,5,204,7,11,187,7,12,170]},{"width":11,"chr":"D","bonus":200,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,204,2,12,255,3,4,221,3,12,238,4,4,238,4,12,221,5,4,238,5,12,221,6,4,204,6,5,153,6,12,187,7,5,255,7,6,153,7,11,238,8,5,204,8,6,255,8,7,255,8,8,255,8,9,255,8,10,255,8,11,170,9,7,204,9,8,221,9,9,187]},{"width":7,"chr":"E","bonus":135,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,255,2,9,187,2,10,187,2,11,204,2,12,255,3,4,221,3,8,221,3,12,238,4,4,238,4,8,221,4,12,221,5,4,187,5,8,153,5,12,238]},{"width":7,"chr":"F","bonus":115,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,255,2,9,187,2,10,187,2,11,187,2,12,238,3,4,221,3,8,221,4,4,238,4,8,221,5,4,221]},{"width":10,"chr":"G","bonus":150,"secondary":false,"pixels":[0,7,204,0,8,255,0,9,255,0,10,187,1,5,187,1,6,255,1,7,238,1,8,221,1,9,238,1,10,255,1,11,221,2,5,204,2,11,238,3,4,204,3,12,204,4,4,221,4,12,238,5,4,238,5,12,221,6,4,221,6,9,238,6,10,187,6,11,187,6,12,221,7,4,170,7,5,221,7,9,255,7,10,255,7,11,255,7,12,153]},{"width":11,"chr":"H","bonus":200,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,255,2,9,187,2,10,187,2,11,187,2,12,238,3,8,221,4,8,221,5,8,221,6,8,221,7,4,255,7,5,255,7,6,255,7,7,255,7,8,255,7,9,255,7,10,255,7,11,255,7,12,255,8,4,238,8,5,187,8,6,187,8,7,187,8,8,187,8,9,187,8,10,187,8,11,187,8,12,238]},{"width":5,"chr":"I","bonus":90,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,187,2,12,238]},{"width":6,"chr":"J","bonus":100,"secondary":false,"pixels":[2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,2,11,255,2,12,255,2,13,255,2,14,187,3,4,238,3,5,187,3,6,187,3,7,187,3,8,187,3,9,187,3,10,187,3,11,187,3,12,187]},{"width":10,"chr":"K","bonus":170,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,255,2,9,204,2,10,187,2,11,187,2,12,238,3,7,170,3,8,255,3,9,221,4,6,204,4,9,238,4,10,238,5,4,153,5,5,238,5,10,238,5,11,238,6,4,255,6,11,238,6,12,187,7,4,153,7,12,255,8,12,153]},{"width":8,"chr":"L","bonus":105,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,204,2,12,255,3,12,238,4,12,221,5,12,255]},{"width":13,"chr":"M","bonus":190,"secondary":false,"pixels":[1,9,170,1,10,204,1,11,238,1,12,255,2,4,187,2,5,255,2,6,255,2,7,238,2,8,153,2,12,153,3,6,238,3,7,255,3,8,238,4,8,238,4,9,255,4,10,238,5,10,238,5,11,255,5,12,187,6,9,153,6,10,238,7,7,153,7,8,238,8,5,170,8,6,255,8,7,238,9,4,153,9,5,204,9,6,255,9,7,255,9,8,255,9,9,255,9,10,255,9,11,255,9,12,238,10,10,153,10,11,187,10,12,255]},{"width":11,"chr":"N","bonus":170,"secondary":false,"pixels":[0,12,170,1,4,187,1,5,255,1,6,255,1,7,238,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,5,204,2,6,255,2,12,153,3,6,221,3,7,255,4,7,238,4,8,255,5,8,238,5,9,255,6,9,238,6,10,238,7,4,153,7,10,255,7,11,238,8,4,255,8,5,255,8,6,255,8,7,255,8,8,255,8,9,255,8,10,255,8,11,255,8,12,204,9,4,153]},{"width":10,"chr":"O","bonus":160,"secondary":false,"pixels":[0,7,221,0,8,255,0,9,221,1,5,204,1,6,255,1,7,221,1,8,221,1,9,255,1,10,255,1,11,221,2,5,170,2,11,238,3,4,221,3,12,221,4,4,221,4,12,221,5,4,238,5,12,204,6,4,153,6,5,238,6,11,170,7,5,238,7,6,255,7,7,255,7,8,221,7,9,238,7,10,255,7,11,187,8,6,153,8,7,238,8,8,255,8,9,204]},{"width":8,"chr":"P","bonus":130,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,187,2,12,238,3,4,204,4,4,238,5,4,170,5,5,255,5,6,255,5,7,255,5,8,204,6,6,187]},{"width":10,"chr":"Q","bonus":200,"secondary":false,"pixels":[0,7,221,0,8,255,0,9,221,1,5,187,1,6,255,1,7,238,1,8,221,1,9,255,1,10,255,1,11,221,2,5,170,2,11,238,2,12,153,3,4,221,3,12,221,4,4,221,4,12,238,5,4,238,5,12,204,6,4,153,6,5,238,6,11,153,6,12,238,7,5,221,7,6,255,7,7,255,7,8,221,7,9,238,7,10,255,7,11,170,7,12,204,7,13,221,8,6,153,8,7,238,8,8,255,8,9,221,8,13,255,8,14,170,9,13,170,9,14,255]},{"width":10,"chr":"R","bonus":175,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,187,2,9,255,2,10,187,2,11,187,2,12,238,3,4,221,3,9,221,4,4,238,4,9,255,4,10,170,5,4,153,5,5,255,5,6,255,5,7,255,5,8,187,5,10,255,5,11,187,6,6,187,6,11,238,6,12,170,7,12,255,8,12,153]},{"width":7,"chr":"S","bonus":95,"secondary":false,"pixels":[0,11,221,0,12,187,1,5,255,1,6,255,1,7,255,1,12,238,2,4,187,2,7,255,2,8,238,2,12,221,3,4,187,3,8,255,3,9,187,3,12,221,4,4,221,4,8,187,4,9,255,4,10,255,4,11,255]},{"width":10,"chr":"T","bonus":125,"secondary":false,"pixels":[0,4,187,1,4,221,2,4,221,3,4,255,3,5,187,3,6,187,3,7,187,3,8,187,3,9,187,3,10,187,3,11,187,3,12,238,4,4,255,4,5,255,4,6,255,4,7,255,4,8,255,4,9,255,4,10,255,4,11,255,4,12,255,5,4,221,5,12,153,6,4,221,7,4,255]},{"width":11,"chr":"U","bonus":145,"secondary":false,"pixels":[1,4,238,1,5,187,1,6,187,1,7,187,1,8,187,1,9,187,1,10,153,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,2,11,255,3,11,170,3,12,204,4,12,238,5,12,221,6,12,204,7,4,187,7,11,221,8,4,255,8,5,255,8,6,255,8,7,255,8,8,255,8,9,238,8,10,204]},{"width":11,"chr":"V","bonus":120,"secondary":false,"pixels":[1,4,204,2,4,255,2,5,255,2,6,204,3,4,187,3,5,170,3,6,255,3,7,255,3,8,238,3,9,153,4,8,204,4,9,255,4,10,255,4,11,187,5,10,238,5,11,255,6,8,204,6,9,221,7,4,170,7,5,153,7,6,238,7,7,187,8,4,255,8,5,170]},{"width":14,"chr":"W","bonus":200,"secondary":false,"pixels":[1,4,255,1,5,221,2,4,238,2,5,255,2,6,255,2,7,255,2,8,221,3,7,153,3,8,221,3,9,255,3,10,255,3,11,221,4,9,153,4,10,255,4,11,204,5,7,170,5,8,238,5,9,153,6,5,238,6,6,255,6,7,153,7,5,187,7,6,255,7,7,255,7,8,204,8,8,238,8,9,255,8,10,238,8,11,153,9,9,153,9,10,255,9,11,255,9,12,170,10,7,170,10,8,238,10,9,187,11,4,238,11,5,255,11,6,187,12,4,170]},{"width":10,"chr":"X","bonus":135,"secondary":false,"pixels":[1,4,221,1,12,238,2,4,255,2,5,255,2,10,170,2,11,221,2,12,187,3,4,153,3,5,187,3,6,255,3,7,238,3,9,221,4,7,255,4,8,255,4,9,204,5,6,204,5,7,153,5,9,255,5,10,255,5,11,153,6,4,221,6,5,238,6,10,204,6,11,255,6,12,255,7,4,204,7,12,238]},{"width":9,"chr":"Y","bonus":115,"secondary":false,"pixels":[0,5,187,1,5,255,1,6,221,2,5,170,2,6,238,2,7,255,2,8,170,3,8,255,3,9,255,3,10,187,3,11,187,3,12,187,3,13,238,4,9,255,4,10,255,4,11,255,4,12,255,4,13,255,5,7,187,5,8,204,6,5,238,6,6,238,7,5,204]},{"width":9,"chr":"Z","bonus":145,"secondary":false,"pixels":[1,5,187,1,6,153,1,13,255,2,5,238,2,11,221,2,12,255,2,13,255,3,5,221,3,9,153,3,10,255,3,11,238,3,13,255,4,5,221,4,8,238,4,9,255,4,10,187,4,13,255,5,5,238,5,6,187,5,7,255,5,8,238,5,13,255,6,5,255,6,6,255,6,7,153,6,13,255,7,5,204,7,12,187,7,13,187]},{"width":5,"chr":"[","bonus":70,"secondary":false,"pixels":[1,3,187,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,1,13,255,1,14,187,2,3,153,2,14,153]},{"width":8,"chr":"\\","bonus":50,"secondary":false,"pixels":[0,4,170,1,5,204,1,6,170,2,7,238,3,8,170,3,9,204,4,10,221,4,11,153,5,12,238,6,13,187]},{"width":4,"chr":"]","bonus":70,"secondary":false,"pixels":[1,3,170,1,14,170,2,3,187,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,2,11,255,2,12,255,2,13,255,2,14,187]},{"width":7,"chr":"^","bonus":55,"secondary":false,"pixels":[0,9,238,1,6,170,1,7,238,1,8,153,2,4,204,2,5,221,3,4,187,3,5,238,4,7,238,4,8,187,5,9,204]},{"width":8,"chr":"_","bonus":35,"secondary":false,"pixels":[0,14,221,1,14,221,2,14,221,3,14,221,4,14,221,5,14,221,6,14,153]},{"width":10,"chr":"a","bonus":125,"secondary":false,"pixels":[1,12,238,2,9,187,2,10,238,2,11,170,2,12,187,3,7,221,3,8,204,3,9,238,4,5,238,4,6,238,4,9,221,5,5,187,5,6,255,5,7,255,5,8,187,5,9,238,6,7,153,6,8,255,6,9,255,6,10,238,6,11,153,7,10,221,7,11,255,7,12,255,8,12,221]},{"width":8,"chr":"b","bonus":160,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,238,2,9,187,2,10,187,2,11,187,2,12,255,3,4,204,3,8,204,3,12,204,4,4,221,4,5,187,4,7,187,4,8,255,4,12,204,5,5,238,5,6,238,5,9,255,5,10,255,5,11,255,6,10,187]},{"width":9,"chr":"c","bonus":120,"secondary":false,"pixels":[0,7,221,0,8,255,0,9,221,1,5,221,1,6,255,1,7,238,1,8,221,1,9,255,1,10,255,1,11,204,2,5,187,2,11,255,3,4,204,3,12,204,4,4,221,4,12,238,5,4,221,5,12,221,6,4,221,6,12,238,7,4,187,7,5,204,7,11,187,7,12,170]},{"width":11,"chr":"d","bonus":200,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,204,2,12,255,3,4,221,3,12,238,4,4,238,4,12,221,5,4,238,5,12,221,6,4,204,6,5,153,6,12,187,7,5,255,7,6,153,7,11,238,8,5,204,8,6,255,8,7,255,8,8,255,8,9,255,8,10,255,8,11,170,9,7,204,9,8,221,9,9,187]},{"width":7,"chr":"e","bonus":135,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,255,2,9,187,2,10,187,2,11,204,2,12,255,3,4,221,3,8,221,3,12,238,4,4,238,4,8,221,4,12,221,5,4,187,5,8,153,5,12,238]},{"width":7,"chr":"f","bonus":115,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,255,2,9,187,2,10,187,2,11,187,2,12,238,3,4,221,3,8,221,4,4,238,4,8,221,5,4,221]},{"width":10,"chr":"g","bonus":150,"secondary":false,"pixels":[0,7,204,0,8,255,0,9,255,0,10,187,1,5,187,1,6,255,1,7,238,1,8,221,1,9,238,1,10,255,1,11,221,2,5,204,2,11,238,3,4,204,3,12,204,4,4,221,4,12,238,5,4,238,5,12,221,6,4,221,6,9,238,6,10,187,6,11,187,6,12,221,7,4,170,7,5,221,7,9,255,7,10,255,7,11,255,7,12,153]},{"width":11,"chr":"h","bonus":200,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,255,2,9,187,2,10,187,2,11,187,2,12,238,3,8,221,4,8,221,5,8,221,6,8,221,7,4,255,7,5,255,7,6,255,7,7,255,7,8,255,7,9,255,7,10,255,7,11,255,7,12,255,8,4,238,8,5,187,8,6,187,8,7,187,8,8,187,8,9,187,8,10,187,8,11,187,8,12,238]},{"width":5,"chr":"i","bonus":90,"secondary":false,"pixels":[1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,1,13,255,2,5,238,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,187,2,12,187,2,13,238]},{"width":6,"chr":"j","bonus":100,"secondary":false,"pixels":[2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,2,11,255,2,12,255,2,13,255,2,14,187,3,4,238,3,5,187,3,6,187,3,7,187,3,8,187,3,9,187,3,10,187,3,11,187,3,12,187]},{"width":10,"chr":"k","bonus":170,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,255,2,9,204,2,10,187,2,11,187,2,12,238,3,7,170,3,8,255,3,9,221,4,6,204,4,9,238,4,10,238,5,4,153,5,5,238,5,10,238,5,11,238,6,4,255,6,11,238,6,12,187,7,4,153,7,12,255,8,12,153]},{"width":8,"chr":"l","bonus":105,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,204,2,12,255,3,12,238,4,12,221,5,12,255]},{"width":13,"chr":"m","bonus":190,"secondary":false,"pixels":[1,9,170,1,10,204,1,11,238,1,12,255,2,4,187,2,5,255,2,6,255,2,7,238,2,8,153,2,12,153,3,6,238,3,7,255,3,8,238,4,8,238,4,9,255,4,10,238,5,10,238,5,11,255,5,12,187,6,9,153,6,10,238,7,7,153,7,8,238,8,5,170,8,6,255,8,7,238,9,4,153,9,5,204,9,6,255,9,7,255,9,8,255,9,9,255,9,10,255,9,11,255,9,12,238,10,10,153,10,11,187,10,12,255]},{"width":11,"chr":"n","bonus":170,"secondary":false,"pixels":[0,12,170,1,4,187,1,5,255,1,6,255,1,7,238,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,5,204,2,6,255,2,12,153,3,6,221,3,7,255,4,7,238,4,8,255,5,8,238,5,9,255,6,9,238,6,10,238,7,4,153,7,10,255,7,11,238,8,4,255,8,5,255,8,6,255,8,7,255,8,8,255,8,9,255,8,10,255,8,11,255,8,12,204,9,4,153]},{"width":10,"chr":"o","bonus":160,"secondary":false,"pixels":[0,7,221,0,8,255,0,9,221,1,5,204,1,6,255,1,7,221,1,8,221,1,9,255,1,10,255,1,11,221,2,5,170,2,11,238,3,4,221,3,12,221,4,4,221,4,12,221,5,4,238,5,12,204,6,4,153,6,5,238,6,11,170,7,5,238,7,6,255,7,7,255,7,8,221,7,9,238,7,10,255,7,11,187,8,6,153,8,7,238,8,8,255,8,9,204]},{"width":8,"chr":"p","bonus":130,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,238,2,5,187,2,6,187,2,7,187,2,8,187,2,9,187,2,10,187,2,11,187,2,12,238,3,4,204,4,4,238,5,4,170,5,5,255,5,6,255,5,7,255,5,8,204,6,6,187]},{"width":10,"chr":"q","bonus":200,"secondary":false,"pixels":[0,7,221,0,8,255,0,9,221,1,5,187,1,6,255,1,7,238,1,8,221,1,9,255,1,10,255,1,11,221,2,5,170,2,11,238,2,12,153,3,4,221,3,12,221,4,4,221,4,12,238,5,4,238,5,12,204,6,4,153,6,5,238,6,11,153,6,12,238,7,5,221,7,6,255,7,7,255,7,8,221,7,9,238,7,10,255,7,11,170,7,12,204,7,13,221,8,6,153,8,7,238,8,8,255,8,9,221,8,13,255,8,14,170,9,13,170,9,14,255]},{"width":10,"chr":"r","bonus":175,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255,2,4,255,2,5,187,2,6,187,2,7,187,2,8,187,2,9,255,2,10,187,2,11,187,2,12,238,3,4,221,3,9,221,4,4,238,4,9,255,4,10,170,5,4,153,5,5,255,5,6,255,5,7,255,5,8,187,5,10,255,5,11,187,6,6,187,6,11,238,6,12,170,7,12,255,8,12,153]},{"width":7,"chr":"s","bonus":95,"secondary":false,"pixels":[0,11,221,0,12,187,1,5,255,1,6,255,1,7,255,1,12,238,2,4,187,2,7,255,2,8,238,2,12,221,3,4,187,3,8,255,3,9,187,3,12,221,4,4,221,4,8,187,4,9,255,4,10,255,4,11,255]},{"width":10,"chr":"t","bonus":125,"secondary":false,"pixels":[0,4,187,1,4,221,2,4,221,3,4,255,3,5,187,3,6,187,3,7,187,3,8,187,3,9,187,3,10,187,3,11,187,3,12,238,4,4,255,4,5,255,4,6,255,4,7,255,4,8,255,4,9,255,4,10,255,4,11,255,4,12,255,5,4,221,5,12,153,6,4,221,7,4,255]},{"width":11,"chr":"u","bonus":145,"secondary":false,"pixels":[1,4,238,1,5,187,1,6,187,1,7,187,1,8,187,1,9,187,1,10,153,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,2,9,255,2,10,255,2,11,255,3,11,170,3,12,204,4,12,238,5,12,221,6,12,204,7,4,187,7,11,221,8,4,255,8,5,255,8,6,255,8,7,255,8,8,255,8,9,238,8,10,204]},{"width":11,"chr":"v","bonus":120,"secondary":false,"pixels":[1,4,204,2,4,255,2,5,255,2,6,204,3,4,187,3,5,170,3,6,255,3,7,255,3,8,238,3,9,153,4,8,204,4,9,255,4,10,255,4,11,187,5,10,238,5,11,255,6,8,204,6,9,221,7,4,170,7,5,153,7,6,238,7,7,187,8,4,255,8,5,170]},{"width":14,"chr":"w","bonus":200,"secondary":false,"pixels":[1,4,255,1,5,221,2,4,238,2,5,255,2,6,255,2,7,255,2,8,221,3,7,153,3,8,221,3,9,255,3,10,255,3,11,221,4,9,153,4,10,255,4,11,204,5,7,170,5,8,238,5,9,153,6,5,238,6,6,255,6,7,153,7,5,187,7,6,255,7,7,255,7,8,204,8,8,238,8,9,255,8,10,238,8,11,153,9,9,153,9,10,255,9,11,255,9,12,170,10,7,170,10,8,238,10,9,187,11,4,238,11,5,255,11,6,187,12,4,170]},{"width":10,"chr":"x","bonus":135,"secondary":false,"pixels":[1,4,221,1,12,238,2,4,255,2,5,255,2,10,170,2,11,221,2,12,187,3,4,153,3,5,187,3,6,255,3,7,238,3,9,221,4,7,255,4,8,255,4,9,204,5,6,204,5,7,153,5,9,255,5,10,255,5,11,153,6,4,221,6,5,238,6,10,204,6,11,255,6,12,255,7,4,204,7,12,238]},{"width":9,"chr":"y","bonus":115,"secondary":false,"pixels":[0,4,187,1,4,255,1,5,221,2,4,170,2,5,238,2,6,255,2,7,170,3,7,255,3,8,255,3,9,187,3,10,187,3,11,187,3,12,238,4,8,255,4,9,255,4,10,255,4,11,255,4,12,255,5,6,187,5,7,204,6,4,238,6,5,238,7,4,204]},{"width":9,"chr":"z","bonus":145,"secondary":false,"pixels":[1,4,187,1,5,153,1,12,255,2,4,238,2,10,221,2,11,255,2,12,255,3,4,221,3,8,153,3,9,255,3,10,238,3,12,255,4,4,221,4,7,238,4,8,255,4,9,187,4,12,255,5,4,238,5,5,187,5,6,255,5,7,238,5,12,255,6,4,255,6,5,255,6,6,153,6,12,255,7,4,204,7,11,187,7,12,187]},{"width":5,"chr":"{","bonus":55,"secondary":false,"pixels":[1,8,204,2,4,255,2,5,255,2,6,255,2,7,187,2,9,238,2,10,255,2,11,255,2,12,255,2,13,187,3,3,170]},{"width":3,"chr":"|","bonus":65,"secondary":true,"pixels":[1,0,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,1,11,255,1,12,255]},{"width":6,"chr":"}","bonus":55,"secondary":false,"pixels":[1,3,170,2,4,255,2,5,255,2,6,255,2,7,187,2,9,238,2,10,255,2,11,255,2,12,255,2,13,187,3,8,204]},{"width":7,"chr":"~","bonus":35,"secondary":false,"pixels":[0,9,255,1,8,255,2,8,187,3,9,238,4,10,255,5,8,255,5,9,221]}],"width":14,"spacewidth":5,"shadow":false,"height":15,"basey":12};

/***/ }),

/***/ "./imgs/complete.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("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")

/***/ }),

/***/ "./imgs/completelegacy.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("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")

/***/ }),

/***/ "./index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__("@alt1/base");
var a1lib = __webpack_require__("@alt1/base");
var OCR = __webpack_require__("@alt1/ocr");
var font = __webpack_require__("../ocr/fonts/aa_9px_mono_allcaps.fontmeta.json");
var imgs = base_1.ImageDetect.webpackImages({
    complete: __webpack_require__("./imgs/complete.data.png"),
    completeLegacy: __webpack_require__("./imgs/completelegacy.data.png")
});
var ClueRewardReader = /** @class */ (function () {
    function ClueRewardReader() {
        this.pos = null;
    }
    ClueRewardReader.prototype.find = function (img) {
        if (!img) {
            img = a1lib.captureHoldFullRs();
        }
        if (!img) {
            return null;
        }
        var locs = [];
        var legacy = false;
        locs = img.findSubimage(imgs.complete);
        if (locs.length == 0) {
            legacy = true;
            locs = img.findSubimage(imgs.completeLegacy);
        }
        if (locs.length == 0) {
            return null;
        }
        var x = locs[0].x + (legacy ? -139 : -28);
        var y = locs[0].y + (legacy ? -13 : -13);
        var pos = new base_1.Rect(x, y, 402, 224);
        if (!base_1.Rect.fromArgs(img).contains(pos)) {
            return null;
        }
        this.pos = pos;
        return this.pos;
    };
    ClueRewardReader.prototype.read = function (img) {
        var buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height);
        var legacy = buf.getPixel(10, 2)[0] > 30;
        var hash = 0;
        for (var y = 50; y < 85; y++) {
            for (var x = 25; x < 375; x++) {
                if (legacy && buf.getColorDifference(x, y, 62, 53, 40) < 10) {
                    continue;
                }
                if (!legacy && buf.getColorDifference(x, y, 10, 31, 41) < 10) {
                    continue;
                }
                hash = (((hash << 5) - hash) + buf.getPixelInt(x, y)) | 0;
            }
        }
        var str = OCR.findReadLine(buf, font, [[255, 255, 255]], 134, 113);
        if (!str.text) {
            return null;
        }
        var text = str.text.toLowerCase();
        var m = text.match(/value[: ]+([\d,]+)\b/);
        if (!m) {
            return null;
        }
        var value = +m[1].replace(/,/g, "");
        return { hash: hash, value: value, text: text };
    };
    return ClueRewardReader;
}());
exports.default = ClueRewardReader;


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
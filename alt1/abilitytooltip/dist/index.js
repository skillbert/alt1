(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@alt1/base"), require("@alt1/ocr"));
	else if(typeof define === 'function' && define.amd)
		define(["@alt1/base", "@alt1/ocr"], factory);
	else if(typeof exports === 'object')
		exports["@alt1/abilitytooltip-reader"] = factory(require("@alt1/base"), require("@alt1/ocr"));
	else
		root["AbilityTooltipReader"] = factory(root["A1lib"], root["OCR"]);
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

/***/ "../ocr/fonts/pixel_8px_mono.fontmeta.json":
/***/ (function(module) {

module.exports = {"chars":[{"width":3,"chr":"!","bonus":35,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,8,255]},{"width":6,"chr":"\"","bonus":30,"secondary":true,"pixels":[1,0,255,1,1,255,2,2,255,3,0,255,3,1,255,4,2,255]},{"width":9,"chr":"#","bonus":120,"secondary":false,"pixels":[1,6,255,2,3,255,2,6,255,2,7,255,2,8,255,3,3,255,3,4,255,3,5,255,3,6,255,4,1,255,4,2,255,4,3,255,4,6,255,4,7,255,4,8,255,5,3,255,5,4,255,5,5,255,5,6,255,6,1,255,6,2,255,6,3,255,6,6,255,7,3,255]},{"width":7,"chr":"$","bonus":115,"secondary":false,"pixels":[1,3,255,1,4,255,1,8,255,2,2,255,2,5,255,2,8,255,3,0,255,3,1,255,3,2,255,3,3,255,3,4,255,3,5,255,3,6,255,3,7,255,3,8,255,3,9,255,3,10,255,4,2,255,4,5,255,4,8,255,5,2,255,5,6,255,5,7,255]},{"width":12,"chr":"%","bonus":120,"secondary":false,"pixels":[1,2,255,1,3,255,2,1,255,2,4,255,3,1,255,3,4,255,4,2,255,4,3,255,4,7,255,4,8,255,5,5,255,5,6,255,6,3,255,6,4,255,7,1,255,7,2,255,7,6,255,7,7,255,8,5,255,8,8,255,9,5,255,9,8,255,10,6,255,10,7,255]},{"width":9,"chr":"&","bonus":105,"secondary":false,"pixels":[1,2,255,1,3,255,1,5,255,1,6,255,1,7,255,2,1,255,2,4,255,2,8,255,3,1,255,3,4,255,3,8,255,4,2,255,4,3,255,4,5,255,4,8,255,5,6,255,5,7,255,6,4,255,6,5,255,6,7,255,7,8,255]},{"width":3,"chr":"'","bonus":10,"secondary":true,"pixels":[2,0,255,2,1,255]},{"width":5,"chr":"(","bonus":55,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,2,1,255,2,2,255,2,8,255,2,9,255,3,0,255,3,10,255]},{"width":5,"chr":")","bonus":55,"secondary":false,"pixels":[1,0,255,1,10,255,2,1,255,2,2,255,2,8,255,2,9,255,3,3,255,3,4,255,3,5,255,3,6,255,3,7,255]},{"width":7,"chr":"*","bonus":55,"secondary":false,"pixels":[1,1,255,1,3,255,2,2,255,3,0,255,3,1,255,3,2,255,3,3,255,3,4,255,4,2,255,5,1,255,5,3,255]},{"width":9,"chr":"+","bonus":65,"secondary":false,"pixels":[1,3,255,2,3,255,3,3,255,4,0,255,4,1,255,4,2,255,4,3,255,4,4,255,4,5,255,4,6,255,5,3,255,6,3,255,7,3,255]},{"width":4,"chr":",","bonus":20,"secondary":true,"pixels":[1,10,255,2,7,255,2,8,255,2,9,255]},{"width":5,"chr":"-","bonus":15,"secondary":true,"pixels":[1,4,255,2,4,255,3,4,255]},{"width":3,"chr":".","bonus":10,"secondary":true,"pixels":[1,7,255,1,8,255]},{"width":7,"chr":"/","bonus":50,"secondary":false,"pixels":[1,8,255,1,9,255,2,6,255,2,7,255,3,4,255,3,5,255,4,2,255,4,3,255,5,0,255,5,1,255]},{"width":7,"chr":"0","bonus":90,"secondary":false,"pixels":[1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,2,1,255,2,8,255,3,1,255,3,8,255,4,1,255,4,8,255,5,2,255,5,3,255,5,4,255,5,5,255,5,6,255,5,7,255]},{"width":7,"chr":"1","bonus":70,"secondary":false,"pixels":[1,2,255,1,8,255,2,2,255,2,8,255,3,1,255,3,2,255,3,3,255,3,4,255,3,5,255,3,6,255,3,7,255,3,8,255,4,8,255,5,8,255]},{"width":7,"chr":"2","bonus":75,"secondary":false,"pixels":[1,2,255,1,7,255,1,8,255,2,1,255,2,6,255,2,8,255,3,1,255,3,5,255,3,8,255,4,1,255,4,4,255,4,8,255,5,2,255,5,3,255,5,8,255]},{"width":7,"chr":"3","bonus":75,"secondary":false,"pixels":[1,2,255,1,7,255,2,1,255,2,8,255,3,1,255,3,4,255,3,8,255,4,1,255,4,4,255,4,8,255,5,2,255,5,3,255,5,5,255,5,6,255,5,7,255]},{"width":8,"chr":"4","bonus":85,"secondary":false,"pixels":[1,5,255,1,6,255,2,4,255,2,6,255,3,3,255,3,6,255,4,2,255,4,6,255,5,1,255,5,2,255,5,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255,6,6,255]},{"width":7,"chr":"5","bonus":90,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,7,255,2,1,255,2,4,255,2,8,255,3,1,255,3,4,255,3,8,255,4,1,255,4,4,255,4,8,255,5,1,255,5,5,255,5,6,255,5,7,255]},{"width":7,"chr":"6","bonus":85,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,2,2,255,2,4,255,2,8,255,3,1,255,3,4,255,3,8,255,4,1,255,4,4,255,4,8,255,5,5,255,5,6,255,5,7,255]},{"width":7,"chr":"7","bonus":60,"secondary":false,"pixels":[1,1,255,2,1,255,2,7,255,2,8,255,3,1,255,3,5,255,3,6,255,4,1,255,4,3,255,4,4,255,5,1,255,5,2,255]},{"width":7,"chr":"8","bonus":95,"secondary":false,"pixels":[1,2,255,1,3,255,1,5,255,1,6,255,1,7,255,2,1,255,2,4,255,2,8,255,3,1,255,3,4,255,3,8,255,4,1,255,4,4,255,4,8,255,5,2,255,5,3,255,5,5,255,5,6,255,5,7,255]},{"width":7,"chr":"9","bonus":85,"secondary":false,"pixels":[1,2,255,1,3,255,1,4,255,2,1,255,2,5,255,2,8,255,3,1,255,3,5,255,3,8,255,4,1,255,4,5,255,4,7,255,5,2,255,5,3,255,5,4,255,5,5,255,5,6,255]},{"width":3,"chr":":","bonus":20,"secondary":true,"pixels":[1,0,255,1,1,255,1,4,255,1,5,255]},{"width":4,"chr":";","bonus":30,"secondary":true,"pixels":[1,7,255,2,0,255,2,1,255,2,4,255,2,5,255,2,6,255]},{"width":8,"chr":"<","bonus":50,"secondary":false,"pixels":[1,2,255,2,2,255,3,1,255,3,3,255,4,1,255,4,3,255,5,0,255,5,4,255,6,0,255,6,4,255]},{"width":9,"chr":"=","bonus":70,"secondary":false,"pixels":[1,0,255,1,2,255,2,0,255,2,2,255,3,0,255,3,2,255,4,0,255,4,2,255,5,0,255,5,2,255,6,0,255,6,2,255,7,0,255,7,2,255]},{"width":8,"chr":">","bonus":50,"secondary":false,"pixels":[1,0,255,1,4,255,2,0,255,2,4,255,3,1,255,3,3,255,4,1,255,4,3,255,5,2,255,6,2,255]},{"width":6,"chr":"?","bonus":45,"secondary":false,"pixels":[1,1,255,2,1,255,2,5,255,2,6,255,2,8,255,3,1,255,3,4,255,4,2,255,4,3,255]},{"width":10,"chr":"@","bonus":165,"secondary":false,"pixels":[1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,2,1,255,2,7,255,3,0,255,3,3,255,3,4,255,3,5,255,3,8,255,4,0,255,4,2,255,4,6,255,4,8,255,5,0,255,5,2,255,5,6,255,5,8,255,6,0,255,6,2,255,6,3,255,6,4,255,6,5,255,6,8,255,7,0,255,7,6,255,8,1,255,8,2,255,8,3,255,8,4,255,8,5,255]},{"width":8,"chr":"A","bonus":100,"secondary":false,"pixels":[1,6,255,1,7,255,1,8,255,2,3,255,2,4,255,2,5,255,2,6,255,3,1,255,3,2,255,3,6,255,4,1,255,4,2,255,4,6,255,5,3,255,5,4,255,5,5,255,5,6,255,6,6,255,6,7,255,6,8,255]},{"width":8,"chr":"B","bonus":120,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,4,255,2,8,255,3,1,255,3,4,255,3,8,255,4,1,255,4,4,255,4,8,255,5,2,255,5,3,255,5,4,255,5,8,255,6,5,255,6,6,255,6,7,255]},{"width":9,"chr":"C","bonus":80,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,2,2,255,2,7,255,3,1,255,3,8,255,4,1,255,4,8,255,5,1,255,5,8,255,6,1,255,6,8,255,7,2,255,7,7,255]},{"width":9,"chr":"D","bonus":110,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,8,255,3,1,255,3,8,255,4,1,255,4,8,255,5,1,255,5,8,255,6,2,255,6,7,255,7,3,255,7,4,255,7,5,255,7,6,255]},{"width":7,"chr":"E","bonus":100,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,4,255,2,8,255,3,1,255,3,4,255,3,8,255,4,1,255,4,4,255,4,8,255,5,1,255,5,4,255,5,8,255]},{"width":7,"chr":"F","bonus":75,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,4,255,3,1,255,3,4,255,4,1,255,4,4,255,5,1,255]},{"width":9,"chr":"G","bonus":100,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,2,2,255,2,7,255,3,1,255,3,8,255,4,1,255,4,8,255,5,1,255,5,5,255,5,8,255,6,1,255,6,5,255,6,8,255,7,2,255,7,5,255,7,6,255,7,7,255]},{"width":8,"chr":"H","bonus":100,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,4,255,3,4,255,4,4,255,5,4,255,6,1,255,6,2,255,6,3,255,6,4,255,6,5,255,6,6,255,6,7,255,6,8,255]},{"width":5,"chr":"I","bonus":60,"secondary":false,"pixels":[1,1,255,1,8,255,2,1,255,2,2,255,2,3,255,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,3,1,255,3,8,255]},{"width":6,"chr":"J","bonus":60,"secondary":false,"pixels":[1,8,255,2,1,255,2,8,255,3,1,255,3,8,255,4,1,255,4,2,255,4,3,255,4,4,255,4,5,255,4,6,255,4,7,255]},{"width":8,"chr":"K","bonus":85,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,5,255,3,4,255,3,5,255,4,3,255,4,6,255,5,2,255,5,7,255,6,1,255,6,8,255]},{"width":7,"chr":"L","bonus":60,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,8,255,3,8,255,4,8,255,5,8,255]},{"width":9,"chr":"M","bonus":130,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,2,255,3,3,255,3,4,255,4,5,255,4,6,255,5,3,255,5,4,255,6,1,255,6,2,255,7,1,255,7,2,255,7,3,255,7,4,255,7,5,255,7,6,255,7,7,255,7,8,255]},{"width":8,"chr":"N","bonus":120,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,2,255,3,3,255,3,4,255,4,5,255,4,6,255,5,7,255,5,8,255,6,1,255,6,2,255,6,3,255,6,4,255,6,5,255,6,6,255,6,7,255,6,8,255]},{"width":9,"chr":"O","bonus":90,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,2,2,255,2,7,255,3,1,255,3,8,255,4,1,255,4,8,255,5,1,255,5,8,255,6,2,255,6,7,255,7,3,255,7,4,255,7,5,255,7,6,255]},{"width":7,"chr":"P","bonus":85,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,5,255,3,1,255,3,5,255,4,1,255,4,5,255,5,2,255,5,3,255,5,4,255]},{"width":9,"chr":"Q","bonus":105,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,2,2,255,2,7,255,3,1,255,3,8,255,4,1,255,4,8,255,5,1,255,5,8,255,5,9,255,6,2,255,6,7,255,6,10,255,7,3,255,7,4,255,7,5,255,7,6,255,7,10,255]},{"width":8,"chr":"R","bonus":100,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,1,255,2,5,255,3,1,255,3,5,255,4,1,255,4,5,255,4,6,255,5,2,255,5,3,255,5,4,255,5,7,255,6,8,255]},{"width":8,"chr":"S","bonus":90,"secondary":false,"pixels":[1,2,255,1,3,255,1,7,255,2,1,255,2,4,255,2,8,255,3,1,255,3,4,255,3,8,255,4,1,255,4,5,255,4,8,255,5,1,255,5,5,255,5,8,255,6,2,255,6,6,255,6,7,255]},{"width":9,"chr":"T","bonus":70,"secondary":false,"pixels":[1,1,255,2,1,255,3,1,255,4,1,255,4,2,255,4,3,255,4,4,255,4,5,255,4,6,255,4,7,255,4,8,255,5,1,255,6,1,255,7,1,255]},{"width":8,"chr":"U","bonus":90,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,2,8,255,3,8,255,4,8,255,5,8,255,6,1,255,6,2,255,6,3,255,6,4,255,6,5,255,6,6,255,6,7,255]},{"width":8,"chr":"V","bonus":80,"secondary":false,"pixels":[1,1,255,1,2,255,1,3,255,2,4,255,2,5,255,2,6,255,3,7,255,3,8,255,4,7,255,4,8,255,5,4,255,5,5,255,5,6,255,6,1,255,6,2,255,6,3,255]},{"width":11,"chr":"W","bonus":130,"secondary":false,"pixels":[1,1,255,1,2,255,2,3,255,2,4,255,2,5,255,2,6,255,3,7,255,3,8,255,4,3,255,4,4,255,4,5,255,4,6,255,5,1,255,5,2,255,6,3,255,6,4,255,6,5,255,6,6,255,7,7,255,7,8,255,8,3,255,8,4,255,8,5,255,8,6,255,9,1,255,9,2,255]},{"width":8,"chr":"X","bonus":80,"secondary":false,"pixels":[1,1,255,1,2,255,1,7,255,1,8,255,2,3,255,2,6,255,3,4,255,3,5,255,4,4,255,4,5,255,5,3,255,5,6,255,6,1,255,6,2,255,6,7,255,6,8,255]},{"width":9,"chr":"Y","bonus":55,"secondary":false,"pixels":[1,1,255,2,2,255,3,3,255,4,4,255,4,5,255,4,6,255,4,7,255,4,8,255,5,3,255,6,2,255,7,1,255]},{"width":8,"chr":"Z","bonus":90,"secondary":false,"pixels":[1,1,255,1,7,255,1,8,255,2,1,255,2,6,255,2,8,255,3,1,255,3,5,255,3,8,255,4,1,255,4,4,255,4,8,255,5,1,255,5,3,255,5,8,255,6,1,255,6,2,255,6,8,255]},{"width":5,"chr":"[","bonus":75,"secondary":false,"pixels":[1,0,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,0,255,2,10,255,3,0,255,3,10,255]},{"width":7,"chr":"\\","bonus":50,"secondary":false,"pixels":[1,0,255,1,1,255,2,2,255,2,3,255,3,4,255,3,5,255,4,6,255,4,7,255,5,8,255,5,9,255]},{"width":5,"chr":"]","bonus":65,"secondary":false,"pixels":[1,0,255,2,0,255,3,0,255,3,1,255,3,2,255,3,3,255,3,4,255,3,5,255,3,6,255,3,7,255,3,8,255,3,9,255,3,10,255]},{"width":9,"chr":"^","bonus":35,"secondary":false,"pixels":[1,3,255,2,2,255,3,1,255,4,0,255,5,1,255,6,2,255,7,3,255]},{"width":9,"chr":"_","bonus":35,"secondary":false,"pixels":[1,8,255,2,8,255,3,8,255,4,8,255,5,8,255,6,8,255,7,8,255]},{"width":7,"chr":"a","bonus":80,"secondary":false,"pixels":[1,6,255,1,7,255,2,3,255,2,5,255,2,8,255,3,3,255,3,5,255,3,8,255,4,3,255,4,5,255,4,8,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255]},{"width":7,"chr":"b","bonus":95,"secondary":false,"pixels":[1,0,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,3,255,2,8,255,3,3,255,3,8,255,4,3,255,4,8,255,5,4,255,5,5,255,5,6,255,5,7,255]},{"width":7,"chr":"c","bonus":60,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,2,3,255,2,8,255,3,3,255,3,8,255,4,3,255,4,8,255,5,4,255,5,7,255]},{"width":7,"chr":"d","bonus":95,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,2,3,255,2,8,255,3,3,255,3,8,255,4,3,255,4,8,255,5,0,255,5,1,255,5,2,255,5,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255]},{"width":7,"chr":"e","bonus":80,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,2,3,255,2,5,255,2,8,255,3,3,255,3,5,255,3,8,255,4,3,255,4,5,255,4,8,255,5,4,255,5,5,255,5,7,255]},{"width":6,"chr":"f","bonus":65,"secondary":false,"pixels":[1,3,255,2,1,255,2,2,255,2,3,255,2,4,255,2,5,255,2,6,255,2,7,255,2,8,255,3,0,255,3,3,255,4,0,255,4,3,255]},{"width":7,"chr":"g","bonus":100,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,2,3,255,2,8,255,2,10,255,3,3,255,3,8,255,3,10,255,4,3,255,4,8,255,4,10,255,5,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255,5,9,255]},{"width":7,"chr":"h","bonus":85,"secondary":false,"pixels":[1,0,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,3,255,3,3,255,4,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255]},{"width":3,"chr":"i","bonus":35,"secondary":false,"pixels":[1,0,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255]},{"width":5,"chr":"j","bonus":50,"secondary":false,"pixels":[1,9,255,2,2,255,2,9,255,3,2,255,3,3,255,3,4,255,3,5,255,3,6,255,3,7,255,3,8,255]},{"width":7,"chr":"k","bonus":80,"secondary":false,"pixels":[1,0,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,6,255,3,5,255,3,6,255,4,4,255,4,7,255,5,3,255,5,8,255]},{"width":3,"chr":"l","bonus":45,"secondary":false,"pixels":[1,0,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255]},{"width":11,"chr":"m","bonus":110,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,3,255,3,3,255,4,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255,6,3,255,7,3,255,8,3,255,9,4,255,9,5,255,9,6,255,9,7,255,9,8,255]},{"width":7,"chr":"n","bonus":70,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,3,255,3,3,255,4,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255]},{"width":7,"chr":"o","bonus":70,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,2,3,255,2,8,255,3,3,255,3,8,255,4,3,255,4,8,255,5,4,255,5,5,255,5,6,255,5,7,255]},{"width":7,"chr":"p","bonus":90,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255,2,3,255,2,8,255,3,3,255,3,8,255,4,3,255,4,8,255,5,4,255,5,5,255,5,6,255,5,7,255]},{"width":7,"chr":"q","bonus":90,"secondary":false,"pixels":[1,4,255,1,5,255,1,6,255,1,7,255,2,3,255,2,8,255,3,3,255,3,8,255,4,3,255,4,8,255,5,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255,5,9,255,5,10,255]},{"width":6,"chr":"r","bonus":45,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,2,4,255,3,3,255,4,3,255]},{"width":6,"chr":"s","bonus":60,"secondary":false,"pixels":[1,4,255,1,5,255,1,8,255,2,3,255,2,5,255,2,8,255,3,3,255,3,6,255,3,8,255,4,3,255,4,6,255,4,7,255]},{"width":6,"chr":"t","bonus":60,"secondary":false,"pixels":[1,3,255,2,1,255,2,2,255,2,3,255,2,4,255,2,5,255,2,6,255,2,7,255,3,3,255,3,8,255,4,3,255,4,8,255]},{"width":7,"chr":"u","bonus":70,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,2,8,255,3,8,255,4,8,255,5,3,255,5,4,255,5,5,255,5,6,255,5,7,255,5,8,255]},{"width":7,"chr":"v","bonus":50,"secondary":false,"pixels":[1,3,255,1,4,255,2,5,255,2,6,255,3,7,255,3,8,255,4,5,255,4,6,255,5,3,255,5,4,255]},{"width":9,"chr":"w","bonus":90,"secondary":false,"pixels":[1,3,255,1,4,255,1,5,255,1,6,255,2,7,255,2,8,255,3,5,255,3,6,255,4,3,255,4,4,255,5,5,255,5,6,255,6,7,255,6,8,255,7,3,255,7,4,255,7,5,255,7,6,255]},{"width":7,"chr":"x","bonus":50,"secondary":false,"pixels":[1,3,255,1,8,255,2,4,255,2,7,255,3,5,255,3,6,255,4,4,255,4,7,255,5,3,255,5,8,255]},{"width":7,"chr":"y","bonus":60,"secondary":false,"pixels":[1,3,255,2,4,255,2,5,255,2,6,255,2,10,255,3,7,255,3,8,255,3,9,255,4,4,255,4,5,255,4,6,255,5,3,255]},{"width":6,"chr":"z","bonus":60,"secondary":false,"pixels":[1,3,255,1,7,255,1,8,255,2,3,255,2,6,255,2,8,255,3,3,255,3,5,255,3,8,255,4,3,255,4,4,255,4,8,255]},{"width":7,"chr":"{","bonus":70,"secondary":false,"pixels":[1,5,255,2,5,255,3,1,255,3,2,255,3,3,255,3,4,255,3,6,255,3,7,255,3,8,255,3,9,255,4,0,255,4,10,255,5,0,255,5,10,255]},{"width":3,"chr":"|","bonus":55,"secondary":false,"pixels":[1,0,255,1,1,255,1,2,255,1,3,255,1,4,255,1,5,255,1,6,255,1,7,255,1,8,255,1,9,255,1,10,255]},{"width":7,"chr":"}","bonus":70,"secondary":false,"pixels":[1,0,255,1,10,255,2,0,255,2,10,255,3,1,255,3,2,255,3,3,255,3,4,255,3,6,255,3,7,255,3,8,255,3,9,255,4,5,255,5,5,255]},{"width":9,"chr":"~","bonus":45,"secondary":false,"pixels":[1,1,255,1,2,255,2,0,255,3,0,255,4,1,255,5,2,255,6,2,255,7,0,255,7,1,255]}],"width":12,"spacewidth":4,"shadow":false,"height":11,"basey":8};

/***/ }),

/***/ "./imgs/att.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IDN8dNUwAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAD6SURBVDhPrZG7agIBEEUv6AeItbWFID4IgiZoJEhAISiIFpIUyVpomrVZG21iEQksbLG/4SeI32Sj5eROP82gAwdOcbjNoFIuya18BYFcL2c5nY6Ceq0sPNyDQqEoaDzU6HbgJZ/LCVrNBt0OvOgWOu1Huh14eW4/CXovXbodeNEtDPqvdDvwolsYDd/oduBFtzCdjOl24EW38PE+o9uBF91CEHzS7cCLbuF7uaDbgRfdwmoV0u3Ai25hvY7oduBFt7Ddbuh24EW3sNv90O3Ai25hv/+l24EX3UIY3u8pcRwLDn8duh14SZJEsJlXJZvJShRFkqbpjaTyD9V8aqFTsJHrAAAAAElFTkSuQmCC")

/***/ }),

/***/ "./imgs/borderBL.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAM0lEQVQYV2NQM3OQ1DQUUdYGIgZtKxcgJSivDuIY2HtKqBsAWUB5hrDkvOCkHCCKSC8AANM6CixxlTMoAAAAAElFTkSuQmCC")

/***/ }),

/***/ "./imgs/mage.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IDN8dNUwAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAFASURBVDhPrYzNSgJhFIYPOJJKkWBQouBYFBVYGWH/9jNZYKVFf0QUjAqZBV1B0GoGWsxC5wbadAHdRnRNb+dzfVoc8MADz+I5Ly0W5vEfszNTKFyFsJ0PREYnsXD7jbXOL+zKJzLpCfGHlosF8NEgMFtUWimyy4EWs0Ub6yV2OdBitminvMkuB1p2y1ugirPHLgdazBYdV4/Y5UCL2aLzsxq7HGgxW3RzfckuB1rMFj3c37HLgRazRa1Wg10OtJgtajZcdjnQ8tx5Aq0enLLLgZZ2+xFUe/9hlwMtzZNXUO7wi10OtDSqPJiau2CXAy39wfGlF3Y50OK/DXgwn8+BnH2HXQ60BEEA6vV66Ha78DwP9Xodtm0jEU8gNhRD1IoiPjKGZHq6TyK9jWQqA8sahhWxkM1m4boufN+H2QnDEH/xX1D9iCrQzAAAAABJRU5ErkJggg==")

/***/ }),

/***/ "./imgs/ranged.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IDN8dNUwAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAEtSURBVDhPrY/NSgJhFIbPSouiiJgLqBAp0NBkshKzUgKlSJD+TJEQslrkbJpNEuRiJBiYZuYeohvo9t7ODAQtDtSBPnjg4fDwwketqomsMY3s4hSTjCkZCTRXErArM3i+qCG/sYr1zNqfIGf0AH70H+RzGdCCMcsuB1rMQg5U3Cywy4GW7S0TtFveYZcDLZVyCVQ72GOXAy3RFjXqh+xyoCXaoubJMbscaIm26Oy0xS4HWqIt6nba7HKgpX15Dur3r9nlQItjdUH3d7fscqDlc1gFWdaQXQ60vNXnQLb9yC4HWgbFedBo9MQuB1pulpKg8fiFXQ60xF+eTBx2OdASHC2DXNdllwMtH1cpkOd57HKg5b23DwrDEN8EQRDz8/Ybvu8jnU7BGnTw2mvgC9/WZAqCKCxnAAAAAElFTkSuQmCC")

/***/ }),

/***/ "./imgs/str.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IDN8dNUwAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAFHSURBVDhPrYy7SgNhEEan1MJCEhCboIUgSpBIWLwmahTBGwpeArpRJE0UJGFjgiRpTGEKFwLuvoLiC6idYOMjWPkMNvafM0FEZJoBfzhwfvjm0Fh8BIKXW8NreRFhwUGyvw+fTyHer12sD8cQi3Z3/o/FDO4PhhBWXER7ujA4EOvc/obGE3Hwo/9AWuQkE+z6wIq0aGrSYdcHVqRF6dQ0uz6wMpeaAS1l5tn1gRVp0erKMrs+sCIt2trcYNcHVqRFe7vb7PrAirQo5+6z6wMr0qJ8/phdH1iRFp2eFNj1gRVpUalUZNcHVqRF1WqFXR9YkRY1GnV2fWBFWtRsXrLrAyvSolbril0fWJEW+b7Prg+sSIva7Ta7PrAiLQqCAH+p12r4eAjxdlPC83kWL/4hbs9mcXe08MPF6ASy6R1EIr3wPO/7NsAXRJ9tBFBNKJsAAAAASUVORK5CYII=")

/***/ }),

/***/ "./imgs/timerimg.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAsAAAARCAYAAAAL4VbbAAABWUlEQVQoU2OYFe3yf1qE4/+JoXZg3BNoDcad/hb/m71M4LjWzfA/A0gCpBikCRnDDADJgxRn2ur8ZwARQMAAwlkeVv+TLdT+R5uq/g81UPwfbWcMlosMCPzvbaDyn6E9PRqueMf5e2D2wsM34GIwXB4f9p+hNNgNLnH+5n0we9X27f9BGCYOwtn+zv8ZQNbBBB4cnfT/9u76/+cWBcMxTA6kDkUxCO+bl/l/VZkpihgIY1UMwjPzLTDEcCqePbEMQ4zGipGD7tGJmf8vrU78v6XJGiM0wEEHipQzm5r+Pz6zCIwvrYxDCbrjs3zAGsCREmuhCeYcWF77/9Cigv8Lcg3+T09SgeOpaTr/Z7Rk/gepA7ulLsAerAGGp5e5o/CTrbXBaQWe6toDbf43eFv8L/Mw/V/sYoiCazxN/6cANYB1ghggwTxHfbAECIM0gVIfCNsoSwCV/WcAAJpL1MdhKb5MAAAAAElFTkSuQmCC")

/***/ }),

/***/ "./index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var a1lib = __webpack_require__("@alt1/base");
var OCR = __webpack_require__("@alt1/ocr");
var font = __webpack_require__("../ocr/fonts/pixel_8px_mono.fontmeta.json");
var imgs = a1lib.ImageDetect.webpackImages({
    timerimg: __webpack_require__("./imgs/timerimg.data.png"),
    borderBL: __webpack_require__("./imgs/borderBL.data.png"),
    att: __webpack_require__("./imgs/att.data.png"),
    str: __webpack_require__("./imgs/str.data.png"),
    ranged: __webpack_require__("./imgs/ranged.data.png"),
    mage: __webpack_require__("./imgs/mage.data.png")
});
;
var AbilityTooltipReader = /** @class */ (function () {
    function AbilityTooltipReader() {
    }
    AbilityTooltipReader.prototype.read = function (img, rect) {
        if (!img) {
            img = a1lib.captureHoldFullRs();
        }
        if (!rect) {
            rect = a1lib.Rect.fromArgs(img);
        }
        var pos = img.findSubimage(imgs.timerimg, rect.x - img.x, rect.y - img.y, rect.width, rect.height);
        if (pos.length == 0) {
            return null;
        }
        var area = new a1lib.Rect(pos[0].x - 227, pos[0].y - 4, 242, -1);
        var bot = img.findSubimage(imgs.borderBL, area.x - 4, area.y, 4, img.height - area.y);
        if (bot.length == 0) {
            return null;
        }
        area.height = bot[0].y - area.y;
        alt1.overLaySetGroup("");
        alt1.overLayRect(a1lib.mixColor(255, 255, 255), area.x, area.y, area.width, area.height, 2000, 2);
        var buf = img.read(area.x, area.y, area.width, area.height + 10); //2 extra pixels for ocr on bottom line
        var icon = buf.clone(new a1lib.Rect(1, 1, 30, 30));
        var name = OCR.readLine(buf, font, [179, 122, 47], 35, 12, true, false);
        var cooldown = OCR.findReadLine(buf, font, [[255, 255, 255]], buf.width - 20, 32);
        var abiltype = OCR.readLine(buf, font, [179, 122, 47], 35, 26, true, false);
        var reqs = [];
        for (var sub = 0; sub < 5; sub++) {
            var txt = OCR.findReadLine(buf, font, [[0, 255, 0]], 24 + 48 * sub, buf.height - 6 - 10);
            if (!txt.text) {
                txt = OCR.findReadLine(buf, font, [[255, 0, 0]], 24 + 48 * sub, buf.height - 6 - 10);
            }
            var str = txt.text;
            if (str) {
                if (str.match(/^\d+$/)) {
                    if (buf.pixelCompare(imgs.att, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) {
                        reqs.push("melee");
                    }
                    if (buf.pixelCompare(imgs.str, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) {
                        reqs.push("melee");
                    }
                    if (buf.pixelCompare(imgs.mage, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) {
                        reqs.push("mage");
                    }
                    if (buf.pixelCompare(imgs.ranged, 15 + 48 * sub, buf.height - 34 - 10) != Infinity) {
                        reqs.push("ranged");
                    }
                }
                if (str == "2h") {
                    reqs.push("twohand");
                }
                if (str == "2x") {
                    reqs.push("dual");
                }
                if (str == "Shield") {
                    reqs.push("shield");
                }
            }
            else {
                break;
            }
        }
        var lines = [];
        var y = 49;
        for (var y = 49; y < buf.height - 10; y += 14) {
            var line = OCR.readLine(buf, font, [[179, 122, 47], [255, 255, 255]], 0, y, true, false); //TODO color detection for white higlight
            if (!line.text) {
                break;
            }
            lines.push(line.text);
        }
        if (!cooldown || !cooldown.text || !name || !abiltype) {
            return null;
        }
        var cdsec = parseInt(cooldown.text);
        if (isNaN(cdsec)) {
            return null;
        }
        var type;
        switch (abiltype.text) {
            case "Threshold Ability":
                type = "basic";
                break;
            case "Basic Ability":
                type = "thresh";
                break;
            case "Ultimate Ability":
                type = "thresh";
                break;
            default:
                throw "ability type didnt match";
        }
        return { lines: lines, icon: icon, name: name.text, cooldown: cdsec, abiltype: type, weapon: reqs };
    };
    return AbilityTooltipReader;
}());
exports.default = AbilityTooltipReader;


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
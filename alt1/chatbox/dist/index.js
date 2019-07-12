(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@alt1/base"));
	else if(typeof define === 'function' && define.amd)
		define(["@alt1/base"], factory);
	else if(typeof exports === 'object')
		exports["@alt1/chatbox"] = factory(require("@alt1/base"));
	else
		root["Chatbox"] = factory(root["A1lib"]);
})((typeof self!='undefined'?self:this), function(__WEBPACK_EXTERNAL_MODULE__alt1_base__) {
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

/***/ "./imgs/chatLegacyBorder.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAQAAAAPCAIAAABMVPnqAAAAIUlEQVQYV2P4jwRAnNk92RA0mDjzJuRCOUAWlAMF//8DAJmOfBu3Ydq7AAAAAElFTkSuQmCC")

/***/ }),

/***/ "./imgs/chatbubble.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA0AAAAJCAYAAADpeqZqAAAAoElEQVQoU5WRwQ3DIAxF2Sg9t1KvySSM0d46AgNw55aukAzAAizADE6eIxCy1EMPH4z9nxHGiYjq835JCEG+69rF2Xsv87zIbZpO2+XtQM5ZSilSa1URo23btUGMsYOOThRGYARpZkGFKFjAQiil9D/EbQrxSBIYrCzQb3o873qggMkam3gP01SIaRCQHE00ItfMDdDpsTTwl/gS9ssr7gAl2lnMS+w6XAAAAABJRU5ErkJggg==")

/***/ }),

/***/ "./imgs/entertochat.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABgAAAAJCAYAAAAo/ezGAAAAdElEQVQ4T62RSw7AIAhEOQTH8WCsXbvmuhRsTdQipqYmz88MJI4CM0tDB/zNPelipJT06Bee4oo9UbqV1+uDscLS5Zx163ulFN2OOiLWVxnEE1YpGq74FSISu/GsGy/hhDBBixgVecw9YYL6GQ+9uWPfI3ABK/Blt6d3IYgAAAAASUVORK5CYII=")

/***/ }),

/***/ "./imgs/filterbutton.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAAaElEQVQ4T9XLsQ2AMAxEUc+BxBysySTsQcEI7EF36JAcORdHoUMUv8jFz65jgXZuU2lf5zQD0OARonkg4+Eb6PcFMgc9GG8ryHpQ76qHp1D/WTOwCPXPS8fvINM/Lx1/CHWPpeMIAbAba/5W9dGOZAMAAAAASUVORK5CYII=")

/***/ }),

/***/ "./imgs/gameall.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAo0lEQVQ4T6XMsQkCQRAF0KnA5DA0MDG3A2uwlQuN7cVY07vgAkPBTA3FAixA5esXvuyeC+O6Cw+Gv/PH7oc5Hsf/sGupjxx2289Ar2c51LNrNwX1FzzqRQc0e6ID580YxFCzJ9y1y3oIYphDPTutBiCGmj3hbvmB3XICYphDveiA5hQVRfnXge1i9KY8/A9p7zP0FzzqlR9o6wolrEmEv2rqCk/yGcSB9N78JQAAAABJRU5ErkJggg==")

/***/ }),

/***/ "./imgs/gamefilter.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAqUlEQVQ4T63MsQrCQBAE0P1LSzs7Sy3tBEvtFDFNwMYurVhY2lgKfkHyBXbJ6AQm3AnHcaeBB3ubnbGiaVE0XZZD3cI2jxd+MRR8Pkvxv4LVrQa5yxjeKucVaI7xChaXJ4jLFMp5BZpjvIJ5dQdxqTnGvbXZ6QriMoVyNi3PIC41E3+6bwVFe69gsq8QoqAMBaGDGOVsvD5mFzDbF7jUHPJ9b6PlDvm2eAMxAQErxoTm+QAAAABJRU5ErkJggg==")

/***/ }),

/***/ "./imgs/gameoff.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdUlEQVQ4T62MsQrAIAxE/bwOhS7tkMHBLi79/zVthAvaCjZq4MFx5J6jePEI8wTPOQsq2M/YJcAuBQHlH/LfuQILVQFyi0Kw+cCClMgt8t9CYEEFK3kVINfAEKBPI0FK5BoYAvSFwIIKloNYeD+0+Ah6GRQQ30BWZJSYN2VIAAAAAElFTkSuQmCC")

/***/ }),

/***/ "./imgs/legacyreport.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAACEAAAALCAYAAADx0+Q/AAAAlElEQVQ4T72OCQ4AIQgD/f+nXYuUgGLiukeTQVq8Sp2F7FdQWi2GKmz6CEh6Mfq4DQf/FfaO1EFt1ocKRX+SQ35lD/ErPcOafICfgp7kEGe9tF6gwYKiK/GaLrjbOx/mwSiQ9Ty8uuCgJ5YFo0zeKc0W+30+3kkgmYyXpJ5oZt5lRpZn+4DszQYbpI+fkoY7vPeJWi767hYjK0Ud6gAAAABJRU5ErkJggg==")

/***/ }),

/***/ "./imgs/minusbutton.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAABL0lEQVQoU2PIzMk01hbUVGDDg4AKgMoYgFRLCPOOOtbdLWxAtLeTHYIgXKA4EAEVAJUxaMizbilju75E9u4mNUx0Y7UqUGp3MzdQGYOKLCuQ9XCH7qPdxg+2Gt3aYgQkgWw4AqoGKgAqQ1EKVIep9NY2LRSlt5ZrXV6tc3axNgRdXgbiQhDQ1J1VfDClNcJAuSBTJjjy1GNy1WSyUWI0kWa8PE8JRem9VcaYirRFGIAIaOHmIhEUpQ9X2D1e74WGgIK3ZhluzRWFKt1VKXNvjgYE3exVujNZFYiQGViUQuSudCkD0bkGJSAJVAckUZQC+demaMBJoDpktClVEqRUVY6jOYRvR5HsznoVILklUxpIQhCQDUE1LtxAZQw6JgZAHfKSLLLi2BFQCqhAx8QAACI62b/ivxHFAAAAAElFTkSuQmCC")

/***/ }),

/***/ "./imgs/plusbutton.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAABT0lEQVQoU2PIzMk01hbUVGDDg4AKgMoYgFRLCPOOOtbdLWxAtLeTHYIgXKA4EAEVAJUxaMizbilju75E9u4mNSC6sVoVguBcoNTuZm6gMgYVWVYg6+EO3Ue7jYHo3irjIFOmYAumWztBXCC6tVwLqACoDEXprS1GQARUCkQQdSDBbahKgVovr9Y5u1j78jItTz0mIAJyIQjohp1VfDClNcJwFa6a6OjyPCUUpUAnAkUd1BiByEYJBQEt3FwkgqL04Qq7x+u9gCRQ2kKOEc69NcsQoXRXpcy9ORoQdKVL2USaEYhu9irdmawKREDG1lxRdKVACaAZ2iIMQHS1UweoDYJQlAL516aAjAQqvTLJBogutBmca1CCoE2pkiClqnIczSF8O4pkd9arAMktmdJAEoKAKoBcIKpx4QYqY9AxMQDqkJdkkRXHjoBSQAU6JgYAwvDKbZkKUHAAAAAASUVORK5CYII=")

/***/ }),

/***/ "./imgs/reportbutton.data.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports=__webpack_require__("@alt1/base").ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAABAElEQVQ4T6WSvwtBURTHj0V+FknyB6AMZCH8ATbxByijwb9gsFsMBrvJaFAGu00sJilltlp0+N7Xua7rySuvPr1z7z2f77m9Ht0PdQbPR9cm2P8G3TZlBli4yUCabd5kqUG/W+FmI+8aJtB1lWUAWWrIvXaSS8WsCpHA9cg5E1xlQQJOi5y6RToVVQHST8d5nAEWUguXpSNDAoOOswc+5P0sxgL2MNkUzV4lo3E7DaoNvAWIkbCfC5moYtIL6OCfcqsWUqDGVATZAVqwZbAeJ/QbVyfy8WyYesnm5G+gBwG4gUwG+iPZgs3OkATPshuEHwDYB16g86LKwD7wwh8y0wNntoLFjD8QsQAAAABJRU5ErkJggg==")

/***/ }),

/***/ "./index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var a1lib = __webpack_require__("@alt1/base");
var imgs = a1lib.ImageDetect.webpackImages({
    plusbutton: __webpack_require__("./imgs/plusbutton.data.png"),
    minusbutton: __webpack_require__("./imgs/minusbutton.data.png"),
    filterbutton: __webpack_require__("./imgs/filterbutton.data.png"),
    chatbubble: __webpack_require__("./imgs/chatbubble.data.png"),
    chatLegacyBorder: __webpack_require__("./imgs/chatLegacyBorder.data.png"),
    entertochat: __webpack_require__("./imgs/entertochat.data.png"),
    gameoff: __webpack_require__("./imgs/gameoff.data.png"),
    gamefilter: __webpack_require__("./imgs/gamefilter.data.png"),
    gameall: __webpack_require__("./imgs/gameall.data.png"),
    legacyreport: __webpack_require__("./imgs/legacyreport.data.png"),
    reportbutton: __webpack_require__("./imgs/reportbutton.data.png"),
});
var timestampOffset = 56;
var defaultcolors = [
    [0, 255, 0],
    [0, 255, 255],
    [0, 175, 255],
    [0, 0, 255],
    [255, 82, 86],
    [159, 255, 159],
    [0, 111, 0],
    [255, 143, 143],
    [255, 152, 31],
    [255, 111, 0],
    [255, 255, 0],
    [239, 0, 0],
    [239, 0, 175],
    [255, 79, 255],
    [175, 127, 255],
    [48, 48, 48],
    [191, 191, 191],
    [127, 255, 255],
    [128, 0, 0],
    [255, 255, 255],
    [127, 169, 255],
    [255, 140, 56],
    [255, 0, 0],
    [69, 178, 71],
    [164, 153, 125],
    [215, 195, 119] //interface preset color
];
var ChatBoxReader = /** @class */ (function () {
    function ChatBoxReader() {
        this.pos = null;
        this.debug = null;
        this.overlaplines = [];
        this.readargs = {
            backwards: true,
            colors: defaultcolors.map(function (c) { return a1lib.mixColor(c[0], c[1], c[2]); })
        };
        this.lineheight = 14;
        this.minoverlap = 2;
        this.diffRead = true;
    }
    ChatBoxReader.prototype.read = function (img) {
        var t = Date.now();
        if (!this.pos) {
            return null;
        }
        var box = this.pos.mainbox;
        if (!img) {
            img = a1lib.captureHold(box.rect.x + (box.leftfound ? 0 : -300), box.rect.y, box.rect.width + (box.leftfound ? 0 : 300), box.rect.height);
        }
        if (!img) {
            return null;
        }
        //add timestamp colors if needed
        if (box.timestamp && this.readargs.colors) {
            var cols = [a1lib.mixColor(127, 169, 255), a1lib.mixColor(255, 255, 255)];
            for (var a in cols) {
                if (this.readargs.colors.indexOf(cols[a]) == -1) {
                    this.readargs.colors.push(cols[a]);
                }
            }
        }
        //TODO check scrollbar
        var imgline0y = box.line0y + box.rect.y - img.y;
        var imgline0x = box.line0x + box.rect.x - img.x;
        var readlines = [];
        var newlines = [];
        for (var line = 0; true; line++) {
            var liney = box.line0y - line * this.lineheight;
            var imgliney = liney + box.rect.y - img.y;
            if (liney - this.lineheight < 0) {
                newlines = readlines;
                break;
            }
            var str = JSON.parse(alt1.bindReadStringEx(img.handle, imgline0x, imgliney, JSON.stringify(this.readargs)));
            //retry with offset if timestamps are enabled
            if (!str && box.timestamp) {
                str = JSON.parse(alt1.bindReadStringEx(img.handle, imgline0x + timestampOffset, imgliney, JSON.stringify(this.readargs)));
            }
            readlines.unshift(str ? str : { text: "", fragments: [] });
            //console.log(str);
            //combine with previous reads
            if (this.diffRead) {
                if (readlines.length >= this.overlaplines.length && this.overlaplines.length >= this.minoverlap) {
                    var matched = true;
                    for (var a_1 = 0; a_1 < this.overlaplines.length; a_1++) {
                        if (!this.matchLines(this.overlaplines[a_1].text, readlines[a_1].text)) {
                            matched = false;
                            break;
                        }
                    }
                    if (matched) {
                        newlines = readlines.slice(this.overlaplines.length, readlines.length);
                        break;
                    }
                }
            }
        }
        this.overlaplines = this.overlaplines.concat(newlines);
        if (this.overlaplines.length > this.minoverlap) {
            this.overlaplines.splice(0, this.overlaplines.length - this.minoverlap);
        }
        //qw("Read chat attempt time: " + (Date.now() - t));
        //for (var a = 0; a < newlines.length; a++) { qw(newlines[a]); }
        return newlines;
    };
    //convert some similar characters to prevent problems when a character is slightly misread
    ChatBoxReader.prototype.simplefyLine = function (str) {
        str = str.replace(/[\[\]\.\':;,_ ]/g, "");
        str = str.replace(/[|!lIji]/g, "l");
        return str;
    };
    ChatBoxReader.prototype.matchLines = function (line1, line2) {
        return this.simplefyLine(line1) == this.simplefyLine(line2);
    };
    ChatBoxReader.prototype.checkLegacyBG = function (buf, x, y) {
        return buf.getColorDifference(x, y, 155, 140, 107) < 20;
    };
    ChatBoxReader.prototype.find = function (img) {
        var _this = this;
        if (!img) {
            img = a1lib.captureHoldFullRs();
        }
        if (!img) {
            return null;
        }
        var toprights = [];
        img.findSubimage(imgs.plusbutton).forEach(function (loc) { return toprights.push({ x: loc.x + 2, y: loc.y - 1, type: "hidden" }); });
        img.findSubimage(imgs.minusbutton).forEach(function (loc) { return toprights.push({ x: loc.x + 2, y: loc.y + 21, type: "full" }); });
        console.log(toprights);
        var botlefts = [];
        img.findSubimage(imgs.chatbubble).forEach(function (loc) {
            //107,2 press enter to chat
            //102,2 click here to chat
            var data = img.toData(loc.x + 102, loc.y + 1, 28 + (107 - 102), 10);
            if (data.pixelCompare(imgs.entertochat, 0, 1) != Infinity || data.pixelCompare(imgs.entertochat, (107 - 102), 1) != Infinity) {
                botlefts.push(loc);
            }
            //i don't even know anymore some times the bubble is 1px higher (i think it might be java related)
            else if (data.pixelCompare(imgs.entertochat, 0, 0) != Infinity || data.pixelCompare(imgs.entertochat, (107 - 102), 0) != Infinity) {
                loc.y -= 1;
                botlefts.push(loc);
            }
            else {
                var pixel = img.toData(loc.x, loc.y - 2, 1, 1);
                if (pixel.data[0] == 255 && pixel.data[1] == 255 && pixel.data[2] == 255) {
                    botlefts.push(loc);
                }
                else {
                    console.log("unlinked quickchat bubble " + JSON.stringify(loc));
                }
            }
        });
        img.findSubimage(imgs.chatLegacyBorder).forEach(function (loc) {
            botlefts.push({ x: loc.x, y: loc.y - 1 });
        });
        console.log(botlefts);
        //check if we're in full-on legacy
        if (botlefts.length == 1 && toprights.length == 0) {
            //cheat in a topright without knowing it's actual height
            var pos = img.findSubimage(imgs.legacyreport);
            if (pos.length == 1) {
                toprights.push({ x: pos[0].x + 32, y: pos[0].y - 170, type: "legacy" });
            }
        }
        var groups = [];
        var recurs = 0;
        var groupcorners = function () {
            recurs++;
            var done = true;
            for (var a in toprights) {
                if (groups.find(function (q) { return q.topright == toprights[a]; })) {
                    continue;
                }
                done = false;
                for (var b in botlefts) {
                    if (groups.find(function (q) { return q.botleft == botlefts[b]; })) {
                        continue;
                    }
                    var group = {
                        timestamp: false,
                        type: "main",
                        leftfound: false,
                        topright: toprights[a],
                        botleft: botlefts[b],
                        rect: new a1lib.Rect(botlefts[b].x, toprights[a].y, toprights[a].x - botlefts[b].x, botlefts[b].y - toprights[a].y),
                        line0x: 0,
                        line0y: 0
                    };
                    if (groups.find(function (q) { return q.rect.overlaps(group.rect); })) {
                        continue;
                    }
                    groups[groups.length] = group;
                    if (groupcorners()) {
                        return true;
                    }
                    groups.splice(groups.length - 1, 1);
                }
            }
            return done;
        };
        if (!groupcorners()) {
            return null;
        }
        console.log(recurs);
        console.log(groups);
        var mainbox = null;
        var readargs = JSON.stringify({ colors: [a1lib.mixColor(255, 255, 255)], backwards: true });
        groups.forEach(function (group) {
            var nameread = JSON.parse(alt1.bindReadStringEx(img.handle, group.rect.x - 10, group.rect.y + group.rect.height + 9, readargs));
            if (nameread) {
                var d = 0;
                if (nameread.text == "Clan Chat") {
                    group.type = "cc";
                    d = 62;
                }
                else if (nameread.text == "Friends Chat") {
                    group.type = "fc";
                    d = 76;
                }
                else if (nameread.text == "Group Chat") {
                    group.type = "gc";
                    d = 69;
                }
                else if (nameread.text == "Guest Clan Chat") {
                    group.type = "gcc";
                    d = 98;
                }
                if (d != 0) {
                    group.rect.x -= d;
                    group.rect.width += d;
                    group.leftfound = true;
                }
            }
            if (!group.leftfound && group.topright.type == "full") {
                var pos = [];
                if (pos.length == 0) {
                    pos = img.findSubimage(imgs.gameall, group.rect.x - 300, group.rect.y - 22, 310, 16);
                }
                if (pos.length == 0) {
                    pos = img.findSubimage(imgs.gamefilter, group.rect.x - 300, group.rect.y - 22, 310, 16);
                }
                if (pos.length == 0) {
                    pos = img.findSubimage(imgs.gameoff, group.rect.x - 300, group.rect.y - 22, 310, 16);
                }
                if (pos.length != 0) {
                    group.leftfound = true;
                    var d = group.rect.x - pos[0].x;
                    group.rect.x -= d;
                    group.rect.width += d;
                }
            }
            //alt1.overLayRect(a1lib.mixcolor(255, 255, 255), group.rect.x, group.rect.y, group.rect.width, group.rect.height, 10000, 2);
            //alt1.overLayTextEx(group.type, a1lib.mixcolor(255, 255, 255), 20, group.rect.x + group.rect.width / 2 | 0, group.rect.y + group.rect.height / 2 | 0, 10000, "", true, true);
            group.line0x = 0;
            group.line0y = group.rect.height - 10; //- 9;//-10 before mobile interface update
            if (group.leftfound) {
                group.timestamp = _this.checkTimestamp(img, group);
            }
            if (mainbox == null || group.type == "main") {
                mainbox = group;
            }
        });
        if (groups.length == 0) {
            return null;
        }
        var res = {
            mainbox: mainbox,
            boxes: groups
        };
        this.pos = res;
        return res;
    };
    ChatBoxReader.prototype.checkTimestamp = function (img, pos) {
        //the chatbox has timestamps if in the first 3 lines a line start with [00:00:00]
        var readargs = { colors: [a1lib.mixColor(127, 169, 255)] };
        for (var line = 0; line < 3; line++) {
            var y = pos.rect.y + pos.line0y - line * this.lineheight;
            var x = pos.rect.x + pos.line0x;
            x += 3; //the leading '[' can't be the positioning char
            var str = JSON.parse(alt1.bindReadStringEx(img.handle, x, y, JSON.stringify(readargs)));
            if (str && str.text.match(/^\d\d:\d\d:\d\d/)) {
                return true;
            }
        }
        return false;
    };
    ChatBoxReader.getFontColor = function (buffer, x, y, w, h) {
        var bestscore = -Infinity;
        var bestx = 0, besty = 0;
        var data = buffer.data;
        for (var cx = x; cx < x + w - 1; cx++) {
            for (var cy = y; cy < y + h - 1; cy++) {
                var i1 = 4 * cx + 4 * buffer.width * cy;
                var i2 = 4 * (cx + 1) + 4 * buffer.width * (cy + 1);
                var colorness = data[i1] + data[i1 + 1] + data[i1 + 2];
                var blackness = data[i2] + data[i2 + 1] + data[i2 + 2];
                var score = Math.min(255, 255 + 20 - blackness) * colorness;
                if (score > bestscore) {
                    bestscore = score;
                    bestx = cx;
                    besty = cy;
                }
            }
        }
        return buffer.getPixel(bestx, besty);
    };
    return ChatBoxReader;
}());
exports.ChatBoxReader = ChatBoxReader;


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./index.ts");


/***/ }),

/***/ "@alt1/base":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__alt1_base__;

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map
# Alt1 Sprite based OCR
This library is used to read text in-game.

# Sprite based matching
This library works slightly different from other OCR methods as it relies on pixel matching of the characters. This works particularly well with runescape as all characters are simply rendered as sprites. The disadvantage is that every font needs definition files to be read.

# Font definitions
In order to read a piece of text you need to supply the font that the text is written with. This package includes several standard fonts (`@alt1/ocr/fonts/`). To generate your own, use the `@alt1/font-loader` package.

## Installation
```sh
npm i @alt1/ocr -s
```

# Usage
```js
import * as OCR from "@alt1/ocr";
import * as A1lib from "@alt1/base";

//currently need webpack configured with @alt1/font-loader to do this
import font from "@alt1/font-loader!@alt1/ocr/fonts/aa_8px_mono.fontmeta.json";


//capture a 400x400 area of the screen starting at 100,100
var imgref = A1lib.capture(100,100,400,400);
//grab the raw pixels
var imagebuffer=imgref.toData();

var color=[255,255,255];//rgb => pure white

//read the text at position 100,100 of the imagebuffer. The given point must be somewhere _in the middle_ of the text.
var text=OCR.findReadLine(imagebuffer,font,[color],100,100);

console.log(text)//{text:"hello",debugArea:{x:80,y:95,w:30,h:10}}
```


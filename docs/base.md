# Alt1lib
The base library for Alt1 apps to communicate with the Alt1 API. For intellisense based IDE's it will also add intellisense declarations for the global `alt1` object inside the Alt1 browser.

## Installation
```sh
npm install alt1
```

# Usage
```js
import * as a1lib from "alt1/base";

// Captures a 400x400 rectangle starting at position 100,100 from the top-left of the game area
// imgref now contains a reference to the image (in this case still in Alt1 memory)
var imgref = a1lib.capture(100,100,400,400);

// Retrieve our raw pixel data so we can directly read it
var imagebuffer = imgref.toData();

// Show the image by adding it to the DOM (for debugging)
imagebuffer.show();
```


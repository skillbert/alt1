# Alt1 ImageData Loader
This loader loads png images as ImageBuffer objects to use their raw pixels. Using this loader will fix several pitfalls with the png specification. In particular it removes the sRGB header to prevent discoloration of the raw pixels.
This loader returns a `Promise` which resolves to an `ImageData` object.

# Data png's
Alt1 and it's libraries often require template images to compare the game against. In Alt1 it is convention to save these images with the extension `.data.png`. This extra `.data` extension doesn't actually do anything, however you can configure webpack to use this loader only for `.data.png` files.

# Usage
```js
//webpack.config.json

module.exports={
	...
	module: {
		rules: [
			...
			// Make sure this rule comes after any other rules that affect .png files
			{
				test: /\.data.png$/,
				loader: ['alt1/imagedata-loader']
			}
		]
	}
}
```

```js
//app.js

//required for ImageData.prototype.show and also used by the client sided part of the loader
import "alt1/base";

require("./img.data.png").then(buffer=>{
	buffer.show();
})

```

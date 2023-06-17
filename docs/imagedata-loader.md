# Alt1 ImageData Loader
This loader loads png images as ImageBuffer objects to use their raw pixels. Using this loader will fix several pitfalls with the png specification. In particular it removes the sRGB header to prevent discoloration of the raw pixels.
This loader returns a `Promise` which resolves to an `ImageData` object.

## Installation
```sh
npm i @alt1/font-loader -s
```

# Usage
```js
//webpack.config.json

module.exports={
	...
	module: {
		rules: [
			...
			{
				test: /\.data.png$/,
				loader: ['@alt1/imagedata-loader']
			}
		]
	}
}
```

```js
//app.js

//required for ImageData.prototype.show and also used by the client sided part of the loader
import "@alt1/base";

require("./img.png").then(buffer=>{
	buffer.show();
})

```

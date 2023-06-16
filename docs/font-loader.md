# Alt1 Font Loader
This loader creates font definitions for ocr using raw font images.

# Usage
You will need both this loader and `alt1/imagedata-loader` installed in your webpack config
```js
//webpack.config.json

module.exports={
	...
	module: {
		rules: [
			...			
			// Make sure this rule comes after any other rules that affect .png  or .json files
			{
				test: /\.data\.png$/,
				loader: ['alt1/imagedata-loader']
			},
			{
				test: /\.fontmeta\.json$/,
				loader: ["alt1/font-loader"]
			}
		]
	}
}
```


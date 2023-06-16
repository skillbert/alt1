# Datapng loader

Simple loader that sets the sRGB png header to perceptual to ensure that browsers decode the image into the exact original pixel values.

This loader (`alt1/datapng-loader`) differs from `alt1/imagedata-loader` in that it still outputs a png image that later loaders in the chain need to take care of, whereas `alt1/imagedata-loader` results in js code that loads the image as an `ImageData` object.
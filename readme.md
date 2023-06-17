
# WIP
This project is currently incomplete and very much a work in progress. All API's exposed WILL change in the future.

# Example/quick start app
Visit the example app at https://github.com/skillbert/alt1minimal/ to see how these libraries are used together with the webpack/typescript work flow.

Visual Studio Code or any other editor that supports typescript is recommended. The libraries are written in typescript and will supply you with code completion and documentation in the editor.

# Library contents
This repository contains all libraries and build tools required to build an Alt1 app.

The starting point all image detection is at `alt/base`. This Library wraps the Alt1 native API and provides many utility classes for image detection. 

You will find different premade interface readers, these can be used to fairly easily read RuneScape interfaces. If there is no reader yet for a specific interface you can use these as a template.

There are also two custom webpack loaders, `alt1/imagedata-loader` and `alt1/font-loader`. `alt1/imagedata-loader` is used to directly load an image into js as an ImageData object that contains the raw pixel data. This loader also clears srgb transformations from the file to make sure every user gets the same pixel values. `alt1/font-loader` is used to load a font definition for use in text detection (`alt/ocr`).

# Install dependencies
```sh
npm install
```

# Use on node.js based environments
All packages are designed to work in alt1, a normal browser and also in node.js. The libraries will `require()` several npm packages as fallback when related browser API's are not available. You will have to install these packages yourself.
```sh
npm i sharp canvas
```

# Build
Building will build all sub-projects and output in their respective dist folders
```sh
# first build
npm run build-full
# subsequent builds
npm run build
```

# Basic Alt1 concepts
Images in can be in one of two different locations in memory, either in js memory or Alt1 memory. They both have their advantages. You can move between them but that comes at a slight cost. A captured image in Alt1 starts in the Alt1 memory, you can do several optimized search and brute force operations on it while it's there. You can however only access the raw pixel data when it is in js memory. Pasted images in the browser also start in js memory. There is also a third type, Webkit render memory, you only use that show the images. There are two important classes in the libraries to deal with all this.

First up is the ImgRef class. This class can contain an image in any type of memory. Most image detection functions accept this type as input and choose what operation is most efficient for the image type.

The second class is ImageData. This class represents raw image data in js memory. It is a very simple class with three properties; width, height and data. Width and height are the size of the image. Data contains a one dimensional UInt8ClampedArray with all pixels in it, this is mostly like any other js array but more efficient and only holds values between 0 and 255. The length of the array is 4\*width\*height, this means that it has 4 indexes for every pixel, one each for red, green, blue and alpha. You can get the index of any pixel with i=4\*x+4\*width\*y. More info elsewhere soon.

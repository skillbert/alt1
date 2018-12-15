
# WIP
This project is currently incomplete and very much a work in progress. All API's exposed WILL very likely change in the future.

# Alt1 Toolkit libraries 
This repository contains all libraries and build tools required to build an Alt1 app.

The starting point all image detection is at ```@alt/base```. This Library wraps the Alt1 native API and provides many utility classes for image detection. 

You will find different premade interface readers, these can be used to fairly easily read RuneScape interfaces. If there is no reader yet for a specific interface you can use these as a template.

There are also two custom webpack loaders, ```@alt1/imagedata-loader``` and ```@alt1/font-loader```. ```@alt1/imagedata-loader``` is used to directly load an image into js as an ImageData object that contains the raw pixel data. This loader also clears rgba transformations from the file to make sure every user gets the same pixel values. ```@alt1/imagedata-loader``` is used to load a font definition for use in text detection (```@alt/ocr```).

# Install dependencies
Only install the root directory at this time. Do *not* install the separate lib packages.
```sh
npm install
```


# Build
Building will build all sub-projects and output in their respective dist folders
```sh
# minified build
npm start build
# readable build (will not work in old browsers)
npm start pretty-build
```

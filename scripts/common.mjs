
import path from "path";

let tsloaderOptions = {
    onlyCompileBundledFiles: true
};

/**
 * @param {string} requireid
 * @returns {string} 
 */
export function getAlt1RootLibName(requireid) {
    let libmatch = requireid.match(/^alt1\/([\w\-\/]+)$/);
    if (!libmatch) { return undefined; }
    let libname = libmatch[1];

    let librootnames = {
        base: "A1lib",
        ocr: "OCR",
    }

    let rootname = librootnames[libname] ?? libname.replace(/(^|-)\w?/g, s => s.replace("-", "").replace(/\//g, "_").toUpperCase());
    return rootname;
}

/**
 * @type {import("webpack").Externals & Function}
 */
export const alt1ExternalsFilter = function (req, cb) {
    let res = getAlt1RootLibName(req.request);
    cb(undefined, res && { root: res, commonjs2: req.request, commonjs: req.request, amd: req.request });
}

/**
 * @type {import("webpack").Configuration}
 */
export const baseconfig = {
    devtool: false,
    resolve: {
        extensions: [".wasm", ".tsx", ".ts", ".mjs", ".jsx", ".js"]
    },
    mode: "development",
    output: {
        libraryTarget: "umd",
        path: path.resolve(process.cwd(), "dist"),
        //prevents self triggering watch mode
        compareBeforeEmit: true,
        globalObject: "globalThis",
        assetModuleFilename: "assets/[file]"
    },
    externalsType: "umd",
    externals: [
        "sharp",
        "canvas",
        "electron/common",
        /^node:/,
        alt1ExternalsFilter
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader", options: tsloaderOptions },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
            { test: /\.(png|jpg|jpeg|gif|webp)$/, type: "asset", generator: { filename: "[file]" } },
            { test: /\.(glb|gltf)$/, type: "asset", generator: { filename: "[file]" } },
            { test: /\.html$/, type: "asset/resource", generator: { filename: "[file]" } },
            { test: /\.json$/, exclude: /\.fontmeta\.json$/, type: "asset/resource", generator: { filename: "[file]" } },

            { test: /\.data\.png$/, loader: "alt1/imagedata-loader", type: "javascript/auto" },
            { test: /\.fontmeta.json/, loader: "alt1/font-loader" }
        ]
    }
}

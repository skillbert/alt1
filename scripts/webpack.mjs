
import path from "path";
import webpack from "webpack";

let tsloaderOptions = {
    //compilerOptions:{},
    onlyCompileBundledFiles: true
};

/**@type {webpack.Configuration} */
let config = {
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
        alt1ExternalsFilter
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader", options: tsloaderOptions },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
            { test: /\.(png|jpg|jpeg|gif|webp)$/, type: "asset" },
            { test: /\.fontmeta.json/, loader: "alt1/font-loader" },
            // { test: /\.json$/, type: "json" },
            { test: /\.html/, type: "asset/resource", generator: { filename: "[base]" } },
            { test: /\.data\.png$/, loader: "alt1/imagedata-loader", type: "javascript/auto" },
        ]
    },
    experiments: {
        // outputModule: true
    }
}

export function alt1ExternalsFilter({ request }, cb) {
    let res = getAlt1RootLibName(request);
    cb(null, res && { root: res, commonjs2: request, commonjs: request, amd: request });
}

/**
 * @param {string} requireid 
 */
export function getAlt1RootLibName(requireid) {
    let libmatch = requireid.match(/^alt1\/([\w\-\/]+)$/);
    if (!libmatch) { return undefined; }
    let libname = libmatch[1];

    let librootnames = {
        base: "A1lib",
        ocr: "OCR",
    }

    let rootname = librootnames[libname] ?? libname.replace(/(^|-)\w?/, s => s.replace("-", "").replace(/\//g, "_").toUpperCase());
    return rootname;
}

export default config;
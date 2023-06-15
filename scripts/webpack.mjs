
import webpack from "webpack";

let tsloaderOptions = {
    //compilerOptions:{},
    onlyCompileBundledFiles: true
};

let urlloaderOptions = {
    limit: 8192, esModule: false, name: "[path][name].[ext]"
}


/**@type {webpack.Configuration} */
let config = {
    devtool: false,
    resolve: {
        extensions: [".wasm", ".tsx", ".ts", ".mjs", ".jsx", ".js"]
    },
    mode: "development",
    output: {
        // chunkFormat: "module",
        // libraryTarget: "module",
        libraryTarget: "umd",
        //prevents self triggering watch mode
        compareBeforeEmit: true,
        globalObject: "globalThis",
        chunkLoading: "require"
    },
    externalsType: "umd",
    externals: [
        "sharp",
        "canvas",
        "electron/common"
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader", options: tsloaderOptions },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
            { test: /\.data\.png?$/, loader: "alt1/datapng-loader", enforce: "pre" },
            {
                test: /\.(png|jpg|jpeg|gif|webp)$/, loader: "url-loader", options: urlloaderOptions,
                //TODO should be able to just set type to "asset" and remove the loader
                type: "javascript/auto"
            },
            { test: /\.fontmeta.json/, loader: "alt1/font-loader" },
            // { test: /\.json$/, type: "json" },
            {
                test: /\.html/, loader: "file-loader", options: urlloaderOptions,
                //TODO same here
                type: "javascript/auto"
            }
        ]
    },
    experiments: {
        // outputModule: true
    }
}
export default config;
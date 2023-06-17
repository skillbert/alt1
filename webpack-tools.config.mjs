
import webpack from "webpack";
import baseconfig from "./scripts/webpack.mjs";

/**@type {webpack.Configuration} */
let toolsconfig = {
    ...baseconfig,
    target: "node",
    entry: {
        "imagedata-loader/index": "./src/imagedata-loader/index.ts",
        "font-loader/index": "./src/font-loader/index.ts",
        "datapng-loader/index": "./src/datapng-loader/index.ts"
    },
    module: {
        ...baseconfig.module,
        rules: baseconfig.module.rules.slice(0, 3)
    }
    // output: {
    //     ...config.output,
    //     libraryTarget: "commonjs"
    // },
    // externalsType: "commonjs",
    // experiments: {
    //     ...config.experiments,
    //     outputModule: false
    // }
}


export default toolsconfig;
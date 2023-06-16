
import { baseconfig, alt1ExternalsFilter } from "./common.mjs";

/**@type {import("webpack").Configuration} */
let toolsconfig = {
    ...baseconfig,
    target: "node",
    entry: {
        "imagedata-loader/index": "./src/imagedata-loader/index.ts",
        "font-loader/index": "./src/font-loader/index.ts",
        "datapng-loader/index": "./src/datapng-loader/index.ts"
    },
    externals: baseconfig.externals.filter(q => q != alt1ExternalsFilter),
    resolve: {
        ...baseconfig.resolve,
        conditionNames: ["alt1-source"]
    }
}


export default toolsconfig;
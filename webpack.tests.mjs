
import path from "path";
import webpack from "webpack";
import baseconfig, { alt1ExternalsFilter, getAlt1RootLibName } from "./scripts/webpack.mjs";

/**@type {webpack.Configuration} */
let toolsconfig = {
    ...baseconfig,
    context: path.resolve(process.cwd(), "tests"),
    output: {
        ...baseconfig.output,
        path: path.resolve(process.cwd(), "dist/tests"),
    },
    entry: {
        "tests": "./index.ts",
    },
    // externals: [
    //     ...baseconfig.externals,
    //     alt1ExternalsFilter
    // ]
}


export default toolsconfig;
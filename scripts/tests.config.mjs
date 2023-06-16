
import path from "node:path";
import { baseconfig } from "./common.mjs";

/**@type {webpack.Configuration} */
let toolsconfig = {
    ...baseconfig,
    context: path.resolve(process.cwd(), "tests"),
    output: {
        ...baseconfig.output,
        path: path.resolve(process.cwd(), "dist/tests"),
        publicPath: "/tests/"
    },
    entry: {
        "tests": "./index.ts",
    },
    devServer: {
        static: "./dist",
        open: "/tests/index.html"
    }
}


export default toolsconfig;
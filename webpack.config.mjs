
import webpack from "webpack";
import fs from "fs";
import baseconfig from "./scripts/webpack.mjs";

let fontdirfiles = fs.readdirSync("./src/fonts");
let fontentries = fontdirfiles.map(filename => {
    let m = filename.match(/(\w+)\.fontmeta\.json/);
    return m && {
        filename: `./src/fonts/${filename}`,
        name: m[1],
        entryname: `fonts/${m[1]}`
    }
}).filter(q => q);

/**@type {webpack.Configuration} */
let fontsconfig = {
    ...baseconfig,
    entry: Object.fromEntries(fontentries.map(q => [q.entryname, q.filename])),
    externals: [
        ...baseconfig.externals,
        /^alt1\/.*/
    ]
}

/**@type {webpack.Configuration} */
let libsconfig = {
    ...baseconfig,
    entry: {
        "base/index": {
            import: "./src/base/index.ts"
        },
        "ocr/index": {
            import: "./src/ocr/index.ts",
            // dependOn: ["base/index"]
        },
        "chatbox/index": {
            import: "./src/chatbox/index.ts",
            // dependOn: ["base/index", "ocr/index", ...fontdeps]
        },
    },
    externals: [
        ...baseconfig.externals,
        /^alt1\/.*/
    ]
}

export default [
    fontsconfig,
    libsconfig
];

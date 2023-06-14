
import webpack from "webpack";
import fs from "fs";
import baseconfig from "./scripts/webpack.mjs";
import glob from "glob";

let fontdirfiles = fs.readdirSync("./src/fonts");
let fontentries = fontdirfiles.map(filename => {
    let m = filename.match(/(\w+)\.fontmeta\.json/);
    return m && {
        filename: `./src/fonts/${filename}`,
        name: m[1],
        entryname: `fonts/${m[1]}`
    }
}).filter(q => q);

let librootnames = {
    base: "A1lib",
    ocr: "OCR",
}

/**@type {webpack.Configuration["entry"]} */
let libentries = {};
let localExternals = {};
let packages = glob.sync("./src/*/index.ts");
for (let pack of packages) {
    let name = pack.match(/src\/([\w-]+)\/index.tsx?/)?.[1];
    if (name && name != "webpack" && !name.endsWith("-loader")) {

        /**@type {webpack.LibraryOptions["name"]} */
        let libname = {
            root: librootnames[name] ?? name.replace(/(^|-)\w?/, s => s.replace("-", "").toUpperCase()),
            commonjs: name,
            amd: name
        };

        /**@type {webpack.EntryObject[string]} */
        let entry = {
            import: pack,
            library: {
                type: "umd",
                name: libname
            }
        }
        libentries[`${name}/index`] = entry;
        localExternals[`alt1/${name}`] = { ...libname, commonjs2: name };
    }
}

/**@type {webpack.Configuration} */
let fontsconfig = {
    ...baseconfig,
    entry: Object.fromEntries(fontentries.map(q => [q.entryname, q.filename])),
    externals: [
        ...baseconfig.externals,
        localExternals
    ]
}

/**@type {webpack.Configuration} */
let libsconfig = {
    ...baseconfig,
    entry: libentries,
    externals: [
        ...baseconfig.externals,
        localExternals
    ]
}

export default [
    fontsconfig,
    libsconfig
];

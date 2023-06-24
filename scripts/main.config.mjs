
import webpack from "webpack";
import fs from "node:fs";
import glob from "glob";
import { baseconfig, getAlt1RootLibName } from "./common.mjs";
import path from "path";

/**
 * @param {Record<string,string|boolean>} env
 */
export default (env) => {

    let fontdir = path.resolve("./src/fonts");
    let fontdirfiles = glob.sync(fontdir + "/**/*.fontmeta.json");
    let fontentries = fontdirfiles.map(filename => {
        let relpath = path.relative(fontdir, filename);
        let m = relpath.match(/([\w\/\\]+)\.fontmeta\.json/);
        let fontname = m[1].replace(/\\/g, "/");
        return m && {
            filename: filename,
            name: fontname,
            entryname: `fonts/${fontname}`
        }
    }).filter(q => q);


    /**@type {webpack.Configuration["entry"]} */
    let libentries = {};
    let localExternals = {};
    let packagejsonexports = {};
    let packages = glob.sync("./src/*/index.ts");
    let windowexports = [];

    //redirects "alt1" to alt1/base
    packagejsonexports["."] = {
        "alt1-source": "./src/base/index.ts",
        "default": "./dist/base/index.js"
    };
    for (let pack of packages) {
        let name = pack.match(/src\/([\w-]+)\/index.tsx?/)?.[1];
        if (name) {
            let requireid = `alt1/${name}`;
            let rootname = getAlt1RootLibName(requireid);

            if (name != "webpack" && !name.endsWith("-loader")) {
                /**@type {webpack.EntryObject[string]} */
                let entry = {
                    import: pack,
                    library: {
                        type: "umd",
                        name: {
                            root: rootname,
                            commonjs: name,
                            amd: name
                        }
                    }
                }
                libentries[`${name}/index`] = entry;
                localExternals[`alt1/${name}`] = { root: rootname, commonjs2: requireid, commonjs: requireid, amd: requireid };
            }
            packagejsonexports[`./${name}`] = {
                "alt1-source": pack,
                "default": `./dist/${name}/index.js`
            };
            windowexports.push(`declare const ${rootname}: typeof import("./${name}");`);
        }
    }
    //explicitly mention fonts to help intellisense
    packagejsonexports["./fonts/*"] = {
        "alt1-source": "./src/fonts/*",
        "default": "./dist/fonts/*"
    }
    //backup generic catch all, not all tools support this so the explicit object is needed
    packagejsonexports["./*"] = {
        "alt1-source": ["./src/*/index.ts", "./src/*.ts"],
        "default": ["./dist/*/index.js", "./dist/*.js"]
    };
    let packagejson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

    /** 
     * @param {unknown} a 
     * @param {unknown} b 
     */
    function compareobj(a, b, pathstr = "obj") {
        if (a === b) { return ""; }
        if (typeof a != "object" || typeof b != "object") { return `value (${a},${b}) doesn't match at ${pathstr}`; }
        if (Array.isArray(a) != Array.isArray(b)) { return "diffing object and array at " + pathstr; }
        if (Array.isArray(a)) {
            if (a.length != b.length) { return "array length different at " + pathstr; }
        } else {
            let err = compareobj(Object.keys(a), Object.keys(b), pathstr + " keys");
            if (err) { return err; }
        }
        for (let key in a) {
            let err;
            if (err = compareobj(a[key], b[key], `${pathstr}[${JSON.stringify(key)}]`)) {
                return err;
            }
        }
        return "";
    }

    //make sure package.json exports are correct
    let exportsdiff = compareobj(packagejson.exports, packagejsonexports);
    if (exportsdiff) {
        if (env.fixexports) {
            packagejson.exports = packagejsonexports;
            fs.writeFileSync("./package.json", JSON.stringify(packagejson, undefined, "\t"));
            console.log("fixed package exports");
        } else {
            console.log("package exports do not match expected state, expected:");
            console.log(exportsdiff);
            console.log(JSON.stringify(packagejsonexports, undefined, "\t"))
        }
    }

    //add some typings for ppl that import from root
    fs.writeFileSync(path.resolve("./dist/windowexports.d.ts"), windowexports.join("\n"));


    /**@type {webpack.Configuration} */
    let improvedbase = {
        ...baseconfig,
        resolve: {
            ...baseconfig.resolve,
            conditionNames: ["alt1-source"]
        }
    }

    /**@type {webpack.Configuration} */
    let fontsconfig = {
        ...improvedbase,
        entry: Object.fromEntries(fontentries.map(q => [q.entryname, {
            import: q.filename,
            library: {
                type: "umd",
                name: {
                    root: ["Alt1Fonts", ...q.name.split("/")],
                    commonjs: q.name,
                    amd: q.name
                }
            }
        }]))
    }
    /**@type {webpack.Configuration} */
    let libsconfig = {
        ...improvedbase,
        entry: libentries
    }

    return [
        fontsconfig,
        libsconfig
    ];
}
// based on the webpack-emit-all-plugin npm package, edited to work on webpack 5 and added import renaming and some customization



import * as path from "path";
import { Compiler, Module, NormalModule } from "webpack";
import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";


type LiteralNode = acorn.Node & { raw: string, value: any };

export default class EmitAllPlugin {
	ignorePattern: RegExp;
	ignoreExternals: boolean;
	path: string | undefined;
	constructor(opts: { ignorePattern?: RegExp, ignoreExternals?: boolean, path?: string } = {}) {
		this.ignorePattern = opts.ignorePattern || /node_modules/;
		this.ignoreExternals = !!opts.ignoreExternals;
		this.path = opts.path;
	}

	shouldIgnore(path: string) {
		return this.ignorePattern.test(path);
	}

	replaceImportPaths(compiler: Compiler, path: string, src: string) {
		let sourceliteral = (node: LiteralNode) => {
			if (node.type == "Literal" && typeof node.value == "string") {
				if (node.value.startsWith(".")) {
					let newpath = this.rewritePath(compiler, path, node.value).relout;
					replaces.push({ node, replace: JSON.stringify(newpath) });
				}
			} else {
				console.log("non-literal or non-string import call ignored", node);
			}
		}
		let importDeclaration = (node: any) => {
			if (node.source) { sourceliteral(node.source); }
		}
		let importCall = (node: any) => {
			if (node.callee.type == "Identifier") {
				if (node.callee.name == "require" || node.callee.name == "import") {
					sourceliteral(node.arguments[0]);
				}
			}
		}

		let ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
		let replaces: { node: LiteralNode, replace: string }[] = [];
		acornWalk.simple(ast, {
			ExportAllDeclaration: importDeclaration,
			ExportNamedDeclaration: importDeclaration,
			ImportDeclaration: importDeclaration,
			CallExpression: importCall
		});

		let slices: string[] = [];
		let index = 0;
		for (let part of replaces) {
			slices.push(src.slice(index, part.node.start));
			slices.push(part.replace);
			index = part.node.end;
		}
		slices.push(src.slice(index));
		return slices.join("");
	}

	rewritePath(compiler: Compiler, currentpath: string, importpath: string) {
		const absolutePath = path.resolve(path.dirname(currentpath), importpath);
		const projectRoot = compiler.context;
		const out = this.path || compiler.options.output.path!;
		let rel = path.parse(path.relative(projectRoot, absolutePath));
		let newname = rel.name.replace(/\..*/, "") + (rel.base == "" ? "index" : "") + ".js";
		let relout = "./" + path.join(rel.dir.replace(/\.\./g, "_"), newname).replace(/\\/g, "/");
		let absout = path.join(out, relout).replace(/\\/g, "/");
		return { absout, relout }
	}

	handleModule(compiler: Compiler, mod: Module) {
		debugger;
		if (!(mod instanceof NormalModule)) { return; }
		if (!mod.type.match(/^javascript\//)) { return; }
		const absolutePath = mod.resource;
		if (!absolutePath) { return; }
		if (this.ignoreExternals && (mod as any).external) { return; }
		if (this.shouldIgnore(absolutePath)) { return; }

		let dest = this.rewritePath(compiler, mod.context!, absolutePath).absout;

		const source = (mod as any)._source?._valueAsString ?? (mod as any)._source?._value ?? "";
		const editedsource = this.replaceImportPaths(compiler, absolutePath, source);
		(compiler.outputFileSystem.mkdir as any)(
			path.dirname(dest),
			{ recursive: true },
			err => {
				if (err) throw err;
				compiler.outputFileSystem.writeFile(dest, editedsource, err => {
					if (err) throw err;
				});
			}
		);
	}

	apply(compiler: Compiler) {
		compiler.hooks.compilation.tap("EmitAllPlugin", (comp, params) => {
			comp.hooks.succeedModule.tap("EmitAllPlugin", (mod) => {
				this.handleModule(compiler, mod);
			});
		})
		// compiler.hooks.afterCompile.tapAsync(
		// 	'EmitAllPlugin',
		// 	(compilation, cb) => {
		// 		compilation.modules.forEach(mod => {
		// 			//this.handleModule(compiler, mod);
		// 		});
		// 		cb();
		// 	}
		// );
	}
};

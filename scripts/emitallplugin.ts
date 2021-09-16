// based on the webpack-emit-all-plugin npm package, edited to work on webpack 5 and some customization



import * as path from "path";
import { Compiler, NormalModule } from "webpack";

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

	apply(compiler: Compiler) {

		compiler.hooks.afterCompile.tapAsync(
			'EmitAllPlugin',
			(compilation, cb) => {
				compilation.modules.forEach(mod => {
					if (!(mod instanceof NormalModule)) { return; }
					if (!mod.type.match(/^javascript\//)) { return; }
					const absolutePath = mod.resource;
					if (!absolutePath) { return; }
					if (this.ignoreExternals && (mod as any).external) { return; }
					if (this.shouldIgnore(absolutePath)) { return; }

					const source = (mod as any)._source?._valueAsString ?? "";
					const projectRoot = compiler.context;
					const out = this.path || compiler.options.output.path!;
					let rel = path.parse(path.relative(projectRoot, absolutePath));
					let newname = rel.name.replace(/^([^\.]+)(\.*)/, (m, a) => a + ".js");
					const dest = path.join(out, rel.dir.replace(/\.\./g, "_"), newname);
					(compiler.outputFileSystem.mkdir as any)(
						path.dirname(dest),
						{ recursive: true },
						err => {
							if (err) throw err;
							compiler.outputFileSystem.writeFile(dest, source, err => {
								if (err) throw err;
							});
						}
					);
				});
				cb();
			}
		);
	}
};

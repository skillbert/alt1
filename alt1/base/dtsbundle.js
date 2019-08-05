var dts = require("dts-bundle");

dts.bundle({
	name: "@alt1/base",
	main: "dist/index.d.ts",
	out: "bundled.d.ts",
	indent:"\t"
});
var ts = require("typescript");

var q=ts.createProgram([],{

},{

});

var qq = ts.transpileModule("var a=1;", { fileName: "test.ts", compilerOptions: { "sourceMap": true, declaration: true, emitDeclarationOnly: true } });
debugger;
/// <reference path="../shims.d.ts"/>
import "./index.html";

import dialog from "./dialog";
import chatbox from "./chatbox";
import buffs from "./buffs";
import bosstimer from "./bosstimer";

let tests = { dialog, chatbox, buffs, bosstimer };

async function runtest(run: () => Promise<void>) {
    await run();
}

for (let testname in tests) {
    let btn = document.createElement("a");
    btn.innerText = testname;
    btn.style.display = "block";
    btn.onclick = () => runtest(tests[testname]);
    btn.href = "#" + testname;
    document.body.append(btn);
}

if (document.location.hash) {
    let test = tests[document.location.hash.slice(1)];
    runtest(test);
}



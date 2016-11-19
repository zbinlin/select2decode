"use strict";

const fs = require("fs");
const path = require("path");
const pkg = require("./package.json");
const source = require("./src/manifest.json");

source.version = pkg.version;
if (/^firefox$/i.test(process.env.BUILD_TARGET)) {
    source.applications = {
        "gecko": {
            "id": "{d4d3b34f-0f12-4a00-8663-e8efb691f13a}",
        },
    };
}

const dest = JSON.stringify(source, null, "    ");
fs.writeFileSync(path.join(process.cwd(), "./dist/manifest.json"), dest);

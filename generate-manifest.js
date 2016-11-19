"use strict";

const fs = require("fs");
const path = require("path");
const pkg = require("./package.json");
const source = require("./src/manifest.json");

source.version = pkg.version;
if (/^firefox$/i.test(process.env.BUILD_TARGET)) {
    source.applications = {
        "gecko": {
            "id": "something@mozilla.org",
        },
    };
}

const dest = JSON.stringify(source, null, "    ");
fs.writeFileSync(path.join(process.cwd(), "./dist/manifest.json"), dest);

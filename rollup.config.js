"use strict";

import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";

const BUILD_TARGET = process.env.BUILD_TARGET;

export default {
    moduleName: `${BUILD_TARGET}ScriptMain`,
    entry: `./src/javascripts/${BUILD_TARGET}.js`,
    dest: `./dist/javascripts/${BUILD_TARGET}.js`,
    format: "iife",
    sourceMap: false,
    globals: {
        "text-encoding": "window",
    },
    plugins: [
        nodeResolve({
            module: true,
            jsnext: true,
            browser: true,
            skip: ["text-encoding"],
        }),
        commonjs(),
        babel({
            presets: [
                [
                    "latest", {
                        es2015: false,
                    },
                ],
                "es2015-rollup",
            ],
        }),
        uglify(),
    ],
};

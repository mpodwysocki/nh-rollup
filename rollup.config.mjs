import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import multiEntry from "@rollup/plugin-multi-entry";
import sourcemaps from "rollup-plugin-sourcemaps";
import nodeBuiltins from "builtin-modules";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import shim from "rollup-plugin-shim";
import outputSize from 'rollup-plugin-output-size';

export default {
	input: "./dist-esm/src/index.mjs",
	output: {
		file: "./dist/bundle.js",
		format: "umd",
    sourcemap: true,
    globals: {
      "dotenv": "dotenv",
    }
	},
  external: [
    ...nodeBuiltins,
    "dotenv"
  ],
  plugins: [
    outputSize(),
    shim({
      dotenv: `export function config() { }`,
    }),
    nodePolyfills({
      include: [ "process" ],
    }),
    sourcemaps(),
    multiEntry({ exports: false }),
    commonjs(),
    nodeResolve({
      mainFields: ["module", "browser"],
      preferBuiltins: false
    }),
    json(),
  ],
};

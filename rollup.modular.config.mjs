import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import multiEntry from "@rollup/plugin-multi-entry";
import sourcemaps from "rollup-plugin-sourcemaps";
import nodeBuiltins from "builtin-modules";
import nodePolyfills from "rollup-plugin-polyfill-node";
import shim from "rollup-plugin-shim";
import outputSize from "rollup-plugin-output-size";
import { visualizer } from "rollup-plugin-visualizer";

export default {
	input: "./dist-esm/src/modular.mjs",
	output: {
		file: "./dist/modular.bundle.js",
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
    nodePolyfills(),
    sourcemaps(),
    multiEntry({ exports: false }),
    commonjs(),
    nodeResolve({
      mainFields: ["module", "browser"],
      preferBuiltins: false
    }),
    json(),
    visualizer({
      filename: "./stats.modular.html",
    }),
  ],
};

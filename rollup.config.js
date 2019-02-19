"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import progress from "rollup-plugin-progress";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";

let cfg;
const dest = process.env.DEST;
if (!dest) {
	console.log(
		"No destination specified - code will be compiled but not uploaded"
	);
} else if ((cfg = require("./screeps.json")[dest]) == null) {
	throw new Error("Invalid upload destination");
}

const ignoreWarnings = ["Circular dependency"];

export default {
	treeshake: false,
	input: "src/main.ts",
	output: {
		file: "dist/main.js",
		format: "cjs",
		sourcemap: true,
		banner:
			"//\n" +
			"// _______________________________________________________\n" +
			"//\n" +
			"// _______  _____   ______ _______ _______  _____  _______\n" +
			"// |______ |   __| |_____/ |______ |______ |_____] |______\n" +
			"// ______| |____\\| |    \\_ |______ |______ |       ______|\n" +
			"//\n" +
			"// _____________________ Screeps AI ______________________\n" +
			"//\n" +
			"//\n" +
			"// Sqreeps AI repository: github.com/qnimbus/sqreeps\n" +
			"//\n",
	},

	plugins: [
		clear({ targets: ["dist"] }),
		progress({ clearLine: true }),
		resolve(),
		commonjs(),
		typescript({ tsconfig: "./tsconfig.json" }),
		screeps({ config: cfg, dryRun: cfg == null }),
	],

	onwarn: function (warning) {
		// Skip default export warnings from using obfuscated overmind file in main
		for (let ignoreWarning of ignoreWarnings) {
			if (warning.toString().includes(ignoreWarning)) {
				return;
			}
		}
		// console.warn everything else
		console.warn(warning.message);
	},
};

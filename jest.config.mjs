import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
	preset: "ts-jest",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest"
	},
	testMatch: ["**/*.test.ts"],
	moduleFileExtensions: ["js", "jsx", "ts", 'tsx', "json", "node"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	transformIgnorePatterns: [
		'/node_modules/(?!@prisma/client|out-of-node-modules-esm-package-if-any)/',
		'/generated/prisma'
	],
	moduleNameMapper: {
		'^(\\.\\/\\.?.*)\\.js$': '$1',
	},
	globals: {
		'ts-jest': {
			tsconfig: {
				module: 'ESNext',
				moduleResolution: 'node',
			},
			useESM: true
		}
	}
};





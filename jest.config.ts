import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    moduleNameMapper: {
        "^memo0-ts$": "<rootDir>/src/index.ts",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/examples/"],
};

export default config;

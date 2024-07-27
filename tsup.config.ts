import { defineConfig } from "tsup";

export default defineConfig({
    format: ["cjs", "esm"],
    entry: ["src/**/*.{ts,tsx}"], // 使用 glob 模式匹配所有要打包的文件
    dts: true,
    splitting: false, // 不進行程式碼拆分
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    sourcemap: true,
});

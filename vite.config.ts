import { defineConfig } from "vite-plus";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// VS Code extensions are CommonJS and must externalize the `vscode` module.
// Vitest shares this config: unit tests run against the pure TS source.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/extension.ts"),
      formats: ["cjs"],
      fileName: () => "extension.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: ["vscode"],
    },
  },
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
  },
});

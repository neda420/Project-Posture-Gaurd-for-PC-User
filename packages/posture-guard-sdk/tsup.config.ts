import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
  treeshake: true,
  // Peer deps should never be bundled.
  external: [
    "@tensorflow/tfjs",
    "@tensorflow-models/pose-detection",
  ],
});

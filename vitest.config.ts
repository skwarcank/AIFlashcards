import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    clearMocks: true,
    exclude: ["tests/e2e/**", "**/node_modules/**", "**/.next/**", "**/coverage/**"],
    coverage: {
      exclude: [
        "**/*.test.{ts,tsx}",
        ".next/**",
        "coverage/**",
        "next-env.d.ts",
        "lib/test-setup.ts",
        "lib/test-utils/**",
      ],
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage",
    },
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
    setupFiles: ["./lib/test-setup.ts"],
    unstubGlobals: true,
  },
});

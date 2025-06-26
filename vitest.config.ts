import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    testMatch: ["**/*.test.ts", "**/*.test.tsx"],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});

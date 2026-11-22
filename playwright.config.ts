import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:5174";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  use: { baseURL },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5174 --strictPort",
    url: baseURL,
  },
});
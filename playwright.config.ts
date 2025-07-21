import { defineConfig, devices } from "@playwright/test";

import type { TestOptions } from "./fixtures/testOptions";

require("dotenv").config();

export default defineConfig<TestOptions>({
  // global setting
  timeout: 10000,
  globalTimeout: 60000,
  expect: {
    timeout: 2000,
  },

  testDir: "./tests",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["json", { outputFile: "test-results/jsonReport.json" }],
    ["junit", { outputFile: "test-results/junitReport.xml" }],
    ["allure-playwright"],
  ],
  // runtime setting
  use: {
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
    baseURL:
      process.env.DEV === "1"
        ? "http://localhost:4201/"
        : process.env.STAGING === "1"
        ? "http://localhost:4202/"
        : "http://localhost:4200/",
    trace: "on-first-retry",
    actionTimeout: 5000,
    navigationTimeout: 50000,
    video: {
      mode: "off",
      size: { width: 1920, height: 1080 },
    },
  },

  // project settings
  projects: [
    {
      name: "dev",
      use: {
        ...devices["Desktop Chrome"],
        // baseURL: "http://dev-localhost:4201/",
      },
      fullyParallel: true,
    },
    // {
    //   name: "staging",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     baseURL: "http://stg-localhost:4202/",
    //   },
    //   fullyParallel: true
    // },
    {
      name: "chromium",
      timeout: 60000,
    },

    {
      name: "firefox",
      use: {
        browserName: "firefox",
        video: {
          mode: "on",
          size: { width: 1920, height: 1080 },
        },
      },
    },
    {
      name: "mobile",
      testMatch: "testMobile.spec.ts",
      use: {
        ...devices["iPhone 13 Pro"],
      },
    },
  ],
});

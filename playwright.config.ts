import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration.
 *
 * Tests run against a PRODUCTION build (next build + next start) on port
 * 3100, not the dev server. The dev server compiles routes on first hit,
 * which makes API responses slow or flaky mid-compilation - the production
 * server is deterministic and is also what actually ships.
 *
 * Port 3100 keeps the test server isolated from any dev server you have
 * running on 3000. First startup takes ~30-60s because of the build step.
 *
 * Both projects run on Chromium (Pixel 7 is a Chromium device profile),
 * so only `npx playwright install chromium` is ever needed. To also test
 * real mobile Safari rendering, run `npx playwright install webkit` and
 * add a project using devices["iPhone 13"].
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    // Production server is fast, but give animations and counters room.
    timeout: 10_000,
  },
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // iPad Mini's viewport/touch profile (768x1024, a genuinely common real
    // tablet size) with the engine forced to Chromium - Playwright's iOS
    // device presets default to WebKit, which isn't installed here or
    // required; only `npx playwright install chromium` is needed for all
    // three projects.
    {
      name: "tablet",
      use: { ...devices["iPad Mini"], defaultBrowserType: "chromium" },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
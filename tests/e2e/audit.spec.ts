import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("#audit").scrollIntoViewIfNeeded();
});

test("example scores animate in when scrolled into view", async ({ page }) => {
  await expect(page.locator(".score-num")).not.toHaveText("–", {
    timeout: 5_000,
  });
  await expect(page.locator(".bar-row")).toHaveCount(5);
});

test("empty input shows a friendly error", async ({ page }) => {
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".audit-error")).toContainText(
    "enter a website address"
  );
});

test("private address (localhost) is refused", async ({ page }) => {
  await page.getByLabel("Your website address").fill("localhost");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".audit-error")).toContainText(
    "Private or internal"
  );
});

test("private address (127.0.0.1) is refused", async ({ page }) => {
  await page.getByLabel("Your website address").fill("127.0.0.1");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".audit-error")).toContainText(
    "Private or internal"
  );
});

test("cloud metadata address (169.254.169.254) is refused", async ({ page }) => {
  await page.getByLabel("Your website address").fill("169.254.169.254");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".audit-error")).toContainText(
    "Private or internal"
  );
});

test("private address (10.0.0.1) is refused", async ({ page }) => {
  await page.getByLabel("Your website address").fill("10.0.0.1");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".audit-error")).toContainText(
    "Private or internal"
  );
});

test("private address (192.168.1.1) is refused", async ({ page }) => {
  await page.getByLabel("Your website address").fill("192.168.1.1");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".audit-error")).toContainText(
    "Private or internal"
  );
});

test("non-URL input is handled gracefully", async ({ page }) => {
  await page.getByLabel("Your website address").fill("not a url %%%");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".audit-error")).toBeVisible();
});

test("enter key triggers the audit", async ({ page }) => {
  await page.getByLabel("Your website address").fill("localhost");
  await page.getByLabel("Your website address").press("Enter");
  await expect(page.locator(".audit-error")).toBeVisible();
});

test("successful check renders scores, findings and contact nudge", async ({
  page,
}) => {
  // Register the mock BEFORE navigating so it is guaranteed active.
  await page.route("**/api/audit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "https://example.co.nz",
        https: true,
        total: 62,
        verdict: "Solid bones, but real opportunities are being left on the table.",
        scores: {
          message: 80,
          action: 45,
          content: 70,
          foundations: 60,
          credibility: 55,
        },
        findings: [
          { category: "message", message: "Looking solid here." },
          { category: "action", message: "No way for visitors to call." },
          { category: "content", message: "Content is thin." },
          { category: "foundations", message: "Missing structural elements." },
          { category: "credibility", message: "No phone number visible." },
        ],
      }),
    })
  );

  await page.goto("/");
  await page.locator("#audit").scrollIntoViewIfNeeded();
  await page.getByLabel("Your website address").fill("example.co.nz");
  await page.getByRole("button", { name: /check my site/i }).click();

  await expect(page.locator(".score-num")).toHaveText("62");
  // Five findings plus the "get in touch" nudge
  await expect(page.locator(".finding")).toHaveCount(6);
  // The nudge links to contact
  await page.getByRole("link", { name: /get in touch/i }).click();
  await expect(page.locator("#contact")).toBeInViewport();
});

test("findings do not contain prescriptive technical advice", async ({
  page,
}) => {
  // Register the mock BEFORE navigating so it is guaranteed active.
  await page.route("**/api/audit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "https://bad.example",
        https: false,
        total: 22,
        verdict: "Working against you.",
        scores: { message: 20, action: 10, content: 30, foundations: 25, credibility: 15 },
        findings: [
          { category: "message", message: "The page doesn't have a clear main heading." },
          { category: "action", message: "There's no way for mobile visitors to call." },
          { category: "content", message: "The amount of text is working against you." },
          { category: "foundations", message: "The page isn't configured for mobile." },
          { category: "credibility", message: "The site isn't secure." },
        ],
      }),
    })
  );

  await page.goto("/");
  await page.locator("#audit").scrollIntoViewIfNeeded();
  await page.getByLabel("Your website address").fill("bad.example");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".score-num")).toHaveText("22");

  // Findings should diagnose, NOT prescribe fixes (no free consulting)
  const findingsText = await page.locator(".findings").innerText();
  expect(findingsText).not.toContain("tel:");
  expect(findingsText).not.toContain("meta description");
  expect(findingsText).not.toContain("viewport tag");
  expect(findingsText).not.toContain("h1");
  expect(findingsText).not.toContain("alt text");
});
test.describe("audit card stays visible on submit (regression)", () => {
  test("card does not disappear after clicking check", async ({ page }) => {
    // Mock the audit API so we get a deterministic response.
    await page.route("**/api/audit", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://example.co.nz",
          https: true,
          total: 72,
          verdict: "In good shape",
          scores: { message: 80, action: 70, content: 70, foundations: 75, credibility: 65 },
          findings: [],
        }),
      })
    );
    await page.goto("/#audit");
    const card = page.locator(".audit-card");
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();

    await page.getByLabel("Your website address").fill("example.co.nz");
    await page.getByRole("button", { name: /check my site/i }).click();

    // After submit the card MUST remain visible (was disappearing because a
    // React re-render stripped the observer-added .on class).
    await expect(card).toBeVisible();
    // And the score should update to the mocked value.
    await expect(page.locator(".score-num")).toContainText("72");
  });

  test("card shows a calm kiwi status line while loading (no rapid cycling)", async ({ page }) => {
    await page.route("**/api/audit", async (route) => {
      // Delay so we can observe the scanning state.
      await new Promise((r) => setTimeout(r, 500));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://example.co.nz", https: true, total: 60,
          verdict: "ok", scores: { message: 60, action: 60, content: 60, foundations: 60, credibility: 60 }, findings: [],
        }),
      });
    });
    await page.goto("/#audit");
    await page.locator(".audit-card").scrollIntoViewIfNeeded();
    await page.getByLabel("Your website address").fill("example.co.nz");
    await page.getByRole("button", { name: /check my site/i }).click();
    // While in flight the card carries .scanning and the status line shows
    // one of the casual kiwi messages.
    await expect(page.locator(".audit-card.scanning")).toBeVisible();
    await expect(page.locator(".score-verdict")).toContainText(
      /grabbing|having a read|seeing how|checking the words|under the bonnet|earns some trust|tallying/i
    );
  });

  test("category values show a calm dash while scanning, not spinning numbers", async ({ page }) => {
    await page.route("**/api/audit", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://example.co.nz", https: true, total: 60,
          verdict: "ok", scores: { message: 60, action: 60, content: 60, foundations: 60, credibility: 60 }, findings: [],
        }),
      });
    });
    await page.goto("/#audit");
    await page.locator(".audit-card").scrollIntoViewIfNeeded();
    await page.getByLabel("Your website address").fill("example.co.nz");
    await page.getByRole("button", { name: /check my site/i }).click();
    // Category values must be a static dash during scan (the rapid random
    // number cycling was removed for photosensitivity safety).
    await expect(page.locator(".bar-val").first()).toHaveText("–");
  });
});

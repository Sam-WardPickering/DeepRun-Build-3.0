# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: audit.spec.ts >> findings do not contain prescriptive technical advice
- Location: tests\e2e\audit.spec.ts:115:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.score-num')
Expected: "22"
Received: "42"
Timeout:  8000ms

Call log:
  - Expect "toHaveText" with timeout 8000ms
  - waiting for locator('.score-num')
    6 × locator resolved to <span class="score-num">–</span>
      - unexpected value "–"
    - locator resolved to <span class="score-num">33</span>
    - unexpected value "33"
    11 × locator resolved to <span class="score-num">42</span>
       - unexpected value "42"

```

```yaml
- text: "42"
```

# Test source

```ts
  41  |   await expect(page.locator(".audit-error")).toContainText(
  42  |     "Private or internal"
  43  |   );
  44  | });
  45  | 
  46  | test("private address (10.0.0.1) is refused", async ({ page }) => {
  47  |   await page.getByLabel("Your website address").fill("10.0.0.1");
  48  |   await page.getByRole("button", { name: /check my site/i }).click();
  49  |   await expect(page.locator(".audit-error")).toContainText(
  50  |     "Private or internal"
  51  |   );
  52  | });
  53  | 
  54  | test("private address (192.168.1.1) is refused", async ({ page }) => {
  55  |   await page.getByLabel("Your website address").fill("192.168.1.1");
  56  |   await page.getByRole("button", { name: /check my site/i }).click();
  57  |   await expect(page.locator(".audit-error")).toContainText(
  58  |     "Private or internal"
  59  |   );
  60  | });
  61  | 
  62  | test("non-URL input is handled gracefully", async ({ page }) => {
  63  |   await page.getByLabel("Your website address").fill("not a url %%%");
  64  |   await page.getByRole("button", { name: /check my site/i }).click();
  65  |   await expect(page.locator(".audit-error")).toBeVisible();
  66  | });
  67  | 
  68  | test("enter key triggers the audit", async ({ page }) => {
  69  |   await page.getByLabel("Your website address").fill("localhost");
  70  |   await page.getByLabel("Your website address").press("Enter");
  71  |   await expect(page.locator(".audit-error")).toBeVisible({ timeout: 5_000 });
  72  | });
  73  | 
  74  | test("successful check renders scores, findings and contact nudge", async ({
  75  |   page,
  76  | }) => {
  77  |   await page.route("**/api/audit", (route) =>
  78  |     route.fulfill({
  79  |       status: 200,
  80  |       contentType: "application/json",
  81  |       body: JSON.stringify({
  82  |         url: "https://example.co.nz",
  83  |         https: true,
  84  |         total: 62,
  85  |         verdict: "Solid bones, but real opportunities are being left on the table.",
  86  |         scores: {
  87  |           message: 80,
  88  |           action: 45,
  89  |           content: 70,
  90  |           foundations: 60,
  91  |           credibility: 55,
  92  |         },
  93  |         findings: [
  94  |           { category: "message", message: "Looking solid here." },
  95  |           { category: "action", message: "No way for visitors to call." },
  96  |           { category: "content", message: "Content is thin." },
  97  |           { category: "foundations", message: "Missing structural elements." },
  98  |           { category: "credibility", message: "No phone number visible." },
  99  |         ],
  100 |       }),
  101 |     })
  102 |   );
  103 | 
  104 |   await page.getByLabel("Your website address").fill("example.co.nz");
  105 |   await page.getByRole("button", { name: /check my site/i }).click();
  106 | 
  107 |   await expect(page.locator(".score-num")).toHaveText("62", { timeout: 8_000 });
  108 |   // Five findings plus the "get in touch" nudge
  109 |   await expect(page.locator(".finding")).toHaveCount(6);
  110 |   // The nudge links to contact
  111 |   await page.getByRole("link", { name: /get in touch/i }).click();
  112 |   await expect(page.locator("#contact")).toBeInViewport();
  113 | });
  114 | 
  115 | test("findings do not contain prescriptive technical advice", async ({
  116 |   page,
  117 | }) => {
  118 |   await page.route("**/api/audit", (route) =>
  119 |     route.fulfill({
  120 |       status: 200,
  121 |       contentType: "application/json",
  122 |       body: JSON.stringify({
  123 |         url: "https://bad.example",
  124 |         https: false,
  125 |         total: 22,
  126 |         verdict: "Working against you.",
  127 |         scores: { message: 20, action: 10, content: 30, foundations: 25, credibility: 15 },
  128 |         findings: [
  129 |           { category: "message", message: "The page doesn't have a clear main heading." },
  130 |           { category: "action", message: "There's no way for mobile visitors to call." },
  131 |           { category: "content", message: "The amount of text is working against you." },
  132 |           { category: "foundations", message: "The page isn't configured for mobile." },
  133 |           { category: "credibility", message: "The site isn't secure." },
  134 |         ],
  135 |       }),
  136 |     })
  137 |   );
  138 | 
  139 |   await page.getByLabel("Your website address").fill("bad.example");
  140 |   await page.getByRole("button", { name: /check my site/i }).click();
> 141 |   await expect(page.locator(".score-num")).toHaveText("22", { timeout: 8_000 });
      |                                            ^ Error: expect(locator).toHaveText(expected) failed
  142 | 
  143 |   // Findings should diagnose, NOT prescribe fixes (no free consulting)
  144 |   const findingsText = await page.locator(".findings").innerText();
  145 |   expect(findingsText).not.toContain("tel:");
  146 |   expect(findingsText).not.toContain("meta description");
  147 |   expect(findingsText).not.toContain("viewport tag");
  148 |   expect(findingsText).not.toContain("h1");
  149 |   expect(findingsText).not.toContain("alt text");
  150 | });
  151 | 
```
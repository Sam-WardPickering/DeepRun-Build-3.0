# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> SSRF protection >> blocks private address: 192.168.0.1
- Location: tests\e2e\security.spec.ts:30:9

# Error details

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * Security-focused tests for the audit API route.
  5   |  * These verify the SSRF guard, input validation, and response behaviour
  6   |  * under adversarial input. No SQL injection surface exists (no database),
  7   |  * but we test equivalent injection patterns through the URL input.
  8   |  */
  9   | 
  10  | const API = "/api/audit";
  11  | 
  12  | test.describe("SSRF protection", () => {
  13  |   const privateAddresses = [
  14  |     "localhost",
  15  |     "127.0.0.1",
  16  |     "127.0.0.2",
  17  |     "10.0.0.1",
  18  |     "10.255.255.255",
  19  |     "172.16.0.1",
  20  |     "172.31.255.255",
  21  |     "192.168.0.1",
  22  |     "192.168.1.100",
  23  |     "169.254.169.254",  // AWS/cloud metadata endpoint
  24  |     "[::1]",
  25  |     "localhost:8080",
  26  |     "127.0.0.1:3000",
  27  |   ];
  28  | 
  29  |   for (const addr of privateAddresses) {
  30  |     test(`blocks private address: ${addr}`, async ({ request }) => {
  31  |       const res = await request.post(API, {
  32  |         data: { url: addr },
  33  |       });
> 34  |       const body = await res.json();
      |                    ^ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  35  |       expect(body.error).toContain("Private or internal");
  36  |     });
  37  |   }
  38  | 
  39  |   test("blocks file:// protocol", async ({ request }) => {
  40  |     const res = await request.post(API, {
  41  |       data: { url: "file:///etc/passwd" },
  42  |     });
  43  |     expect(res.ok()).toBe(false);
  44  |   });
  45  | 
  46  |   test("blocks ftp:// protocol", async ({ request }) => {
  47  |     const res = await request.post(API, {
  48  |       data: { url: "ftp://example.com" },
  49  |     });
  50  |     expect(res.ok()).toBe(false);
  51  |   });
  52  | 
  53  |   test("blocks javascript: protocol", async ({ request }) => {
  54  |     const res = await request.post(API, {
  55  |       data: { url: "javascript:alert(1)" },
  56  |     });
  57  |     expect(res.ok()).toBe(false);
  58  |   });
  59  | });
  60  | 
  61  | test.describe("input validation", () => {
  62  |   test("empty URL returns 400", async ({ request }) => {
  63  |     const res = await request.post(API, { data: { url: "" } });
  64  |     expect(res.status()).toBe(400);
  65  |     const body = await res.json();
  66  |     expect(body.error).toBeTruthy();
  67  |   });
  68  | 
  69  |   test("missing URL field returns 400", async ({ request }) => {
  70  |     const res = await request.post(API, { data: {} });
  71  |     expect(res.status()).toBe(400);
  72  |   });
  73  | 
  74  |   test("invalid JSON body returns 400", async ({ request }) => {
  75  |     const res = await request.post(API, {
  76  |       headers: { "Content-Type": "application/json" },
  77  |       data: "not json at all",
  78  |     });
  79  |     expect(res.status()).toBe(400);
  80  |   });
  81  | 
  82  |   test("extremely long URL is handled gracefully", async ({ request }) => {
  83  |     const longUrl = "https://example.com/" + "a".repeat(5000);
  84  |     const res = await request.post(API, { data: { url: longUrl } });
  85  |     // Should either return an error or handle it - never crash
  86  |     expect([400, 502]).toContain(res.status());
  87  |   });
  88  | 
  89  |   test("URL with SQL injection patterns is handled safely", async ({ request }) => {
  90  |     const injections = [
  91  |       "'; DROP TABLE users; --",
  92  |       "1 OR 1=1",
  93  |       "' UNION SELECT * FROM users --",
  94  |       "<script>alert('xss')</script>",
  95  |     ];
  96  |     for (const payload of injections) {
  97  |       const res = await request.post(API, {
  98  |         data: { url: payload },
  99  |       });
  100 |       // Should return a validation error, never crash
  101 |       expect(res.status()).toBeLessThan(500);
  102 |     }
  103 |   });
  104 | 
  105 |   test("URL with XSS payload in response does not echo raw HTML", async ({ request }) => {
  106 |     const res = await request.post(API, {
  107 |       data: { url: '<img src=x onerror=alert(1)>' },
  108 |     });
  109 |     const body = await res.json();
  110 |     // The error message should not echo the raw input back
  111 |     if (body.error) {
  112 |       expect(body.error).not.toContain("<img");
  113 |       expect(body.error).not.toContain("onerror");
  114 |     }
  115 |   });
  116 | });
  117 | 
  118 | test.describe("API response shape", () => {
  119 |   test("successful response has expected fields", async ({ request, page }) => {
  120 |     // Mock at the page level to intercept
  121 |     await page.goto("/");
  122 |     await page.route("**/api/audit", (route) =>
  123 |       route.fulfill({
  124 |         status: 200,
  125 |         contentType: "application/json",
  126 |         body: JSON.stringify({
  127 |           url: "https://example.co.nz",
  128 |           https: true,
  129 |           total: 50,
  130 |           verdict: "Test verdict.",
  131 |           scores: { message: 50, action: 50, content: 50, foundations: 50, credibility: 50 },
  132 |           findings: [
  133 |             { category: "message", message: "test" },
  134 |             { category: "action", message: "test" },
```
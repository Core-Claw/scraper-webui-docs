---
title: Fingerprint Browser
description: 指纹浏览器
sidebar:
    order: 2
---

## Fingerprint Browser Environment Overview

To handle **fingerprinting browser and automation detection** on modern websites, the platform **automatically provisions and hosts an isolated browser fingerprint environment** during script execution.

This environment is used for operations that require a real browser context, such as **JavaScript rendering, page interaction, login sessions, and authenticated access**.

The fingerprint environment is fully maintained by the platform. **Developers do not need to deploy, purchase, or manage fingerprint browser instances** to access a stable and reliable browser runtime.

This mechanism effectively reduces failures and account-linking risks caused by repeated device characteristics or duplicated browser fingerprints.

## Fingerprint Environment Configuration

| Parameter                   | Value                                      |
| --------------------------- | ------------------------------------------ |
| **Browser Type**            | Chromium (platform-hosted remote instance) |
| **Connection Method**       | `WebSocket`                                |
| **Access Endpoint**         | Internal platform browser service          |
| **Authentication Variable** | `PROXY_AUTH`                               |
| **Auth Format**             | `username:password`                        |
| **Pricing**                 | Built-in, no extra cost                    |

---

## Python Example

```python
try:
    Auth = os.environ.get("PROXY_AUTH")
    CafeSDK.Log.info(f"Current browser auth info: {Auth}")
except Exception as e:
    CafeSDK.Log.error(f"Failed to get browser auth info: {e}")
    Auth = None

# Remote fingerprint browser WebSocket address
browser_url = f'ws://{Auth}@chrome-ws-inner.coreclaw.com'

CafeSDK.Log.info(f"Using remote browser address: {browser_url}")

# Verify outbound IP via ipinfo
test_url = "https://ipinfo.io/ip"

company_overview = GlassdoorCrawlerCompanyOverview(
    browser_url=browser_url
)

status, soup = await company_overview.fetch_with_playwright(test_url)

# Output result
if soup:
    ip_text = soup.get_text(strip=True)
    CafeSDK.Log.info(f"Current outbound IP: {ip_text}")
else:
    CafeSDK.Log.error("Failed to retrieve page content")

CafeSDK.Log.info(f"Response status code: {status}")
```

## Go Example

```go
ctx := context.Background()

// Read PROXY_AUTH
auth := os.Getenv("PROXY_AUTH")
CafeSDK.Log.Info(fmt.Sprintf("Current browser auth info: %s", auth))

// Build remote browser WS address
browserURL := "ws://chrome-ws-inner.coreclaw.com"
if auth != "" {
    browserURL = fmt.Sprintf("ws://%s@chrome-ws-inner.coreclaw.com", auth)
}
CafeSDK.Log.Info(ctx, "Using remote browser address: %s", browserURL)

// Start Playwright
pw, err := playwright.Run()
if err != nil {
    CafeSDK.Log.Error(ctx, "Failed to start Playwright: %v", err)
    return
}
defer playwright.Stop()

// Connect to remote fingerprint browser
browser, err := pw.Chromium.ConnectOverCDP(browserURL)
if err != nil {
    CafeSDK.Log.Error(ctx, "Failed to connect to browser: %v", err)
    return
}
defer browser.Close()

// Create page
page, err := browser.NewPage()
if err != nil {
    CafeSDK.Log.Error(ctx, "Failed to create page: %v", err)
    return
}

// Visit ipinfo to verify outbound IP
resp, err := page.Goto("https://ipinfo.io/ip")
if err != nil {
    CafeSDK.Log.Error(ctx, "Page navigation failed: %v", err)
    return
}

page.WaitForLoadState("networkidle")

content, err := page.TextContent("body")
if err != nil {
    CafeSDK.Log.Error(ctx, "Failed to get page content: %v", err)
    return
}

CafeSDK.Log.Info(ctx, "Current outbound IP: %s", content)
CafeSDK.Log.Info(ctx, "Response status code: %d", resp.Status())
```

## Node.js Example

```js
const { chromium } = require('playwright')

;(async () => {
    // Read PROXY_AUTH
    const Auth = process.env.PROXY_AUTH
    console.log('Current browser auth info:', Auth)

    // Build remote browser WS address
    const browserUrl = Auth
        ? `ws://${Auth}@chrome-ws-inner.coreclaw.com`
        : `ws://chrome-ws-inner.coreclaw.com`

    console.log('Using remote browser address:', browserUrl)

    // Connect to remote fingerprint browser
    const browser = await chromium.connectOverCDP(browserUrl)
    const page = await browser.newPage()

    // Visit ipinfo to verify outbound IP
    const response = await page.goto('https://ipinfo.io/ip', {
        timeout: 60000,
    })

    await page.waitForLoadState('networkidle')

    // Read IP
    const ipText = await page.textContent('body')

    console.log('Current outbound IP:', ipText.trim())
    console.log('Response status code:', response.status())

    await browser.close()
})()
```

:::danger[Important Notes]

- **Never** hardcode proxy credentials
- **Always** use the platform-injected `PROXY_AUTH` environment variable
- The fingerprint browser is **automatically provisioned and rotated** by the platform
- No manual browser setup or proxy configuration is required

:::

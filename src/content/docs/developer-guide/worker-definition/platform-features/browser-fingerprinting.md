---
title: Browser Fingerprinting
description: Isolated browser fingerprint environment for anti-detection
sidebar:
  order: 2
---

## Fingerprint Browser Environment Overview

To handle **fingerprint browser and automation detection** on modern websites, the platform **automatically configures and hosts an isolated browser fingerprint environment** during script execution.

This environment is used for operations that require a real browser context, such as **JavaScript rendering, page interaction, login sessions, and authenticated access**.

**Developers don't need to deploy, purchase, or manage fingerprint browser instances.**

## Configuration

| Parameter | Value |
|-----------|-------|
| **Browser Type** | Chromium (platform-hosted remote instance) |
| **Connection Method** | `WebSocket` |
| **Authentication Variable** | `PROXY_AUTH` |
| **Authentication Format** | `username:password` |
| **Pricing** | Built-in, no additional cost |

## Python Example

```python
import os
from playwright.async_api import async_playwright

async def main():
    # Get browser authentication info
    auth = os.environ.get("PROXY_AUTH")
    
    # Remote fingerprint browser WebSocket address
    chrome_ws = os.environ.get("ChromeWs") or "chrome-ws-inner.coreclaw.com"
    
    browser_url = f'ws://{auth}@{chrome_ws}'
    
    async with async_playwright() as p:
        # Connect to remote fingerprint browser
        browser = await p.chromium.connect_over_cdp(browser_url)
        page = await browser.new_page()
        
        # Navigate to page
        await page.goto('https://ipinfo.io/ip')
        await page.wait_for_load_state('networkidle')
        
        # Get content
        ip_text = await page.text_content('body')
        print(f"Current exit IP: {ip_text.strip()}")
        
        await browser.close()

asyncio.run(main())
```

## Node.js Example

```javascript
const { chromium } = require('playwright')

;(async () => {
    // Get browser authentication info
    const auth = process.env.PROXY_AUTH
    
    // Remote fingerprint browser WebSocket address
    const chromeWs = process.env.ChromeWs || 'chrome-ws-inner.coreclaw.com'
    const browserUrl = `ws://${auth}@${chromeWs}`
    
    // Connect to remote fingerprint browser
    const browser = await chromium.connectOverCDP(browserUrl)
    const page = await browser.newPage()
    
    // Navigate to page
    await page.goto('https://ipinfo.io/ip')
    await page.waitForLoadState('networkidle')
    
    // Get content
    const ipText = await page.textContent('body')
    console.log('Current exit IP:', ipText.trim())
    
    await browser.close()
})()
```

:::danger[Important]
- **Never** hardcode proxy credentials
- **Always** use the platform-injected `PROXY_AUTH` environment variable
- Fingerprint browser is **automatically configured and rotated** by the platform
:::

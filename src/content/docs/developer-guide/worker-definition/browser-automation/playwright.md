---
title: Playwright
description: Modern cross-browser automation with Playwright
sidebar:
  order: 1
---

Playwright is a cross-browser automation framework that provides support for Chromium, Firefox, and WebKit.

## Positioning

**Playwright is a cross-browser automation framework** that provides:

- Support for **Chromium / Firefox / WebKit**
- Real browser control (can connect to fingerprint browsers)
- JavaScript execution, DOM manipulation, and event simulation
- Asynchronous APIs, suitable for high-concurrency scraping

> Playwright does not simulate browsers. It directly drives real browsers to execute page logic.

## Connecting to Remote Fingerprint Browser

```python
import os
from playwright.async_api import async_playwright

# Get browser auth info
auth = os.environ.get("PROXY_AUTH")

# Remote fingerprint browser WebSocket address
chrome_ws = os.environ.get("ChromeWs") or "chrome-ws-inner.coreclaw.com"
browser_url = f'ws://{auth}@{chrome_ws}'

async with async_playwright() as playwright:
    # Connect to remote fingerprint browser
    browser = await playwright.chromium.connect_over_cdp(browser_url)
    page = await browser.new_page()
    
    # Visit page
    await page.goto(url, timeout=180000)
    html = await page.content()
    
    await browser.close()
```

## Complete Example

```python
import asyncio
import os
from playwright.async_api import async_playwright
from sdk import CoreSDK

async def run():
    CoreSDK.Log.info("Starting Playwright demo...")
    
    # Define output headers
    headers = [
        {"label": "url", "key": "url", "format": "text"},
        {"label": "html", "key": "html", "format": "text"},
        {"label": "resp_status", "key": "resp_status", "format": "text"},
    ]
    CoreSDK.Result.set_table_header(headers)
    
    # Get input parameters
    input_json = CoreSDK.Parameter.get_input_json_dict()
    url = input_json['url']
    
    # Get browser auth
    auth = os.environ.get("PROXY_AUTH")
    chrome_ws = os.environ.get("ChromeWs") or "chrome-ws-inner.coreclaw.com"
    browser_url = f'ws://{auth}@{chrome_ws}'
    
    result = {"url": url, "html": "", "resp_status": "200"}
    
    async with async_playwright() as playwright:
        try:
            browser = await playwright.chromium.connect_over_cdp(browser_url)
            page = await browser.new_page(no_viewport=True)
            await page.goto(url, timeout=180000)
            result["html"] = await page.content()
        except Exception as e:
            CoreSDK.Log.error(f"Failed: {e}")
            result['resp_status'] = "500"
        
        CoreSDK.Result.push_data(result)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
```

## DOM Operations

### Single Element

```python
# CSS selectors (recommended)
element = page.locator('.product-title').first
element = page.locator('#main-content')

# XPath
element = page.locator('xpath=//div[@class="container"]')

# Text-based selectors
element = page.get_by_text('Buy Now')
element = page.get_by_role('button', name='Submit')

# Get properties
text = await element.text_content()
is_visible = await element.is_visible()
```

### Batch Elements

```python
# Get all matching elements
items = page.locator('.product-item')
count = await items.count()

# Iterate
for i in range(count):
    item = items.nth(i)
    name = await item.locator('.name').text_content()
```

## Anti-Patterns

❌ **Don't use sleep to wait for page load:**
```python
await asyncio.sleep(5)  # Unreliable
```

❌ **Don't use requests to simulate browser:**
```python
requests.get(url)  # Incomplete content, easily detected
```

---
title: Playwright
description: Why Playwright is chosen as the recommended page scraping framework in modern Web data collection scenarios, and the officially recommended usage patterns.
---

> Why Playwright is chosen as the recommended page scraping framework in modern Web data collection scenarios, and the officially recommended usage patterns.

---

## 1. Positioning and Role of Playwright

**Playwright is a cross-browser automation framework** that provides:

- Support for **Chromium / Firefox / WebKit**
- Real browser control (can connect to fingerprint browsers)
- JavaScript execution, DOM manipulation, and event simulation
- Asynchronous APIs, suitable for high-concurrency scraping

> Playwright does not simulate browsers.
>
> It directly drives real browsers to execute page logic.

---

## 2. Officially Recommended Implementation

##### 1️⃣ Connecting to a Remote Fingerprint Browser

```python
try:
    Auth = os.environ.get("PROXY_AUTH")
    CoreSDK.Log.info(f"Current browser authentication info: {Auth}")
except Exception as e:
    #Detect other unknown anomalies
    CoreSDK.Log.error(f"Failed to obtain browser authentication info: {e}")
    Auth = None
return

# CDP endpoint of the fingerprint browser
browser_url = f 'ws://{Auth}@chrome-ws-inner.coreclaw.com'
rest_item = {
    "url": url,
    "html": "",
    "resp_status": "200"
}

async with async_playwright() as playwright:
    CoreSDK.Log.info(f"Requested URL: {url}")

try:
    browser = await playwright.chromium.connect_over_cdp(browser_url)
except Exception as e:
    CoreSDK.Log.info(f"[Error] Failed to connect fingerprint browser: {e}")
    rest_item['resp_status'] = "403"
    await asyncio.sleep(5)
    await browser.close()
return
```

---

##### 2️⃣ Page Navigation and Content Retrieval

```python
try:
    page = await browser.new_page(no_viewport=True)
    await page.goto(url, timeout=3 * 60 * 1000)
    html = await page.content()
    rest_item["html"] = html
except Exception as e:
    CoreSDK.Log.info(f"[Error] Failed to retrieve page HTML: {e}")
    rest_item['resp_status'] = "500"
    CoreSDK.Result.push_data(rest_item)
    await asyncio.sleep(5)
    await browser.close()
```

---

##### 3️⃣ Complete Platform Script Entry Example (Recommended)

```python
import asyncio, sys,traceback,re
import random
import time
import os

from lxml import etree
from urllib.parse import urlparse,urlencode
from playwright.async_api import async_playwright

from sdk import CoreSDK

async def run():
    CoreSDK.Log.info("🚀 Init...")
    CoreSDK.Log.info("====================================================")
    CoreSDK.Log.info("🚀 CoreClaw Playwright Browser Scrape Demo")
    CoreSDK.Log.info("====================================================")
    headers = [
        {
            "label": "url",
            "key": "url",
            "format": "text",
        },
        {
            "label": "html",
            "key": "html",
            "format": "text",
        },
        {
            "label": "resp_status",
            "key": "resp_status",
            "format": "text",
        }
    ]
    res = CoreSDK.Result.set_table_header(headers)

    input_json_dict = CoreSDK.Parameter.get_input_json_dict()
    CoreSDK.Log.debug(f"======input_json_dict====== {input_json_dict}")
    url = input_json_dict['url']

    try:
        Auth = os.environ.get("PROXY_AUTH")
        CoreSDK.Log.info(f"Current browser authentication info: {Auth}")
    except Exception as e:
        CoreSDK.Log.error(f"Failed to obtain browser authentication info: {e}")
        Auth = None
        return

    # CDP endpoint of the fingerprint browser
    browser_url = f'ws://{Auth}@chrome-ws-inner.coreclaw.com'
    rest_item = {"url": url, "html": "", "resp_status": "200"}

    async with async_playwright() as playwright:
        CoreSDK.Log.info(f"Requested URL: {url}")
        try:
            browser = await playwright.chromium.connect_over_cdp(browser_url)
        except Exception as e:
            CoreSDK.Log.info(f"[Error] Failed to connect fingerprint browser: {e}")
            rest_item['resp_status'] = "403"
            await asyncio.sleep(5)
            await browser.close()
            return

        try:
            page = await browser.new_page(no_viewport=True)
            await page.goto(url, timeout=3 * 60 * 1000)
            html = await page.content()
            rest_item["html"] = html
        except Exception as e:
            CoreSDK.Log.info(f"[Error] Failed to retrieve page HTML: {e}")
            rest_item['resp_status'] = "500"
        CoreSDK.Result.push_data(rest_item)
        await asyncio.sleep(5)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
```

---

## 3. Dynamic Content Handling and DOM Operations

##### Retrieving a Single Element

```python
# Method 1: CSS selectors (recommended)
element = page.locator('.product-title').first
element = page.locator('#main-content')
element = page.locator('h1')

# Method 2: XPath
element = page.locator('xpath=//div[@class="container"]')

# Method 3: Text-based selectors
element = page.locator('text=Buy Now')
element = page.get_by_text('Buy Now')  # Preferred
element = page.get_by_role('button', name='Submit')

# Check existence and retrieve properties
if element.count() > 0:
    text = element.text_content()
    inner_html = element.inner_html()
    is_visible = element.is_visible()
    class_name = element.get_attribute('class')

# Wait for element visibility
await element.wait_for(state='visible')

# Get element bounding box
bbox = element.bounding_box()
```

##### Batch Element Processing

```python
# Retrieve all matching elements
product_items = page.locator('.product-item')
count = await product_items.count()
print(f"Found {count} products")

# Method 1: Iterative processing
products_data = []
for i in range(count):
    item = product_items.nth(i)
    product = {
        'name': await item.locator('.name').text_content() if await item.locator('.name').count() > 0 else '',
        'price': await item.locator('.price').text_content() if await item.locator('.price').count() > 0 else '',
        'link': await item.locator('.link').get_attribute('href') if await item.locator('.link').count() > 0 else '',
    }
    products_data.append(product)

# Method 2: evaluate_all for higher efficiency
products_data = await page.evaluate('''() => {
    const items = document.querySelectorAll('.product-item');
    return Array.from(items).map(item => {
        const nameElem = item.querySelector('.name');
        const priceElem = item.querySelector('.price');
        const linkElem = item.querySelector('.link');
        return {
            name: nameElem ? nameElem.textContent.trim() : '',
            price: priceElem ? priceElem.textContent.trim() : '',
            link: linkElem ? linkElem.href : ''
        };
    });
}''')

# Method 3: Async iteration (Python 3.8+)
products_data = []
items = page.locator('.product-item')
async for i in range(await items.count()):
    item = items.nth(i)
    # processing logic...

# List comprehension with asyncio
names = await asyncio.gather(*[
    item.locator('.name').text_content()
    for i in range(count)
    if await items.nth(i).locator('.name').count() > 0
])
```

**Advantages:**

- Operates on real DOM
- JavaScript-rendered content is directly accessible
- Fully aligned with front-end execution logic

---

## 4. Officially Discouraged Practices (Anti-Patterns)

##### ❌ Using sleep to Wait for Page Load

```python
await asyncio.sleep(5)
```

- Does not guarantee JavaScript execution completion
- Fails on slow pages and wastes time on fast pages

##### ❌ Using requests to Simulate Browser Pages

```python
requests.get(url)
```

- Incomplete page content
- Easily triggers anti-bot mechanisms
- Unstable and unpredictable success rate

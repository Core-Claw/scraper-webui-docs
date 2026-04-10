---
title: DrissionPage
description: Why the platform recommends using DrissionPage as the page scraping framework in modern Web data collection scenarios, and the officially recommended standard usage pattern.
---

> Why the platform recommends using DrissionPage as the page scraping framework in modern Web data collection scenarios, and the officially recommended standard usage pattern.

## 1. Positioning and Role of DrissionPage

**DrissionPage is a page control and scraping framework based on a real Chromium browser.**，

It operates the browser engine directly via the **Chromium DevTools Protocol (CDP)**, enabling:

- Full page rendering
- JavaScript execution
- DOM manipulation
- User behavior simulation

> DrissionPage is **not a browser simulator**, It **uses a real browser directly**.

---

## 2. Officially Recommended Implementation

##### 1️⃣ Connecting to a Remote Fingerprint Browser

```python
try:
    Auth = os.environ.get("PROXY_AUTH")
    CafeSDK.Log.info(f"Current browser authentication info: {Auth}")
except Exception as e:
    CafeSDK.Log.error(f"Failed to obtain browser authentication info: {e}")
    Auth = None
    return

browser_url = f"ws://chrome-ws-inner.coreclaw.com/ws?apiKey={Auth}"
rest_item = {"url": url, "html": "", "resp_status": "200"}

CafeSDK.Log.info("Connecting to fingerprint browser...")

co = ChromiumOptions()
co.set_address(browser_url)

try:
    browser = Chromium(co)
    CafeSDK.Log.info("Fingerprint browser connected successfully")
except Exception:
    CafeSDK.Log.error("Failed to connect to fingerprint browser")
    rest_item["resp_status"] = "403"
    return
```

---

##### 2️⃣ Page Navigation and Content Retrieval

```python
try:
    page = browser.new_tab()
    page.get(url)
    page.wait.doc_loaded()
    html = page.html
    rest_item["html"] = html
    CafeSDK.Result.push_data(rest_item)
except Exception as e:
    CafeSDK.Log.info(f"[Error] Failed to retrieve page HTML: {e}")
    rest_item["resp_status"] = "500"
```

---

##### 3️⃣ Complete Platform Script Entry Example (Recommended)

```python
import asyncio, sys, traceback, re
import random
import time
import os

from lxml import etree
from urllib.parse import urlparse, urlencode
import hashlib
from DrissionPage import ChromiumOptions, Chromium, errors

from sdk import CafeSDK

async def run():
    CafeSDK.Log.info("🚀 Init...")
    CafeSDK.Log.info("====================================================")
    CafeSDK.Log.info("🚀 CoreClaw TikTok Shop Information Scraper")
    CafeSDK.Log.info("====================================================")

    headers = [
        {"label": "url", "key": "url", "format": "text"},
        {"label": "html", "key": "html", "format": "text"},
        {"label": "resp_status", "key": "resp_status", "format": "text"},
    ]

    CafeSDK.Result.set_table_header(headers)

    input_json_dict = CafeSDK.Parameter.get_input_json_dict()
    CafeSDK.Log.debug(f"======input_json_dict====== {input_json_dict}")
    url = input_json_dict['url']

    try:
        Auth = os.environ.get("PROXY_AUTH")
        CafeSDK.Log.info(f"Current browser authentication info: {Auth}")
    except Exception as e:
        CafeSDK.Log.error(f"Failed to obtain browser authentication info: {e}")
        return

    browser_url = f"ws://chrome-ws-inner.coreclaw.com/ws?apiKey={Auth}"
    rest_item = {"url": url, "html": "", "resp_status": "200"}

    CafeSDK.Log.info("Connecting to fingerprint browser...")
    co = ChromiumOptions()
    co.set_address(browser_url)

    try:
        browser = Chromium(co)
        CafeSDK.Log.info("Fingerprint browser connected successfully")
    except Exception:
        CafeSDK.Log.error("Failed to connect to fingerprint browser")
        rest_item["resp_status"] = "403"
        return

    try:
        page = browser.new_tab()
        page.get(url)
        page.wait.doc_loaded()
        html = page.html
        rest_item["html"] = html
        CafeSDK.Result.push_data(rest_item)
    except Exception as e:
        CafeSDK.Log.info(f"[Error] Failed to retrieve page HTML: {e}")
        rest_item["resp_status"] = "500"

if __name__ == "__main__":
    asyncio.run(run())
```

---

## 3. Dynamic Content Handling and DOM Operations

##### Retrieving a Single Element

```python
# Method 1: CSS selector (recommended)
element = page.ele('.product-title')
element = page.ele('#main-content')
element = page.ele('tag:h1')

# Method 2: XPath
element = page.ele('xpath://div[@class="container"]')

# Method 3: Text matching
element = page.ele('text:Buy Now')

# Check if element exists
if element:
    text = element.text
    html = element.html
    attrs = element.attrs
    class_name = element.attr('class')
```

##### Batch Element Processing

```python
# Retrieve all matching elements
product_items = page.eles('.product-item')
CafeSDK.Log.info(f"Found {len(product_items)} products")

products_data = []
for item in product_items:
    product = {
        'name': item.ele('.name').text if item.ele('.name') else '',
        'price': item.ele('.price').text if item.ele('.price') else '',
        'link': item.ele('.link').attr('href') if item.ele('.link') else '',
    }
    products_data.append(product)

# List comprehension (concise)
names = [item.ele('.name').text for item in product_items if item.ele('.name')]
```

**Advantages:**

- Operates directly on browser DOM
- Independent of unstable raw HTML structures
- Closely aligned with front-end rendering logic

---

## 4. Officially Discouraged Practices (Anti-Patterns)

##### ❌ Using sleep to Wait for Page Load

```python
import time
page.get(url)
time.sleep(5)
```

**Issues:**

- Cannot guarantee JavaScript execution completion
- Fails on slow pages and wastes time on fast ones

##### ❌ Using requests to Simulate Browser Page Access

```python
requests.get(url, headers=headers)
```

**Issues:**

- Incomplete page content
- Easily detected by anti-bot systems
- Unstable and unpredictable success rate

---
title: DrissionPage
description: Python browser automation with DrissionPage
sidebar:
  order: 4
---

DrissionPage is a page control and scraping framework based on a real Chromium browser. It operates the browser engine directly via the Chromium DevTools Protocol (CDP).

## Positioning

**DrissionPage is a page control and scraping framework based on a real Chromium browser** with:

- Full page rendering
- JavaScript execution
- DOM manipulation
- User behavior simulation

> DrissionPage is not a browser simulator. It uses a real browser directly.

## Connecting to Remote Fingerprint Browser

```python
import os
from DrissionPage import ChromiumOptions, Chromium

# Get browser auth
auth = os.environ.get("PROXY_AUTH")

# WebSocket endpoint
chrome_ws = os.environ.get("ChromeWs") or "chrome-ws-inner.coreclaw.com"
browser_url = f"ws://{chrome_ws}/ws?apiKey={auth}"

# Configure options
co = ChromiumOptions()
co.set_address(browser_url)

# Connect to browser
browser = Chromium(co)
```

## Complete Example

```python
import os
from DrissionPage import ChromiumOptions, Chromium
from sdk import CoreSDK

def run():
    CoreSDK.Log.info("Starting DrissionPage demo...")
    
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
    browser_url = f"ws://{chrome_ws}/ws?apiKey={auth}"
    
    result = {"url": url, "html": "", "resp_status": "200"}
    
    # Configure and connect
    co = ChromiumOptions()
    co.set_address(browser_url)
    
    try:
        browser = Chromium(co)
        page = browser.new_tab()
        page.get(url)
        page.wait.doc_loaded()
        result["html"] = page.html
    except Exception as e:
        CoreSDK.Log.error(f"Failed: {e}")
        result['resp_status'] = "500"
    
    CoreSDK.Result.push_data(result)

if __name__ == "__main__":
    run()
```

## DOM Operations

### Single Element

```python
# CSS selector (recommended)
element = page.ele('.product-title')
element = page.ele('#main-content')
element = page.ele('tag:h1')

# XPath
element = page.ele('xpath://div[@class="container"]')

# Text matching
element = page.ele('text:Buy Now')

# Check if element exists
if element:
    text = element.text
    html = element.html
    attrs = element.attrs
```

### Batch Elements

```python
# Get all matching elements
items = page.eles('.product-item')
print(f"Found {len(items)} products")

# Iterate
products = []
for item in items:
    product = {
        'name': item.ele('.name').text if item.ele('.name') else '',
        'price': item.ele('.price').text if item.ele('.price') else '',
        'link': item.ele('.link').attr('href') if item.ele('.link') else '',
    }
    products.append(product)

# List comprehension
names = [item.ele('.name').text for item in items if item.ele('.name')]
```

## Anti-Patterns

❌ **Don't use sleep to wait for page load:**
```python
import time
page.get(url)
time.sleep(5)  # Unreliable
```

❌ **Don't use requests to simulate browser:**
```python
requests.get(url, headers=headers)  # Incomplete content, easily detected
```

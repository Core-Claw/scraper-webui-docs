---
title: Selenium
description: Classic browser automation with Selenium WebDriver
sidebar:
  order: 3
---

Selenium is a browser automation framework based on the WebDriver protocol. By using Remote WebDriver, it can control real browsers running remotely.

## Positioning

**Selenium is a browser automation framework based on the WebDriver protocol** with:

- Control of real Chromium browsers
- Page loading and JavaScript execution
- DOM querying and basic event simulation
- Support for connecting to remote fingerprint browser clusters

> Selenium does not simulate browser HTTP requests. It drives a real browser to execute actual page logic via the WebDriver protocol.

## Connecting to Remote Fingerprint Browser

```python
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

# Get browser auth
auth = os.environ.get("PROXY_AUTH")

# WebDriver endpoint
chrome_http = os.environ.get("ChromeHttp") or "chrome-http-inner.coreclaw.com"
browser_url = f'http://{auth}@{chrome_http}'

# Configure Chrome options
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--window-size=1920,1080')

# Connect to remote browser
driver = webdriver.Remote(
    command_executor=browser_url,
    options=chrome_options
)

# Navigate to page
driver.get(url)
WebDriverWait(driver, 180).until(
    lambda d: d.execute_script("return document.readyState") == "complete"
)
html = driver.page_source
```

## Complete Example

```python
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from sdk import CoreSDK

def run():
    CoreSDK.Log.info("Starting Selenium demo...")
    
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
    chrome_http = os.environ.get("ChromeHttp") or "chrome-http-inner.coreclaw.com"
    browser_url = f'http://{auth}@{chrome_http}'
    
    result = {"url": url, "html": "", "resp_status": "200"}
    
    # Configure options
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    
    try:
        driver = webdriver.Remote(
            command_executor=browser_url,
            options=chrome_options
        )
        driver.get(url)
        WebDriverWait(driver, 180).until(
            lambda d: d.execute_script("return document.readyState") == "complete"
        )
        result["html"] = driver.page_source
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
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# CSS selectors (recommended)
element = driver.find_element(By.CSS_SELECTOR, '.product-title')
element = driver.find_element(By.ID, 'main-content')

# XPath
element = driver.find_element(By.XPATH, '//div[@class="container"]')

# Wait for element
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '.product-title'))
)

# Get properties
text = element.text
html = element.get_attribute('outerHTML')
```

### Batch Elements

```python
# Get all matching elements
items = driver.find_elements(By.CSS_SELECTOR, '.product-item')

# Iterate
products = []
for item in items:
    try:
        name = item.find_element(By.CSS_SELECTOR, '.name').text
        price = item.find_element(By.CSS_SELECTOR, '.price').text
        products.append({'name': name, 'price': price})
    except:
        pass

# JavaScript-based extraction (higher performance)
products = driver.execute_script('''
    const items = document.querySelectorAll('.product-item');
    return Array.from(items).map(item => ({
        name: item.querySelector('.name')?.textContent.trim(),
        price: item.querySelector('.price')?.textContent.trim()
    }));
''')
```

## Anti-Patterns

❌ **Don't use sleep to wait:**
```python
time.sleep(5)  # Unreliable
```

❌ **Don't use requests to simulate browser:**
```python
requests.get(url)  # Incomplete content, easily detected
```

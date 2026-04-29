---
title: Selenium
description: 使用 Selenium WebDriver 进行经典浏览器自动化
sidebar:
  order: 3
---

Selenium 是一个基于 WebDriver 协议的浏览器自动化框架。通过使用 Remote WebDriver，可以控制远程运行的真实浏览器。

## 定位

**Selenium 是一个基于 WebDriver 协议的浏览器自动化框架**，提供：

- 真实 Chromium 浏览器控制
- 页面加载和 JavaScript 执行
- DOM 查询和基本事件模拟
- 支持连接远程指纹浏览器集群

> Selenium 不模拟浏览器 HTTP 请求，它通过 WebDriver 协议驱动真实浏览器执行实际页面逻辑。

## 连接远程指纹浏览器

```python
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

# 获取浏览器认证
auth = os.environ.get("PROXY_AUTH")

# WebDriver 端点
chrome_http = os.environ.get("ChromeHttp") or "chrome-http-inner.coreclaw.com"
browser_url = f'http://{auth}@{chrome_http}'

# 配置 Chrome 选项
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--window-size=1920,1080')

# 连接远程浏览器
driver = webdriver.Remote(
    command_executor=browser_url,
    options=chrome_options
)

# 导航到页面
driver.get(url)
WebDriverWait(driver, 180).until(
    lambda d: d.execute_script("return document.readyState") == "complete"
)
html = driver.page_source
```

## 完整示例

```python
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from sdk import CoreSDK

def run():
    CoreSDK.Log.info("启动 Selenium 演示...")
    
    # 定义输出表头
    headers = [
        {"label": "url", "key": "url", "format": "text"},
        {"label": "html", "key": "html", "format": "text"},
        {"label": "resp_status", "key": "resp_status", "format": "text"},
    ]
    CoreSDK.Result.set_table_header(headers)
    
    # 获取输入参数
    input_json = CoreSDK.Parameter.get_input_json_dict()
    url = input_json['url']
    
    # 获取浏览器认证
    auth = os.environ.get("PROXY_AUTH")
    chrome_http = os.environ.get("ChromeHttp") or "chrome-http-inner.coreclaw.com"
    browser_url = f'http://{auth}@{chrome_http}'
    
    result = {"url": url, "html": "", "resp_status": "200"}
    
    # 配置选项
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
        CoreSDK.Log.error(f"失败: {e}")
        result['resp_status'] = "500"
    
    CoreSDK.Result.push_data(result)

if __name__ == "__main__":
    run()
```

## DOM 操作

### 单个元素

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# CSS 选择器（推荐）
element = driver.find_element(By.CSS_SELECTOR, '.product-title')
element = driver.find_element(By.ID, 'main-content')

# XPath
element = driver.find_element(By.XPATH, '//div[@class="container"]')

# 等待元素
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '.product-title'))
)

# 获取属性
text = element.text
html = element.get_attribute('outerHTML')
```

### 批量元素

```python
# 获取所有匹配元素
items = driver.find_elements(By.CSS_SELECTOR, '.product-item')

# 遍历
products = []
for item in items:
    try:
        name = item.find_element(By.CSS_SELECTOR, '.name').text
        price = item.find_element(By.CSS_SELECTOR, '.price').text
        products.append({'name': name, 'price': price})
    except:
        pass

# 基于 JavaScript 提取（更高性能）
products = driver.execute_script('''
    const items = document.querySelectorAll('.product-item');
    return Array.from(items).map(item => ({
        name: item.querySelector('.name')?.textContent.trim(),
        price: item.querySelector('.price')?.textContent.trim()
    }));
''')
```

## 反模式

❌ **不要使用 sleep 等待：**
```python
time.sleep(5)  # 不可靠
```

❌ **不要使用 requests 模拟浏览器：**
```python
requests.get(url)  # 内容不完整，容易被检测
```

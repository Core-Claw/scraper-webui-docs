---
title: Playwright
description: 使用 Playwright 进行现代跨浏览器自动化
sidebar:
  order: 1
---

Playwright 是一个跨浏览器自动化框架，支持 Chromium、Firefox 和 WebKit。

## 定位

**Playwright 是一个跨浏览器自动化框架**，提供：

- 支持 **Chromium / Firefox / WebKit**
- 真实浏览器控制（可连接指纹浏览器）
- JavaScript 执行、DOM 操作和事件模拟
- 异步 API，适合高并发采集

> Playwright 不模拟浏览器，它直接驱动真实浏览器执行页面逻辑。

## 连接远程指纹浏览器

```python
import os
from playwright.async_api import async_playwright

# 获取浏览器认证信息
auth = os.environ.get("PROXY_AUTH")

# 远程指纹浏览器 WebSocket 地址
chrome_ws = os.environ.get("ChromeWs") or "chrome-ws-inner.coreclaw.com"
browser_url = f'ws://{auth}@{chrome_ws}'

async with async_playwright() as playwright:
    # 连接远程指纹浏览器
    browser = await playwright.chromium.connect_over_cdp(browser_url)
    page = await browser.new_page()
    
    # 访问页面
    await page.goto(url, timeout=180000)
    html = await page.content()
    
    await browser.close()
```

## 完整示例

```python
import asyncio
import os
from playwright.async_api import async_playwright
from sdk import CoreSDK

async def run():
    CoreSDK.Log.info("启动 Playwright 演示...")
    
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
            CoreSDK.Log.error(f"失败: {e}")
            result['resp_status'] = "500"
        
        CoreSDK.Result.push_data(result)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
```

## DOM 操作

### 单个元素

```python
# CSS 选择器（推荐）
element = page.locator('.product-title').first
element = page.locator('#main-content')

# XPath
element = page.locator('xpath=//div[@class="container"]')

# 文本选择器
element = page.get_by_text('立即购买')
element = page.get_by_role('button', name='提交')

# 获取属性
text = await element.text_content()
is_visible = await element.is_visible()
```

### 批量元素

```python
# 获取所有匹配元素
items = page.locator('.product-item')
count = await items.count()

# 遍历
for i in range(count):
    item = items.nth(i)
    name = await item.locator('.name').text_content()
```

## 反模式

❌ **不要使用 sleep 等待页面加载：**
```python
await asyncio.sleep(5)  # 不可靠
```

❌ **不要使用 requests 模拟浏览器：**
```python
requests.get(url)  # 内容不完整，容易被检测
```

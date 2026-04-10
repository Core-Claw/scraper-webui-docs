---
title: Playwright
description: 在现代 Web 数据采集场景下，为什么选择 Playwright 作为页面采集框架，以及官方推荐的使用方式。
---

> 在现代 Web 数据采集场景下，为什么选择 Playwright 作为页面采集框架，以及官方推荐的使用方式。

## 一、Playwright 的定位与作用

**Playwright 是一个跨浏览器自动化框架**，提供：

- **Chromium / Firefox / WebKit** 支持
- 真实浏览器控制（可接入指纹浏览器）
- JS 执行、DOM 操作、事件模拟
- 异步 API，适合高并发采集

> Playwright 不模拟浏览器，而是直接驱动真实浏览器执行网页逻辑。

---

## 二、官方推荐写法

##### 1️⃣ 连接远程指纹浏览器

```python
try:
    Auth = os.environ.get("PROXY_AUTH")
    CafeSDK.Log.info(f "当前获取的浏览器认证信息: {Auth}")
except Exception as e:
    #捕获其他未知异常
    CafeSDK.Log.error(f "当前获取浏览器认证信息失败: {e}")
    Auth = None
return

#指纹浏览器的cdp连接地址
browser_url = f 'ws://{Auth}@chrome-ws-inner.coreclaw.com'
rest_item = {
    "url": url,
    "html": "",
    "resp_status": "200"
}

async with async_playwright() as playwright:
    CafeSDK.Log.info(f "请求的url：{url}")

try:
    browser = await playwright.chromium.connect_over_cdp(browser_url)
except Exception as e:
    CafeSDK.Log.info(f "[错误] 指纹浏览器连接失败: {e}")
    rest_item['resp_status'] = "403"
    await asyncio.sleep(5)
    await browser.close()
return
```

---

##### 2️⃣ 页面访问与内容获取

```python
try:
    page = await browser.new_page(no_viewport=True)
    await page.goto(url, timeout=3 * 60 * 1000)
    html = await page.content()
    rest_item["html"] = html
except Exception as e:
    CafeSDK.Log.info(f"[错误] 获取浏览器html失败: {e}")
    rest_item['resp_status'] = "500"
    CafeSDK.Result.push_data(rest_item)
    await asyncio.sleep(5)
    await browser.close()
```

---

##### 3️⃣ 完整平台脚本入口示例（推荐直接使用）

```python
import asyncio, sys,traceback,re
import random
import time
import os

from lxml import etree
from urllib.parse import urlparse,urlencode
from playwright.async_api import async_playwright

from sdk import CafeSDK

async def run():
    CafeSDK.Log.info("🚀 Init...")
    CafeSDK.Log.info("====================================================")
    CafeSDK.Log.info("🚀 CoreClaw Playwright Browser Scrape Demo")
    CafeSDK.Log.info("====================================================")
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
    res = CafeSDK.Result.set_table_header(headers)

    input_json_dict = CafeSDK.Parameter.get_input_json_dict()
    CafeSDK.Log.debug(f"======input_json_dict====== {input_json_dict}")
    url = input_json_dict['url']

    try:
        Auth = os.environ.get("PROXY_AUTH")
        CafeSDK.Log.info(f"当前获取的浏览器认证信息: {Auth}")
    except Exception as e:
        # 捕获其他未知异常
        CafeSDK.Log.error(f"当前获取浏览器认证信息失败: {e}")
        Auth = None
        return

    browser_url = f'ws://{Auth}@chrome-ws-inner.coreclaw.com' #指纹浏览器的cdp连接地址
    rest_item = {"url": url, "html": "", "resp_status": "200"}
    async with async_playwright() as playwright:
        CafeSDK.Log.info(f"请求的url：{url}")
        try:
            browser = await playwright.chromium.connect_over_cdp(browser_url)
        except Exception as e:
            CafeSDK.Log.info(f"[错误] 指纹浏览器连接失败: {e}")
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
            CafeSDK.Log.info(f"[错误] 获取浏览器html失败: {e}")
            rest_item['resp_status'] = "500"
        CafeSDK.Result.push_data(rest_item)
        await asyncio.sleep(5)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
```

---

## 三、动态内容与 DOM 操作

##### 获取单个元素

```python
# 方法1：CSS选择器（推荐）
element = page.locator('.product-title').first
element = page.locator('#main-content')
element = page.locator('h1')

# 方法2：XPath
element = page.locator('xpath=//div[@class="container"]')

# 方法3：文本定位
element = page.locator('text=立即购买')
element = page.get_by_text('立即购买')  # 更推荐的方式
element = page.get_by_role('button', name='提交')

# 检查元素是否存在并获取属性
if element.count() > 0:
    text = element.text_content()
    inner_html = element.inner_html()
    is_visible = element.is_visible()
    class_name = element.get_attribute('class')

# 等待元素可见
await element.wait_for(state='visible')

# 获取元素边界框
bbox = element.bounding_box()
```

##### 批量元素处理

```python
# 获取所有匹配元素
product_items = page.locator('.product-item')
count = await product_items.count()
print(f"找到 {count} 个商品")

# 方法1：遍历处理
products_data = []
for i in range(count):
    item = product_items.nth(i)
    product = {
        'name': await item.locator('.name').text_content() if await item.locator('.name').count() > 0 else '',
        'price': await item.locator('.price').text_content() if await item.locator('.price').count() > 0 else '',
        'link': await item.locator('.link').get_attribute('href') if await item.locator('.link').count() > 0 else '',
    }
    products_data.append(product)

# 方法2：使用evaluate_all批量处理（更高效）
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

# 方法3：使用async for循环（Python 3.8+）
products_data = []
items = page.locator('.product-item')
async for i in range(await items.count()):
    item = items.nth(i)
    # ... 处理逻辑

# 使用列表推导式（需要异步处理）
names = await asyncio.gather(*[
    item.locator('.name').text_content()
    for i in range(count)
    if await items.nth(i).locator('.name').count() > 0
])
```

**优势：**

- 操作真实 DOM
- JS 渲染内容可直接获取
- 与前端逻辑一致

---

## 四、官方不推荐写法（反例）

##### ❌ sleep 等待页面加载

```python
await asyncio.sleep(5)
```

- 不保证 JS 执行完成
- 页面慢时失败，快时浪费时间

##### ❌ requests 模拟浏览器页面

```python
requests.get(url)
```

- 页面内容不完整
- 易触发反爬机制
- 成功率不可控

---
title: DrissionPage
description: 在现代 Web 数据采集场景下，平台为何推荐使用 DrissionPage 作为页面采集框架，以及官方推荐的标准使用方式。
---

> 在现代 Web 数据采集场景下，平台为何推荐使用 DrissionPage 作为页面采集框架，以及官方推荐的标准使用方式。

## 一、DrissionPage 的定位与作用

**DrissionPage 是一个基于真实 Chromium 浏览器的页面控制与采集框架**，

通过 Chromium DevTools Protocol（CDP）直接操作浏览器内核，实现：

- 完整页面渲染
- JavaScript 执行
- DOM 操作
- 用户行为模拟

> DrissionPage 不是“模拟浏览器”，而是 **直接使用浏览器**。

---

## 二、官方推荐写法

##### 1️⃣ 连接远程指纹浏览器

```python
try:
    Auth = os.environ.get("PROXY_AUTH")
    CafeSDK.Log.info(f"当前获取的浏览器认证信息: {Auth}")
except Exception as e:
    # 捕获其他未知异常
    CafeSDK.Log.error(f"当前获取浏览器认证信息失败: {e}")
    Auth = None
    return

browser_url = f"ws://chrome-ws-inner.coreclaw.com/ws?apiKey={Auth}"
rest_item = {"url": url, "html": "", "resp_status": "200"}
CafeSDK.Log.info(f"开始连接指纹浏览器")
# 初始化浏览器实例
co = ChromiumOptions()
co.set_address(browser_url)
try:
    browser = Chromium(co)
    CafeSDK.Log.info(f"连接指纹浏览器成功")
except Exception as e:
    CafeSDK.Log.error(f"连接指纹浏览器失败")
    rest_item["resp_status"] = "403"
    return
```

---

##### 2️⃣ 页面访问与内容获取

```python
try:
    page = browser.new_tab()
    page.get(url)
    page.wait.doc_loaded()
    html = page.html
    rest_item["html"] = html
    CafeSDK.Result.push_data(rest_item)
except Exception as e:
    CafeSDK.Log.info(f"[错误] 获取浏览器html失败: {e}")
    rest_item["resp_status"] = "500"
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
import hashlib
from DrissionPage import ChromiumOptions, Chromium, errors

from sdk import CafeSDK

async def run():
    CafeSDK.Log.info("🚀 Init...")
    CafeSDK.Log.info("====================================================")
    CafeSDK.Log.info("🚀 CoreClaw TikTok Shop Information Worker")
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

    browser_url = f"ws://chrome-ws-inner.coreclaw.com/ws?apiKey={Auth}"
    rest_item = {"url": url, "html": "", "resp_status": "200"}
    CafeSDK.Log.info(f"开始连接指纹浏览器")
    # 初始化浏览器实例
    co = ChromiumOptions()
    co.set_address(browser_url)
    try:
        browser = Chromium(co)
        CafeSDK.Log.info(f"连接指纹浏览器成功")
    except Exception as e:
        CafeSDK.Log.error(f"连接指纹浏览器失败")
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
        CafeSDK.Log.info(f"[错误] 获取浏览器html失败: {e}")
        rest_item["resp_status"] = "500"

if __name__ == "__main__":
    asyncio.run(run())
```

---

## 三、动态内容与 DOM 操作

##### 获取单个元素

```python
# 方法1：CSS选择器（推荐）
element = page.ele('.product-title')
element = page.ele('#main-content')
element = page.ele('tag:h1')

# 方法2：XPath
element = page.ele('xpath://div[@class="container"]')

# 方法3：文本定位
element = page.ele('text:立即购买')

# 检查元素是否存在
if element:
    text = element.text
    html = element.html
    attrs = element.attrs  # 获取所有属性
    class_name = element.attr('class')
```

##### 批量元素处理

```python
# 获取所有匹配元素
product_items = page.eles('.product-item')
CafeSDK.Log.info(f"找到 {len(product_items)} 个商品")

# 遍历处理
products_data = []
for item in product_items:
    product = {
        'name': item.ele('.name').text if item.ele('.name') else '',
        'price': item.ele('.price').text if item.ele('.price') else '',
        'link': item.ele('.link').attr('href') if item.ele('.link') else '',
    }
    products_data.append(product)

# 使用列表推导式（简洁写法）
names = [item.ele('.name').text for item in product_items if item.ele('.name')]
```

**优势：**

- 操作的是浏览器 DOM
- 不依赖不稳定的 HTML 结构
- 更接近前端逻辑

---

## 四、官方不推荐写法（反例）

##### ❌ 使用 sleep 等待页面加载

```python
import time
page.get(url)
time.sleep(5)
```

问题：

- 无法保证 JS 执行完成
- 页面慢时失败，快时浪费时间

##### ❌ 使用 requests 模拟浏览器页面

```python
requests.get(url, headers=headers)
```

问题：

- 页面内容不完整
- 容易被反爬识别
- 成功率不可控

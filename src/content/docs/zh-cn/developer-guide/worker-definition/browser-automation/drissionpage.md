---
title: DrissionPage
description: 使用 DrissionPage 进行 Python 浏览器自动化
sidebar:
  order: 4
---

DrissionPage 是一个基于真实 Chromium 浏览器的页面控制和采集框架。它通过 Chromium DevTools Protocol (CDP) 直接操作浏览器引擎。

## 定位

**DrissionPage 是一个基于真实 Chromium 浏览器的页面控制和采集框架**，提供：

- 完整页面渲染
- JavaScript 执行
- DOM 操作
- 用户行为模拟

> DrissionPage 不是浏览器模拟器，它直接使用真实浏览器。

## 连接远程指纹浏览器

```python
import os
from DrissionPage import ChromiumOptions, Chromium

# 获取浏览器认证
auth = os.environ.get("PROXY_AUTH")

# WebSocket 端点
chrome_ws = os.environ.get("ChromeWs") or "chrome-ws-inner.coreclaw.com"
browser_url = f"ws://{chrome_ws}/ws?apiKey={auth}"

# 配置选项
co = ChromiumOptions()
co.set_address(browser_url)

# 连接浏览器
browser = Chromium(co)
```

## 完整示例

```python
import os
from DrissionPage import ChromiumOptions, Chromium
from sdk import CoreSDK

def run():
    CoreSDK.Log.info("启动 DrissionPage 演示...")
    
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
    browser_url = f"ws://{chrome_ws}/ws?apiKey={auth}"
    
    result = {"url": url, "html": "", "resp_status": "200"}
    
    # 配置并连接
    co = ChromiumOptions()
    co.set_address(browser_url)
    
    try:
        browser = Chromium(co)
        page = browser.new_tab()
        page.get(url)
        page.wait.doc_loaded()
        result["html"] = page.html
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
# CSS 选择器（推荐）
element = page.ele('.product-title')
element = page.ele('#main-content')
element = page.ele('tag:h1')

# XPath
element = page.ele('xpath://div[@class="container"]')

# 文本匹配
element = page.ele('text:立即购买')

# 检查元素是否存在
if element:
    text = element.text
    html = element.html
    attrs = element.attrs
```

### 批量元素

```python
# 获取所有匹配元素
items = page.eles('.product-item')
print(f"找到 {len(items)} 个产品")

# 遍历
products = []
for item in items:
    product = {
        'name': item.ele('.name').text if item.ele('.name') else '',
        'price': item.ele('.price').text if item.ele('.price') else '',
        'link': item.ele('.link').attr('href') if item.ele('.link') else '',
    }
    products.append(product)

# 列表推导
names = [item.ele('.name').text for item in items if item.ele('.name')]
```

## 反模式

❌ **不要使用 sleep 等待页面加载：**
```python
import time
page.get(url)
time.sleep(5)  # 不可靠
```

❌ **不要使用 requests 模拟浏览器：**
```python
requests.get(url, headers=headers)  # 内容不完整，容易被检测
```

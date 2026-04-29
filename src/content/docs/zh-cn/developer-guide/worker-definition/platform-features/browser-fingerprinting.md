---
title: 浏览器指纹
description: 隔离的浏览器指纹环境用于反检测
sidebar:
  order: 2
---

## 指纹浏览器环境概述

为应对现代网站上的**指纹浏览器和自动化检测**，平台在脚本执行期间**自动配置并托管隔离的浏览器指纹环境**。

此环境用于需要真实浏览器上下文的操作，如 **JavaScript 渲染、页面交互、登录会话和认证访问**。

**开发者无需部署、购买或管理指纹浏览器实例。**

## 配置

| 参数 | 值 |
| ---- | -- |
| **浏览器类型** | Chromium（平台托管的远程实例） |
| **连接方式** | `WebSocket` |
| **认证变量** | `PROXY_AUTH` |
| **认证格式** | `username:password` |
| **定价** | 内置，无额外费用 |

## Python 示例

```python
import os
from playwright.async_api import async_playwright

async def main():
    # 获取浏览器认证信息
    auth = os.environ.get("PROXY_AUTH")
    
    # 远程指纹浏览器 WebSocket 地址
    chrome_ws = os.environ.get("ChromeWs") or "chrome-ws-inner.coreclaw.com"
    
    browser_url = f'ws://{auth}@{chrome_ws}'
    
    async with async_playwright() as p:
        # 连接远程指纹浏览器
        browser = await p.chromium.connect_over_cdp(browser_url)
        page = await browser.new_page()
        
        # 访问页面
        await page.goto('https://ipinfo.io/ip')
        await page.wait_for_load_state('networkidle')
        
        # 获取内容
        ip_text = await page.text_content('body')
        print(f"当前出口 IP: {ip_text.strip()}")
        
        await browser.close()

asyncio.run(main())
```

## Node.js 示例

```javascript
const { chromium } = require('playwright')

;(async () => {
    // 获取浏览器认证信息
    const auth = process.env.PROXY_AUTH
    
    // 远程指纹浏览器 WebSocket 地址
    const chromeWs = process.env.ChromeWs || 'chrome-ws-inner.coreclaw.com'
    const browserUrl = `ws://${auth}@${chromeWs}`
    
    // 连接远程指纹浏览器
    const browser = await chromium.connectOverCDP(browserUrl)
    const page = await browser.newPage()
    
    // 访问页面
    await page.goto('https://ipinfo.io/ip')
    await page.waitForLoadState('networkidle')
    
    // 获取内容
    const ipText = await page.textContent('body')
    console.log('当前出口 IP:', ipText.trim())
    
    await browser.close()
})()
```

:::danger[重要提示]
- **切勿**硬编码代理凭证
- **始终**使用平台注入的 `PROXY_AUTH` 环境变量
- 指纹浏览器由平台**自动配置和轮换**
:::

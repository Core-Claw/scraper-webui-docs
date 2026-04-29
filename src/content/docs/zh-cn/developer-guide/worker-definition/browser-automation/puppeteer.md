---
title: Puppeteer
description: 使用 Puppeteer 进行 Node.js 浏览器控制
sidebar:
  order: 2
---

Puppeteer 是一个基于 Node.js 的浏览器自动化框架，通过 DevTools Protocol (CDP) 直接控制 Chromium 浏览器。

## 定位

**Puppeteer 是一个基于 Node.js 的浏览器自动化框架**，提供：

- 真实 Chromium 浏览器控制
- JavaScript 执行和完整页面渲染
- DOM 操作和事件模拟
- 原生 WebSocket (CDP) 支持连接远程浏览器

> Puppeteer 不模拟浏览器请求，它直接驱动真实浏览器执行页面逻辑。

## 连接远程指纹浏览器

```javascript
const puppeteer = require('puppeteer-core')

// 获取浏览器认证
const auth = process.env.PROXY_AUTH

// 远程指纹浏览器端点
const chromeWs = process.env.ChromeWs || 'chrome-ws-inner.coreclaw.com'
const browserUrl = `ws://${auth}@${chromeWs}`

// 连接远程浏览器
const browser = await puppeteer.connect({
    browserWSEndpoint: browserUrl,
    defaultViewport: null,
})

const page = await browser.newPage()
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
const html = await page.content()

await browser.close()
```

## 完整示例

```javascript
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')
const puppeteer = require('puppeteer-core')

async function run() {
    // 定义表头
    const headers = [
        { label: 'url', key: 'url', format: 'text' },
        { label: 'html', key: 'html', format: 'text' },
        { label: 'resp_status', key: 'resp_status', format: 'text' },
    ]
    await coresdk.result.setTableHeader(headers)

    // 获取输入参数
    const inputJson = await coresdk.parameter.getInputJSONObject()
    const url = inputJson?.url

    // 获取浏览器认证
    const auth = process.env.PROXY_AUTH
    const chromeWs = process.env.ChromeWs || 'chrome-ws-inner.coreclaw.com'
    const browserUrl = `ws://${auth}@${chromeWs}`

    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: browserUrl,
            defaultViewport: null,
        })

        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        const html = await page.content()

        await coresdk.result.pushData({
            url: url,
            html: html,
            resp_status: '200',
        })

        await browser.close()
    } catch (err) {
        await coresdk.log.error(`失败: ${err.message}`)
        await coresdk.result.pushData({
            url: url,
            html: err.message,
            resp_status: '500',
        })
    }
}

run()
```

## DOM 操作

### 单个元素

```javascript
// CSS 选择器
const element = await page.$('.product-title')
const element = await page.$('#main-content')

// XPath
const [element] = await page.$x('//div[@class="container"]')

// 获取属性
if (element) {
    const text = await page.evaluate(el => el.textContent, element)
    const isVisible = await element.isVisible()
}
```

### 批量元素

```javascript
// 获取所有匹配元素
const items = await page.$$('.product-item')

// 遍历
for (const item of items) {
    const name = await item.$eval('.name', el => el.textContent)
}

// 使用 evaluate 批量处理（最高效）
const products = await page.evaluate(() => {
    const items = document.querySelectorAll('.product-item')
    return Array.from(items).map(item => ({
        name: item.querySelector('.name')?.textContent.trim(),
        price: item.querySelector('.price')?.textContent.trim(),
    }))
})
```

## 反模式

❌ **不要使用固定 sleep：**
```javascript
await new Promise(r => setTimeout(r, 5000))  // 不可靠
```

❌ **不要使用 fetch 模拟浏览器：**
```javascript
fetch(url)  // 内容不完整，容易被检测
```

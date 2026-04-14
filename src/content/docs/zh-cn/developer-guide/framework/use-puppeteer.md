---
title: Puppeteer
description: 在现代 Web 数据采集场景及 Node.js 生态下，为什么选择 Puppeteer 作为页面采集框架，以及平台官方推荐的使用方式。
---

> 在现代 Web 数据采集场景及 Node.js 生态下，为什么选择 Puppeteer 作为页面采集框架，以及平台官方推荐的使用方式。

## 一、Puppeteer 的定位与作用

**Puppeteer 是一个基于 Node.js 的浏览器自动化框架**，

通过 DevTools Protocol（CDP）直接控制 Chromium 浏览器。

其主要能力包括：

- 真实 Chromium 浏览器控制
- JavaScript 执行与页面渲染
- DOM 操作与事件模拟
- 原生支持 WebSocket（CDP）连接远程浏览器
- 适合 Node.js 体系下的页面采集与自动化任务

> Puppeteer 并不模拟浏览器请求，
>
> 而是 **直接驱动真实浏览器执行网页逻辑**。

---

## 二、官方推荐写法

##### 1️⃣ 连接远程指纹浏览器

```js
let auth = null
try {
    auth = process.env.PROXY_AUTH || null
    await coresdk.log.info(`浏览器认证信息: ${auth}`)
} catch (err) {
    await coresdk.log.error(`获取浏览器认证信息失败: ${err.message}`)
    auth = null
}

// 指纹浏览器地址（从环境变量读取，支持灵活部署）
const chromeWs = process.env.ChromeWs || 'chrome-ws-inner.coreclaw.com'
await coresdk.log.info(`Chrome WebSocket 地址: ${chromeWs}`)

let browser_url = `ws://${auth}@${chromeWs}`
await coresdk.log.info(`指纹浏览器地址: ${browser_url}`)
```

---

##### 2️⃣ 页面访问与内容获取

```js
url = inputJson?.url
await coresdk.log.info(`开始处理URL: ${url}`)

let browser = await puppeteer.connect({
    browserWSEndpoint: browser_url,
    defaultViewport: null, //清除puppeteer的默认viewport
})
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
const html = await page.content()
let result = {
    url: url,
    html: html,
    resp_status: '200',
}
```

---

## 三、完整平台脚本入口示例（推荐直接使用）

```js
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')
const puppeteer = require('puppeteer-core')

async function run() {
    let url = ''
    try {
        // 1. 设置表格表头
        const headers = [
            {
                label: 'url',
                key: 'url',
                format: 'text',
            },
            {
                label: 'html',
                key: 'html',
                format: 'text',
            },
            {
                label: 'resp_status',
                key: 'resp_status',
                format: 'text',
            },
        ]

        await coresdk.result.setTableHeader(headers)

        // 2. 获取输入参数
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`输入参数: ${JSON.stringify(inputJson)}`)

        // 3. 获取指纹浏览器地址
        let auth = null
        try {
            auth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`浏览器认证信息: ${auth}`)
        } catch (err) {
            await coresdk.log.error(`获取浏览器认证信息失败: ${err.message}`)
            auth = null
        }

        // 指纹浏览器地址（从环境变量读取，支持灵活部署）
        const chromeWs = process.env.ChromeWs || 'chrome-ws-inner.coreclaw.com'
        await coresdk.log.info(`Chrome WebSocket 地址: ${chromeWs}`)

        let browser_url = `ws://${auth}@${chromeWs}`
        await coresdk.log.info(`指纹浏览器地址: ${browser_url}`)

        // 4. 业务逻辑处理
        url = inputJson?.url
        await coresdk.log.info(`开始处理URL: ${url}`)

        let browser = await puppeteer.connect({
            browserWSEndpoint: browser_url,
            defaultViewport: null, //清除puppeteer的默认viewport
        })
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        const html = await page.content()
        let result = {
            url: url,
            html: html,
            resp_status: '200',
        }

        // 5. 推送结果数据到平台...
        await coresdk.result.pushData(result)

        await coresdk.log.info('脚本执行完成')
    } catch (err) {
        await coresdk.log.error(`脚本执行异常: ${err.message}`)

        const errorResult = {
            url: url,
            html: err.message,
            resp_status: '500',
        }

        await coresdk.result.pushData(errorResult)
        throw err
    }
}

run()
```

---

## 四、动态内容与 DOM 操作

##### 获取单个元

```js
// 方法1：CSS选择器（推荐）
const element = await page.$('.product-title')
const element = await page.$('#main-content')
const element = await page.$('h1')

// 方法2：XPath
const element = await page.$x('//div[@class="container"]')
const [element] = await page.$x('//button[contains(text(), "提交")]')

// 方法3：文本定位（通过XPath）
const [element] = await page.$x('//*[contains(text(), "立即购买")]')

// 方法4：其他选择器
const element = await page.$('[name="username"]')
const element = await page.$('a[href*="download"]')

// 检查元素是否存在并获取属性
if (element) {
    const text = await page.evaluate((el) => el.textContent, element)
    const html = await page.evaluate((el) => el.outerHTML, element)
    const className = await page.evaluate((el) => el.className, element)
    const href = await page.evaluate((el) => el.href, element)
    const isVisible = await element.isVisible()
}

// 等待元素出现
await page.waitForSelector('.product-title', { timeout: 10000 })
await page.waitForXPath('//div[@class="container"]')

// 使用evaluateHandle获取元素句柄
const elementHandle = await page.evaluateHandle(() => {
    return document.querySelector('.product-title')
})
```

##### 批量元素处理

```js
// 获取所有匹配元素
const productItems = await page.$$('.product-item')
console.log(`找到 ${productItems.length} 个商品`)

// 方法1：遍历处理（推荐）
const productsData = []
for (const item of productItems) {
    const nameElem = await item.$('.name')
    const priceElem = await item.$('.price')
    const linkElem = await item.$('.link')

    const product = {
        name: nameElem
            ? await page.evaluate((el) => el.textContent.trim(), nameElem)
            : '',
        price: priceElem
            ? await page.evaluate((el) => el.textContent.trim(), priceElem)
            : '',
        link: linkElem ? await page.evaluate((el) => el.href, linkElem) : '',
    }
    productsData.push(product)
}

// 方法2：使用evaluate批量处理（最高效）
const productsData = await page.evaluate(() => {
    const items = document.querySelectorAll('.product-item')
    return Array.from(items).map((item) => {
        const nameElem = item.querySelector('.name')
        const priceElem = item.querySelector('.price')
        const linkElem = item.querySelector('.link')
        return {
            name: nameElem ? nameElem.textContent.trim() : '',
            price: priceElem ? priceElem.textContent.trim() : '',
            link: linkElem ? linkElem.href : '',
        }
    })
})

// 方法3：使用map和Promise.all
const productsData = await Promise.all(
    productItems.map(async (item) => {
        const [name, price, link] = await Promise.all([
            item.$eval('.name', (el) => el.textContent.trim()).catch(() => ''),
            item.$eval('.price', (el) => el.textContent.trim()).catch(() => ''),
            item.$eval('.link', (el) => el.href).catch(() => ''),
        ])
        return { name, price, link }
    })
)

// 使用$$eval简化（当所有元素都有相同结构时）
const names = await page.$$eval('.product-item .name', (elements) =>
    elements.map((el) => el.textContent.trim())
)
```

**优势说明：**

- 操作真实浏览器 DOM
- 可直接获取 JS 渲染后的内容
- 与前端执行逻辑完全一致

---

## 五、官方不推荐写法（反例）

##### ❌ 使用固定 sleep 等待页面加载

```js
await new Promise((r) => setTimeout(r, 5000))
```

问题：

- 无法保证 JS 执行完成
- 页面慢时失败
- 页面快时浪费时间

##### ❌ 使用 requests / fetch 模拟页面请求

```js
fetch(url)
```

问题：

- 页面内容不完整
- 易被反爬识别
- 成功率不可控

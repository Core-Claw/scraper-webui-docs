---
title: Puppeteer
description: Node.js browser control with Puppeteer
sidebar:
  order: 2
---

Puppeteer is a Node.js-based browser automation framework that directly controls Chromium browsers via the DevTools Protocol (CDP).

## Positioning

**Puppeteer is a Node.js-based browser automation framework** with:

- Real Chromium browser control
- JavaScript execution and full page rendering
- DOM manipulation and event simulation
- Native WebSocket (CDP) support for connecting to remote browsers

> Puppeteer does not simulate browser requests. It directly drives a real browser to execute page logic.

## Connecting to Remote Fingerprint Browser

```javascript
const puppeteer = require('puppeteer-core')

// Get browser auth
const auth = process.env.PROXY_AUTH

// Remote fingerprint browser endpoint
const chromeWs = process.env.ChromeWs || 'chrome-ws-inner.coreclaw.com'
const browserUrl = `ws://${auth}@${chromeWs}`

// Connect to remote browser
const browser = await puppeteer.connect({
    browserWSEndpoint: browserUrl,
    defaultViewport: null,
})

const page = await browser.newPage()
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
const html = await page.content()

await browser.close()
```

## Complete Example

```javascript
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')
const puppeteer = require('puppeteer-core')

async function run() {
    // Define table headers
    const headers = [
        { label: 'url', key: 'url', format: 'text' },
        { label: 'html', key: 'html', format: 'text' },
        { label: 'resp_status', key: 'resp_status', format: 'text' },
    ]
    await coresdk.result.setTableHeader(headers)

    // Get input parameters
    const inputJson = await coresdk.parameter.getInputJSONObject()
    const url = inputJson?.url

    // Get browser auth
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
        await coresdk.log.error(`Failed: ${err.message}`)
        await coresdk.result.pushData({
            url: url,
            html: err.message,
            resp_status: '500',
        })
    }
}

run()
```

## DOM Operations

### Single Element

```javascript
// CSS selectors
const element = await page.$('.product-title')
const element = await page.$('#main-content')

// XPath
const [element] = await page.$x('//div[@class="container"]')

// Get properties
if (element) {
    const text = await page.evaluate(el => el.textContent, element)
    const isVisible = await element.isVisible()
}
```

### Batch Elements

```javascript
// Get all matching elements
const items = await page.$$('.product-item')

// Iterate
for (const item of items) {
    const name = await item.$eval('.name', el => el.textContent)
}

// Batch with evaluate (most efficient)
const products = await page.evaluate(() => {
    const items = document.querySelectorAll('.product-item')
    return Array.from(items).map(item => ({
        name: item.querySelector('.name')?.textContent.trim(),
        price: item.querySelector('.price')?.textContent.trim(),
    }))
})
```

## Anti-Patterns

❌ **Don't use fixed sleep:**
```javascript
await new Promise(r => setTimeout(r, 5000))  // Unreliable
```

❌ **Don't use fetch to simulate browser:**
```javascript
fetch(url)  // Incomplete content, easily detected
```

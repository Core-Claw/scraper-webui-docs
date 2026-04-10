---
title: Puppeteer
description: Why Puppeteer is selected as the page scraping framework in modern Web data collection scenarios within the Node.js ecosystem, and the platform’s officially recommended usage patterns.
---

> Why Puppeteer is selected as the page scraping framework in modern Web data collection scenarios within the Node.js ecosystem, and the platform’s officially recommended usage patterns.

## 1. Positioning and Role of Puppeteer

**Puppeteer is a Node.js-based browser automation framework** that directly controls Chromium browsers via the DevTools Protocol (CDP).

Its core capabilities include:

- Real Chromium browser control
- JavaScript execution and full page rendering
- DOM manipulation and event simulation
- Native WebSocket (CDP) support for connecting to remote browsers
- Well suited for page scraping and automation tasks in the Node.js ecosystem

> Puppeteer does not simulate browser requests.
>
> It directly drives a real browser to execute page logic.

---

## 2. Officially Recommended Implementation

##### 1️⃣ Connecting to a Remote Fingerprint Browser

```js
let auth = null
try {
    auth = process.env.PROXY_AUTH || null
    await cafesdk.log.info(`Browser authentication info: ${auth}`)
} catch (err) {
    await cafesdk.log.error(
        `Failed to obtain browser authentication info: ${err.message}`
    )
    auth = null
}

let browser_url = `ws://${auth}@chrome-ws-inner.coreclaw.com`
await cafesdk.log.info(`Fingerprint browser endpoint: ${browser_url}`)
```

---

##### 2️⃣ Page Navigation and Content Retrieval

```js
url = inputJson?.url
await cafesdk.log.info(`Processing URL: ${url}`)

let browser = await puppeteer.connect({
    browserWSEndpoint: browser_url,
    defaultViewport: null, // Disable Puppeteer's default viewport
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

## 3. Complete Platform Script Entry Example (Recommended)

```js
#!/usr/bin/env node
'use strict'

const cafesdk = require('./sdk')
const puppeteer = require('puppeteer-core')

async function run() {
    let url = ''
    try {
        // 1. Define table headers
        const headers = [
            { label: 'url', key: 'url', format: 'text' },
            { label: 'html', key: 'html', format: 'text' },
            { label: 'resp_status', key: 'resp_status', format: 'text' },
        ]

        await cafesdk.result.setTableHeader(headers)

        // 2. Retrieve input parameters
        const inputJson = await cafesdk.parameter.getInputJSONObject()
        await cafesdk.log.debug(
            `Input parameters: ${JSON.stringify(inputJson)}`
        )

        // 3. Obtain fingerprint browser authentication
        let auth = null
        try {
            auth = process.env.PROXY_AUTH || null
            await cafesdk.log.info(`Browser authentication info: ${auth}`)
        } catch (err) {
            await cafesdk.log.error(
                `Failed to obtain browser authentication info: ${err.message}`
            )
            auth = null
        }

        let browser_url = `ws://${auth}@chrome-ws-inner.coreclaw.com`
        await cafesdk.log.info(`Fingerprint browser endpoint: ${browser_url}`)

        // 4. Business logic
        url = inputJson?.url
        await cafesdk.log.info(`Processing URL: ${url}`)

        let browser = await puppeteer.connect({
            browserWSEndpoint: browser_url,
            defaultViewport: null,
        })

        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        const html = await page.content()

        let result = {
            url: url,
            html: html,
            resp_status: '200',
        }

        // 5. Push results to the platform
        await cafesdk.result.pushData(result)

        await cafesdk.log.info('Script execution completed')
    } catch (err) {
        await cafesdk.log.error(`Script execution error: ${err.message}`)

        const errorResult = {
            url: url,
            html: err.message,
            resp_status: '500',
        }

        await cafesdk.result.pushData(errorResult)
        throw err
    }
}

run()
```

---

## 4. Dynamic Content Handling and DOM Operations

##### Retrieving a Single Element

```js
// Method 1: CSS selectors (recommended)
const element = await page.$('.product-title')
const element = await page.$('#main-content')
const element = await page.$('h1')

// Method 2: XPath
const element = await page.$x('//div[@class="container"]')
const [element] = await page.$x('//button[contains(text(), "Submit")]')

// Method 3: Text-based selection (via XPath)
const [element] = await page.$x('//*[contains(text(), "Buy Now")]')

// Method 4: Other selectors
const element = await page.$('[name="username"]')
const element = await page.$('a[href*="download"]')

// Check existence and retrieve attributes
if (element) {
    const text = await page.evaluate((el) => el.textContent, element)
    const html = await page.evaluate((el) => el.outerHTML, element)
    const className = await page.evaluate((el) => el.className, element)
    const href = await page.evaluate((el) => el.href, element)
    const isVisible = await element.isVisible()
}

// Wait for elements
await page.waitForSelector('.product-title', { timeout: 10000 })
await page.waitForXPath('//div[@class="container"]')

// Retrieve element handle via evaluateHandle
const elementHandle = await page.evaluateHandle(() => {
    return document.querySelector('.product-title')
})
```

##### Batch Element Processing

```js
// Retrieve all matching elements
const productItems = await page.$$('.product-item')
console.log(`Found ${productItems.length} products`)

// Method 1: Iterative processing (recommended)
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

// Method 2: Batch processing with evaluate (most efficient)
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

// Method 3: Using map + Promise.all
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

// Simplified $$eval usage (uniform structure)
const names = await page.$$eval('.product-item .name', (elements) =>
    elements.map((el) => el.textContent.trim())
)
```

**Advantages:**

- Operates on real browser DOM
- Direct access to JavaScript-rendered content
- Fully aligned with front-end execution logic

---

## 5. Officially Discouraged Practices (Anti-Patterns)

##### ❌ Using Fixed sleep to Wait for Page Load

```js
await new Promise((r) => setTimeout(r, 5000))
```

Issues:

- Does not guarantee JavaScript execution completion
- Fails on slow pages
- Wastes time on fast pages

##### ❌ Using requests / fetch to Simulate Page Requests

```js
fetch(url)
```

Issues:

- Incomplete page content
- Easily detected by anti-bot systems
- Unpredictable success rate

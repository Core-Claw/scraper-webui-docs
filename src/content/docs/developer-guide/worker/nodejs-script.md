---
title: Node.js Script
description: Learn how to write Node.js scripts for CoreClaw Workers
sidebar:
    order: 5
---

# Node.js Script Demo

## GitHub Repository

[https://github.com/core-claw/NodeScirptDemo](https://github.com/core-claw/NodeScirptDemo)

---

## Required Files (Located in the Project Root Directory)

```
├── main.js
├── package.json
├── input_schema.json
├── README.md
├── sdk.js
├── sdk_pb.js
├── sdk_grpc_pb.js
```

| File Name           | Description                                                     |
| :------------------ | :-------------------------------------------------------------- |
| `main.js`           | Script entry file (execution entry point), must be named `main` |
| `package.json`      | Node.js dependency management file                              |
| `input_schema.json` | UI input form configuration                                     |
| `README.md`         | Project documentation                                           |
| `sdk.js`            | SDK core functionality                                          |
| `sdk_pb.js`         | Data processing enhancement module                              |
| `sdk_grpc_pb.js`    | Network communication module                                    |

---

# Core SDK Files

## File Overview

The following three SDK files are required and must be placed in the **root directory** of the script:

| **File Name**       | **Primary Function**               |
| :------------------ | :--------------------------------- |
| `sdk.js`            | Core functionality module          |
| `sdk_pb.js`         | Data processing enhancement module |
| `sdk_grpc_pb.js`    | Network communication module       |

These three files together form the script's **toolbox**, providing all essential capabilities required for crawler execution and interaction with the platform backend.

---

## Core Feature Usage Guide

### 1. Environment Parameters – Retrieve Script Startup Configuration

When the script starts, configuration parameters (such as target website URLs or search keywords) can be passed in externally.

Use the following method to retrieve them:

```javascript
// Retrieve all input parameters
const inputJson = await coresdk.parameter.getInputJSONObject()
await coresdk.log.debug(`Input parameters: ${JSON.stringify(inputJson)}`)
```

**Use case:**
If you need to crawl different websites for different tasks, you can simply pass different parameters without modifying the script code.

---

### 2. Runtime Logs – Track Script Execution

During execution, you can record logs at different levels. These logs will be displayed in the platform console, making it easy to monitor execution status and troubleshoot issues:

```javascript
// Debug logs (most detailed, used for troubleshooting)
coresdk.log.debug("Connecting to target website...")

// Informational logs (normal execution flow)
coresdk.log.info("Successfully retrieved 10 news items")

// Warning logs (non-critical issues)
coresdk.log.warn("Network connection is slow, which may affect performance")

// Error logs (execution failures)
coresdk.log.error("Unable to access target website, please check the network connection")
```

**Log Level Description**:

* **debug**: Detailed debugging information, recommended during development
* **info**: Normal execution flow logs
* **warn**: Warnings indicating potential issues that do not stop execution
* **error**: Errors that require attention

---

### 3. Result Submission – Sending Collected Data Back to the Platform

After data collection, results must be returned to the platform in two steps.

---

### Step 1: Define Table Headers (Required)

Before pushing any data, you need to define the table structure—similar to defining column headers in Excel:

```javascript
// Define table columns
const headers = [
    {
        label: 'URL',
        key: 'url',
        format: 'text'
    },
    {
        label: 'Status',
        key: 'status',
        format: 'text'
    }
]

// Set table headers
await coresdk.result.setTableHeader(headers)
```

**Field Description**:

* **label**: Column name displayed to users (user-visible)
* **key**: Unique identifier used in code
* **format**: Data type, supported values:
  * `"text"` – string
  * `"integer"` – integer
  * `"boolean"` – boolean
  * `"array"` – list/array
  * `"object"` – object/dictionary

---

### Step 2: Push Data Row by Row

After setting the table headers, push collected data one record at a time:

```javascript
// Simulated business result
const result = {
    status: 'success',
    data: [
        {
            title: 'Sample Title',
            content: 'Sample Content'
        }
    ]
}

// Push result data
await coresdk.log.info(`Processing result: ${JSON.stringify(result)}`)
const dataObject = result.data

for (let index = 0; index < dataObject.length; index++) {
    await coresdk.result.pushData(dataObject[index])
}
```

**Important Notes**:

1. The order of setting table headers and pushing data does not matter
2. Keys in the pushed data must exactly match the keys defined in the table headers
3. Data must be pushed **one record at a time**
4. It is recommended to log after each push for easier tracking

---

### Common Issues & Notes

1. **File location**: Ensure all three SDK files are placed in the script's **root directory**
2. **Imports**: You can directly use `SDK` or `CoreSDK` in your code
3. **Key consistency**: Data keys must exactly match table header keys (case-sensitive)
4. **Error handling**: Always check SDK call results, especially when pushing data

With these features, your script can seamlessly integrate with the platform backend, enabling flexible parameter configuration, transparent execution monitoring, and standardized data output.

---

# Script Entry File (`main.js`)

## Example Code

```javascript
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')

async function run() {
    try {
        // 1. Retrieve input parameters
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`Input parameters: ${JSON.stringify(inputJson)}`)

        // 2. Get proxy configuration (retrieve from environment variables)
        const proxyDomain = process.env.PROXY_DOMAIN
        await coresdk.log.info(`Proxy domain: ${proxyDomain}`)

        let proxyAuth = null
        try {
            proxyAuth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`Proxy authentication: ${proxyAuth}`)
        } catch (err) {
            await coresdk.log.error(`Failed to retrieve proxy authentication: ${err.message}`)
            proxyAuth = null
        }

        // 3. Build proxy URL
        const proxyUrl = proxyAuth
            ? `socks5://${proxyAuth}@${proxyDomain}`
            : null
        await coresdk.log.info(`Proxy URL: ${proxyUrl}`)

        // 4. Business logic processing
        const url = inputJson?.url
        await coresdk.log.info(`Start processing URL: ${url}`)

        // Simulated business result
        const result = {
            url,
            status: 'success',
            data: [
                {
                    title: 'Sample Title',
                    content: 'Sample Content'
                }
            ]
        }

        // 5. Push result data
        await coresdk.log.info(`Processing result: ${JSON.stringify(result)}`)
        const dataObject = result.data
        for (let index = 0; index < dataObject.length; index++) {
            await coresdk.result.pushData(dataObject[index])
        }

        // 6. Set table headers
        const headers = [
            {
                label: 'URL',
                key: 'url',
                format: 'text'
            },
            {
                label: 'Status',
                key: 'status',
                format: 'text'
            }
        ]

        await coresdk.result.setTableHeader(headers)

        await coresdk.log.info('Script execution completed')
    } catch (err) {
        await coresdk.log.error(`Script execution error: ${err.message}`)

        const errorResult = {
            error: err.message,
            error_code: '500',
            status: 'failed'
        }

        await coresdk.result.pushData(errorResult)
        throw err
    }
}

run()
```

---

# Automated Data Collection Script: Workflow & Principles

## 1. Script Overview

This is a Script for an automation tool that works like a **"digital worker."**
It automatically opens specified web pages (such as social media sites), extracts required information, and organizes it into structured tables.

---

## 2. How Does It Work?

The entire process can be simplified into four main stages:

---

### Step 1: Receive Instructions (Input Parameters)

Before execution, you provide instructions such as:

* Target page URL
* Number of records to collect

---

### Step 2: Stealth Preparation (Proxy Network Configuration)

To reliably access overseas or restricted websites, the script automatically configures a secure proxy channel.

---

### Step 3: Automated Execution (Business Logic Processing)

This is the core stage where the script:

* Visits target pages
* Extracts titles, content, images, and other required data

---

### Step 4: Result Reporting (Data Push & Table Generation)

After collection:

* Raw data is converted into standardized formats
* Results are saved to the system
* Table headers (e.g., "URL", "Content") are automatically generated

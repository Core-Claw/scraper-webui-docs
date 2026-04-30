---
title: Node.js Example
description: Build a Worker using Node.js
sidebar:
  order: 2
---

Learn how to build a Worker using Node.js.

## GitHub Repository

Node.js Script Demo Repository:
[NodeScirptDemo](https://github.com/Core-Claw/NodeScirptDemo)

---

## Required Files (Project Root Directory)

```text
├── main.js              # Script entry file
├── package.json         # Node.js dependencies
├── input_schema.json    # Input form configuration
├── output_schema.json   # Output table configuration
├── sdk.js               # CoreClaw SDK - Core functionality
├── sdk_pb.js            # Data processing module
└── sdk_grpc_pb.js       # Network communication module
```

### File Overview

| File | Description |
| ---- | ----------- |
| **main.js** | Script entry file (execution entry), must be named `main` |
| **package.json** | Node.js dependency management file |
| **input_schema.json** | UI input form configuration file |
| **output_schema.json** | Output table structure configuration file |
| **sdk.js** | Core SDK functionality |
| **sdk_pb.js** | Enhanced data processing module |
| **sdk_grpc_pb.js** | Network communication module |

These three SDK files (`sdk.js`, `sdk_pb.js`, `sdk_grpc_pb.js`) are required and must be placed in the **root directory** of the project. Together they form the script's **toolbox**, providing all essential capabilities for Worker execution and interaction with the platform backend.

---

## Core SDK Usage

The CoreClaw SDK (`coresdk`) provides three core capabilities that every Worker needs:

### 1. Parameter Retrieval — Get Input Configuration

When a Worker starts, the platform passes input parameters (such as URLs, keywords, etc.). Use the following method to retrieve them:

```javascript
const coresdk = require('./sdk')

// Get all input parameters as a JSON object
const inputJson = await coresdk.parameter.getInputJSONObject()

// Example: retrieve a specific parameter
const url = inputJson?.url
```

**Use case**: Pass different parameters for different tasks without modifying code.

### 2. Logging — Record Execution Progress

Record different levels of log messages during execution. These logs appear in the Console, making it easy to monitor status and debug issues:

```javascript
// Debug info (most detailed, for troubleshooting)
await coresdk.log.debug("Connecting to target website...")

// General info (normal process recording)
await coresdk.log.info("Successfully retrieved 10 data items")

// Warning (notable but non-error situations)
await coresdk.log.warn("Slow network connection, may affect speed")

// Error (execution failures)
await coresdk.log.error("Cannot access target website")
```

**Log levels**:
- **debug** — Most detailed, ideal for development
- **info** — Normal process recording, recommended for key steps
- **warn** — Warning, indicates potential issues
- **error** — Error, requires attention

### 3. Result Output — Push Data Back to Platform

After collecting data, push it back to the platform in two steps:

#### Step 1: Set Table Headers

Define the table structure before pushing data, similar to defining column headers in a spreadsheet:

```javascript
const headers = [
    { label: "Title", key: "title", format: "text" },
    { label: "URL", key: "url", format: "text" },
    { label: "Category", key: "category", format: "text" },
]
await coresdk.result.setTableHeader(headers)
```

**Field descriptions**:
- **label** — Column title displayed to users
- **key** — Unique identifier used in code (match with pushData keys)
- **format** — Data type: `"text"`, `"integer"`, `"boolean"`, `"array"`, `"object"`

#### Step 2: Push Data Row by Row

Push each collected data item individually:

```javascript
for (const item of collectedData) {
    const obj = {
        title: item.title,
        url: item.url,
        category: item.category,
    }
    await coresdk.result.pushData(obj)
}
```

**Important**:
- Setting headers and pushing data can be done in any order
- Keys in pushData must match keys in table headers exactly
- Data must be pushed **one row at a time**
- Add logging after each push to track progress

---

## Script Entry File (main.js)

### Complete Example

```javascript
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')

async function run() {
    try {
        // 1. Get input parameters
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`Input parameters: ${JSON.stringify(inputJson)}`)

        // 2. Proxy configuration (read from environment variables)
        const proxyAuth = process.env.PROXY_AUTH || null
        await coresdk.log.info(`Proxy auth: ${proxyAuth}`)

        // 3. Business logic
        const url = inputJson?.url
        await coresdk.log.info(`Processing URL: ${url}`)

        const result = {
            url,
            status: 'success',
        }

        // 4. Push result data
        await coresdk.result.pushData(result)

        // 5. Set table headers
        const headers = [
            { label: 'URL', key: 'url', format: 'text' },
            { label: 'Status', key: 'status', format: 'text' },
        ]
        await coresdk.result.setTableHeader(headers)

        await coresdk.log.info('Script execution completed')
    } catch (err) {
        await coresdk.log.error(`Execution error: ${err.message}`)

        await coresdk.result.pushData({
            error: err.message,
            error_code: '500',
            status: 'failed',
        })
        throw err
    }
}

run()
```

### How It Works

The script follows four stages:

1. **Receive instructions** — Get input parameters (URLs, keywords, etc.) from the platform
2. **Network setup** — Configure proxy via `PROXY_AUTH` environment variable for accessing external websites
3. **Execute task** — Run the core scraping logic on target pages
4. **Report results** — Push collected data back to the platform and set table headers

---

## Node.js Dependency Management (package.json)

This file declares all Node.js dependencies required to run the script. The platform automatically installs all dependencies specified in this file.

### Example

```json
{
    "name": "node",
    "version": "1.0.0",
    "main": "main.js",
    "type": "commonjs",
    "dependencies": {
        "@grpc/grpc-js": "^1.13.4",
        "google-protobuf": "^4.0.0"
    }
}
```

### Important Notes

#### Required Dependencies

- **@grpc/grpc-js** and **google-protobuf** are required (needed by the SDK)
- All third-party libraries must be listed in `dependencies`

#### Versioning

- Use fixed versions (e.g. `"1.13.4"`) for core dependencies to ensure stability
- Use caret ranges (e.g. `"^1.13.4"`) for compatible updates

#### Installation

- Dependencies are installed automatically by the platform
- The `type` field should be set to `"commonjs"` (the SDK uses CommonJS modules)
- The `main` field must point to your entry file (`main.js`)

---

## FAQ

**Q: Why must I use CommonJS?**
A: The CoreClaw SDK uses CommonJS (`require`) module format. If you use ES modules (`import`), the SDK will not load correctly.

**Q: How do I add new dependencies?**
A: Add the package to the `dependencies` field in `package.json` and re-upload the ZIP package. The platform will install them on the next run.

**Q: What if installation fails?**
A: Check that the package name and version are correct. Verify network connectivity or try an alternative version.
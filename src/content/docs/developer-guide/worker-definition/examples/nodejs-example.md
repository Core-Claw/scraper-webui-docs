---
title: Node.js Example
description: Build a Worker using Node.js
sidebar:
  order: 2
---

Learn how to build a Worker using Node.js.

## GitHub Repository

Node.js Script Demo Repository:
[NodeScirptDemo](https://github.com/core-claw/NodeScirptDemo)

---

## Project Structure

```
├── main.js              # Main entry file
├── package.json         # Dependencies
├── input_schema.json    # Input configuration
├── output_schema.json   # Output configuration
├── README.md            # Documentation
├── sdk.js               # CoreClaw SDK - Core functionality module
├── sdk_pb.js            # Data processing enhancement module
└── sdk_grpc_pb.js       # Network communication module
```

These three SDK files (`sdk.js`, `sdk_pb.js`, `sdk_grpc_pb.js`) are required and must be placed in the **root directory** of the project. Together they form the script's **toolbox**, providing all essential capabilities required for Worker execution and interaction with the platform backend.

---

## Script Entry File (main.js)

### Example

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
        const proxyDomain = process.env.PROXY_DOMAIN
        await coresdk.log.info(`Proxy domain: ${proxyDomain}`)

        let proxyAuth = null
        try {
            proxyAuth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`Proxy auth info: ${proxyAuth}`)
        } catch (err) {
            await coresdk.log.error(`Failed to get proxy auth: ${err.message}`)
            proxyAuth = null
        }

        // 3. Construct proxy URL
        const proxyUrl = proxyAuth
            ? `socks5://${proxyAuth}@${proxyDomain}`
            : null
        await coresdk.log.info(`Proxy URL: ${proxyUrl}`)

        // 4. Business logic
        const url = inputJson?.url
        await coresdk.log.info(`Processing URL: ${url}`)

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
        await coresdk.log.info(`Result: ${JSON.stringify(result)}`)
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

## Dependency Management (package.json)

This file declares all Node.js dependencies required to run the script. The system automatically installs all dependencies specified in this file.

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

- **@grpc/grpc-js** and **google-protobuf** are required (needed by the SDK)
- All third-party libraries must be listed
- Core dependencies should use fixed versions

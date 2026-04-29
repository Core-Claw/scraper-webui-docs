---
title: Quick Start
description: Build your first Worker in minutes
sidebar:
  order: 1
---

Build your first Worker and run it on CoreClaw in minutes.

## Prerequisites

- A CoreClaw developer account
- Basic knowledge of Python, Node.js, or Go
- Git installed on your machine

## Step-by-Step Guide

### 1. Clone a Template

Choose your preferred language and clone the demo repository:

- **Python**: [PythonScirptDemo](https://github.com/Core-Claw/PythonScirptDemo)
- **Node.js**: [NodeScirptDemo](https://github.com/Core-Claw/NodeScirptDemo)
- **Go**: [GoScirptDemo](https://github.com/Core-Claw/GoScirptDemo)

```bash
# Python
git clone https://github.com/Core-Claw/PythonScirptDemo.git

# Node.js
git clone https://github.com/Core-Claw/NodeScirptDemo.git

# Go
git clone https://github.com/Core-Claw/GoScirptDemo.git
```

### 2. Project Structure

A minimal Worker project requires:

```
├── main.py          # Main entry file
├── requirements.txt # Dependencies
├── input_schema.json # Input configuration
├── sdk.py           # CoreClaw SDK
├── sdk_pb2.py       # Data processing module
└── sdk_pb2_grpc.py  # Network communication module
```

### 3. Write Your Script

Edit `main.py` to implement your scraping logic:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import asyncio
import os
from sdk import CoreSDK

async def run():
    try:
        # 1. Get input parameters
        input_json_dict = CoreSDK.Parameter.get_input_json_dict()
        CoreSDK.Log.debug(f"Input parameters: {input_json_dict}")

        # 2. Proxy configuration (read from environment variables)
        proxy_domain = os.environ.get("PROXY_DOMAIN")
        CoreSDK.Log.info(f"Proxy domain: {proxy_domain}")

        # 3. Business logic
        url = input_json_dict.get('url')
        CoreSDK.Log.info(f"Processing URL: {url}")

        result = {
            "url": url,
            "status": "success",
        }

        # 4. Push result data
        CoreSDK.Result.push_data(result)

        # 5. Set table headers
        headers = [
            {"label": "URL", "key": "url", "format": "text"},
            {"label": "Status", "key": "status", "format": "text"},
        ]
        CoreSDK.Result.set_table_header(headers)

        CoreSDK.Log.info("Script execution completed")

    except Exception as e:
        CoreSDK.Log.error(f"Execution error: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(run())
```

### 4. Configure Input Schema

Define the input form in `input_schema.json`:

```json
{
    "description": "My first Worker",
    "b": "url",
    "properties": [
        {
            "title": "URL",
            "name": "url",
            "type": "array",
            "editor": "requestList",
            "default": [
                {
                    "url": "https://example.com"
                }
            ],
            "required": true
        }
    ]
}
```

### 5. Test Locally

Run your Worker locally to test:

```bash
python main.py
```

### 6. Deploy to CoreClaw

1. Log in to CoreClaw Console
2. Go to "My Workers"
3. Upload your project
4. Build and test
5. Publish to Worker Store

---
title: Python Script
description: Learn how to write Python scripts for CoreClaw Workers
---

# Python Script Demo

## GitHub Repository

Python Script Demo Repository:
[https://github.com/core-claw/PythonScirptDemo](https://github.com/core-claw/PythonScirptDemo)

---

## Required Files (Project Root Directory)

```text
├── main.py
├── requirements.txt
├── input_schema.json
├── README.md
├── sdk.py
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

---

## File Overview

| File Name                                   | Description                                               |
| :------------------------------------------ | :-------------------------------------------------------- |
| **main.py**                                 | Script entry file (execution entry), must be named `main` |
| **requirements.txt**                        | Python dependency management file                         |
| **input_schema.json**                       | UI input form configuration file                          |
| **README.md**                               | Project documentation                                     |
| **sdk.py**                                  | Core SDK functionality                                    |
| **sdk_pb2.py**                              | Enhanced data processing module                           |
| **sdk_pb2_grpc.py**                         | Network communication module                              |

---

## Core Script SDK

### SDK File Description

The following three SDK files are **mandatory** and must be placed in the script's root directory:

| File Name                                   | Main Function                   |
| :------------------------------------------ | :------------------------------ |
| **sdk.py**                                  | Core functionality module       |
| **sdk_pb2.py**                              | Enhanced data processing module |
| **sdk_pb2_grpc.py**                         | Network communication module    |

These three files together form the script's **toolbox**, providing all essential capabilities required for crawler execution and interaction with the platform's backend system.

---

## Core Feature Usage Guide

### 1. Environment Parameters

**Retrieve configuration passed at script startup**

When the script starts, external configuration parameters can be passed in (such as target website URLs, search keywords, etc.).

Use the following method to retrieve them:

```python
# Retrieve all input parameters as a dictionary
parameters = SDK.Parameter.get_input_json_dict()

# Example return value:
# {"website": "example.com", "keyword": "tech news"}
```

**Use case:**
If you need to collect data from different websites for different tasks, simply pass different parameters without modifying the script code.

---

### 2. Runtime Logging

**Record script execution progress**

During execution, you can log messages at different levels. These logs will be displayed in the platform UI, making it easier to monitor execution status and troubleshoot issues.

```python
# Debug-level logs (most detailed)
SDK.Log.debug("Connecting to target website...")

# Informational logs (normal execution flow)
SDK.Log.info("Successfully collected 10 news articles")

# Warning logs (non-fatal issues)
SDK.Log.warn("Network latency detected, collection speed may be affected")

# Error logs (execution failures)
SDK.Log.error("Failed to access target website, please check network connection")
```

#### Log Level Explanation

* **debug**: Most detailed logs, recommended during development
* **info**: Normal execution flow, recommended at key steps
* **warn**: Potential issues that do not stop execution
* **error**: Errors that require attention

---

### 3. Returning Results

**Send collected data back to the platform**

Once data is collected, it must be returned to the platform in **two steps**.

---

#### Step 1: Define Table Headers (Required)

Before pushing any data, define the table structure—similar to defining column headers in Excel.

```python
headers = [
    {
        "label": "News Title",
        "key": "title",
        "format": "text",
    },
    {
        "label": "Publish Time",
        "key": "publish_time",
        "format": "text",
    },
    {
        "label": "Category",
        "key": "category",
        "format": "text",
    },
]

# Set table headers
res = CoreSDK.Result.set_table_header(headers)
```

##### Field Explanation

* **label**: Column name shown to users (recommended to use descriptive names)
* **key**: Unique identifier used in code (recommended lowercase with underscores)
* **format**: Data type, supported values:
  * `"text"`: String / text
  * `"integer"`: Integer
  * `"boolean"`: Boolean (true / false)
  * `"array"`: List / array
  * `"object"`: Dictionary / object

---

#### Step 2: Push Data Records One by One

```python
news_data = [
    {"title": "AI Breakthrough", "publish_time": "2023-10-01", "category": "Technology"},
    {"title": "Stock Market Today", "publish_time": "2023-10-01", "category": "Finance"},
]

for i, news in enumerate(news_data):
    obj = {
        "title": news.get('title'),
        "publish_time": news.get('publish_time'),
        "category": news.get('category'),
    }

    res = CoreSDK.Result.push_data(obj)
    SDK.Log.info(f"Pushed record {i + 1}: {news.get('title')}")
```

##### Important Notes

* Header definition and data pushing **can be done in either order**
* Data keys **must exactly match** the header keys (case-sensitive)
* Data must be pushed **one record at a time**
* Logging after each push is recommended

---

## Complete Code Example

```python
from sdk import CoreSDK

# 1. Get input parameters
config = SDK.Parameter.get_input_json_dict()
website = config.get("website", "default website")
SDK.Log.info(f"Starting collection for website: {website}")

# 2. Set table headers
headers = [
    {"label": "Title", "key": "title", "format": "text"},
    {"label": "Time", "key": "publish_time", "format": "text"},
    {"label": "Category", "key": "category", "format": "text"},
    {"label": "Views", "key": "view_count", "format": "integer"},
]
CoreSDK.Result.set_table_header(headers)

# 3. Simulate data collection
SDK.Log.info("Collecting data...")
collected_data = [
    {"title": "Sample News 1", "publish_time": "2023-10-01 10:00", "category": "Tech", "view_count": 1000},
    {"title": "Sample News 2", "publish_time": "2023-10-01 11:00", "category": "Finance", "view_count": 500},
]

# 4. Push data
SDK.Log.info(f"Collected {len(collected_data)} records, pushing data...")
for data in collected_data:
    obj = {
        "title": data.get("title"),
        "publish_time": data.get("publish_time"),
        "category": data.get("category"),
        "view_count": data.get("view_count", 0),
    }
    CoreSDK.Result.push_data(obj)

# 5. Done
SDK.Log.info("Data collection task completed!")
```

---

## Script Entry File (main.py)

### Example

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import asyncio
import os
from sdk import CoreSDK

async def run():
    """
    Simplified Instagram Reel data collection example
    Retains only core SDK calls and proxy configuration
    """
    try:
        # 1. Get input parameters
        input_json_dict = CoreSDK.Parameter.get_input_json_dict()
        CoreSDK.Log.debug(f"Input parameters: {input_json_dict}")

        # 2. Proxy configuration (read from environment variable for flexible deployment)
        proxy_domain = os.environ.get("PROXY_DOMAIN") or "proxy-inner.coreclaw.com:6000"
        CoreSDK.Log.info(f"Proxy domain: {proxy_domain}")

        try:
            proxy_auth = os.environ.get("PROXY_AUTH")
            CoreSDK.Log.info(f"Proxy auth info: {proxy_auth}")
        except Exception as e:
            CoreSDK.Log.error(f"Failed to get proxy auth: {e}")
            proxy_auth = None

        proxy_url = f"socks5://{proxy_auth}@{proxy_domain}" if proxy_auth else None
        CoreSDK.Log.info(f"Proxy URL: {proxy_url}")

        # 3. Business logic
        url = input_json_dict.get('url')
        CoreSDK.Log.info(f"Processing URL: {url}")

        result = {
            "url": url,
            "status": "success",
            "data": {
                "title": "Sample Title",
                "content": "Sample Content",
            }
        }

        # 4. Push result
        CoreSDK.Result.push_data(result)

        # 5. Set headers if table output is required
        headers = [
            {"label": "URL", "key": "url", "format": "text"},
            {"label": "Status", "key": "status", "format": "text"},
        ]
        CoreSDK.Result.set_table_header(headers)

        CoreSDK.Log.info("Script execution completed")

    except Exception as e:
        CoreSDK.Log.error(f"Execution error: {e}")
        CoreSDK.Result.push_data({
            "error": str(e),
            "error_code": "500",
            "status": "failed"
        })
        raise

if __name__ == "__main__":
    asyncio.run(run())
```

---

## Python Dependency Management (requirements.txt)

This file lists all third-party Python packages required to run the script.
The system automatically installs all dependencies specified in this file.

### Example

```text
attrs==25.4.0
beautifulsoup4==4.14.2
certifi==2025.10.5
cffi==2.0.0
charset-normalizer==3.4.4
click==8.3.0
colorama==0.4.6
cssselect==1.3.0
DataRecorder==3.6.2
DownloadKit==2.0.7
DrissionPage==4.1.1.2
et_xmlfile
filelock
```

---

## Important Notes

### 1. Versioning

* Packages with versions (e.g. `beautifulsoup4==4.14.2`) will be installed exactly as specified
* Packages without versions will install the latest available version

### 2. Installation

* Dependencies are installed automatically
* Installation time depends on network speed and package size
* Errors will be displayed if installation fails

### 3. Ensuring Proper Execution

* **grpcio** and **protobuf** must be included (required by the SDK)
* All third-party libraries must be listed
* Core dependencies should use fixed versions
* Update dependencies regularly for security and stability

---

## FAQ

**Q: Why specify versions?**
A: To ensure consistent behavior across development, testing, and production environments.

**Q: What if I don't specify a version?**
A: The latest version will be installed, which may cause compatibility issues.

**Q: How do I add new dependencies?**
A: Add a new line to this file and re-upload the ZIP package.

**Q: What if installation fails?**
A: Check network connectivity or package mirrors, or contact the system administrator.

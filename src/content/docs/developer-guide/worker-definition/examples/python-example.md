---
title: Python Example
description: Build a Worker using Python
sidebar:
  order: 1
---

Learn how to build a Worker using Python.

## GitHub Repository

Python Script Demo Repository:
[PythonScirptDemo](https://github.com/Core-Claw/PythonScirptDemo)

---

## Required Files (Project Root Directory)

```text
├── main.py              # Script entry file
├── requirements.txt     # Python dependencies
├── input_schema.json    # Input form configuration
├── output_schema.json   # Output table configuration
├── sdk.py               # CoreClaw SDK - Core functionality
├── sdk_pb2.py           # Data processing module
└── sdk_pb2_grpc.py      # Network communication module
```

### File Overview

| File | Description |
| ---- | ----------- |
| **main.py** | Script entry file (execution entry), must be named `main` |
| **requirements.txt** | Python dependency management file |
| **input_schema.json** | UI input form configuration file |
| **output_schema.json** | Output table structure configuration file |
| **sdk.py** | Core SDK functionality |
| **sdk_pb2.py** | Enhanced data processing module |
| **sdk_pb2_grpc.py** | Network communication module |

These three SDK files (`sdk.py`, `sdk_pb2.py`, `sdk_pb2_grpc.py`) are required and must be placed in the **root directory** of the project. Together they form the script's **toolbox**, providing all essential capabilities for Worker execution and interaction with the platform backend.

---

## Core SDK Usage

The CoreClaw SDK (`CoreSDK`) provides three core capabilities that every Worker needs:

### 1. Parameter Retrieval — Get Input Configuration

When a Worker starts, the platform passes input parameters (such as URLs, keywords, etc.). Use the following method to retrieve them:

```python
from sdk import CoreSDK

# Get all input parameters as a dictionary
input_json_dict = CoreSDK.Parameter.get_input_json_dict()

# Example: retrieve a specific parameter
url = input_json_dict.get('url')
```

**Use case**: Pass different parameters for different tasks without modifying code.

### 2. Logging — Record Execution Progress

Record different levels of log messages during execution. These logs appear in the Console, making it easy to monitor status and debug issues:

```python
# Debug info (most detailed, for troubleshooting)
CoreSDK.Log.debug("Connecting to target website...")

# General info (normal process recording)
CoreSDK.Log.info("Successfully retrieved 10 data items")

# Warning (notable but non-error situations)
CoreSDK.Log.warn("Slow network connection, may affect speed")

# Error (execution failures)
CoreSDK.Log.error("Cannot access target website")
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

```python
headers = [
    {"label": "Title", "key": "title", "format": "text"},
    {"label": "URL", "key": "url", "format": "text"},
    {"label": "Category", "key": "category", "format": "text"},
]
CoreSDK.Result.set_table_header(headers)
```

**Field descriptions**:
- **label** — Column title displayed to users
- **key** — Unique identifier used in code (match with push_data keys)
- **format** — Data type: `"text"`, `"integer"`, `"boolean"`, `"array"`, `"object"`

#### Step 2: Push Data Row by Row

Push each collected data item individually:

```python
for item in collected_data:
    obj = {
        "title": item.get("title"),
        "url": item.get("url"),
        "category": item.get("category"),
    }
    CoreSDK.Result.push_data(obj)
```

**Important**:
- Setting headers and pushing data can be done in any order
- Keys in push_data must match keys in table headers exactly
- Data must be pushed **one row at a time**
- Add logging after each push to track progress

---

## Script Entry File (main.py)

### Complete Example

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
        proxy_auth = os.environ.get("PROXY_AUTH")
        CoreSDK.Log.info(f"Proxy auth: {proxy_auth}")

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
        CoreSDK.Result.push_data({
            "error": str(e),
            "error_code": "500",
            "status": "failed"
        })
        raise

if __name__ == "__main__":
    asyncio.run(run())
```

### How It Works

The script follows four stages:

1. **Receive instructions** — Get input parameters (URLs, keywords, etc.) from the platform
2. **Network setup** — Configure proxy via `PROXY_AUTH` environment variable for accessing external websites
3. **Execute task** — Run the core scraping logic on target pages
4. **Report results** — Push collected data back to the platform and set table headers

---

## Python Dependency Management (requirements.txt)

This file lists all third-party Python packages required to run the script. The platform automatically installs all dependencies specified in this file.

### Example

```text
aiofiles==25.1.0
certifi==2025.11.12
cffi==2.0.0
cssselect==1.3.0
curl_cffi==0.13.0
grpcio==1.80.0
python-dateutil
tenacity
```

### Important Notes

#### Versioning

- Packages with versions (e.g. `beautifulsoup4==4.14.2`) will be installed exactly as specified
- Packages without versions will install the latest available version

#### Installation

- Dependencies are installed automatically by the platform
- Installation time depends on network speed and package size
- Errors will be displayed if installation fails

#### Ensuring Proper Execution

- **grpcio** and **protobuf** must be included (required by the SDK)
- All third-party libraries must be listed
- Core dependencies should use fixed versions for stability
- Update dependencies regularly for security and bug fixes

---

## FAQ

**Q: Why specify versions?**
A: To ensure consistent behavior across development, testing, and production environments.

**Q: What if I don't specify a version?**
A: The latest version will be installed, which may cause compatibility issues. For core dependencies, pinning versions is recommended.

**Q: How do I add new dependencies?**
A: Add a new line to `requirements.txt` and re-upload the ZIP package. The platform will install them on the next run.

**Q: What if installation fails?**
A: Check network connectivity or package mirrors. If the issue persists, verify the package name and version.
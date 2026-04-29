---
title: Python Example
description: Learn how to write Python scripts for CoreClaw Workers
sidebar:
  order: 1
---

## Python Script Demo

## GitHub Repository

Python Script Demo Repository:
[PythonScirptDemo](https://github.com/core-claw/PythonScirptDemo)

---

## Required Files (Project Root Directory)

```text
├── main.py
├── requirements.txt
├── input_schema.json
├── output_schema.json
├── README.md
├── sdk.py
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

---

## File Overview

| File Name            | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| **main.py**          | Script entry file (execution entry), must be named `main`  |
| **requirements.txt** | Python dependency management file                          |
| **input_schema.json** | UI input form configuration file                          |
| **README.md**        | Project documentation                                      |
| **sdk.py**           | Core SDK functionality                                     |
| **sdk_pb2.py**       | Enhanced data processing module                            |
| **sdk_pb2_grpc.py**  | Network communication module                               |

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

        # 2. Proxy configuration (retrieve from environment variables)
        proxy_domain = os.environ.get("PROXY_DOMAIN")
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
aiofiles==25.1.0
certifi==2025.11.12
cffi==2.0.0
cssselect==1.3.0
curl_cffi==0.13.0
grpcio==1.80.0
python-dateutil
tenacity
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

---
title: SDK Modules
description: CoreClaw SDK modules and APIs for Worker development
sidebar:
  order: 4
---

CoreClaw SDK provides core modules for Worker development.

## SDK File Description

The following SDK files are **mandatory** and must be placed in the project:

### Python Project

| File Name           | Main Function                   |
| ------------------- | ------------------------------- |
| **sdk.py**          | Core functionality module       |
| **sdk_pb2.py**      | Enhanced data processing module |
| **sdk_pb2_grpc.py** | Network communication module    |

### Node.js Project

| File Name            | Main Function                   |
| -------------------- | ------------------------------- |
| **sdk.js**           | Core functionality module       |
| **sdk_pb.js**        | Enhanced data processing module |
| **sdk_grpc_pb.js**   | Network communication module    |

### Go Project

| File Name              | Main Function                   |
| ---------------------- | ------------------------------- |
| **GoSdk/sdk.go**       | Core functionality module       |
| **GoSdk/sdk.pb.go**    | Enhanced data processing module |
| **GoSdk/sdk_grpc.pb.go** | Network communication module |

These files together form the script's **toolbox**, providing all essential capabilities required for Worker execution and interaction with the platform's backend system.

---

## Core Feature Usage Guide

### 1. Environment Parameters

**Retrieve configuration passed at script startup**

When the script starts, external configuration parameters can be passed in (such as target website URLs, search keywords, etc.).

#### Python

```python
from sdk import CoreSDK

# Retrieve all input parameters as a dictionary
parameters = CoreSDK.Parameter.get_input_json_dict()

# Retrieve as raw JSON string
json_str = CoreSDK.Parameter.get_input_json_str()
```

#### Node.js

```javascript
const coresdk = require('./sdk')

// Retrieve as parsed JSON object
const inputJson = await coresdk.parameter.getInputJSONObject()

// Retrieve as raw JSON string
const jsonString = await coresdk.parameter.getInputJSONString()
```

#### Go

```go
import coresdk "test/GoSdk"

// Retrieve as raw JSON string
inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
```

**Use case:**
If you need to collect data from different websites for different tasks, simply pass different parameters without modifying the script code.

---

### 2. Runtime Logging

**Record script execution progress**

During execution, you can log messages at different levels. These logs will be displayed in the platform UI, making it easier to monitor execution status and troubleshoot issues.

#### Python

```python
from sdk import CoreSDK

CoreSDK.Log.debug("Connecting to target website...")
CoreSDK.Log.info("Successfully collected 10 news articles")
CoreSDK.Log.warn("Network latency detected")
CoreSDK.Log.error("Failed to access target website")
```

#### Node.js

```javascript
const coresdk = require('./sdk')

await coresdk.log.debug("Connecting to target website...")
await coresdk.log.info("Successfully collected 10 news articles")
await coresdk.log.warn("Network latency detected")
await coresdk.log.error("Failed to access target website")
```

#### Go

```go
coresdk.Log.Debug(ctx, "Connecting to target website...")
coresdk.Log.Info(ctx, "Successfully collected 10 news articles")
coresdk.Log.Warn(ctx, "Network latency detected")
coresdk.Log.Error(ctx, "Failed to access target website")
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

##### Python

```python
headers = [
    {"label": "News Title", "key": "title", "format": "text"},
    {"label": "Publish Time", "key": "publish_time", "format": "text"},
    {"label": "Category", "key": "category", "format": "text"},
]

res = CoreSDK.Result.set_table_header(headers)
```

##### Node.js

```javascript
const headers = [
    { label: "News Title", key: "title", format: "text" },
    { label: "Publish Time", key: "publish_time", format: "text" },
    { label: "Category", key: "category", format: "text" },
]

await coresdk.result.setTableHeader(headers)
```

##### Go

```go
headers := []*coresdk.TableHeaderItem{
    {Label: "News Title", Key: "title", Format: "text"},
    {Label: "Publish Time", Key: "publish_time", Format: "text"},
    {Label: "Category", Key: "category", Format: "text"},
}

res, err := coresdk.Result.SetTableHeader(ctx, headers)
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

##### Python

```python
news_data = [
    {"title": "AI Breakthrough", "publish_time": "2023-10-01", "category": "Technology"},
    {"title": "Stock Market Today", "publish_time": "2023-10-01", "category": "Finance"},
]

for i, news in enumerate(news_data):
    res = CoreSDK.Result.push_data(news)
    CoreSDK.Log.info(f"Pushed record {i + 1}: {news.get('title')}")
```

##### Node.js

```javascript
const newsData = [
    { title: "AI Breakthrough", publish_time: "2023-10-01", category: "Technology" },
    { title: "Stock Market Today", publish_time: "2023-10-01", category: "Finance" },
]

for (let i = 0; i < newsData.length; i++) {
    await coresdk.result.pushData(newsData[i])
    await coresdk.log.info(`Pushed record ${i + 1}: ${newsData[i].title}`)
}
```

##### Go

```go
for i, news := range newsData {
    jsonBytes, _ := json.Marshal(news)
    res, err := coresdk.Result.PushData(ctx, string(jsonBytes))
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("Failed to push data: %v", err))
        return
    }
    coresdk.Log.Info(ctx, fmt.Sprintf("Pushed record %d", i+1))
}
```

##### Important Notes

* Header definition and data pushing **can be done in either order**
* Data keys **must exactly match** the header keys (case-sensitive)
* Data must be pushed **one record at a time**
* Logging after each push is recommended

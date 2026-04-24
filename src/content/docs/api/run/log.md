---
title: Run Log
description: Get the logs of a Worker run.
sidebar:
    order: 4
---

**Method:** `POST`

**Endpoint:** `/api/v1/run/last/log`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "run_slug": "01KKJYJ4HH0R9K7XD856MAE1WH"
}
```

#### Parameters

| Parameter | Example                    | Type   | Required | Description           |
| --------- | -------------------------- | ------ | -------- | --------------------- |
| run_slug  | 01KKJYJ4HH0R9K7XD856MAE1WH | String | Yes      | Unique run identifier |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "all_logs_url": "https://smpfile.coreclaw.com/log/all_log_7cb43d81-38d5-47b6-a313-4e1423d4c28a_1773383790454",
        "list": [
            {
                "type": 2,
                "group": "28596067108978688",
                "content": "SYSTEM: Subtask-[28596067108978688] - Preparing the execution environment.",
                "timestamp": 1773383784438
            }
        ],
        "result_count": 4
    }
}
```

#### Response Fields

| Parameter    | Example | Type    | Description                     |
| ------------ | ------- | ------- | ------------------------------- |
| code         | 0       | Integer | Global status code              |
| message      | success | String  | Response message                |
| data         | -       | Object  | Response payload                |
| all_logs_url | -       | String  | URL of the full log file        |
| list         | -       | Array   | Summary log entries             |
| result_count | 4       | Integer | Total number of collected rows  |

##### `list` Fields

| Parameter | Example | Type    | Description                                      |
| --------- | ------  | ------- | ------------------------------------------------ |
| type      | 1       | Integer | Log level: 1 Debug, 2 Info, 3 Warn, 4 Error     |
| group     | -       | String  | Log group identifier                             |
| content   | -       | String  | Log content                                      |
| timestamp | -       | Integer | Log timestamp in milliseconds                    |

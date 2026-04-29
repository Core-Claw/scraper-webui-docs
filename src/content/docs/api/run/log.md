---
title: Run Log
description: Get the logs of a Worker run.
sidebar:
    order: 4
---

**Method:** `GET`

**Endpoint:** `/api/v1/runs/{run_slug}/logs`

## Path Parameters

| Parameter | Required | Description           |
| --------- | -------- | --------------------- |
| run_slug  | Yes      | Unique run identifier |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "full_log_url": "https://smpfile.coreclaw.com/log/all_log_7cb43d81-38d5-47b6-a313-4e1423d4c28a_1773383790454",
        "records": [
            {
                "type": 2,
                "group": "28596067108978688",
                "msg": "SYSTEM: Subtask-[28596067108978688] - Preparing the execution environment.",
                "timestamp": 1773383784438
            }
        ],
        "current_result_count": 4
    }
}
```

#### Response Fields

| Parameter           | Example | Type    | Description                     |
| ------------------- | ------- | ------- | ------------------------------- |
| code                | 0       | Integer | Global status code              |
| message             | success | String  | Response message                |
| data                | -       | Object  | Response payload                |
| full_log_url        | -       | String  | URL of the full log file        |
| records             | -       | Array   | Summary log entries             |
| current_result_count | 4      | Integer | Total number of collected rows  |

##### `records` Fields

| Parameter | Example | Type    | Description                                      |
| --------- | ------- | ------- | ------------------------------------------------ |
| type      | 1       | Integer | Log level: 1 Debug, 2 Info, 3 Warn, 4 Error      |
| group     | -       | String  | Log group identifier                             |
| msg       | -       | String  | Log content                                      |
| timestamp | -       | Integer | Log timestamp in milliseconds                    |

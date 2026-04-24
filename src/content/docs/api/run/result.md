---
title: Run Result
description: Get the results of a Worker run.
sidebar:
    order: 3
---

**Method:** `POST`

**Endpoint:** `/api/v1/run/result/list`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "page": 1,
    "page_size": 20,
    "run_slug": "01KKBBRYX3NTK8HRZ2C6HD0JNM"
}
```

#### Parameters

| Parameter | Example                    | Type    | Required | Description           |
| --------- | -------------------------- | ------- | -------- | --------------------- |
| page      | 1                          | Integer | Yes      | Current page number   |
| page_size | 20                         | Integer | Yes      | Items per page        |
| run_slug  | 01KKBBRYX3NTK8HRZ2C6HD0JNM | String  | Yes      | Unique run identifier |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "count": 4,
        "headers": [
            {
                "label": "title",
                "key": "title",
                "format": "text"
            },
            {
                "label": "publish_time",
                "key": "publish_time",
                "format": "text"
            }
        ],
        "list": [
            {
                "title": "Example Article Title",
                "publish_time": "2026-01-19"
            }
        ]
    }
}
```

#### Response Fields

| Parameter | Example | Type    | Description            |
| --------- | ------- | ------- | ---------------------- |
| code      | 0       | Integer | Global status code     |
| message   | success | String  | Response message       |
| data      | -       | Object  | Response payload       |
| count     | 4       | Integer | Total record count     |
| headers   | -       | Array   | Result table headers   |
| list      | -       | Array   | Result record list     |

##### `headers` Fields

| Parameter | Example | Type   | Description      |
| --------- | ------- | ------ | ---------------- |
| label     | -       | String | Display label    |
| key       | -       | String | Field key        |
| format    | -       | String | Field format     |

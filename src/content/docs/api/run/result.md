---
title: Run Result
description: Get the results of a Worker run.
sidebar:
    order: 3
---

**Method:** `GET`

**Endpoint:** `/api/v1/runs/{run_slug}/results`

## Path Parameters

| Parameter | Required | Description           |
| --------- | -------- | --------------------- |
| run_slug  | Yes      | Unique run identifier |

## Query Parameters

| Parameter | Default | Type    | Required | Description           |
| --------- | ------- | ------- | -------- | --------------------- |
| page      | 1       | Integer | No       | Current page number   |
| page_size | 20      | Integer | No       | Items per page        |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "total": 4,
        "columns": [
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
        "records": [
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
| total     | 4       | Integer | Total record count     |
| columns   | -       | Array   | Result table columns   |
| records   | -       | Array   | Result record list     |

##### `columns` Fields

| Parameter | Example | Type   | Description      |
| --------- | ------- | ------ | ---------------- |
| label     | -       | String | Display label    |
| key       | -       | String | Field key        |
| format    | -       | String | Field format     |

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
    "page_index": 1,
    "page_size": 20,
    "run_slug": "YOUR_RUN_SLUG"
}
```

#### Parameters

| Parameter  | Example       | Type    | Required | Description           |
| ---------- | ------------- | ------- | -------- | --------------------- |
| page_index | 1             | Integer | Yes      | Current page number   |
| page_size  | 20            | Integer | Yes      | Items per page        |
| run_slug   | YOUR_RUN_SLUG | String  | Yes      | Unique run identifier |

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

| Parameter | Example | Type    | Description          |
| --------- | ------- | ------- | -------------------- |
| code      | 0       | Integer | Global status code   |
| message   | success | String  | Response message     |
| data      | -       | Object  | Response payload     |
| count     | 4       | Integer | Total record count   |
| headers   | -       | Array   | Result table headers |
| list      | -       | Array   | Result record list   |

##### `headers` Fields

| Parameter | Example | Type   | Description   |
| --------- | ------- | ------ | ------------- |
| label     | -       | String | Display label |
| key       | -       | String | Field key     |
| format    | -       | String | Field format  |

##### `list[]` Fields

Each item in `list[]` contains the fields defined by the Worker's output schema, matching the `key` values in `headers`.

| Parameter        | Example | Type   | Description            |
| ---------------- | ------- | ------ | ---------------------- |
| __cafe_data_id__ | -       | String | Internal data identifier |
| title            | -       | String | Item title             |
| publish_time     | -       | String | Publish time           |
| category         | -       | String | Item category          |

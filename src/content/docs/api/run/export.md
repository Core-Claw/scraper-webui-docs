---
title: Export Run Result
description: Export the results of a Worker run.
sidebar:
    order: 5
---

**Method:** `POST`

**Endpoint:** `/api/v1/run/result/export`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "run_slug": "YOUR_RUN_SLUG",
    "filter_keys": [],
    "format": "csv"
}
```

#### Parameters

| Parameter   | Example        | Type   | Required | Description                  |
| ----------- | -------------- | ------ | -------- | ---------------------------- |
| run_slug    | YOUR_RUN_SLUG  | String | Yes      | Unique run identifier        |
| filter_keys | -              | Array  | Yes      | Fields to export             |
| format      | csv            | String | Yes      | Export format: `csv` or `json` |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "download_url": "https://..."
    }
}
```

#### Response Fields

| Parameter    | Example | Type   | Description                 |
| ------------ | ------- | ------ | --------------------------- |
| code         | 0       | Integer | Global status code |
| message      | success  | String  | Response message |
| data         | -       | Object  | Response payload |
| download_url | -       | String  | Download URL for the export |

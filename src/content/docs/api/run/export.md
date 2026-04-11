---
title: Export Run Result
description: Export the results of a Worker run.
sidebar:
    order: 10
---

**Method:** `POST`

**Endpoint:** `/api/v1/run/result/export`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "run_slug": "01KK0DP5AK0WMS83RH9H16SS95",
    "filter_keys": [],
    "format": "csv"
}
```

#### Parameters

| Parameter   | Example                    | Type   | Required | Description                   |
| ----------- | -------------------------- | ------ | -------- | ----------------------------- |
| run_slug    | 01KK0DP5AK0WMS83RH9H16SS95 | String | Yes      | Unique run identifier         |
| filter_keys | -                          | Array  | Yes      | Fields to export              |
| format      | csv                        | String | Yes      | Export format: `csv` or `json` |

## Response Example

```json
{
    "code": 0,
    "data": {
        "download_url": ""
    },
    "msg": "Success"
}
```

#### Response Fields

| Parameter    | Example | Description                  |
| ------------ | ------- | ---------------------------- |
| download_url | -       | Download URL for the export  |

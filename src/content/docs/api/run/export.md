---
title: Export Run Result
description: Export the results of a Worker run.
sidebar:
    order: 5
---

**Method:** `POST`

**Endpoint:** `/api/v1/runs/{run_slug}/export`

Send the request body with **Content-Type: application/json**.

## Path Parameters

| Parameter | Required | Description           |
| --------- | -------- | --------------------- |
| run_slug  | Yes      | Unique run identifier |

## Request Body

| Parameter   | Default | Type   | Required | Description                   |
| ----------- | ------- | ------ | -------- | ----------------------------- |
| filter_keys | -       | string | No       | Comma-separated fields to export |
| format      | csv     | String | No       | Export format: `csv` or `json` |

## Request Example

```json
{
    "filter_keys": "",
    "format": "csv"
}
```

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "download_url": "https://smpfile.coreclaw.com/export/...",
        "format": "csv",
        "record_count": 4
    }
}
```

#### Response Fields

| Parameter    | Example | Type    | Description                  |
| ------------ | ------- | ------- | ---------------------------- |
| code         | 0       | Integer | Global status code           |
| message      | success | String  | Response message             |
| data         | -       | Object  | Response payload             |
| download_url | -       | String  | Download URL for the export  |
| format       | csv     | String  | Export format                |
| record_count | 4       | Integer | Number of exported records   |

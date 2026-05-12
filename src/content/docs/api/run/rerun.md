---
title: Re-run
description: Re-run a Worker task.
sidebar:
    order: 6
---

**Method:** `POST`

**Endpoint:** `/api/v1/rerun`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "run_slug": "YOUR_RUN_SLUG",
    "callback_url": "https://your-callback.example.com/webhook"
}
```

#### Parameters

| Parameter    | Type   | Required | Description           |
| ------------ | ------ | -------- | --------------------- |
| run_slug     | String | Yes      | Unique run identifier |
| callback_url | String | Yes      | Callback URL |

Example callback URL: `https://your-callback.example.com/webhook`

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
    }
}
```

#### Response Fields

| Parameter | Example                    | Type    | Description           |
| --------- | -------------------------- | ------- | --------------------- |
| code      | 0                          | Integer | Global status code    |
| message   | success                    | String  | Response message      |
| data      | -                          | Object  | Response payload      |
| run_slug  | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | Unique run identifier |

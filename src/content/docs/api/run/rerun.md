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

| Parameter    | Required | Description           |
| ------------ | -------- | --------------------- |
| run_slug     | Yes      | Unique run identifier |
| callback_url | No       | Optional callback URL |

Example callback URL: `https://your-callback.example.com/webhook`

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": null
}
```

#### Response Fields

| Parameter | Example | Type    | Description        |
| --------- | ------- | ------- | ------------------ |
| code      | 0       | Integer | Global status code |
| message   | success | String  | Response message   |
| data      | null    | Null    | Empty payload      |

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
    "run_slug": "01KJYCSVTDCM7078HNB4Z5RJE2",
    "callback_url": "https://your-domain.com/callback"
}
```

#### Parameters

| Parameter    | Required | Description                     |
| ------------ | -------- | ------------------------------- |
| run_slug     | Yes      | Unique run identifier           |
| callback_url | No       | Optional callback URL           |

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

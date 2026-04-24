---
title: Abort Worker
description: Abort a running Worker task.
sidebar:
    order: 2
---

**Method:** `POST`

**Endpoint:** `/api/v1/scraper/abort`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "run_slug": "01KJYA4S1QQ1PMDVVRP7XH72C51"
}
```

#### Parameters

| Parameter | Required | Description           |
| --------- | -------- | --------------------- |
| run_slug  | Yes      | Unique run identifier |

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

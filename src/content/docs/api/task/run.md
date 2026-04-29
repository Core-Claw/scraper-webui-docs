---
title: Start Task
description: Start a Task.
sidebar:
    order: 1
---

**Method:** `POST`

**Endpoint:** `/api/v1/tasks/{task_slug}/run`

Send the request body with **Content-Type: application/json**.

## Path Parameters

| Parameter  | Required | Description             |
| ---------- | -------- | ----------------------- |
| task_slug  | Yes      | Unique task identifier  |

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

## Error Response

```json
{
    "code": 70001,
    "message": "Run record does not exist",
    "data": null
}
```

#### Error Fields

| Parameter | Example                   | Type    | Description         |
| --------- | ------------------------- | ------- | ------------------- |
| code      | 70001                     | Integer | Error code          |
| message   | Run record does not exist | String  | Error description   |
| data      | null                      | Null    | Empty payload       |

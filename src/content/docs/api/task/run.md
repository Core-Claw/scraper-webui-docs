---
title: Start Task
description: Start a saved Task template.
sidebar:
    order: 1
---

**Method:** `POST`

**Endpoint:** `/api/v1/task/run`

Send the request body with **Content-Type: application/json**.

## When to use this endpoint

Use this endpoint when you already have a saved Task template and want to create a new run from that template.

## Where `task_slug` comes from

`task_slug` is generated when a user creates and saves a Task template. Do not pass a `run_slug` or `scraper_slug` here.

## Request Example

```json
{
    "task_slug": "YOUR_TASK_SLUG",
    "callback_url": "https://your-callback.example.com/webhook"
}
```

#### Parameters

| Parameter    | Example                                      | Type   | Required | Description |
| ------------ | -------------------------------------------- | ------ | -------- | ----------- |
| task_slug    | YOUR_TASK_SLUG                               | String | Yes      | Unique Task template identifier |
| callback_url | https://your-callback.example.com/webhook    | String | Yes      | Callback URL for receiving Task run results |

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

## Validation behavior

- `callback_url` is required. Omitting it returns `400 Bad Request`.
- Passing a `run_slug` or `scraper_slug` instead of a valid `task_slug` results in request validation failure.

## Error Response

Business-level errors may return a structured JSON body such as:

```json
{
    "code": 60001,
    "message": "Task does not exist",
    "data": null
}
```

#### Error Fields

| Parameter | Example             | Type    | Description       |
| --------- | ------------------- | ------- | ----------------- |
| code      | 60001               | Integer | Error code        |
| message   | Task does not exist | String  | Error description |
| data      | null                | Null    | Empty payload     |

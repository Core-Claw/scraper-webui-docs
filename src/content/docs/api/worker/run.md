---
title: Start Worker
description: Start a Worker run.
sidebar:
    order: 1
---

**Method:** `POST`

**Endpoint:** `/api/v1/scraper/run`

Send the request body with **Content-Type: application/json**.

## When to use this endpoint

Use this endpoint when you want to launch a Worker directly by its `scraper_slug`.

## Where `scraper_slug` comes from

Every Worker has its own `scraper_slug`. You can get it from the Worker page, or from the `scraper_slug` field returned by [Run Detail](/api/run/detail/) and [Run History](/api/run/history/).

## Request Example

```json
{
    "scraper_slug": "YOUR_SCRAPER_SLUG",
    "version": "YOUR_WORKER_VERSION",
    "input": {
        "parameters": {
            "system": {
                "cpus": 0.125,
                "memory": 512,
                "execute_limit_time_seconds": 1800,
                "max_total_charge": 0,
                "max_total_traffic": 0,
                "proxy_region": "CH"
            },
            "custom": {
                "startURLs": [
                    {
                        "url": "https://example.com"
                    }
                ]
            }
        }
    },
    "callback_url": "https://your-callback.example.com/webhook"
}
```

### Parameters

| Parameter    | Required | Type   | Description |
| ------------ | -------- | ------ | ----------- |
| scraper_slug | Yes      | string | Unique Worker identifier |
| version      | Yes      | string | Worker version |
| input        | Yes      | object | Input parameters |
| callback_url | Yes      | string | Callback URL for receiving run results |

#### `system` Parameters

| Parameter                   | Example | Type   | Required | Description |
| --------------------------- | ------- | ------ | -------- | ----------- |
| proxy_region                | CH      | string | Yes      | Execution node |
| cpus                        | 0.125   | number | Yes      | Container CPU cores |
| memory                      | 512     | number | Yes      | Container memory size in MB |
| execute_limit_time_seconds  | 1800    | number | Yes      | Container execution timeout in seconds |
| max_total_charge            | 0       | number | Yes      | Maximum charge in USD |
| max_total_traffic           | 0       | number | Yes      | Maximum traffic in MB |

#### `custom` Parameters

Build `input.parameters.custom` from the Worker's `input_schema.json`.

- Use each `properties[].name` as the key in `custom`
- Match the declared `type`, nested structure, and array shape
- Provide all fields whose schema sets `required: true`
- An empty or schema-mismatched `custom` object returns `400 Bad Request`

See [Worker Input Configuration](/developer-guide/worker-definition/input-schema/) for the schema format.

### How to get `version`

You can get the Worker version from:

- the Worker page
- the `version` field returned by [Run Detail](/api/run/detail/)
- the `version` field returned by [Run History](/api/run/history/)

## Validation behavior

- `callback_url` should be provided when you need asynchronous result delivery.
- Passing a `run_slug` or `task_slug` to `scraper_slug` causes request validation failure.
- Providing only generic `system` parameters is not enough if the Worker requires `custom` fields defined by its schema.

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
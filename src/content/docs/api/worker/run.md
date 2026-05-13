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
    "callback_url": "https://your-callback.example.com/webhook",
    "is_async": true
}
```

### Parameters

| Parameter    | Required | Type    | Description |
| ------------ | -------- | ------- | ----------- |
| scraper_slug | Yes      | string  | Unique Worker identifier |
| version      | Yes      | string  | Worker version |
| input        | Yes      | object  | Input parameters |
| is_async     | Yes      | boolean | `true`: async execution (default), `false`: sync execution (waits for completion) |
| callback_url | No       | string  | Callback URL for receiving run results |

#### `system` Parameters

| Parameter                   | Example | Type   | Required | Description |
| --------------------------- | ------- | ------ | -------- | ----------- |
| proxy_region                | CH    | string | Yes      | Execution node (ISO 3166-1 alpha-2 country code). Common: `US`, `CN`, `HK`, `JP`, `SG`, `DE`, `GB`, `FR`. See Swagger definition for the full list of supported codes. |
| cpus                        | 0.125 | number | Yes      | Container CPU cores |
| memory                      | 512   | integer | Yes      | Container memory size in MB. Supported values: `512`, `1024`, `2048`, `4096`, `8192`, `16384` |
| execute_limit_time_seconds  | 1800    | integer | Yes      | Container execution timeout in seconds |
| max_total_charge            | 0       | integer | Yes      | Maximum charge in USD |
| max_total_traffic           | 0       | integer | Yes      | Maximum traffic in MB |

#### `custom` Parameters

`input.parameters.custom` is not a fixed schema — it varies per Worker. Use one of these approaches to find the exact fields:

- **API**: Call `GET /api/scraper?slug=<scraper_slug>` and read `data.parameters.custom` from the response. Each entry in `properties[]` maps to a field in `input.parameters.custom`.
- **Console**: Open the Worker in the [CoreClaw Console](https://console.coreclaw.com), go to the **Input** tab, click the **API** button in the top-right corner, and select **API clients** to view ready-to-use code snippets.

![API clients button in Worker Input tab](@/assets/docs/74.png)

When building `custom`:
- Use each `properties[].name` as the key
- Match the declared `type`, nested structure, and array shape
- Provide all fields where `required: true`
- An empty or schema-mismatched `custom` object returns `400 Bad Request`

### How to get `version`

You can get the Worker version from:

- the Worker page
- the `version` field returned by [Run Detail](/api/run/detail/)
- the `version` field returned by [Run History](/api/run/history/)

## Validation behavior

- `callback_url` is optional for this endpoint. It is **required** for [`/api/v1/task/run`](/api/task/run/) and [`/api/v1/rerun`](/api/run/rerun/).
- Passing a `run_slug` or `task_slug` to `scraper_slug` causes request validation failure.
- Providing only generic `system` parameters is not enough if the Worker requires `custom` fields defined by its descriptor.

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
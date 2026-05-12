---
title: Worker Detail
description: Get the details of a Worker, including its parameter schema, readme, and latest version.
sidebar:
    order: 3
---

**Method:** `GET`

**Endpoint:** `/api/scraper`

Send the request with query parameters. No authentication required.

## Request Example

```bash
curl "https://openapi.coreclaw.com/api/scraper?slug=01KJXYJ7KCHXM0PDZHQD5293XE"
```

#### Parameters

| Parameter | Example                          | Type   | Required | Description               |
| --------- | -------------------------------- | ------ | -------- | ------------------------- |
| slug      | 01KJXYJ7KCHXM0PDZHQD5293XE      | String | Yes      | Unique Worker identifier (`scraper_slug`) |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "parameters": {
            "system": {
                "cpus": 0.125,
                "memory_bytes": 512,
                "max_total_charge": 0,
                "max_total_traffic": 0,
                "execute_limit_time_seconds": 1800
            },
            "custom": {
                "properties": [
                    {
                        "name": "startURLs",
                        "type": "array",
                        "title": "Start URLs",
                        "editor": "json",
                        "default": [
                            { "url": "https://example.com" }
                        ],
                        "required": true,
                        "description": "List of URLs to start crawling from"
                    }
                ]
            }
        },
        "readme": "# Worker README\n\nThis is the Worker description.",
        "version": "v1.0.1"
    }
}
```

#### Response Fields

| Parameter    | Example | Type    | Description                     |
| ------------ | ------- | ------- | ------------------------------- |
| code         | 0       | Integer | Global status code              |
| message      | success | String  | Response message                |
| data         | -       | Object  | Response payload                |

##### `data` Fields

| Parameter  | Example | Type   | Description                       |
| ---------- | ------- | ------ | --------------------------------- |
| parameters | -       | Object | Worker parameter schema           |
| readme     | -       | String | Worker readme (Markdown)          |
| version    | v1.0.1  | String | Latest Worker version             |

##### `parameters.system` Fields

> **Note:** This endpoint returns `memory_bytes`, while [Start Worker](/api/worker/run/) uses `memory` as the request field name. Both represent the same value in MB.

| Parameter                   | Example | Type    | Description                        |
| --------------------------- | ------- | ------- | ---------------------------------- |
| cpus                        | 0.125   | number  | Device CPU cores                   |
| memory_bytes                | 512     | Integer | Device memory (MB)                 |
| max_total_charge            | 0       | Integer | Maximum execution charge (USD)     |
| max_total_traffic           | 0       | Integer | Maximum execution traffic (MB)     |
| execute_limit_time_seconds  | 1800    | Integer | Execution timeout (seconds)        |

##### `parameters.custom` Fields

The `custom` object varies per Worker. Use this to determine what input fields that Worker expects.

| Parameter  | Example | Type   | Description                                    |
| ---------- | ------- | ------ | ---------------------------------------------- |
| properties | -       | Array  | Array of custom parameter definitions          |

Each item in `properties`:

| Parameter   | Example                           | Type    | Description                |
| ----------- | --------------------------------- | ------- | -------------------------- |
| name        | startURLs                         | String  | Parameter name             |
| type        | array                             | String  | Parameter type             |
| title       | Start URLs                        | String  | Display title              |
| editor      | json                              | String  | Editor type                |
| default     | [{"url": "https://example.com"}]  | Array   | Default value              |
| required    | true                              | Boolean | Whether required           |
| description | List of URLs to start crawling from | String | Parameter description      |

## Error Response

```json
{
    "code": 50001,
    "message": "Script does not exist",
    "data": null
}
```
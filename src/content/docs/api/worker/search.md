---
title: Search Workers
description: Search for available Workers in the CoreClaw store.
sidebar:
    order: 4
---

**Method:** `GET`

**Endpoint:** `/api/store`

Send the request with query parameters. No authentication required.

> The `search` parameter must be non-empty. An empty search returns an error.

## Request Example

```bash
curl "https://openapi.coreclaw.com/api/store?search=news&limit=10"
```

#### Parameters

| Parameter | Example | Type    | Required | Description            |
| --------- | ------- | ------- | -------- | ---------------------- |
| search    | news    | String  | Yes      | Search keyword (non-empty) |
| limit     | 10      | Integer | Yes      | Max number of results  |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "scraper": [
            {
                "slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
                "title": "News Collection 20260305",
                "description": "Collect news articles from major news websites"
            }
        ]
    }
}
```

> The response array key is `scraper` (the API field name), but each entry represents a Worker.

#### Response Fields

| Parameter | Example | Type    | Description        |
| --------- | ------- | ------- | ------------------ |
| code      | 0       | Integer | Global status code |
| message   | success | String  | Response message   |
| data      | -       | Object  | Response payload   |

##### `data` Fields

| Parameter | Example | Type  | Description       |
| --------- | ------- | ----- | ----------------- |
| scraper   | -       | Array | List of Workers   |

##### `scraper[]` Fields

| Parameter   | Example                          | Type   | Description               |
| ----------- | -------------------------------- | ------ | ------------------------- |
| slug        | 01KJXYJ7KCHXM0PDZHQD5293XE      | String | Unique Worker identifier (`scraper_slug`) |
| title       | News Collection 20260305         | String | Worker title              |
| description | Collect news articles from major news websites | String | Worker description        |
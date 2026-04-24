---
title: Run History
description: Get the history of Worker runs.
sidebar:
    order: 1
---

**Method:** `POST`

**Endpoint:** `/api/v1/run/list`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "page": 1,
    "page_size": 20,
    "status": 0,
    "scraper_slug": "01KJYCSVTDCM7078HNB4Z5RJE2"
}
```

#### Parameters

| Parameter    | Default | Type    | Required | Description                                                        |
| ------------ | ------- | ------- | -------- | ------------------------------------------------------------------ |
| page         | 1       | Integer | Yes      | Current page number                                                |
| page_size    | 20      | Integer | Yes      | Items per page. Options: `10`, `20`, `50`                         |
| status       | 0       | Integer | Yes      | Run status: 0 All, 1 Ready, 2 Running, 3 Succeeded, 4 Failed, 5 Aborted |
| scraper_slug | -       | String  | Yes      | Unique Worker identifier                                           |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "count": 106,
        "list": [
            {
                "status": 3,
                "err_msg": "",
                "slug": "01KKGKQ89XN5HYD7JYKCC9C32H",
                "scraper_title": "News Collection 20260305",
                "scraper_slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
                "results": 4,
                "usage": "0.065",
                "started_at": 1773305309,
                "finished_at": 1773305316,
                "duration": 7,
                "origin": "api",
                "traffic": 23108,
                "version": "v1.0.1"
            }
        ]
    }
}
```

#### Response Fields

| Parameter | Example | Type    | Description        |
| --------- | ------- | ------- | ------------------ |
| code      | 0       | Integer | Global status code |
| message   | success | String  | Response message   |
| data      | -       | Object  | Response payload   |

##### `data` Fields

| Parameter     | Example                    | Type    | Description                                                        |
| ------------- | -------------------------- | ------- | ------------------------------------------------------------------ |
| count         | 0                          | Integer | Total record count                                                 |
| list          | -                          | Array   | Run record list                                                    |
| status        | 3                          | Integer | Run status: 1 Ready, 2 Running, 3 Succeeded, 4 Failed, 5 Aborted |
| slug          | 01KKGKQ89XN5HYD7JYKCC9C32H | String  | Unique run record identifier                                       |
| scraper_title | News Collection 20260305   | String  | Worker title                                                       |
| scraper_slug  | 01KJXYJ7KCHXM0PDZHQD5293XE | String  | Unique Worker identifier                                           |
| results       | 4                          | Integer | Number of collected results                                        |
| usage         | 0.065                      | String  | Device usage cost in USD                                           |
| started_at    | 1773305309                 | Integer | Start timestamp                                                    |
| finished_at   | 1773305316                 | Integer | Finish timestamp                                                   |
| duration      | 7                          | Integer | Execution duration in seconds                                      |
| origin        | api                        | String  | Run source: `api` or `web`                                         |
| traffic       | 23108                      | Integer | Traffic usage in bytes                                             |
| version       | v1.0.1                     | String  | Worker version                                                     |

## Error Response

```json
{
    "code": 4000,
    "message": "Invalid request parameters",
    "data": null
}
```

---
title: Run History
description: Get the history of Worker runs.
sidebar:
    order: 1
---

**Method:** `GET`

**Endpoint:** `/api/v1/runs`

## Query Parameters

| Parameter    | Default | Type    | Required | Description                                                        |
| ------------ | ------- | ------- | -------- | ------------------------------------------------------------------ |
| page         | 1       | Integer | No       | Current page number                                                |
| page_size    | 20      | Integer | No       | Items per page                                                     |
| status       | 0       | Integer | No       | Run status: 0 All, 1 Ready, 2 Running, 3 Succeeded, 4 Failed, 5 Aborting |
| scraper_slug | -       | String  | No       | Unique Worker identifier (filter by Worker)                        |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "total": 106,
        "records": [
            {
                "status": 3,
                "err_msg": "",
                "slug": "01KKGKQ89XN5HYD7JYKCC9C32H",
                "scraper_title": "News Collection 20260305",
                "scraper_slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
                "result_count": 4,
                "cost": "0.065",
                "started_at": 1773305309,
                "finished_at": 1773305316,
                "duration_seconds": 7,
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

| Parameter     | Example                    | Type    | Description                                                           |
| ------------- | -------------------------- | ------- | --------------------------------------------------------------------- |
| total         | 106                        | Integer | Total record count                                                    |
| records       | -                          | Array   | Run record list                                                       |
| status        | 3                          | Integer | Run status: 1 Ready, 2 Running, 3 Succeeded, 4 Failed, 5 Aborting    |
| slug          | 01KKGKQ89XN5HYD7JYKCC9C32H | String  | Unique run record identifier                                          |
| scraper_title | News Collection 20260305   | String  | Worker title                                                          |
| scraper_slug  | 01KJXYJ7KCHXM0PDZHQD5293XE | String  | Unique Worker identifier                                              |
| result_count  | 4                          | Integer | Number of collected results                                           |
| cost          | 0.065                      | String  | Device usage cost in USD                                              |
| started_at    | 1773305309                 | Integer | Start timestamp                                                       |
| finished_at   | 1773305316                 | Integer | Finish timestamp                                                      |
| duration_seconds | 7                       | Integer | Execution duration in seconds                                         |
| origin        | api                        | String  | Run source: `api` or `web`                                            |
| traffic       | 23108                      | Integer | Traffic usage in bytes                                                |
| version       | v1.0.1                     | String  | Worker version                                                        |

## Error Response

```json
{
    "code": 4000,
    "message": "Invalid request parameters",
    "data": null
}
```

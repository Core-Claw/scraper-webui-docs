---
title: Run Detail
description: Get the details of a Worker run.
sidebar:
    order: 2
---

**Method:** `GET`

**Endpoint:** `/api/v1/runs/{run_slug}/status`

## Path Parameters

| Parameter | Required | Description           |
| --------- | -------- | --------------------- |
| run_slug  | Yes      | Unique run identifier |

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "status": 2,
        "err_msg": "",
        "slug": "01KKJYJ4HH0R9K7XD856MAE1WH",
        "actors_title": "News Collection 20260305",
        "actors_slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
        "result_count": 4,
        "cost": "0.0217",
        "started_at": 1773383784,
        "finished_at": 0,
        "duration_seconds": 0,
        "origin": "api",
        "traffic": 0,
        "version": "v1.0.1"
    }
}
```

#### Response Fields

| Parameter       | Example                    | Type    | Description                                                          |
| --------------- | -------------------------- | ------- | -------------------------------------------------------------------- |
| code            | 0                          | Integer | Global status code                                                   |
| message         | success                    | String  | Response message                                                     |
| data            | -                          | Object  | Response payload                                                     |
| status          | 3                          | Integer | Run status: 1 Ready, 2 Running, 3 Succeeded, 4 Failed, 5 Aborting   |
| err_msg         | -                          | String  | Error message                                                        |
| slug            | 01KKJYJ4HH0R9K7XD856MAE1WH | String  | Unique run identifier                                                |
| actors_title    | News Collection 20260305   | String  | Worker title                                                         |
| actors_slug     | 01KJXYJ7KCHXM0PDZHQD5293XE | String  | Unique Worker identifier                                             |
| result_count    | 4                          | Integer | Number of collected results                                          |
| cost            | 0.0217                     | String  | Device usage cost in USD                                             |
| started_at      | 1773383784                 | Integer | Start timestamp                                                      |
| finished_at     | 0                          | Integer | Finish timestamp                                                     |
| duration_seconds | 0                         | Integer | Execution duration in seconds                                        |
| origin          | api                        | String  | Run source: `api` or `web`                                           |
| traffic         | 0                          | Integer | Traffic usage in bytes                                               |
| version         | v1.0.1                     | String  | Worker version                                                       |

## Error Response

```json
{
    "code": 4000,
    "message": "Invalid request parameters",
    "data": null
}
```

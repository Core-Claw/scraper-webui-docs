---
title: Re-run
description: Re-run a Worker task.
sidebar:
    order: 6
---

**Method:** `POST`

**Endpoint:** `/api/v1/runs/{run_slug}/rerun`

Send the request body with **Content-Type: application/json**.

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
        "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ",
        "status": 1
    }
}
```

#### Response Fields

| Parameter | Example                    | Type    | Description                                                          |
| --------- | -------------------------- | ------- | -------------------------------------------------------------------- |
| code      | 0                          | Integer | Global status code                                                   |
| message   | success                    | String  | Response message                                                     |
| data      | -                          | Object  | Response payload                                                     |
| run_slug  | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | Unique run identifier of the new run                                 |
| status    | 1                          | Integer | Run status: 1 Ready, 2 Running, 3 Succeeded, 4 Failed, 5 Aborting   |

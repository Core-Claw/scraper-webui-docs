---
title: Start Worker
description: Start a Worker run.
sidebar:
    order: 1
---

**Method:** `POST`

**Endpoint:** `/api/v1/scraper/run`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "scraper_slug": "01KGYERXPXTABWXMGQKFCE43M2",
    "version": "v1.0.1",
    "input": {
        "parameters": {
            "system": {
                "cpus": 0.125,
                "memory": 512,
                "execute_limit_time_seconds": 1800,
                "max_total_charge": 0,
                "max_total_traffic": 0
            },
            "custom": {
                "startURLs": [
                    {
                        "url": "https://www.amazon.com/sp?ie=UTF8&seller=ADZ7LD48GVFQJ&asin=B07H56J7K1&ref_=dp_merchant_link&isAmazonFulfilled=1"
                    },
                    {
                        "url": "https://www.amazon.com/sp?ie=UTF8&seller=A3AZYNALJBV2WE&asin=B099S46ZRQ&ref_=dp_merchant_link&isAmazonFulfilled=1"
                    }
                ],
                "proxy_region": "BQ"
            }
        }
    },
    "callback_url": "https://your-domain.com/callback"
}
```

### Parameters

| Parameter    | Required | Description                          |
| ------------ | -------- | ------------------------------------ |
| scraper_slug | Yes      | Unique Worker identifier             |
| version      | Yes      | Worker version                       |
| input        | Yes      | Input parameters                     |
| callback_url | Yes      | Callback URL for receiving run results |

#### `system` Parameters

| Parameter                    | Example | Type   | Required | Description                                             |
| --------------------------- | ------- | ------ | -------- | ------------------------------------------------------- |
| proxy_region                | CH      | string | Yes      | Execution node. [See help](/api/basic/proxy/)                |
| cpus                        | 0.125   | number | Yes      | Container CPU cores. [See help](/api/basic/device-configuration/) |
| memory                      | 512     | number | Yes      | Container memory size in MB. [See help](/api/basic/device-configuration/) |
| execute_limit_time_seconds  | 1800    | number | Yes      | Container execution timeout in seconds                  |
| max_total_charge            | 0       | number | Yes      | Maximum charge in USD                                   |
| max_total_traffic           | 0       | number | Yes      | Maximum traffic in MB                                   |

#### `custom` Parameters

Fill in these values according to the parameter definition of the Worker you are running.

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

| Parameter | Example                      | Type    | Description              |
| --------- | ---------------------------- | ------- | ------------------------ |
| code      | 0                            | Integer | Global status code       |
| message   | success                      | String  | Response message         |
| data      | -                            | Object  | Response payload         |
| run_slug  | 01KKDXV2G26BT7NH4ZQR2R4NPZ   | String  | Unique run identifier    |

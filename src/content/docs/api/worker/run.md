---
title: Start Worker
description: Start a Worker run.
sidebar:
    order: 1
---

**Method:** `POST`

**Endpoint:** `/api/v1/runs`

Send the request body with **Content-Type: application/json**.

## Request Example

```json
{
    "scraper_slug": "01KGYERXPXTABWXMGQKFCE43M2",
    "version": "v1.0.1",
    "system_params": "{\"cpus\":0.125,\"memory\":512,\"execute_limit_time_seconds\":1800,\"max_total_charge\":0,\"max_total_traffic\":0,\"proxy_region\":\"CH\"}",
    "custom_params": "{\"startURLs\":[{\"url\":\"https://www.amazon.com/sp?ie=UTF8&seller=ADZ7LD48GVFQJ&asin=B07H56J7K1&ref_=dp_merchant_link&isAmazonFulfilled=1\"}],\"proxy_region\":\"BQ\"}"
}
```

### Parameters

| Parameter     | Required | Type   | Description                                              |
| ------------- | -------- | ------ | -------------------------------------------------------- |
| scraper_slug  | Yes      | string | Unique Worker identifier                                 |
| version       | Yes      | string | Worker version                                           |
| system_params | No       | string | JSON string of system parameters. [See below](#system-parameters) |
| custom_params | No       | string | JSON string of custom parameters. [See below](#custom-parameters) |

#### System Parameters

The `system_params` field accepts a **JSON string** containing the following keys:

| Key                        | Example | Type   | Required | Description                                             |
| -------------------------- | ------- | ------ | -------- | ------------------------------------------------------- |
| proxy_region               | CH      | string | No       | Execution node. [See help](/developer-guide/worker-definition/platform-features/proxy-support/) |
| cpus                       | 0.125   | number | No       | Runtime CPU cores                                     |
| memory                     | 512     | number | No       | Runtime memory size in MB                             |
| execute_limit_time_seconds | 1800    | number | No       | Execution timeout in seconds                          |
| max_total_charge           | 0       | number | No       | Maximum charge in USD                                   |
| max_total_traffic          | 0       | number | No       | Maximum traffic in MB                                   |

#### Custom Parameters

The `custom_params` field accepts a **JSON string** containing the input values defined by the Worker's Input Schema. Fill in these values according to the parameter definition of the Worker you are running.

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

---
title: Scraper Details
description: Get detailed information about a specific Worker.
sidebar:
    order: 2
---

**Method:** `GET`

**Endpoint:** `/api/v1/marketplace/scrapers/{scraper_slug}`

## Path Parameters

| Parameter     | Required | Description              |
| ------------- | -------- | ------------------------ |
| scraper_slug  | Yes      | Unique Worker identifier |

## Request Example

```bash
curl -X GET "https://openapi.coreclaw.com/api/v1/marketplace/scrapers/01KPD71518ZGX9TS37Y0XWT7ZQ" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json"
```

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "slug": "01KPD71518ZGX9TS37Y0XWT7ZQ",
        "title": "TikTok Profiles By URL",
        "version": "v1.0.1",
        "system_params": {
            "cpus": 0.125,
            "memory": 512,
            "execute_limit_time_seconds": 1800,
            "max_total_charge": 0,
            "max_total_traffic": 0
        },
        "custom_params_schema": {
            "url": "array"
        },
        "readme": "Extract TikTok user profile data by URL."
    }
}
```

#### Response Fields

| Parameter           | Example                     | Type   | Description                                     |
| ------------------- | --------------------------- | ------ | ----------------------------------------------- |
| code                | 0                           | Integer | Global status code                              |
| message             | success                     | String | Response message                                |
| data                | -                           | Object | Response payload                                |
| slug                | 01KPD71518ZGX9TS37Y0XWT7ZQ | String | Unique Worker identifier                        |
| title               | TikTok Profiles By URL      | String | Worker title                                    |
| version             | v1.0.1                      | String | Latest Worker version (required for run_scraper) |
| system_params       | -                           | Object | Default system resource configuration            |
| custom_params_schema | -                          | Object | Custom parameter structure definition            |
| readme              | -                           | String | Worker documentation                            |

##### `system_params` Fields

| Key                        | Default | Type   | Description                          |
| -------------------------- | ------- | ------ | ------------------------------------ |
| cpus                       | 0.125   | number | Runtime CPU cores                  |
| memory                     | 512     | number | Runtime memory size in MB          |
| execute_limit_time_seconds | 1800    | number | Execution timeout in seconds       |
| max_total_charge           | 0       | number | Maximum charge in USD (0 = unlimited) |
| max_total_traffic          | 0       | number | Maximum traffic in MB (0 = unlimited) |

:::note
The `custom_params_schema` defines the input parameters required by the Worker. Use this information to construct the `custom_params` JSON string when calling [Start Worker](/api/worker/run/).
:::

---
title: Search Scrapers
description: Search for available Workers in the CoreClaw Marketplace.
sidebar:
    order: 1
---

**Method:** `GET`

**Endpoint:** `/api/v1/marketplace/scrapers/search`

## Query Parameters

| Parameter | Default | Type    | Required | Description                                |
| --------- | ------- | ------- | -------- | ------------------------------------------ |
| query     | -       | String  | No       | Search keyword (empty string returns all)  |
| limit     | 10      | Integer | No       | Maximum number of results to return        |

## Request Example

```bash
curl -X GET "https://openapi.coreclaw.com/api/v1/marketplace/scrapers/search?query=tiktok&limit=5" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json"
```

## Response Example

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "scrapers": [
            {
                "slug": "01KPD71518ZGX9TS37Y0XWT7ZQ",
                "title": "TikTok Profiles By URL",
                "description": "Extract TikTok user profile data",
                "tags": ["tiktok", "social-media"]
            }
        ]
    }
}
```

#### Response Fields

| Parameter   | Example                     | Type    | Description                    |
| ----------- | --------------------------- | ------- | ------------------------------ |
| code        | 0                           | Integer | Global status code             |
| message     | success                     | String  | Response message               |
| data        | -                           | Object  | Response payload               |
| scrapers    | -                           | Array   | List of matching Workers       |
| slug        | 01KPD71518ZGX9TS37Y0XWT7ZQ | String  | Unique Worker identifier       |
| title       | TikTok Profiles By URL      | String  | Worker title                   |
| description | Extract TikTok profile data | String  | Worker description             |
| tags        | ["tiktok", "social-media"]  | Array   | Worker tags                    |

:::note
Search currently supports single keyword matching only. Use English keywords for best results.
:::

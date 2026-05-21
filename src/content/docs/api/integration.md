---
title: API Integration
description: Complete guide to integrate CoreClaw API into your applications
sidebar:
  order: -1
---

All aspects of the CoreClaw platform can be controlled via a REST API. This guide walks you through the complete integration process from obtaining an API key to making your first API call.

## Table of Contents

- [API Key](#api-key)
  - [How to get your API key](#how-to-get-your-api-key)
  - [Protect your API key](#protect-your-api-key)
- [Authentication](#authentication)
  - [Public endpoints](#public-endpoints)
- [Base URL](#base-url)
- [OpenAPI Specification](#openapi-specification)
- [Quick Start: Your First API Call](#quick-start-your-first-api-call)
  - [Step 1: Search for a Worker](#step-1-search-for-a-worker)
  - [Step 2: Get Worker Details](#step-2-get-worker-details)
  - [Step 3: Run the Worker](#step-3-run-the-worker)
  - [Step 4: Check Run Status](#step-4-check-run-status)
  - [Step 5: Get Results](#step-5-get-results)
- [Sync vs Async Execution](#sync-vs-async-execution)
  - [Async mode (default)](#async-mode-default)
  - [Sync mode](#sync-mode)
- [Webhook Integration](#webhook-integration)
- [Common Errors](#common-errors)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## API Key

To access the CoreClaw API, you need to authenticate using your API key. You can find it on the [API & Integrations](https://console.coreclaw.com/settings/integrations) page in CoreClaw Console.

### How to get your API key

1. Log in to [CoreClaw Console](https://console.coreclaw.com)
2. Navigate to **Settings** → **API & Integrations**
3. Click **Create API Key** or copy your existing key

### Protect your API key

> **Warning**: Do not share your API key with untrusted parties, or use it directly from client-side code (browser JavaScript). API keys should only be used server-side or in secure environments.

## Authentication

CoreClaw API uses the `api-key` header for authentication. Include it in every request that requires authentication.

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

### Public endpoints

Some endpoints do not require authentication:

- `GET /api/store` - Search Workers
- `GET /api/scraper` - Get Worker detail

## Base URL

All API requests should be sent to:

```
https://openapi.coreclaw.com
```

## OpenAPI Specification

Download the complete OpenAPI specification:

- [openapi.json](/openapi.json) - Full API specification in JSON format

You can import this file into:
- [Postman](https://www.postman.com/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- Any OpenAPI-compatible tool

## Quick Start: Your First API Call

Let's walk through a complete workflow to run a Worker and get results.

### Step 1: Search for a Worker

Find a Worker that suits your needs:

```bash
curl "https://openapi.coreclaw.com/api/store?search=amazon&limit=5"
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "scraper": [
      {
        "slug": "01KNXSHE0Y7DZKF1N8B1EMFX35",
        "title": "Amazon Global Product By URL",
        "description": "Extract product data from Amazon URLs"
      }
    ]
  }
}
```

Save the `slug` (this is the **Worker ID**, also called `scraper_slug`) for the next step.

### Step 2: Get Worker Details

Before running a Worker, get its live parameter schema:

```bash
curl "https://openapi.coreclaw.com/api/scraper?slug=01KNXSHE0Y7DZKF1N8B1EMFX35"
```

Response includes:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "v1.0.1",
    "parameters": {
      "system": {
        "cpus": 0.125,
        "memory_bytes": 512,
        "execute_limit_time_seconds": 1800
      },
      "custom": {
        "properties": [
          {
            "name": "urls",
            "type": "array",
            "title": "URLs",
            "required": true,
            "description": "Amazon product URLs to scrape"
          }
        ]
      }
    },
    "readme": "Worker documentation..."
  }
}
```

**Important**: 
- Use `data.version` exactly as returned
- Build `input.parameters.custom` from `data.parameters.custom.properties`
- `memory_bytes` in this endpoint = `memory` in `/api/v1/scraper/run`

### Step 3: Run the Worker

Start a Worker run with the parameters from Step 2:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{
    "scraper_slug": "01KNXSHE0Y7DZKF1N8B1EMFX35",
    "version": "v1.0.1",
    "is_async": true,
    "input": {
      "parameters": {
        "system": {
          "cpus": 0.125,
          "memory": 512,
          "execute_limit_time_seconds": 1800,
          "max_total_charge": 0,
          "max_total_traffic": 0,
          "proxy_region": "US"
        },
        "custom": {
          "urls": [
            {"url": "https://www.amazon.com/dp/B0CHHSFMRL"}
          ]
        }
      }
    }
  }'
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KS2A1M515HG7PZX9STTB0KPH"
  }
}
```

Save the `run_slug` (**Run Record ID**) to track progress and retrieve results.

### Step 4: Check Run Status

Poll the run status until it completes:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/run/detail" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{"run_slug": "01KS2A1M515HG7PZX9STTB0KPH"}'
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status": 3,
    "results": 20,
    "usage": "0.06",
    "duration": 9
  }
}
```

Status codes:

| Code | Status |
|------|--------|
| 1 | Ready |
| 2 | Running |
| 3 | Succeeded |
| 4 | Failed |
| 5 | Aborting |

### Step 5: Get Results

Retrieve the scraped data:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/run/result/list" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{
    "run_slug": "01KS2A1M515HG7PZX9STTB0KPH",
    "page_index": 1,
    "page_size": 20
  }'
```

Or export as a file:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/run/result/export" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{
    "run_slug": "01KS2A1M515HG7PZX9STTB0KPH",
    "format": "json",
    "filter_keys": []
  }'
```

## Sync vs Async Execution

### Async mode (default)

- `is_async: true` (default)
- Returns immediately with `run_slug`
- Poll status or use webhook to get results
- Best for long-running tasks

```json
{
  "is_async": true,
  "callback_url": "https://your-server.com/webhook"
}
```

### Sync mode

- `is_async: false`
- Waits until execution completes
- Returns results directly (up to 30 seconds timeout)
- Best for quick, small tasks

```json
{
  "is_async": false
}
```

## Webhook Integration

When using async mode with `callback_url`, CoreClaw will POST to your endpoint when the run completes:

```json
{
  "run_slug": "01KS2A1M515HG7PZX9STTB0KPH",
  "status": 3,
  "results": 20,
  "usage": "0.06"
}
```

Your webhook endpoint should:

1. Verify the request comes from CoreClaw
2. Process the result notification
3. Return `200 OK` to acknowledge receipt

## Common Errors

| Code | Message | Solution |
|------|---------|----------|
| 4000 | Invalid request parameters | Check parameter names and types against `/api/scraper` |
| 20001 | Invalid API key | Verify your API key is correct |
| 30001 | Insufficient balance | Add funds to your account |
| 50001 | Worker does not exist | Check the `scraper_slug` (Worker ID) |
| 70001 | Run record does not exist | Check the `run_slug` (Run Record ID) |

## Best Practices

### 1. Always read Worker schema first

Never guess parameter names. Always call `/api/scraper` before `/api/v1/scraper/run`.

### 2. Use the exact version

Copy `version` from `/api/scraper` response. Do not hardcode versions.

### 3. Handle pagination

For large datasets, use `result/list` with pagination or `result/export` for file download.

### 4. Implement retry logic

Use exponential backoff for rate-limited requests (code 4290).

### 5. Monitor usage

Check your balance regularly:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

## API Reference

For detailed endpoint documentation, see:

- [Base URL & Authentication](/api/)
- [Search Workers](/api/worker/search/)
- [Worker Detail](/api/worker/detail/)
- [Start Worker](/api/worker/run/)
- [Abort Worker](/api/worker/abort/)
- [Run History](/api/run/history/)
- [Run Detail](/api/run/detail/)
- [Run Result](/api/run/result/)
- [Export Result](/api/run/export/)
- [Run Log](/api/run/log/)
- [Re-run](/api/run/rerun/)
- [Start Task](/api/task/run/)
- [Account Info](/api/account/info/)
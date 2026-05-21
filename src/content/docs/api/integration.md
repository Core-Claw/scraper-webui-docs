---
title: API Integration
description: Complete guide to integrate CoreClaw API into your applications
sidebar:
  order: -1
---

All aspects of the CoreClaw platform can be controlled via a REST API. This guide walks you through the complete integration process from obtaining an API key to making your first API call.

## Quick Test

Verify your API key is valid with a single command:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

Expected response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": "10.00",
    "traffic": "1000"
  }
}
```

If you receive `code: 20001`, your API key is invalid. Check the key and try again.

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
        "memory": 512,
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
- `memory` in this endpoint corresponds to `memory` in `/api/v1/scraper/run` (both in MB)

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
- Returns results directly (up to 5 minutes timeout)
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

## Troubleshooting

### Common Issues

#### `4000 Invalid request parameters`

This is the most common error. Check these causes:

| Cause | Solution |
|-------|----------|
| `version` mismatched | Get `version` from `/api/scraper`, don't hardcode |
| `custom` schema mismatch | Build `custom` from `data.parameters.custom.properties` |
| Missing `is_async` | Add `"is_async": true` or `"is_async": false` |
| JSON syntax error | Validate JSON format, especially on Windows |

#### Windows PowerShell JSON Escaping

**Problem**: PowerShell mangles inline JSON strings, causing `4000 Invalid request parameters`.

**Solution**: Use `--data-binary @file.json` to read from a file:

```powershell
# Create JSON file
@'
{
  "scraper_slug": "YOUR_SCRAPER_SLUG",
  "version": "v1.0.0",
  "is_async": true,
  "input": {
    "parameters": {
      "system": {"cpus": 0.125, "memory": 512},
      "custom": {}
    }
  }
}
'@ | Out-File -Encoding utf8 request.json

# Use file with curl
curl.exe -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" `
  -H "api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  --data-binary "@request.json"
```

#### Rate Limiting (429)

When you exceed rate limits, implement exponential backoff:

```python
import time

def retry_with_backoff(func, max_retries=5):
    for attempt in range(max_retries):
        result = func()
        if result.get("code") != 4290:
            return result
        wait_time = (2 ** attempt) * 1  # 1, 2, 4, 8, 16 seconds
        time.sleep(wait_time)
    return result
```

#### Worker-Specific Custom Parameters

Each Worker has different `custom` parameters. **Never assume field names**.

**Wrong** (hardcoded):
```json
{
  "custom": {
    "startURLs": [{"url": "https://example.com"}]
  }
}
```

**Correct** (from `/api/scraper`):
```python
# Get live schema
response = requests.get(f"https://openapi.coreclaw.com/api/scraper?slug={scraper_slug}")
schema = response.json()["data"]["parameters"]["custom"]["properties"]

# Build custom params from schema
custom_params = {}
for prop in schema:
    name = prop["name"]
    if prop.get("required"):
        custom_params[name] = prop.get("default", [])
```

### Debug Checklist

When things go wrong, check:

1. **API Key**: Run [Quick Test](#quick-test) to verify
2. **Version**: Get fresh `version` from `/api/scraper`
3. **Custom Schema**: Inspect `data.parameters.custom.properties` for the Worker
4. **JSON Format**: Validate with a JSON linter
5. **Windows Shell**: Use `--data-binary @file.json` instead of inline JSON

## Code Examples

Complete examples in multiple programming languages:

| Language | Description |
|----------|-------------|
| [Python](/api/examples/python/) | Full async workflow with requests library |
| [Node.js](/api/examples/nodejs/) | Full async workflow with axios |
| [Java](/api/examples/java/) | Using java.net.http (Java 11+) |
| [PHP](/api/examples/php/) | Using built-in curl extension |
| [Go](/api/examples/go/) | Using net/http package |

### Dependencies

| Language | Install Command |
|----------|-----------------|
| Python | `pip install requests` |
| Node.js | `npm install axios` |
| Java | No external dependencies (uses `java.net.http`) |
| PHP | No external dependencies (uses `curl`) |
| Go | No external dependencies (uses `net/http`) |

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
---
title: API Calls
description: Run Workers programmatically via API
sidebar:
  order: 5
---

Learn how to run Workers and manage tasks programmatically using the CoreClaw API.

## Getting Started

### Authentication

All API requests require authentication using your API key in the request header:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/runs" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json"
```

Get your API key from [Account Settings](/api/account/info/).

For full API documentation, see [Base URL & Authentication](/api/).

## Running a Worker

### Start Worker Run

```bash
POST /api/v1/runs
```

**Request Body:**
```json
{
  "scraper_slug": "01KGYERXPXTABWXMGQKFCE43M2",
  "version": "v1.0.1",
  "system_params": "{\"proxy_region\":\"US\"}",
  "custom_params": "{\"startURLs\":[{\"url\":\"https://example.com\"}]}"
}
```

**Response:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
  }
}
```

### Check Run Status

```bash
GET /api/v1/runs/{run_slug}/status
```

**Response:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ",
    "status": 3,
    "result_count": 500,
    "duration_seconds": 120
  }
}
```

### Get Run Results

```bash
GET /api/v1/runs/{run_slug}/results
```

### Abort a Run

```bash
POST /api/v1/runs/{run_slug}/abort
```

## Managing Tasks

### Run a Task

```bash
POST /api/v1/tasks/{task_slug}/run
```

**Response:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
  }
}
```

## Error Handling

| CODE  | Description                 |
| ----- | --------------------------- |
| 0     | Success                     |
| 4000  | Invalid request parameters  |
| 4010  | Unauthorized access         |
| 4040  | Resource not found          |
| 5000  | Internal server error       |

See [Global Status Codes](/api/#global-status-codes) for the complete list.

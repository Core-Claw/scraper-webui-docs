---
title: Base URL & Authentication
description: API base URL, request headers, and global status codes
sidebar:
  order: 0
---

## API Base URL

```
https://openapi.coreclaw.com
```

> **Terminology note:** In CoreClaw's API, `Worker` and `Scraper` refer to the same concept — a data extraction script. The API paths and field names use `scraper` (e.g. `scraper_slug`, `/api/v1/scraper/run`), while documentation may refer to them as Workers.

## Header Parameters

| Parameter Name | Example Value    | Type   | Required | Description |
| -------------- | ---------------- | ------ | -------- | ----------- |
| api-key        | <YOUR_API_KEY>   | string | Yes      | Your API key for authentication |
| content-type   | application/json | string | Yes      | Request content type |

## Global Status Codes

Each API request may return a success code or an error code. You can use these codes to debug requests and identify issues.

| CODE  | Description                |
| ----- | -------------------------- |
| 0     | Success                    |
| 5000  | Internal server error      |
| 4000  | Invalid request parameters |
| 4010  | Unauthorized access        |
| 4040  | Resource not found         |
| 4290  | Rate limit exceeded        |
| 10001 | User does not exist        |
| 10002 | User is disabled           |
| 20001 | Invalid API key            |
| 20002 | API key expired            |
| 30001 | Insufficient balance       |
| 30002 | Insufficient traffic quota |
| 50001 | Worker does not exist      |
| 50002 | Worker execution failed    |
| 50003 | Worker version unavailable |
| 60001 | Task does not exist        |
| 70001 | Run record does not exist  |
| 70002 | Run abort failed           |

## Endpoint Quick Reference

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | `POST` | `/api/v1/scraper/run` | [Start Worker](/api/worker/run/) |
| 2 | `POST` | `/api/v1/scraper/abort` | [Abort Worker](/api/worker/abort/) |
| 3 | `GET` | `/api/scraper` | [Worker Detail](/api/worker/detail/) |
| 4 | `GET` | `/api/store` | [Search Workers](/api/worker/search/) |
| 5 | `POST` | `/api/v1/run/list` | [Run History](/api/run/history/) |
| 6 | `POST` | `/api/v1/run/detail` | [Run Detail](/api/run/detail/) |
| 7 | `POST` | `/api/v1/run/result/list` | [Run Result](/api/run/result/) |
| 8 | `POST` | `/api/v1/run/last/log` | [Run Log](/api/run/log/) |
| 9 | `POST` | `/api/v1/run/result/export` | [Export Run Result](/api/run/export/) |
| 10 | `POST` | `/api/v1/rerun` | [Re-run](/api/run/rerun/) |
| 11 | `POST` | `/api/v1/task/run` | [Start Task](/api/task/run/) |
| 12 | `POST` | `/api/v1/account/info` | [Account Info](/api/account/info/) |

## Authentication

All API requests require authentication using your API key. Include it in the request header of every API call.

### Using the API Key

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```
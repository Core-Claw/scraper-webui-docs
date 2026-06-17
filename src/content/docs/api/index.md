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
| api-key        | <YOUR_API_KEY>   | string | Yes      | Your API key. Get it from [Console Settings → API & Integrations](https://console.coreclaw.com/settings/integrations) |
| content-type   | application/json | string | Yes      | Request content type |

> **Note:** `/api/scraper` and `/api/store` are public endpoints that do not require an API key.

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
| 13 | `GET` | `/api/proxy/region` | [Proxy Region List](/api/proxy/region/) |

## Authentication

Most API requests require authentication using your API key. The public endpoints `/api/scraper` and `/api/store` do not require authentication. Include the key in the request header of every authenticated call.

### Using the API Key

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

## Slug Types

CoreClaw API uses three types of identifiers (slugs). Understanding the difference is essential for correct API usage.

| Slug | What it identifies | Description | Used by |
| ---- | ------------------ | ----------- | ------- |
| `scraper_slug` | **Worker ID** | The unique identifier for each Worker. Every Worker has one permanent `scraper_slug`. Supports both GitHub path format (e.g. `coreclaw/google-maps-scraper`) and legacy ID format (e.g. `01KPD6M5YQADCQKGVKPDZVYC63`). | `/api/v1/scraper/run`, `/api/v1/run/list` |
| `task_slug` | **Task ID** | Generated when you create and save a Task template. A Task is a reusable configuration that bundles a Worker with preset parameters. | `/api/v1/task/run` |
| `run_slug` | **Run Record ID** | Generated each time you execute a Worker or Task. Each run produces a unique `run_slug` to track that specific execution. | `/api/v1/run/detail`, `/api/v1/run/last/log`, `/api/v1/run/result/list`, `/api/v1/run/result/export`, `/api/v1/rerun`, `/api/v1/scraper/abort` |

### Where to find each Slug

**scraper_slug** (Worker ID) - Found on the Worker detail page:

![scraper_slug location](@/assets/docs/scraper_slug.png)

**task_slug** (Task ID) - Found in your saved Task templates:

![task_slug location](@/assets/docs/task_slug.png)

**run_slug** (Run Record ID) - Found in the run history or returned after starting a run:

![run_slug location](@/assets/docs/run_slug.png)

> **Important**: Do not mix these identifiers. Each slug type serves a different purpose. Passing a `run_slug` to a `task_slug` or `scraper_slug` field will cause request validation errors.
>
> In addition to the ID format shown above, `scraper_slug` also supports the GitHub path format, for example `coreclaw/google-maps-scraper`. Both formats are fully compatible — the legacy ID format (e.g. `01KPD6M5YQADCQKGVKPDZVYC63`) continues to work.

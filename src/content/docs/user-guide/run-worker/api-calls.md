---
title: API Calls
description: Run Workers and Task templates programmatically via the CoreClaw API
sidebar:
  order: 5
---

Learn how to launch Workers, run Task templates, and inspect runs programmatically using the CoreClaw API.

## Getting Started

### Authentication

All API requests must include your API key in the request headers:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

Get your API key from [Account Info](/api/account/info/).

For the full endpoint reference, see [Base URL & Authentication](/api/).

## Slug Types

| Slug | What it identifies | How to get it | Used by |
| ---- | ------------------ | ------------- | ------- |
| `scraper_slug` | A Worker | Each Worker has its own `scraper_slug`. You can get it from the Worker page, or from `scraper_slug` returned by [Run Detail](/api/run/detail/) or [Run History](/api/run/history/). | `/api/v1/scraper/run`, `/api/v1/run/list` |
| `task_slug` | A saved Task template | Generated when a user creates and saves a Task template. | `/api/v1/task/run` |
| `run_slug` | A specific run record | Returned after starting a Worker or a Task, and exposed by run APIs. | `/api/v1/run/detail`, `/api/v1/run/last/log`, `/api/v1/run/result/list`, `/api/v1/run/result/export`, `/api/v1/rerun`, `/api/v1/scraper/abort` |

Do not mix these identifiers. Passing a `run_slug` to a `task_slug` or `scraper_slug` field results in request validation errors.

## Start a Worker run

```bash
POST /api/v1/scraper/run
```

**Request body:**

```json
{
  "scraper_slug": "YOUR_SCRAPER_SLUG",
  "version": "v1.1.0",
  "input": {
    "parameters": {
      "system": {
        "proxy_region": "CH",
        "cpus": 0.125,
        "memory": 512,
        "execute_limit_time_seconds": 1800,
        "max_total_charge": 0,
        "max_total_traffic": 0
      },
      "custom": {
        "startURLs": [
          {
            "url": "https://example.com"
          }
        ]
      }
    }
  },
  "callback_url": "https://your-callback.example.com/webhook"
}
```

### How to build `input.parameters.custom`

`custom` is not a free-form string and not the old `custom_params` JSON string field. Its structure must match the Worker's `input_schema.json`.

- Use each `properties[].name` value from the Worker's `input_schema.json` as a key in `custom`
- Follow the declared `type`, nested structure, and array shape
- Provide every field whose schema sets `required: true`
- If `custom` is empty or does not match the Worker's schema, the API returns `400 Bad Request`

See [Start Worker](/api/worker/run/) and [Worker Input Configuration](/developer-guide/worker-definition/input-schema/) for details.

### How to get `version`

Use one of the following sources:

- the Worker version shown on the Worker page
- the `version` field returned by [Run Detail](/api/run/detail/)
- the `version` field returned by [Run History](/api/run/history/)

## Run a saved Task template

```bash
POST /api/v1/task/run
```

**Request body:**

```json
{
  "task_slug": "YOUR_TASK_SLUG",
  "callback_url": "https://your-callback.example.com/webhook"
}
```

`callback_url` is required. A request without it returns `400 Bad Request`.

## Inspect a run

Use the returned `run_slug` with the run APIs:

- [Run Detail](/api/run/detail/) for status, `scraper_slug`, and `version`
- [Run Log](/api/run/log/) for execution logs
- [Run Result List](/api/run/result/) for paginated results
- [Export Run Result](/api/run/export/) for file export

## Common mistakes

- Using the old `/api/v1/runs` or `/api/v1/tasks/{task_slug}/run` paths
- Sending `system_params` or `custom_params` as stringified JSON
- Passing a `run_slug` where a `scraper_slug` or `task_slug` is required
- Omitting `callback_url` from `/api/v1/task/run`
- Omitting required Worker-specific `custom` fields from `/api/v1/scraper/run`

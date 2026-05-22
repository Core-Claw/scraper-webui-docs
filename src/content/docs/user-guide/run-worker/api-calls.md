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

Get your API key from the [CoreClaw Console](https://console.coreclaw.com/settings/integrations).

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
  "version": "<version>",
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
  "is_async": true,
  "callback_url": "https://your-callback.example.com/webhook"
}
```

`is_async` controls whether the run executes asynchronously: `true` (default) for async, `false` to wait for completion. Provide `callback_url` when you need webhook delivery of results.

`custom` is not a free-form string and not the old `custom_params` JSON string field. Its structure varies per Worker — it is not a fixed static schema.

To find the exact fields for a specific Worker:

- **API**: Call `GET /api/scraper?slug=<scraper_slug>` and read `data.parameters.custom` from the response. Each entry in `properties[]` maps to a field in `input.parameters.custom`.
- **Console**: Open the Worker in the [CoreClaw Console](https://console.coreclaw.com), go to the **Input** tab, click the **API** button in the top-right corner, and select **API clients** to view ready-to-use code snippets.

![API clients button in Worker Input tab](@/assets/docs/74.png)

When building `custom`:
- Use each `properties[].name` as the key
- Follow the declared `type`, nested structure, and array shape
- Provide every field where `required: true`
- If `custom` is empty or does not match, the API returns `400 Bad Request`

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

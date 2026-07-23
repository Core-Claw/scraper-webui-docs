---
title: API Calls
description: Run Workers and Task templates programmatically via the CoreClaw API
sidebar:
  order: 6
---

Learn how to launch Workers, run Task templates, and inspect runs programmatically using CoreClaw API v2.

## Getting Started

### Authentication

The API v2 base URL is:

```text
https://openapi.coreclaw.com
```

Authenticated endpoints support Bearer token, the legacy `api-key` header, and query token. New integrations should prefer Bearer token:

```bash
curl -X GET "https://openapi.coreclaw.com/api/v2/users/account" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Get your API key from the [CoreClaw Console](https://console.coreclaw.com/settings/integrations).

For the full endpoint reference, see [Base URL & Authentication](/api/).

## Identifier Types

| Identifier | What it identifies | How to get it | Used by |
| ---------- | ------------------ | ------------- | ------- |
| `workerId` | A Worker | Use the Worker slug, or encode a path such as `coreclaw/google-maps-scraper` as `coreclaw~google-maps-scraper`. You can get it from Store search or your Worker list. | `/api/v2/workers/{workerId}`, `/api/v2/workers/{workerId}/runs` |
| `workerTaskId` | A saved Task template | Generated when a user creates and saves a Task template. | `/api/v2/worker-tasks/{workerTaskId}/runs` |
| `runId` | A specific run record | Returned as `data.run_slug` after starting or rerunning a Worker or Task. | `/api/v2/worker-runs/{runId}`, `/api/v2/worker-runs/{runId}/result`, `/api/v2/worker-runs/{runId}/result/export` |

Do not mix these identifiers. Passing a `runId` where a `workerId` or `workerTaskId` is expected results in request validation errors.

## Start a Worker run

```bash
POST /api/v2/workers/{workerId}/runs
```

**Request body:**

```json
{
  "input": {
    "parameters": {
      "custom": {
        "keywords": ["coffee"],
        "base_location": "New York,USA",
        "max_results": 1
      }
    }
  },
  "is_async": true,
  "callback_url": "https://your-callback.example.com/webhook"
}
```

`is_async` controls whether the run executes asynchronously: `true` submits and returns immediately; `false` waits for the synchronous result window. When the request returns, save both `data.run_slug` as `runId` and `request_id` for follow-up and troubleshooting. Provide `callback_url` when you need webhook delivery of status updates.

`input` varies per Worker. It is not the old `custom_params` JSON string field. Read the Worker schema before constructing the payload:

- **API**: Call [`GET /api/v2/workers/{workerId}/input-schema`](/api/workers/input-schema/) and build `input` from the returned schema.
- **Console**: Open the Worker in the [CoreClaw Console](https://console.coreclaw.com), go to the **Input** tab, click the **API** button in the top-right corner, and select **API clients** to view ready-to-use code snippets.

![API clients button in Worker Input tab](@/assets/docs/74.png)

When building `input`:

- Follow the Worker input schema exactly.
- Put Worker form fields under `input.parameters.custom` unless that Worker's schema explicitly says otherwise.
- Provide every required field.
- Keep `limit` at `100` or lower when using synchronous result pagination.
- If `input` is missing or does not match the Worker schema, the API returns a validation error.

### How to get `version`

`version` is optional. If omitted, the platform uses the latest version automatically. To pin a specific version, use the Worker version shown in the Console or the `version` field returned by [Run Detail](/api/worker-runs/detail/).

## Run a saved Task template

```bash
POST /api/v2/worker-tasks/{workerTaskId}/runs
```

**Request body:**

```json
{
  "is_async": true,
  "callback_url": "https://your-callback.example.com/webhook"
}
```

Task templates already contain their saved input settings. Use `callback_url` when you need webhook delivery, and use the returned `data.run_slug` as the `runId` for follow-up calls.

## Inspect a run

Use the returned `runId` with the run APIs. Check `data.status` as the primary outcome field; `results`, timestamps, and `err_msg` are supporting diagnostics, not substitutes for status. Use bounded backoff while status is `ready` or `running`; on `succeeded`, read results or export; on `failed`, preserve `request_id` and inspect detail plus logs; after an abort request, re-read that same concrete `runId` and handle the documented `aborting` state rather than inventing `aborted`.

For the contract-supported states, real response shapes, polling sequence, and cancellation caveats, see [Run Lifecycle & Status](/api/run-lifecycle/).

Use the returned `runId` with the run APIs:

- [Run Detail](/api/worker-runs/detail/) for status, Worker, and version.
- [Run Log](/api/worker-runs/log/) for execution logs.
- [Run Result List](/api/worker-runs/result/) for paginated results.
- [Export Run Result](/api/worker-runs/export/) for file export.

## Common mistakes

- Using old v1 paths instead of the v2 resource paths.
- Sending `system_params` or `custom_params` as stringified JSON.
- Passing a `runId` where a `workerId` or `workerTaskId` is required.
- Omitting required Worker-specific `input` fields.
- Treating `last` run endpoints as stable references when a concrete `runId` is available.

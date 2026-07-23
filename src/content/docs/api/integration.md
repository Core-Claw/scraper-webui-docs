---
title: "API Integration"
description: "Run Workers and retrieve results with CoreClaw API v2"
sidebar:
  order: -1
---

The recommended CoreClaw API v2 flow is: verify authentication, choose the run entry point, build input from the Worker schema, choose async or sync execution, save `data.run_slug` and `request_id`, then use `runId` to read status, logs, results, or an export file. See [Run Lifecycle & Status](/api/run-lifecycle/) for state handling, backoff polling, and cancellation semantics.

## 1. Quick Authentication Check

Start by verifying that the token works. HTTP status describes the request layer, and application `code` describes the business layer.

```bash
curl -X GET "https://openapi.coreclaw.com/api/v2/users/account" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 2. Choose the run entry point

CoreClaw has two common run entry points. Direct Worker run is for callers that send a fresh `input` payload. Saved Worker task run is for reusing a task template already configured in the platform.

| Scenario | Endpoint | When to use |
| --- | --- | --- |
| Direct Worker run | `POST /api/v2/workers/{workerId}/runs` | The caller builds `input`; each request can send different input. |
| Saved Worker task run | `POST /api/v2/worker-tasks/{workerTaskId}/runs` | Input comes from the saved task configuration; the request body controls execution mode, callback, and synchronous result window. |

### Search or list Workers

```bash
curl "https://openapi.coreclaw.com/api/v2/store?keyword=coffee&offset=0&limit=20"
```

### Read the input schema

Read the Worker input schema before sending `input`. Fields, defaults, and constraints can differ by Worker.

```bash
curl "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/input-schema"
```

## 3. Choose the execution mode

- `is_async: true` submits asynchronously and does not wait for execution results. The response returns `data.run_slug`; Poll by `runId` when the run is asynchronous.
- `is_async: false` waits for completion, equivalent to run-and-wait behavior. `offset` / `limit` only control the result window included in the synchronous response; they do not change the full result set.

> **⚠️ Sync wait limit: 5 minutes.** When `is_async: false`, the platform waits for the run for **up to 5 minutes at most**. If the run has not finished within 5 minutes, the request returns anyway and the run keeps executing in the background — you must then use the run **query endpoint** to poll status, logs, and results by `runId`. For runs that may exceed 5 minutes, prefer `is_async: true`.
- `callback_url` can receive status-change or completion notifications, but callbacks do not replace result endpoints. Use `runId` to read or export complete data.

### Direct Worker run

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"input":{"parameters":{"custom":{"keywords":["coffee"],"base_location":"New York,USA","max_results":1}}},"is_async":true,"limit":20,"offset":0}'
```

### Saved Worker task run

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/worker-tasks/YOUR_WORKER_TASK_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"is_async":true,"callback_url":"https://example.com/coreclaw/callbacks"}'
```

The response `data.run_slug` is the `runId` used by follow-up endpoints.

### Manage saved task templates

Besides creating tasks manually on the platform, you can manage task templates through the API: create with `POST /api/v2/worker-tasks`, read with `GET /api/v2/worker-tasks/{workerTaskId}`, update title/description/schedule with `PUT`, update input parameters with `PUT .../input`, and delete with `DELETE`. This lets you reuse the same input and schedule configuration from the server side instead of resending `input` every time.

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/worker-tasks" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"worker_id":"coreclaw~google-maps-scraper","title":"Google Maps Scraper (Task)","input":{"parameters":{"custom":{"keywords":[{"keyword":"HVAC Contractors"}],"base_location":"New York,USA","max_results":1}}}}'
```

## 4. Poll by `runId` when the run is asynchronous

```bash
curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"

curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID/log" \
  -H "Authorization: Bearer YOUR_API_KEY"

curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID/result?offset=0&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

`offset` is zero-based. List and result endpoints default `limit` to `20` and cap it at `100`. Poll long-running jobs with backoff to avoid `429` responses.

## 5. Use export endpoints for downloads

Use `/result` endpoints for paginated previews. Use export endpoints for downloads, and use `filter_keys` to limit exported fields.

```bash
curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID/result/export?format=csv&filter_keys=title%2Caddress" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Error Handling Guidance

1. Check both HTTP status and application `code`; do not rely on only one layer.
2. `401` usually means the token is missing or invalid. `422` usually means a field value, pagination range, or request semantic failed validation.
3. Store `request_id` for troubleshooting failed requests.
4. Retry `429` responses with backoff instead of replaying immediately at high frequency.
5. Each plan also caps how many runs can execute **at once**; a start request beyond that cap is rejected with no run created and no balance charged. See [Concurrency Limits](/user-guide/run-worker/concurrency-limits/) and queue runs client-side for batch workloads.

---
title: "API Integration"
description: "Run Workers and retrieve results with CoreClaw API v2"
sidebar:
  order: -1
---

The recommended CoreClaw API v2 flow is: verify authentication, choose the run entry point, build input from the Worker schema, choose async or sync execution, then use `runId` to read status, logs, results, or an export file.

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
- `callback_url` can receive status-change or completion notifications, but callbacks do not replace result endpoints. Use `runId` to read or export complete data.

### Direct Worker run

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"input":{"keyword":"coffee","limit":10},"is_async":true,"version":"latest","callback_url":"https://example.com/coreclaw/callbacks"}'
```

### Saved Worker task run

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/worker-tasks/YOUR_WORKER_TASK_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"is_async":true,"callback_url":"https://example.com/coreclaw/callbacks"}'
```

The response `data.run_slug` is the `runId` used by follow-up endpoints.

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

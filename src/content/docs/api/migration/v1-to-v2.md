---
title: 'API Migration Guide'
description: 'A step-by-step guide for moving an existing CoreClaw API V1 integration to V2'
sidebar:
    order: 1
---

API V1 is scheduled for retirement. Migrate production integrations as soon as possible.

V2 is not a path-only upgrade. It replaces action-style `POST` endpoints with resource-oriented URLs, moves identifiers into paths, moves filters into query parameters, uses string run statuses, and adds `request_id` to the response envelope.

The V1-era public API documented 13 operations: ten under `/api/v1` and three public operations without a version prefix. The endpoint comparison covers all 13. V2 exposes 39 public operations; the other 26 provide new capabilities without a direct V1 equivalent.

Use the [endpoint mapping](/api/migration/endpoint-mapping/) while updating each call. The [migration examples](/api/migration/examples/) cover Python, Node.js, Java, PHP, and Go.

## Before and after

The most common V1 request placed the scraper identifier, pagination, and execution settings in one JSON body:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"scraper_slug":"YOUR_SCRAPER_SLUG","version":"latest","input":{"parameters":{"custom":{"keywords":["coffee"]}}},"is_async":true,"page_index":1,"page_size":20}'
```

In V2, resolve the Worker identifier first, put it in the URL, prefer Bearer authentication, and use `offset` plus `limit` in the request body:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"version":"latest","input":{"parameters":{"custom":{"keywords":["coffee"]}}},"is_async":true,"offset":1,"limit":20}'
```

The response still returns the run identifier as `data.run_slug`. Use that value as `{runId}` in V2 URLs.

## Migration procedure

### 1. Inventory V1 calls

Search the integration for `/api/v1/`, `/api/scraper`, `/api/store`, `/api/proxy/region`, `api-key`, `scraper_slug`, `task_slug`, `run_slug`, `page_index`, `page_size`, and numeric run-status comparisons. Match every call to the [interface comparison table](/api/migration/endpoint-mapping/).

### 2. Resolve V2 identifiers

- `{workerId}` accepts a Worker slug or an `owner/name` path encoded as `owner~name`.
- `{workerTaskId}` is the saved Worker task identifier.
- `{runId}` is the `data.run_slug` returned when a run starts or is rerun.

Do not assume an old `scraper_slug` is automatically a valid `{workerId}`. Verify it with [List Workers](/api/workers/list/), [Get Worker Detail](/api/workers/detail/), or [List Store Workers](/api/store/list/) before deployment.

### 3. Update authentication

Replace the V1 header:

```http
api-key: YOUR_API_KEY
```

with the recommended V2 header:

```http
Authorization: Bearer YOUR_API_KEY
```

V2 retains the legacy `api-key` header for server-side compatibility, but migrating to Bearer now avoids carrying the V1 convention into new code. Query token authentication is also available when headers cannot be set; avoid logging URLs that contain a token.

### 4. Move fields to paths and queries

V1 sent almost every argument in a JSON body. V2 uses:

- path parameters for `workerId`, `workerTaskId`, and `runId`;
- query parameters for pagination, filters, and export options;
- JSON request bodies only for creating, updating, running, or rerunning resources.

V1 pagination converts as follows:

```text
offset = page_index
limit  = page_size
```

V2 `offset` is a 1-based page number (`offset=1` is page 1, `offset=0` is accepted as page 1), and list/result `limit` cannot exceed `100`. V1 allowed a run `page_size` up to `1000`, so callers requesting larger pages must paginate or use an export endpoint.

### 5. Update run status handling

V1 returned integer statuses. V2 returns strings:

|  V1 | V2          | Meaning                     |
| --: | ----------- | --------------------------- |
| `1` | `ready`     | Accepted and waiting to run |
| `2` | `running`   | Execution in progress       |
| `3` | `succeeded` | Completed successfully      |
| `4` | `failed`    | Completed with failure      |
| `5` | `aborting`  | Cancellation is in progress |

Treat only `succeeded` and `failed` as completed states. `aborting` is the state exposed by the current public contract; do not invent a separate terminal value.

### 6. Update response and error handling

Most V2 JSON responses use this envelope:

```json
{
    "code": 0,
    "message": "success",
    "request_id": "req-123",
    "data": {}
}
```

Check both the HTTP status and application `code`. Save `request_id` in logs so support can trace a failed request. Validation failures may use HTTP `422`, and rate limiting uses `429`; retry `429` with backoff.

Some run response fields still use `scraper_slug` and `scraper_title` for backward compatibility. Do not rename response fields unless the V2 endpoint reference shows a replacement.

### 7. Recheck Worker input

The outer V2 run request is standardized, but `input.parameters.custom` differs by Worker. Read [Get Worker Input Schema](/api/workers/input-schema/) and validate the production payload before switching traffic. The `version` field remains optional on a direct Worker run.

### 8. Choose execution behavior

- `is_async: true` returns after submission. Save `data.run_slug`, then poll `GET /api/v2/worker-runs/{runId}` with backoff.
- `is_async: false` waits for completion for up to five minutes. A longer run continues in the background; continue by polling with `{runId}`.
- `callback_url` reports status changes or completion, but consumers should still read run detail and results as the authoritative source.

See [Run Lifecycle & Status](/api/run-lifecycle/) and [Callbacks](/api/callbacks/) for the full behavior.

## Release checklist

- Every legacy URL under `/api/v1`, `/api/scraper`, `/api/store`, and `/api/proxy/region` has been replaced.
- Worker and task identifiers have been verified in V2.
- Authentication uses Bearer tokens in new code.
- Pagination uses 1-based `offset` (page number) and `limit <= 100`.
- Numeric status comparisons have been replaced with V2 strings.
- The client checks HTTP status and application `code`, and logs `request_id`.
- Async callers persist `data.run_slug` before polling.
- Result downloads use the export endpoint instead of oversized pages.
- Callback handlers are idempotent by `run_slug`.
- The migrated flow has been tested with a low-cost Worker input before production traffic is switched.

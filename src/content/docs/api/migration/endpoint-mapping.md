---
title: 'V1 to V2 Endpoint Mapping'
description: 'Complete CoreClaw API V1 endpoint comparison and breaking-change reference'
sidebar:
    order: 2
---

The V1-era public API documented 13 operations: ten under `/api/v1` and three public operations without a version prefix. The table below maps all 13 to V2. V2 exposes 34 public operations in total; the other 21 are new capabilities without a direct V1 equivalent. A single V1 body often becomes a combination of a V2 path, query string, and smaller JSON body.

## Complete endpoint comparison

| V1 operation                     | V2 replacement                                                                                                                           | Required changes                                                                                                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/scraper`               | [`GET /api/v2/workers/{workerId}`](/api/workers/detail/) and [`GET /api/v2/workers/{workerId}/input-schema`](/api/workers/input-schema/) | Move the `slug` query value to `{workerId}` and encode `owner/name` as `owner~name`. Authentication is now required for Worker detail; read the public input-schema endpoint when only the input contract is needed. |
| `GET /api/store`                 | [`GET /api/v2/store`](/api/store/list/)                                                                                                  | Change `search` to `keyword`; add zero-based `offset` when paging. `limit` now defaults to 20 and cannot exceed 100.                                                                                                 |
| `GET /api/proxy/region`          | [`GET /api/v2/proxy/region`](/api/proxy/region/)                                                                                         | Add the `/v2` path segment. The optional `language` query parameter is available in V2.                                                                                                                              |
| `POST /api/v1/run/result/list`   | [`GET /api/v2/worker-runs/{runId}/result`](/api/worker-runs/result/)                                                                     | Move `run_slug` to `{runId}`. Convert `page_index` and `page_size` to `offset` and `limit` query parameters.                                                                                                         |
| `POST /api/v1/run/detail`        | [`GET /api/v2/worker-runs/{runId}`](/api/worker-runs/detail/)                                                                            | Move `run_slug` from the body to `{runId}`. Remove the JSON body.                                                                                                                                                    |
| `POST /api/v1/scraper/run`       | [`POST /api/v2/workers/{workerId}/runs`](/api/workers/run/)                                                                              | Replace `scraper_slug` with a verified `{workerId}` path value. Keep `version`, `input`, `callback_url`, and `is_async` in the body. Rename `page_index`/`page_size` to `offset`/`limit`.                            |
| `POST /api/v1/rerun`             | [`POST /api/v2/worker-runs/{runId}/rerun`](/api/worker-runs/rerun/)                                                                      | Move `run_slug` to `{runId}`. Keep `callback_url` in the body; V2 also supports `is_async`, `offset`, and `limit`.                                                                                                   |
| `POST /api/v1/run/result/export` | [`GET /api/v2/worker-runs/{runId}/result/export`](/api/worker-runs/export/)                                                              | Move `run_slug` to `{runId}`. Send `format` and comma-separated `filter_keys` as query parameters. Remove the JSON body.                                                                                             |
| `POST /api/v1/task/run`          | [`POST /api/v2/worker-tasks/{workerTaskId}/runs`](/api/worker-tasks/run/)                                                                | Move `task_slug` to `{workerTaskId}`. Keep `callback_url` in the body; V2 also supports `is_async`, `offset`, and `limit`.                                                                                           |
| `POST /api/v1/run/list`          | [`GET /api/v2/worker-runs`](/api/worker-runs/list/)                                                                                      | Move filters to query parameters. Rename `scraper_slug` to `worker_id`; convert pagination and numeric status values. Omit `status` to list all statuses.                                                            |
| `POST /api/v1/run/last/log`      | [`GET /api/v2/worker-runs/{runId}/log`](/api/worker-runs/log/)                                                                           | Despite the V1 path name, the body selected a run by `run_slug`. Move it to `{runId}` and remove the body.                                                                                                           |
| `POST /api/v1/scraper/abort`     | [`POST /api/v2/worker-runs/{runId}/abort`](/api/worker-runs/abort/)                                                                      | Move `run_slug` to `{runId}` and remove the body. V2 returns the standard response envelope.                                                                                                                         |
| `POST /api/v1/account/info`      | [`GET /api/v2/users/account`](/api/account/get/)                                                                                         | Change `POST` to `GET` and remove the empty JSON body. Account response fields changed; update deserialization.                                                                                                      |

## Field and behavior changes

| Area                 | V1                                                  | V2                                                                  | Migration action                                                                      |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Authentication       | `api-key` header                                    | Bearer recommended; legacy header and query token also supported    | Send `Authorization: Bearer YOUR_API_KEY`.                                            |
| Resource name        | `scraper` in request concepts                       | `worker` in paths and request concepts                              | Rename client models and variables, but keep documented `scraper_*` response fields.  |
| Identifiers          | IDs in JSON bodies                                  | `workerId`, `workerTaskId`, and `runId` in paths                    | URL-encode path values and verify the V2 Worker identifier.                           |
| Pagination           | `page_index` starts at 1; `page_size`               | `offset` starts at 0; `limit` is at most 100                        | Use `offset = (page_index - 1) * page_size`.                                          |
| Run status           | Integers `1` through `5`; `0` means all in a filter | Strings `ready`, `running`, `succeeded`, `failed`, `aborting`       | Replace numeric comparisons; omit an all-status filter.                               |
| Result export fields | `filter_keys` JSON array                            | Comma-separated `filter_keys` query string                          | Join field names with commas and URL-encode the query.                                |
| Export formats       | `csv`, `json` documented                            | `csv`, `json`, `jsonl`, `xlsx`, `xls`, `xml`, `html`, `rss`         | Keep an allowed lowercase value; do not rely on V1 validation.                        |
| Response envelope    | `code`, `message`, `data`                           | `code`, `message`, `request_id`, and usually `data`                 | Add `request_id` to logs and allow success responses without `data` where documented. |
| Validation           | Mainly `400`, `401`, `429` documented               | Also uses `404`, `422`, and standardized error envelopes            | Branch on HTTP status and application `code`.                                         |
| Account data         | `balance`, `traffic`, `traffic_expiration_at`       | Current contract example exposes `balance`, `balance_expiration_at` | Do not require removed traffic fields; follow the account endpoint schema.            |
| Run logs             | Log list items were structured objects in V1        | Current V2 example exposes the log `list` as strings                | Treat `data.list` according to the V2 endpoint contract, not a V1 log-item model.     |

## Request conversions

### List results

```json
// V1 body
{ "run_slug": "RUN_ID", "page_index": 3, "page_size": 20 }
```

```http
GET /api/v2/worker-runs/RUN_ID/result?offset=40&limit=20
```

### Filter runs

```json
// V1 body: status 3 meant succeeded
{ "page_index": 1, "page_size": 20, "status": 3, "scraper_slug": "WORKER_ID" }
```

```http
GET /api/v2/worker-runs?offset=0&limit=20&status=succeeded&worker_id=WORKER_ID
```

### Export selected fields

```json
// V1 body
{ "run_slug": "RUN_ID", "format": "csv", "filter_keys": ["title", "address"] }
```

```http
GET /api/v2/worker-runs/RUN_ID/result/export?format=csv&filter_keys=title%2Caddress
```

## V2 capabilities without a direct V1 equivalent

V2 also exposes Worker discovery and input schemas, Worker task CRUD, account-level and Worker-level latest-run shortcuts, and dedicated endpoints for run logs, results, exports, cancellation, and reruns. Use the [public endpoint reference](/api/) to avoid rebuilding these capabilities from V1-era workarounds.

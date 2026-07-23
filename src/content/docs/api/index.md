---
title: "Base URL & Authentication"
description: "CoreClaw API v2 base URL, authentication, and public endpoint reference"
sidebar:
  order: 0
---

## API Base URL

Use `https://openapi.coreclaw.com` as the HTTP API base URL. Every v2 endpoint path starts with `/api/v2`, for example `https://openapi.coreclaw.com/api/v2/users/account`.

```
https://openapi.coreclaw.com
```

## Authentication

Authenticated endpoints support three token transport modes. Prefer Bearer tokens, while keeping compatibility with the legacy `api-key` header and query token:

```bash
-H "Authorization: Bearer YOUR_API_KEY"
```

| Mode | Example | Notes |
| --- | --- | --- |
| Bearer token | `Authorization: Bearer YOUR_API_KEY` | Recommended for new server-side integrations; also works in the browser playground |
| Legacy header | `api-key: YOUR_API_KEY` | Compatible with v1 integrations; **server-side only — the browser playground cannot use it due to a CORS preflight restriction; use Bearer or query token instead** |
| Query token | `?token=YOUR_API_KEY` | Use only when headers are unavailable; avoid logging tokenized URLs |

Public endpoints do not require a token, including proxy region lookup and Store Worker search.

## Calling Conventions

- Read the Worker input schema before sending `input`; fields differ by Worker.
- Use `POST /api/v2/workers/{workerId}/runs` for a direct Worker run, or `POST /api/v2/worker-tasks/{workerTaskId}/runs` for a saved task run.
- `is_async: true` returns immediately; use `runId` to read details, logs, and results. `is_async: false` waits for completion and returns a synchronous result window.
- `offset` is zero-based on list and result endpoints; `limit` is capped at `100` on list and result endpoints.
- Use export endpoints when the caller needs a downloadable result file instead of fetching every page in a browser.

## Response Envelope

Most JSON responses include `code`, `message`, `request_id`, and `data`. HTTP status describes the request layer; application `code: 0` means the business operation succeeded. Keep HTTP status, `code`, `message`, and `request_id` when troubleshooting failed requests.

## Identifier Types

| Identifier | Meaning | Usage |
| --- | --- | --- |
| `workerId` | Worker identifier | Accepts a Worker slug or a path encoded as `owner~name` from `owner/name` |
| `workerTaskId` | Saved task template identifier | Passed as a path parameter when running a task template |
| `runId` | Run record identifier | The `data.run_slug` returned after starting or rerunning a Worker |

## Public Endpoint Reference

| # | Method | Endpoint | Docs |
| --- | --- | --- | --- |
| 1 | `GET` | `/api/v2/proxy/region` | [List Proxy Regions](/api/proxy/region/) |
| 2 | `GET` | `/api/v2/store` | [List Store Workers](/api/store/list/) |
| 3 | `GET` | `/api/v2/users/account` | [Get User Account](/api/account/get/) |
| 4 | `GET` | `/api/v2/workers` | [List Workers](/api/workers/list/) |
| 5 | `GET` | `/api/v2/workers/{workerId}` | [Get Worker Detail](/api/workers/detail/) |
| 6 | `GET` | `/api/v2/workers/{workerId}/input-schema` | [Get Worker Input Schema](/api/workers/input-schema/) |
| 7 | `POST` | `/api/v2/workers/{workerId}/runs` | [Run Worker](/api/workers/run/) |
| 8 | `GET` | `/api/v2/worker-tasks` | [List Worker Tasks](/api/worker-tasks/list/) |
| 9 | `POST` | `/api/v2/worker-tasks/{workerTaskId}/runs` | [Run Worker Task](/api/worker-tasks/run/) |
| 10 | `POST` | `/api/v2/worker-tasks` | [Create Worker Task](/api/worker-tasks/create/) |
| 11 | `GET` | `/api/v2/worker-tasks/{workerTaskId}` | [Get Worker Task](/api/worker-tasks/get/) |
| 12 | `PUT` | `/api/v2/worker-tasks/{workerTaskId}` | [Update Worker Task](/api/worker-tasks/update/) |
| 13 | `DELETE` | `/api/v2/worker-tasks/{workerTaskId}` | [Delete Worker Task](/api/worker-tasks/delete/) |
| 14 | `GET` | `/api/v2/worker-tasks/{workerTaskId}/input` | [Get Worker Task Input](/api/worker-tasks/get-input/) |
| 15 | `PUT` | `/api/v2/worker-tasks/{workerTaskId}/input` | [Update Worker Task Input](/api/worker-tasks/update-input/) |
| 16 | `GET` | `/api/v2/worker-runs` | [List Worker Runs](/api/worker-runs/list/) |
| 17 | `GET` | `/api/v2/worker-runs/last` | [Get Last Worker Run](/api/worker-runs/last-detail/) |
| 18 | `POST` | `/api/v2/worker-runs/last/abort` | [Abort Last Worker Run](/api/worker-runs/last-abort/) |
| 19 | `GET` | `/api/v2/worker-runs/last/export` | [Export Last Worker Run Results](/api/worker-runs/last-export/) |
| 20 | `GET` | `/api/v2/worker-runs/last/log` | [Get Last Worker Run Log](/api/worker-runs/last-log/) |
| 21 | `POST` | `/api/v2/worker-runs/last/rerun` | [Rerun Last Worker Run](/api/worker-runs/last-rerun/) |
| 22 | `GET` | `/api/v2/worker-runs/last/result` | [List Last Worker Run Results](/api/worker-runs/last-result/) |
| 23 | `GET` | `/api/v2/worker-runs/{runId}` | [Get Worker Run Detail](/api/worker-runs/detail/) |
| 24 | `POST` | `/api/v2/worker-runs/{runId}/abort` | [Abort Worker Run](/api/worker-runs/abort/) |
| 25 | `GET` | `/api/v2/worker-runs/{runId}/log` | [Get Worker Run Log](/api/worker-runs/log/) |
| 26 | `POST` | `/api/v2/worker-runs/{runId}/rerun` | [Rerun Worker Run](/api/worker-runs/rerun/) |
| 27 | `GET` | `/api/v2/worker-runs/{runId}/result` | [List Worker Run Results](/api/worker-runs/result/) |
| 28 | `GET` | `/api/v2/worker-runs/{runId}/result/export` | [Export Worker Run Results](/api/worker-runs/export/) |
| 29 | `GET` | `/api/v2/workers/{workerId}/runs/last` | [Get Worker Last Run](/api/worker-runs/worker-last-detail/) |
| 30 | `POST` | `/api/v2/workers/{workerId}/runs/last/abort` | [Abort Worker Last Run](/api/worker-runs/worker-last-abort/) |
| 31 | `GET` | `/api/v2/workers/{workerId}/runs/last/export` | [Export Worker Last Run Results](/api/worker-runs/worker-last-export/) |
| 32 | `GET` | `/api/v2/workers/{workerId}/runs/last/log` | [Get Worker Last Run Log](/api/worker-runs/worker-last-log/) |
| 33 | `POST` | `/api/v2/workers/{workerId}/runs/last/rerun` | [Rerun Worker Last Run](/api/worker-runs/worker-last-rerun/) |
| 34 | `GET` | `/api/v2/workers/{workerId}/runs/last/result` | [List Worker Last Run Results](/api/worker-runs/worker-last-result/) |

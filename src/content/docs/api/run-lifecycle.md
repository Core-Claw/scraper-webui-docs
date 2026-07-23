---
title: "Run Lifecycle & Status"
description: "CoreClaw API v2 Worker run states, polling, and failure handling"
sidebar:
  order: -2
---

This page explains how to determine the outcome of a Worker run safely. Save the `data.run_slug` returned by a start or rerun request (the `runId` used by follow-up endpoints) together with `request_id`, then read run detail by the specific `runId`. Do not treat account- or Worker-scoped `last` endpoints as stable references.

## Contract status values

`GET /api/v2/worker-runs` currently accepts these `status` filter values: `ready`, `running`, `succeeded`, `failed`, `aborting`. These are the values supported by the public API contract.

| Status | Client handling |
| --- | --- |
| `ready` | The run exists but has not started. Poll run detail with bounded backoff. |
| `running` | The run is executing. Continue backoff polling; read logs when progress or diagnostics are needed. |
| `succeeded` | The run succeeded. Read `/result` for a preview or use an export endpoint for a download URL. A result count of `0` can still be successful. |
| `failed` | The run failed. Preserve `request_id`, read detail and logs, and show `err_msg` only when present. Do not infer failure from result count alone. |
| `aborting` | Cancellation was requested. Perform bounded detail/log reads for the **same `runId`** instead of waiting indefinitely. |

> `aborted` is not a value in the current public `status` filter contract. Clients must not rewrite `aborting` to `aborted`, and must not use `finished_at` alone as proof of success or a final state.

## Run detail fields

| Field | Use and caveats |
| --- | --- |
| `slug` | Run identifier; pass it as `runId` to detail, log, result, and export endpoints. |
| `scraper_slug`, `scraper_title`, `version` | Identify the Worker and version that actually ran. |
| `status` | The primary outcome field. Always prioritize it over result count, timestamps, or diagnostics. |
| `results` | Current or final number of rows. `0` does not mean failure, and a non-zero count does not guarantee success. |
| `err_msg` | Optional diagnostic text. It can be absent and may appear on non-failed records; use it only as supporting diagnostic evidence. |
| `started_at`, `finished_at`, `duration` | Execution timing. Cancellation, queueing, or server-side state synchronization can produce incomplete or non-intuitive combinations. |
| `origin`, `usage`, `traffic` | Source, billing/usage, and traffic diagnostics. Use them for observability, not as success criteria. |

## Recommended polling flow

1. After submission, save `data.run_slug` and `request_id`.
2. Call [`GET /api/v2/worker-runs/{runId}`](/api/worker-runs/detail/) and read `data.status`. Wait about 2 seconds first, then back off progressively to 5, 10, and 15 seconds; enforce a total timeout.
3. Continue polling for `ready` or `running`; read the [run log](/api/worker-runs/log/) when diagnosing progress.
4. On `succeeded`, read [run results](/api/worker-runs/result/) or [export results](/api/worker-runs/export/).
5. On `failed`, retain `request_id`, read detail and logs, and act on Worker input or log evidence. Call a rerun endpoint only when repeating the work is intentional.
6. After an abort request, read only the concrete `runId` that you just submitted. If it remains `aborting`, make a bounded number of backoff reads and tell the user that cancellation is being processed.

## Use with callbacks

`callback_url` can reduce polling, but receivers should be idempotent by `run_slug` and re-read [run detail](/api/worker-runs/detail/) before acting on a notification. Neither a callback nor `finished_at` replaces the `status` decision. See [Callback Notifications](/api/callbacks/).

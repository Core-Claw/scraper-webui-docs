---
title: "Callback Notifications"
description: "Receive Worker run status notifications with callback_url"
sidebar:
  order: 1
---

When a run request includes `callback_url`, CoreClaw sends a `POST` request to that URL after the run status changes or finishes.

Callbacks reduce polling, but callers should still store the `data.run_slug` and `request_id` returned by the run request for follow-up reads, troubleshooting, and idempotency.

## Triggering a Callback

Pass `callback_url` in run endpoints that accept a JSON request body, for example when starting a Worker directly:

```json
{
  "input": {
    "parameters": {
      "custom": {
        "keywords": [
          "coffee"
        ],
        "base_location": "New York,USA",
        "max_results": 1
      }
    }
  },
  "is_async": true,
  "limit": 20,
  "offset": 0,
  "callback_url": "https://example.com/coreclaw/callbacks"
}
```

## Callback Request

CoreClaw sends the callback as a `POST` request with a JSON body:

```json
{"run_slug":"run_slug","run_status":"succeeded","error_message":"","execution_start_timestamp":100,"execution_end_timestamp":200,"running_duration":100,"result_count":3,"result_message":"done"}
```

## Fields

| Field | Type | Description |
| --- | --- | --- |
| `run_slug` | `string` | Platform run slug. |
| `run_status` | `string` | Run status, for example `succeeded`. |
| `error_message` | `string` | Error message when the run fails; empty when there is no error. |
| `execution_start_timestamp` | `number` | Execution start timestamp. |
| `execution_end_timestamp` | `number` | Execution end timestamp. |
| `running_duration` | `number` | Running duration. |
| `result_count` | `number` | Current result count. |
| `result_message` | `string` | Result summary or run message. |

Handle a callback idempotently by `run_slug`, then re-read [run detail](/api/worker-runs/detail/) to confirm the actual `status`; neither a callback nor `finished_at` replaces the status decision. See [Run Lifecycle & Status](/api/run-lifecycle/) for state handling.

## Receiver Guidance

1. The callback URL should be reachable by CoreClaw servers and return a 2xx HTTP status.
2. Use the run identifier for idempotency so repeated notifications do not create duplicate writes.
3. After receiving a callback, call the run detail, log, result, or export endpoints when complete data is needed.
4. Do not put API keys in `callback_url`; use a separate signature or random callback path if your receiver needs source verification.

> The public API contract does not define a callback signature, retry policy, delivery ordering, or an at-least-once delivery guarantee. Build receivers to be idempotent by `run_slug` and always re-read run detail to confirm the authoritative `status`. For guaranteed delivery semantics, contact [support@coreclaw.com](mailto:support@coreclaw.com).

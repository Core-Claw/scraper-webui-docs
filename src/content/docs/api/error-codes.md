---
title: "Error Codes"
description: "CoreClaw API v2 application error codes"
sidebar:
  order: 2
---

CoreClaw API uses HTTP status codes for the request layer and the response body `code` for the business layer.

`code: 0` means the business operation succeeded. Non-zero values mean the request reached the service but the business operation failed. When troubleshooting, keep the HTTP status, `code`, `message`, and `request_id` together.

## Error Code Table

| Code | Key | Message |
| --- | --- | --- |
| `10000` | `SYSTEM_ERROR` | internal server error |
| `11000` | `INVALID_ARGUMENT` | invalid argument |
| `11004` | `NOT_FOUND` | not found |
| `12001` | `UNAUTHORIZED` | authentication required |
| `12002` | `INVALID_TOKEN` | invalid token |
| `13000` | `RATE_LIMITED` | too many requests |
| `14000` | `DATABASE_ERROR` | database error |
| `30001` | `INSUFFICIENT_BALANCE` | account balance is insufficient |
| `50001` | `WORKER_NOT_FOUND` | worker does not exist |
| `50002` | `WORKER_RUN_FAILED` | worker run failed |
| `50003` | `WORKER_VERSION_UNAVAILABLE` | the worker version is not available |
| `60001` | `TASK_NOT_FOUND` | task does not exist |
| `70001` | `RUN_NOT_FOUND` | run record does not exist |
| `70002` | `RUN_FAILED` | run operation failed |
| `16000` | `NOT_IMPLEMENTED` | not implemented |

## Handling Guidance

1. `12001` and `12002` usually require checking Bearer token, the `api-key` header, or query token.
2. `13000` means the request is rate limited; reduce request frequency and retry with backoff.
3. `30001` means the account balance is insufficient.
4. `50001`, `50003`, `60001`, and `70001` usually mean the Worker, task, version, or run ID does not exist or is unavailable.
5. `10000`, `14000`, and `16000` indicate server-side or capability-state issues. Keep `request_id` for troubleshooting.

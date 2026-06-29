---
title: "错误码"
description: "CoreClaw API v2 应用错误码"
sidebar:
  order: 2
---

CoreClaw API 使用 HTTP 状态码表达请求层结果，并使用响应体中的 `code` 表达业务层结果。

`code: 0` 表示业务处理成功；非 0 值表示请求已被服务端处理但业务层失败。排查问题时请同时记录 HTTP 状态、`code`、`message` 和 `request_id`。

## 错误码表

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

## 处理建议

1. `12001` 和 `12002` 通常需要检查 Bearer token、`api-key` 请求头或 query token。
2. `13000` 表示触发限流，应降低请求频率并做退避重试。
3. `30001` 表示账户余额不足，应先处理账户余额或额度。
4. `50001`、`50003`、`60001`、`70001` 通常与 Worker、任务、版本或运行 ID 不存在或不可用有关。
5. `10000`、`14000`、`16000` 属于服务端或能力状态问题，请记录 `request_id` 后再排查。

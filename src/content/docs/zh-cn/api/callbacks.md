---
title: "回调通知"
description: "使用 callback_url 接收 Worker 运行状态通知"
sidebar:
  order: 1
---

当运行请求包含 `callback_url` 时，CoreClaw 会在运行状态变化或结束后，向调用方提供的地址发送 `POST` 请求。

回调适合用来减少主动轮询次数。调用方仍应保存启动运行时返回的 `data.run_slug` 和 `request_id`，用于后续查询、排查和幂等处理。

## 触发方式

在支持请求体的运行类接口中传入 `callback_url`，例如直接运行 Worker：

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

## 回调请求

CoreClaw 发送的回调请求使用 `POST` 方法，Body 为 JSON：

```json
{"run_slug":"run_slug","run_status":"succeeded","error_message":"","execution_start_timestamp":100,"execution_end_timestamp":200,"running_duration":100,"result_count":3,"result_message":"done"}
```

## 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `run_slug` | `string` | 平台运行标识。 |
| `run_status` | `string` | 运行状态，例如 `succeeded`。 |
| `error_message` | `string` | 失败时的错误信息；没有错误时为空字符串。 |
| `execution_start_timestamp` | `number` | 执行开始时间戳。 |
| `execution_end_timestamp` | `number` | 执行结束时间戳。 |
| `running_duration` | `number` | 运行耗时。 |
| `result_count` | `number` | 当前结果数量。 |
| `result_message` | `string` | 结果摘要或运行消息。 |

收到回调时应先按 `run_slug` 做幂等处理，再读取[运行详情](/zh-cn/api/worker-runs/detail/)确认实际 `status`；回调或 `finished_at` 都不能替代状态判断。运行状态处理详见[运行生命周期与状态](/zh-cn/api/run-lifecycle/)。

## 接收端建议

1. 回调地址应能被 CoreClaw 服务端访问，并返回 2xx HTTP 状态。
2. 根据运行标识做幂等处理，避免重复通知造成重复写入。
3. 收到回调后，如需完整结果，请继续调用运行详情、日志、结果或导出接口读取。
4. 不要把 API key 放进 `callback_url`；如需校验来源，请在自己的回调服务中使用独立签名或随机路径。

> 公开 API 契约未定义回调签名、重试策略、投递顺序或至少一次投递保证。请将接收端设计为按 `run_slug` 幂等，并始终重新读取运行详情以确认权威的 `status`。如需明确的投递保证，请联系 [support@coreclaw.com](mailto:support@coreclaw.com)。

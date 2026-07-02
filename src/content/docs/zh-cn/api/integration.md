---
title: "API 集成指南"
description: "使用 CoreClaw API v2 运行 Worker 并获取结果"
sidebar:
  order: -1
---

CoreClaw API v2 的推荐流程是：确认认证，选择运行入口，按 Worker schema 构造输入，选择异步或同步执行模式，然后用 `runId` 查询状态、日志、结果或导出文件。

## 1. 快速认证检查

先用账户接口验证 token 是否可用。响应中的 HTTP 状态表示请求层结果，业务 `code` 表示业务层结果。

```bash
curl -X GET "https://openapi.coreclaw.com/api/v2/users/account" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 2. 选择运行入口

CoreClaw 有两类常见运行入口。直接运行 Worker 适合调用方每次传入新的 `input`；运行已保存的 Worker 任务适合复用平台中已经配置好的任务模板。

| 场景 | 接口 | 何时使用 |
| --- | --- | --- |
| 直接运行 Worker | `POST /api/v2/workers/{workerId}/runs` | 调用方自己构造 `input`，每次请求可以传入不同输入。 |
| 运行已保存的 Worker 任务 | `POST /api/v2/worker-tasks/{workerTaskId}/runs` | 输入来自已保存任务配置，请求体只控制执行模式、回调和同步结果窗口。 |

### 搜索或列出 Worker

```bash
curl "https://openapi.coreclaw.com/api/v2/store?keyword=coffee&offset=0&limit=20"
```

### 读取输入 schema

发送 `input` 前应先读取 Worker 输入 schema。不同 Worker 的字段、默认值和约束可能不同。

```bash
curl "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/input-schema"
```

## 3. 选择执行模式

- `is_async: true` 表示异步提交，不等待执行结果。响应会返回 `data.run_slug`，后续异步运行使用 `runId` 轮询详情、日志和结果。
- `is_async: false` 表示等待执行结果，相当于 run-and-wait，会等待运行完成。`offset` / `limit` 只控制同步响应中附带的结果窗口，不影响完整结果集。**同步模式最多等待 5 分钟；超过 5 分钟仍未完成时，请求会先返回，需要改用运行查询接口轮询状态。**
- `callback_url` 可用于接收状态变化或结束通知，但回调不能替代结果接口。需要完整数据时仍应按 `runId` 查询或导出。

> **⚠️ 同步等待上限：5 分钟。** 当 `is_async: false` 时，平台**最多等待 5 分钟**。若运行在 5 分钟内未完成，请求仍会返回，运行会在后台继续执行——此时必须改用运行**查询接口**按 `runId` 轮询状态、日志和结果。预计运行可能超过 5 分钟时，建议使用 `is_async: true`。

### 直接运行 Worker

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"input":{"parameters":{"custom":{"keywords":["coffee"],"base_location":"New York,USA","max_results":1}}},"is_async":true,"limit":20,"offset":0}'
```

### 运行已保存的 Worker 任务

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/worker-tasks/YOUR_WORKER_TASK_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"is_async":true,"callback_url":"https://example.com/coreclaw/callbacks"}'
```

响应中的 `data.run_slug` 就是后续接口使用的 `runId`。

## 4. 异步运行使用 `runId` 轮询

```bash
curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"

curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID/log" \
  -H "Authorization: Bearer YOUR_API_KEY"

curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID/result?offset=0&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

`offset` 从 0 开始；列表和结果接口的 `limit` 默认 `20`，最大 `100`。长时间轮询时应使用退避策略，避免触发 `429`。

## 5. 下载文件使用导出接口

结果预览使用 `/result` 分页接口。需要下载文件时使用导出接口，并用 `filter_keys` 控制导出字段。

```bash
curl "https://openapi.coreclaw.com/api/v2/worker-runs/YOUR_RUN_ID/result/export?format=csv&filter_keys=title%2Caddress" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 错误处理建议

1. 同时检查 HTTP 状态和业务 `code`；不要只看其中一个。
2. `401` 通常表示 token 缺失或无效；`422` 通常表示字段值、分页范围或请求语义不符合契约。
3. 保存 `request_id`，用于排查失败请求。
4. 对 `429` 做退避重试，不要立即高频重放请求。

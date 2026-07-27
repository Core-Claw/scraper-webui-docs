---
title: 'API 迁移指南'
description: '将现有 CoreClaw API V1 集成迁移到 V2 的分步指南'
sidebar:
    order: 1
---

API V1 已计划停用。请尽快迁移生产集成。

V2 不只是替换路径前缀。它把动作式 `POST` 接口改为资源化 URL，将标识符移入路径、筛选条件移入 query，运行状态改为字符串，并在响应 envelope 中增加 `request_id`。

V1 时期的公开 API 文档共收录 13 个接口：10 个位于 `/api/v1` 下，另外 3 个公开接口没有版本前缀。接口对照表覆盖全部 13 个旧接口。V2 对外提供 34 个公开接口，其余 21 个是没有旧版直接对应项的新增能力。

更新每个调用时请配合查看[接口对照表](/zh-cn/api/migration/endpoint-mapping/)；[迁移代码示例](/zh-cn/api/migration/examples/)覆盖 Python、Node.js、Java、PHP 和 Go。

## 改造前后对比

最常见的 V1 请求把脚本标识、分页和执行参数都放在 JSON 请求体中：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"scraper_slug":"YOUR_SCRAPER_SLUG","version":"latest","input":{"parameters":{"custom":{"keywords":["coffee"]}}},"is_async":true,"page_index":1,"page_size":20}'
```

V2 需要先确认 Worker 标识并放入 URL，推荐使用 Bearer 认证，分页改为从 0 开始的 `offset` 和 `limit`：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/runs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"version":"latest","input":{"parameters":{"custom":{"keywords":["coffee"]}}},"is_async":true,"offset":0,"limit":20}'
```

响应仍通过 `data.run_slug` 返回运行标识。后续把这个值作为 V2 URL 中的 `{runId}`。

## 迁移步骤

### 1. 盘点 V1 调用

在现有集成中搜索 `/api/v1/`、`/api/scraper`、`/api/store`、`/api/proxy/region`、`api-key`、`scraper_slug`、`task_slug`、`run_slug`、`page_index`、`page_size` 以及对数字运行状态的判断。通过[接口对照表](/zh-cn/api/migration/endpoint-mapping/)为每个调用找到替代接口。

### 2. 确认 V2 标识符

- `{workerId}` 支持 Worker slug，也支持把 `owner/name` 路径编码成 `owner~name`。
- `{workerTaskId}` 是已保存的 Worker 任务标识。
- `{runId}` 是启动或重跑后响应中的 `data.run_slug`。

不要直接假设旧 `scraper_slug` 一定是有效的 `{workerId}`。上线前请通过[查询我的 Worker](/zh-cn/api/workers/list/)、[获取 Worker 详情](/zh-cn/api/workers/detail/)或[查询商店 Worker](/zh-cn/api/store/list/)进行验证。

### 3. 更新认证方式

把 V1 请求头：

```http
api-key: YOUR_API_KEY
```

改为推荐的 V2 请求头：

```http
Authorization: Bearer YOUR_API_KEY
```

V2 为服务端兼容保留了旧版 `api-key` 请求头，但新代码迁移到 Bearer 可以避免继续携带 V1 约定。无法设置请求头时也可以使用 query token，但应避免把含 token 的 URL 写入日志。

### 4. 把字段移入路径和 query

V1 几乎把所有参数都放在 JSON 请求体中。V2 改为：

- `workerId`、`workerTaskId` 和 `runId` 使用路径参数；
- 分页、筛选条件和导出选项使用 query 参数；
- 只有创建、更新、运行和重跑资源时才发送 JSON 请求体。

V1 分页按以下公式转换：

```text
offset = (page_index - 1) * page_size
limit  = page_size
```

V2 `offset` 从 `0` 开始，列表和结果接口的 `limit` 最大为 `100`。V1 运行接口的 `page_size` 最大可到 `1000`，因此较大页面必须改为多次分页或使用导出接口。

### 5. 更新运行状态判断

V1 返回数字状态，V2 返回字符串：

|  V1 | V2          | 含义             |
| --: | ----------- | ---------------- |
| `1` | `ready`     | 已接受，等待执行 |
| `2` | `running`   | 正在执行         |
| `3` | `succeeded` | 执行成功         |
| `4` | `failed`    | 执行失败         |
| `5` | `aborting`  | 正在中止         |

只把 `succeeded` 和 `failed` 视为已结束状态。当前公开契约提供的是 `aborting`，不要自行构造其他终态。

### 6. 更新响应和错误处理

大多数 V2 JSON 响应使用以下 envelope：

```json
{
    "code": 0,
    "message": "success",
    "request_id": "req-123",
    "data": {}
}
```

客户端必须同时检查 HTTP 状态和业务 `code`。请把 `request_id` 写入日志，便于支持团队追踪失败请求。参数校验失败可能返回 HTTP `422`，限流返回 `429`；对 `429` 使用退避重试。

部分 V2 运行响应为了向后兼容仍保留 `scraper_slug` 和 `scraper_title`。除非 V2 接口页明确给出替代字段，否则不要自行重命名响应字段。

### 7. 重新检查 Worker 输入

V2 运行请求的外层结构已经统一，但 `input.parameters.custom` 仍因 Worker 而异。切换流量前先调用[获取 Worker 输入 Schema](/zh-cn/api/workers/input-schema/)并校验生产请求体。直接运行 Worker 时，`version` 仍是可选字段。

### 8. 选择执行方式

- `is_async: true` 提交后立即返回。保存 `data.run_slug`，再退避轮询 `GET /api/v2/worker-runs/{runId}`。
- `is_async: false` 最多等待五分钟。运行时间更长时任务会继续在后台执行，此时使用 `{runId}` 继续轮询。
- `callback_url` 用于接收状态变化或完成通知，但运行详情和结果接口仍是权威数据源。

完整行为见[运行生命周期与状态](/zh-cn/api/run-lifecycle/)和[回调通知](/zh-cn/api/callbacks/)。

## 上线检查清单

- `/api/v1`、`/api/scraper`、`/api/store` 和 `/api/proxy/region` 下的全部旧版 URL 均已替换。
- 已在 V2 中验证 Worker 和任务标识符。
- 新代码使用 Bearer token 认证。
- 分页使用从 0 开始的 `offset`，且 `limit <= 100`。
- 数字状态判断已替换为 V2 字符串。
- 客户端同时检查 HTTP 状态和业务 `code`，并记录 `request_id`。
- 异步调用方会在轮询前持久化 `data.run_slug`。
- 结果下载使用导出接口，而不是请求超大分页。
- 回调处理器按 `run_slug` 保证幂等。
- 切换生产流量前，已用低成本 Worker 输入验证完整迁移流程。

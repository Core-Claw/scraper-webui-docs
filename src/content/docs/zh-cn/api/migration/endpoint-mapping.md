---
title: 'V1 与 V2 接口对照'
description: '完整的 CoreClaw API V1 接口映射和破坏性变更说明'
sidebar:
    order: 2
---

V1 时期的公开 API 文档共收录 13 个接口：10 个位于 `/api/v1` 下，另外 3 个公开接口没有版本前缀。下表已将全部 13 个旧接口映射到 V2。V2 对外共提供 39 个公开接口，其余 26 个属于没有旧版直接对应项的新增能力。V1 的一个请求体通常会拆分成 V2 路径、query 和更精简的 JSON 请求体。

## 完整接口对照

| V1 接口                          | V2 替代接口                                                                                                                                         | 必须修改的内容                                                                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /api/scraper`               | [`GET /api/v2/workers/{workerId}`](/zh-cn/api/workers/detail/) 和 [`GET /api/v2/workers/{workerId}/input-schema`](/zh-cn/api/workers/input-schema/) | 把 `slug` query 值移入 `{workerId}`，并将 `owner/name` 编码为 `owner~name`。Worker 详情接口现在需要认证；只需要输入契约时可调用公开的 input-schema 接口。          |
| `GET /api/store`                 | [`GET /api/v2/store`](/zh-cn/api/store/list/)                                                                                                       | 把 `search` 改为 `keyword`；分页时增加从 1 开始的 `offset`（页码）。`limit` 默认值改为 20，最大为 100。                                                                    |
| `GET /api/proxy/region`          | [`GET /api/v2/proxy/region`](/zh-cn/api/proxy/region/)                                                                                              | 在路径中增加 `/v2`；V2 还提供可选的 `language` query 参数。                                                                                                        |
| `POST /api/v1/run/result/list`   | [`GET /api/v2/worker-runs/{runId}/result`](/zh-cn/api/worker-runs/result/)                                                                          | 把 `run_slug` 移入 `{runId}`；把 `page_index`、`page_size` 转换为 query 中的 `offset`、`limit`。                                                                   |
| `POST /api/v1/run/detail`        | [`GET /api/v2/worker-runs/{runId}`](/zh-cn/api/worker-runs/detail/)                                                                                 | 把 `run_slug` 从请求体移入 `{runId}`，删除 JSON 请求体。                                                                                                           |
| `POST /api/v1/scraper/run`       | [`POST /api/v2/workers/{workerId}/runs`](/zh-cn/api/workers/run/)                                                                                   | 用已验证的 `{workerId}` 路径值替代 `scraper_slug`；`version`、`input`、`callback_url`、`is_async` 仍放在请求体中；`page_index`/`page_size` 改为 `offset`/`limit`。 |
| `POST /api/v1/rerun`             | [`POST /api/v2/worker-runs/{runId}/rerun`](/zh-cn/api/worker-runs/rerun/)                                                                           | 把 `run_slug` 移入 `{runId}`；`callback_url` 保留在请求体中；V2 还支持 `is_async`、`offset`、`limit`。                                                             |
| `POST /api/v1/run/result/export` | [`GET /api/v2/worker-runs/{runId}/result/export`](/zh-cn/api/worker-runs/export/)                                                                   | 把 `run_slug` 移入 `{runId}`；`format` 和逗号分隔的 `filter_keys` 改用 query；删除 JSON 请求体。                                                                   |
| `POST /api/v1/task/run`          | [`POST /api/v2/worker-tasks/{workerTaskId}/runs`](/zh-cn/api/worker-tasks/run/)                                                                     | 把 `task_slug` 移入 `{workerTaskId}`；`callback_url` 保留在请求体中；V2 还支持 `is_async`、`offset`、`limit`。                                                     |
| `POST /api/v1/run/list`          | [`GET /api/v2/worker-runs`](/zh-cn/api/worker-runs/list/)                                                                                           | 把筛选条件移入 query；`scraper_slug` 改为 `worker_id`；转换分页和数字状态；查询全部状态时省略 `status`。                                                           |
| `POST /api/v1/run/last/log`      | [`GET /api/v2/worker-runs/{runId}/log`](/zh-cn/api/worker-runs/log/)                                                                                | V1 路径虽然包含 `last`，实际仍由请求体中的 `run_slug` 选择运行；将它移入 `{runId}` 并删除请求体。                                                                  |
| `POST /api/v1/scraper/abort`     | [`POST /api/v2/worker-runs/{runId}/abort`](/zh-cn/api/worker-runs/abort/)                                                                           | 把 `run_slug` 移入 `{runId}`并删除请求体；V2 返回标准响应 envelope。                                                                                               |
| `POST /api/v1/account/info`      | [`GET /api/v2/users/account`](/zh-cn/api/account/get/)                                                                                              | 把 `POST` 改为 `GET`，删除空 JSON 请求体；账户响应字段发生变化，需要更新反序列化模型。                                                                             |

## 字段和行为变更

| 范围          | V1                                            | V2                                                               | 迁移动作                                                      |
| ------------- | --------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| 认证          | `api-key` 请求头                              | 推荐 Bearer；也支持旧版请求头和 query token                      | 发送 `Authorization: Bearer YOUR_API_KEY`。                   |
| 资源名称      | 请求概念使用 `scraper`                        | 路径和请求概念使用 `worker`                                      | 重命名客户端模型和变量，但保留文档中的 `scraper_*` 响应字段。 |
| 标识符        | 放在 JSON 请求体中                            | `workerId`、`workerTaskId`、`runId` 放在路径中                   | URL 编码路径值，并验证 V2 Worker 标识。                       |
| 分页          | `page_index` 从 1 开始，使用 `page_size`      | `offset` 为从 1 开始的页码，`limit` 最大 100                             | 使用 `offset = page_index`。                |
| 运行状态      | 整数 `1` 到 `5`；筛选时 `0` 表示全部          | 字符串 `ready`、`running`、`succeeded`、`failed`、`aborting`     | 替换数字判断；查询全部状态时不发送筛选值。                    |
| 导出字段      | JSON 数组 `filter_keys`                       | query 中逗号分隔的 `filter_keys`                                 | 用逗号连接字段名并进行 URL 编码。                             |
| 导出格式      | 文档列出 `csv`、`json`                        | 支持 `csv`、`json`、`jsonl`、`xlsx`、`xls`、`xml`、`html`、`rss` | 使用允许的小写值，不要沿用 V1 校验逻辑。                      |
| 响应 envelope | `code`、`message`、`data`                     | `code`、`message`、`request_id`，通常还有 `data`                 | 把 `request_id` 加入日志；允许文档指定的成功响应没有 `data`。 |
| 参数校验      | 主要记录 `400`、`401`、`429`                  | 还会使用 `404`、`422` 和统一错误 envelope                        | 同时根据 HTTP 状态和业务 `code` 分支处理。                    |
| 账户数据      | `balance`、`traffic`、`traffic_expiration_at` | 当前契约示例提供 `balance`、`balance_expiration_at`              | 不再要求已移除的流量字段，以账户接口 schema 为准。            |
| 运行日志      | V1 的日志列表项是结构化对象                   | 当前 V2 示例中的日志 `list` 是字符串数组                         | 按 V2 接口契约读取 `data.list`，不要复用 V1 日志项模型。      |

## 请求转换示例

### 查询结果

```json
// V1 请求体
{ "run_slug": "RUN_ID", "page_index": 3, "page_size": 20 }
```

```http
GET /api/v2/worker-runs/RUN_ID/result?offset=3&limit=20
```

### 筛选运行记录

```json
// V1 请求体：status 3 表示 succeeded
{ "page_index": 1, "page_size": 20, "status": 3, "scraper_slug": "WORKER_ID" }
```

```http
GET /api/v2/worker-runs?offset=1&limit=20&status=succeeded&worker_id=WORKER_ID
```

### 导出指定字段

```json
// V1 请求体
{ "run_slug": "RUN_ID", "format": "csv", "filter_keys": ["title", "address"] }
```

```http
GET /api/v2/worker-runs/RUN_ID/result/export?format=csv&filter_keys=title%2Caddress
```

## V2 新增能力

V2 还提供 Worker 发现和输入 schema、Worker 任务增删改查、账户级和 Worker 级最近运行快捷接口，以及独立的日志、结果、导出、中止和重跑接口。请查看[公开接口清单](/zh-cn/api/)，避免继续使用 V1 时代的变通实现。

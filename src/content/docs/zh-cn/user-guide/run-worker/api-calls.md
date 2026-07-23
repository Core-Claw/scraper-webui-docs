---
title: API 调用
description: 通过 CoreClaw API 编程运行 Worker 与 Task 模板
sidebar:
  order: 6
---

了解如何使用 CoreClaw API v2 以编程方式启动 Worker、运行 Task 模板，以及查询运行记录。

## 快速开始

### 身份验证

API v2 基础地址是：

```text
https://openapi.coreclaw.com
```

需要认证的接口支持 Bearer token、旧版 `api-key` 请求头和 query token。新集成建议优先使用 Bearer token：

```bash
curl -X GET "https://openapi.coreclaw.com/api/v2/users/account" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

从 [CoreClaw Console](https://console.coreclaw.com/settings/integrations) 获取您的 API Key。

完整端点说明请参考[基础地址与身份验证](/zh-cn/api/)。

## 标识符类型

| 标识符 | 标识对象 | 获取方式 | 典型用途 |
| ------ | -------- | -------- | -------- |
| `workerId` | 某个 Worker | 使用 Worker slug，或把 `coreclaw/google-maps-scraper` 这样的路径写成 `coreclaw~google-maps-scraper`。可以从商店搜索或我的 Worker 列表中获取。 | `/api/v2/workers/{workerId}`、`/api/v2/workers/{workerId}/runs` |
| `workerTaskId` | 已保存的 Task 模板 | 用户创建并保存 Task 模板时生成。 | `/api/v2/worker-tasks/{workerTaskId}/runs` |
| `runId` | 某一次具体运行记录 | 启动或重跑 Worker / Task 后，响应中的 `data.run_slug` 就是后续接口使用的 `runId`。 | `/api/v2/worker-runs/{runId}`、`/api/v2/worker-runs/{runId}/result`、`/api/v2/worker-runs/{runId}/result/export` |

不要混用这些标识符。把 `runId` 传到需要 `workerId` 或 `workerTaskId` 的位置，会触发请求参数校验错误。

## 启动 Worker 运行

```bash
POST /api/v2/workers/{workerId}/runs
```

**请求体：**

```json
{
  "input": {
    "parameters": {
      "custom": {
        "keywords": ["coffee"],
        "base_location": "New York,USA",
        "max_results": 1
      }
    }
  },
  "is_async": true,
  "callback_url": "https://your-callback.example.com/webhook"
}
```

`is_async` 控制运行模式：`true` 表示异步提交并立即返回；`false` 表示等待同步结果窗口。请求返回后，请同时保存 `data.run_slug`（即 `runId`）和 `request_id`，用于后续查询与排查。如需通过 Webhook 接收状态更新，请提供 `callback_url`。

`input` 的结构因 Worker 而异，不是旧版的 `custom_params` JSON 字符串字段。构造请求前请先读取 Worker 输入 schema：

- **API**：调用 [`GET /api/v2/workers/{workerId}/input-schema`](/zh-cn/api/workers/input-schema/)，根据返回的 schema 构造 `input`。
- **Console**：在 [CoreClaw Console](https://console.coreclaw.com) 中打开该 Worker，进入 **Input** 选项卡，点击右上角的 **API** 按钮，选择 **API clients** 即可查看可直接使用的代码片段。

![Worker Input 选项卡中的 API clients 按钮](@/assets/docs/74.png)

构造 `input` 时：

- 严格遵守该 Worker 的输入 schema。
- 除非该 Worker 的 schema 明确要求其他结构，否则将 Worker 表单字段放在 `input.parameters.custom` 下。
- 对于必填字段，必须显式提供。
- 同步结果分页场景下，`limit` 不要超过 `100`。
- 如果 `input` 缺失或结构不匹配，接口会返回参数校验错误。

### 如何获取 `version`

`version` 为可选字段。如不填写，平台将自动使用最新版本。如需指定版本，可使用控制台 Worker 页面显示的版本号，或从[运行详情](/zh-cn/api/worker-runs/detail/)返回中的 `version` 获取。

## 运行已保存的 Task 模板

```bash
POST /api/v2/worker-tasks/{workerTaskId}/runs
```

**请求体：**

```json
{
  "is_async": true,
  "callback_url": "https://your-callback.example.com/webhook"
}
```

Task 模板已经包含保存好的输入设置。如需 Webhook 推送结果，请提供 `callback_url`。响应中的 `data.run_slug` 就是后续接口使用的 `runId`。

## 查询一次运行

拿到返回的 `runId` 后，使用运行接口查询。应以 `data.status` 作为主要结果判断字段；`results`、时间戳和 `err_msg` 只是辅助诊断信息，不能替代状态判断。状态为 `ready` 或 `running` 时采用有上限的退避轮询；`succeeded` 时读取结果或导出；`failed` 时保存 `request_id` 并读取详情与日志；调用取消接口后，重新读取同一个明确的 `runId`，处理契约中定义的 `aborting`，不要自行构造 `aborted`。

支持的状态、真实响应形状、轮询顺序与取消注意事项，请参阅[运行生命周期与状态](/zh-cn/api/run-lifecycle/)。

拿到返回的 `runId` 后，可以继续调用以下接口：

- [运行详情](/zh-cn/api/worker-runs/detail/)：查看状态、Worker 与版本。
- [运行日志](/zh-cn/api/worker-runs/log/)：查看执行日志。
- [运行结果列表](/zh-cn/api/worker-runs/result/)：分页查看结果。
- [导出运行结果](/zh-cn/api/worker-runs/export/)：导出文件。

## 常见错误

- 继续使用旧 v1 路径，而不是 v2 资源化路径。
- 把 `system_params`、`custom_params` 当成字符串化 JSON 发送。
- 在需要 `workerId` 或 `workerTaskId` 的地方误传 `runId`。
- 遗漏该 Worker 必填的 `input` 字段。
- 明明已有明确 `runId`，却把 `last` 运行接口当成稳定引用。

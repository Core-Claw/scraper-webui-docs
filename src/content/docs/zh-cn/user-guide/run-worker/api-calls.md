---
title: API 调用
description: 通过 CoreClaw API 编程运行 Worker 与 Task 模板
sidebar:
  order: 5
---

了解如何使用 CoreClaw API 以编程方式启动 Worker、运行 Task 模板，以及查询运行记录。

## 快速开始

### 身份验证

所有 API 请求都必须在请求头中携带 API Key：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

从 [CoreClaw Console](https://console.coreclaw.com/settings/integrations) 获取您的 API Key。

完整端点说明请参考[基础地址与身份验证](/zh-cn/api/)。

## 三种 Slug 的区别

| Slug | 标识对象 | 获取方式 | 典型用途 |
| ---- | -------- | -------- | -------- |
| `scraper_slug` | 某个 Worker | 每个 Worker 都有自己的 `scraper_slug`。可以从 Worker 页面获取，或从[运行详情](/zh-cn/api/run/detail/)和[运行历史](/zh-cn/api/run/history/)返回的 `scraper_slug` 获取。同时支持 GitHub 路径格式（如 `coreclaw/google-maps-scraper`）和旧版 ID 格式（如 `01KPD6M5YQADCQKGVKPDZVYC63`）。 | `/api/v1/scraper/run`、`/api/v1/run/list` |
| `task_slug` | 已保存的 Task 模板 | 用户创建并保存 Task 模板时生成。 | `/api/v1/task/run` |
| `run_slug` | 某一次具体运行记录 | 启动 Worker 或 Task 后返回，也会出现在运行相关接口里。 | `/api/v1/run/detail`、`/api/v1/run/last/log`、`/api/v1/run/result/list`、`/api/v1/run/result/export`、`/api/v1/rerun`、`/api/v1/scraper/abort` |

不要混用这些标识符。把 `run_slug` 传到 `task_slug` 或 `scraper_slug` 字段中，会直接触发请求参数校验错误。

## 启动 Worker 运行

```bash
POST /api/v1/scraper/run
```

**请求体：**

```json
{
  "scraper_slug": "YOUR_SCRAPER_SLUG",
  "version": "<version>",
  "input": {
    "parameters": {
      "system": {
        "proxy_region": "CH",
        "cpus": 0.125,
        "memory": 512,
        "execute_limit_time_seconds": 1800,
        "max_total_charge": 0,
        "max_total_traffic": 0
      },
      "custom": {
        "startURLs": [
          {
            "url": "https://example.com"
          }
        ]
      }
    }
  },
  "is_async": true,
  "callback_url": "https://your-callback.example.com/webhook"
}
```

`is_async` 控制是否异步执行：`true`（默认）为异步，`false` 为同步等待结果。如需 Webhook 推送结果，请提供 `callback_url`。

`custom` 不是随意拼接的字符串，也不是旧版的 `custom_params` JSON 字符串字段。其结构因 Worker 而异，并非固定静态 schema。

要查看具体 Worker 的字段：

- **API**：调用 `GET /api/scraper?slug=<scraper_slug>`，从响应的 `data.parameters.custom` 获取。`properties[]` 中每一项对应 `input.parameters.custom` 的一个字段。
- **Console**：在 [CoreClaw Console](https://console.coreclaw.com) 中打开该 Worker，进入 **Input** 选项卡，点击右上角的 **API** 按钮，选择 **API clients** 即可查看可直接使用的代码片段。

![Worker Input 选项卡中的 API clients 按钮](@/assets/docs/74.png)

构造 `custom` 时：
- 使用 `properties[].name` 作为字段名
- 严格遵守声明的 `type`、嵌套结构与数组形状
- 对于 `required: true` 的字段，必须显式提供
- 如果 `custom` 为空，或结构不匹配，接口会返回 `400 Bad Request`

### 如何获取 `version`

可以从以下位置获得：

- Worker 页面显示的版本号
- [运行详情](/zh-cn/api/run/detail/)返回中的 `version`
- [运行历史](/zh-cn/api/run/history/)返回中的 `version`

## 运行已保存的 Task 模板

```bash
POST /api/v1/task/run
```

**请求体：**

```json
{
  "task_slug": "YOUR_TASK_SLUG",
  "callback_url": "https://your-callback.example.com/webhook"
}
```

`callback_url` 为必填项。缺失时，请求会返回 `400 Bad Request`。

## 查询一次运行

拿到返回的 `run_slug` 后，可以继续调用以下接口：

- [运行详情](/zh-cn/api/run/detail/)：查看状态、`scraper_slug` 与 `version`
- [运行日志](/zh-cn/api/run/log/)：查看执行日志
- [运行结果列表](/zh-cn/api/run/result/)：分页查看结果
- [导出运行结果](/zh-cn/api/run/export/)：导出文件

## 常见错误

- 继续使用旧路径 `/api/v1/runs` 或 `/api/v1/tasks/{task_slug}/run`
- 把 `system_params`、`custom_params` 当成字符串化 JSON 发送
- 在需要 `scraper_slug` 或 `task_slug` 的地方误传 `run_slug`
- 调用 `/api/v1/task/run` 时漏掉 `callback_url`
- 调用 `/api/v1/scraper/run` 时漏掉该 Worker 所需的 `custom` 字段

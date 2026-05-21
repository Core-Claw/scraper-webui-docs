---
title: 运行爬虫
description: 启动 Worker 运行
sidebar:
    order: 1
---

**方法：** `POST`

**端点：** `/api/v1/scraper/run`

使用 **Content-Type: application/json** 发送请求体。

## 什么时候使用这个接口

当您希望通过 `scraper_slug` 直接启动某个 Worker 时，使用这个接口。

## `scraper_slug` 从哪里来

`scraper_slug` 是 **Worker ID**——每个 Worker 的唯一标识符。每个 Worker 都有一个固定的 `scraper_slug`。

获取方式：
- 在 CoreClaw Console 的 Worker 详情页查看
- 从[运行详情](/zh-cn/api/run/detail/)或[运行历史](/zh-cn/api/run/history/)返回的 `scraper_slug` 字段获取

## 请求示例

```json
{
    "scraper_slug": "YOUR_SCRAPER_SLUG",
    "version": "YOUR_WORKER_VERSION",
    "input": {
        "parameters": {
            "system": {
                "cpus": 0.125,
                "memory": 512,
                "execute_limit_time_seconds": 1800,
                "max_total_charge": 0,
                "max_total_traffic": 0,
                "proxy_region": "CH"
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
    "callback_url": "https://your-callback.example.com/webhook",
    "is_async": true
}
```

### 参数

| 参数         | 必填 | 类型    | 说明 |
| ------------ | ---- | ------- | ---- |
| scraper_slug | 是   | string  | **Worker ID**——要运行的 Worker 的唯一标识符 |
| version      | 是   | string  | Worker 版本 |
| input        | 是   | object  | 输入参数 |
| is_async     | 是   | boolean | `true`：异步执行（默认），`false`：同步执行（等待完成） |
| callback_url | 否   | string  | 用于接收运行结果的回调地址 |

#### `system` 参数

| 参数                       | 示例  | 类型   | 必填 | 说明 |
| -------------------------- | ----- | ------ | ---- | ---- |
| proxy_region               | CH    | string | 是   | 执行节点（ISO 3166-1 alpha-2 国家代码）。常用：`US`、`CN`、`HK`、`JP`、`SG`、`DE`、`GB`、`FR`。完整支持列表请参考 Swagger 定义。 |
| cpus                       | 0.125 | number | 是   | 容器 CPU 核心数 |
| memory                     | 512   | integer | 是   | 容器内存大小（MB）。支持的值：`512`、`1024`、`2048`、`4096`、`8192`、`16384` |
| execute_limit_time_seconds | 1800  | integer | 是   | 容器执行超时（秒） |
| max_total_charge           | 0     | integer | 是   | 最大费用（美元） |
| max_total_traffic          | 0     | integer | 是   | 最大流量（MB） |

#### `custom` 参数

`input.parameters.custom` 不是固定结构——每个 Worker 各不相同。以下两种方式可查看具体字段：

- **API**：调用 `GET /api/scraper?slug=<scraper_slug>`，从响应的 `data.parameters.custom` 获取。`properties[]` 中每一项对应 `input.parameters.custom` 的一个字段。
- **Console**：在 [CoreClaw Console](https://console.coreclaw.com) 中打开该 Worker，进入 **Input** 选项卡，点击右上角的 **API** 按钮，选择 **API clients** 即可查看可直接使用的代码片段。

![Worker Input 选项卡中的 API clients 按钮](@/assets/docs/74.png)

构造 `custom` 时：
- 使用 `properties[].name` 作为字段名
- 严格匹配声明的 `type`、嵌套结构和数组形状
- 对于 `required: true` 的字段，必须显式提供
- 如果 `custom` 为空，或结构不匹配，接口会返回 `400 Bad Request`

### 如何获取 `version`

可以从以下位置获得 Worker 版本：

- Worker 页面
- [运行详情](/zh-cn/api/run/detail/)返回中的 `version`
- [运行历史](/zh-cn/api/run/history/)返回中的 `version`

## 校验行为

- `callback_url` 在此端点可选。在 [`/api/v1/task/run`](/zh-cn/api/task/run/) 和 [`/api/v1/rerun`](/zh-cn/api/run/rerun/) 中**必填**。
- 请勿将 `run_slug`（运行记录 ID）或 `task_slug`（任务 ID）传入 `scraper_slug` 字段——每种 slug 类型不同，不可互换。
- 如果只提供通用 `system` 参数，但缺少该 Worker 描述符要求的 `custom` 字段，请求仍会失败。

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
    }
}
```

#### 响应字段

| 参数     | 示例                       | 类型    | 说明           |
| -------- | -------------------------- | ------- | -------------- |
| code     | 0                          | Integer | 全局状态码     |
| message  | success                    | String  | 响应消息       |
| data     | -                          | Object  | 响应数据       |
| run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | **运行记录 ID**——本次执行的唯一标识符 |
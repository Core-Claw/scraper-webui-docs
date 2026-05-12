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

每个 Worker 都有自己的 `scraper_slug`。您可以从 Worker 页面获取，也可以从[运行详情](/zh-cn/api/run/detail/)和[运行历史](/zh-cn/api/run/history/)返回的 `scraper_slug` 字段获取。

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
    "is_async": true,
    "page_index": 1,
    "page_size": 10
}
```

### 参数

| 参数         | 必填 | 类型    | 说明 |
| ------------ | ---- | ------- | ---- |
| scraper_slug | 是   | string  | Worker 唯一标识符 |
| version      | 是   | string  | Worker 版本 |
| input        | 是   | object  | 输入参数 |
| is_async     | 是   | boolean | `true`：异步执行（默认），`false`：同步执行（等待完成） |
| page_index   | 是   | number  | 结果页码，默认 `1` |
| page_size    | 是   | number  | 每页条数，默认 `10`，最大 `1000` |
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

`input.parameters.custom` 必须根据该 Worker 的 `input_schema.json` 构造。

- 使用 `properties[].name` 作为 `custom` 中的字段名
- 严格匹配 schema 声明的 `type`、嵌套结构和数组形状
- 对于 schema 中 `required: true` 的字段，必须显式提供
- 如果 `custom` 为空，或结构与 Worker schema 不匹配，接口会返回 `400 Bad Request`

schema 格式请参考[Worker 输入配置](/zh-cn/developer-guide/worker-definition/input-schema/)。

### 如何获取 `version`

可以从以下位置获得 Worker 版本：

- Worker 页面
- [运行详情](/zh-cn/api/run/detail/)返回中的 `version`
- [运行历史](/zh-cn/api/run/history/)返回中的 `version`

## 校验行为

- 当您需要异步接收结果时，应提供 `callback_url`。
- 如果把 `run_slug` 或 `task_slug` 误传到 `scraper_slug` 字段，请求会在参数校验阶段失败。
- 如果只提供通用 `system` 参数，但缺少该 Worker schema 要求的 `custom` 字段，请求仍会失败。

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
| run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 运行唯一标识符 |
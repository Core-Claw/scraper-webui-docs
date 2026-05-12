---
title: 获取 Worker 详情
description: 获取 Worker 的详细信息，包括参数结构、说明文档和最新版本。
sidebar:
    order: 3
---

**方法：** `GET`

**端点：** `/api/scraper`

使用查询参数发送请求。无需身份验证。

## 请求示例

```bash
curl "https://openapi.coreclaw.com/api/scraper?slug=01KJXYJ7KCHXM0PDZHQD5293XE"
```

#### 参数说明

| 参数 | 示例                          | 类型   | 必填 | 说明              |
| ---- | ----------------------------- | ------ | ---- | ----------------- |
| slug | 01KJXYJ7KCHXM0PDZHQD5293XE   | String | 是   | Worker 唯一标识符（即 `scraper_slug`） |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "parameters": {
            "system": {
                "cpus": 0.125,
                "memory_bytes": 512,
                "max_total_charge": 0,
                "max_total_traffic": 0,
                "execute_limit_time_seconds": 1800
            },
            "custom": {
                "properties": [
                    {
                        "name": "startURLs",
                        "type": "array",
                        "title": "起始 URL",
                        "editor": "json",
                        "default": [
                            { "url": "https://example.com" }
                        ],
                        "required": true,
                        "description": "需要采集的起始 URL 列表"
                    }
                ]
            }
        },
        "readme": "# Worker 说明\n\n这里是 Worker 的描述信息。",
        "version": "v1.0.1"
    }
}
```

#### 响应字段

| 参数    | 示例    | 类型    | 说明       |
| ------- | ------- | ------- | ---------- |
| code    | 0       | Integer | 全局状态码 |
| message | success | String  | 响应消息   |
| data    | -       | Object  | 响应数据   |

##### `data` 字段

| 参数       | 示例   | 类型   | 说明       |
| ---------- | ------ | ------ | ---------- |
| parameters | -      | Object | Worker 参数结构 |
| readme     | -      | String | Worker 说明文档（Markdown） |
| version    | v1.0.1 | String | 最新版本号 |

##### `parameters.system` 字段

> **注意：** 此端点返回 `memory_bytes`，而[运行 Worker](/zh-cn/api/worker/run/) 的请求参数使用 `memory`。两者表示同一个值，单位均为 MB。

| 参数                       | 示例  | 类型    | 说明 |
| -------------------------- | ----- | ------- | ---- |
| cpus                       | 0.125 | number  | 设备 CPU 核心数 |
| memory_bytes               | 512   | Integer | 设备内存（MB） |
| max_total_charge           | 0     | Integer | 最大执行费用（美元） |
| max_total_traffic          | 0     | Integer | 最大执行流量（MB） |
| execute_limit_time_seconds | 1800  | Integer | 执行超时（秒） |

##### `parameters.custom` 字段

`custom` 对象的结构因 Worker 而异。通过此接口可以了解某个 Worker 需要哪些输入字段。

| 参数       | 示例 | 类型  | 说明 |
| ---------- | ---- | ----- | ---- |
| properties | -    | Array | 自定义参数定义数组 |

每个 `properties` 元素：

| 参数        | 示例                               | 类型    | 说明 |
| ----------- | ---------------------------------- | ------- | ---- |
| name        | startURLs                          | String  | 参数名 |
| type        | array                              | String  | 参数类型 |
| title       | 起始 URL                           | String  | 显示标题 |
| editor      | json                               | String  | 编辑器类型 |
| default     | [{"url": "https://example.com"}]   | Array   | 默认值 |
| required    | true                               | Boolean | 是否必填 |
| description | 需要采集的起始 URL 列表            | String  | 参数描述 |

## 错误响应

```json
{
    "code": 50001,
    "message": "脚本不存在",
    "data": null
}
```
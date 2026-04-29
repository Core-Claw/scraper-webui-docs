---
title: 运行爬虫
description: 启动 Worker 运行
sidebar:
    order: 1
---

**方法：** `POST`

**端点：** `/api/v1/runs`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "scraper_slug": "01KGYERXPXTABWXMGQKFCE43M2",
    "version": "v1.0.1",
    "system_params": "{\"cpus\":0.125,\"memory\":512,\"execute_limit_time_seconds\":1800,\"max_total_charge\":0,\"max_total_traffic\":0,\"proxy_region\":\"CH\"}",
    "custom_params": "{\"startURLs\":[{\"url\":\"https://www.amazon.com/sp?ie=UTF8&seller=ADZ7LD48GVFQJ&asin=B07H56J7K1&ref_=dp_merchant_link&isAmazonFulfilled=1\"}],\"proxy_region\":\"BQ\"}"
}
```

### 参数

| 参数          | 必填 | 类型   | 说明                                              |
| ------------- | ---- | ------ | ------------------------------------------------- |
| scraper_slug  | 是   | string | Worker 唯一标识符                                 |
| version       | 是   | string | Worker 版本                                       |
| system_params | 否   | string | 系统参数 JSON 字符串。[详见下方](#system-parameters) |
| custom_params | 否   | string | 自定义参数 JSON 字符串。[详见下方](#custom-parameters) |

#### System Parameters

`system_params` 字段接受一个 **JSON 字符串**，包含以下键：

| 键                         | 示例  | 类型   | 必填 | 说明                 |
| -------------------------- | ----- | ------ | ---- | -------------------- |
| proxy_region               | CH    | string | 否   | 执行节点。[查看帮助](/zh-cn/developer-guide/worker-definition/platform-features/proxy-support/) |
| cpus                       | 0.125 | number | 否   | 运行环境 CPU 核心数      |
| memory                     | 512   | number | 否   | 运行环境内存大小（MB）   |
| execute_limit_time_seconds | 1800  | number | 否   | 执行超时（秒）           |
| max_total_charge           | 0     | number | 否   | 最大费用（美元）     |
| max_total_traffic          | 0     | number | 否   | 最大流量（MB）       |

#### Custom Parameters

`custom_params` 字段接受一个 **JSON 字符串**，包含 Worker 的 Input Schema 定义的自定义输入值。根据您运行的 Worker 参数定义填写这些值。

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

| 参数      | 示例                       | 类型    | 说明           |
| --------- | -------------------------- | ------- | -------------- |
| code      | 0                          | Integer | 全局状态码     |
| message   | success                    | String  | 响应消息       |
| data      | -                          | Object  | 响应数据       |
| run_slug  | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 运行唯一标识符 |

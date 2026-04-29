---
title: 爬虫详情
description: 获取指定 Worker 的详细信息
sidebar:
    order: 2
---

**方法：** `GET`

**端点：** `/api/v1/marketplace/scrapers/{scraper_slug}`

## 路径参数

| 参数          | 必填 | 说明             |
| ------------- | ---- | ---------------- |
| scraper_slug  | 是   | Worker 唯一标识符 |

## 请求示例

```bash
curl -X GET "https://openapi.coreclaw.com/api/v1/marketplace/scrapers/01KPD71518ZGX9TS37Y0XWT7ZQ" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json"
```

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "slug": "01KPD71518ZGX9TS37Y0XWT7ZQ",
        "title": "TikTok Profiles By URL",
        "version": "v1.0.1",
        "system_params": {
            "cpus": 0.125,
            "memory": 512,
            "execute_limit_time_seconds": 1800,
            "max_total_charge": 0,
            "max_total_traffic": 0
        },
        "custom_params_schema": {
            "url": "array"
        },
        "readme": "Extract TikTok user profile data by URL."
    }
}
```

#### 响应字段

| 参数                 | 示例                        | 类型    | 说明                                              |
| -------------------- | --------------------------- | ------- | ------------------------------------------------- |
| code                 | 0                           | Integer | 全局状态码                                        |
| message              | success                     | String  | 响应消息                                          |
| data                 | -                           | Object  | 响应数据                                          |
| slug                 | 01KPD71518ZGX9TS37Y0XWT7ZQ | String  | Worker 唯一标识符                                 |
| title                | TikTok Profiles By URL      | String  | Worker 标题                                       |
| version              | v1.0.1                      | String  | 最新 Worker 版本（运行爬虫时必填）                 |
| system_params        | -                           | Object  | 默认系统资源配置                                   |
| custom_params_schema | -                           | Object  | 自定义参数结构定义                                 |
| readme               | -                           | String  | Worker 文档                                       |

##### `system_params` 字段

| 键                         | 默认值 | 类型   | 说明                           |
| -------------------------- | ------ | ------ | ------------------------------ |
| cpus                       | 0.125  | number | 运行环境 CPU 核心数          |
| memory                     | 512    | number | 运行环境内存大小（MB）       |
| execute_limit_time_seconds | 1800   | number | 执行超时（秒）               |
| max_total_charge           | 0      | number | 最大费用（美元，0=不限制）     |
| max_total_traffic          | 0      | number | 最大流量（MB，0=不限制）       |

:::note
`custom_params_schema` 定义了 Worker 所需的输入参数。使用此信息构造调用[运行爬虫](/zh-cn/api/worker/run/)时的 `custom_params` JSON 字符串。
:::

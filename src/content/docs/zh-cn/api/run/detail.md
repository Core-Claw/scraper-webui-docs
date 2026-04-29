---
title: 运行详情
description: 获取 Worker 运行详情
sidebar:
    order: 2
---

**方法：** `GET`

**端点：** `/api/v1/runs/{run_slug}/status`

## 路径参数

| 参数      | 必填 | 说明           |
| --------- | ---- | -------------- |
| run_slug  | 是   | 运行唯一标识符 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "status": 2,
        "err_msg": "",
        "slug": "01KKJYJ4HH0R9K7XD856MAE1WH",
        "actors_title": "新闻采集 20260305",
        "actors_slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
        "result_count": 4,
        "cost": "0.0217",
        "started_at": 1773383784,
        "finished_at": 0,
        "duration_seconds": 0,
        "origin": "api",
        "traffic": 0,
        "version": "v1.0.1"
    }
}
```

#### 响应字段

| 参数             | 示例                       | 类型    | 说明                                                     |
| ---------------- | -------------------------- | ------- | -------------------------------------------------------- |
| code             | 0                          | Integer | 全局状态码                                               |
| message          | success                    | String  | 响应消息                                                 |
| data             | -                          | Object  | 响应数据                                                 |
| status           | 3                          | Integer | 运行状态：1 就绪，2 运行中，3 成功，4 失败，5 终止中      |
| err_msg          | -                          | String  | 错误消息                                                 |
| slug             | 01KKJYJ4HH0R9K7XD856MAE1WH | String  | 运行唯一标识符                                           |
| actors_title     | 新闻采集 20260305          | String  | Worker 标题                                              |
| actors_slug      | 01KJXYJ7KCHXM0PDZHQD5293XE | String  | Worker 唯一标识符                                        |
| result_count     | 4                          | Integer | 采集结果数量                                             |
| cost             | 0.0217                     | String  | 设备使用费用（美元）                                     |
| started_at       | 1773383784                 | Integer | 开始时间戳                                               |
| finished_at      | 0                          | Integer | 结束时间戳                                               |
| duration_seconds | 0                          | Integer | 执行时长（秒）                                           |
| origin           | api                        | String  | 运行来源：`api` 或 `web`                                 |
| traffic          | 0                          | Integer | 流量使用（字节）                                         |
| version          | v1.0.1                     | String  | Worker 版本                                              |

## 错误响应

```json
{
    "code": 4000,
    "message": "请求参数无效",
    "data": null
}
```

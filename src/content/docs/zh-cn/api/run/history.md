---
title: 运行历史
description: 获取 Worker 运行历史
sidebar:
    order: 1
---

**方法：** `POST`

**端点：** `/api/v1/run/list`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "page_index": 1,
    "page_size": 20,
    "status": 0,
    "scraper_slug": "YOUR_SCRAPER_SLUG"
}
```

#### 参数说明

| 参数         | 默认值 | 类型    | 必填 | 说明 |
| ------------ | ------ | ------- | ---- | ---- |
| page_index   | 1      | Integer | 是   | 当前页码 |
| page_size    | 20     | Integer | 是   | 每页条数 |
| status       | 0      | Integer | 是   | 运行状态：0 全部，1 就绪，2 运行中，3 成功，4 失败，5 已终止 |
| scraper_slug | -      | String  | 是   | Worker 唯一标识符 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "count": 106,
        "list": [
            {
                "status": 3,
                "err_msg": "",
                "slug": "01KKGKQ89XN5HYD7JYKCC9C32H",
                "scraper_title": "新闻采集 20260305",
                "scraper_slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
                "results": 4,
                "usage": "0.065",
                "started_at": 1773305309,
                "finished_at": 1773305316,
                "duration": 7,
                "origin": "api",
                "traffic": 23108,
                "version": "v1.0.1"
            }
        ]
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

| 参数          | 示例                       | 类型    | 说明 |
| ------------- | -------------------------- | ------- | ---- |
| count         | 106                        | Integer | 总记录数 |
| list          | -                          | Array   | 运行记录列表 |
| status        | 3                          | Integer | 运行状态：1 就绪，2 运行中，3 成功，4 失败，5 已终止 |
| slug          | 01KKGKQ89XN5HYD7JYKCC9C32H | String  | 运行记录唯一标识符 |
| scraper_title | 新闻采集 20260305          | String  | Worker 标题 |
| scraper_slug  | 01KJXYJ7KCHXM0PDZHQD5293XE | String  | Worker 唯一标识符 |
| results       | 4                          | Integer | 采集结果数量 |
| usage         | 0.065                      | String  | 设备使用费用（美元） |
| started_at    | 1773305309                 | Integer | 开始时间戳 |
| finished_at   | 1773305316                 | Integer | 结束时间戳 |
| duration      | 7                          | Integer | 执行时长（秒） |
| origin        | api                        | String  | 运行来源：`api` 或 `web` |
| traffic       | 23108                      | Integer | 流量使用（字节） |
| version       | v1.0.1                     | String  | Worker 版本 |

## 错误响应

```json
{
    "code": 4000,
    "message": "请求参数无效",
    "data": null
}
```

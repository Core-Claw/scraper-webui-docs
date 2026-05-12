---
title: 搜索 Worker
description: 在 CoreClaw 商店中搜索可用的 Worker。
sidebar:
    order: 4
---

**方法：** `GET`

**端点：** `/api/store`

使用查询参数发送请求。无需身份验证。

> `search` 参数不能为空。空搜索会返回错误。

## 请求示例

```bash
curl "https://openapi.coreclaw.com/api/store?search=news&limit=10"
```

#### 参数说明

| 参数   | 示例  | 类型    | 必填 | 说明         |
| ------ | ----- | ------- | ---- | ------------ |
| search | news  | String  | 是   | 搜索关键词（不可为空） |
| limit  | 10    | Integer | 是   | 最大返回条数 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "scraper": [
            {
                "slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
                "title": "新闻采集 20260305",
                "description": "采集各大新闻网站的新闻文章"
            }
        ]
    }
}
```

> 响应中的数组键名是 `scraper`（API 字段名），但每个条目表示一个 Worker。

#### 响应字段

| 参数    | 示例    | 类型    | 说明       |
| ------- | ------- | ------- | ---------- |
| code    | 0       | Integer | 全局状态码 |
| message | success | String  | 响应消息   |
| data    | -       | Object  | 响应数据   |

##### `data` 字段

| 参数   | 示例 | 类型  | 说明     |
| ------ | ---- | ----- | -------- |
| scraper | -   | Array | Worker 列表 |

##### `scraper[]` 字段

| 参数        | 示例                          | 类型   | 说明              |
| ----------- | ----------------------------- | ------ | ----------------- |
| slug        | 01KJXYJ7KCHXM0PDZHQD5293XE   | String | Worker 唯一标识符（即 `scraper_slug`） |
| title       | 新闻采集 20260305             | String | Worker 标题 |
| description | 采集各大新闻网站的新闻文章    | String | Worker 描述 |
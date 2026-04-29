---
title: 搜索爬虫
description: 在 CoreClaw 市场中搜索可用的 Worker
sidebar:
    order: 1
---

**方法：** `GET`

**端点：** `/api/v1/marketplace/scrapers/search`

## 查询参数

| 参数  | 默认值 | 类型    | 必填 | 说明                           |
| ----- | ------ | ------- | ---- | ------------------------------ |
| query | -      | String  | 否   | 搜索关键词（空字符串返回全部） |
| limit | 10     | Integer | 否   | 返回结果最大数量               |

## 请求示例

```bash
curl -X GET "https://openapi.coreclaw.com/api/v1/marketplace/scrapers/search?query=tiktok&limit=5" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json"
```

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "scrapers": [
            {
                "slug": "01KPD71518ZGX9TS37Y0XWT7ZQ",
                "title": "TikTok Profiles By URL",
                "description": "Extract TikTok user profile data",
                "tags": ["tiktok", "social-media"]
            }
        ]
    }
}
```

#### 响应字段

| 参数        | 示例                        | 类型    | 说明                 |
| ----------- | --------------------------- | ------- | -------------------- |
| code        | 0                           | Integer | 全局状态码           |
| message     | success                     | String  | 响应消息             |
| data        | -                           | Object  | 响应数据             |
| scrapers    | -                           | Array   | 匹配的 Worker 列表   |
| slug        | 01KPD71518ZGX9TS37Y0XWT7ZQ | String  | Worker 唯一标识符    |
| title       | TikTok Profiles By URL      | String  | Worker 标题          |
| description | Extract TikTok profile data | String  | Worker 描述          |
| tags        | ["tiktok", "social-media"]  | Array   | Worker 标签          |

:::note
搜索目前仅支持单关键词匹配。建议使用英文关键词以获得最佳搜索结果。
:::

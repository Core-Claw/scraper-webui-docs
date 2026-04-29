---
title: 运行结果
description: 获取 Worker 运行结果
sidebar:
    order: 3
---

**方法：** `GET`

**端点：** `/api/v1/runs/{run_slug}/results`

## 路径参数

| 参数      | 必填 | 说明           |
| --------- | ---- | -------------- |
| run_slug  | 是   | 运行唯一标识符 |

## 查询参数

| 参数      | 默认值 | 类型    | 必填 | 说明       |
| --------- | ------ | ------- | ---- | ---------- |
| page      | 1      | Integer | 否   | 当前页码   |
| page_size | 20     | Integer | 否   | 每页条数   |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "total": 4,
        "columns": [
            {
                "label": "title",
                "key": "title",
                "format": "text"
            },
            {
                "label": "publish_time",
                "key": "publish_time",
                "format": "text"
            }
        ],
        "records": [
            {
                "title": "示例文章标题",
                "publish_time": "2026-01-19"
            }
        ]
    }
}
```

#### 响应字段

| 参数    | 示例    | 类型    | 说明           |
| ------- | ------- | ------- | -------------- |
| code    | 0       | Integer | 全局状态码     |
| message | success | String  | 响应消息       |
| data    | -       | Object  | 响应数据       |
| total   | 4       | Integer | 总记录数       |
| columns | -       | Array   | 结果表列定义   |
| records | -       | Array   | 结果记录列表   |

##### `columns` 字段

| 参数   | 示例 | 类型   | 说明     |
| ------ | ---- | ------ | -------- |
| label  | -    | String | 显示标签 |
| key    | -    | String | 字段键   |
| format | -    | String | 字段格式 |

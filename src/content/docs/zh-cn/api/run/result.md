---
title: 运行结果
description: 获取 Worker 运行结果
sidebar:
    order: 3
---

**方法：** `POST`

**端点：** `/api/v1/run/result/list`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "page": 1,
    "page_size": 20,
    "run_slug": "YOUR_RUN_SLUG"
}
```

#### 参数说明

| 参数      | 示例值        | 类型    | 必填 | 说明           |
| --------- | ------------- | ------- | ---- | -------------- |
| page      | 1             | Integer | 是   | 当前页码       |
| page_size | 20            | Integer | 是   | 每页条数       |
| run_slug  | YOUR_RUN_SLUG | String  | 是   | 运行唯一标识符 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "count": 4,
        "headers": [
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
        "list": [
            {
                "title": "示例文章标题",
                "publish_time": "2026-01-19"
            }
        ]
    }
}
```

#### 响应字段

| 参数    | 示例    | 类型    | 说明 |
| ------- | ------- | ------- | ---- |
| code    | 0       | Integer | 全局状态码 |
| message | success | String  | 响应消息 |
| data    | -       | Object  | 响应数据 |
| count   | 4       | Integer | 总记录数 |
| headers | -       | Array   | 结果表头 |
| list    | -       | Array   | 结果记录列表 |

##### `headers` 字段

| 参数   | 示例 | 类型   | 说明 |
| ------ | ---- | ------ | ---- |
| label  | -    | String | 显示标签 |
| key    | -    | String | 字段键 |
| format | -    | String | 字段格式 |
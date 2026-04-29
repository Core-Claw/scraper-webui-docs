---
title: 中止爬虫
description: 中止正在运行的 Worker 任务
sidebar:
    order: 2
---

**方法：** `POST`

**端点：** `/api/v1/runs/{run_slug}/abort`

使用 **Content-Type: application/json** 发送请求体。

## 路径参数

| 参数      | 必填 | 说明           |
| --------- | ---- | -------------- |
| run_slug  | 是   | 运行唯一标识符 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": null
}
```

#### 响应字段

| 参数    | 示例    | 类型    | 说明         |
| ------- | ------- | ------- | ------------ |
| code    | 0       | Integer | 全局状态码   |
| message | success | String  | 响应消息     |
| data    | null    | Null    | 空数据       |

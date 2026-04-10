---
title: 终止 Worker
description: 终止正在运行的 Worker 任务
sidebar:
    order: 5
---

**请求方式：** `POST`

**请求地址：** `/api/v1/scraper/abort`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "run_slug": "01KJYA4S1QQ1PMDVVRP7XH72C51"
}
```

#### 参数说明

| 参数     | 必须 | 说明           |
| -------- | ---- | -------------- |
| run_slug | 是   | run 唯一标识符 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": null
}
```

#### 参数说明

| 参数    | 示例值  | 类型    | 描述                                    |
| ------- | ------- | ------- | --------------------------------------- |
| code    | 0       | Integer | [查看帮助](/zh-cn/api/base/#全局状态码) |
| message | success | String  | -                                       |
| data    | null    | Null    | -                                       |

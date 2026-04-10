---
title: 重新运行
description: 重新运行Run。
sidebar:
    order: 6
---

**请求方式：** `POST`

**请求地址：** `/api/v1/rerun`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "run_slug": "01KJYCSVTDCM7078HNB4Z5RJE2",
    "callback_url": "https://your-domain.com/callback"
}
```

#### 参数说明

| 参数         | 必须 | 说明           |
| ------------ | ---- | -------------- |
| run_slug     | 是   | run 唯一标识符 |
| callback_url | 否   | 回调 URL       |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": null
}
```

#### 参数说明

| 参数    | 示例值  | 类型    | 说明                                    |
| ------- | ------- | ------- | --------------------------------------- |
| code    | 0       | Integer | [查看帮助](/zh-cn/api/base/#全局状态码) |
| message | success | String  | -                                       |
| data    | null    | Null    | -                                       |

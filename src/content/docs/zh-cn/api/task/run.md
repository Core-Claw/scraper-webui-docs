---
title: 运行 Task
description: 运行指定的 Task
sidebar:
    order: 9
---

**请求方式：** `POST`

**请求地址：** `/api/v1/task/run`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "task_slug": "01KK0G4W9W4JYTWEA55KMG5QKP",
    "callback_url": "https://your-domain.com/callback"
}
```

#### 参数说明

| 参数           | 示例值                             | 类型   | 必填 | 描述                         |
| -------------- | ---------------------------------- | ------ | ---- | ---------------------------- |
| `task_slug`    | `01KK0DS99CJG4ZEC11VDXZ8Y2Q`       | String | 是   | 任务唯一标识                 |
| `callback_url` | `https://your-domain.com/callback` | String | 是   | 回调 URL(接收Task结果的地址) |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
    }
}
```

#### 参数说明

| 参数        | 示例值                     | 类型    | 描述                                    |
| ----------- | -------------------------- | ------- | --------------------------------------- |
| code        | 0                          | Integer | [查看帮助](/zh-cn/api/basic/base/#全局状态码) |
| message     | success                    | String  | -                                       |
| data        | -                          | Object  | -                                       |
| └─ run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 运行的唯一标识                          |

## 错误响应

```json
{
    "code": 70001,
    "message": "Run record does not exist",
    "data": null
}
```

#### 参数说明

| 参数名  | 示例值                    | 类型    | 描述                                    |
| ------- | ------------------------- | ------- | --------------------------------------- |
| code    | 70001                     | Integer | [查看帮助](/zh-cn/api/basic/base/#全局状态码) |
| message | Run record does not exist | String  | 错误描述                                |
| data    | null                      | Null    | -                                       |

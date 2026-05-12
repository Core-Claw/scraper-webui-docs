---
title: 重新运行
description: 重新运行 Worker 任务
sidebar:
    order: 6
---

**方法：** `POST`

**端点：** `/api/v1/rerun`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "run_slug": "YOUR_RUN_SLUG",
    "callback_url": "https://your-callback.example.com/webhook"
}
```

#### 参数说明

| 参数         | 必填 | 说明 |
| ------------ | ---- | ---- |
| run_slug     | 是   | 运行唯一标识符 |
| callback_url | 是   | 回调地址 |

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

#### 响应字段

| 参数     | 示例                       | 类型    | 说明 |
| -------- | -------------------------- | ------- | ---- |
| code     | 0                          | Integer | 全局状态码 |
| message  | success                    | String  | 响应消息 |
| data     | -                          | Object  | 响应数据 |
| run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 运行唯一标识符 |
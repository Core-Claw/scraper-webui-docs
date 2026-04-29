---
title: 运行任务
description: 启动任务
sidebar:
    order: 1
---

**方法：** `POST`

**端点：** `/api/v1/tasks/{task_slug}/run`

使用 **Content-Type: application/json** 发送请求体。

## 路径参数

| 参数       | 必填 | 说明           |
| ---------- | ---- | -------------- |
| task_slug  | 是   | 任务唯一标识符 |

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

| 参数     | 示例                       | 类型    | 说明           |
| -------- | -------------------------- | ------- | -------------- |
| code     | 0                          | Integer | 全局状态码     |
| message  | success                    | String  | 响应消息       |
| data     | -                          | Object  | 响应数据       |
| run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 运行唯一标识符 |

## 错误响应

```json
{
    "code": 70001,
    "message": "运行记录不存在",
    "data": null
}
```

#### 错误字段

| 参数    | 示例             | 类型    | 说明       |
| ------- | ---------------- | ------- | ---------- |
| code    | 70001            | Integer | 错误码     |
| message | 运行记录不存在   | String  | 错误描述   |
| data    | null             | Null    | 空数据     |

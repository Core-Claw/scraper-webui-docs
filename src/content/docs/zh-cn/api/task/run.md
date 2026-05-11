---
title: 启动已保存的 Task 模板
description: 启动已保存的 Task 模板
sidebar:
    order: 1
---

**方法：** `POST`

**端点：** `/api/v1/task/run`

使用 **Content-Type: application/json** 发送请求体。

## 什么时候使用这个接口

当您已经有一个已保存的 Task 模板，并且希望基于该模板创建一次新的运行时，使用这个接口。

## `task_slug` 从哪里来

`task_slug` 会在用户创建并保存 Task 模板时生成。这里不要传 `run_slug` 或 `scraper_slug`。

## 请求示例

```json
{
    "task_slug": "YOUR_TASK_SLUG",
    "callback_url": "https://your-callback.example.com/webhook"
}
```

#### 参数说明

| 参数         | 示例值                                    | 类型   | 必填 | 说明 |
| ------------ | ----------------------------------------- | ------ | ---- | ---- |
| task_slug    | YOUR_TASK_SLUG                            | String | 是   | Task 模板唯一标识符 |
| callback_url | https://your-callback.example.com/webhook | String | 是   | 用于接收 Task 运行结果的回调地址 |

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

| 参数     | 示例值                     | 类型    | 说明 |
| -------- | -------------------------- | ------- | ---- |
| code     | 0                          | Integer | 全局状态码 |
| message  | success                    | String  | 响应消息 |
| data     | -                          | Object  | 响应数据 |
| run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 运行唯一标识符 |

## 校验行为

- `callback_url` 为必填项。缺失时会返回 `400 Bad Request`。
- 如果把 `run_slug` 或 `scraper_slug` 误传到 `task_slug` 字段，请求会在参数校验阶段失败。

## 错误响应

业务层错误可能返回如下结构化 JSON：

```json
{
    "code": 60001,
    "message": "任务不存在",
    "data": null
}
```

#### 错误字段

| 参数    | 示例值     | 类型    | 说明 |
| ------- | ---------- | ------- | ---- |
| code    | 60001      | Integer | 错误码 |
| message | 任务不存在 | String  | 错误描述 |
| data    | null       | Null    | 空数据 |
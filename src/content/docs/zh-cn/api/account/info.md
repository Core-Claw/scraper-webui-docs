---
title: 查询账户信息
description: 查询账户信息
sidebar:
    order: 10
---

**请求方式：** `POST`

**请求地址：** `/api/v1/account/info`

使用 **Content-Type: application/json** 发送请求体。

## header 头请求示例

```json
{
    "api-key": "<YOUR_API_KEY>"
}
```

#### 参数说明

| 参数    | 示例值 | 参数类型 | 是否必填 | 参数描述 |
| ------- | ------ | -------- | -------- | -------- |
| api-key | -      | String   | 是       | API密钥  |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "balance": "10122.5547",
        "traffic": 178194757135,
        "traffic_expiration_at": 1775267018
    }
}
```

#### 参数说明

| 参数                     | 示例值       | 参数类型 | 参数描述                                |
| ------------------------ | ------------ | -------- | --------------------------------------- |
| code                     | 0            | Integer  | [查看帮助](/zh-cn/api/basic/base/#全局状态码) |
| message                  | success      | String   | 错误描述                                |
| data                     | -            | Object   | -                                       |
| └─ balance               | 10122.5547   | String   | 账户余额($)                             |
| └─ traffic               | 178194757135 | Integer  | 消耗流量(字节)                          |
| └─ traffic_expiration_at | 1775267018   | Integer  | 流量过期时间(时间戳 秒)                 |

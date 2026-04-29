---
title: 账户信息
description: 获取账户信息
sidebar:
    order: 10
---

**方法：** `GET`

**端点：** `/api/v1/account/info`

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "balance": "10122.5547",
        "traffic": 178194757135,
        "traffic_expires_at": 1775267018
    }
}
```

#### 响应字段

| 参数                | 示例值        | 类型    | 说明                                   |
| ------------------- | ------------- | ------- | -------------------------------------- |
| code                | 0             | Integer | [查看帮助](/zh-cn/api/#全局状态码)     |
| message             | success       | String  | 响应消息                               |
| data                | -             | Object  | 响应数据                               |
| └─ balance          | 10122.5547    | String  | 账户余额（美元）                       |
| └─ traffic          | 178194757135  | Integer | 流量配额（字节）                       |
| └─ traffic_expires_at | 1775267018  | Integer | 流量过期时间（时间戳，秒）             |

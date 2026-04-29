---
title: 重新运行
description: 重新运行 Worker 任务
sidebar:
    order: 6
---

**方法：** `POST`

**端点：** `/api/v1/runs/{run_slug}/rerun`

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
    "data": {
        "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ",
        "status": 1
    }
}
```

#### 响应字段

| 参数     | 示例                       | 类型    | 说明                                                     |
| -------- | -------------------------- | ------- | -------------------------------------------------------- |
| code     | 0                          | Integer | 全局状态码                                               |
| message  | success                    | String  | 响应消息                                                 |
| data     | -                          | Object  | 响应数据                                                 |
| run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 新运行的唯一标识符                                       |
| status   | 1                          | Integer | 运行状态：1 就绪，2 运行中，3 成功，4 失败，5 终止中      |

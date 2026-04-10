---
title: Export Run Result
description: Export the result of a Worker task
sidebar:
    order: 10
---

**请求方式：** `POST`

**请求地址：** `/api/v1/run/result/export`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "run_slug": "01KK0DP5AK0WMS83RH9H16SS95",
    "filter_keys": [],
    "format": "csv"
}
```

#### 参数说明

| 参数        | 示例值                     | 参数类型 | 是否必填 | 参数描述                 |
| ----------- | -------------------------- | -------- | -------- | ------------------------ |
| run_slug    | 01KK0DP5AK0WMS83RH9H16SS95 | String   | 是       | 运行唯一标识             |
| filter_keys | -                          | Array    | 是       | 要导出的字段             |
| format      | csv                        | String   | 是       | 要导出的格式 `csv或json` |

## 响应示例

```json
{
    "code": 0,
    "data": {
        "download_url": ""
    },
    "msg": "Success"
}
```

#### 参数说明

| 参数         | 示例值 | 参数描述           |
| ------------ | ------ | ------------------ |
| download_url | -      | 导出结果的下载链接 |

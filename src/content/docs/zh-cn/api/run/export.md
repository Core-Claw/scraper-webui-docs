---
title: 导出运行结果
description: 导出 Worker 运行结果
sidebar:
    order: 5
---

**方法：** `POST`

**端点：** `/api/v1/run/result/export`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "run_slug": "YOUR_RUN_SLUG",
    "filter_keys": [],
    "format": "csv"
}
```

#### 参数说明

| 参数        | 示例值        | 类型   | 必填 | 说明 |
| ----------- | ------------- | ------ | ---- | ---- |
| run_slug    | YOUR_RUN_SLUG | String | 是   | 运行唯一标识符 |
| filter_keys | -             | Array  | 是   | 要导出的字段 |
| format      | csv           | String | 是   | 导出格式：`csv` 或 `json` |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "download_url": "https://..."
    }
}
```

#### 响应字段

| 参数         | 示例    | 类型    | 说明 |
| ------------ | ------- | ------- | ---- |
| code         | 0       | Integer | 全局状态码 |
| message      | success | String  | 响应消息 |
| data         | -       | Object  | 响应数据 |
| download_url | -       | String  | 导出文件下载 URL |
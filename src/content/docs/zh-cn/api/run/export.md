---
title: 导出运行结果
description: 导出 Worker 运行结果
sidebar:
    order: 5
---

**方法：** `POST`

**端点：** `/api/v1/runs/{run_slug}/export`

使用 **Content-Type: application/json** 发送请求体。

## 路径参数

| 参数      | 必填 | 说明           |
| --------- | ---- | -------------- |
| run_slug  | 是   | 运行唯一标识符 |

## 请求体

| 参数        | 默认值 | 类型   | 必填 | 说明                         |
| ----------- | ------ | ------ | ---- | ---------------------------- |
| filter_keys | -      | string | 否   | 逗号分隔的要导出的字段       |
| format      | csv    | String | 否   | 导出格式：`csv` 或 `json`    |

## 请求示例

```json
{
    "filter_keys": "",
    "format": "csv"
}
```

## 响应示例

```json
{
    "code": 0,
    "message": "成功",
    "data": {
        "download_url": "https://smpfile.coreclaw.com/export/...",
        "format": "csv",
        "record_count": 4
    }
}
```

#### 响应字段

| 参数         | 示例 | 类型    | 说明               |
| ------------ | ---- | ------- | ------------------ |
| code         | 0    | Integer | 全局状态码         |
| message      | 成功 | String  | 响应消息           |
| data         | -    | Object  | 响应数据           |
| download_url | -    | String  | 导出文件下载 URL   |
| format       | csv  | String  | 导出格式           |
| record_count | 4    | Integer | 导出记录数         |

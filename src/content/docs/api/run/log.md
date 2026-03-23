---
title: Run log
description: Get the log of a Scraper task
sidebar:
    order: 11
---

**请求方式：** `POST`

**请求地址：** `/api/v1/run/last/log`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "run_slug": "01KKJYJ4HH0R9K7XD856MAE1WH"
}
```

#### 参数说明

| 参数     | 示例值                     | 参数类型 | 是否必填 | 参数描述     |
| -------- | -------------------------- | -------- | -------- | ------------ |
| run_slug | 01KKJYJ4HH0R9K7XD856MAE1WH | String   | 是       | 运行唯一标识 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "all_logs_url": "https://smpfile.cafescraper.com/log/all_log_7cb43d81-38d5-47b6-a313-4e1423d4c28a_1773383790454",
        "list": [
            {
                "type": 2,
                "group": "28596067108978688",
                "content": "SYSTEM: Subtask-[28596067108978688] - Preparing the execution environment.",
                "timestamp": 1773383784438
            },
            {
                "type": 2,
                "group": "28596067108978688",
                "content": "SYSTEM: Subtask-[28596067108978688] - Running...",
                "timestamp": 1773383784958
            },
            {
                "type": 2,
                "group": "28596067108978688",
                "content": "SYSTEM: Subtask-[28596067108978688] - Execution completed.",
                "timestamp": 1773383790211
            },
            {
                "type": 2,
                "group": "28596067108913152",
                "content": "All subtasks have completed execution! Total 1 subtasks: 1 succeeded, 0 failed.",
                "timestamp": 1773383790498
            }
        ],
        "result_count": 4
    }
}
```

#### 参数说明

| 参数            | 示例值  | 类型    | 描述                                    |
| --------------- | ------- | ------- | --------------------------------------- |
| code            | 0       | Integer | [查看帮助](/zh-cn/api/base/#全局状态码) |
| message         | success | String  | -                                       |
| data            | -       | Object  | -                                       |
| └─ all_logs_url | -       | String  | 完整日志URL                             |
| └─ list         | -       | Array   | 日志简要列表                            |
| result_count    | 4       | Integer | 采集数据总条数                          |

##### list 参数说明

| 参数      | 示例值 | 类型    | 描述                                               |
| --------- | ------ | ------- | -------------------------------------------------- |
| type      | 1      | Integer | 日志类型<br>1.Debug<br>2.Info<br>3.Warn<br>4.Error |
| group     | -      | String  | 日志分组标识                                       |
| content   | -      | String  | 日志内容                                           |
| timestamp | -      | Integer | 日志时间戳（毫秒）                                 |

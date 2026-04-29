---
title: 运行日志
description: 获取 Worker 运行日志
sidebar:
    order: 4
---

**方法：** `GET`

**端点：** `/api/v1/runs/{run_slug}/logs`

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
        "full_log_url": "https://smpfile.coreclaw.com/log/all_log_7cb43d81-38d5-47b6-a313-4e1423d4c28a_1773383790454",
        "records": [
            {
                "type": 2,
                "group": "28596067108978688",
                "msg": "SYSTEM: 子任务-[28596067108978688] - 正在准备执行环境。",
                "timestamp": 1773383784438
            }
        ],
        "current_result_count": 4
    }
}
```

#### 响应字段

| 参数                 | 示例    | 类型    | 说明                             |
| -------------------- | ------- | ------- | -------------------------------- |
| code                 | 0       | Integer | 全局状态码                       |
| message              | success | String  | 响应消息                         |
| data                 | -       | Object  | 响应数据                         |
| full_log_url         | -       | String  | 完整日志文件 URL                 |
| records              | -       | Array   | 摘要日志条目                     |
| current_result_count | 4       | Integer | 采集总行数                       |

##### `records` 字段

| 参数      | 示例 | 类型    | 说明                                     |
| --------- | ---- | ------- | ---------------------------------------- |
| type      | 1    | Integer | 日志级别：1 调试，2 信息，3 警告，4 错误  |
| group     | -    | String  | 日志组标识符                             |
| msg       | -    | String  | 日志内容                                 |
| timestamp | -    | Integer | 日志时间戳（毫秒）                       |

---
title: 查询运行结果
description: 查询指定运行的结果
sidebar:
    order: 9
---

**请求方式：** `POST`

**请求地址：** `/api/v1/run/result/list`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "page": 1,
    "page_size": 20,
    "run_slug": "01KKBBRYX3NTK8HRZ2C6HD0JNM"
}
```

#### 参数说明

| 参数      | 示例值                     | 参数类型 | 是否必填 | 参数描述     |
| --------- | -------------------------- | -------- | -------- | ------------ |
| page      | 1                          | Integer  | 是       | 当前页码     |
| page_size | 20                         | Integer  | 是       | 每页数量     |
| run_slug  | 01KKBBRYX3NTK8HRZ2C6HD0JNM | String   | 是       | 运行唯一标识 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "count": 4,
        "headers": [
            {
                "label": "标题v1",
                "key": "title",
                "format": "text"
            },
            {
                "label": "时间",
                "key": "publish_time",
                "format": "text"
            }
        ],
        "list": [
            {
                "title": "太平洋彼岸传佳音，美国中国总商会授予圣奥重磅大奖",
                "publish_time": "2026-01-19"
            }
        ]
    }
}
```

#### 参数说明

| 参数       | 示例值  | 参数类型 | 参数描述                                |
| ---------- | ------- | -------- | --------------------------------------- |
| code       | 0       | Integer  | [查看帮助](/zh-cn/api/basic/base/#全局状态码) |
| message    | success | String   | 错误描述                                |
| data       | -       | Object   | -                                       |
| └─ count   | 4       | Integer  | 记录总条数                              |
| └─ headers | -       | Array    | 采集数据的表头                          |
| └─ list    | -       | Array    | 采集数据的记录集                        |

##### headers 参数说明

| 参数   | 示例值 | 参数类型 | 参数描述 |
| ------ | ------ | -------- | -------- |
| label  | -      | String   | 别名     |
| key    | -      | String   | 键名     |
| format | -      | String   | 类型     |

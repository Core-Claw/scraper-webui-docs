---
title: 获取详情
description: 获取运行详情
sidebar:
    order: 8
---

**请求方式：** `POST`

**请求地址：** `/api/v1/run/detail`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "run_slug": "01KKJYJ4HH0R9K7XD856MAE1WH"
}
```

#### 参数说明

| 参数     | 示例值                     | 类型   | 必填 | 描述         |
| -------- | -------------------------- | ------ | ---- | ------------ |
| run_slug | 01KKJYJ4HH0R9K7XD856MAE1WH | String | 是   | 运行唯一标识 |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "status": 2,
        "err_msg": "",
        "slug": "01KKJYJ4HH0R9K7XD856MAE1WH",
        "actors_title": "新闻采集 20260305",
        "actors_slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
        "results": 4,
        "usage": "0.0217",
        "started_at": 1773383784,
        "finished_at": 0,
        "duration": 0,
        "origin": "api",
        "traffic": 0,
        "version": "v1.0.1"
    }
}
```

#### 参数说明

| 参数            | 示例值                     | 类型    | 描述                                                                          |
| --------------- | -------------------------- | ------- | ----------------------------------------------------------------------------- |
| code            | 0                          | Integer | [查看帮助](/zh-cn/api/base/#全局状态码)                                       |
| message         | success                    | String  | -                                                                             |
| data            | -                          | Object  | -                                                                             |
| └─ status       | 3                          | Integer | 运行状态<br>1: 准备中<br>2: 执行中<br>3: 执行成功<br>4: 执行失败<br>5: 已终止 |
| └─ err_msg      | -                          | String  | 错误信息                                                                      |
| └─ slug         | 01KKJYJ4HH0R9K7XD856MAE1WH | String  | 运行唯一标识                                                                  |
| └─ actors_title | 新闻采集 20260305          | String  | Scraper 名称                                                                  |
| └─ actors_slug  | 01KJXYJ7KCHXM0PDZHQD5293XE | String  | Scraper 唯一标识                                                              |
| └─ results      | 4                          | Integer | 采集结果数量                                                                  |
| └─ usage        | 0.0217                     | String  | 设备费用($)                                                                   |
| └─ started_at   | 1773383784                 | Integer | 执行开始时间(时间戳)                                                          |
| └─ finished_at  | 0                          | Integer | 执行结束时间(时间戳)                                                          |
| └─ duration     | 0                          | Integer | 执行时长(秒)                                                                  |
| └─ origin       | api                        | String  | 运行来源<br> api: 接口调用<br> web: 控制台操作                                |
| └─ traffic      | 0                          | Integer | 流量消耗(字节)                                                                |
| └─ version      | v1.0.1                     | String  | Scraper 版本                                                                  |

## 错误响应

```json
{
    "code": 4000,
    "message": "Invalid request parameters",
    "data": null
}
```

#### 参数说明

| 参数    | 示例值                     | 类型    | 描述                                    |
| ------- | -------------------------- | ------- | --------------------------------------- |
| code    | 4000                       | Integer | [查看帮助](/zh-cn/api/base/#全局状态码) |
| message | Invalid request parameters | String  | 错误描述                                |
| data    | null                       | Null    | -                                       |

---
title: 历史记录
description: 获取任务的运行记录
sidebar:
    order: 1
---

**请求方式：** `POST`

**请求地址：** `/api/v1/run/list`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "page": 1,
    "page_size": 20,
    "status": 0,
    "scraper_slug": "01KJYCSVTDCM7078HNB4Z5RJE2"
}
```

#### 参数说明

| 参数         | 默认值 | 类型    | 必填 | 描述                                                                                     |
| ------------ | ------ | ------- | ---- | ---------------------------------------------------------------------------------------- |
| page         | 1      | Integer | 是   | 当前页码                                                                                 |
| page_size    | 20     | Integer | 是   | 每页数量, 可选: `10, 20, 50`                                                             |
| status       | 0      | Integer | 是   | 运行状态<br>0: 所有<br>1: 准备中<br>2: 执行中<br>3: 执行成功<br>4: 执行失败<br>5: 已终止 |
| scraper_slug | -      | String  | 是   | 脚本唯一识别                                                                             |

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "count": 106,
        "list": [
            {
                "status": 3,
                "err_msg": "",
                "slug": "01KKGKQ89XN5HYD7JYKCC9C32H",
                "scraper_title": "新闻采集 20260305",
                "scraper_slug": "01KJXYJ7KCHXM0PDZHQD5293XE",
                "results": 4,
                "usage": "0.065",
                "started_at": 1773305309,
                "finished_at": 1773305316,
                "duration": 7,
                "origin": "api",
                "traffic": 23108,
                "version": "v1.0.1"
            }
        ]
    }
}
```

#### 参数说明

| 参数    | 示例值  | 类型    | 说明                                    |
| ------- | ------- | ------- | --------------------------------------- |
| code    | 0       | Integer | [查看帮助](/zh-cn/api/basic/base/#全局状态码) |
| message | success | String  | 错误描述                                |
| data    | -       | Object  | -                                       |

##### data 字段说明

| 参数             | 示例值                     | 类型    | 说明                                                                          |
| ---------------- | -------------------------- | ------- | ----------------------------------------------------------------------------- |
| count            | 0                          | Integer | 总记录数                                                                      |
| list             | -                          | Array   | 记录列表                                                                      |
| └─ status        | 3                          | Integer | 运行状态<br>1: 准备中<br>2: 执行中<br>3: 执行成功<br>4: 执行失败<br>5: 已终止 |
| └─ slug          | 01KKGKQ89XN5HYD7JYKCC9C32H | String  | 运行记录唯一标识                                                              |
| └─ scraper_title | 新闻采集 20260305          | String  | Scraper 名称                                                                  |
| └─ scraper_slug  | 01KJXYJ7KCHXM0PDZHQD5293XE | String  | Scraper 唯一标识                                                              |
| └─ results       | 4                          | Integer | 采集结果数量                                                                  |
| └─ usage         | 0.065                      | String  | 设备费用($)                                                                   |
| └─ started_at    | 1773305309                 | Integer | 执行开始时间(时间戳)                                                          |
| └─ finished_at   | 1773305316                 | Integer | 执行结束时间(时间戳)                                                          |
| └─ duration      | 7                          | Integer | 执行时长(秒)                                                                  |
| └─ origin        | api                        | String  | 运行来源<br> api: 接口调用<br> web: 控制台操作                                |
| └─ traffic       | 23108                      | Integer | 流量消耗(字节)                                                                |
| └─ version       | v1.0.1                     | String  | Scraper 版本                                                                  |

## 错误响应

```json
{
    "code": 4000,
    "message": "Invalid request parameters",
    "data": null
}
```

| 参数    | 示例值                     | 类型    | 描述                                    |
| ------- | -------------------------- | ------- | --------------------------------------- |
| code    | 4000                       | Integer | [查看帮助](/zh-cn/api/basic/base/#全局状态码) |
| message | Invalid request parameters | String  | 错误描述                                |
| data    | null                       | Null    | -                                       |

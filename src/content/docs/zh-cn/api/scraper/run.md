---
title: 运行 Scraper
sidebar:
    order: 4
---

**请求方式：** `POST`

**请求地址：** `/api/v1/scraper/run`

使用 **Content-Type: application/json** 发送请求体。

## 请求示例

```json
{
    "scraper_slug": "01KGYERXPXTABWXMGQKFCE43M2",
    "version": "v1.0.1",
    "input": {
        "parameters": {
            "system": {
                "cpus": 0.125,
                "memory": 512,
                "execute_limit_time_seconds": 1800,
                "max_total_charge": 0,
                "max_total_traffic": 0
            },
            "custom": {
                "startURLs": [
                    {
                        "url": "https://www.amazon.com/sp?ie=UTF8&seller=ADZ7LD48GVFQJ&asin=B07H56J7K1&ref_=dp_merchant_link&isAmazonFulfilled=1"
                    },
                    {
                        "url": "https://www.amazon.com/sp?ie=UTF8&seller=A3AZYNALJBV2WE&asin=B099S46ZRQ&ref_=dp_merchant_link&isAmazonFulfilled=1"
                    }
                ],
                "proxy_region": "BQ"
            }
        }
    },
    "callback_url": "https://your-domain.com/callback"
}
```

### 参数说明

| 参数         | 必须 | 说明                         |
| ------------ | ---- | ---------------------------- |
| scraper_slug | 是   | Scraper 唯一标识符           |
| version      | 是   | Scraper 版本                 |
| input        | 是   | 输入参数                     |
| callback_url | 是   | 回调 URL(接收运行结果的地址) |

#### system 系统参数说明

| 参数                       | 示例值 | 类型   | 必填 | 描述                                                            |
| -------------------------- | ------ | ------ | ---- | --------------------------------------------------------------- |
| proxy_region               | CH     | string | 是   | 执行节点 [查看帮助](/zh-cn/api/proxy/)                          |
| cpus                       | 0.125  | number | 是   | 容器 CPU 核心数 [查看帮助](/zh-cn/api/device-configuration/)    |
| memory                     | 512    | number | 是   | 容器内存大小（MB） [查看帮助](/zh-cn/api/device-configuration/) |
| execute_limit_time_seconds | 1800   | number | 是   | 容器执行超时（秒）                                              |
| max_total_charge           | 0      | number | 是   | 最大消耗费用（$）                                               |
| max_total_traffic          | 0      | number | 是   | 最大消耗流量（MB）                                              |

#### custom 参数说明

根据 Scraper 脚本的参数说明，填写具体参数。

## 响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
    }
}
```

#### 参数说明

| 参数        | 示例值                     | 类型    | 描述                                    |
| ----------- | -------------------------- | ------- | --------------------------------------- |
| code        | 0                          | Integer | [查看帮助](/zh-cn/api/base/#全局状态码) |
| message     | success                    | String  | -                                       |
| data        | -                          | Object  |                                         |
| └─ run_slug | 01KKDXV2G26BT7NH4ZQR2R4NPZ | String  | 运行的唯一标识                          |

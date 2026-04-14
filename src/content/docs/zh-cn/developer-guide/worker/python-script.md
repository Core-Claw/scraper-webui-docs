---
title: Python 脚本
description: 学习如何编写 Python 脚本
---

# Python 脚本示例

## GitHub 仓库

Python 脚本示例仓库：
[https://github.com/core-claw/PythonScirptDemo](https://github.com/core-claw/PythonScirptDemo)

---

## 必需文件（项目根目录）

```text
├── main.py
├── requirements.txt
├── input_schema.json
├── README.md
├── sdk.py
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

---

## 文件概览

| 文件名                                   | 说明                                               |
| :---------------------------------------- | :------------------------------------------------- |
| **main.py**                               | 脚本入口文件（执行入口），必须命名为 `main`         |
| **requirements.txt**                      | Python 依赖管理文件                                |
| **input_schema.json**                     | UI 输入表单配置文件                                 |
| **README.md**                             | 项目文档                                           |
| **sdk.py**                                | 核心 SDK 功能                                      |
| **sdk_pb2.py**                            | 增强数据处理模块                                    |
| **sdk_pb2_grpc.py**                       | 网络通信模块                                      |

---

## 核心脚本 SDK

### SDK 文件说明

以下三个 SDK 文件是**必需的**，必须放置在脚本的根目录中：

| 文件名                                   | 主要功能               |
| :---------------------------------------- | :-------------------- |
| **sdk.py**                                | 核心功能模块           |
| **sdk_pb2.py**                            | 增强数据处理模块       |
| **sdk_pb2_grpc.py**                       | 网络通信模块         |

这三个文件共同构成脚本的**工具箱**，提供爬虫执行和与平台后端系统交互所需的所有核心能力。

---

## 核心功能使用指南

### 1. 环境参数

**获取脚本启动时传入的配置**

脚本启动时，可从外部传入配置参数（如目标网站 URL、搜索关键词等）。

使用以下方法获取：

```python
# 获取所有输入参数为字典
parameters = SDK.Parameter.get_input_json_dict()

# 示例返回值：
# {"website": "example.com", "keyword": "科技新闻"}
```

**使用场景：**
如果不同任务需要采集不同网站的数据，只需传入不同参数，无需修改脚本代码。

---

### 2. 运行日志

**记录脚本执行进度**

执行过程中，可以记录不同级别的日志。这些日志将在平台 UI 中展示，便于监控执行状态和排查问题。

```python
# 调试级别日志（最详细）
SDK.Log.debug("正在连接目标网站...")

# 信息日志（正常执行流程）
SDK.Log.info("成功采集 10 条新闻")

# 警告日志（非致命问题）
SDK.Log.warn("检测到网络延迟，采集速度可能受影响")

# 错误日志（执行失败）
SDK.Log.error("无法访问目标网站，请检查网络连接")
```

#### 日志级别说明

* **debug**：最详细的日志，开发期间推荐
* **info**：正常执行流程，关键步骤推荐
* **warn**：不阻止执行的潜在问题
* **error**：需要关注的错误

---

### 3. 返回结果

**将采集数据回传到平台**

数据采集完成后，必须通过**两步**将结果返回平台。

---

#### 第一步：定义表头（必填）

在推送任何数据之前，定义表结构——类似于在 Excel 中定义列标题。

```python
headers = [
    {
        "label": "新闻标题",
        "key": "title",
        "format": "text",
    },
    {
        "label": "发布时间",
        "key": "publish_time",
        "format": "text",
    },
    {
        "label": "分类",
        "key": "category",
        "format": "text",
    },
]

# 设置表头
res = CoreSDK.Result.set_table_header(headers)
```

##### 字段说明

* **label**：显示给用户的列名（建议使用描述性名称）
* **key**：代码中使用的唯一标识符（建议小写加下划线）
* **format**：数据类型，支持的值：
  * `"text"`：字符串/文本
  * `"integer"`：整数
  * `"boolean"`：布尔值（true / false）
  * `"array"`：列表/数组
  * `"object"`：字典/对象

---

#### 第二步：逐条推送数据记录

```python
news_data = [
    {"title": "AI 重大突破", "publish_time": "2023-10-01", "category": "科技"},
    {"title": "今日股市", "publish_time": "2023-10-01", "category": "财经"},
]

for i, news in enumerate(news_data):
    obj = {
        "title": news.get('title'),
        "publish_time": news.get('publish_time'),
        "category": news.get('category'),
    }

    res = CoreSDK.Result.push_data(obj)
    SDK.Log.info(f"已推送第 {i + 1} 条记录: {news.get('title')}")
```

##### 注意事项

* 表头定义和数据推送**顺序不限**
* 数据键**必须与**表头键完全匹配（区分大小写）
* 数据必须**逐条推送**
* 建议每次推送后记录日志

---

## 完整代码示例

```python
from sdk import CoreSDK

# 1. 获取输入参数
config = SDK.Parameter.get_input_json_dict()
website = config.get("website", "默认网站")
SDK.Log.info(f"开始采集网站: {website}")

# 2. 设置表头
headers = [
    {"label": "标题", "key": "title", "format": "text"},
    {"label": "时间", "key": "publish_time", "format": "text"},
    {"label": "分类", "key": "category", "format": "text"},
    {"label": "浏览量", "key": "view_count", "format": "integer"},
]
CoreSDK.Result.set_table_header(headers)

# 3. 模拟数据采集
SDK.Log.info("正在采集数据...")
collected_data = [
    {"title": "示例新闻 1", "publish_time": "2023-10-01 10:00", "category": "科技", "view_count": 1000},
    {"title": "示例新闻 2", "publish_time": "2023-10-01 11:00", "category": "财经", "view_count": 500},
]

# 4. 推送数据
SDK.Log.info(f"已采集 {len(collected_data)} 条记录，正在推送数据...")
for data in collected_data:
    obj = {
        "title": data.get("title"),
        "publish_time": data.get("publish_time"),
        "category": data.get("category"),
        "view_count": data.get("view_count", 0),
    }
    CoreSDK.Result.push_data(obj)

# 5. 完成
SDK.Log.info("数据采集任务完成！")
```

---

## 脚本入口文件（main.py）

### 示例

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import asyncio
import os
from sdk import CoreSDK

async def run():
    """
    简化的 Instagram Reel 数据采集示例
    仅保留核心 SDK 调用和代理配置
    """
    try:
        # 1. 获取输入参数
        input_json_dict = CoreSDK.Parameter.get_input_json_dict()
        CoreSDK.Log.debug(f"输入参数: {input_json_dict}")

        # 2. 代理配置（从环境变量读取，支持灵活部署）
        proxy_domain = os.environ.get("PROXY_DOMAIN") or "proxy-inner.coreclaw.com:6000"
        CoreSDK.Log.info(f"代理域名: {proxy_domain}")

        try:
            proxy_auth = os.environ.get("PROXY_AUTH")
            CoreSDK.Log.info(f"代理认证信息: {proxy_auth}")
        except Exception as e:
            CoreSDK.Log.error(f"获取代理认证失败: {e}")
            proxy_auth = None

        proxy_url = f"socks5://{proxy_auth}@{proxy_domain}" if proxy_auth else None
        CoreSDK.Log.info(f"代理 URL: {proxy_url}")

        # 3. 业务逻辑
        url = input_json_dict.get('url')
        CoreSDK.Log.info(f"正在处理 URL: {url}")

        result = {
            "url": url,
            "status": "success",
            "data": {
                "title": "示例标题",
                "content": "示例内容",
            }
        }

        # 4. 推送结果
        CoreSDK.Result.push_data(result)

        # 5. 如需表格输出则设置表头
        headers = [
            {"label": "URL", "key": "url", "format": "text"},
            {"label": "状态", "key": "status", "format": "text"},
        ]
        CoreSDK.Result.set_table_header(headers)

        CoreSDK.Log.info("脚本执行完成")

    except Exception as e:
        CoreSDK.Log.error(f"执行错误: {e}")
        CoreSDK.Result.push_data({
            "error": str(e),
            "error_code": "500",
            "status": "failed"
        })
        raise

if __name__ == "__main__":
    asyncio.run(run())
```

---

## Python 依赖管理（requirements.txt）

此文件列出了运行脚本所需的所有第三方 Python 包。
系统会自动安装此文件中指定的所有依赖。

### 示例

```text
attrs==25.4.0
beautifulsoup4==4.14.2
certifi==2025.10.5
cffi==2.0.0
charset-normalizer==3.4.4
click==8.3.0
colorama==0.4.6
cssselect==1.3.0
DataRecorder==3.6.2
DownloadKit==2.0.7
DrissionPage==4.1.1.2
et_xmlfile
filelock
```

---

## 注意事项

### 1. 版本管理

* 指定版本的包（如 `beautifulsoup4==4.14.2`）将按指定版本安装
* 未指定版本的包将安装最新可用版本

### 2. 安装

* 依赖自动安装
* 安装时间取决于网络速度和包大小
* 安装失败时会显示错误信息

### 3. 确保正常执行

* **grpcio** 和 **protobuf** 必须包含（SDK 所需）
* 所有第三方库必须列出
* 核心依赖应使用固定版本
* 定期更新依赖以确保安全性和稳定性

---

## 常见问题

**问：为什么要指定版本？**
答：为确保开发、测试和生产环境的行为一致。

**问：不指定版本会怎样？**
答：将安装最新版本，可能导致兼容性问题。

**问：如何添加新依赖？**
答：在此文件中添加一行，然后重新上传 ZIP 包。

**问：安装失败怎么办？**
答：检查网络连接或包镜像源，或联系系统管理员。

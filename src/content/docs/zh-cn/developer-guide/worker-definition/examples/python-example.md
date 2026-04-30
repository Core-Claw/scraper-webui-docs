---
title: Python 示例
description: 使用 Python 构建 Worker
sidebar:
  order: 1
---

学习如何使用 Python 构建 Worker。

## GitHub 仓库

Python 脚本示例仓库：
[PythonScirptDemo](https://github.com/Core-Claw/PythonScirptDemo)

---

## 必需文件（项目根目录）

```text
├── main.py              # 脚本入口文件
├── requirements.txt     # Python 依赖
├── input_schema.json    # 输入表单配置
├── output_schema.json   # 输出表格配置
├── sdk.py               # CoreClaw SDK - 核心功能
├── sdk_pb2.py           # 数据处理模块
└── sdk_pb2_grpc.py      # 网络通信模块
```

### 文件概览

| 文件 | 说明 |
| ---- | ---- |
| **main.py** | 脚本入口文件（执行入口），必须命名为 `main` |
| **requirements.txt** | Python 依赖管理文件 |
| **input_schema.json** | UI 输入表单配置文件 |
| **output_schema.json** | 输出表格结构配置文件 |
| **sdk.py** | 核心 SDK 功能 |
| **sdk_pb2.py** | 增强数据处理模块 |
| **sdk_pb2_grpc.py** | 网络通信模块 |

这三个 SDK 文件（`sdk.py`、`sdk_pb2.py`、`sdk_pb2_grpc.py`）是必需的，必须放置在项目的**根目录**中。它们共同构成脚本的**工具箱**，提供 Worker 执行和与平台后端交互所需的所有核心能力。

---

## 核心 SDK 使用说明

CoreClaw SDK（`CoreSDK`）提供每个 Worker 都需要的三大核心能力：

### 1. 环境参数获取 — 获取脚本启动时的配置信息

当 Worker 启动时，平台会传入一些配置参数（比如要采集的网站地址、搜索关键词等）。使用以下方法获取这些参数：

```python
from sdk import CoreSDK

# 获取所有传入的参数，以字典形式返回
input_json_dict = CoreSDK.Parameter.get_input_json_dict()

# 示例：获取特定参数
url = input_json_dict.get('url')
```

**使用场景**：通过传入不同的参数来采集不同网站的数据，无需修改代码。

### 2. 运行日志 — 记录脚本执行过程

脚本执行过程中，可以记录不同级别的日志信息。这些日志会显示在控制台界面，方便查看执行状态和问题排查：

```python
# 调试信息（最详细，用于问题排查）
CoreSDK.Log.debug("正在连接目标网站...")

# 一般信息（正常流程记录）
CoreSDK.Log.info("成功获取10条数据")

# 警告信息（需要注意但非错误的情况）
CoreSDK.Log.warn("网络连接较慢，可能影响采集速度")

# 错误信息（执行出错时使用）
CoreSDK.Log.error("无法访问目标网站")
```

**日志级别说明**：
- **debug** — 最详细的调试信息，适合开发时使用
- **info** — 正常的流程记录，推荐在关键步骤使用
- **warn** — 警告信息，表示可能有问题但程序还能运行
- **error** — 错误信息，表示出现了需要关注的问题

### 3. 结果返回 — 将采集的数据发送回平台

脚本采集到数据后，需要通过以下两个步骤将数据返回给平台：

#### 第一步：设置表格表头

在推送具体数据之前，先定义数据的表格结构，就像 Excel 中先定义列标题一样：

```python
headers = [
    {"label": "标题", "key": "title", "format": "text"},
    {"label": "链接", "key": "url", "format": "text"},
    {"label": "分类", "key": "category", "format": "text"},
]
CoreSDK.Result.set_table_header(headers)
```

**字段说明**：
- **label** — 表格中显示的列标题（用户可见）
- **key** — 数据的唯一标识符（代码中使用，需与 push_data 中的 key 一致）
- **format** — 数据类型：`"text"`、`"integer"`、`"boolean"`、`"array"`、`"object"`

#### 第二步：逐条推送数据

设置好表头后，开始推送采集到的数据：

```python
for item in collected_data:
    obj = {
        "title": item.get("title"),
        "url": item.get("url"),
        "category": item.get("category"),
    }
    CoreSDK.Result.push_data(obj)
```

**重要提醒**：
- 设置表头与推送数据的顺序可以颠倒
- 推送数据时，字典中的 key 必须与表头中定义的 key 完全一致
- 数据需要**逐条推送**，不能一次性推送多条
- 建议在每次推送后记录日志，方便跟踪执行进度

---

## 脚本入口文件（main.py）

### 完整示例

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import asyncio
import os
from sdk import CoreSDK

async def run():
    try:
        # 1. 获取输入参数
        input_json_dict = CoreSDK.Parameter.get_input_json_dict()
        CoreSDK.Log.debug(f"输入参数: {input_json_dict}")

        # 2. 代理配置（从环境变量读取）
        proxy_auth = os.environ.get("PROXY_AUTH")
        CoreSDK.Log.info(f"代理认证信息: {proxy_auth}")

        # 3. 业务逻辑
        url = input_json_dict.get('url')
        CoreSDK.Log.info(f"正在处理 URL: {url}")

        result = {
            "url": url,
            "status": "success",
        }

        # 4. 推送结果数据
        CoreSDK.Result.push_data(result)

        # 5. 设置表格表头
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

### 工作原理

脚本遵循四个阶段：

1. **接收指令** — 从平台获取输入参数（URL、关键词等）
2. **网络配置** — 通过 `PROXY_AUTH` 环境变量配置代理，访问外部网站
3. **执行任务** — 在目标页面上运行核心采集逻辑
4. **上报结果** — 将采集数据推送回平台并设置表格表头

---

## Python 依赖管理（requirements.txt）

此文件列出了运行脚本所需的所有第三方 Python 包。平台会自动安装此文件中指定的所有依赖。

### 示例

```text
aiofiles==25.1.0
certifi==2025.11.12
cffi==2.0.0
cssselect==1.3.0
curl_cffi==0.13.0
grpcio==1.80.0
python-dateutil
tenacity
```

### 注意事项

#### 版本管理

- 指定版本的包（如 `beautifulsoup4==4.14.2`）将按指定版本安装
- 未指定版本的包将安装最新可用版本

#### 安装说明

- 依赖由平台自动安装
- 安装时间取决于网络速度和包大小
- 安装失败时会显示错误信息

#### 确保正常执行

- **grpcio** 和 **protobuf** 必须包含（SDK 所需）
- 所有第三方库必须列出
- 核心依赖应使用固定版本以确保稳定性
- 定期更新依赖以确保安全性和稳定性

---

## 常见问题

**问：为什么要指定版本？**
答：为确保开发、测试和生产环境的行为一致，避免因版本差异导致的兼容性问题。

**问：不指定版本会怎样？**
答：将安装最新版本，可能导致兼容性问题。核心依赖建议固定版本。

**问：如何添加新依赖？**
答：在 `requirements.txt` 中添加一行，然后重新上传 ZIP 包，平台会在下次运行时自动安装。

**问：安装失败怎么办？**
答：检查网络连接或包镜像源。如果问题持续，请确认包名和版本是否正确。
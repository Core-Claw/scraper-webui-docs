---
title: Python 示例
description: 学习如何编写 Python 脚本
sidebar:
  order: 1
---

## Python 脚本示例

## GitHub 仓库

Python 脚本示例仓库：
[PythonScirptDemo](https://github.com/core-claw/PythonScirptDemo)

---

## 必需文件（项目根目录）

```text
├── main.py
├── requirements.txt
├── input_schema.json
├── output_schema.json
├── README.md
├── sdk.py
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

---

## 文件概览

| 文件名                 | 说明                                                |
| ---------------------- | --------------------------------------------------- |
| **main.py**            | 脚本入口文件（执行入口），必须命名为 `main`         |
| **requirements.txt**   | Python 依赖管理文件                                 |
| **input_schema.json**  | UI 输入表单配置文件                                 |
| **README.md**          | 项目文档                                            |
| **sdk.py**             | 核心 SDK 功能                                       |
| **sdk_pb2.py**         | 增强数据处理模块                                    |
| **sdk_pb2_grpc.py**    | 网络通信模块                                        |

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

        # 2. 代理配置（仅从环境变量读取）
        proxy_domain = os.environ.get("PROXY_DOMAIN")
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
aiofiles==25.1.0
certifi==2025.11.12
cffi==2.0.0
cssselect==1.3.0
curl_cffi==0.13.0
grpcio==1.80.0
python-dateutil
tenacity
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

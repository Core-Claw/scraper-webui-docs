---
title: 快速上手
description: 几分钟内构建您的第一个 Worker
sidebar:
  order: 1
---

几分钟内构建您的第一个 Worker 并在 CoreClaw 上运行。

## 前提条件

- CoreClaw 开发者账户
- Python、Node.js 或 Go 基础知识
- 本机已安装 Git

## 分步指南

### 1. 克隆模板

选择您偏好的语言并克隆演示仓库：

- **Python**：[PythonScirptDemo](https://github.com/Core-Claw/PythonScirptDemo)
- **Node.js**：[NodeScirptDemo](https://github.com/Core-Claw/NodeScirptDemo)
- **Go**：[GoScirptDemo](https://github.com/Core-Claw/GoScirptDemo)

```bash
# Python
git clone https://github.com/Core-Claw/PythonScirptDemo.git

# Node.js
git clone https://github.com/Core-Claw/NodeScirptDemo.git

# Go
git clone https://github.com/Core-Claw/GoScirptDemo.git
```

### 2. 项目结构

最小 Worker 项目需要：

```
├── main.py          # 主入口文件
├── requirements.txt # 依赖
├── input_schema.json # 输入配置
├── sdk.py           # CoreClaw SDK
├── sdk_pb2.py       # 数据处理模块
└── sdk_pb2_grpc.py  # 网络通信模块
```

### 3. 编写脚本

编辑 `main.py` 实现您的采集逻辑：

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
        proxy_domain = os.environ.get("PROXY_DOMAIN")
        CoreSDK.Log.info(f"代理域名: {proxy_domain}")

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
        raise

if __name__ == "__main__":
    asyncio.run(run())
```

### 4. 配置输入配置

在 `input_schema.json` 中定义输入表单：

```json
{
    "description": "我的第一个 Worker",
    "b": "url",
    "properties": [
        {
            "title": "URL",
            "name": "url",
            "type": "array",
            "editor": "requestList",
            "default": [
                {
                    "url": "https://example.com"
                }
            ],
            "required": true
        }
    ]
}
```

### 5. 本地测试

在本地运行 Worker 进行测试：

```bash
python main.py
```

### 6. 部署到 CoreClaw

1. 登录 CoreClaw 控制台
2. 进入"我的 Worker"
3. 上传项目
4. 构建并测试
5. 发布到 Worker Store

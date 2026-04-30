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

## 开发方式

CoreClaw 支持两种 Worker 开发方式：

### 方式一：本地脚本开发 → Worker 改造

先在本地开发和验证核心采集逻辑，逻辑验证通过后，再添加 CoreClaw SDK 集成、`input_schema.json` 和 `output_schema.json`，将其改造为 Worker。这种方式适合已有脚本并希望迁移到 CoreClaw 的开发者。

### 方式二：直接开发 Worker

直接克隆 CoreClaw 模板进行 Worker 开发，上传到平台后在 CoreClaw 运行环境中进行测试验证。这种方式可以从一开始就在真实平台环境中验证 Worker。

:::note
本地模式开发支持（使用 CoreClaw SDK 在本地运行 Worker）即将上线，敬请期待！
:::

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
├── main.py           # 主入口文件
├── requirements.txt  # 依赖
├── input_schema.json # 输入配置
├── output_schema.json # 输出配置
├── sdk.py            # CoreClaw SDK
├── sdk_pb2.py        # 数据处理模块
└── sdk_pb2_grpc.py   # 网络通信模块
```

- **input_schema.json** — 定义用户运行 Worker 时看到的输入表单。详见 [输入配置](/developer-guide/worker-definition/input-schema/)。
- **output_schema.json** — 定义 Worker 结果的输出表格结构。详见 [输出配置](/developer-guide/worker-definition/output-schema/)。
- **sdk.py / sdk_pb2.py / sdk_pb2_grpc.py** — CoreClaw SDK 模块，用于与平台运行时通信。

### 3. 编写脚本

编辑 `main.py` 实现您的采集逻辑。

:::important
CoreClaw 运行环境是**隔离的网络沙箱**，脚本无法直接访问外网，必须通过平台内置代理出去：

- **HTTP 请求类脚本** — 代理配置是**必须的**。通过 `PROXY_AUTH` 环境变量读取代理地址，将 HTTP 客户端配置为使用 SOCKS5 代理。详见 [代理支持](/developer-guide/worker-definition/platform-features/proxy-support/)。
- **浏览器自动化脚本** — 通过 `ChromeWs` 环境变量（WebSocket 地址）连接远程浏览器，代理由浏览器自动处理，无需手动配置代理。详见 [浏览器指纹](/developer-guide/worker-definition/platform-features/browser-fingerprinting/)。
:::

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
        CoreSDK.Log.info(f"代理认证: {proxy_auth}")

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

### 5. 配置输出配置

在 `output_schema.json` 中定义输出表格结构：

```json
[
    {
        "name": "url",
        "type": "string",
        "description": "采集的 URL"
    },
    {
        "name": "status",
        "type": "string",
        "description": "采集状态"
    }
]
```

### 6. 测试脚本

测试脚本有两种方式：

- **本地测试** — 直接在本机运行脚本，验证核心逻辑是否正确。此阶段无需进行 Worker 化改造，只需确保采集逻辑符合预期。
- **平台测试** — 完成 Worker 化改造（添加 SDK 集成、`input_schema.json`、`output_schema.json`），打包为 ZIP 上传到 CoreClaw，在平台运行环境中进行测试。

### 7. 上传到 CoreClaw

脚本测试通过后，将其打包为 ZIP 文件并上传到 CoreClaw：

1. 登录 [CoreClaw 控制台](https://console.coreclaw.com)
2. 点击上传脚本图标，创建新 Worker
3. 上传 ZIP 代码包
4. 填写标题、描述，选择分类

![上传脚本到 CoreClaw](@/assets/docs/72.png)

上传成功后，您的 Worker 将出现在控制台的 **My Workers** 中。此时您的 Worker 是**私有脚本**，不会对其他用户公开，您可以在控制台直接运行和调试。

### 8. 发布到 Worker Store

当您的 Worker 准备好公开使用时：

1. 进入 **My Workers**，点击您的 Worker
2. 点击 **Settings & Publication**
3. 点击 **Publish** 提交平台审核
4. 审核通过后，您的 Worker 将公开上架到 CoreClaw Worker Store

:::tip
只有发布操作才会进入平台审核流程。在私有状态下，您可以自由迭代和测试，无需经过任何审核。
:::

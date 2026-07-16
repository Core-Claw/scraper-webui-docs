---
title: 快速上手
description: 几分钟内构建您的第一个 Worker
sidebar:
  order: 1
---

几分钟内构建您的第一个 Worker 并在 CoreClaw 上运行。Worker 是你上传到 CoreClaw 的脚本；平台提供隔离沙箱、代理、可选远程浏览器、调度、结果表、以及发布到 Worker Store 的路径。读完这页你将得到一个能在 CoreClaw 上跑的 Worker——如果你已熟悉 Python/Node.js/Go 之一，约需 15–20 分钟。

## 前提条件

- CoreClaw 开发者账户
- Python、Node.js 或 Go 基础知识
- 本机已安装 Git

## 运行环境

写代码前，先理解你的 Worker 在 CoreClaw 上如何执行——这是"本地能跑、上传就挂"最常见的根因。

你的 Worker 跑在**隔离的网络沙箱**里，**无法直接访问外网**。出站流量必须走平台内置代理；浏览器自动化则通过 CDP 连远程浏览器，不走代理。

```
┌──────────────────────── CoreClaw 沙箱 ───────────────────────────┐
│                                                                  │
│   你的 Worker 脚本                                               │
│        │                                                         │
│        ├─ HTTP / fetch 请求 ──►  平台 SOCKS5 代理               │
│        │   读取 PROXY_AUTH 环境变量         （出站网络）         │
│        │                                                         │
│        └─ 浏览器自动化 ──────►  远程浏览器（CDP）               │
│            ChromeWs / CamoufoxDomain        代理由浏览器自动处理  │
│            / LightpandaDomain                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- **HTTP 请求类脚本** — 代理配置是**必须的**。通过 `PROXY_AUTH` 环境变量读取代理地址，将 HTTP 客户端配置为使用 SOCKS5 代理。详见 [代理支持](/zh-cn/developer-guide/worker-definition/platform-features/proxy-support/)。
- **浏览器自动化脚本** — 通过 `ChromeWs`、`CamoufoxDomain` 或 `LightpandaDomain` 连接远程浏览器（CDP/WebSocket）。代理由浏览器自动处理，无需手动配置。详见 [浏览器指纹](/zh-cn/developer-guide/worker-definition/platform-features/browser-fingerprinting/)。

:::note[本地模式]
使用 CoreClaw SDK 在本地运行 Worker 即将上线。目前流程是：编写 → 上传 → 在平台运行时测试。
:::

## 开发方式

CoreClaw 支持两种方式：

- **迁移已有脚本** — 给你已有的脚本加上 CoreClaw SDK 集成、`input_schema.json` 和 `output_schema.json`。
- **从模板开始** — 克隆 CoreClaw demo 仓库直接开发。下文步骤走这条路径。

## 分步指南

### 1. 克隆模板

选择您偏好的语言并克隆演示仓库：

- **Python**：[Python-Worker-Demo](https://github.com/Core-Claw/Python-Worker-Demo)
- **Node.js**：[Node-Worker-Demo](https://github.com/Core-Claw/Node-Worker-Demo)
- **Go**：[Go-Worker-Demo](https://github.com/Core-Claw/Go-Worker-Demo)

```bash
# Python
git clone https://github.com/Core-Claw/Python-Worker-Demo.git

# Node.js
git clone https://github.com/Core-Claw/Node-Worker-Demo.git

# Go
git clone https://github.com/Core-Claw/Go-Worker-Demo.git
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

- **input_schema.json** — 定义用户运行 Worker 时看到的输入表单。详见 [输入配置](/zh-cn/developer-guide/worker-definition/input-schema/)。
- **output_schema.json** — 定义 Worker 结果的输出表格结构。详见 [输出配置](/zh-cn/developer-guide/worker-definition/output-schema/).
- **sdk.py / sdk_pb2.py / sdk_pb2_grpc.py** — CoreClaw SDK 模块，用于与平台运行时通信。

### 3. 编写脚本

编辑主入口文件实现采集逻辑。各语言结构一致——**取输入 → 配代理 → 发请求 → 设表头 → 推数据**。HTTP 脚本为何必须配代理见上方[运行环境](#运行环境)。

CoreClaw SDK 在各语言都暴露四个命名空间：`Parameter`（输入）、`Result`（输出）、`Log`（日志），以及代理/浏览器环境变量。

**Python**（`main.py`）：

```python
import asyncio
import os
import httpx
from sdk import CoreSDK

async def run():
    try:
        # 1. 获取输入参数
        input_json_dict = CoreSDK.Parameter.get_input_json_dict()
        CoreSDK.Log.debug(f"输入参数: {input_json_dict}")

        # 2. 配置平台通过 PROXY_AUTH 提供的 SOCKS5 代理。
        #    HTTP 脚本必须走代理——沙箱会拦截直连。
        proxy_auth = os.environ.get("PROXY_AUTH")
        CoreSDK.Log.info(f"已配置代理: {bool(proxy_auth)}")

        # 3. 业务逻辑——经代理发真实请求
        url = input_json_dict.get("url")
        CoreSDK.Log.info(f"正在处理 URL: {url}")

        with httpx.Client(proxy=proxy_auth and f"socks5://{proxy_auth}", timeout=30) as client:
            resp = client.get(url)
            title = _extract_title(resp.text)  # 你的解析逻辑

        result = {"url": url, "status_code": resp.status_code, "title": title}

        # 4. 设置表头（key 必须与 output_schema.json 一致）
        headers = [
            {"label": "URL", "key": "url", "format": "text"},
            {"label": "状态码", "key": "status_code", "format": "text"},
            {"label": "标题", "key": "title", "format": "text"},
        ]
        CoreSDK.Result.set_table_header(headers)

        # 5. 推送结果数据
        CoreSDK.Result.push_data(result)

        CoreSDK.Log.info("脚本执行完成")

    except Exception as e:
        CoreSDK.Log.error(f"执行错误: {e}")
        raise

def _extract_title(html: str) -> str:
    import re
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    return (m.group(1).strip() if m else "")[:200]

if __name__ == "__main__":
    asyncio.run(run())
```

**Node.js**（`index.js`）：

```javascript
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')
const { HttpsProxyAgent } = require('socks-proxy-agent')
const fetch = require('node-fetch') // 或 Node 18+ 的全局 fetch

async function run() {
    try {
        // 1. 获取输入参数
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`输入参数: ${JSON.stringify(inputJson)}`)

        // 2. 从 PROXY_AUTH 配置 SOCKS5 代理（HTTP 必须）
        const proxyAuth = process.env.PROXY_AUTH
        const agent = proxyAuth
            ? new HttpsProxyAgent(`socks5://${proxyAuth}`)
            : undefined
        await coresdk.log.info(`已配置代理: ${Boolean(proxyAuth)}`)

        // 3. 业务逻辑——经代理发真实请求
        const url = inputJson?.url
        await coresdk.log.info(`正在处理 URL: ${url}`)

        const resp = await fetch(url, { agent })
        const html = await resp.text()
        const title = (html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] ?? '').trim().slice(0, 200)

        const result = { url, status_code: resp.status, title }

        // 4. 设置表头（key 必须与 output_schema.json 一致）
        const headers = [
            { label: 'URL', key: 'url', format: 'text' },
            { label: '状态码', key: 'status_code', format: 'text' },
            { label: '标题', key: 'title', format: 'text' },
        ]
        await coresdk.result.setTableHeader(headers)

        // 5. 推送结果数据
        await coresdk.result.pushData(result)

        await coresdk.log.info('脚本执行完成')
    } catch (e) {
        await coresdk.log.error(`执行错误: ${e}`)
        throw e
    }
}

run()
```

**Go**（`main.go`）：

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "regexp"
    "strings"

    coresdk "your_module/GoSdk"
)

func main() {
    ctx := context.Background()

    // 1. 获取输入参数
    inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("获取输入参数失败: %v", err))
        return
    }
    var input struct{ URL string `json:"url"` }
    _ = json.Unmarshal([]byte(inputJSON), &input)

    // 2. 从 PROXY_AUTH 配置 SOCKS5 代理（HTTP 必须）
    proxyAuth := os.Getenv("PROXY_AUTH")
    coresdk.Log.Info(ctx, fmt.Sprintf("已配置代理: %v", proxyAuth != ""))
    // 在此把 proxyAuth 接入 http.Transport（见代理支持文档）

    // 3. 业务逻辑——发真实请求
    resp, err := http.Get(input.URL)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("请求失败: %v", err))
        return
    }
    defer resp.Body.Close()
    body, _ := io.ReadAll(resp.Body)
    re := regexp.MustCompile(`(?is)<title[^>]*>(.*?)</title>`)
    title := strings.TrimSpace(re.FindStringSubmatch(string(body))[1])
    if len(title) > 200 { title = title[:200] }

    result := map[string]any{
        "url":         input.URL,
        "status_code": resp.StatusCode,
        "title":       title,
    }

    // 4. 设置表头（key 必须与 output_schema.json 一致）
    headers := []*coresdk.TableHeaderItem{
        {Label: "URL", Key: "url", Format: "text"},
        {Label: "状态码", Key: "status_code", Format: "text"},
        {Label: "标题", Key: "title", Format: "text"},
    }
    if _, err := coresdk.Result.SetTableHeader(ctx, headers); err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("设置表头失败: %v", err))
        return
    }

    // 5. 推送结果数据
    jsonBytes, _ := json.Marshal(result)
    if _, err := coresdk.Result.PushData(ctx, string(jsonBytes)); err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("推送数据失败: %v", err))
        return
    }
    coresdk.Log.Info(ctx, "脚本执行完成")
}
```

:::note[HTTP 必须配代理]
如果你的 Worker 发 HTTP/fetch 请求却不走 `PROXY_AUTH`，沙箱会拦截，运行以连接/超时错误失败。浏览器自动化 Worker 不受此限——远程浏览器会替你处理代理。
:::

### 4. 配置输入配置

在 `input_schema.json` 中定义输入表单：

```json
{
    "description": "我的第一个 Worker",
    "concurrency": {
        "fields": ["url"]
    },
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

在 `output_schema.json` 中定义输出表格结构。`name` 字段必须与你在第 3 步推送数据的 key 一致，每个 `type` 与你在 `set_table_header` 用的 `format` 配对（`string` ↔ `text` 等）：

```json
[
    {
        "name": "url",
        "type": "string",
        "description": "采集的 URL"
    },
    {
        "name": "status_code",
        "type": "string",
        "description": "响应的 HTTP 状态码"
    },
    {
        "name": "title",
        "type": "string",
        "description": "页面 <title>"
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

### 8. 在控制台运行与调试

发布前，先在平台运行时上验证你的 Worker：

1. 打开 **My Workers** → 点击你的 Worker 进入详情页。
2. 填写测试输入（表单由你的 `input_schema.json` 生成）。
3. 点击 **Run** 启动一次运行——代理/沙箱问题在这一步暴露，先用单个 URL 试。
4. 观察运行状态变化 `READY → RUNNING → SUCCEEDED`（或 `FAILED`）。
5. 跑完后看三处：
   - **Results** —— 由 `output_schema.json` + `set_table_header` 的 key 构成的表。空或列错位通常是 schema 与 `push_data` 的 key 不一致。
   - **Logs** —— 你通过 `CoreSDK.Log.*` 打的所有日志。这是平台上的唯一调试手段。
6. 若运行失败，改代码、重新打包 ZIP、重新上传——私有 Worker 自由迭代，无需审核。

:::tip[常见首次运行失败]
连接/超时错误 = 你的 HTTP 代码没走 `PROXY_AUTH`。结果为空 = schema 与表头 key 不一致。完全没有日志 = 脚本在第一个 `Log.*` 之前就崩了——给入口包一层 try/except。
:::

### 9. 发布到 Worker Store

当您的 Worker 准备好公开使用时：

1. 进入 **My Workers**，点击您的 Worker
2. 点击 **Settings & Publication**
3. 点击 **Publish** 提交平台审核
4. 审核通过后，您的 Worker 将公开上架到 CoreClaw Worker Store

:::tip
只有发布操作才会进入平台审核流程。在私有状态下，您可以自由迭代和测试，无需经过任何审核。
:::

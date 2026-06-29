---
title: Cline
description: 通过 Streamable HTTP 将 Cline VS Code 扩展连接到 CoreClaw MCP 服务。
sidebar:
  order: 7
---

将 [Cline](https://github.com/cline/cline) VS Code 扩展连接到 CoreClaw MCP 服务，让 AI 编程助手可以在 VS Code 中发现 CoreClaw Worker、运行任务、查询状态并获取结果。

## 前提条件

- 已安装 VS Code 和 [Cline 扩展](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
- CoreClaw 账户及 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Cline 通过 **Streamable HTTP** 传输协议支持 MCP。您可以在 Cline 设置面板中进行配置。

### 步骤 1：打开 Cline 设置

1. 打开 VS Code。
2. 点击侧边栏中的 Cline 图标。
3. 进入 **Settings -> MCP Servers**。
4. 点击 **Add MCP Server**。

### 步骤 2：添加 CoreClaw MCP 配置

填写表单：

- **名称**：`coreclaw`
- **传输**：`HTTP`
- **URL**：`https://mcp.coreclaw.com/mcp`
- **请求头**：
  - `api-key`: `YOUR_CORECLAW_API_KEY`

将 `YOUR_CORECLAW_API_KEY` 替换为您的实际 CoreClaw API 密钥。

### 步骤 3：保存并重启

1. 点击 **保存**。
2. 重启 VS Code 使配置生效。

## 验证连接

1. 打开 VS Code 并开始新的 Cline 对话。
2. 询问：*"在 CoreClaw 上查找 Amazon Worker。"*
3. Cline 应该调用 `list_store_workers` 并返回匹配的 Worker。

## 对话示例

> **您：** 找个 Google Maps Worker，提取纽约时代广场附近的餐厅数据。
>
> **Cline：** 我会查找 Google Maps Worker，查看输入 schema，然后为您运行。*[调用 `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## 故障排除

### 工具未出现

- 修改 MCP 配置后重启 VS Code。
- 确认 MCP 服务器 URL 是 `https://mcp.coreclaw.com/mcp`。
- 检查是否已设置 `api-key` 请求头。

### 认证错误

- 确认 `api-key` 请求头的值与 CoreClaw API 密钥完全匹配。
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 验证密钥是否有效。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)

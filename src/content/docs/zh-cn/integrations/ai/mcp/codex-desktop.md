---
title: Codex Desktop
description: 通过 Streamable HTTP 将 OpenAI Codex 桌面应用连接到 CoreClaw MCP 服务。
sidebar:
  order: 2
---

将 [OpenAI Codex](https://openai.com/codex) 桌面应用连接到 CoreClaw MCP 服务，让您可以直接从 Codex 对话中发现 CoreClaw Worker、运行任务、查询状态并获取结果。

## 前提条件

- 已安装 [Codex 桌面应用](https://openai.com/codex)
- CoreClaw 账户及 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Codex 桌面应用通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过图形界面进行配置。

### 步骤 1：打开设置

1. 打开 Codex 桌面应用。
2. 点击个人头像 -> **设置**。
3. 导航到 **Connectors & Extensions（连接器与扩展）**。

### 步骤 2：添加 MCP 服务器

1. 点击 **Add MCP Server** 或 **+**。
2. 填写表单：
   - **名称**：`CoreClaw`
   - **传输**：`HTTP`
   - **URL**：`https://mcp.coreclaw.com/mcp`
   - **请求头**：
     - `api-key`: `YOUR_CORECLAW_API_KEY`

将 `YOUR_CORECLAW_API_KEY` 替换为您的实际 CoreClaw API 密钥。

![Codex Desktop MCP 配置](@/assets/docs/mcp-1.png)

### 步骤 3：保存并重启

1. 点击 **保存**。
2. 完全重启 Codex 桌面应用，使配置生效。

## 验证连接

1. 打开 Codex 桌面应用并开始新对话。
2. 查看消息输入区域是否出现工具图标。
3. 询问：*"在 CoreClaw 上查找 Amazon Worker。"*
4. Codex 应该调用 `list_store_workers` 并返回匹配的 Worker。

## 对话示例

> **您：** 找个 Google Maps Worker，提取纽约中央公园附近的餐厅数据。
>
> **Codex：** 我会查找 Google Maps Worker，查看输入 schema，然后为您运行。*[调用 `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## 故障排除

### 工具未出现

- 修改 MCP 配置后重启 Codex 桌面应用。
- 确认 MCP URL 是 `https://mcp.coreclaw.com/mcp`。
- 确认 API 密钥正确且有效。

### 认证错误

- 确认 `api-key` 请求头的值与 CoreClaw API 密钥完全匹配。
- 托管 MCP 服务也支持 `X-API-Key` 和 `Authorization: Bearer YOUR_CORECLAW_API_KEY`。
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 验证密钥是否有效。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)

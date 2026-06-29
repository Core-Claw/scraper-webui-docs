---
title: Claude Desktop
description: 通过 Streamable HTTP 将 Claude Desktop 连接到 CoreClaw MCP 服务。
sidebar:
  order: 1
---

将 [Claude Desktop](https://claude.ai/download) 连接到 CoreClaw MCP 服务，让 Claude 可以直接从对话中发现 CoreClaw Worker、运行任务、查询状态并获取结果。

## 前提条件

- 已安装 [Claude Desktop](https://claude.ai/download)
- CoreClaw 账户及 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Claude Desktop 通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过图形界面进行配置。

### 步骤 1：打开设置

1. 打开 Claude Desktop。
2. 点击个人头像 -> **Settings（设置）**。
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

![Claude Desktop MCP 配置](@/assets/docs/mcp-3.png)

### 步骤 3：保存并重启

1. 点击 **保存**。
2. 完全重启 Claude Desktop，使配置生效。

## 验证连接

1. 在 Claude Desktop 中打开新对话。
2. 查看消息输入区域是否出现工具图标。
3. 询问 Claude：*"在 CoreClaw 上查找 Amazon Worker。"*
4. Claude 应该调用 `list_store_workers` 并返回匹配的 Worker。

## 对话示例

> **您：** 找个 Google Maps Worker，提取纽约时代广场附近的餐厅数据。
>
> **Claude：** 我会查找 Google Maps Worker，查看输入 schema，然后为您运行。*[调用 `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## 故障排除

### 工具未出现

- 修改 MCP 配置后重启 Claude Desktop。
- 检查 [Claude Desktop 日志](#claude-desktop-日志) 中的连接错误。
- 确认 API 密钥正确且有效。

### 认证错误

- 确认 `api-key` 请求头的值与 CoreClaw API 密钥完全匹配。
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 检查密钥是否已过期。

### Claude Desktop 日志

| 平台 | 日志位置 |
|------|----------|
| macOS | `~/Library/Logs/Claude/` |
| Windows | `%APPDATA%\Claude\logs\` |
| Linux | `~/.config/Claude/logs/` |

查找文件名中包含 `mcp` 的日志文件。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)

---
title: ChatGPT / OpenAI
description: 通过 Streamable HTTP 将 ChatGPT 连接到 CoreClaw MCP 服务。
sidebar:
  order: 4
---

通过自定义 MCP 连接器将 ChatGPT 连接到 CoreClaw MCP 服务，让您可以直接从 ChatGPT 对话中发现 CoreClaw Worker、运行任务、查询状态并获取结果。

## 前提条件

- 拥有 ChatGPT 访问权限的 OpenAI 账户
- CoreClaw 账户及 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

当您的账户支持 **应用与连接器** 功能时，可以创建一个指向 CoreClaw 托管 MCP 入口的自定义连接器。

### 步骤 1：启用开发者模式

1. 打开 ChatGPT 设置。
2. 导航到 **开发者模式** 并启用。
3. 确认可创建自定义连接器。

### 步骤 2：创建 MCP 连接器

1. 在 ChatGPT 中前往 **设置 > 应用与连接器 > 创建**。
2. 填写字段：
   - **名称**：`coreclaw-mcp`
   - **描述**：CoreClaw MCP 服务，用于 Worker 发现、执行、结果、导出和日志
   - **MCP 服务器 URL**：`https://mcp.coreclaw.com/mcp`
   - **认证**：如可用，选择 API Key 或自定义请求头
3. 添加请求头：
   - **请求头名称**：`api-key`
   - **请求头值**：`YOUR_CORECLAW_API_KEY`

### 步骤 3：保存并授权

1. 点击 **创建**。
2. 出现提示时授权连接。

## 验证连接

1. 在 ChatGPT 中打开新对话。
2. 在编辑器工具或连接器菜单中选择 **CoreClaw MCP** 连接器。
3. 询问：*"在 CoreClaw 上查找 Amazon Worker。"*
4. ChatGPT 应该调用 `list_store_workers` 并返回匹配的 Worker。

## 对话示例

> **您：** 找个 Google Maps Worker，提取纽约时代广场附近的餐厅数据。
>
> **ChatGPT：** 我会查找 Google Maps Worker，查看输入 schema，然后为您运行。*[调用 `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## 限制说明

- ChatGPT MCP 连接器可用性可能因账户和套餐而异。
- 工具选择和执行可能比直接 API 集成更慢。
- 自定义连接器可能需要开发者模式。
- 某些 Worker 运行可能触发安全或确认提示。

## 故障排除

### 连接器未出现

- 确保已启用开发者模式。
- 检查 MCP 服务器 URL 是否准确为 `https://mcp.coreclaw.com/mcp`。
- 验证 API 密钥是否正确。

### 工具加载失败

- 尝试移除并重新添加连接器。
- 确认连接器会发送 `api-key` 请求头。
- 如可用，查看 ChatGPT 服务状态和连接器日志。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)

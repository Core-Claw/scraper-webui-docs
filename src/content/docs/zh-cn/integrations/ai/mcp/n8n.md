---
title: n8n
description: 通过 Streamable HTTP 将 n8n 工作流连接到 CoreClaw MCP 服务。
sidebar:
  order: 8
---

将 [n8n](https://n8n.io) 工作流连接到 CoreClaw MCP 服务，让自动化流程可以发现 CoreClaw Worker、运行任务、查询状态并获取结果。

## 前提条件

- n8n 实例
- CoreClaw 账户及 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

n8n 可通过 MCP Client Tool 节点使用 **Streamable HTTP** 传输协议连接 CoreClaw MCP。

### 步骤 1：添加 MCP Client Tool 节点

1. 在 n8n 工作流中添加 **MCP Client Tool** 节点。
2. 将传输方式设置为 **Streamable HTTP**。

### 步骤 2：配置 MCP 服务

填写节点设置：

- **URL**：`https://mcp.coreclaw.com/mcp`
- **请求头**：
  - `api-key`: `YOUR_CORECLAW_API_KEY`

将 `YOUR_CORECLAW_API_KEY` 替换为您的实际 CoreClaw API 密钥。

### 步骤 3：接入工作流

1. 将 MCP Client Tool 节点连接到 AI Agent 节点。
2. 将 AI Agent 节点连接到后续处理节点。

## 验证连接

1. 执行工作流。
2. AI Agent 应该能够调用 `list_store_workers` 等 CoreClaw 工具。

## 示例工作流

```text
[Trigger] -> [AI Agent] -> [MCP Client Tool: CoreClaw] -> [Process Results] -> [Save to Database]
```

AI Agent 示例提示：

> 在 CoreClaw 上查找 Amazon 商品 Worker，查看输入 schema，用这个商品 URL 运行，并返回商品标题、价格和评分。

AI Agent 应该按以下顺序执行：

1. 调用 `list_store_workers` 查找 Amazon Worker。
2. 调用 `get_worker_input_schema` 查看必填输入。
3. 调用 `run_worker` 并传入 `input_json`。
4. 轮询 `get_worker_run` 直到运行结束。
5. 调用 `list_worker_run_results` 或 `export_worker_run_results` 获取数据。

## 故障排除

### 工具未出现

- 确认 MCP Client Tool URL 是 `https://mcp.coreclaw.com/mcp`。
- 确认已设置 `api-key` 请求头。
- 查看 n8n 执行日志中的连接错误。

### 认证错误

- 确认 `api-key` 请求头的值与 CoreClaw API 密钥完全匹配。
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 验证密钥是否有效。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)
- [n8n 社区节点](/zh-cn/integrations/workflows-and-notifications/n8n/) —— n8n 专用 CoreClaw 节点（无需 AI Agent）
- [coreclaw-n8n-workflows](https://github.com/Core-Claw/coreclaw-n8n-workflows) —— 生产级 n8n 工作流模板

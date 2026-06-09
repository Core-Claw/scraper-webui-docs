---
title: n8n
description: 通过 Streamable HTTP 将 n8n 工作流连接到 CoreClaw MCP 服务。
sidebar:
  order: 8
---

将 [n8n](https://n8n.io) 工作流连接到 CoreClaw MCP 服务，让您的自动化流程可以搜索爬虫、运行任务并将数据作为工作流的一部分进行检索。

## 前提条件

- [n8n](https://n8n.io) 实例（自托管或云端）
- CoreClaw 账户及 API 密钥 — 从 [控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

n8n 通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过 MCP Client Tool 节点进行配置。

### 步骤 1：添加 MCP Client Tool 节点

1. 在 n8n 工作流中，添加 **MCP Client Tool** 节点
2. 将传输方式设置为 **Streamable HTTP**

### 步骤 2：配置 MCP 服务器

填写节点设置：

- **URL**：`https://mcp.coreclaw.com/mcp`
- **请求头**：
  - `api-key`: `scraper_api_YOUR_KEY_HERE`

将 `scraper_api_YOUR_KEY_HERE` 替换为您的实际 CoreClaw API 密钥。

### 步骤 3：连接到工作流

1. 将 MCP Client Tool 节点连接到 AI Agent 节点
2. 将 AI Agent 节点连接到后续处理节点

## 验证连接

1. 执行工作流
2. AI Agent 应该能够调用 CoreClaw 工具，如 `search_scrapers`

## 工作流示例

典型的 n8n + CoreClaw MCP 工作流：

```
[触发器] → [AI Agent] → [MCP Client Tool: CoreClaw] → [处理结果] → [保存到数据库]
```

**AI Agent 的示例提示词：**

> 在 CoreClaw 上搜索 Amazon 商品爬虫，用这个 URL 运行它：https://www.amazon.com/dp/B0CHHSFMRL，然后返回商品标题、价格和评分。

AI Agent 将自动：
1. 调用 `search_scrapers` 查找 Amazon 爬虫
2. 调用 `get_scraper_details` 获取参数 schema
3. 调用 `run_scraper` 传入 URL
4. 轮询 `get_run_status` 直到完成
5. 调用 `get_run_results` 获取数据

## 故障排除

### 工具未出现

- 验证 MCP Client Tool 节点 URL 是否正确
- 确保 `api-key` 请求头已设置
- 检查 n8n 日志中的连接错误

### 认证错误

- 确保 `api-key` 请求头的值与您的 CoreClaw API 密钥完全匹配
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 中验证密钥是否有效

## 下一步

- [→ 返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [→ CoreClaw API 文档](/zh-cn/api/)

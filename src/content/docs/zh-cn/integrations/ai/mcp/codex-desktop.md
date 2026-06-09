---
title: Codex Desktop
description: 通过 Streamable HTTP 将 OpenAI Codex 桌面应用连接到 CoreClaw MCP 服务。
sidebar:
  order: 2
---

将 [OpenAI Codex](https://openai.com/codex) 桌面应用连接到 CoreClaw MCP 服务，让您可以直接从 Codex 对话中搜索爬虫、运行任务并获取数据。

## 前提条件

- 已安装 [Codex 桌面应用](https://openai.com/codex)
- CoreClaw 账户及 API 密钥 — 从 [控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Codex 桌面应用通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过图形界面进行配置。

### 步骤 1：打开设置

1. 打开 Codex 桌面应用
2. 点击个人头像 → **设置**
3. 导航到 **Connectors & Extensions（连接器与扩展）**

### 步骤 2：添加 MCP 服务器

1. 点击 **Add MCP Server** 或 **+**
2. 填写表单：
   - **名称**：`CoreClaw`
   - **传输**：`HTTP`
   - **URL**：`https://mcp.coreclaw.com/mcp`
   - **请求头**：
     - `api-key`: `scraper_api_YOUR_KEY_HERE`

将 `scraper_api_YOUR_KEY_HERE` 替换为您的实际 CoreClaw API 密钥。

![Codex Desktop MCP 配置](@/assets/docs/mcp-1.png)

### 步骤 3：保存并重启

1. 点击 **保存**
2. **完全重启 Codex 桌面应用** 使配置生效

## 验证连接

1. 打开 Codex 桌面应用并开始新对话
2. 查看消息输入区域是否出现 **工具图标** — 这表示 MCP 工具已可用
3. 询问：*"在 CoreClaw 上搜索 Amazon 爬虫"*
4. Codex 应该调用 `search_scrapers` 并返回结果

## 对话示例

连接成功后，您可以要求 Codex 执行抓取任务：

> **您：** 找个 Twitter 爬虫，提取 @elonmusk 的最新推文
>
> **Codex：** 我来搜索 Twitter 爬虫并为您运行。*[调用 `search_scrapers` → `get_scraper_details` → `run_scraper` → 轮询状态 → 返回结果]*

## 故障排除

### 工具未出现

- **重启 Codex 桌面应用** — MCP 配置变更需要完全重启
- 验证 API 密钥是否正确且有效

### 认证错误

- 确保 `api-key` 请求头的值与您的 CoreClaw API 密钥完全匹配
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 中验证密钥是否有效

## 下一步

- [→ 返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [→ CoreClaw API 文档](/zh-cn/api/)

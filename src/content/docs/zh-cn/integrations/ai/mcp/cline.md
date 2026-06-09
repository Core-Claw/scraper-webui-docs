---
title: Cline
description: 通过 Streamable HTTP 将 Cline VS Code 扩展连接到 CoreClaw MCP 服务。
sidebar:
  order: 7
---

将 [Cline](https://github.com/cline/cline) VS Code 扩展连接到 CoreClaw MCP 服务，让您的 AI 编程助手可以在 VS Code 内搜索爬虫、运行任务并获取数据。

## 前提条件

- 已安装 VS Code 和 [Cline 扩展](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
- CoreClaw 账户及 API 密钥 — 从 [控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Cline 通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过 Cline 设置面板进行配置。

### 步骤 1：打开 Cline 设置

1. 打开 VS Code
2. 点击侧边栏中的 Cline 图标
3. 前往 **设置 → MCP 服务器**
4. 点击 **添加 MCP 服务器**

### 步骤 2：添加 CoreClaw MCP 配置

填写表单：

- **名称**：`coreclaw`
- **传输**：`HTTP`
- **URL**：`https://mcp.coreclaw.com/mcp`
- **请求头**：
  - `api-key`: `scraper_api_YOUR_KEY_HERE`

将 `scraper_api_YOUR_KEY_HERE` 替换为您的实际 CoreClaw API 密钥。

### 步骤 3：保存并重启

1. 点击 **保存**
2. **重启 VS Code** 使配置生效

## 验证连接

1. 打开 VS Code 并开始新的 Cline 对话
2. 询问：*"在 CoreClaw 上搜索 Amazon 爬虫"*
3. Cline 应该调用 `search_scrapers` 并返回结果

## 对话示例

连接成功后，您可以要求 Cline 执行抓取任务：

> **您：** 找个 Google Maps 爬虫，提取纽约时代广场附近的餐厅数据。
>
> **Cline：** 我来搜索 Google Maps 爬虫并为您运行。*[调用 `search_scrapers` → `get_scraper_details` → `run_scraper` → 轮询状态 → 返回结果]*

## 故障排除

### 工具未出现

- **重启 VS Code** — MCP 配置变更需要重启
- 确保 MCP 服务器 URL 正确
- 检查 `api-key` 请求头是否已设置

### 认证错误

- 确保 `api-key` 请求头的值与您的 CoreClaw API 密钥完全匹配
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 中验证密钥是否有效

## 下一步

- [→ 返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [→ CoreClaw API 文档](/zh-cn/api/)

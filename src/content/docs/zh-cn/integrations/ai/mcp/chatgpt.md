---
title: ChatGPT / OpenAI
description: 通过 Streamable HTTP 将 ChatGPT 连接到 CoreClaw MCP 服务。
sidebar:
  order: 4
---

将 ChatGPT（通过 OpenAI 平台）连接到 CoreClaw MCP 服务，让您可以直接从 ChatGPT 对话中搜索爬虫、运行任务并获取数据。

## 前提条件

- 拥有 ChatGPT 访问权限的 OpenAI 账户
- CoreClaw 账户及 API 密钥 — 从 [控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

ChatGPT 通过 **应用与连接器** 功能支持 MCP 连接器。您需要创建一个指向 CoreClaw MCP 服务的自定义连接器。

### 步骤 1：启用开发者模式

1. 打开 ChatGPT 设置
2. 导航到 **开发者模式** 并启用
3. 消息输入框应出现橙色边框

### 步骤 2：创建 MCP 连接器

1. 在 ChatGPT 中，前往 **设置 > 应用与连接器 > 创建**
2. 填写字段：
   - **名称**：`coreclaw-mcp`
   - **描述**：CoreClaw MCP 服务用于网页抓取
   - **MCP 服务器 URL**：`https://mcp.coreclaw.com/mcp`
   - **认证**：选择 OAuth 或 API Key（如可用）
3. 添加请求头：
   - **请求头名称**：`api-key`
   - **请求头值**：`scraper_api_YOUR_KEY_HERE`

### 步骤 3：保存并授权

1. 点击 **创建**
2. 出现提示时授权连接

## 验证连接

1. 在 ChatGPT 中打开**新对话**
2. 点击消息编辑器旁的 **+** → **更多**
3. 选择您的 **CoreClaw MCP** 连接器
4. 询问：*"在 CoreClaw 上搜索 Amazon 爬虫"*
5. ChatGPT 应该调用 `search_scrapers` 并返回结果

## 对话示例

连接成功后，您可以要求 ChatGPT 执行抓取任务：

> **您：** 找个 Google Maps 爬虫，提取纽约时代广场附近的餐厅数据。
>
> **ChatGPT：** 我来搜索 Google Maps 爬虫并为您运行。*[调用 `search_scrapers` → `get_scraper_details` → `run_scraper` → 轮询状态 → 返回结果]*

## 限制说明

- ChatGPT 中的 MCP 集成处于 **Beta** 阶段，可能有限可用性
- 需要 ChatGPT Plus 或 Pro 订阅
- 工具选择/执行可能**较慢**
- **自定义连接器**需要开发者模式
- 某些爬虫可能触发**安全检查**警告

## 故障排除

### 连接器未出现

- 确保已启用开发者模式
- 检查 MCP 服务器 URL 是否准确为 `https://mcp.coreclaw.com/mcp`
- 验证 API 密钥是否正确

### 工具加载失败

- ChatGPT 可能会静默降级或禁用连接器
- 尝试移除并重新添加连接器
- 查看 ChatGPT 状态页面了解 MCP 服务可用性

## 下一步

- [→ 返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [→ CoreClaw API 文档](/zh-cn/api/)

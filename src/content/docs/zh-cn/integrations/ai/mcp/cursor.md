---
title: Cursor
description: 通过 Streamable HTTP 将 Cursor IDE 连接到 CoreClaw MCP 服务。
sidebar:
  order: 3
---

将 [Cursor](https://cursor.com) IDE 连接到 CoreClaw MCP 服务，让您的 AI 编程助手可以在编辑器内搜索爬虫、运行任务并获取数据。

## 前提条件

- 已安装 [Cursor](https://cursor.com)
- CoreClaw 账户及 API 密钥 — 从 [控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Cursor 通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过创建 `mcp.json` 文件在项目或全局设置中进行配置。

### 步骤 1：创建 MCP 配置文件

**项目级**（推荐用于团队共享）：
```
.your-project/.cursor/mcp.json
```

**全局**（应用于所有项目）：
```
~/.cursor/mcp.json
```

### 步骤 2：添加 CoreClaw MCP 配置

```json
{
  "mcpServers": {
    "coreclaw": {
      "url": "https://mcp.coreclaw.com/mcp",
      "headers": {
        "api-key": "scraper_api_YOUR_KEY_HERE"
      }
    }
  }
}
```

将 `scraper_api_YOUR_KEY_HERE` 替换为您的实际 CoreClaw API 密钥。

![Cursor IDE MCP 配置](@/assets/docs/mcp-4.png)

### 步骤 3：重启 Cursor

保存配置后，**重启 Cursor** 使配置生效。

## 验证连接

1. 打开 Cursor 并开始新对话（Cmd/Ctrl + L）
2. 切换到 **Agent** 模式
3. 询问：*"在 CoreClaw 上搜索 Amazon 爬虫"*
4. Cursor 应该调用 `search_scrapers` 并返回结果

## 对话示例

连接成功后，您可以要求 Cursor 执行抓取任务：

> **您：** 找个 Google Maps 爬虫，提取纽约中央公园附近的餐厅数据。
>
> **Cursor：** 我来搜索 Google Maps 爬虫并为您运行。*[调用 `search_scrapers` → `get_scraper_details` → `run_scraper` → 轮询状态 → 返回结果]*

## 故障排除

### 工具未出现

- **重启 Cursor** — MCP 配置变更需要重启
- 确保您处于 **Agent** 模式（非 Chat 模式）
- 检查 `mcp.json` 文件是否在正确位置

### 认证错误

- 确保 `api-key` 请求头的值与您的 CoreClaw API 密钥完全匹配
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 中验证密钥是否有效

## 下一步

- [→ 返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [→ CoreClaw API 文档](/zh-cn/api/)

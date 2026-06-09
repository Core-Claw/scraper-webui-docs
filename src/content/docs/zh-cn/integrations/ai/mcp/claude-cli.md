---
title: Claude CLI
description: 通过 Streamable HTTP 将 Claude CLI (Claude Code) 连接到 CoreClaw MCP 服务。
sidebar:
  order: 11
---

将 [Claude CLI](https://github.com/anthropics/claude-code)（也称为 Claude Code）连接到 CoreClaw MCP 服务，让您可以直接从终端对话中搜索爬虫、运行任务并获取数据。

## 前提条件

- 已安装 [Claude CLI](https://github.com/anthropics/claude-code)（`npm install -g @anthropics/claude-code`）
- CoreClaw 账户及 API 密钥 — 从 [控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Claude CLI 通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过 JSON 配置文件进行配置。

### 步骤 1：创建或编辑 MCP 配置文件

在项目目录（或任意位置）创建名为 `claude-mcp.json` 的文件：

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

### 步骤 2：使用 MCP 配置启动 Claude CLI

```bash
claude --mcp-config claude-mcp.json
```

您也可以将配置放在 `~/.config/claude/mcp.json`（macOS/Linux）或 `%APPDATA%\claude\mcp.json`（Windows）以实现自动加载。

## 验证连接

1. 使用 MCP 配置启动 Claude CLI
2. 询问 Claude：*"在 CoreClaw 上搜索 Amazon 爬虫"*
3. Claude 应该调用 `search_scrapers` 并返回结果

## 对话示例

连接成功后，您可以直接从终端执行抓取任务：

> **您：** 找个 Twitter 爬虫，提取 @elonmusk 的最新推文
>
> **Claude：** 我来搜索 Twitter 爬虫并为您运行。*[调用 `search_scrapers` → `get_scraper_details` → `run_scraper` → 轮询状态 → 返回结果]*

## 故障排除

### MCP 配置未加载

- 使用 `--mcp-config` 时验证 JSON 文件路径是否正确
- 确保 JSON 格式有效（无尾随逗号，引号正确）
- 检查 Claude CLI 版本 — MCP 支持需要较新版本

### 认证错误

- 确保 `api-key` 请求头的值与您的 CoreClaw API 密钥完全匹配
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 中验证密钥是否有效

### 工具不可用

- 确认 Claude CLI 支持 Streamable HTTP 传输
- 配置变更后尝试重启 Claude 会话

## 下一步

- [→ 返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [→ CoreClaw API 文档](/zh-cn/api/)

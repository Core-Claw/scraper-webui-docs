---
title: Claude CLI
description: 通过 Streamable HTTP 将 Claude CLI (Claude Code) 连接到 CoreClaw MCP 服务。
sidebar:
  order: 11
---

将 [Claude CLI](https://github.com/anthropics/claude-code)（Claude Code）连接到 CoreClaw MCP 服务，让您可以直接从终端对话中发现 CoreClaw Worker、运行任务、查询状态并获取结果。

## 前提条件

- 已安装 [Claude CLI](https://github.com/anthropics/claude-code)（`npm install -g @anthropics/claude-code`）
- CoreClaw 账户及 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Claude CLI 通过 **Streamable HTTP** 传输协议支持 MCP。您可以通过 JSON 配置文件进行配置。

### 步骤 1：创建或编辑 MCP 配置文件

在项目目录或您偏好的配置位置创建 `claude-mcp.json`：

```json
{
  "mcpServers": {
    "coreclaw": {
      "url": "https://mcp.coreclaw.com/mcp",
      "headers": {
        "api-key": "YOUR_CORECLAW_API_KEY"
      }
    }
  }
}
```

将 `YOUR_CORECLAW_API_KEY` 替换为您的实际 CoreClaw API 密钥。

### 步骤 2：使用 MCP 配置启动 Claude CLI

```bash
claude --mcp-config claude-mcp.json
```

如果您的 Claude 安装会自动读取配置，也可以将配置放在 macOS/Linux 的 `~/.config/claude/mcp.json` 或 Windows 的 `%APPDATA%\claude\mcp.json`。

## 验证连接

1. 使用 MCP 配置启动 Claude CLI。
2. 询问 Claude：*"在 CoreClaw 上查找 Amazon Worker。"*
3. Claude 应该调用 `list_store_workers` 并返回匹配的 Worker。

## 对话示例

> **您：** 找个 Google Maps Worker，提取纽约时代广场附近的餐厅数据。
>
> **Claude：** 我会查找 Google Maps Worker，查看输入 schema，然后为您运行。*[调用 `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## 故障排除

### MCP 配置未加载

- 使用 `--mcp-config` 时确认 JSON 文件路径正确。
- 确认 JSON 格式有效。
- 配置变更后重启 Claude 会话。

### 认证错误

- 确认 `api-key` 请求头的值与 CoreClaw API 密钥完全匹配。
- 托管 MCP 服务也支持 `X-API-Key` 和 `Authorization: Bearer YOUR_CORECLAW_API_KEY`。
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 验证密钥是否有效。

### 工具不可用

- 确认 Claude CLI 支持 Streamable HTTP MCP。
- 查看 Claude 会话日志中的 MCP 连接错误。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)

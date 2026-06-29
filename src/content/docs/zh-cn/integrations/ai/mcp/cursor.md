---
title: Cursor
description: 通过 Streamable HTTP 将 Cursor IDE 连接到 CoreClaw MCP 服务。
sidebar:
  order: 3
---

将 [Cursor](https://cursor.com) IDE 连接到 CoreClaw MCP 服务，让您的 AI 编程助手可以在编辑器内发现 CoreClaw Worker、运行任务、查询状态并获取结果。

## 前提条件

- 已安装 [Cursor](https://cursor.com)
- CoreClaw 账户及 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置步骤

Cursor 通过 **Streamable HTTP** 传输协议支持 MCP。您可以在项目或全局设置中创建 `mcp.json` 文件。

### 步骤 1：创建 MCP 配置文件

项目级：

```text
.your-project/.cursor/mcp.json
```

全局：

```text
~/.cursor/mcp.json
```

### 步骤 2：添加 CoreClaw MCP 配置

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

![Cursor IDE MCP 配置](@/assets/docs/mcp-4.png)

### 步骤 3：重启 Cursor

保存配置后，重启 Cursor 使配置生效。

## 验证连接

1. 打开 Cursor 并开始新对话。
2. 切换到 **Agent** 模式。
3. 询问：*"在 CoreClaw 上查找 Amazon Worker。"*
4. Cursor 应该调用 `list_store_workers` 并返回匹配的 Worker。

## 对话示例

> **您：** 找个 Google Maps Worker，提取纽约中央公园附近的餐厅数据。
>
> **Cursor：** 我会查找 Google Maps Worker，查看输入 schema，然后为您运行。*[调用 `list_store_workers` -> `get_worker_input_schema` -> `run_worker` -> `get_worker_run` -> `list_worker_run_results`]*

## 故障排除

### 工具未出现

- 修改 MCP 配置后重启 Cursor。
- 确保您处于 **Agent** 模式。
- 检查 `mcp.json` 文件是否在正确位置。

### 认证错误

- 确认 `api-key` 请求头的值与 CoreClaw API 密钥完全匹配。
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 验证密钥是否有效。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)

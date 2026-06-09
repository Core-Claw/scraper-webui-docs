---
title: 通用 HTTP 客户端
description: 将任何支持 MCP 的 HTTP 客户端连接到 CoreClaw MCP 服务。
sidebar:
  order: 9
---

将任何支持 **Streamable HTTP** 传输协议的 MCP 客户端连接到 CoreClaw MCP 服务。

## 前提条件

- 支持 Streamable HTTP 传输的 MCP 客户端
- CoreClaw 账户及 API 密钥 — 从 [控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations) 获取

## 配置方式

任何支持 Streamable HTTP 的 MCP 客户端都可以使用以下配置连接到 CoreClaw：

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

## REST 兼容端点

除了标准的 MCP 端点 `/mcp` 之外，CoreClaw MCP 服务还在 `/mcp/<tool_name>` 暴露了 REST 兼容端点，供偏好按工具调用 HTTP API 的客户端使用：

```bash
# 示例：通过 REST 搜索爬虫
curl -X POST https://mcp.coreclaw.com/mcp/search_scrapers \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{"query": "amazon", "limit": 5}'
```

### 可用的 REST 端点

| 端点 | 方法 | 说明 |
|----------|--------|-------------|
| `/mcp/search_scrapers` | POST | 搜索 CoreClaw Store |
| `/mcp/get_scraper_details` | POST | 获取爬虫详情 |
| `/mcp/run_scraper` | POST | 运行爬虫 |
| `/mcp/get_run_status` | POST | 检查运行状态 |
| `/mcp/get_run_results` | POST | 获取运行结果 |
| `/mcp/export_run_results` | POST | 导出结果 |
| `/mcp/list_runs` | POST | 列出历史运行 |
| `/mcp/abort_run` | POST | 中止运行 |
| `/mcp/get_run_logs` | POST | 获取运行日志 |
| `/mcp/run_task` | POST | 运行保存的任务 |
| `/mcp/rerun` | POST | 重新运行 |
| `/mcp/get_account_info` | POST | 获取账户信息 |

## 使用 curl 测试

您可以使用 curl 测试 MCP 连接：

```bash
# 测试连接（初始化）
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {"name": "test", "version": "1.0"}
    }
  }'

# 列出可用工具
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# 调用工具（搜索爬虫）
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "search_scrapers",
      "arguments": {"query": "amazon", "limit": 5}
    }
  }'
```

## 故障排除

### 连接错误

- 验证 URL 是否准确为 `https://mcp.coreclaw.com/mcp`
- 确保 `api-key` 请求头设置正确
- 检查客户端是否支持 Streamable HTTP 传输

### 认证错误

- 确保 `api-key` 请求头的值与您的 CoreClaw API 密钥完全匹配
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 中验证密钥是否有效

### 工具无法加载

- 确认客户端支持 MCP 协议版本 `2024-11-05`
- 查看客户端日志获取详细错误信息
- 尝试使用 REST 端点作为备选方案

## 下一步

- [→ 返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [→ CoreClaw API 文档](/zh-cn/api/)

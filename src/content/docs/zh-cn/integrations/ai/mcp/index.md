---
title: CoreClaw MCP 服务
description: 通过 Model Context Protocol (MCP) 将 AI Agent 连接到 CoreClaw 平台——搜索爬虫、运行任务、获取数据，全部通过自然语言完成。
sidebar:
  order: 0
---

CoreClaw MCP 服务让 AI 应用通过 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 与 CoreClaw 平台进行交互。连接后，您的 AI Agent 可以搜索 CoreClaw Store 中的爬虫、使用自定义参数运行它们，并获取结构化数据——全部通过自然语言对话完成。

## 架构

```
用户对话 → AI Agent → MCP 协议 → coreclaw-mcp-server → CoreClaw REST API
                            (HTTP)      (Go 二进制)      (openapi.coreclaw.com)
```

服务部署在 **`https://mcp.coreclaw.com`**，支持 **Streamable HTTP** 传输协议，任何兼容 MCP 的客户端都可以直接连接，无需安装本地依赖。

## 前提条件

- CoreClaw 账户 — 如没有请 [注册](https://console.coreclaw.com/sign-up)
- CoreClaw API 密钥 — 在 [CoreClaw 控制台](https://console.coreclaw.com/settings/integrations) 的 **设置 → API & 集成** 页面获取
- 兼容 MCP 的客户端 — 参见下方 [支持的平台](#支持的平台)

> **API 密钥格式：** 您的密钥格式类似 `scraper_api_XXX...`。请妥善保管，切勿泄露。

## 快速开始

在您的 MCP 客户端中添加以下配置：

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

配置完成后，您的 AI Agent 即可开始发现和使用 CoreClaw 爬虫。

## 认证方式

CoreClaw MCP 服务采用 **请求级 API 密钥认证**，通过 `api-key` 请求头传递：

- 每个请求必须在 headers 中包含 `"api-key": "scraper_api_..."`
- 密钥在每次请求时由 CoreClaw 后端验证
- 无需本地环境变量或 OAuth 流程

> **安全提示：** 切勿将 API 密钥提交到版本控制系统。请使用客户端的安全凭据存储功能。

## 可用工具

CoreClaw MCP 服务提供 **12 个工具**，覆盖 CoreClaw API 的全部功能：

### 发现类（无需 API Key）

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `search_scrapers` | 按关键词搜索 CoreClaw Store 中的爬虫 | `GET /api/store` |
| `get_scraper_details` | 获取爬虫版本、参数 schema 和 README | `GET /api/scraper` |

### 执行类（需要 API Key）

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `run_scraper` | 启动异步爬虫任务 | `POST /api/v1/scraper/run` |
| `get_run_status` | 查询运行状态（就绪/运行中/成功/失败） | `POST /api/v1/run/detail` |
| `get_run_results` | 获取分页结果数据 | `POST /api/v1/run/result/list` |
| `export_run_results` | 导出 CSV/JSON 文件 | `POST /api/v1/run/result/export` |

### 管理类（需要 API Key）

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `list_runs` | 查看带过滤的历史运行记录 | `POST /api/v1/run/list` |
| `abort_run` | 中止运行中的爬虫 | `POST /api/v1/scraper/abort` |
| `get_run_logs` | 获取运行日志用于调试 | `POST /api/v1/run/last/log` |
| `run_task` | 执行保存的任务模板 | `POST /api/v1/task/run` |
| `rerun` | 用相同参数重新运行之前的任务 | `POST /api/v1/rerun` |
| `get_account_info` | 查询余额、流量和过期时间 | `POST /api/v1/account/info` |

## 典型工作流

当您要求 AI Agent 抓取数据时，它通常会遵循以下流程：

```
search_scrapers("amazon") 
  → get_scraper_details("amazon-product-scraper")
    → run_scraper(slug, version, custom_params)
      → get_run_status(run_slug) [轮询直到 status=3]
        → get_run_results(run_slug)
```

**对话示例：**

> **您：** 找个 Amazon 爬虫，帮我提取这个商品的数据：https://www.amazon.com/dp/B0CHHSFMRL
>
> **AI：** 我来搜索 Amazon 爬虫，检查参数后为您运行。*[执行上述工作流]*

## 支持的平台

在您的 AI Agent 平台上配置 CoreClaw MCP：

| 平台 | 配置方式 | 指南 |
|------|---------|------|
| **Claude Desktop** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/claude-desktop/) |
| **Codex Desktop** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/codex-desktop/) |
| **Cursor** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/cursor/) |
| **ChatGPT** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/chatgpt/) |
| **VS Code** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/vscode/) |
| **Windsurf** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/windsurf/) |
| **Cline** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/cline/) |
| **n8n** | Streamable HTTP | [→ 配置指南](/zh-cn/integrations/ai/mcp/n8n/) |
| **通用 HTTP** | 任意 MCP 客户端 | [→ 配置指南](/zh-cn/integrations/ai/mcp/generic-http/) |

## REST 兼容端点

除了标准的 MCP 端点 `/mcp` 之外，CoreClaw MCP 服务还在 `/mcp/<tool_name>` 暴露了 REST 兼容端点，供偏好按工具调用 HTTP API 的平台使用：

```bash
# 示例：通过 REST 搜索爬虫
curl -X POST https://mcp.coreclaw.com/mcp/search_scrapers \
  -H "Content-Type: application/json" \
  -H "api-key: scraper_api_YOUR_KEY" \
  -d '{"query": "amazon", "limit": 5}'
```

这对于与 **Coze** 等使用 HTTP 插件模型的平台集成特别有用。

## 速率限制与性能

- **每秒 30 次请求/用户**
- 超出限制返回 HTTP `429` — 请实现指数退避重试
- 结果实时流式传输；大数据集可能需要更长时间

## 故障排除

### 连接错误

| 症状 | 原因 | 解决方案 |
|---------|-------|----------|
| `Invalid API key` (code 20001) | 密钥错误或已过期 | 在控制台 → 设置 → API & 集成 中验证密钥 |
| `Rate limit exceeded` (code 4290) | 请求过于频繁 | 添加指数退避重试逻辑 |
| `Worker does not exist` (code 50001) | scraper_slug 错误 | 从 search_scrapers 结果中确认 slug |
| 工具无法加载 | 客户端不支持 HTTP 传输 | 使用 stdio 模式或更新客户端 |

### 调试清单

1. **验证 API 密钥：** 用 `get_account_info` 进行快速测试
2. **检查传输协议：** 确保客户端支持 Streamable HTTP
3. **验证请求头：** 确认 `api-key` 请求头设置正确
4. **查看日志：** 检查 MCP 客户端日志获取详细错误信息

## 限制说明

- **仅支持 HTTP 模式：** CoreClaw MCP 服务仅支持 Streamable HTTP 传输。仅支持 stdio（本地进程）的客户端需要在本地运行二进制文件。
- **无 OAuth：** 认证仅通过 API 密钥请求头完成 — 不支持 OAuth 或令牌刷新流程。
- **Beta 状态：** MCP 协议和工具可用性可能会演进。查看 [更新日志](/zh-cn/changelog/) 了解最新变化。

## 下一步

- [→ 配置 Claude Desktop](/zh-cn/integrations/ai/mcp/claude-desktop/)
- [→ 配置 Codex Desktop](/zh-cn/integrations/ai/mcp/codex-desktop/)
- [→ 浏览所有平台指南](/zh-cn/integrations/ai/mcp/)
- [→ 阅读 CoreClaw API 文档](/zh-cn/api/)

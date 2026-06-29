---
title: 通用 HTTP 客户端
description: 将任意 Streamable HTTP MCP 客户端或 REST 风格工具调用方连接到 CoreClaw MCP 服务。
sidebar:
  order: 9
---

任何支持 **Streamable HTTP MCP** 的客户端都可以连接到 CoreClaw 托管 MCP 服务。对于不能直接使用 MCP JSON-RPC 的平台，服务还提供按工具调用的 REST 兼容端点。

## 前提条件

- 支持 Streamable HTTP 的 MCP 客户端，或可以发送 `POST` 请求的 HTTP 自动化平台。
- CoreClaw 账户和 API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取。

## MCP 配置

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

如果客户端更适合其他认证格式，服务也支持 `X-API-Key` 和 `Authorization: Bearer YOUR_CORECLAW_API_KEY`。

## REST 兼容端点

每个 MCP 工具也可以通过以下地址调用：

```text
POST https://mcp.coreclaw.com/mcp/<tool_name>
```

请求体传入工具参数 JSON 对象：

```bash
curl -X POST https://mcp.coreclaw.com/mcp/list_store_workers \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"keyword":"amazon","offset":0,"limit":5}'
```

需要认证的运行示例：

```bash
curl -X POST https://mcp.coreclaw.com/mcp/run_worker \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"worker_id":"YOUR_WORKER_ID","version":"latest","input_json":"{\"keyword\":\"coffee\",\"limit\":10}","is_async":true}'
```

## 可用 REST 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/mcp/list_proxy_regions` | POST | 查询代理地区代码 |
| `/mcp/list_store_workers` | POST | 搜索公开 Store Worker |
| `/mcp/list_workers` | POST | 列出当前账户的 Worker |
| `/mcp/get_worker` | POST | 获取 Worker 详情 |
| `/mcp/get_worker_input_schema` | POST | 获取 Worker 输入 schema |
| `/mcp/list_worker_tasks` | POST | 列出已保存 Worker 任务 |
| `/mcp/get_account_info` | POST | 获取账户余额和流量额度 |
| `/mcp/run_worker` | POST | 使用临时输入运行 Worker |
| `/mcp/run_worker_task` | POST | 运行已保存 Worker 任务 |
| `/mcp/list_worker_runs` | POST | 查询运行历史 |
| `/mcp/get_last_worker_run` | POST | 获取当前账户最近一次运行 |
| `/mcp/get_worker_run` | POST | 通过 `run_id` 获取运行 |
| `/mcp/get_worker_last_run` | POST | 获取指定 Worker 最近一次运行 |
| `/mcp/list_last_worker_run_results` | POST | 查看当前账户最近一次运行结果 |
| `/mcp/export_last_worker_run_results` | POST | 导出当前账户最近一次运行结果 |
| `/mcp/get_last_worker_run_log` | POST | 查看当前账户最近一次运行日志 |
| `/mcp/list_worker_run_results` | POST | 查看指定运行结果 |
| `/mcp/export_worker_run_results` | POST | 导出指定运行结果 |
| `/mcp/get_worker_run_log` | POST | 查看指定运行日志 |
| `/mcp/list_worker_last_run_results` | POST | 查看指定 Worker 最近一次运行结果 |
| `/mcp/export_worker_last_run_results` | POST | 导出指定 Worker 最近一次运行结果 |
| `/mcp/get_worker_last_run_log` | POST | 查看指定 Worker 最近一次运行日志 |
| `/mcp/rerun_last_worker_run` | POST | 重跑当前账户最近一次运行 |
| `/mcp/rerun_worker_run` | POST | 重跑指定运行 |
| `/mcp/rerun_worker_last_run` | POST | 重跑指定 Worker 最近一次运行 |
| `/mcp/abort_last_worker_run` | POST | 停止当前账户最近一次活跃运行 |
| `/mcp/abort_worker_run` | POST | 停止指定活跃运行 |
| `/mcp/abort_worker_last_run` | POST | 停止指定 Worker 最近一次活跃运行 |

## 使用 curl 测试

初始化 MCP 会话：

```bash
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
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
```

列出可用工具：

```bash
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

通过 MCP JSON-RPC 调用工具：

```bash
curl -X POST https://mcp.coreclaw.com/mcp \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "list_store_workers",
      "arguments": {"keyword": "amazon", "offset": 0, "limit": 5}
    }
  }'
```

## 常用参数

- `worker_id`：Worker slug 或 owner path。使用 path 时，把 `owner/name` 写成 `owner~name`。
- `run_id`：由 `run_worker`、`run_worker_task` 或运行查询工具返回的运行标识。
- `worker_task_id`：由 `list_worker_tasks` 返回的已保存任务 slug。
- `offset` / `limit`：分页参数，`limit` 通常为 1-100。
- `format`：导出格式，支持 `csv` 或 `json`。
- `filter_keys`：导出时保留的字段，使用逗号分隔。
- `input_json`：`run_worker` 的业务输入 JSON 字符串。
- `raw_input_json`：`run_worker` 的高级参数，可直接传完整 CoreClaw input 对象；不要和 `input_json` 同时使用。

## 故障排除

### 连接错误

- 确认 URL 是 `https://mcp.coreclaw.com/mcp`。
- 确认客户端支持 Streamable HTTP MCP。
- REST 兼容调用请使用 `POST /mcp/<tool_name>`。

### 认证错误

- 确认已设置任一支持的认证头：`api-key`、`X-API-Key` 或 `Authorization: Bearer ...`。
- 在 [控制台](https://console.coreclaw.com/settings/integrations) 验证密钥是否有效。

### 工具错误

- 使用 `list_store_workers` 或 `list_workers` 确认 `worker_id`。
- 组合 `input_json` 前先调用 `get_worker_input_schema`。
- 运行失败或卡住时调用 `get_worker_run_log` 查看日志。

## 下一步

- [返回 MCP 概览](/zh-cn/integrations/ai/mcp/)
- [CoreClaw API 文档](/zh-cn/api/)

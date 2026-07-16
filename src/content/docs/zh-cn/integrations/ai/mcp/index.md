---
title: CoreClaw MCP 服务
description: 通过 Model Context Protocol (MCP) 将 AI Agent 连接到 CoreClaw，用自然语言发现 Worker、运行任务、查询状态并获取结果。
sidebar:
  order: 0
---

CoreClaw MCP 服务通过 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 暴露 CoreClaw OpenAPI v2 的公开工作流。连接后，AI Agent 可以发现 CoreClaw Worker、查看输入 schema、运行 Worker 或已保存任务、查询运行状态、读取日志，并导出结构化结果。

## 架构

```text
用户对话 -> AI Agent -> MCP 协议 -> CoreClaw MCP 服务 -> CoreClaw OpenAPI v2
                              HTTP       mcp.coreclaw.com      openapi.coreclaw.com
```

托管的 Streamable HTTP 入口是：

```text
https://mcp.coreclaw.com/mcp
```

优先使用托管入口。仅在开发、调试或客户端只支持本地 stdio 时，才需要本地运行 `coreclaw-mcp-server`。

## 前提条件

- CoreClaw 账户。如果还没有账户，请先 [注册](https://console.coreclaw.com/sign-up)。
- CoreClaw API 密钥，可在 [控制台 -> 设置 -> API & 集成](https://console.coreclaw.com/settings/integrations) 获取。
- 支持 MCP 的客户端。参见下方 [支持的平台](#支持的平台)。

## 快速开始

在 MCP 客户端中添加以下配置：

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

保存配置后，如果客户端要求重启或重新加载，请完成对应操作。之后 AI Agent 就可以在对话中调用 CoreClaw 工具。

## 认证方式

托管 MCP 服务支持以下任一请求头：

- `api-key: YOUR_CORECLAW_API_KEY`
- `X-API-Key: YOUR_CORECLAW_API_KEY`
- `Authorization: Bearer YOUR_CORECLAW_API_KEY`

MCP 服务会把认证信息转发给 CoreClaw OpenAPI v2，上游请求统一使用 `Authorization: Bearer <token>`。

> 不要把 API 密钥提交到版本控制系统。客户端支持安全凭据存储时，请优先使用该能力。

## 可用工具

CoreClaw MCP 服务公开 **37 个工具**——34 个 OpenAPI v2 操作（1:1）加 3 个编排助手。Worker 版本创建/更新接口和 Worker internal 详情接口属于内部接口，不会通过 MCP 暴露。

### 发现与预检查

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `list_proxy_regions` | 查询代理地区代码和名称 | `GET /api/v2/proxy/region` |
| `list_store_workers` | 搜索公开 Store Worker | `GET /api/v2/store` |
| `list_workers` | 列出当前账户拥有的 Worker | `GET /api/v2/workers` |
| `get_worker` | 获取 Worker 元数据、版本、README 和参数信息 | `GET /api/v2/workers/{workerId}` |
| `get_worker_input_schema` | 获取 Worker 公开输入 schema | `GET /api/v2/workers/{workerId}/input-schema` |
| `get_account_info` | 查询账户余额、流量额度和过期时间 | `GET /api/v2/users/account` |

### Worker 任务（已保存的任务模板）

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `list_worker_tasks` | 列出当前账户保存的 Worker 任务 | `GET /api/v2/worker-tasks` |
| `get_worker_task` | 获取已保存任务的详情 | `GET /api/v2/worker-tasks/{workerTaskId}` |
| `get_worker_task_input` | 获取已保存任务的输入负载 | `GET /api/v2/worker-tasks/{workerTaskId}/input` |
| `create_worker_task` | 创建已保存任务（可选定时） | `POST /api/v2/worker-tasks` |
| `update_worker_task` | 更新任务元数据/定时 | `PUT /api/v2/worker-tasks/{workerTaskId}` |
| `update_worker_task_input` | 仅更新任务的输入负载 | `PUT /api/v2/worker-tasks/{workerTaskId}/input` |
| `delete_worker_task` | 删除已保存任务 | `DELETE /api/v2/worker-tasks/{workerTaskId}` |

### 编排助手

三个便捷工具，把多次 API 调用合并为一次工具调用。

| 工具 | 说明 | 底层调用 |
|------|------|---------|
| `poll_run` | 轮询运行直到终态（或超时） | 重复 `GET /api/v2/worker-runs/{runId}` |
| `verify_run` | 返回结构化判定（`PASS`/`NO_DATA`/`FAILED`/`ERROR_RECORD`/`RUNNING`/`SUBMIT_FAIL`）——检查运行状态后再嗅探首行结果，区分真实数据与仅诊断记录 | `get_worker_run` + `list_worker_run_results` |
| `run_workers_batch` | 一次调用运行最多 50 个 Worker，返回逐项摘要与判定。并发 1–10，可选逐项 `verify` | 每项：`POST /api/v2/workers/{workerId}/runs` + `poll_run`（+ 可选 `verify_run`） |

`poll_run` 接受 `timeout_seconds`（1–900，默认 300）和 `poll_interval_seconds`（1–60，默认 5），成功时可预取少量结果预览（`limit`）。运行时间超过单次 MCP 调用窗口的 Worker 用它。`verify_run` 用来区分真实成功与"CAPTCHA/403 行填满了列表但无真实负载"的假阳性——它会把后者标为 `ERROR_RECORD`。`get_worker_run_log` 还支持进程内 `grep`（管道分隔、大小写不敏感）加 `context_lines` 与 `max_matches`。

### 执行

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `run_worker` | 使用临时 JSON 输入运行 Worker | `POST /api/v2/workers/{workerId}/runs` |
| `run_worker_task` | 运行已保存的 Worker 任务 | `POST /api/v2/worker-tasks/{workerTaskId}/runs` |

### 运行查询

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `list_worker_runs` | 查询运行历史 | `GET /api/v2/worker-runs` |
| `get_last_worker_run` | 查询当前账户最近一次运行 | `GET /api/v2/worker-runs/last` |
| `get_worker_run` | 通过 `run_id` 查询指定运行 | `GET /api/v2/worker-runs/{runId}` |
| `get_worker_last_run` | 查询指定 Worker 最近一次运行 | `GET /api/v2/workers/{workerId}/runs/last` |

### 结果、导出和日志

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `list_last_worker_run_results` | 查看当前账户最近一次运行结果 | `GET /api/v2/worker-runs/last/result` |
| `export_last_worker_run_results` | 导出当前账户最近一次运行结果 | `GET /api/v2/worker-runs/last/export` |
| `get_last_worker_run_log` | 查看当前账户最近一次运行日志 | `GET /api/v2/worker-runs/last/log` |
| `list_worker_run_results` | 查看指定运行结果 | `GET /api/v2/worker-runs/{runId}/result` |
| `export_worker_run_results` | 导出指定运行结果 | `GET /api/v2/worker-runs/{runId}/result/export` |
| `get_worker_run_log` | 查看指定运行日志 | `GET /api/v2/worker-runs/{runId}/log` |
| `list_worker_last_run_results` | 查看指定 Worker 最近一次运行结果 | `GET /api/v2/workers/{workerId}/runs/last/result` |
| `export_worker_last_run_results` | 导出指定 Worker 最近一次运行结果 | `GET /api/v2/workers/{workerId}/runs/last/export` |
| `get_worker_last_run_log` | 查看指定 Worker 最近一次运行日志 | `GET /api/v2/workers/{workerId}/runs/last/log` |

### 重跑和控制

| 工具 | 说明 | 对应 API |
|------|------|---------|
| `rerun_last_worker_run` | 重跑当前账户最近一次运行 | `POST /api/v2/worker-runs/last/rerun` |
| `rerun_worker_run` | 重跑指定运行 | `POST /api/v2/worker-runs/{runId}/rerun` |
| `rerun_worker_last_run` | 重跑指定 Worker 最近一次运行 | `POST /api/v2/workers/{workerId}/runs/last/rerun` |
| `abort_last_worker_run` | 停止当前账户最近一次活跃运行 | `POST /api/v2/worker-runs/last/abort` |
| `abort_worker_run` | 停止指定活跃运行 | `POST /api/v2/worker-runs/{runId}/abort` |
| `abort_worker_last_run` | 停止指定 Worker 最近一次活跃运行 | `POST /api/v2/workers/{workerId}/runs/last/abort` |

## 典型工作流

临时运行一个 Worker 时，通常按这个顺序调用：

```text
list_store_workers(keyword)
  -> get_worker_input_schema(worker_id)
    -> run_worker(worker_id, input_json, is_async=true)
      -> get_worker_run(run_id)
        -> list_worker_run_results(run_id) 或 export_worker_run_results(run_id)
```

运行已保存任务时，使用：

```text
list_worker_tasks(worker_id)
  -> run_worker_task(worker_task_id, is_async=true)
    -> get_worker_run(run_id)
      -> list_worker_run_results(run_id)
```

如果 Worker 输入 schema 需要代理地区，先调用 `list_proxy_regions`。只有在用户明确要求重试或重复运行时才使用 `rerun_*` 工具；只有在用户明确要求停止运行时才使用 `abort_*` 工具。

## Worker 输入

调用 `run_worker` 时，把业务字段放在 `input_json` 中：

```json
{
  "worker_id": "YOUR_WORKER_ID",
  "version": "latest",
  "input_json": "{\"keyword\":\"coffee\",\"limit\":10}",
  "is_async": true
}
```

MCP 服务会把 `input_json` 包装为 CoreClaw 使用的 `input.parameters.custom`。高级调用方可以通过 `raw_input_json` 直接传完整 CoreClaw `input` 对象，但不能同时传 `input_json` 和 `raw_input_json`。

## 支持的平台

| 平台 | 配置方式 | 指南 |
|------|----------|------|
| **Claude Desktop** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/claude-desktop/) |
| **Claude CLI** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/claude-cli/) |
| **Codex Desktop** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/codex-desktop/) |
| **Cursor** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/cursor/) |
| **ChatGPT** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/chatgpt/) |
| **VS Code** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/vscode/) |
| **Windsurf** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/windsurf/) |
| **Cline** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/cline/) |
| **n8n** | Streamable HTTP | [配置指南](/zh-cn/integrations/ai/mcp/n8n/) |
| **通用 HTTP** | 任意 Streamable HTTP MCP 客户端或 REST 风格工具调用方 | [配置指南](/zh-cn/integrations/ai/mcp/generic-http/) |

## REST 兼容端点

除了标准 MCP 端点 `/mcp`，服务还提供 REST 兼容入口 `/mcp/<tool_name>`，适合偏好按工具发起 HTTP 请求的平台：

```bash
curl -X POST https://mcp.coreclaw.com/mcp/list_store_workers \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_CORECLAW_API_KEY" \
  -d '{"keyword":"amazon","offset":0,"limit":5}'
```

更多 JSON-RPC 和 REST 示例见 [通用 HTTP 客户端](/zh-cn/integrations/ai/mcp/generic-http/)。

## 故障排除

| 现象 | 可能原因 | 处理方式 |
|------|----------|----------|
| `Invalid API key` | 密钥缺失、错误或已过期 | 在控制台 -> 设置 -> API & 集成中验证密钥 |
| `Worker does not exist` (`50001`) | `worker_id` 错误 | 使用 `list_store_workers` 或 `list_workers` 获取返回的 slug/path |
| 工具没有出现 | 客户端没有加载 Streamable HTTP MCP 配置 | 重启客户端并检查 MCP 配置路径 |
| 运行已启动但没有结果行 | 运行仍在进行或已经失败 | 轮询 `get_worker_run`；失败时调用 `get_worker_run_log` |
| 代理地区被拒绝 | 代理地区代码无效 | 调用 `list_proxy_regions` 并使用返回的地区代码 |

## 限制说明

- 托管服务使用 Streamable HTTP。只支持本地 stdio 的客户端需要本地运行 `coreclaw-mcp-server`。
- 认证基于 API key；托管入口不需要 OAuth。
- 内部接口不会通过 MCP 暴露，包括 Worker 版本创建/更新和 Worker internal 详情。

## 下一步

- [配置 Claude Desktop](/zh-cn/integrations/ai/mcp/claude-desktop/)
- [配置 Codex Desktop](/zh-cn/integrations/ai/mcp/codex-desktop/)
- [配置通用 HTTP](/zh-cn/integrations/ai/mcp/generic-http/)
- [阅读 CoreClaw API 文档](/zh-cn/api/)

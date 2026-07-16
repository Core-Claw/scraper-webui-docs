---
title: CoreClaw Skill
description: 将 CoreClaw Skill 作为 Claude Code 插件安装，在 AI 编程助手中运行 Worker。
sidebar:
  order: 12
---

[CoreClaw Skill](https://github.com/Core-Claw/CoreClaw-Skill) 把完整的 CoreClaw OpenAPI v2 工作流打包成 AI-agent skill——在 AI 助手内发现 Worker、查看输入 schema、运行 Worker 与任务、轮询运行、获取结果、导出数据、查看日志。MCP-first，仅支持 v2。

它以 **Claude Code 插件**形式发布（推荐方式），也可作为独立 skill 或 Codex skill 使用。

## 你能做什么

- **发现** Store 或私有工作区中的 Worker。
- **查看** Worker 的输入 schema 后再运行。
- **运行** Worker 或已保存任务（默认异步），支持批量运行。
- **轮询与验证** —— `poll_run` 等待完成；`verify_run` 返回结构化结论。
- **获取结果** —— 分页数据行，或导出为 CSV/JSON（8 种格式，默认 `csv`）。
- **查看日志**（支持进程内 `grep` 过滤）、重跑、中止。

该 skill 暴露 **37 个工具**——34 个 OpenAPI v2 操作加 3 个编排助手（`poll_run`、`verify_run`、`run_workers_batch`）。它调用托管 MCP 端点（`https://mcp.coreclaw.com/mcp`），并用你的 `CORECLAW_API_KEY` 回退到 REST API（`https://openapi.coreclaw.com`）。

## 前提条件

- 已安装 [Claude Code](https://docs.claude.com/en/docs/claude-code)
- CoreClaw 账户及 API key，来自[控制台 → 设置 → API & 集成](https://console.coreclaw.com/settings/integrations)

## 作为 Claude Code 插件安装（推荐）

两条命令：

```bash
claude plugin marketplace add Core-Claw/CoreClaw-Skill
claude plugin install coreclaw@coreclaw-skill
```

然后将 API key 设为环境变量：

```bash
export CORECLAW_API_KEY=YOUR_CORECLAW_API_KEY
```

安装后，该 skill 在 Claude Code 中以 `/coreclaw-skill:coreclaw` 命名空间可用。

## 使用

用自然语言让 Claude Code 执行 CoreClaw 任务：

> 在 CoreClaw 上找一个 Google Maps worker，查看它的输入 schema，运行它采集时代广场附近的咖啡店，返回前 10 条的名称、地址和评分。

Claude Code 会替你调用 `list_store_workers` → `get_worker_input_schema` → `run_worker` → `poll_run` → `list_worker_run_results`。

## 其他安装方式

- **独立 skill** —— 把仓库 clone 到 `~/.claude/skills/coreclaw`，加载为 `/coreclaw`。
- **Codex Desktop** —— 把仓库的 `skills/coreclaw` 软链到 Codex 的 skills 目录。

完整说明见 [CoreClaw-Skill README](https://github.com/Core-Claw/CoreClaw-Skill)。

## 后续步骤

- [MCP 服务概述](/zh-cn/integrations/ai/mcp/) —— 连接其他 AI 客户端（Cursor、Codex、ChatGPT 等）
- [CoreClaw API 文档](/zh-cn/api/)

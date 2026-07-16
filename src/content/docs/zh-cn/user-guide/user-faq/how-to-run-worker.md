---
title: 如何运行 Worker？
description: 运行 Worker 的快速摘要，附完整指南链接
sidebar:
  order: 1
---

在 CoreClaw 上运行 Worker 只需几分钟，无需写代码。完整的分步指南（含截图）统一放在一处：

:::note[完整指南]
**[快速开始 —— 运行你的第一个 Worker](/zh-cn/user-guide/run-worker/quick-start/)** 涵盖完整流程：进入商店 → 查找 Worker → 配置输入 → 启动 → 查看结果 → 导出。
:::

## 速览

1. **查找** Worker：进入 [Worker 商店](https://console.coreclaw.com/)，按分类浏览或搜索。
2. **查看** 描述、输入参数、示例输出与定价。
3. **配置** 输入（链接、关键词等）与运行选项（代理、版本、超时）。
4. **启动**，观察状态 `READY → RUNNING → SUCCEEDED`。
5. **导出** 结果为 **CSV、JSON、JSONL、XLS、XLSX、HTML、XML 或 RSS**。

## 技巧

:::tip[最佳实践]
- 先小规模测试运行，核对输出与费用。
- 大规模运行前先看 Worker 的示例输出。
- 把跑通的运行存为**任务**，便于复用与定时。
:::

## 相关主题

- [快速开始（完整指南）](/zh-cn/user-guide/run-worker/quick-start/)
- [Worker 任务](/zh-cn/user-guide/run-worker/worker-tasks/) —— 保存配置以便复用
- [输入与输出](/zh-cn/user-guide/run-worker/input-output/) —— 了解参数
- [API 调用](/zh-cn/user-guide/run-worker/api-calls/) —— 编程运行

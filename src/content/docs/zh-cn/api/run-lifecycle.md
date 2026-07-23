---
title: "运行生命周期与状态"
description: "CoreClaw API v2 Worker 运行状态、轮询与故障处理指南"
sidebar:
  order: -2
---

本页说明如何安全地判断一次 Worker 运行的结果。先保存启动或重跑响应中的 `data.run_slug`（后续接口使用的 `runId`）和 `request_id`，再用具体 `runId` 查询运行详情。不要把账户级或 Worker 级的 `last` 接口当作稳定引用。

## 契约中的状态值

目前 `GET /api/v2/worker-runs` 的 `status` 筛选参数允许：`ready`、`running`、`succeeded`、`failed`、`aborting`。这些是公开 API 契约支持的值。

| 状态 | 客户端处理方式 |
| --- | --- |
| `ready` | 已创建但尚未开始执行。使用有上限的退避轮询详情接口。 |
| `running` | 正在执行。继续以退避方式轮询；需要进度或诊断时可读取日志。 |
| `succeeded` | 运行成功。随后读取 `/result` 预览数据，或使用导出接口获取下载地址。结果数为 `0` 仍然可能是成功运行。 |
| `failed` | 运行失败。保存 `request_id`，读取详情和日志；只有 `err_msg` 存在时才向用户展示它。不要仅根据结果数判断。 |
| `aborting` | 已请求取消。继续针对**同一 `runId`**进行有上限的详情/日志查询，避免无限等待。 |

> `aborted` 不是当前公开 `status` 筛选契约中的值。客户端不能自行把 `aborting` 改写成 `aborted`，也不能把 `finished_at` 单独当作成功或最终状态的证据。

## 运行详情字段

| 字段 | 用途与注意事项 |
| --- | --- |
| `slug` | 运行标识；作为后续详情、日志、结果和导出接口的 `runId`。 |
| `scraper_slug`、`scraper_title`、`version` | 标识实际运行的 Worker 和版本。 |
| `status` | 唯一的主要结果判断字段；始终优先于 `results`、时间戳或诊断字段。 |
| `results` | 当前或最终的结果数量；`0` 不等于失败，非零也不保证成功。 |
| `err_msg` | 可选诊断信息。可能缺失，也可能在非失败记录中出现；仅作辅助排障信息。 |
| `started_at`、`finished_at`、`duration` | 执行时间信息。取消、排队或服务端状态同步时它们可能出现不完整或不直观的组合。 |
| `origin`、`usage`、`traffic` | 来源、计费/使用量和流量诊断字段；将它们用于观测，而不是运行成败判断。 |

## 推荐轮询流程

1. 提交运行后保存 `data.run_slug` 与 `request_id`。
2. 调用 [`GET /api/v2/worker-runs/{runId}`](/zh-cn/api/worker-runs/detail/) 读取 `data.status`。先等待约 2 秒，然后逐步退避到 5、10、15 秒；为调用设置总超时。
3. 当状态为 `ready` 或 `running` 时继续轮询；需要排查时读取[运行日志](/zh-cn/api/worker-runs/log/)。
4. 当状态为 `succeeded` 时读取[运行结果](/zh-cn/api/worker-runs/result/)或[导出结果](/zh-cn/api/worker-runs/export/)。
5. 当状态为 `failed` 时记录 `request_id`、读取详情与日志，并根据 Worker 输入或日志采取下一步。只有在明确需要时才调用重跑接口。
6. 调用取消接口后，只查询刚才提交的具体 `runId`；若仍为 `aborting`，继续有限次数的退避查询并向用户提示取消正在处理。

## 与回调一起使用

`callback_url` 能减少轮询次数，但回调接收端应按 `run_slug` 做幂等，并在处理通知前重新读取[运行详情](/zh-cn/api/worker-runs/detail/)。回调或 `finished_at` 都不能替代 `status` 的判断。详见[回调通知](/zh-cn/api/callbacks/)。

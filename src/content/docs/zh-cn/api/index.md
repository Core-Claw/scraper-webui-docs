---
title: "基础 URL 与认证"
description: "CoreClaw API v2 的基础地址、认证方式和公开接口清单"
sidebar:
  order: 0
---

## 概览

CoreClaw API 是基于三个对象的 RESTful 接口：

- **Worker** —— Store 或私有工作区中可运行的脚本。
- **Worker Task** —— 已保存、可选定时的运行配置（输入 + 设置）。
- **Run** —— Worker 或 Task 的一次执行，产出日志与结果。

典型流程：找到 Worker → 读输入 schema → 发起运行（异步）→ 轮询或接收回调 → 读结果或导出文件。本页介绍基础地址、认证、约定与完整接口清单；各接口有独立详情页。

## API 基础地址

HTTP API 基础地址为 `https://openapi.coreclaw.com`。所有 v2 接口路径都以 `/api/v2` 开头，例如 `https://openapi.coreclaw.com/api/v2/users/account`。

```
https://openapi.coreclaw.com
```

## 认证方式

需要认证的接口支持三种 token 传递方式。推荐优先使用 Bearer token，同时兼容旧版 `api-key` 请求头和 query token：

```bash
-H "Authorization: Bearer YOUR_API_KEY"
```

| 方式 | 示例 | 说明 |
| --- | --- | --- |
| Bearer token | `Authorization: Bearer YOUR_API_KEY` | 推荐方式，适合新的服务端集成，也适用于浏览器 playground |
| 旧版请求头 | `api-key: YOUR_API_KEY` | 兼容 v1 集成；**仅供服务端使用，浏览器 playground 因 CORS 预检限制无法使用，请改用 Bearer 或 query token** |
| Query token | `?token=YOUR_API_KEY` | 仅在无法设置请求头时使用，避免把带 token 的 URL 写入日志 |

公开接口不需要 token，例如代理区域列表和商店 Worker 查询。

## 调用约定

- 发送 `input` 前先读取 Worker 输入 schema；不同 Worker 的输入字段不一定相同。
- 直接运行 Worker 时使用 `POST /api/v2/workers/{workerId}/runs`；运行已保存任务时使用 `POST /api/v2/worker-tasks/{workerTaskId}/runs`。
- `is_async: true` 表示提交后立即返回，再用 `runId` 查询详情、日志和结果；`is_async: false` 表示等待执行完成并返回同步结果窗口。
- 列表和结果接口的 `offset` 是**从 1 开始**——`offset=1` 返回第一页（可理解为 `page_index = offset`，`limit` 为页大小）。`limit` 上限为 `100`。
- 需要下载结果文件时使用导出接口，不要在前端逐页拉取全部结果。

## 响应结构

大多数 JSON 响应都会包含 `code`、`message`、`request_id` 和 `data`。HTTP 状态表示请求层结果；业务 `code: 0` 表示业务处理成功。排查失败请求时请记录 HTTP 状态、`code`、`message` 和 `request_id`。

### 错误码

`code` 非 0 表示业务处理失败（即便请求已到达服务）。常见：`12001`/`12002`（鉴权）、`13000`（限流）、`30001`（余额不足）、`50001`/`60001`/`70001`（Worker/任务/运行不存在）。完整码表与处理指引见[错误码](/zh-cn/api/error-codes/)。

### 回调

异步运行时，在请求体中传 `callback_url`，CoreClaw 会在运行结束后 `POST` 该地址——无需轮询。调用方仍应保存 `data.run_slug` 与 `request_id` 以备后续查询。详见[回调通知](/zh-cn/api/callbacks/)。

## 标识符类型

| 标识符 | 含义 | 用法 |
| --- | --- | --- |
| `workerId` | Worker 标识 | 支持 Worker slug，也支持把路径 `owner/name` 写成 `owner~name` |
| `workerTaskId` | 已保存任务模板标识 | 运行任务模板时作为路径参数传入 |
| `runId` | 运行记录标识 | 启动或重跑后响应中的 `data.run_slug` |

## 接口清单

| # | 方法 | 端点 | 文档 |
| --- | --- | --- | --- |
| 1 | `GET` | `/api/v2/proxy/region` | [查询代理区域](/zh-cn/api/proxy/region/) |
| 2 | `GET` | `/api/v2/store` | [查询商店 Worker](/zh-cn/api/store/list/) |
| 3 | `GET` | `/api/v2/users/account` | [获取账户信息](/zh-cn/api/account/get/) |
| 4 | `GET` | `/api/v2/workers` | [查询我的 Worker](/zh-cn/api/workers/list/) |
| 5 | `GET` | `/api/v2/workers/{workerId}` | [获取 Worker 详情](/zh-cn/api/workers/detail/) |
| 6 | `GET` | `/api/v2/workers/{workerId}/input-schema` | [获取 Worker 输入 Schema](/zh-cn/api/workers/input-schema/) |
| 7 | `POST` | `/api/v2/workers/{workerId}/runs` | [运行 Worker](/zh-cn/api/workers/run/) |
| 8 | `GET` | `/api/v2/worker-tasks` | [查询 Worker 任务](/zh-cn/api/worker-tasks/list/) |
| 9 | `POST` | `/api/v2/worker-tasks/{workerTaskId}/runs` | [运行 Worker 任务](/zh-cn/api/worker-tasks/run/) |
| 10 | `POST` | `/api/v2/worker-tasks` | [创建 Worker 任务](/zh-cn/api/worker-tasks/create/) |
| 11 | `GET` | `/api/v2/worker-tasks/{workerTaskId}` | [获取 Worker 任务](/zh-cn/api/worker-tasks/get/) |
| 12 | `PUT` | `/api/v2/worker-tasks/{workerTaskId}` | [更新 Worker 任务](/zh-cn/api/worker-tasks/update/) |
| 13 | `DELETE` | `/api/v2/worker-tasks/{workerTaskId}` | [删除 Worker 任务](/zh-cn/api/worker-tasks/delete/) |
| 14 | `GET` | `/api/v2/worker-tasks/{workerTaskId}/input` | [获取 Worker 任务输入](/zh-cn/api/worker-tasks/get-input/) |
| 15 | `PUT` | `/api/v2/worker-tasks/{workerTaskId}/input` | [更新 Worker 任务输入](/zh-cn/api/worker-tasks/update-input/) |
| 16 | `GET` | `/api/v2/worker-runs` | [查询 Worker 运行记录](/zh-cn/api/worker-runs/list/) |
| 17 | `GET` | `/api/v2/worker-runs/last` | [获取最近一次运行](/zh-cn/api/worker-runs/last-detail/) |
| 18 | `POST` | `/api/v2/worker-runs/last/abort` | [中止最近一次运行](/zh-cn/api/worker-runs/last-abort/) |
| 19 | `GET` | `/api/v2/worker-runs/last/export` | [导出最近一次运行结果](/zh-cn/api/worker-runs/last-export/) |
| 20 | `GET` | `/api/v2/worker-runs/last/log` | [获取最近一次运行日志](/zh-cn/api/worker-runs/last-log/) |
| 21 | `POST` | `/api/v2/worker-runs/last/rerun` | [重跑最近一次运行](/zh-cn/api/worker-runs/last-rerun/) |
| 22 | `GET` | `/api/v2/worker-runs/last/result` | [查询最近一次运行结果](/zh-cn/api/worker-runs/last-result/) |
| 23 | `GET` | `/api/v2/worker-runs/{runId}` | [获取运行详情](/zh-cn/api/worker-runs/detail/) |
| 24 | `POST` | `/api/v2/worker-runs/{runId}/abort` | [中止运行](/zh-cn/api/worker-runs/abort/) |
| 25 | `GET` | `/api/v2/worker-runs/{runId}/log` | [获取运行日志](/zh-cn/api/worker-runs/log/) |
| 26 | `POST` | `/api/v2/worker-runs/{runId}/rerun` | [重跑运行](/zh-cn/api/worker-runs/rerun/) |
| 27 | `GET` | `/api/v2/worker-runs/{runId}/result` | [查询运行结果](/zh-cn/api/worker-runs/result/) |
| 28 | `GET` | `/api/v2/worker-runs/{runId}/result/export` | [导出运行结果](/zh-cn/api/worker-runs/export/) |
| 29 | `GET` | `/api/v2/workers/{workerId}/runs/last` | [获取某 Worker 最近一次运行](/zh-cn/api/worker-runs/worker-last-detail/) |
| 30 | `POST` | `/api/v2/workers/{workerId}/runs/last/abort` | [中止某 Worker 最近一次运行](/zh-cn/api/worker-runs/worker-last-abort/) |
| 31 | `GET` | `/api/v2/workers/{workerId}/runs/last/export` | [导出某 Worker 最近一次运行结果](/zh-cn/api/worker-runs/worker-last-export/) |
| 32 | `GET` | `/api/v2/workers/{workerId}/runs/last/log` | [获取某 Worker 最近一次运行日志](/zh-cn/api/worker-runs/worker-last-log/) |
| 33 | `POST` | `/api/v2/workers/{workerId}/runs/last/rerun` | [重跑某 Worker 最近一次运行](/zh-cn/api/worker-runs/worker-last-rerun/) |
| 34 | `GET` | `/api/v2/workers/{workerId}/runs/last/result` | [查询某 Worker 最近一次运行结果](/zh-cn/api/worker-runs/worker-last-result/) |

## 后续步骤

- [运行 Worker](/zh-cn/api/workers/run/) —— 发起你的第一次运行
- [错误码](/zh-cn/api/error-codes/) —— 解读非 0 的 `code`
- [回调通知](/zh-cn/api/callbacks/) —— 接收运行状态 webhook
- [示例](/zh-cn/api/examples/python/) —— Python、Node.js、Go、PHP、Java 可运行片段

---
title: n8n
description: 使用 CoreClaw 社区节点将 CoreClaw 接入 n8n 工作流
sidebar:
  order: 1
---

使用 [n8n](https://n8n.io/) 构建自动化工作流，触发 CoreClaw Worker、轮询运行状态、将结果路由到任意服务 —— 无需编写代码。

## 工作原理

CoreClaw 的 n8n 集成提供了专用的社区节点（`n8n-nodes-coreclaw`，v0.4.1+），把 CoreClaw API v2 映射到六个资源，共 **37 个操作**：

- **Store Worker（商店 Worker）** — 搜索公开市场
- **Worker** — 列出、获取详情、获取输入 schema、运行，以及"运行并获取结果"，外加最近一次运行的查找（中止/导出/日志/重跑/列出结果）
- **Worker Run（运行记录）** — 列出并按 ID 或"最近一次"查找运行；中止、日志、重跑（及"重跑并获取结果"）、列出结果、导出
- **Worker Task（任务模板）** — 已保存任务模板的完整 CRUD（列出/创建/获取/更新/删除/获取输入/更新输入）、运行、"运行并获取结果"
- **Proxy（代理）** — 列出代理地区
- **Account（账户）** — 获取账户信息（余额、流量、套餐）

三个操作是**复合操作**——`Run and Get Results`、`Rerun and Get Results` 以及任务版的 `Run and Get Results`。复合操作在单个节点内启动运行、轮询到终态（最长约 4 分钟）、然后取回结果——无需手工搭建 Wait/轮询循环。运行失败/中止时，节点错误信息会附带运行日志。

对于 webhook 驱动（无轮询）的流程，把运行操作的 **Callback URL** 字段与独立的 **CoreClaw Trigger** 节点配合——后者在本地接收 `callback_url` 的 POST。高级场景也可用 **HTTP Request** 节点直接调用 CoreClaw REST API。

## 前提条件

- 一个 [CoreClaw](https://console.coreclaw.com/sign-up) 账号
- 从 [CoreClaw 控制台](https://console.coreclaw.com/settings/integrations)的 **设置 → API 与集成** 获取 API Key
- 一个 n8n 实例（云端或自托管）

---

## n8n Cloud 设置

### 安装 CoreClaw 节点

n8n Cloud 用户可以直接从画布搜索并安装节点，无需手动输入包名。

1. 在 n8n Cloud 中，创建新工作流或打开已有工作流。
2. 打开**节点面板**（点击画布上的 **+** 按钮）。
3. 搜索 **CoreClaw**。

![在 n8n 中搜索 CoreClaw 节点](@/assets/docs/n8n-1.png)

4. 点击 **Install node** 安装 CoreClaw 节点。

![安装 n8n-nodes-coreclaw 包](@/assets/docs/n8n-2.png)

安装完成后，你可以在节点面板的 **Community Nodes** 下找到 CoreClaw 节点。

![社区节点列表中的 CoreClaw 节点](@/assets/docs/n8n-3.png)

### 创建凭据

使用 CoreClaw 节点之前，需要先创建包含 API Key 的凭据。

1. 在 n8n 中，进入 **Credentials** → **Add Credential**。
2. 搜索 **CoreClaw API** 并选择。

![创建 CoreClaw API 凭据](@/assets/docs/n8n-4.png)

3. 输入凭据名称（如 "CoreClaw Production"）。
4. 在 **API Key** 字段中，粘贴从 [CoreClaw 控制台](https://console.coreclaw.com/settings/integrations) 复制的 API Key。

![输入 API Key 并保存凭据](@/assets/docs/n8n-5.png)

5. 点击 **Save** 保存凭据。

你可以在任何工作流的 CoreClaw 节点中使用此凭据。

---

## n8n 自托管设置

如果你使用自托管的 n8n 实例，可以从设置中安装 CoreClaw 社区节点。

### 安装

1. 打开你的 n8n 实例。
2. 进入 **Settings** → **Community Nodes**。
3. 点击 **Install a community node**。
4. 输入 npm 包名：`n8n-nodes-coreclaw`
5. 同意使用社区节点的[风险提示](https://docs.n8n.io/integrations/community-nodes/risks/)，点击 **Install**。
6. 安装完成后，CoreClaw 节点出现在节点面板的 **Community Nodes** 下。

### 连接

按照上方[创建凭据](#创建凭据)的步骤配置 CoreClaw API Key。

---

## CoreClaw 节点操作

CoreClaw 节点按**资源**组织。先选择资源，再选择操作。标记为**复合**的操作在单个节点内启动运行、轮询到完成（最长约 4 分钟）并返回结果。

通用运行字段（`Run`、`Rerun` 及任务 `Run` 操作上）：**Version**（可选，默认最新）、**Custom Parameters**/**Input JSON**（Worker 输入，包装为 `input.parameters.custom`）、**Callback URL**（可选 webhook）、**Return All**（最多 10,000 行）、**Limit**（每页上限，最大 100）。

### Store Worker

| 操作 | 对应 API | 说明 |
| --- | --- | --- |
| **List** | `GET /api/v2/store` | 搜索公开市场；`keyword`、`limit` 1–100（默认 50）、Return All 最多 10,000 |

### Worker

| 操作 | 对应 API | 说明 |
| --- | --- | --- |
| **List** | `GET /api/v2/workers` | 你的 Worker；`keyword`、Return All |
| **Get** | `GET /api/v2/workers/{workerId}` | 从 Store / 我的 Worker 选，或粘贴 slug |
| **Get Input Schema** | `GET /api/v2/workers/{workerId}/input-schema` | 无需认证（公开 schema） |
| **Run** | `POST /api/v2/workers/{workerId}/runs` | 默认异步；`callback_url` 可选 |
| **Run and Get Results** *（复合）* | `POST` + 轮询 + `GET .../result` | 启动运行、轮询约 4 分钟、返回结果行（Return All 上限 10,000，否则 100/页） |
| **Get Last Run** | `GET /api/v2/workers/{workerId}/runs/last` | |
| **Abort Last Run** | `POST /api/v2/workers/{workerId}/runs/last/abort` | 无请求体 |
| **Export Last Run Results** | `GET /api/v2/workers/{workerId}/runs/last/export` | `format`（8 种，默认 `csv`）、`filter_keys` |
| **Get Last Run Log** | `GET /api/v2/workers/{workerId}/runs/last/log` | |
| **Rerun Last Run** | `POST /api/v2/workers/{workerId}/runs/last/rerun` | |
| **List Last Run Results** | `GET /api/v2/workers/{workerId}/runs/last/result` | Return All 最多 10,000 |

### Worker Run

| 操作 | 对应 API | 说明 |
| --- | --- | --- |
| **List** | `GET /api/v2/worker-runs` | 按 `worker_id`、`status` 过滤；Return All |
| **Get Last** | `GET /api/v2/worker-runs/last` | 账户范围最近一次运行 |
| **Abort Last** | `POST /api/v2/worker-runs/last/abort` | 无请求体 |
| **Export Last Results** | `GET /api/v2/worker-runs/last/export` | `format`、`filter_keys` |
| **Get Last Log** | `GET /api/v2/worker-runs/last/log` | |
| **Rerun Last** | `POST /api/v2/worker-runs/last/rerun` | |
| **List Last Results** | `GET /api/v2/worker-runs/last/result` | Return All 最多 10,000 |
| **Get** | `GET /api/v2/worker-runs/{runId}` | 从列表选或粘贴 run slug |
| **Abort** | `POST /api/v2/worker-runs/{runId}/abort` | 无请求体 |
| **Get Log** | `GET /api/v2/worker-runs/{runId}/log` | |
| **Rerun** | `POST /api/v2/worker-runs/{runId}/rerun` | |
| **Rerun and Get Results** *（复合）* | `POST` + 轮询 + `GET .../result` | 重跑后轮询/返回；上限同上 |
| **List Results** | `GET /api/v2/worker-runs/{runId}/result` | Return All 最多 10,000 |
| **Export Results** | `GET /api/v2/worker-runs/{runId}/result/export` | `format`、`filter_keys` |

### Worker Task

| 操作 | 对应 API | 说明 |
| --- | --- | --- |
| **List** | `GET /api/v2/worker-tasks` | 按 `worker_id`、`keyword` 过滤；Return All |
| **Create** | `POST /api/v2/worker-tasks` | 需 `worker_id`、`title`、`input_json`；可选定时（`schedule_type` 1=每天/2=每周/3=每月/4=单次，配 `schedule_time`/`schedule_weekday` 1–7/`schedule_day`/`schedule_once_date`/`schedule_enabled`） |
| **Get** | `GET /api/v2/worker-tasks/{workerTaskId}` | 从列表选或粘贴 ID |
| **Update** | `PUT /api/v2/worker-tasks/{workerTaskId}` | `title`、`description`、定时字段。改输入用 **Update Input** |
| **Delete** | `DELETE /api/v2/worker-tasks/{workerTaskId}` | |
| **Get Input** | `GET /api/v2/worker-tasks/{workerTaskId}/input` | 任务存储的输入负载 |
| **Update Input** | `PUT /api/v2/worker-tasks/{workerTaskId}/input` | `input_json`（包装为 `input.parameters.custom`）、`version` |
| **Run** | `POST /api/v2/worker-tasks/{workerTaskId}/runs` | 异步；`callback_url` 可选 |
| **Run and Get Results** *（复合）* | `POST` + 轮询 + `GET .../result` | 启动任务运行、轮询、返回结果行 |

### Proxy

| 操作 | 对应 API | 说明 |
| --- | --- | --- |
| **List Regions** | `GET /api/v2/proxy/region` | 无需认证；`language` `en`/`zh` |

### Account

| 操作 | 对应 API | 说明 |
| --- | --- | --- |
| **Get Info** | `GET /api/v2/users/account` | 余额、流量、套餐到期。无参数 |

---

## CoreClaw Trigger 节点

独立的 **CoreClaw Trigger** 节点在本地接收 `callback_url` 通知，可搭建无轮询的 webhook 驱动工作流。CoreClaw 没有公开的 webhook 注册 API——你把该 trigger 的 webhook URL 粘贴到运行/重跑操作的 **Callback URL** 字段即可。

该 trigger 暴露 `POST <你的 n8n webhook base>/webhook/callback`。三个字段：

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| **Event Filter** | `any` | `any`/`succeeded`/`failed`/`running`/`aborted`。不匹配的负载不产生输出 |
| **Validate Payload** | 开 | 要求 body 同时含 `run_id` 和 `run_status`，否则报错 |
| **Include Headers** | 关 | 把请求头复制到输出项的 `_headers` |

回调 body 含 `run_id`、`run_status`、`error_message`、`execution_start_timestamp`、`execution_end_timestamp`、`running_duration`、`result_count`、`result_message`。

---

## 示例工作流

以下是一个典型的使用 CoreClaw 的 n8n 工作流：

1. **触发** — Schedule Trigger（如每天上午 9 点）或 Webhook
2. **CoreClaw: Worker → Run and Get Results** — 单个节点内启动 Worker 并等待结果（轮询最长约 4 分钟）
3. **下游节点** — 发送到 Google Sheets、Slack、数据库等

对于 webhook 驱动（无轮询）的流程，把步骤 2 换成 **Worker → Run**（设置 **Callback URL**）并加一个 **CoreClaw Trigger** 节点接收完成事件。手工轮询循环——`Worker → Run`，然后 `Wait`，然后 `Worker Run → Get` 直到 `status` 为 `succeeded`，再 `Worker Run → List Results`——在需要对时序或重试更精细控制时仍可用。

### 现成工作流模板

不想从零搭建，可以直接用 [coreclaw-n8n-workflows](https://github.com/Core-Claw/coreclaw-n8n-workflows) 仓库中的生产级模板。它们把 CoreClaw Google Maps 爬虫串成业务闭环——采集 → 打分 → 写入 Google Sheets → 邮件发送带 Excel 附件的摘要——已在 n8n 2.30.4 上验证：

- `gmaps-leads-to-sheets.json` —— 运行、等待结果、写入 Google Sheets
- `gmaps-leads-sheets-email-summary.json` —— 同上，另导出 XLSX + 用 Gmail 发 HTML Top-10 摘要并带附件
- `gmaps-leads-callback-export.json` —— 由回调 webhook 驱动（无轮询；需公网可达的 n8n）

每个模板需要三个凭证：CoreClaw API、Google Sheets OAuth2、Gmail OAuth2。仓库的 `docs/` 目录涵盖凭证绑定、字段映射与 Google OAuth 配置。

---

## 使用 HTTP Request 节点（高级）

对于 CoreClaw 节点未覆盖的操作，可以使用 **HTTP Request** 节点直接调用 CoreClaw REST API。

### 配置

| 字段 | 值 |
|------|-----|
| Method | 使用 API 参考中的方法 |
| URL | `https://openapi.coreclaw.com/api/v2/<endpoint>` |
| Authentication | **Header Auth** |
| Header Name | `Authorization` |
| Header Value | `Bearer YOUR_API_KEY` |
| 兼容认证 | 仍支持旧版 `api-key` 请求头和 query token |
| Body Content Type | `JSON` |

### 常用端点

| 操作 | 方法 | 端点 |
|------|------|------|
| 获取 Worker schema | `GET` | `/api/v2/workers/{workerId}/input-schema` |
| 启动 Worker | `POST` | `/api/v2/workers/{workerId}/runs` |
| 运行任务模板 | `POST` | `/api/v2/worker-tasks/{workerTaskId}/runs` |
| 检查运行状态 | `GET` | `/api/v2/worker-runs/{runId}` |
| 获取结果（分页） | `GET` | `/api/v2/worker-runs/{runId}/result` |
| 导出结果（文件） | `GET` | `/api/v2/worker-runs/{runId}/result/export` |
| 中止运行 | `POST` | `/api/v2/worker-runs/{runId}/abort` |

完整 API 参考：[API 集成指南](/zh-cn/api/integration/)。

---

## 技巧

- **将 API Key 存为 n8n 凭据** — 不要在节点中硬编码。
- **使用表达式** — 用 `{{ $json.run_slug }}` 在节点间传递数据，而非手动复制。
- **处理错误** — 检查响应中的 `code` 字段，非零值表示出错。
- **速率限制** — 如果收到限流错误（`code: 13000`），添加 Wait 节点后再重试。
- **Webhook 回调** — 启动 Worker 时设置 `callback_url`，用推送通知替代轮询。

---

## 常见问题

<details>
<summary><strong>安装后看不到节点</strong></summary>

1. 刷新 n8n 页面。
2. 检查 **Settings → Community Nodes** — 节点应该出现在列表中。
3. 如果使用 n8n Cloud，确保已在 Cloud Admin Panel 中启用已验证的社区节点。
</details>

<details>
<summary><strong>API Key 无效错误</strong></summary>

1. 在 [CoreClaw 控制台](https://console.coreclaw.com/settings/integrations)中确认 API Key。
2. 确保凭据中没有多余的空格或换行。
3. 使用 curl 命令测试 Key：

```bash
curl -X GET "https://openapi.coreclaw.com/api/v2/users/account" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

成功响应包含 `code: 0`。
</details>

<details>
<summary><strong>Worker 特有的输入字段</strong></summary>

每个 Worker 有不同的输入参数。查找正确字段的方法：

1. 在 [CoreClaw 控制台](https://console.coreclaw.com/store)中打开 Worker。
2. 进入 **Input** 选项卡。
3. 点击右上角的 **API** 按钮。
4. 选择 **API clients** 查看可直接使用的代码片段。

或调用 API：

```bash
curl "https://openapi.coreclaw.com/api/v2/workers/YOUR_WORKER_ID/input-schema" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

响应会返回该 Worker 的输入 schema，用于构造 `input` 请求体。
</details>

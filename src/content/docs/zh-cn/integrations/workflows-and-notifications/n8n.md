---
title: n8n
description: 使用 CoreClaw 社区节点将 CoreClaw 接入 n8n 工作流
sidebar:
  order: 1
---

使用 [n8n](https://n8n.io/) 构建自动化工作流，触发 CoreClaw Worker、轮询运行状态、将结果路由到任意服务 —— 无需编写代码。

## 工作原理

CoreClaw 的 n8n 集成提供了专用的社区节点（`n8n-nodes-coreclaw`），包含四个资源（Resource）和内置操作：

- **Scraper（爬虫）** — 搜索商店、获取爬虫详情、运行爬虫
- **Run（运行）** — 获取状态、获取结果、导出结果、获取日志、中止运行、重新运行
- **Task（任务）** — 运行预配置的任务模板
- **Account（账户）** — 获取账户信息（余额、流量、套餐）

你也可以使用 **HTTP Request** 节点直接调用 CoreClaw REST API，适用于高级场景。

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

CoreClaw 节点按**资源**（Scraper、Run、Task、Account）组织。先选择资源，再选择要执行的操作。

### Scraper 资源

#### Search（搜索）

通过关键词搜索 CoreClaw 商店中的爬虫。

| 字段 | 说明 |
|------|------|
| **Query** | 匹配爬虫标题/描述/标签的关键词 |
| **Limit** | 返回结果的最大数量（1–100，默认：50） |

#### Get Details（获取详情）

获取爬虫的完整规格：当前版本、系统默认值、自定义输入 schema、README。

| 字段 | 说明 |
|------|------|
| **Scraper** | 从商店列表中选择，或直接粘贴 slug |

#### Run（运行）

使用自定义参数启动异步爬虫运行。

| 字段 | 说明 |
|------|------|
| **Scraper** | 从商店列表中选择，或直接粘贴 slug |
| **Version** | 爬虫版本字符串（必填）。从 **Get Details** → version 获取 |
| **Custom Parameters** | 爬虫特有的输入参数 JSON（schema 来自 Get Details） |
| **System Parameters** | 可选 JSON，覆盖 cpus、memory、timeout、max charge、traffic |
| **Callback URL** | 可选，异步通知的 Webhook 地址 |

:::caution
**Version 是必填字段。** 节点不支持"留空使用最新版"。务必先从 **Get Details** 获取正确的版本号。
:::

`scraper_slug`（Worker Slug）可从 [CoreClaw 控制台](https://console.coreclaw.com/store)的 Worker 页面获取，或通过 API 查询（`GET /api/scraper?slug=<scraper_slug>`）。

### Run 资源

#### Get（获取状态）

获取运行的当前执行状态（status、started_at、duration、cost）。

| 字段 | 说明 |
|------|------|
| **Run Slug** | 启动爬虫或任务时返回的运行标识 |

状态码：`1` 就绪，`2` 运行中，`3` 成功，`4` 失败，`5` 正在中止。

#### Get Many（获取多条）

列出用户的历史爬虫运行记录，支持分页和过滤。

| 字段 | 说明 |
|------|------|
| **Return All** | 是否返回所有结果，或仅返回指定数量 |
| **Limit** | 返回结果的最大数量（1–200，默认：50） |
| **Filters** | 按状态和/或爬虫 slug 过滤 |

#### Get Results（获取结果）

从已完成的运行中获取分页的结果记录。

| 字段 | 说明 |
|------|------|
| **Run Slug** | 运行标识 |
| **Return All** | 是否返回所有结果，或仅返回指定数量 |
| **Limit** | 返回结果的最大数量（1–500，默认：50） |

#### Export Results（导出结果）

将运行的完整结果集导出为可下载的 CSV 或 JSON 文件。

| 字段 | 说明 |
|------|------|
| **Run Slug** | 运行标识 |
| **Format** | `csv`（易读，可用 Excel 打开）或 `json`（保留嵌套结构） |
| **Filter Keys** | 逗号分隔的要包含的字段名。留空表示包含所有字段。 |

#### Get Logs（获取日志）

获取运行的执行日志，用于调试或排查故障。

| 字段 | 说明 |
|------|------|
| **Run Slug** | 运行标识 |

#### Abort（中止）

取消正在执行的爬虫运行。

| 字段 | 说明 |
|------|------|
| **Run Slug** | 要中止的运行标识 |

#### Rerun（重新运行）

使用完全相同的参数重新运行之前的运行。

| 字段 | 说明 |
|------|------|
| **Run Slug** | 要重新运行的运行标识 |
| **Callback URL** | 可选，异步通知的 Webhook 地址 |

### Task 资源

#### Run（运行任务）

运行 CoreClaw 控制台中预配置的任务模板。任务参数已随任务存储，无需额外输入。

| 字段 | 说明 |
|------|------|
| **Task Slug** | 保存的任务标识，来自 CoreClaw 控制台 → Tasks 页面 |
| **Callback URL** | 可选，异步通知的 Webhook 地址 |

### Account 资源

#### Get Info（获取账户信息）

获取账户信息：余额、流量使用情况和套餐到期时间。

无需参数。

---

## 示例工作流

以下是一个典型的使用 CoreClaw 的 n8n 工作流：

1. **触发** — Schedule Trigger（如每天上午 9 点）或 Webhook
2. **CoreClaw: Scraper → Run** — 使用目标 URL 运行爬虫
3. **Wait** — 等待 30 秒让运行进行
4. **CoreClaw: Run → Get** — 轮询直到状态为 `3`（成功）
5. **IF** — 判断状态是否等于 `3`
   - **True** → 继续获取结果
   - **False** → 循环回到 Wait
6. **CoreClaw: Run → Get Results** — 获取爬取的数据
7. **下游节点** — 发送到 Google Sheets、Slack、数据库等

---

## 使用 HTTP Request 节点（高级）

对于 CoreClaw 节点未覆盖的操作，可以使用 **HTTP Request** 节点直接调用 CoreClaw REST API。

### 配置

| 字段 | 值 |
|------|-----|
| Method | `POST`（大多数端点） |
| URL | `https://openapi.coreclaw.com/api/v1/<endpoint>` |
| Authentication | **Header Auth** |
| Header Name | `api-key` |
| Header Value | 你的 CoreClaw API Key |
| Body Content Type | `JSON` |

### 常用端点

| 操作 | 方法 | 端点 |
|------|------|------|
| 获取 Worker schema | `GET` | `/api/scraper?slug=<scraper_slug>` |
| 启动 Worker | `POST` | `/api/v1/scraper/run` |
| 运行任务模板 | `POST` | `/api/v1/task/run` |
| 检查运行状态 | `POST` | `/api/v1/run/detail` |
| 获取结果（分页） | `POST` | `/api/v1/run/result/list` |
| 导出结果（文件） | `POST` | `/api/v1/run/result/export` |
| 中止运行 | `POST` | `/api/v1/scraper/abort` |

完整 API 参考：[API 集成指南](/zh-cn/api/integration/)。

---

## 技巧

- **将 API Key 存为 n8n 凭据** — 不要在节点中硬编码。
- **使用表达式** — 用 `{{ $json.run_slug }}` 在节点间传递数据，而非手动复制。
- **处理错误** — 检查响应中的 `code` 字段，非零值表示出错。
- **速率限制** — 如果收到 `code: 4290`，添加 Wait 节点后再重试。
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
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
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
curl "https://openapi.coreclaw.com/api/scraper?slug=YOUR_SCRAPER_SLUG"
```

响应中的 `data.parameters.custom.properties` — 每个条目对应一个输入字段。
</details>
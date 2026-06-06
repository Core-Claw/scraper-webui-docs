---

## title: n8n

description: 使用 CoreClaw 社区节点将 CoreClaw 接入 n8n 工作流
sidebar:
  order: 1

使用 [n8n](https://n8n.io/) 构建自动化工作流，触发 CoreClaw Worker、轮询运行状态、将结果路由到任意服务 —— 无需编写代码。

## 工作原理

CoreClaw 的 n8n 集成提供了专用的社区节点（`n8n-nodes-coreclaw`），内置以下常用操作：

- **启动 Worker** — 运行 CoreClaw 商店中的任意 Worker
- **检查运行状态** — 轮询执行进度
- **获取结果** — 提取输出数据
- **中止运行** — 取消正在执行的运行

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

在 n8n 中搜索 CoreClaw 节点

1. 点击 **Install node** 安装 CoreClaw 节点。

安装 n8n-nodes-coreclaw 包

安装完成后，你可以在节点面板的 **Community Nodes** 下找到 CoreClaw 节点。

社区节点列表中的 CoreClaw 节点

### 创建凭据

使用 CoreClaw 节点之前，需要先创建包含 API Key 的凭据。

1. 在 n8n 中，进入 **Credentials** → **Add Credential**。
2. 搜索 **CoreClaw API** 并选择。

创建 CoreClaw API 凭据

1. 输入凭据名称（如 "CoreClaw Production"）。
2. 在 **API Key** 字段中，粘贴从 [CoreClaw 控制台](https://console.coreclaw.com/settings/integrations) 复制的 API Key。

输入 API Key 并保存凭据

1. 点击 **Save** 保存凭据。

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

CoreClaw 节点提供以下内置操作。

### 启动 Worker

运行 CoreClaw 商店中的任意 Worker。


| 字段                   | 说明                                           |
| -------------------- | -------------------------------------------- |
| **Worker Slug**      | Worker 的唯一标识（如 `01KNXSHE0Y7DZKF1N8B1EMFX35`） |
| **Version**          | 要运行的 Worker 版本（留空则使用最新版）                     |
| **Input Parameters** | Worker 特有的输入字段（因 Worker 而异）                  |
| **Proxy Region**     | 可选，运行时使用的代理区域                                |
| **Callback URL**     | 可选，异步通知的 Webhook 地址                          |


`scraper_slug`（Worker Slug）可从 [CoreClaw 控制台](https://console.coreclaw.com/store)的 Worker 页面获取，或通过 API 查询（`GET /api/scraper?slug=<scraper_slug>`）。

### 检查运行状态

轮询正在运行或已完成的 Worker 执行状态。


| 字段           | 说明                 |
| ------------ | ------------------ |
| **Run Slug** | 启动 Worker 时返回的运行标识 |


状态码：`1` 就绪，`2` 运行中，`3` 成功，`4` 失败，`5` 正在中止。

### 获取结果

从已完成的运行中获取输出数据。


| 字段             | 说明           |
| -------------- | ------------ |
| **Run Slug**   | 运行标识         |
| **Page Index** | 分页页码（默认：1）   |
| **Page Size**  | 每页结果数（默认：20） |


数据量较大时，使用 **Export Results** 操作下载 JSON 或 CSV 文件。

### 中止运行

取消正在执行的 Worker 运行。


| 字段           | 说明       |
| ------------ | -------- |
| **Run Slug** | 要中止的运行标识 |


---

## 示例工作流

以下是一个典型的使用 CoreClaw 的 n8n 工作流：

1. **触发** — Schedule Trigger（如每天上午 9 点）或 Webhook
2. **CoreClaw: Start a Worker** — 使用目标 URL 运行爬虫
3. **Wait** — 等待 30 秒让运行进行
4. **CoreClaw: Check Run Status** — 轮询直到状态为 `3`（成功）
5. **IF** — 判断状态是否等于 `3`
  - **True** → 继续获取结果
  - **False** → 循环回到 Wait
6. **CoreClaw: Get Results** — 获取爬取的数据
7. **下游节点** — 发送到 Google Sheets、Slack、数据库等

---

## 使用 HTTP Request 节点（高级）

对于 CoreClaw 节点未覆盖的操作，可以使用 **HTTP Request** 节点直接调用 CoreClaw REST API。

### 配置


| 字段                | 值                                                |
| ----------------- | ------------------------------------------------ |
| Method            | `POST`（大多数端点）                                    |
| URL               | `https://openapi.coreclaw.com/api/v1/<endpoint>` |
| Authentication    | **Header Auth**                                  |
| Header Name       | `api-key`                                        |
| Header Value      | 你的 CoreClaw API Key                              |
| Body Content Type | `JSON`                                           |


### 常用端点


| 操作               | 方法     | 端点                                 |
| ---------------- | ------ | ---------------------------------- |
| 获取 Worker schema | `GET`  | `/api/scraper?slug=<scraper_slug>` |
| 启动 Worker        | `POST` | `/api/v1/scraper/run`              |
| 运行任务模板           | `POST` | `/api/v1/task/run`                 |
| 检查运行状态           | `POST` | `/api/v1/run/detail`               |
| 获取结果（分页）         | `POST` | `/api/v1/run/result/list`          |
| 导出结果（文件）         | `POST` | `/api/v1/run/result/export`        |
| 中止运行             | `POST` | `/api/v1/scraper/abort`            |


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

**安装后看不到节点**

1. 刷新 n8n 页面。
2. 检查 **Settings → Community Nodes** — 节点应该出现在列表中。
3. 如果使用 n8n Cloud，确保已在 Cloud Admin Panel 中启用已验证的社区节点。

**API Key 无效错误**

1. 在 [CoreClaw 控制台](https://console.coreclaw.com/settings/integrations)中确认 API Key。
2. 确保凭据中没有多余的空格或换行。
3. 使用 curl 命令测试 Key：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" ^
  -H "api-key: YOUR_API_KEY" ^
  -H "content-type: application/json" ^
  --data "{}"
```

成功响应包含 `code: 0`。

**Worker 特有的输入字段**

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
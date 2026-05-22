---
title: API 集成指南
description: 将 CoreClaw API 集成到您的应用程序的完整指南
sidebar:
  order: -1
---

CoreClaw 平台的所有功能都可以通过 REST API 控制。本指南将带您完成从获取 API 密钥到发起第一次 API 调用的完整集成过程。

## 快速测试

使用单个命令验证您的 API 密钥是否有效：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

预期响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": "10.00",
    "traffic": "1000"
  }
}
```

如果收到 `code: 20001`，说明 API 密钥无效。请检查密钥后重试。

## API 密钥

要访问 CoreClaw API，您需要使用 API 密钥进行身份验证。您可以在 CoreClaw 控制台的 [API 与集成](https://console.coreclaw.com/settings/integrations) 页面找到它。

1. 登录 [CoreClaw 控制台](https://console.coreclaw.com)
2. 导航到 **设置** → **API 与集成**
3. 点击 **创建 API 密钥** 或复制现有密钥

> **警告**：请勿与不受信任的一方共享您的 API 密钥，也不要直接从客户端代码（浏览器 JavaScript）中使用它。API 密钥应仅在服务端或安全环境中使用。

## 身份验证

CoreClaw API 使用 `api-key` 请求头进行身份验证。在需要身份验证的每个请求中包含它。

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

部分端点不需要身份验证：`GET /api/store`（搜索 Worker）与 `GET /api/scraper`（获取 Worker 详情）。

## 基础 URL

所有 API 请求应发送到 `https://openapi.coreclaw.com`。

完整的 OpenAPI 规范见 [openapi.json](/openapi.json)，可以导入到 [Postman](https://www.postman.com/)、[Swagger UI](https://swagger.io/tools/swagger-ui/) 或任何兼容 OpenAPI 的工具。

## 快速开始：您的第一次 API 调用

完整的工作流程：运行 Worker 并获取结果。

### 步骤 1：搜索 Worker

```bash
curl "https://openapi.coreclaw.com/api/store?search=amazon&limit=5"
```

```json
{
  "code": 0,
  "data": {
    "scraper": [
      {
        "slug": "01KNXSHE0Y7DZKF1N8B1EMFX35",
        "title": "Amazon Global Product By URL",
        "description": "Extract product data from Amazon URLs"
      }
    ]
  }
}
```

保存 `slug`（这是 **Worker ID**，也称为 `scraper_slug`）。

### 步骤 2：获取 Worker 详情

调用 Worker 之前，先获取其实时参数 schema：

```bash
curl "https://openapi.coreclaw.com/api/scraper?slug=01KNXSHE0Y7DZKF1N8B1EMFX35"
```

```json
{
  "code": 0,
  "data": {
    "version": "v1.0.1",
    "parameters": {
      "system": { "cpus": 0.125, "memory": 512, "execute_limit_time_seconds": 1800 },
      "custom": {
        "properties": [
          { "name": "urls", "type": "array", "title": "URLs", "required": true }
        ]
      }
    }
  }
}
```

`data.version` 必须按返回值原样使用；`input.parameters.custom` 必须按 `data.parameters.custom.properties` 构建。`memory` 单位为 MB，与 `/api/v1/scraper/run` 一致。

### 步骤 3：运行 Worker

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{
    "scraper_slug": "01KNXSHE0Y7DZKF1N8B1EMFX35",
    "version": "<version>",
    "is_async": true,
    "input": {
      "parameters": {
        "system": {
          "cpus": 0.125,
          "memory": 512,
          "execute_limit_time_seconds": 1800,
          "max_total_charge": 0,
          "max_total_traffic": 0,
          "proxy_region": "US"
        },
        "custom": {
          "urls": [{"url": "https://www.amazon.com/dp/B0CHHSFMRL"}]
        }
      }
    }
  }'
```

```json
{
  "code": 0,
  "data": { "run_slug": "01KS2A1M515HG7PZX9STTB0KPH" }
}
```

保存 `run_slug`（**运行记录 ID**），用于跟踪进度和获取结果。

### 步骤 4：检查运行状态

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/run/detail" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{"run_slug": "01KS2A1M515HG7PZX9STTB0KPH"}'
```

状态码：`1` 就绪，`2` 运行中，`3` 成功，`4` 失败，`5` 正在中止。

### 步骤 5：获取结果

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/run/result/list" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{
    "run_slug": "01KS2A1M515HG7PZX9STTB0KPH",
    "page_index": 1,
    "page_size": 20
  }'
```

或调用 `/api/v1/run/result/export` 导出文件，`format` 支持 `json` 或 `csv`。

## 同步与异步执行

| 模式 | 设置 | 行为 | 适用场景 |
|------|------|------|----------|
| 异步（默认） | `is_async: true` | 立即返回 `run_slug`，轮询或 webhook 获取结果 | 长时间任务 |
| 同步 | `is_async: false` | 等待执行完成（最长 5 分钟）直接返回结果 | 快速、小型任务 |

异步模式下提供 `callback_url` 后，CoreClaw 会在运行完成时向您的端点发送 POST：

```json
{
  "run_slug": "01KS2A1M515HG7PZX9STTB0KPH",
  "status": 3,
  "results": 20,
  "usage": "0.06"
}
```

Webhook 端点应验证请求来源、处理结果并返回 `200 OK`。

## 常见错误

| 代码 | 消息 | 解决方案 |
|------|------|----------|
| 4000 | 请求参数无效 | 根据 `/api/scraper` 检查参数名称和类型 |
| 20001 | API 密钥无效 | 验证您的 API 密钥是否正确 |
| 30001 | 余额不足 | 为您的账户充值 |
| 50001 | Worker 不存在 | 检查 `scraper_slug`（Worker ID） |
| 70001 | 运行记录不存在 | 检查 `run_slug`（运行记录 ID） |

## 最佳实践

1. **始终先读取 Worker schema**：不要猜测参数名，调用 `/api/v1/scraper/run` 之前先调用 `/api/scraper`。
2. **使用精确版本**：从 `/api/scraper` 响应中复制 `version`，不要硬编码。
3. **处理分页**：大数据集请使用 `result/list` 分页或 `result/export` 文件下载。
4. **实现重试逻辑**：对频率限制（代码 4290）使用指数退避。
5. **监控用量**：定期通过 `/api/v1/account/info` 检查余额。

## 故障排查

<details>
<summary><strong>4000 请求参数无效</strong> — 最常见的错误</summary>

| 原因 | 解决方案 |
|------|----------|
| `version` 不匹配 | 从 `/api/scraper` 获取 `version`，不要硬编码 |
| `custom` schema 不匹配 | 根据 `data.parameters.custom.properties` 构建 `custom` |
| 缺少 `is_async` | 添加 `"is_async": true` 或 `"is_async": false` |
| JSON 语法错误 | 验证 JSON 格式，特别是在 Windows 上 |

</details>

<details>
<summary><strong>Windows PowerShell JSON 转义问题</strong></summary>

PowerShell 会破坏内联 JSON 字符串，导致 `4000 请求参数无效`。请用 `--data-binary @file.json` 从文件读取：

```powershell
@'
{
  "scraper_slug": "YOUR_SCRAPER_SLUG",
  "version": "<version>",
  "is_async": true,
  "input": {
    "parameters": {
      "system": {"cpus": 0.125, "memory": 512},
      "custom": {}
    }
  }
}
'@ | Out-File -Encoding utf8 request.json

curl.exe -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" `
  -H "api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  --data-binary "@request.json"
```

</details>

<details>
<summary><strong>速率限制（429 / 代码 4290）</strong></summary>

超过速率限制时使用指数退避：

```python
import time

def retry_with_backoff(func, max_retries=5):
    for attempt in range(max_retries):
        result = func()
        if result.get("code") != 4290:
            return result
        wait_time = (2 ** attempt) * 1  # 1, 2, 4, 8, 16 秒
        time.sleep(wait_time)
    return result
```

</details>

<details>
<summary><strong>Worker 特定的 Custom 参数</strong></summary>

每个 Worker 的 `custom` 参数都不同。**永远不要假设字段名**。

错误（硬编码）：

```json
{
  "custom": {
    "startURLs": [{"url": "https://example.com"}]
  }
}
```

正确（从 `/api/scraper` 获取）：

```python
response = requests.get(f"https://openapi.coreclaw.com/api/scraper?slug={scraper_slug}")
schema = response.json()["data"]["parameters"]["custom"]["properties"]

custom_params = {}
for prop in schema:
    name = prop["name"]
    if prop.get("required"):
        custom_params[name] = prop.get("default", [])
```

</details>

<details>
<summary><strong>调试检查清单</strong></summary>

1. **API 密钥**：运行 [快速测试](#快速测试) 验证
2. **版本**：从 `/api/scraper` 获取最新的 `version`
3. **Custom Schema**：检查 Worker 的 `data.parameters.custom.properties`
4. **JSON 格式**：使用 JSON 验证器检查
5. **Windows Shell**：使用 `--data-binary @file.json` 代替内联 JSON

</details>

## 代码示例

| 语言 | 安装 | 描述 |
|------|------|------|
| [Python](/zh-cn/api/examples/python/) | `pip install requests` | requests 库的完整异步工作流 |
| [Node.js](/zh-cn/api/examples/nodejs/) | `npm install axios` | axios 的完整异步工作流 |
| [Java](/zh-cn/api/examples/java/) | 无外部依赖（`java.net.http`） | Java 11+ |
| [PHP](/zh-cn/api/examples/php/) | 无外部依赖（`curl`） | 内置 curl 扩展 |
| [Go](/zh-cn/api/examples/go/) | 无外部依赖（`net/http`） | net/http 包 |

## API 参考

更多端点详情见 [基础 URL 与认证](/zh-cn/api/)、[搜索 Worker](/zh-cn/api/worker/search/)、[Worker 详情](/zh-cn/api/worker/detail/)、[运行爬虫](/zh-cn/api/worker/run/)、[中止爬虫](/zh-cn/api/worker/abort/)、[运行历史](/zh-cn/api/run/history/)、[运行详情](/zh-cn/api/run/detail/)、[运行结果](/zh-cn/api/run/result/)、[导出运行结果](/zh-cn/api/run/export/)、[运行日志](/zh-cn/api/run/log/)、[重新运行](/zh-cn/api/run/rerun/)、[运行任务（模板）](/zh-cn/api/task/run/) 与 [账户信息](/zh-cn/api/account/info/)。

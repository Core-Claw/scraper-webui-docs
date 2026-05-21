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

### 如何获取 API 密钥

1. 登录 [CoreClaw 控制台](https://console.coreclaw.com)
2. 导航到 **设置** → **API 与集成**
3. 点击 **创建 API 密钥** 或复制现有密钥

### 保护您的 API 密钥

> **警告**：请勿与不受信任的一方共享您的 API 密钥，也不要直接从客户端代码（浏览器 JavaScript）中使用它。API 密钥应仅在服务端或安全环境中使用。

## 身份验证

CoreClaw API 使用 `api-key` 请求头进行身份验证。在需要身份验证的每个请求中包含它。

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

### 公开端点

某些端点不需要身份验证：

- `GET /api/store` - 搜索 Worker
- `GET /api/scraper` - 获取 Worker 详情

## 基础 URL

所有 API 请求应发送到：

```
https://openapi.coreclaw.com
```

## OpenAPI 规范

下载完整的 OpenAPI 规范：

- [openapi.json](/openapi.json) - JSON 格式的完整 API 规范

您可以将此文件导入：
- [Postman](https://www.postman.com/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- 任何兼容 OpenAPI 的工具

## 快速开始：您的第一次 API 调用

让我们通过一个完整的工作流程来运行 Worker 并获取结果。

### 步骤 1：搜索 Worker

找到适合您需求的 Worker：

```bash
curl "https://openapi.coreclaw.com/api/store?search=amazon&limit=5"
```

响应：

```json
{
  "code": 0,
  "message": "success",
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

保存 `slug`（这是 **Worker ID**，也称为 `scraper_slug`）用于下一步。

### 步骤 2：获取 Worker 详情

在运行 Worker 之前，获取其实时参数架构：

```bash
curl "https://openapi.coreclaw.com/api/scraper?slug=01KNXSHE0Y7DZKF1N8B1EMFX35"
```

响应包含：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "v1.0.1",
    "parameters": {
      "system": {
        "cpus": 0.125,
        "memory": 512,
        "execute_limit_time_seconds": 1800
      },
      "custom": {
        "properties": [
          {
            "name": "urls",
            "type": "array",
            "title": "URLs",
            "required": true,
            "description": "Amazon product URLs to scrape"
          }
        ]
      }
    },
    "readme": "Worker 文档..."
  }
}
```

**重要提示**：
- 完全按照返回的 `data.version` 使用
- 根据 `data.parameters.custom.properties` 构建 `input.parameters.custom`
- 此端点中的 `memory` 对应 `/api/v1/scraper/run` 中的 `memory`（单位均为 MB）

### 步骤 3：运行 Worker

使用步骤 2 中的参数启动 Worker 运行：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{
    "scraper_slug": "01KNXSHE0Y7DZKF1N8B1EMFX35",
    "version": "v1.0.1",
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
          "urls": [
            {"url": "https://www.amazon.com/dp/B0CHHSFMRL"}
          ]
        }
      }
    }
  }'
```

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KS2A1M515HG7PZX9STTB0KPH"
  }
}
```

保存 `run_slug`（**运行记录 ID**）以跟踪进度和获取结果。

### 步骤 4：检查运行状态

轮询运行状态直到完成：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/run/detail" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{"run_slug": "01KS2A1M515HG7PZX9STTB0KPH"}'
```

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status": 3,
    "results": 20,
    "usage": "0.06",
    "duration": 9
  }
}
```

状态码：

| 代码 | 状态 |
|------|------|
| 1 | 就绪 |
| 2 | 运行中 |
| 3 | 成功 |
| 4 | 失败 |
| 5 | 正在中止 |

### 步骤 5：获取结果

获取抓取的数据：

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

或导出为文件：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/run/result/export" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data '{
    "run_slug": "01KS2A1M515HG7PZX9STTB0KPH",
    "format": "json",
    "filter_keys": []
  }'
```

## 同步与异步执行

### 异步模式（默认）

- `is_async: true`（默认）
- 立即返回 `run_slug`
- 轮询状态或使用 webhook 获取结果
- 适用于长时间运行的任务

```json
{
  "is_async": true,
  "callback_url": "https://your-server.com/webhook"
}
```

### 同步模式

- `is_async: false`
- 等待执行完成
- 直接返回结果（最长 5 分钟超时）
- 适用于快速、小型任务

```json
{
  "is_async": false
}
```

## Webhook 成成

使用异步模式并设置 `callback_url` 时，CoreClaw 会在运行完成后向您的端点发送 POST 请求：

```json
{
  "run_slug": "01KS2A1M515HG7PZX9STTB0KPH",
  "status": 3,
  "results": 20,
  "usage": "0.06"
}
```

您的 webhook 端点应该：

1. 验证请求来自 CoreClaw
2. 处理结果通知
3. 返回 `200 OK` 确认接收

## 常见错误

| 代码 | 消息 | 解决方案 |
|------|------|----------|
| 4000 | 请求参数无效 | 根据 `/api/scraper` 检查参数名称和类型 |
| 20001 | API 密钥无效 | 验证您的 API 密钥是否正确 |
| 30001 | 余额不足 | 为您的账户充值 |
| 50001 | Worker 不存在 | 检查 `scraper_slug`（Worker ID） |
| 70001 | 运行记录不存在 | 检查 `run_slug`（运行记录 ID） |

## 最佳实践

### 1. 始终先读取 Worker 架构

不要猜测参数名称。在调用 `/api/v1/scraper/run` 之前始终先调用 `/api/scraper`。

### 2. 使用精确版本

从 `/api/scraper` 响应中复制 `version`。不要硬编码版本号。

### 3. 处理分页

对于大数据集，使用带分页的 `result/list` 或使用 `result/export` 下载文件。

### 4. 实现重试逻辑

对频率限制请求（代码 4290）使用指数退避。

### 5. 监控使用量

定期检查您的余额：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

## 故障排查

### 常见问题

#### `4000 Invalid request parameters`

这是最常见的错误。请检查以下原因：

| 原因 | 解决方案 |
|------|----------|
| `version` 不匹配 | 从 `/api/scraper` 获取 `version`，不要硬编码 |
| `custom` 架构不匹配 | 根据 `data.parameters.custom.properties` 构建 `custom` |
| 缺少 `is_async` | 添加 `"is_async": true` 或 `"is_async": false` |
| JSON 语法错误 | 验证 JSON 格式，特别是在 Windows 上 |

#### Windows PowerShell JSON 转义问题

**问题**：PowerShell 会破坏内联 JSON 字符串，导致 `4000 Invalid request parameters`。

**解决方案**：使用 `--data-binary @file.json` 从文件读取：

```powershell
# 创建 JSON 文件
@'
{
  "scraper_slug": "YOUR_SCRAPER_SLUG",
  "version": "v1.0.0",
  "is_async": true,
  "input": {
    "parameters": {
      "system": {"cpus": 0.125, "memory": 512},
      "custom": {}
    }
  }
}
'@ | Out-File -Encoding utf8 request.json

# 使用文件配合 curl
curl.exe -X POST "https://openapi.coreclaw.com/api/v1/scraper/run" `
  -H "api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  --data-binary "@request.json"
```

#### 速率限制 (429)

当超过速率限制时，实现指数退避：

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

#### Worker 特定的 Custom 参数

每个 Worker 有不同的 `custom` 参数。**永远不要假设字段名**。

**错误**（硬编码）：
```json
{
  "custom": {
    "startURLs": [{"url": "https://example.com"}]
  }
}
```

**正确**（从 `/api/scraper` 获取）：
```python
# 获取实时架构
response = requests.get(f"https://openapi.coreclaw.com/api/scraper?slug={scraper_slug}")
schema = response.json()["data"]["parameters"]["custom"]["properties"]

# 根据架构构建 custom 参数
custom_params = {}
for prop in schema:
    name = prop["name"]
    if prop.get("required"):
        custom_params[name] = prop.get("default", [])
```

### 调试检查清单

当出现问题时，请检查：

1. **API 密钥**：运行 [快速测试](#快速测试) 验证
2. **版本**：从 `/api/scraper` 获取最新的 `version`
3. **Custom 架构**：检查 Worker 的 `data.parameters.custom.properties`
4. **JSON 格式**：使用 JSON 验证器检查格式
5. **Windows Shell**：使用 `--data-binary @file.json` 代替内联 JSON

## 代码示例

多种编程语言的完整示例：

| 语言 | 描述 |
|------|------|
| [Python](/zh-cn/api/examples/python/) | 使用 requests 库的完整异步工作流 |
| [Node.js](/zh-cn/api/examples/nodejs/) | 使用 axios 的完整异步工作流 |
| [Java](/zh-cn/api/examples/java/) | 使用 java.net.http（Java 11+） |
| [PHP](/zh-cn/api/examples/php/) | 使用内置 curl 扩展 |
| [Go](/zh-cn/api/examples/go/) | 使用 net/http 包 |

### 依赖安装

| 语言 | 安装命令 |
|------|----------|
| Python | `pip install requests` |
| Node.js | `npm install axios` |
| Java | 无外部依赖（使用 `java.net.http`） |
| PHP | 无外部依赖（使用 `curl`） |
| Go | 无外部依赖（使用 `net/http`） |

## API 参考

详细的端点文档，请参阅：

- [基础地址与身份验证](/zh-cn/api/)
- [搜索 Worker](/zh-cn/api/worker/search/)
- [Worker 详情](/zh-cn/api/worker/detail/)
- [启动 Worker](/zh-cn/api/worker/run/)
- [中止 Worker](/zh-cn/api/worker/abort/)
- [运行历史](/zh-cn/api/run/history/)
- [运行详情](/zh-cn/api/run/detail/)
- [运行结果](/zh-cn/api/run/result/)
- [导出结果](/zh-cn/api/run/export/)
- [运行日志](/zh-cn/api/run/log/)
- [重新运行](/zh-cn/api/run/rerun/)
- [运行任务](/zh-cn/api/task/run/)
- [账户信息](/zh-cn/api/account/info/)
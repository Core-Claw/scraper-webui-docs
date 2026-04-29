---
title: API 调用
description: 通过 API 编程运行 Worker
sidebar:
  order: 5
---

了解如何使用 CoreClaw API 编程运行 Worker 和管理任务。

## 快速开始

### 身份验证

所有 API 请求需要在请求头中使用 API 密钥进行身份验证：

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/runs" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json"
```

从[账户设置](/zh-cn/api/account/info/)获取您的 API 密钥。

完整 API 文档请参考[基础 URL 与身份验证](/zh-cn/api/)。

## 运行 Worker

### 启动 Worker 运行

```bash
POST /api/v1/runs
```

**请求体：**
```json
{
  "scraper_slug": "01KGYERXPXTABWXMGQKFCE43M2",
  "version": "v1.0.1",
  "system_params": "{\"proxy_region\":\"US\"}",
  "custom_params": "{\"startURLs\":[{\"url\":\"https://example.com\"}]}"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
  }
}
```

### 检查运行状态

```bash
GET /api/v1/runs/{run_slug}/status
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ",
    "status": 3,
    "result_count": 500,
    "duration_seconds": 120
  }
}
```

### 获取运行结果

```bash
GET /api/v1/runs/{run_slug}/results
```

### 中止运行

```bash
POST /api/v1/runs/{run_slug}/abort
```

## 管理任务

### 运行任务

```bash
POST /api/v1/tasks/{task_slug}/run
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "run_slug": "01KKDXV2G26BT7NH4ZQR2R4NPZ"
  }
}
```

## 错误处理

| CODE | 描述 |
| ---- | ---- |
| 0 | 成功 |
| 4000 | 无效请求参数 |
| 4010 | 未授权访问 |
| 4040 | 资源不存在 |
| 5000 | 服务器内部错误 |

完整状态码列表请参考[全局状态码](/zh-cn/api/#global-status-codes)。

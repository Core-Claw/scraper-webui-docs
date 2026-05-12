---
title: 基础地址与身份验证
description: API 基础地址、请求头和全局状态码
sidebar:
  order: 0
---

## API 基础地址

```
https://openapi.coreclaw.com
```

> **术语说明：** CoreClaw API 中，`Worker` 和 `Scraper` 指向同一个概念 —— 数据采集脚本。API 路径和字段名使用 `scraper`（如 `scraper_slug`、`/api/v1/scraper/run`），文档中可能称为 Worker。

## 请求头参数

| 参数名 | 示例值 | 类型 | 必填 | 说明 |
| ------ | ------ | ---- | ---- | ---- |
| api-key | <YOUR_API_KEY> | string | 是 | 您的 API 密钥，用于身份验证 |
| content-type | application/json | string | 是 | 请求内容类型 |

## 全局状态码

每个 API 请求可能返回成功码或错误码。您可以使用这些代码调试请求并识别问题。

| CODE  | 说明 |
| ----- | ---- |
| 0     | 成功 |
| 5000  | 服务器内部错误 |
| 4000  | 请求参数无效 |
| 4010  | 未授权访问 |
| 4040  | 资源不存在 |
| 4290  | 请求频率超限 |
| 10001 | 用户不存在 |
| 10002 | 用户已禁用 |
| 20001 | API 密钥无效 |
| 20002 | API 密钥已过期 |
| 30001 | 余额不足 |
| 30002 | 流量配额不足 |
| 50001 | Worker 不存在 |
| 50002 | Worker 执行失败 |
| 50003 | Worker 版本不可用 |
| 60001 | 任务不存在 |
| 70001 | 运行记录不存在 |
| 70002 | 运行中止失败 |

## 端点速查

| # | 方法 | 端点 | 说明 |
|---|------|------|------|
| 1 | `POST` | `/api/v1/scraper/run` | [启动 Worker](/zh-cn/api/worker/run/) |
| 2 | `POST` | `/api/v1/scraper/abort` | [中止 Worker](/zh-cn/api/worker/abort/) |
| 3 | `GET` | `/api/scraper` | [Worker 详情](/zh-cn/api/worker/detail/) |
| 4 | `GET` | `/api/store` | [搜索 Worker](/zh-cn/api/worker/search/) |
| 5 | `POST` | `/api/v1/run/list` | [运行历史](/zh-cn/api/run/history/) |
| 6 | `POST` | `/api/v1/run/detail` | [运行详情](/zh-cn/api/run/detail/) |
| 7 | `POST` | `/api/v1/run/result/list` | [运行结果](/zh-cn/api/run/result/) |
| 8 | `POST` | `/api/v1/run/last/log` | [运行日志](/zh-cn/api/run/log/) |
| 9 | `POST` | `/api/v1/run/result/export` | [导出运行结果](/zh-cn/api/run/export/) |
| 10 | `POST` | `/api/v1/rerun` | [重新运行](/zh-cn/api/run/rerun/) |
| 11 | `POST` | `/api/v1/task/run` | [运行任务](/zh-cn/api/task/run/) |
| 12 | `POST` | `/api/v1/account/info` | [账户信息](/zh-cn/api/account/info/) |

## 身份验证

所有 API 请求都需要在请求头中携带 API 密钥。

### 使用 API 密钥

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```
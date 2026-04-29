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

## 身份验证

所有 API 请求都需要使用您的 API 密钥进行身份验证。您可以在账户设置中找到您的 API 密钥。

### 获取 API 密钥

1. 登录您的 CoreClaw 账户
2. 进入账户设置
3. 在 API 部分找到您的 API 密钥
4. 复制并在请求中使用

### 使用 API 密钥

在每个请求的头部包含您的 API 密钥：

```bash
curl -X GET "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json"
```

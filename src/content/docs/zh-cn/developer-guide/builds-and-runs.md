---
title: 构建与运行
description: 了解 Worker 如何在 CoreClaw 平台上构建和运行
sidebar:
  order: 9
---

了解 Worker 如何在 CoreClaw 平台上构建和运行。

## 无需构建——轻量脚本模式

CoreClaw 没有传统的 Build 步骤。与需要构建 Docker 镜像的容器化平台不同，CoreClaw 采用**轻量级进程隔离**——你的脚本直接在平台预置的运行环境中执行。

### 执行流程

```
用户代码(ZIP) → 自动安装依赖 → 脚本运行环境 → 远程指纹浏览器池(CDP) → 目标网站
```

### 为什么不需要构建？

CoreClaw 通过**平台级托管**消除了构建步骤：

- **运行环境是平台预置的** — Python/Node.js 运行时和基础依赖已安装在共享环境中，无需构建或配置运行时镜像。
- **浏览器是远程托管的** — 无需在项目中打包浏览器，通过 `ChromeWs` 环境变量（CDP/WebSocket）连接远程指纹浏览器池。详见 [浏览器指纹](/developer-guide/worker-definition/platform-features/browser-fingerprinting/)。
- **依赖安装是自动的** — 平台读取 `requirements.txt` 或 `package.json` 并在执行前自动安装依赖，无需手动构建镜像。
- **网络是沙箱隔离的** — 运行环境是隔离的网络沙箱，HTTP 请求类脚本必须使用平台内置的 SOCKS5 代理（通过 `PROXY_AUTH` 环境变量）。详见 [代理支持](/developer-guide/worker-definition/platform-features/proxy-support/)。

**简单来说**：上传 ZIP 包 → 平台自动处理剩余工作。这就是 CoreClaw 的优势：**上传即运行**。

### 上传后发生了什么？

当你上传 ZIP 包到 CoreClaw 时：

1. **校验** — 平台检查 ZIP 结构（入口文件、`input_schema.json`、`output_schema.json`）
2. **依赖解析** — 读取 `requirements.txt` / `package.json`，解析依赖关系
3. **环境准备** — 准备脚本运行环境并安装依赖
4. **就绪** — Worker 可以运行

此过程全自动，通常在数秒内完成。

## 运行生命周期

每次 Run 是 Worker 的一次执行。生命周期如下：

```
READY → RUNNING → SUCCEEDED / FAILED / ABORTING
```

| 状态 | 状态码 | 说明 |
| ---- | ------ | ---- |
| **READY** | 1 | 运行排队等待中 |
| **RUNNING** | 2 | 脚本正在执行 |
| **SUCCEEDED** | 3 | 运行成功完成 |
| **FAILED** | 4 | 运行遇到错误 |
| **ABORTING** | 5 | 运行正在被停止 |

## 运行环境

每次运行在轻量级进程隔离环境中执行，包含：

- **预装运行时** — Python 3.x 或 Node.js，取决于你的项目
- **自动依赖** — 来自 `requirements.txt` / `package.json` 的依赖包
- **环境变量**：
  - `PROXY_AUTH` — SOCKS5 代理凭据（username:password），用于 HTTP 请求
  - `ChromeWs` — WebSocket 地址，用于连接远程指纹浏览器
- **SDK 通信** — 与 CoreClaw 平台的 gRPC 通道（127.0.0.1:20086）

## 运行管理

你可以通过控制台或 API 管理运行：

- **监控** — 实时查看运行进度和日志
- **中止** — 通过控制台或 `POST /api/v1/runs/{run_slug}/abort` 停止运行中的 Worker
- **重新运行** — 通过 `POST /api/v1/runs/{run_slug}/rerun` 使用相同参数再次执行
- **查看日志** — 通过 `GET /api/v1/runs/{run_slug}/logs` 获取执行日志
- **导出结果** — 通过 `POST /api/v1/runs/{run_slug}/export` 以 JSON 或 CSV 格式下载输出数据

## 运行历史

CoreClaw 会保留你所有的 Worker 运行记录。每次运行都会保存：

- 唯一运行 ID 和 Run Slug
- 时间戳
- 时长
- 状态和状态码
- 输入参数
- 输出数据（可通过 `GET /api/v1/runs/{run_slug}/results` 获取）
- 执行日志

你可以通过 `GET /api/v1/runs` 列出所有运行记录，也可以在控制台查看详细信息。

## 最佳实践

### 上传前

- 保持依赖最小化，加速自动安装
- 在 `requirements.txt` / `package.json` 中锁定依赖版本
- 上传前在本地测试核心逻辑
- 确保 `input_schema.json` 和 `output_schema.json` 配置正确

### 开发阶段

- 从小规模测试运行开始，验证功能
- 监控日志，尽早发现问题
- 使用 `CoreSDK.Log` 模块添加有意义的日志信息
- 同时测试 HTTP 请求和浏览器自动化两种路径

### 生产环境

- 使用任务进行重复运行——详见 [Worker 任务](/developer-guide/develop-worker/worker-tasks/)
- 为长时间运行的脚本设置合理的超时时长
- 使用 try/except 优雅地处理错误，提供有意义的错误信息

---
title: 部署
description: 将 Worker 部署到 CoreClaw
sidebar:
  order: 6
---

将您的 Worker 部署到 CoreClaw 平台。

---

## 上传要求

CoreClaw 支持两种方式上传 Worker 脚本：

### 方式一：ZIP 压缩包上传

将 Worker 打包为 ZIP 压缩包上传。这是最快捷的上传方式。

1. 将所有项目文件压缩为 ZIP 压缩包
2. 确保运行入口位于 ZIP 根目录：Python 为 `main.py`，Node.js 为 `main.js`，Go 为编译后的 Linux amd64 可执行文件 `main`
3. 上传 ZIP 压缩包到平台

### 方式二：GitHub 导入

直接从 GitHub 仓库导入 Worker。此方式支持**版本管理**，方便您跟踪和管理 Worker 的不同版本。

**支持的 URL 格式：**

- **HTTPS**：`https://github.com/username/repository.git`
- **SSH**：`git@github.com:username/repository.git`

**版本管理：**

从 GitHub 导入时，您可以指定要部署的代码版本：

- **分支**：部署指定分支的最新代码（例如 `main`、`develop`）
- **标签**：部署特定的标签版本（例如 `v1.0.0`）
- **提交**：通过 SHA 哈希值部署精确的提交版本

这让您可以轻松维护多个版本、回滚到之前的发布版本，并有效管理 Worker 的生命周期。

---

所有脚本执行文件**必须严格遵循平台规范**。

### 项目结构

打包前确保项目包含所需文件：

**Python：**
```
├── main.py              # 入口文件
├── requirements.txt     # 依赖
├── input_schema.json    # 输入配置
├── output_schema.json   # 输出配置
├── sdk.py               # CoreClaw SDK - 核心功能模块
├── sdk_pb2.py           # 数据处理增强模块
└── sdk_pb2_grpc.py      # 网络通信模块
```

**Node.js：**
```
├── main.js              # 入口文件
├── package.json         # 依赖
├── input_schema.json    # 输入配置
├── output_schema.json   # 输出配置
├── sdk.js               # CoreClaw SDK
├── sdk_pb.js            # Protocol Buffer 定义
└── sdk_grpc_pb.js       # gRPC 服务定义
```

**Go：**
```
├── main.go              # 源码入口文件
├── go.mod               # 依赖
├── go.sum               # 依赖校验
├── input_schema.json    # 输入配置
├── output_schema.json   # 输出配置
└── GoSdk/               # SDK 目录
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

Go Worker 需要区分三层结构：

- **源码项目**：包含 `main.go`、`go.mod`、`go.sum`、`GoSdk/`、`input_schema.json` 和 `output_schema.json`。
- **上传 ZIP**：ZIP 根目录必须包含名为 `main` 的 Linux amd64 可执行文件。源码入口是 `main.go`，上传后的运行入口是编译产物 `main`。
- **平台运行时**：不保证 `main.go`、`go.mod`、`go.sum`、`GoSdk/` 等源码文件仍存在于当前工作目录。运行时只能依赖明确随包保留的文件。

### 打包

1. 将所有项目文件压缩为 ZIP 压缩包
2. 确保运行入口（`main.py` / `main.js` / Go 编译后的 `main` 可执行文件）位于 ZIP 根目录
3. 上传 ZIP 压缩包到平台，或推送到 GitHub 后通过仓库链接导入

:::caution[Windows 打包注意事项]
部分普通 Windows 压缩工具可能会丢失 Go `main` 二进制文件的 Linux executable bit。如果该权限位丢失，Worker 可能在用户代码启动前失败，有时不会产生 Worker 日志。Go ZIP 上传建议在 Linux 或 WSL 中执行 `chmod +x main` 后再创建最终压缩包。
:::

---

## 自动处理

CoreClaw 没有 Docker 镜像构建。上传后，平台自动准备你的 Worker：

1. 校验项目结构（入口文件、`input_schema.json`、`output_schema.json`）
2. 读取 `requirements.txt` / `package.json` 并解析依赖
3. 使用你的依赖准备脚本运行环境

监控日志以发现任何错误。完整生命周期见 [构建与运行](/zh-cn/developer-guide/builds-and-runs/)。

---

## 测试环境

构建成功后，您可以在发布前测试 Worker：

- 点击 **运行 Worker** 启动测试运行
- 输入测试参数
- 验证输出并检查日志
- 根据需要迭代代码

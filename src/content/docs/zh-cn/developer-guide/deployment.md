---
title: 部署
description: 将 Worker 部署到 CoreClaw
sidebar:
  order: 6
---

将您的 Worker 部署到 CoreClaw 平台。

---

## 上传要求

目前，**仅支持 ZIP 压缩包文件**上传脚本。请确保上传前文件格式正确。

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
├── main.go              # 入口文件
├── go.mod               # 依赖
├── go.sum               # 依赖校验
├── input_schema.json    # 输入配置
├── output_schema.json   # 输出配置
└── GoSdk/               # SDK 目录
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

### 打包

1. 将所有项目文件压缩为 ZIP 压缩包
2. 确保入口文件（`main.py` / `main.js` / `main.go`）位于 ZIP 根目录
3. 上传 ZIP 压缩包到平台

---

## 构建流程

上传后，CoreClaw 自动构建 Worker：

1. 安装依赖
2. 准备脚本运行环境
3. 运行构建检查

监控构建日志以发现任何错误。

---

## 测试环境

构建成功后，您可以在发布前测试 Worker：

- 点击 **运行 Worker** 启动测试运行
- 输入测试参数
- 验证输出并检查日志
- 根据需要迭代代码

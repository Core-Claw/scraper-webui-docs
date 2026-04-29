---
title: 项目结构
description: 构建 Worker 所需的项目结构和文件
sidebar:
  order: 1
---

## 项目根目录必需文件

### Python 项目

```
├── main.py                 # 主入口文件
├── requirements.txt        # Python 依赖列表
├── README.md               # 项目文档
├── input_schema.json       # UI Worker 输入配置文件
├── output_schema.json      # UI Worker 输出配置文件
├── sdk.py                  # SDK 文件
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

### Node.js 项目

```
├── main.js                 # 主入口文件
├── package.json            # Node.js 依赖列表
├── README.md               # 项目文档
├── input_schema.json       # UI Worker 输入配置文件
├── output_schema.json      # UI Worker 输出配置文件
├── sdk.js                  # SDK 文件
├── sdk_pb.js
├── sdk_grpc_pb.js
```

### Go 项目

```
├── main.go                 # 主入口文件
├── go.mod                  # Go 模块文件
├── go.sum                  # Go 依赖校验
├── README.md               # 项目文档
├── input_schema.json       # UI Worker 输入配置文件
├── output_schema.json      # UI Worker 输出配置文件
├── GoSdk/                  # SDK 目录
│   ├── sdk.go
│   ├── sdk.pb.go
│   └── sdk_grpc.pb.go
```

## 核心文件说明

### 核心入口文件

- **main.py** / **main.js** / **main.go**：Worker 项目的主入口点。
- 文件名**必须**是 `main`，扩展名取决于所选语言。

### 依赖管理

| 语言 | 文件 | 用途 |
| ---- | ---- | ---- |
| Node.js | `package.json` | Node.js 依赖 |
| Python | `requirements.txt` | Python 依赖 |
| Go | `go.mod` | Go 模块定义 |

这些文件声明运行项目所需的所有依赖。

### 配置文件：`input_schema.json`

- UI Worker 输入配置文件
- 定义平台上显示的输入表单
- 详见 [输入配置](/zh-cn/developer-guide/worker-definition/input-schema/)

### 配置文件：`output_schema.json`

- UI Worker 输出配置文件
- 定义输出数据表结构（列标题）
- 详见 [输出配置](/zh-cn/developer-guide/worker-definition/output-schema/)

### 文档：`README.md`

- Worker 功能文档
- 包含使用说明和重要注意事项

## SDK 功能模块

### 1. 环境参数访问

- 获取脚本启动时传入的运行时参数
- 访问任务配置、认证信息等

### 2. 数据存储

- 定义数据表结构（表头）
- 存储采集的结果数据
- 支持批量保存和断点续传

### 3. 日志输出

- 标准化日志接口
- 支持多种日志级别：INFO、WARN、ERROR
- 日志由平台自动收集并展示

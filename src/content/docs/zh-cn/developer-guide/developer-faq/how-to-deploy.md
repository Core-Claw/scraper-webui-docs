---
title: 如何部署？
description: 将 Worker 部署到 CoreClaw 平台
sidebar:
  order: 1
---

了解如何将 Worker 部署到 CoreClaw。

## 快速步骤

### 1. 准备项目

确保项目包含所需文件：

```
├── main.py              # 入口文件
├── requirements.txt     # 依赖
├── input_schema.json    # 输入配置
├── sdk.py               # CoreClaw SDK - 核心功能模块
├── sdk_pb2.py           # 数据处理增强模块
└── sdk_pb2_grpc.py      # 网络通信模块
```

### 2. 上传到 CoreClaw

在控制台中可通过两种方式添加 Worker：上传 **ZIP 压缩包**，或从 **GitHub 导入**（并支持版本管理）。完整对比见 [部署](/zh-cn/developer-guide/deployment/)。

1. 登录 CoreClaw 控制台
2. 进入 **我的 Worker** → **创建 Worker**
3. 将项目打包为 ZIP 文件上传，或填写 GitHub 仓库地址
4. 点击 **创建**

### 3. 自动处理

CoreClaw 没有 Docker 镜像构建。上传后，平台自动准备你的 Worker：

1. 校验项目结构（入口文件、`input_schema.json`、`output_schema.json`）
2. 读取 `requirements.txt` / `package.json` 并解析依赖
3. 使用你的依赖准备脚本运行环境

监控日志以发现任何错误。详见 [构建与运行](/zh-cn/developer-guide/builds-and-runs/)。

### 4. 测试

发布前，测试 Worker：

1. 点击 **运行 Worker**
2. 输入测试参数
3. 验证输出
4. 检查日志

### 5. 发布

1. 配置 Worker 设置
2. 设置定价（可选）
3. 点击 **发布**

## 常见问题

### 构建超时

**原因：** 依赖安装时间过长

**解决方案：**
- 最小化依赖
- 锁定依赖版本

### 导入错误

**原因：** 缺少依赖

**解决方案：**
- 检查 `requirements.txt` / `package.json`
- 确保包名正确

### 文件未找到

**原因：** 文件名不正确

**解决方案：**
- 运行入口必须是 Python 的 `main.py`、Node.js 的 `main.js`，或 Go 编译后的 Linux amd64 可执行文件 `main`
- 检查代码中的文件路径

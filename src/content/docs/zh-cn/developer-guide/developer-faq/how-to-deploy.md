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

目前**仅支持 ZIP 压缩包**上传脚本。

1. 登录 CoreClaw 控制台
2. 进入 **我的 Worker** → **创建 Worker**
3. 将项目打包为 ZIP 文件
4. 上传 ZIP 压缩包
5. 点击 **创建**

### 3. 构建

上传后，CoreClaw 自动构建 Worker：

1. 安装依赖
2. 准备脚本运行环境
3. 运行构建检查

监控构建日志以发现任何错误。

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
- 入口文件必须是 `main.py` / `main.js` / `main.go`
- 检查代码中的文件路径
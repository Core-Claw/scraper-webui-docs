---
title: 构建失败？
description: 排查常见构建错误
sidebar:
  order: 2
---

了解如何诊断和修复常见构建失败问题。

## 理解构建失败

构建失败时，请检查构建日志中的错误信息。

## 常见构建错误

### 1. 依赖错误

**症状：**
```
ERROR: Could not find a version that satisfies the requirement
```

**解决方案：**
- 检查包名拼写
- 指定版本：`package==1.0.0`
- 使用兼容的 Python 版本

### 2. 导入错误

**症状：**
```
ModuleNotFoundError: No module named 'xxx'
```

**解决方案：**
- 在 `requirements.txt` 中添加缺少的包
- 检查包安装名称

### 3. 语法错误

**症状：**
```
SyntaxError: invalid syntax
```

**解决方案：**
- 检查 Python 版本兼容性
- 验证代码语法
- 先在本地测试

### 4. 文件未找到

**症状：**
```
FileNotFoundError: [Errno 2] No such file or directory
```

**解决方案：**
- 检查文件路径
- 确保文件已上传
- 使用相对路径

### 5. 内存错误

**症状：**
```
MemoryError / JavaScript heap out of memory
```

**解决方案：**
- 减少依赖
- 拆分为更小的包

## 调试步骤

### 步骤 1：检查构建日志

进入 Worker 详情 → 构建 → 查看日志

### 步骤 2：识别错误类型

查找关键词：
- `ERROR`
- `Failed`
- `Exception`

### 步骤 3：修复并重新构建

1. 进行必要的修改
2. 上传新代码
3. 触发新构建

## 预防技巧

| 问题 | 预防措施 |
| ---- | -------- |
| 依赖 | 在 requirements 中锁定版本 |
| 语法 | 上传前在本地测试 |
| 文件路径 | 使用相对路径 |
| 内存 | 最小化依赖 |

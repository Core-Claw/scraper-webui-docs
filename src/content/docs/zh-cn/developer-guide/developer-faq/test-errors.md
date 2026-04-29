---
title: 测试错误？
description: 修复测试期间的常见运行时错误
sidebar:
  order: 3
---

了解如何诊断和修复常见运行时错误。

## 理解运行时错误

运行时错误在 Worker 执行时发生。请检查运行日志了解详情。

## 常见运行时错误

### 1. 连接错误

**症状：**
```
ConnectionError: Failed to establish connection
```

**解决方案：**
- 检查 URL 是否可访问
- 启用 Web Unlocker
- 使用代理配置

### 2. 超时错误

**症状：**
```
TimeoutError: Navigation timeout of 30000 ms exceeded
```

**解决方案：**
- 增加超时值
- 减少页面范围
- 检查网站可用性

### 3. 元素未找到

**症状：**
```
NoSuchElementException: Unable to locate element
```

**解决方案：**
- 检查 CSS 选择器
- 等待元素加载
- 验证页面结构

### 4. 空结果

**症状：**
- Worker 完成但没有数据

**解决方案：**
- 检查选择器是否匹配网站
- 验证 JavaScript 渲染
- 检查反爬措施

### 5. 内存错误

**症状：**
```
MemoryError / Out of memory
```

**解决方案：**
- 批量处理
- 清除未使用的变量
- 减少数据大小

## 调试步骤

### 步骤 1：检查运行日志

进入运行详情 → 日志

### 步骤 2：添加调试日志

```python
from sdk import CoreSDK

CoreSDK.Log.info(f"正在处理: {url}")
CoreSDK.Log.info(f"找到 {len(items)} 条记录")
CoreSDK.Log.error(f"错误: {e}")
```

### 步骤 3：使用最小输入测试

- 使用单个 URL 而非多个
- 较小的页面范围
- 默认设置

### 步骤 4：检查环境

验证环境变量：
- `PROXY_AUTH`
- `ChromeWs`
- `PROXY_DOMAIN`

## 预防技巧

| 问题 | 预防措施 |
| ---- | -------- |
| 连接 | 使用 Web Unlocker |
| 超时 | 设置适当的超时值 |
| 元素 | 使用灵活的选择器 |
| 空结果 | 在本地测试选择器 |

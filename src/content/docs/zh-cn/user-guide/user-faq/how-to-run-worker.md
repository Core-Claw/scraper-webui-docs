---
title: 如何运行 Worker？
description: 运行第一个 Worker 的分步指南
sidebar:
  order: 1
---

了解如何在 CoreClaw 上通过几个简单步骤运行 Worker。

## 前提条件

运行 Worker 前，请确保您有：

- CoreClaw 账户（[免费注册](https://console.coreclaw.com/sign-up)）
- 足够的账户余额（查看您的控制台）
- 准备好目标网站 URL 或参数

## 分步指南

### 1. 查找 Worker

进入 **Worker Store** 或 **控制台 Worker** 页面，找到满足您需求的 Worker。

您可以：
- 按分类浏览
- 按网站名称搜索
- 按功能筛选

### 2. 查看 Worker 详情

点击 Worker 查看：

| 信息 | 说明 |
| ---- | ---- |
| **描述** | Worker 的功能 |
| **输入** | 必需参数 |
| **输出** | 返回的数据结构 |
| **定价** | 每次运行的成本 |

### 3. 配置输入

填写必需的输入参数：

- 要采集的 URL
- 搜索关键词
- 分页设置
- 其他 Worker 特定选项

### 4. 启动运行

点击 **"运行 Worker"** 开始执行：

1. 系统创建新的运行
2. 分配资源
3. Worker 开始采集

### 5. 监控进度

实时跟踪您的运行：

- **状态**：READY → RUNNING → SUCCEEDED
- **进度**：已采集项目、已处理页面
- **日志**：实时执行日志

### 6. 获取结果

完成后：

- 在控制台查看结果
- 下载为 JSON 或 CSV
- 通过 API 访问

## 成功技巧

:::tip[最佳实践]
- 先从小规模测试运行开始
- 查看 Worker 的示例输出
- 如果出现问题，查看日志
- 使用任务进行重复运行
:::

## 相关主题

- [Worker 任务](/zh-cn/user-guide/run-worker/worker-tasks/) - 保存配置以便复用
- [输入与输出](/zh-cn/user-guide/run-worker/input-output/) - 了解参数
- [API 调用](/zh-cn/user-guide/run-worker/api-calls/) - 编程运行

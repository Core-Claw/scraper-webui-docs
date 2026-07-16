---
title: 快速开始
description: 5 分钟内运行您的第一个 Worker
sidebar:
  order: 1
---

5 分钟内运行您的第一个 Worker——无需写代码，全程在浏览器中完成：从商店挑选 Worker → 填写输入 → 点击启动 → 导出结果。

## 前提条件

- 一个 CoreClaw 账户（[免费注册](https://console.coreclaw.com/sign-up)）
- 充足的账户余额（查看您的[钱包](https://console.coreclaw.com/wallet)）
- 准备好目标网站链接或要采集的参数

## 操作步骤

### 1. 进入脚本商店

注册登录后，您可以通过以下两个入口进入脚本商店：

- 从 [CoreClaw 官网首页](https://coreclaw.com)，点击导航栏中的 **商店**。

![官网首页入口](@/assets/docs/1.png)

- 从 [CoreClaw 控制台](https://console.coreclaw.com/)，点击侧边栏中的 **CoreClaw 商店**。

![控制台入口](@/assets/docs/57.png)

### 2. 查找脚本

在Worker商店中，您可以按分类浏览或使用搜索栏查找所需Worker。点击卡片查看详情。

![Worker商店](@/assets/docs/56.png)

在Worker详情页，您可以查看描述、输入参数、示例输出和定价信息。点击**运行**进入配置页面。

![Worker详情页](@/assets/docs/58.png)

### 3. 配置并运行

在配置页面，您可以进行以下设置：

**输入参数**

填写您想要爬取数据的参数，如目标链接、搜索关键词等由脚本定义的输入项。

**运行选项（Run Options）**

- **代理节点**：免费选择适合目标网站的代理节点（地区），如果不选择则系统自动分配代理节点。
- **脚本版本**：选择要运行的脚本版本，默认使用最新版本。
- **超时时长**：设置本次运行的最大执行时间。

**API 调用端点**

右上角可以查看该 Worker 的 API 调用端点，方便您将脚本集成到自己的应用中，通过 API 编程调用。

![配置输入参数](@/assets/docs/60.png)

配置完成后，点击**启动**开始运行。

### 4. 查看结果与导出

运行完成后，您可以查看：

- **运行状态**：运行是否成功、失败或仍在进行中。
- **日志**：详细的执行日志，便于调试和监控。
- **输出结果**：采集到的数据以结构化表格展示，各字段清晰标注。

在结果页面右侧，您可以将数据导出为以下 8 种格式：

- **CSV** —— 电子表格与数据分析
- **JSON** —— 开发者与 API 集成
- **JSONL** —— 按行分隔，便于流式处理
- **XLS / XLSX** —— Excel 工作簿
- **HTML** —— 任意浏览器可查看
- **XML** —— 传统与企业级流水线
- **RSS** —— 阅读器与监控式集成

![查看结果与导出](@/assets/docs/59.png)

:::tip[先小规模试跑]
大规模运行前，先小规模测试以核对输出与费用。运行如何计费见[计费与配额](/zh-cn/user-guide/run-worker/pricing-rules/)。
:::

## 后续步骤

- [输入与输出](/zh-cn/user-guide/run-worker/input-output/) —— 了解参数与结果结构
- [Worker 任务](/zh-cn/user-guide/run-worker/worker-tasks/) —— 将一次运行保存为可复用、可定时的任务
- [API 调用](/zh-cn/user-guide/run-worker/api-calls/) —— 编程式触发同一运行

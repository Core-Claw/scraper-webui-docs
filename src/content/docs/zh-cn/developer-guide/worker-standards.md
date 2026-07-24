---
title: Worker 开发与上传规范
description: 每个 Worker 上传前必须满足的质量标准——默认参数可运行、输出干净、失败安全、版本可追溯
sidebar:
  order: 11
---

本规范定义一个可投产的 CoreClaw Worker 在上传前必须满足的要求。其目的是保证每个已发布的 Worker 开箱即用、返回干净数据、计费准确且可维护。违反本规范的 Worker 可能在审核阶段被拒绝，或在发布后被下架。

本页是 [测试 Worker](/zh-cn/developer-guide/test-your-worker/) 与 [发布 Worker](/zh-cn/developer-guide/publishing-and-monetization/publish-your-worker/) 之间的质量门禁。

## 1. 并发与请求控制

CoreClaw 支持多任务执行，且一次运行可通过 `input_schema.json` 拆分为多个任务。请注意不要混淆两层并发：

| 层级 | 控制对象 | 配置位置 |
| --- | --- | --- |
| 平台任务拆分 | 一次运行如何拆分为并行任务 | `input_schema.json` → `concurrency.fields`（见[输入 Schema](/zh-cn/developer-guide/worker-definition/input-schema/)） |
| 脚本内部请求并发 | 代码同时发出多少个 HTTP 请求 | 脚本内部——必须自行限制 |

你**必须**限制脚本内部的请求并发与请求速率。无节制的请求会触发目标网站封禁、平台限流或 `429` 响应。

:::caution[在脚本内限制请求]
使用并发限制器（信号量）与请求速率上限。浏览器自动化 Worker 还应限制同时打开的页面或标签页数量——每个都会消耗远程浏览器资源。
:::

## 2. 失败数据处理

**切勿把失败或空数据作为结果 push。** 只有有效、成功采集的行才应传入 `push_data`。

原因：

- 会污染用户的结果表与导出文件。
- 会被计入 `results`，影响计费——平台按成功结果计费，错误行会扭曲计数。
- 会破坏下游数据管道对“每行都是真实数据”的假设。

错误信息只能写入日志，不能进入输出表。

```python
from sdk import CoreSDK

# 错误——把错误对象作为结果行 push
CoreSDK.Result.push_data({"url": url, "error": str(e), "status": "failed"})

# 正确——记录错误、跳过该行；只 push 成功的行
CoreSDK.Log.error(f"处理 {url} 失败: {e}")
```

如果一次运行无法产出任何有效数据，应让它以 `results: 0` 结束并在日志中写明错误，而不是伪造结果行。

## 3. 默认参数规范

默认值来自 `input_schema.json` → `properties[].default`，平台会在表单与 API playground 中预填。用户经常不修改任何参数直接运行，因此默认值必须是投产可用的。

### 默认参数必须可直接运行

一键默认运行不应出现：

- 参数缺失
- 参数格式错误
- 无效输入
- 无结果返回

### 默认参数需要返回有效数据

默认运行必须满足：

- `results > 0`
- 每一行都符合声明的[输出 Schema](/zh-cn/developer-guide/worker-definition/output-schema/)

### 默认参数禁止使用测试数据

默认值必须指向真实、公开可访问的目标。禁止使用：

- 测试关键词（如 `test`、`example`）
- 虚构 URL（如 `https://example.com`）
- 无效或占位账号
- 已删除或不公开的页面
- 不公开访问的数据

:::tip
默认值是你 Worker 的第一印象。如果用户用默认值运行得到零结果或报错，他们不会再运行第二次。
:::

## 4. 输出字段规范

输出字段的形态直接影响平台如何渲染、筛选和导出数据。遵循以下原则：

| 字段类型 | 原则 | 示例 |
| --- | --- | --- |
| 简单字段 | 使用基础数据类型，平台直接展示为表格列 | 名称、URL、数字、日期 |
| 长文本 | 返回完整内容，平台负责截断展示并提供详情查看 | 简介、描述、评论 |
| 数组字段 | 保持原始数组结构，不要拼接成字符串 | 多个标签、帖子、评论 |
| 结构化字段 | 用户需要筛选/导出/单独使用的拆为独立字段；仅用于详情查看的复杂数据可保留为对象 | address → street/city/zip |

### 字段类型与 `set_table_header` 格式的映射

每个输出字段类型应与 `set_table_header` 的 `format` 对应（见 [SDK 模块](/zh-cn/developer-guide/worker-definition/sdk-modules/) 与[输出 Schema](/zh-cn/developer-guide/worker-definition/output-schema/)）：

| Schema `type` | Header `format` |
| --- | --- |
| `string` | `text` |
| `number` | `number` |
| `integer` | `integer` |
| `boolean` | `boolean` |
| `array` | `array` |
| `object` | `object` |

### 字段输出示例

推荐输出：

```json
{
  "profile_name": "LinkedIn",
  "followers": 4659188,
  "profile_url": "https://linkedin.com/company/linkedin",
  "categories": ["Technology", "Software"]
}
```

平台展示：

| Profile Name | Followers | Profile URL | Categories |
| --- | --- | --- | --- |
| LinkedIn | 4659188 | 链接 | 2 items |

## 5. 异常处理

你的 Worker 必须妥善处理常见失败场景：

- 网络异常
- 请求超时
- 数据解析失败
- 数据源不可访问或已变更

要求：

- **自动重试**瞬时错误——使用有限次数 + 退避（如 3 次、延迟递增），避免触发 `429` 限流。
- **错误记日志**——通过 `Log.warn` / `Log.error`，切勿作为结果行。
- **保留已成功结果**——部分成功时，push 成功行并记录失败项；除非一条数据都没采到，否则不要让整次运行失败。

:::note[区分可重试错误与致命错误]
可重试：超时、瞬时 5xx、网络抖动。致命：输入无效、schema 不匹配、鉴权失败。致命错误应让运行失败并写明日志，而不是 push 错误行。
:::

## 6. 脚本版本管理

每次更新都必须可追溯。

- **记录更新内容**——维护 `README.md` 或 changelog，说明每个版本的变更。
- **历史版本可追溯**——通过 GitHub 导入时，branch、tag 或 commit 各对应一个版本，旧版本在移除前保持可用。详见[部署](/zh-cn/developer-guide/deployment/)。
- **破坏性变更升版本号**——若改动输入字段、输出 schema 或行为会影响已保存任务，应发布新版本而非覆盖，确保既有任务继续可用。

更新流程见[发布 Worker](/zh-cn/developer-guide/publishing-and-monetization/publish-your-worker/)。

## 7. 上传前自检清单

上传前逐项确认：

- [ ] 默认参数可直接运行且 `results > 0`
- [ ] 默认值无测试数据（仅真实、公开目标）
- [ ] 失败或空数据从不作为结果 push
- [ ] 错误仅写入日志
- [ ] 输出字段与声明的 schema 及 `set_table_header` 键一致
- [ ] 脚本内部请求并发与速率已限制
- [ ] 代理已从 `PROXY_AUTH` / `PROXY_DOMAIN` 配置（HTTP Worker）；未记录代理凭据
- [ ] 未禁用 TLS 校验（无 `InsecureSkipVerify` / `verify=False`）
- [ ] 代码中无硬编码凭据或密钥
- [ ] 已记录版本与变更说明

提交审核前，先在[测试环境](/zh-cn/developer-guide/test-your-worker/)验证以上全部项。

## 8. 审核红线

以下情况会导致 Worker 在审核阶段被拒绝或发布后被下架：

- 把失败/错误数据作为结果行 push
- 默认参数返回无结果或无法运行
- 默认值含测试或虚构数据
- 代码中硬编码凭据或密钥
- 禁用 TLS 校验（`InsecureSkipVerify`、`verify=False`、`rejectUnauthorized=false`）
- 日志泄露代理凭据（`PROXY_AUTH`）或完整代理 URL
- 引用未文档化的平台特性

完整审核流程见[发布 Worker](/zh-cn/developer-guide/publishing-and-monetization/publish-your-worker/)。

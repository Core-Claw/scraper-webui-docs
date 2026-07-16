---
title: 如何导出数据？
description: 下载采集数据——控制台与导出 API 均支持 8 种格式（CSV/JSON/JSONL/XLS/XLSX/HTML/XML/RSS）
sidebar:
  order: 3
---

了解如何从 CoreClaw 下载和导出采集的数据。

## 通过控制台下载

### 步骤 1：访问运行结果

1. 进入控制台的 **运行记录**
2. 点击运行 ID
3. 等待状态显示"SUCCEEDED"

### 步骤 2：查看结果

在运行详情页面，您可以看到：

- 执行状态
- 采集的项目数量
- 执行时长
- 日志记录

### 步骤 3：选择导出格式

在控制台选择您偏好的格式（共 8 种）：

| 格式 | 扩展名 | 适用场景 |
| ---- | ------ | -------- |
| **CSV** | `.csv` | 电子表格、数据分析 |
| **JSON** | `.json` | 开发者、API 集成 |
| **JSONL** | `.jsonl` | 按行分隔，便于流式处理 |
| **XLS** | `.xls` | 传统 Excel 工作簿 |
| **XLSX** | `.xlsx` | 现代 Excel 工作簿 |
| **HTML** | `.html` | 任意浏览器可查看 |
| **XML** | `.xml` | 传统与企业级流水线 |
| **RSS** | `.rss` | 阅读器与监控式集成 |

### 步骤 4：下载

点击格式按钮下载您的数据。

:::note[API 导出]
导出 API（`?format=`）同样支持这 8 种格式（大小写不敏感，默认 `csv`）。详见下文[通过 API 导出](#通过-api-导出)。
:::

## 通过 API 导出

对于自动化数据检索，可以使用 API。导出接口一次只处理一个 Worker Run，因此如果要批量导出很多次运行结果，需要自己编写脚本串起来完成。

### 获取运行结果

```bash
GET /api/v2/worker-runs/{runId}/result?offset=0&limit=20
```

### 导出运行结果

```bash
GET /api/v2/worker-runs/{runId}/result/export?format=csv&filter_keys=title%2Cprice%2Curl
```

**支持的格式：** `csv`、`json`、`jsonl`、`xlsx`、`xls`、`xml`、`html`、`rss`（大小写不敏感，默认 `csv`）。

启动或重跑 Worker 后，响应中的 `data.run_slug` 就是这里使用的 `runId`。详见[导出 API](/zh-cn/api/worker-runs/export/) 完整文档。

### 批量导出多次运行

如果每次 Task 执行都会生成一个独立 Run，目前没有一个接口可以一次性把所有 Run 合并导出。推荐写一个小脚本：先列出运行记录，再逐个导出、下载文件，最后在本地合并。

推荐流程：

1. 调用 `GET /api/v2/worker-runs?offset=0&limit=100` 分页获取 Run 列表。`limit` 最大为 `100`，如果有 12,000 个 Run，大约需要请求 120 页。
2. 从列表响应中收集每个 Run ID。列表接口返回项里的 `slug` 字段就是后续导出接口要用的 `runId`。
3. 对每个 `runId` 调用 `GET /api/v2/worker-runs/{runId}/result/export?format=csv` 或 `format=json`。
4. 读取导出响应里的 `data.download_url`，再下载对应文件。
5. 在本地合并下载后的文件。建议把 `runId` 放进文件名，或合并时加一列 `runId`，方便追溯每条数据来自哪次运行。

大批量导出时，总耗时取决于接口响应时间和文件下载大小。以 12,000 个 Run 为例，顺序执行需要对每个 Run 做一次导出请求和一次文件下载，通常要预留 1-2 小时。使用 5-10 路并发可以明显缩短总耗时，但需要处理 `429 Too Many Requests` 限流：遇到限流时降低并发，并在短暂等待后重试。

:::tip[批量导出检查清单]
- 先用前 5 个 Run 做小批量验证，确认文件能正常下载，合并后的字段和编码也符合预期。
- 每成功下载一个文件就记录进度。脚本中断后重新运行时，跳过已经下载过的文件。
- 如果只需要部分字段，可以用 `filter_keys` 限制导出字段，例如 `filter_keys=title%2Cprice%2Curl`。
- 最终要用电子表格打开时优先导出 CSV；后续由程序继续处理时优先导出 JSON。
:::

## 数据大小注意事项

| 大小 | 推荐方法 |
| ---- | -------- |
| < 10MB | 控制台下载 |
| 10MB - 100MB | API 流式传输 |
| > 100MB | 联系支持 |

## 故障排除

### 为什么下载按钮被禁用？

可能的原因：

- 运行尚未完成
- 没有采集到数据
- 账户余额不足
- 权限受限

**解决方案：** 刷新页面或检查运行状态。

### 数据为空怎么办？

检查以下内容：

- 输入参数是否正确
- 目标网站是否可访问
- 反爬措施是否阻止

查看日志了解详细错误信息。

## 最佳实践

:::tip[建议]
- 运行完成后及时下载数据
- 大规模数据检索使用 API
- 重要数据保留本地备份
- 企业项目保存执行记录
:::

## 相关主题

- [输入与输出](/zh-cn/user-guide/run-worker/input-output/) - 了解数据结构
- [API 参考](/zh-cn/api/worker-runs/export/) - 导出 API 文档

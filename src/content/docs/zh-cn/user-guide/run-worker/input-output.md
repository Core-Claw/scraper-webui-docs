---
title: 输入与输出
description: 了解 Worker 的输入参数和输出数据
sidebar:
  order: 2
---

了解如何配置 Worker 输入以及理解输出数据结构。

## 输入

每个 Worker 需要**输入参数**来指定运行方式。输入参数是一个 JSON 对象，您可以通过 CoreClaw 控制台的自动生成的 UI 表单来配置，也可以直接通过 API 传递 JSON 数据：

![输入配置界面](@/assets/docs/62.png)

用 UI 配置输入等效于使用 JSON 传递输入参数。您可以点击**批量编辑**，以便更方便地输入大量参数。

用 API 运行 Worker 时，您可以传递和 JSON 对象相同的输入。对于上图中所示的情况，对应的 JSON 输入如下：

```json
[
    {
        "lang": "en-US",
        "keyword": "711",
        "max_results": 20,
        "base_location": "New York",
        "max_reviews_per_place": 5
    }
]
```

## 选项——版本、代理节点、超时和内存

作为输入的一部分，您还可以为 Worker 运行指定脚本版本、代理节点、超时时长和内存分配等运行选项。

![运行选项](@/assets/docs/64.png)

## 输出数据

Worker 的输出是通过 `push_data` 存储的结构化数据。数据结构取决于 Worker 的用途，由 `output_schema.json` 文件定义。

### 导出格式

您可以按以下格式导出输出数据：

| 格式     | 适用场景                   |
| -------- | -------------------------- |
| **JSON** | 开发者、API 集成           |
| **CSV**  | 电子表格、数据分析         |

### 数据大小限制

- 大数据集会分页展示
- 可使用 API 流式传输大结果

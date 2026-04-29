---
title: Worker 输出配置 (Output Schema)
description: Worker 输出配置 (Output Schema) 使用手册
sidebar:
  order: 4
---

这份文档旨在指导开发者如何配置 **output_schema.json** 文件。这个文件定义了 Worker 运行后展示给用户的**输出数据表结构**（列标题）。

## 输出配置 (Output Schema) 使用手册

`output_schema.json` 定义了结果数据表的列标题。通过编辑此文件，您可以控制输出表格中展示哪些字段以及它们的标签，帮助用户清晰理解采集数据的结构。

## 整体结构

`output_schema.json` 是一个 JSON 数组，每个元素定义输出表中的一列。

### 核心示例

```json
[
  {
    "name": "title",
    "type": "string",
    "description": "标题"
  },
  {
    "name": "publish_time",
    "type": "string",
    "description": "时间"
  },
  {
    "name": "category",
    "type": "string",
    "description": "分类"
  }
]
```

## 字段说明

每个列定义包含以下属性：

| 属性           | 是否必填 | 说明                                                       |
| -------------- | -------- | ---------------------------------------------------------- |
| **name**       | 是       | 列标识符。必须与 `push_data` 中使用的键名一致。必须唯一。 |
| **type**       | 是       | 列的数据类型。支持：`string`、`integer`、`boolean`、`array`、`object` |
| **description**| 否       | 列描述。在 UI 中作为列标题标签显示。                       |

## 与 SDK 的关系

`output_schema.json` 中的 `name` 字段必须与脚本中调用 `push_data` 时使用的键名一致。

例如，使用上述配置时，脚本应推送如下数据：

### Python

```python
CoreSDK.Result.push_data(json.dumps({
    "title": "示例标题",
    "publish_time": "2024-01-01",
    "category": "新闻"
}))
```

### Node.js

```javascript
coresdk.result.pushData(JSON.stringify({
    title: "示例标题",
    publish_time: "2024-01-01",
    category: "新闻"
}));
```

### Go

```go
data, _ := json.Marshal(map[string]interface{}{
    "title":        "示例标题",
    "publish_time": "2024-01-01",
    "category":     "新闻",
})
coresdk.Result.PushData(ctx, string(data))
```

## 与 `set_table_header` 的关系

`output_schema.json` 和 `set_table_header` 都定义输出表结构，但用途不同：

- **`output_schema.json`**：在运行前声明。定义 UI 中展示的输出列，让用户在脚本启动前就能预览数据结构。
- **`set_table_header`**：在脚本运行时调用。以编程方式定义表头。

建议以 `output_schema.json` 作为定义输出结构的主要方式，确保 UI 在脚本启动前就显示正确的列布局。

## 配置小技巧

1. **字段名一致**：确保 `output_schema.json` 中的 `name` 值与 `push_data` 调用中使用的键名完全一致。
2. **描述清晰**：使用 `description` 提供有意义的列标签，帮助用户理解数据含义。
3. **类型准确**：正确设置 `type`，以便平台正确渲染和导出数据。

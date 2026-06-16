---
title: Worker Output Configuration (Output Schema)
description: Worker output configuration (Output Schema) user guide
sidebar:
  order: 4
---

This document explains how developers should configure the **output_schema.json** file. This file defines the **output data table structure** (column headers) displayed to users after a Worker run.

## Output Schema User Guide

`output_schema.json` defines the column headers of the result data table. By editing this file, you can control which fields are displayed in the output table and how they are labeled, helping users clearly understand the structure of the collected data.

## Overall Structure

`output_schema.json` is a JSON array where each element defines one column in the output table.

### Core Example

```json
[
  {
    "name": "title",
    "type": "string",
    "description": "Title"
  },
  {
    "name": "publish_time",
    "type": "string",
    "description": "Time"
  },
  {
    "name": "category",
    "type": "string",
    "description": "Category"
  }
]
```

## Field Details

Each column definition contains the following properties:

| Property       | Required | Description                                                                                   |
| -------------- | -------- | --------------------------------------------------------------------------------------------- |
| **name**       | Yes      | Column identifier. Must match the key name used in `push_data`. Must be unique.              |
| **type**       | Yes      | Data type of the column. Supported values: `string`, `number`, `integer`, `boolean`, `array`, `object` |
| **description**| No       | Column description. Displayed as the column header label in the UI.                          |

## Relationship with SDK

The `name` field in `output_schema.json` must match the key names used when calling `push_data` in your script.

For example, with the above configuration, each pushed row should use matching keys as shown below. In complete Worker code, call `set_table_header` before calling `push_data`.

### Python

```python
CoreSDK.Result.push_data(json.dumps({
    "title": "Example Title",
    "publish_time": "2024-01-01",
    "category": "News"
}))
```

### Node.js

```javascript
coresdk.result.pushData(JSON.stringify({
    title: "Example Title",
    publish_time: "2024-01-01",
    category: "News"
}));
```

### Go

```go
data, _ := json.Marshal(map[string]interface{}{
    "title":        "Example Title",
    "publish_time": "2024-01-01",
    "category":     "News",
})
coresdk.Result.PushData(ctx, string(data))
```

## Relationship with `set_table_header`

`output_schema.json` and `set_table_header` both define the output table structure, but they serve different purposes:

- **`output_schema.json`**: Declared before the run. Defines the output columns displayed in the UI, giving users a clear preview of the data structure.
- **`set_table_header`**: Called at runtime within the script. Defines the table headers programmatically.

It is recommended to use `output_schema.json` as the primary way to define output structure, ensuring the UI displays the correct column layout before the script starts.

## Configuration Tips

1. **Match field names**: Ensure `name` values in `output_schema.json` exactly match the keys used in `push_data` calls.
2. **Write clear descriptions**: Use `description` to provide meaningful column labels that help users understand the data.
3. **Choose correct types**: Set `type` accurately so the platform can render and export the data correctly.
4. **Upsert unique key**: When using `upsert_data` / `upsertData` / `UpsertData`, make sure the unique key field is also defined in `output_schema.json`. The platform needs this column to correctly match and update existing rows.

## Upsert Data Considerations

When using the **upsert** feature (update or insert by unique key), the `output_schema.json` must include the unique key column. Without it, the platform cannot match existing records for updates.

### Example

If your script uses `upsert_data(data, "id")`, your `output_schema.json` should include:

```json
[
  {
    "name": "id",
    "type": "string",
    "description": "Unique ID"
  },
  {
    "name": "title",
    "type": "string",
    "description": "Title"
  }
]
```

**Key points**:
- The unique key (e.g., `"id"`) must exist as a column in `output_schema.json`
- The unique key value must be present in every data object passed to `upsert_data`
- This applies to all three languages: Python (`upsert_data`), Node.js (`upsertData`), and Go (`UpsertData`)

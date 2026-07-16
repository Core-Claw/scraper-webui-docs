---
title: Input and Output
description: Understand Worker input parameters and output data
sidebar:
  order: 2
---

Learn how to configure Worker inputs and understand the output data structure.

## Input

Each Worker accepts input that tells it what to do. You can run a Worker from the CoreClaw Console UI and configure the input using the auto-generated form:

![Input configuration UI](@/assets/docs/61.png)

Configuring input via the UI is equivalent to passing input parameters as JSON. You can click **Batch Edit** to conveniently enter a large number of parameters at once.

When running a Worker via API, you pass the same input as a JSON object. For the example shown in the screenshot above, the corresponding JSON input would be:

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

## Options — Build, Timeout, and Memory

As part of the input, you can also specify run options for your Worker, such as the script version, proxy node, timeout, and memory allocation.

![Run Options](@/assets/docs/63.png)

## Output Data

Worker output is structured data stored via `push_data`. The structure depends on the Worker's purpose and is defined by the `output_schema.json` file.

### Export Formats

In the Console you can export output data in eight formats:

| Format    | Best For                                   |
| --------- | ------------------------------------------ |
| **CSV**   | Spreadsheets and data analysis             |
| **JSON**  | Developers and API integration             |
| **JSONL** | Line-delimited, stream-friendly pipelines  |
| **XLS**   | Legacy Excel workbooks                     |
| **XLSX**  | Modern Excel workbooks                     |
| **HTML**  | Viewable in any browser                    |
| **XML**   | Legacy and enterprise pipelines            |
| **RSS**   | Feed readers and monitor-style integrations|

:::note[API exports]
The export API (`?format=`) supports `csv` and `json` only. For the other formats, use the Console. See [How to export data](/user-guide/user-faq/how-to-export-data/).
:::

### Data Size Limits

- Large datasets are paginated
- Use API for streaming large results

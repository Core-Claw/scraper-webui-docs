---
title: Input and Output
description: Understand Worker input parameters and output data
sidebar:
  order: 2
---

Learn how to configure Worker inputs and understand the output data structure.

## Input Parameters

Each Worker accepts specific input parameters that control its behavior. These parameters are defined in the Worker's **Input Schema**.

### Common Input Types

| Type        | Description                    | Example               |
| ----------- | ------------------------------ | --------------------- |
| **string**  | Text input                     | URL, search query     |
| **number**  | Numeric input                  | Page limit, timeout   |
| **boolean** | True/false toggle              | Include images        |
| **array**   | List of values                 | Multiple URLs         |
| **object**  | Nested configuration           | Proxy settings        |

### Configuring Inputs

When running a Worker, you'll see a form based on its Input Schema:

1. **Required fields** must be filled before running
2. **Optional fields** have default values
3. **Help text** explains each parameter's purpose

## Output Data

Worker output is structured data in JSON format. The structure depends on the Worker's purpose.

### Output Structure

```json
{
  "data": [
    {
      "title": "Product Name",
      "price": 99.99,
      "url": "https://example.com/product"
    }
  ],
  "metadata": {
    "total": 100,
    "scrapedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Export Formats

You can export output data in the following formats:

| Format   | Best For                          |
| -------- | --------------------------------- |
| **JSON** | Developers, API integration       |
| **CSV**  | Spreadsheets, data analysis       |

## Data Size Limits

- Large datasets are paginated
- Use API for streaming large results

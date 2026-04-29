---
title: How to export data?
description: Download your scraped data in JSON or CSV format
sidebar:
  order: 3
---

Learn how to download and export your scraped data from CoreClaw.

## Download via Console

### Step 1: Access Run Results

1. Go to **Runs** in the console
2. Click on the Run ID
3. Wait for status to show "SUCCEEDED"

### Step 2: View Results

On the run details page, you can see:

- Execution status
- Number of items scraped
- Execution duration
- Log records

### Step 3: Select Export Format

Choose your preferred format:

| Format   | Extension | Best For                    |
| -------- | --------- | --------------------------- |
| **JSON** | `.json`   | Developers, API integration |
| **CSV**  | `.csv`    | Spreadsheets, analysis      |

### Step 4: Download

Click the format button to download your data.

## Export via API

For automated data retrieval, use the API:

### Get Run Results

```bash
GET /api/v1/runs/{run_slug}/results
```

### Export Run Result

```bash
POST /api/v1/runs/{run_slug}/export
```

**Request Body:**
```json
{
  "format": "csv",
  "filter_keys": "title,price,url"
}
```

**Supported formats:** `csv`, `json`

See [Export API](/api/run/export/) for full documentation.

## Data Size Considerations

| Size         | Recommended Method    |
| ------------ | --------------------- |
| < 10MB       | Console download      |
| 10MB - 100MB | API streaming         |
| > 100MB      | Contact support       |

## Troubleshooting

### Why is the download button disabled?

Possible reasons:

- Run has not completed yet
- No data was scraped
- Insufficient account balance
- Limited permissions

**Solution:** Refresh the page or check run status.

### What if data is empty?

Check the following:

- Input parameters are correct
- Target website is accessible
- Anti-scraping measures are not blocking

Review the logs for detailed error messages.

## Best Practices

:::tip[Recommendations]
- Download data promptly after runs complete
- Use API for large-scale data retrieval
- Keep local backups of important data
- For enterprise projects, save execution records
:::

## Related Topics

- [Input and Output](/user-guide/run-worker/input-output/) - Understand data structure
- [API Reference](/api/run/export/) - Export API documentation

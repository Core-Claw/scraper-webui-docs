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

For automated data retrieval, use the API. The export endpoint works on one Worker run at a time, so bulk exports across many runs need to be handled by your own script.

### Get Run Results

```bash
GET /api/v2/worker-runs/{runId}/result?offset=0&limit=20
```

### Export Run Result

```bash
GET /api/v2/worker-runs/{runId}/result/export?format=csv&filter_keys=title%2Cprice%2Curl
```

**Supported formats:** `csv`, `json`

Use the `runId` returned as `data.run_slug` when you start or rerun a Worker. See [Export API](/api/worker-runs/export/) for full documentation.

### Bulk export multiple runs

If each Task execution creates a separate Run, there is no single API call that exports all Runs together. Build a small script that lists the Runs, exports each Run, downloads each file, and then merges the files locally.

Recommended flow:

1. Use `GET /api/v2/worker-runs?offset=0&limit=100` to list Runs. The maximum `limit` is `100`, so 12,000 Runs requires about 120 pages.
2. Collect each Run ID from the list response. In the list API response, use the `slug` field as the `runId`.
3. For each `runId`, call `GET /api/v2/worker-runs/{runId}/result/export?format=csv` or `format=json`.
4. Read `data.download_url` from the export response and download the file.
5. Merge the downloaded files locally. Keep the `runId` in the filename or as an added column so you can trace each row back to its source Run.

For large batches, expect runtime to depend on API latency and download size. As a rough planning example, 12,000 Runs processed sequentially requires one export request and one file download per Run and may take 1-2 hours. Running 5-10 concurrent workers can reduce the total time significantly, but add retries and backoff for `429 Too Many Requests`. If you see rate limits, lower concurrency and retry after a short delay.

:::tip[Batch export checklist]
- Test with the first 5 Runs before starting the full batch. Confirm that files download correctly and the merged output has the expected columns and encoding.
- Save progress after each successful download. If the script stops midway, rerun it and skip files that already exist.
- Use `filter_keys` to export only the fields you need, for example `filter_keys=title%2Cprice%2Curl`.
- Prefer CSV when the final output will be opened in a spreadsheet, and JSON when another program will process the data.
:::

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
- [API Reference](/api/worker-runs/export/) - Export API documentation

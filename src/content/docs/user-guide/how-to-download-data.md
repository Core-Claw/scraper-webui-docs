---
title: How to Download Data?
description: Download data from CoreClaw platform.
sidebar:
    order: 2
---

## I、Steps to Download Data

##### Step 1: Access the Task Page

- Log in to your account
- Go to 「Runs」
- Click on the corresponding Template title or Run ID

##### Step 2: View Execution Results

On the task details page, you can see:

- Execution status
- Number of items scraped (Items Count)
- Execution duration
- Log records (Logs)

Once the status shows “Completed”, you may click to export and download the data.

##### Select Download Format

The system typically supports two structured data formats:

- 📊 XLSX (Excel file)
- 📦 JSON (recommended for developers)
- 🗂 API Access (for system integration)

Click the format button and select your desired option.

---

## II、Retrieve Data via API (For Enterprises and Developers)

If you need automated data retrieval, you can use the API method:

API is a custom service; please contact platform customer support for details

**Steps:**

- Go to the Template details page
- Locate the API Endpoint
- Use Token for authentication
- Fetch result data via GET request

**Recommended for:**

- Scheduled data synchronization
- System integration
- BI tool connectivity
- Automated report generation

---

## III. Frequently Asked Questions

##### ❓ Why is the download button disabled?

Possible reasons:

- Task has not yet completed
- No data was scraped
- Insufficient account balance
- Limited permissions

**Recommendation**: Refresh the page or check the task status. If the issue persists, please contact platform support.

##### ❓ What should I do if the data is empty?

Please check:

- Whether input parameters are correct
- Whether the target website supports scraping
- Whether anti-scraping measures are in place

You can review the logs for detailed error messages.

:::note[Best Practice Recommendations]

- Regularly and automatically download data for critical projects
- Use API for large-scale data retrieval
- Keep local backups after downloading
- For enterprise projects, save screenshots of execution records
  :::

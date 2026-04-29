---
title: Worker failed?
description: Troubleshoot common Worker failures
sidebar:
  order: 2
---

Learn how to diagnose and fix common Worker failures.

## Understanding Failure States

A Worker run can fail for various reasons. The run status will show **FAILED** with an error message.

## Common Failure Causes

### 1. Input Validation Errors

**Symptoms:**
- Run fails immediately
- Error message mentions "invalid input"

**Solutions:**
- Check required fields are filled
- Validate URL format
- Ensure numeric values are within range

### 2. Target Website Issues

**Symptoms:**
- Run starts but fails during execution
- Timeout errors

**Solutions:**
- Verify the website is accessible
- Check if the website has changed
- Try with Web Unlocker enabled

### 3. Anti-Scraping Detection

**Symptoms:**
- Empty results
- CAPTCHA errors
- IP blocked messages

**Solutions:**
- Enable Web Unlocker
- Use proxy rotation
- Reduce request frequency

### 4. Resource Limits

**Symptoms:**
- Out of memory errors
- Timeout errors

**Solutions:**
- Reduce scope (fewer pages)
- Split into multiple runs
- Contact support for resource upgrade

### 5. Account Issues

**Symptoms:**
- Insufficient balance
- Permission denied

**Solutions:**
- Top up account balance
- Check subscription status
- Verify API key permissions

## Debugging Steps

### Step 1: Check Run Logs

Navigate to the Run details page and review the logs:

```
[ERROR] Connection timeout after 30s
[ERROR] Failed to parse response from https://example.com
```

### Step 2: Verify Input Parameters

Double-check your input configuration:

- URLs are correct and accessible
- Required fields are filled
- Values are within expected ranges

### Step 3: Test with Minimal Input

Run with the simplest possible configuration:

- Single URL instead of multiple
- Minimal pages
- Default settings

### Step 4: Contact Support

If issues persist:

- 📧 Email: support@coreclaw.com
- Include: Run ID, error message, input parameters

## Prevention Tips

| Issue            | Prevention                           |
| ---------------- | ------------------------------------ |
| Input errors     | Validate before running              |
| Timeouts         | Use appropriate timeout settings     |
| Anti-scraping    | Enable Web Unlocker                  |
| Rate limits      | Add delays between requests          |

## Related Topics

- [Builds and Runs](/user-guide/run-worker/builds-and-runs/) - Understand run lifecycle
- [Platform Features](/developer-guide/worker-definition/platform-features/) - Bypass anti-scraping
- [API Reference](/api/) - Error codes explained

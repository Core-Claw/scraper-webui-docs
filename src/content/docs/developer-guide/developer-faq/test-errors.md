---
title: Test errors?
description: Fix common runtime errors during testing
sidebar:
  order: 3
---

Learn how to diagnose and fix common runtime errors.

## Understanding Runtime Errors

Runtime errors occur when your Worker is executing. Check the run logs for details.

## Common Runtime Errors

### 1. Connection Errors

**Symptoms:**
```
ConnectionError: Failed to establish connection
```

**Solutions:**
- Check URL is accessible
- Enable Web Unlocker
- Use proxy configuration

### 2. Timeout Errors

**Symptoms:**
```
TimeoutError: Navigation timeout of 30000 ms exceeded
```

**Solutions:**
- Increase timeout value
- Reduce page scope
- Check website availability

### 3. Element Not Found

**Symptoms:**
```
NoSuchElementException: Unable to locate element
```

**Solutions:**
- Check CSS selectors
- Wait for element to load
- Verify page structure

### 4. Empty Results

**Symptoms:**
- Worker completes but no data

**Solutions:**
- Check selectors match website
- Verify JavaScript rendering
- Check anti-scraping measures

### 5. Memory Errors

**Symptoms:**
```
MemoryError / Out of memory
```

**Solutions:**
- Process in batches
- Clear unused variables
- Reduce data size

## Debugging Steps

### Step 1: Check Run Logs

Navigate to Run details → Logs

### Step 2: Add Debug Logging

```python
from sdk import CoreSDK

CoreSDK.Log.info(f"Processing: {url}")
CoreSDK.Log.info(f"Found {len(items)} items")
CoreSDK.Log.error(f"Error: {e}")
```

### Step 3: Test with Minimal Input

- Single URL instead of multiple
- Smaller page range
- Default settings

### Step 4: Check Environment

Verify environment variables:
- `PROXY_AUTH`
- `ChromeWs`
- `PROXY_DOMAIN`

## Prevention Tips

| Issue          | Prevention                    |
| -------------- | ----------------------------- |
| Connection     | Use Web Unlocker              |
| Timeout        | Set appropriate timeouts      |
| Element        | Use flexible selectors        |
| Empty results  | Test selectors locally        |

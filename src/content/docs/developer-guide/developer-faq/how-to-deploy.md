---
title: How to deploy?
description: Deploy your Worker to CoreClaw platform
sidebar:
  order: 1
---

Learn how to deploy your Worker to CoreClaw.

## Quick Steps

### 1. Prepare Your Project

Ensure your project has the required files:

```
├── main.py              # Entry file
├── requirements.txt     # Dependencies
├── input_schema.json    # Input configuration
├── sdk.py               # CoreClaw SDK - Core functionality module
├── sdk_pb2.py           # Data processing enhancement module
└── sdk_pb2_grpc.py      # Network communication module
```

### 2. Upload to CoreClaw

Currently, **only ZIP archive files** are supported for uploading scripts.

1. Log in to CoreClaw Console
2. Go to **My Workers** → **Create Worker**
3. Package your project as a ZIP file
4. Upload the ZIP archive
5. Click **Create**

### 3. Build

After upload, CoreClaw automatically builds your Worker:

1. Installs dependencies
2. Sets up the script runtime environment
3. Runs build checks

Monitor the build logs for any errors.

### 4. Test

Before publishing, test your Worker:

1. Click **Run Worker**
2. Enter test input
3. Verify output
4. Check logs

### 5. Publish

1. Configure Worker settings
2. Set pricing (optional)
3. Click **Publish**

## Common Issues

### Build Timeout

**Cause:** Dependencies take too long to install

**Solution:**
- Minimize dependencies
- Pin dependency versions

### Import Errors

**Cause:** Missing dependencies

**Solution:**
- Check `requirements.txt` / `package.json`
- Ensure correct package names

### File Not Found

**Cause:** Incorrect file names

**Solution:**
- Entry file must be `main.py` / `main.js` / `main.go`
- Check file paths in code
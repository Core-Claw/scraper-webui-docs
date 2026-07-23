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

From the Console you can add a Worker in two ways: upload a **ZIP archive**, or **import from GitHub** (which also supports version management). See [Deployment](/developer-guide/deployment/) for the full comparison.

1. Log in to CoreClaw Console
2. Go to **My Workers** → **Create Worker**
3. Either package your project as a ZIP file and upload it, or provide a GitHub repository URL
4. Click **Create**

### 3. Automatic Processing

CoreClaw has no Docker image build. After upload, the platform automatically prepares your Worker:

1. Validates the project structure (entry file, `input_schema.json`, `output_schema.json`)
2. Reads `requirements.txt` / `package.json` and resolves dependencies
3. Prepares the script runtime with your dependencies

Monitor the logs for any errors. See [Builds & Runs](/developer-guide/builds-and-runs/) for details.

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
- Runtime entry must be `main.py` for Python, `main.js` for Node.js, or the compiled Linux amd64 executable `main` for Go
- Check file paths in code

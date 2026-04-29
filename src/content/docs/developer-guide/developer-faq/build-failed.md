---
title: Build failed?
description: Troubleshoot common build errors
sidebar:
  order: 2
---

Learn how to diagnose and fix common build failures.

## Understanding Build Failures

When a build fails, check the build logs for error messages.

## Common Build Errors

### 1. Dependency Errors

**Symptoms:**
```
ERROR: Could not find a version that satisfies the requirement
```

**Solutions:**
- Check package name spelling
- Specify version: `package==1.0.0`
- Use compatible Python version

### 2. Import Errors

**Symptoms:**
```
ModuleNotFoundError: No module named 'xxx'
```

**Solutions:**
- Add missing package to `requirements.txt`
- Check package installation name

### 3. Syntax Errors

**Symptoms:**
```
SyntaxError: invalid syntax
```

**Solutions:**
- Check Python version compatibility
- Verify code syntax
- Test locally first

### 4. File Not Found

**Symptoms:**
```
FileNotFoundError: [Errno 2] No such file or directory
```

**Solutions:**
- Check file paths
- Ensure files are uploaded
- Use relative paths

### 5. Memory Errors

**Symptoms:**
```
MemoryError / JavaScript heap out of memory
```

**Solutions:**
- Reduce dependencies
- Split into smaller packages

## Debugging Steps

### Step 1: Check Build Logs

Navigate to Worker details → Builds → View logs

### Step 2: Identify Error Type

Look for keywords:
- `ERROR`
- `Failed`
- `Exception`

### Step 3: Fix and Rebuild

1. Make necessary changes
2. Upload new code
3. Trigger new build

## Prevention Tips

| Issue          | Prevention                    |
| -------------- | ----------------------------- |
| Dependency     | Pin versions in requirements  |
| Syntax         | Test locally before uploading |
| File paths     | Use relative paths            |
| Memory         | Minimize dependencies         |

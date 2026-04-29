---
title: Deployment
description: Deploy your Worker to CoreClaw
sidebar:
  order: 6
---

Deploy your Worker to the CoreClaw platform.

---

## Upload Requirements

Currently, **only ZIP archive files** are supported for uploading scripts. Please ensure the file format is correct before uploading.

All script files **must strictly follow platform specifications**.

### Project Structure

Ensure your project includes the required files before packaging:

**Python:**
```
├── main.py              # Entry file
├── requirements.txt     # Dependencies
├── input_schema.json    # Input configuration
├── output_schema.json   # Output configuration
├── sdk.py               # CoreClaw SDK - Core functionality module
├── sdk_pb2.py           # Data processing enhancement module
└── sdk_pb2_grpc.py      # Network communication module
```

**Node.js:**
```
├── main.js              # Entry file
├── package.json         # Dependencies
├── input_schema.json    # Input configuration
├── output_schema.json   # Output configuration
├── sdk.js               # CoreClaw SDK
├── sdk_pb.js            # Protocol buffer definitions
└── sdk_grpc_pb.js       # gRPC service definitions
```

**Go:**
```
├── main.go              # Entry file
├── go.mod               # Dependencies
├── go.sum               # Dependency checksums
├── input_schema.json    # Input configuration
├── output_schema.json   # Output configuration
└── GoSdk/               # SDK directory
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

### Packaging

1. Compress all project files into a ZIP archive
2. Ensure the entry file (`main.py` / `main.js` / `main.go`) is at the root of the ZIP
3. Upload the ZIP archive to the platform

---

## Build Process

After upload, CoreClaw automatically builds your Worker:

1. Installs dependencies
2. Sets up the script runtime environment
3. Runs build checks

Monitor the build logs for any errors.

---

## Test Environment

After a successful build, you can test your Worker before publishing:

- Click **Run Worker** to start a test run
- Enter test input parameters
- Verify output and check logs
- Iterate on your code as needed

---
title: Deployment
description: Deploy your Worker to CoreClaw
sidebar:
  order: 6
---

Deploy your Worker to the CoreClaw platform.

---

## Upload Requirements

CoreClaw supports two ways to upload your Worker scripts:

### Method 1: ZIP Archive Upload

Upload your Worker as a ZIP archive file. This is the quickest way to get started.

1. Compress all project files into a ZIP archive
2. Ensure the runtime entry is at the root of the ZIP: `main.py` for Python, `main.js` for Node.js, and the compiled Linux amd64 executable `main` for Go
3. Upload the ZIP archive to the platform

### Method 2: GitHub Import

Import your Worker directly from a GitHub repository. This method supports **version management**, allowing you to track and manage different versions of your Worker.

**Supported URL formats:**

- **HTTPS**: `https://github.com/username/repository.git`
- **SSH**: `git@github.com:username/repository.git`

**Version management:**

When importing from GitHub, you can specify which version of your code to deploy:

- **Branch**: Deploy the latest code from a specific branch (e.g., `main`, `develop`)
- **Tag**: Deploy a specific tagged release (e.g., `v1.0.0`)
- **Commit**: Deploy an exact commit by its SHA hash

This allows you to maintain multiple versions, roll back to previous releases, and manage your Worker's lifecycle effectively.

---

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
├── main.go              # Source entry file
├── go.mod               # Dependencies
├── go.sum               # Dependency checksums
├── input_schema.json    # Input configuration
├── output_schema.json   # Output configuration
└── GoSdk/               # SDK directory
    ├── sdk.go
    ├── sdk.pb.go
    └── sdk_grpc.pb.go
```

For Go Workers, keep the three layers distinct:

- **Source project**: contains `main.go`, `go.mod`, `go.sum`, `GoSdk/`, `input_schema.json`, and `output_schema.json`.
- **Uploaded ZIP**: must contain a Linux amd64 executable named `main` at the ZIP root. The source entry is `main.go`; the upload/runtime entry is the compiled `main`.
- **Platform runtime**: does not guarantee that source files such as `main.go`, `go.mod`, `go.sum`, or `GoSdk/` still exist in the current working directory. Only rely on files deliberately included for runtime use.

### Packaging

1. Compress all project files into a ZIP archive
2. Ensure the runtime entry (`main.py` / `main.js` / compiled Go executable `main`) is at the root of the ZIP
3. Upload the ZIP archive to the platform, or push to GitHub and import via repository URL

:::caution[Windows packaging]
Some ordinary Windows compression tools can drop the Linux executable bit from the Go `main` binary. If that bit is lost, the Worker may fail before user code starts, sometimes without Worker logs. For Go ZIP uploads, prefer creating the final archive in Linux or WSL after running `chmod +x main`.
:::

---

## Automatic Processing

CoreClaw has no Docker image build. After upload, the platform automatically prepares your Worker:

1. Validates the project structure (entry file, `input_schema.json`, `output_schema.json`)
2. Reads `requirements.txt` / `package.json` and resolves dependencies
3. Prepares the script runtime with your dependencies

Monitor the logs for any errors. For the full lifecycle, see [Builds & Runs](/developer-guide/builds-and-runs/).

---

## Test Environment

After a successful build, you can test your Worker before publishing:

- Click **Run Worker** to start a test run
- Enter test input parameters
- Verify output and check logs
- Iterate on your code as needed

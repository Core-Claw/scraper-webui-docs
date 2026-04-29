---
title: Project Structure
description: Required project structure and files for building a Worker
sidebar:
  order: 1
---

## Project Root Required Files

### Python Project

```
├── main.py                 # Main entry file
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
├── input_schema.json       # UI Worker input configuration file
├── output_schema.json      # UI Worker output configuration file
├── sdk.py                  # SDK file
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

### Node.js Project

```
├── main.js                 # Main entry file
├── package.json            # Node.js dependencies
├── README.md               # Project documentation
├── input_schema.json       # UI Worker input configuration file
├── output_schema.json      # UI Worker output configuration file
├── sdk.js                  # SDK file
├── sdk_pb.js
├── sdk_grpc_pb.js
```

### Go Project

```
├── main.go                 # Main entry file
├── go.mod                  # Go module file
├── go.sum                  # Go dependencies checksum
├── README.md               # Project documentation
├── input_schema.json       # UI Worker input configuration file
├── output_schema.json      # UI Worker output configuration file
├── GoSdk/                  # SDK directory
│   ├── sdk.go
│   ├── sdk.pb.go
│   └── sdk_grpc.pb.go
```

## Core Files Explained

### Core Entry File

- **main.py** / **main.js** / **main.go**: The main entry point for the Worker project.
- The filename **must** be `main`, with the extension depending on the chosen language.

### Dependency Management

| Language | File | Purpose |
|----------|------|---------|
| Node.js | `package.json` | Node.js dependencies |
| Python | `requirements.txt` | Python dependencies |
| Go | `go.mod` | Go module definition |

These files declare all dependencies required to run the project.

### Configuration File: `input_schema.json`

- UI Worker input configuration file
- Defines the input form displayed on the platform
- See [Input Schema](/developer-guide/worker-definition/input-schema/) for details

### Configuration File: `output_schema.json`

- UI Worker output configuration file
- Defines the output data table structure (column headers)
- See [Output Schema](/developer-guide/worker-definition/output-schema/) for details

### Documentation: `README.md`

- Documentation of Worker functionality
- Includes usage instructions and important notes

## SDK Functionality Modules

### 1. Environment Parameter Access

- Get runtime parameters passed when the script starts
- Access task configuration, authentication info, etc.

### 2. Data Storage

- Define data table structure (headers)
- Store collected result data
- Support batch saving and resume from breakpoint

### 3. Log Output

- Standardized log interface
- Support multiple log levels: INFO, WARN, ERROR
- Logs are automatically collected and displayed by the platform

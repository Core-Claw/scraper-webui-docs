---
title: Worker Directory Structure
description: Required project structure and files for building and publishing a Worker.
sidebar:
    order: 2
---

## Required Files in the Project Root

```
Example Python project root:
├── main.py                 # Main entry file
├── requirements.txt        # Python dependency list
├── README.md               # Project documentation
├── input_schema.json       # UI Worker configuration file
├── sdk.py                  # SDK file
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

```
Example Node.js project root:
├── main.js                 # Main entry file
├── package.json            # Node.js dependency list
├── README.md               # Project documentation
├── input_schema.json       # UI Worker configuration file
├── sdk.js                  # SDK file
├── sdk_pb.js
├── sdk_grpc_pb.js
```

```
Example Go project root:
├── main.go                 # Main entry file
├── go.mod                  # Go module file
├── go.sum                  # Go dependency checksum
├── README.md               # Project documentation
├── input_schema.json       # UI Worker configuration file
├── GoSdk/                  # SDK directory
│   ├── sdk.go
│   ├── sdk.pb.go
│   └── sdk_grpc.pb.go
```

### Core Entry File

- **main.py** / **main.js** / **main**: the main entry point of the Worker project.
- The file name **must** be `main` and the extension depends on the selected language.

### Dependency Management

- **package.json** for Node.js projects
- **requirements.txt** for Python projects
- **go.mod** for Go projects
- These files declare all dependencies required to run the project.

### Configuration File: `input_schema.json`

- UI Worker configuration file
- Defines the input form displayed on the platform

### Documentation: `README.md`

- Worker functionality documentation
- Includes usage instructions and important notes

## SDK Functional Modules

##### 1. Environment Parameter Access

- Retrieve runtime parameters passed during container startup
- Access task configuration, authentication information, and more

##### 2. Data Storage

- Define data table structures (headers)
- Store scraped result data
- Supports batch saving and resumable uploads

##### 3. Logging Output

- Standardized logging interfaces
- Supports multiple log levels such as INFO, WARN, and ERROR
- Logs are automatically collected and displayed by the platform

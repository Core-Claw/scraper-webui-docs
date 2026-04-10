---
title: Worker directory structure
sidebar:
    order: 2
---

## 📁 必需文件清单（项目根目录下）

```
Example using a Python project root directory:
├── main.py                 # Main entry file
├── requirements.txt        # Python dependency list
├── README.md               # Project documentation
├── input_schema.json       # UI Script configuration file
├── sdk.py                  # SDK file
├── sdk_pb2.py
├── sdk_pb2_grpc.py
```

```
Example using a Node.js project root directory:
├── main.js                 # Main entry file
├── package.json            # Node.js dependency list
├── README.md               # Project documentation
├── input_schema.json       # UI Script configuration file
├── sdk.js                  # SDK file
├── sdk_pb.js
├── sdk_grpc_pb.js
```

```
Example using a Go project root directory:
├── main.go                 # Main entry file
├── go.mod                  # Go module file
├── go.sum                  # Go dependency checksum
├── README.md               # Project documentation
├── input_schema.json       # UI Script configuration file
├── GoSdk/                  # SDK directory
│   ├── sdk.go
│   ├── sdk.pb.go
│   └── sdk_grpc.pb.go
```

### Core Entry File

- **main.py** / **main.js** / **main** (depending on project type; currently supports Python, Go, and Node.js)
    - The main entry point of the crawler script
    - The file name **must** be `main` (file extension depends on the language)

### Dependency Management

- **package.json**（Node.js projects）
- **requirements.txt**（Python projects）
- **go.mod**（Go projects）
- Used to declare all dependencies required to run the project

### Configuration Files(input_schema.json)

- UI Script configuration file
- Defines the input form interface displayed on the platform for the script

### Documentation(README.md)

- Worker functionality documentation
- Includes usage instructions and important notes

## 🛠️ SDK Functional Modules

##### 1. Environment Parameter Access

- Retrieve runtime parameters passed during container startup
- Access crawler task configurations, authentication information, and more

##### 2. Data Storage

- Define data table structures (headers)
- Store scraped result data
- Supports batch saving and resumable uploads

##### 3. Logging Output

- Standardized logging interfaces
- Supports multiple log levels (INFO, WARN, ERROR, etc.)
- Logs are automatically collected and displayed by the platform

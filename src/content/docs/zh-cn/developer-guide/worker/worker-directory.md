---
title: Worker 目录结构
sidebar:
    order: 2
---

## 📁 必需文件清单（项目根目录下）

```
以Python项目根目录为例：
├── main.py                 # 主入口文件
├── requirements.txt        # Python依赖包列表
├── README.md               # 项目说明文档
├── input_schema.json       # UI模板配置文件
├── sdk.py                  # sdk文件
├── sdk_pd2.py
├── sdk_pd2_grpc.py
```

### 核心入口文件

- **main.py** / **main.js** / **main**（根据项目类型选择，目前支持python，go，node.js）
    - 爬虫脚本的主入口文件
    - 命名必须为 `main`（扩展名根据语言确定）

### 依赖管理

- **package.json**（Node.js 项目）
- **requirements.txt**（Python 项目）
- 用于声明项目运行所需的所有依赖包

### 输入配置文件（input_schema.json）

- UI 模板配置文件
- 定义Worker在平台上的输入表单界面

### 文档说明（README.md）

- Worker 功能说明文档
- 包含使用方法和注意事项

## 🛠️ SDK 功能模块

##### 1. 环境参数获取

- 获取容器启动时传入的运行参数
- 访问爬虫任务配置、认证信息等

##### 2. 数据存储

- 设置数据表结构（表头）
- 存储爬取结果数据
- 支持分批保存和续传

##### 3. 日志输出

- 标准化的日志记录接口
- 支持不同级别（INFO、WARN、ERROR等）
- 日志自动收集和展示

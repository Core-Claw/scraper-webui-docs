---
title: SDK 模块
description: CoreClaw SDK 模块和 API 用于 Worker 开发
sidebar:
  order: 4
---

CoreClaw SDK 提供用于 Worker 开发的核心模块。

## SDK 文件说明

以下 SDK 文件是**必需的**，必须放置在项目中：

### Python 项目

| 文件名              | 主要功能           |
| ------------------- | ------------------ |
| **sdk.py**          | 核心功能模块       |
| **sdk_pb2.py**      | 数据处理增强模块   |
| **sdk_pb2_grpc.py** | 网络通信模块       |

### Node.js 项目

| 文件名               | 主要功能           |
| -------------------- | ------------------ |
| **sdk.js**           | 核心功能模块       |
| **sdk_pb.js**        | 数据处理增强模块   |
| **sdk_grpc_pb.js**   | 网络通信模块       |

### Go 项目

| 文件名                 | 主要功能           |
| ---------------------- | ------------------ |
| **GoSdk/sdk.go**       | 核心功能模块       |
| **GoSdk/sdk.pb.go**    | 数据处理增强模块   |
| **GoSdk/sdk_grpc.pb.go** | 网络通信模块    |

这些文件共同构成脚本的**工具箱**，提供 Worker 执行和与平台后端系统交互所需的所有核心能力。

---

## 核心功能使用指南

### 1. 环境参数

**获取脚本启动时传入的配置**

脚本启动时，可以传入外部配置参数（如目标网站 URL、搜索关键词等）。

#### Python

```python
from sdk import CoreSDK

# 以字典形式获取所有输入参数
parameters = CoreSDK.Parameter.get_input_json_dict()

# 以原始 JSON 字符串获取
json_str = CoreSDK.Parameter.get_input_json_str()
```

#### Node.js

```javascript
const coresdk = require('./sdk')

// 以解析后的 JSON 对象获取
const inputJson = await coresdk.parameter.getInputJSONObject()

// 以原始 JSON 字符串获取
const jsonString = await coresdk.parameter.getInputJSONString()
```

#### Go

```go
import coresdk "test/GoSdk"

// 以原始 JSON 字符串获取
inputJSON, err := coresdk.Parameter.GetInputJSONString(ctx)
```

**使用场景：**
如果需要为不同任务采集不同网站的数据，只需传入不同参数，无需修改脚本代码。

---

### 2. 运行日志

**记录脚本执行进度**

执行过程中可以输出不同级别的日志信息。这些日志会显示在平台界面上，方便监控执行状态和排查问题。

#### Python

```python
from sdk import CoreSDK

CoreSDK.Log.debug("正在连接目标网站...")
CoreSDK.Log.info("成功采集了 10 条新闻")
CoreSDK.Log.warn("检测到网络延迟")
CoreSDK.Log.error("无法访问目标网站")
```

#### Node.js

```javascript
const coresdk = require('./sdk')

await coresdk.log.debug("正在连接目标网站...")
await coresdk.log.info("成功采集了 10 条新闻")
await coresdk.log.warn("检测到网络延迟")
await coresdk.log.error("无法访问目标网站")
```

#### Go

```go
coresdk.Log.Debug(ctx, "正在连接目标网站...")
coresdk.Log.Info(ctx, "成功采集了 10 条新闻")
coresdk.Log.Warn(ctx, "检测到网络延迟")
coresdk.Log.Error(ctx, "无法访问目标网站")
```

#### 日志级别说明

* **debug**：最详细的日志，开发阶段推荐使用
* **info**：正常执行流程，关键步骤推荐使用
* **warn**：潜在问题，不会中断执行
* **error**：需要关注的错误

---

### 3. 返回结果

**将采集到的数据发送回平台**

采集到数据后，需要通过**两步**将数据返回给平台。

---

#### 第一步：定义表头（必需）

在推送数据之前，先定义表格结构——类似于 Excel 中定义列标题。

##### Python

```python
headers = [
    {"label": "新闻标题", "key": "title", "format": "text"},
    {"label": "发布时间", "key": "publish_time", "format": "text"},
    {"label": "分类", "key": "category", "format": "text"},
]

res = CoreSDK.Result.set_table_header(headers)
```

##### Node.js

```javascript
const headers = [
    { label: "新闻标题", key: "title", format: "text" },
    { label: "发布时间", key: "publish_time", format: "text" },
    { label: "分类", key: "category", format: "text" },
]

await coresdk.result.setTableHeader(headers)
```

##### Go

```go
headers := []*coresdk.TableHeaderItem{
    {Label: "新闻标题", Key: "title", Format: "text"},
    {Label: "发布时间", Key: "publish_time", Format: "text"},
    {Label: "分类", Key: "category", Format: "text"},
}

res, err := coresdk.Result.SetTableHeader(ctx, headers)
```

##### 字段说明

* **label**：展示给用户的列名（建议使用有意义的描述性名称）
* **key**：代码中使用的唯一标识（建议小写+下划线）
* **format**：数据类型，支持以下值：
  * `"text"`：字符串/文本
  * `"integer"`：整数
  * `"boolean"`：布尔值（true / false）
  * `"array"`：列表/数组
  * `"object"`：字典/对象

---

#### 第二步：逐条推送数据记录

##### Python

```python
news_data = [
    {"title": "AI 突破", "publish_time": "2023-10-01", "category": "科技"},
    {"title": "今日股市", "publish_time": "2023-10-01", "category": "财经"},
]

for i, news in enumerate(news_data):
    res = CoreSDK.Result.push_data(news)
    CoreSDK.Log.info(f"已推送第 {i + 1} 条记录: {news.get('title')}")
```

##### Node.js

```javascript
const newsData = [
    { title: "AI 突破", publish_time: "2023-10-01", category: "科技" },
    { title: "今日股市", publish_time: "2023-10-01", category: "财经" },
]

for (let i = 0; i < newsData.length; i++) {
    await coresdk.result.pushData(newsData[i])
    await coresdk.log.info(`已推送第 ${i + 1} 条记录: ${newsData[i].title}`)
}
```

##### Go

```go
for i, news := range newsData {
    jsonBytes, _ := json.Marshal(news)
    res, err := coresdk.Result.PushData(ctx, string(jsonBytes))
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("推送数据失败: %v", err))
        return
    }
    coresdk.Log.Info(ctx, fmt.Sprintf("已推送第 %d 条记录", i+1))
}
```

##### 注意事项

* 表头定义和数据推送**顺序不限**
* 数据的 key **必须与表头 key 完全一致**（区分大小写）
* 数据必须**逐条推送**
* 建议每次推送后记录日志

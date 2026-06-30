---
title: Worker 输入配置 (Input Schema)
description: Worker 输入配置 (Input Schema) 使用手册
sidebar:
  order: 3
---

这份文档旨在指导开发者如何配置 **input_schema.json** 文件。这个文件决定了自动化 Worker 在网页界面上呈现给用户的**输入表单样式**。

---

## 脚本输入配置 (Input Schema) 使用手册

`input_schema.json` 是脚本的"面孔"。通过修改此文件，您可以控制用户在启动脚本前需要填写哪些参数（如 URL、关键词、日期等），以及这些输入框是以什么形式展示的（下拉框、勾选框、文本框等）。

## 一、整体结构解析

一个标准的配置文件通常包含以下根字段：

1. **description (描述)**：向用户介绍这个脚本的功能和用法。
2. **concurrency (并发配置)**：决定平台如何把一次 Worker 运行拆分成多个 task。
3. **properties (参数列表)**：具体的功能设置项。

### 核心代码示例

```json
{
    "description": "With our Instagram Reel information scraper tool, after a successful scrape, you can extract the Reel author's username, Reel caption, hashtags used in the post, number of comments on the Reel, Reel publish date, likes count, views count, play count, popular comments, unique post identifier, URL of the Reel's display image or video thumbnail, product type, Reel duration, video URL, post audio link, number of posts on the profile, number of followers on the profile, profile URL, whether the account is a paid partner, and other relevant information.",
    "concurrency": {
        "fields": ["startUrl"]
    },
    "properties": [
        {
            "title": "URL",
            "name": "startUrl",
            "type": "array",
            "editor": "requestList",
            "description": "This parameter is used to specify the Instagram access URL to be fetched.",
            "default": [
                {
                    "url": "https://www.instagram.com/reel/C5Rdyj_q7YN/"
                }
            ],
            "required": true
        }
    ]
}
```

## 二、关键根字段说明

| 字段名称        | 是否必填 | 功能说明                                                                                                               |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| **description** | 否       | **工具简介**。会显示在页面顶端，支持填写脚本的作用、注意事项等，字数不限。                                             |
| **concurrency** | 否       | **任务拆分配置**。用于拆分 task，包含 `fields` 和可选的 `remove_fields`。 |
| **properties**  | **是**   | **参数配置数组**。这里存放所有的输入项，每一个元素代表页面上的一个输入框或选择器。                                     |

---

## 三、并发与任务拆分规则

提交运行任务时，CoreClaw 会按以下顺序判断如何拆分 task：

1. 如果 `concurrency.fields` 中至少有一个非空字段名，平台使用并发规则。
2. 如果 `concurrency.fields` 为空或不存在，整份提交的输入会作为一个 task 运行。

### `concurrency` 字段说明

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `fields` | `string[]` | 候选并发字段列表。每个字段都应匹配一个 `properties[*].name`，且对应 property 的 `type` 应为 `array`。 |
| `remove_fields` | `string[]` | 可选。用于在优先字段有值时，从 task 输入中剔除某些字段。每个值也应属于 `fields`。 |

平台会先计算：

```text
preferred = fields - remove_fields
```

然后选择真正参与拆分的 active fields：

- 如果 `preferred` 中任意字段在提交输入里有非空值，则只使用 `preferred` 参与拆分。
- 否则使用完整的 `fields`，包括写在 `remove_fields` 里的字段。

### 空值过滤

拆分 task 前，平台会过滤空的并发元素。以下值会被视为空：

- `null`
- 空字符串或纯空白字符串，例如 `""` 或 `"   "`
- 空对象，例如 `{}`
- 所有字段值都为空的对象，例如 `{ "place_id": "" }` 或 `{ "foo": null, "bar": "" }`

如果某个并发数组过滤后为空，这个字段就会被视为“无值”。

### task 生成规则

每个生成出来的 task 遵循以下规则：

- 当前被拆分的字段会保留，并且只包含当前这一项。
- 其他 active 并发字段会保留为 `[""]`。
- 被 `remove_fields` 禁用的字段会从 task 输入中整个删除。
- 非并发字段会复制到每一个 task。

带关键词回退的示例：

```json
{
    "concurrency": {
        "fields": ["keywords", "google_maps_urls", "place_ids"],
        "remove_fields": ["keywords"]
    },
    "properties": [
        {
            "title": "Keywords",
            "name": "keywords",
            "type": "array",
            "editor": "stringList",
            "description": "Search keywords",
            "required": false
        },
        {
            "title": "Google Maps URLs",
            "name": "google_maps_urls",
            "type": "array",
            "editor": "requestList",
            "description": "Google Maps URLs",
            "required": false
        },
        {
            "title": "Place IDs",
            "name": "place_ids",
            "type": "array",
            "editor": "stringList",
            "description": "Google Maps place IDs",
            "required": false
        }
    ]
}
```

如果用户提交：

```json
{
    "keywords": ["pizza", "iphone"],
    "google_maps_urls": ["urlA", "urlB"],
    "place_ids": [],
    "base_location": "New York, USA"
}
```

平台会生成两个 task：

```json
{
    "google_maps_urls": ["urlA"],
    "place_ids": [""],
    "base_location": "New York, USA"
}
```

```json
{
    "google_maps_urls": ["urlB"],
    "place_ids": [""],
    "base_location": "New York, USA"
}
```

因为 `google_maps_urls` 有值，并且 `keywords` 在 `remove_fields` 中，所以 `keywords` 会被整个删除。

如果 `google_maps_urls` 和 `place_ids` 都为空，平台会回落到 `keywords` 拆分，并把另外两个并发字段保留为 `[""]`。

### 常见边界场景

| 场景 | 结果 |
| ---- | ---- |
| 不写 `remove_fields` | `fields` 中所有非空字段都会参与拆分。task 数量等于这些字段有效元素数量之和。 |
| `fields` 只有一个字段 | 运行会按这一个数组字段拆分。 |
| `remove_fields` 字段被禁用 | 该 key 会从 task 输入中整个删除，不会保留为 `[""]`。 |
| preferred 字段只有 `""`、`null`、`{}` 或全空对象 | 视为空，不会触发 `remove_fields`。 |
| URL 中包含 `&` | 平台会按提交值保留 URL。Worker 代码里避免再次用会 HTML 转义 `&` 的方式序列化。 |
| 并发数组里包含超大整数 | 平台 JSON 解析阶段会保留数值，但如果还要跨语言或跨服务读取，仍建议传字符串。 |
| 生成 task 数超过限制 | 平台会先计数再拒绝运行，不会先展开全部 task payload。业务侧仍应避免提交超大数组。 |

### 并发数组元素类型

`custom[fieldName]` 数组中的每个元素都遵循同一套规则：

| 元素类型 | 示例 | 是否支持 | 处理方式 |
| -------- | ---- | -------- | -------- |
| 对象 | `{ "url": "https://a.com" }` | 支持 | 合并进 task 输入，不再保留在并发字段名下面；子字段覆盖父级字段。 |
| 字符串 | `"pizza"` | 支持 | 包装成 `["pizza"]`。纯空白字符串会被过滤为空。 |
| 数字 | `42`, `3.14` | 支持 | 包装成 `[42]` 或 `[3.14]`。平台解析器会保留超大整数，但跨语言传输时仍建议用字符串。 |
| 布尔值 | `true` | 支持 | 包装成 `[true]`。 |
| `null` | `null` | 视为空 | 拆分前过滤。 |
| 嵌套数组 | 把 `["first", "second"]` 当作一个元素 | 不支持 | 会触发运行时报错。 |
| 对象和原始值混用 | `[{ "url": "a" }, "x"]` | 不支持 | 会触发运行时报错。同一个字段内应保持元素类型一致。 |

### 运行时报错速查

| 报错信息 | 触发原因 | 修复建议 |
| -------- | -------- | -------- |
| `input_schema is not a valid json` | schema 文件不是合法 JSON。 | 上传前先校验 JSON。 |
| `custom parameters must contain a single JSON object` | 提交输入不是单个顶层 object。 | 提交单个 JSON object。 |
| `concurrency fields must have at least one field` | `concurrency.fields` 没有有效字段名。 | 至少添加一个字段名。 |
| `concurrency fields have no non-empty fields` | 所有并发字段过滤后都为空。 | 至少提交一个非空值。 |
| `field [X] must be an array` | 并发字段存在，但值不是数组。 | 改成数组值。 |
| `item at index N in [X] must be an object or primitive value` | 并发数组元素是嵌套数组或不支持的类型。 | 使用对象或原始值元素。 |
| `field [X] must not mix object and primitive items` | 同一个数组里混用了对象和原始值。 | 统一元素类型。 |
| `concurrency_num (N) exceeds limit (M)` | 生成的 task 数超过平台限制。 | 减少输入数量或调整平台限制。 |

### 并发配置核对清单

- 使用 `concurrency.fields` 配置任务拆分。
- 每个并发字段都应匹配一个 `properties[*].name`，且对应 `type: "array"`。
- 如果使用 `remove_fields`，它应是 `fields` 的子集。
- 不要假设 `remove_fields` 中的字段一定存在于 task 输入里；它可能会被整个删除。
- 同一个并发数组里不要混用对象元素和原始值元素。
- 不要使用嵌套数组作为并发元素。

---

## 四、参数项属性详解 (Properties 内部)

每一个具体的输入项都必须是对象。普通 Worker schema 中，每个 property 建议包含以下字段：

| 字段 | 类型 | 是否必填 | 说明 |
| ---- | ---- | -------- | ---- |
| `title` | `string` | 是 | 表单展示名称。 |
| `name` | `string` | 是 | Worker 代码读取的内部字段名。必须唯一，建议匹配 `^[A-Za-z_][A-Za-z0-9_]*$`。 |
| `type` | `string` | 是 | 数据类型，见下方 type 表。 |
| `editor` | `string` | 是 | 前端表单控件，见下方 editor 表。 |
| `description` | `string` | 是 | 输入框下方的补充说明。 |
| `required` | `boolean` | 是 | 设为 `true` 时，用户不填无法启动 Worker。 |
| `default` | 与 `type` 一致 | 否 | 表单初始值，类型应与 `type` 匹配。 |
| `options` | `array` | 否 | `checkbox`、`select`、`radio` 的可选项。 |

### 支持的 `type` 取值

| Type | 含义 | 常见 `default` | 常用 editor |
| ---- | ---- | -------------- | ----------- |
| `string` | 字符串 | `"abc"` | `input`、`textarea`、`select` |
| `integer` | 整数 | `42` | `number`、`input` |
| `number` | 浮点数 | `3.14` | `number` |
| `boolean` | 布尔值 | `true` / `false` | `switch` |
| `array` | 数组 | `[]` / `[...]` | `checkbox`、`stringList`、`requestList` |
| `object` | 对象 | `{}` | 较少直接使用 |

### 推荐的 editor 与 type 搭配

| Editor | 推荐 type | 用途 |
| ------ | --------- | ---- |
| `input` | `string`、`integer`、`number` | 单行文本或简单数字输入 |
| `textarea` | `string` | 多行文本 |
| `number` | `integer`、`number` | 数字输入 |
| `switch` | `boolean` | 开关设置 |
| `checkbox` | `array` | 多选 |
| `select` | `string`、`integer` | 单选下拉 |
| `radio` | `string`、`integer` | 单选按钮 |
| `stringList` | `array` | 字符串列表 |
| `requestList` | `array` | URL 或请求对象列表 |

---

## 五、编辑器类型 (Editor) 选型指南

您可以根据需要选择不同的 editor 来优化用户体验：

### 1. 基础文本与数字

| 类型值       | 呈现形式     | 适用场景                       |
| ------------ | ------------ | ------------------------------ |
| **input**    | 单行文本框   | 简短文字、关键词、账号名。     |
| **textarea** | 多行大文本框 | 备注、长段文字说明。           |
| **number**   | 数字调节框   | 限制采集数量、页码、等待秒数。 |

### 2. 选择器

| 类型值       | 呈现形式 | 示例                       |
| ------------ | -------- | -------------------------- |
| **select**   | 下拉菜单 | 选性别、选语言、选地区。   |
| **radio**    | 单选框   | 二选一、三选一的排列按钮。 |
| **checkbox** | 多选框   | 勾选多个感兴趣的标签。     |
| **switch**   | 开关     | 是否开启                   |

### 3. 时间与特殊列表

| 类型值                | 呈现形式      | 适用场景                                            |
| --------------------- | ------------- | --------------------------------------------------- |
| **datepicker**        | 日期选择器    | 筛选特定发布日期。                                  |
| **requestList**       | URL 地址列表  | 批量输入需要采集的网页链接（支持 Excel 导入样式）。 |
| **requestListSource** | URL请求列表源 | 可自定义配置其他参数。                              |
| **stringList**        | 字符串列表    | 批量输入多个关键词。                                |

---

## 六、常用组件代码示例

### 1. 单行文本框 (input)

```json
{
    "title": "Location (use only one location per run)",
    "name": "location",
    "type": "string",
    "editor": "input",
    "default": "New York, USA"
}
```

### 2. 多行大文本框 (textarea)

```json
{
    "title": "Filter reviews by keywords",
    "name": "keywords",
    "type": "string",
    "editor": "textarea"
}
```

### 3. 数字调节框 (number)

```json
{
    "title": "Number of places to extract (per each search term or URL)",
    "name": "maxPlacesPerSearch",
    "type": "integer",
    "editor": "number",
    "default": 4
}
```

### 4. 下拉菜单 (select)

> 设置 `multiple: true` 后，用户可以选择多个选项。

```json
{
    "title": "Language",
    "name": "language",
    "type": "string",
    "editor": "select",
    "options": [
        {
            "label": "English",
            "value": "en"
        },
        {
            "label": "Chinese",
            "value": "zh"
        }
    ],
    "default": "en"
}
```

### 5. 单选框 (radio)

```json
{
    "title": "Category",
    "name": "radio",
    "type": "integer",
    "editor": "radio",
    "options": [
        {
            "label": "hotel",
            "value": 1
        },
        {
            "label": "restaurant",
            "value": 2
        }
    ],
    "default": 1
}
```

### 6. 多选框 (checkbox)

```json
{
    "title": "Data Sections to Scrape",
    "name": "data_sections",
    "type": "array",
    "editor": "checkbox",
    "options": [
        {
            "label": "Reviews",
            "value": "reviews"
        },
        {
            "label": "Address",
            "value": "address"
        },
        {
            "label": "Phone Number",
            "value": "phone_number"
        }
    ],
    "default": ["reviews", "address"]
}
```

### 7. 日期选择器 (datepicker)

```json
{
    "title": "Extract posts that are newer than",
    "name": "date",
    "type": "string",
    "editor": "datepicker",
    "format": "DD/MM/YYYY",
    "valueFormat": "DD/MM/YYYY"
}
```

### 8. 开关 (switch)

```json
{
    "title": "Skip closed places",
    "name": "skipClosed",
    "type": "boolean",
    "editor": "switch"
}
```

### 9. URL 地址列表 (requestList)

对象数组，支持自定义键名：

```json
{
    "name": "startURLs",
    "type": "array",
    "title": "Start URLs",
    "editor": "requestList",
    "default": [
        {
            "key": "value1"
        },
        {
            "key": "value2"
        }
    ],
    "required": true,
    "description": "The URLs of the website to scrape"
}
```

或纯字符串数组：

```json
{
    "name": "startURLs",
    "type": "array",
    "title": "Start URLs",
    "editor": "requestList",
    "default": [
        "value1",
        "value2"
    ],
    "required": true,
    "description": "The URLs of the website to scrape"
}
```


### 10. URL 请求列表源 (requestListSource)

与 `requestList` 类似，但允许通过 `param_list` 为每个 URL 条目定义额外的自定义参数。

```json
{
    "name": "url",
    "type": "array",
    "title": "startURLs",
    "editor": "requestListSource",
    "default": [
        {
            "url": "https://www.instagram.com/espn",
            "num_of_posts": "10"
        }
    ],
    "param_list": [
        {
            "param": "url",
            "title": "URL",
            "required": true,
            "description": "要采集的 URL 地址"
        },
        {
            "param": "num_of_posts",
            "title": "最大帖子数",
            "description": "最多获取的帖子数量"
        }
    ],
    "description": "要采集的网站 URL"
}
```

### 11. 字符串列表 (stringList)

对象数组，支持自定义键名：

```json
{
    "title": "Search term(s)",
    "name": "searchTerms",
    "type": "array",
    "editor": "stringList",
    "default": [
        {
            "key": "value1"
        },
        {
            "key": "value2"
        }
    ]
}
```

或纯字符串数组：

```json
{
    "title": "Search term(s)",
    "name": "searchTerms",
    "type": "array",
    "editor": "stringList",
    "default": [
        "value1",
        "value2"
    ]
}
```


---

## 分组配置

允许开发者通过特定的字段标，将多个配置项进行逻辑归类。当配置项数量较多时，通过分组可以有效提升界面的可读性与可维护性，帮助用户更清晰地定位和理解配置内容。

| 参数               | 示例值 | 参数类型 | 是否必填 | 参数描述                                                             |
| ------------------ | ------ | -------- | -------- | -------------------------------------------------------------------- |
| sectionCaption     | -      | String   | 否       | 用于定义个分组的显示标题。当配置项中包含此属性时，视为新分组的开始。 |
| sectionDescription | -      | String   | 否       | 用于对当前分组进行补充说明，提供更详细的上下文信息。                 |

### 示例

```json
{
    "description": "Find usernames across 400+ social networks. Check if a username is available or already taken on various platforms.",
    "concurrency": {
        "fields": ["username"]
    },
    "properties": [
        {
            "title": "Username",
            "name": "username",
            "type": "array",
            "editor": "stringList",
            "description": "Username(s) to search. One per line.",
            "default": [
                "john_doe"
            ],
            "required": true
        },
        {
            "title": "Timeout (secs)",
            "name": "timeout",
            "type": "integer",
            "editor": "number",
            "description": "Request timeout in seconds per site.",
            "default": 30,
            "sectionCaption": "Request control and result settings",
            "sectionDescription": "Configure the performance parameters of the crawler requests."
        }
    ]
}
```

## 配置小技巧

1. **清晰的提示**：description 务必清晰准确，这将有利于您的脚本被更多目标用户检索到。
2. **设置默认值**：合理的 default 可以让用户直接点击运行，极大地降低使用门槛。
3. **校验必填**：对于没有它脚本就无法运行的参数（如登录 Cookie、主链接），一定要设置 `"required": true`。
4. **明确配置任务拆分**：需要按数组输入拆分 task 时，使用 `concurrency.fields`。只有当一种输入模式需要禁用另一种输入模式时，才使用 `remove_fields`。
5. **最大结果数命名**：如果 Worker 需要限制最大返回条数，字段名应使用 `max_results`。这是平台及下游集成所识别的标准命名。

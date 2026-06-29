---
title: Worker Input Configuration (Input Schema)
description: A manual for Worker input configuration (Input Schema)
sidebar:
  order: 3
---

This document explains how developers should configure the **input_schema.json** file. This file determines the **input form layout** presented to users in the web interface of an automation Worker.

## Input Schema User Guide

`input_schema.json` is the "face" of your script. By editing this file, you can control which parameters users must fill in before launching the script, such as URLs, keywords, dates, and more, as well as how those fields are displayed, such as dropdowns, checkboxes, and text inputs.

## 1. Overall Structure

A standard configuration file commonly contains these top-level fields:

1. **description**: Introduces the script's purpose and usage to the user.
2. **concurrency**: Defines how the platform splits one Worker run into tasks. New Workers should use this field.
3. **b**: Legacy single-field task splitting key. Existing Workers can keep using it, but new Workers should prefer `concurrency.fields`.
4. **properties**: The list of specific parameter settings.

### Core Example

```json
{
    "description": "With our Instagram Reel information Worker tool, after a successful scrape, you can extract the Reel author's username, Reel caption, hashtags used in the post, number of comments on the Reel, Reel publish date, likes count, views count, play count, popular comments, unique post identifier, URL of the Reel's display image or video thumbnail, product type, Reel duration, video URL, post audio link, number of posts on the profile, number of followers on the profile, profile URL, whether the account is a paid partner, and other relevant information.",
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

## 2. Key Root Fields

| Field Name      | Required | Description                                                                                                                                                                                      |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **description** | No       | **Tool summary**. Displayed at the top of the page. You can use it to describe the script's purpose, notes, and more. There is no length limit.                                                  |
| **concurrency** | No       | **Task splitting configuration**. New format for splitting one run into multiple tasks. It contains `fields` and optional `remove_fields`. |
| **b**           | No       | **Legacy task splitting key**. Used only when `concurrency.fields` is empty or missing. It must match the `name` of an array property. |
| **properties**  | **Yes**  | **Parameter configuration array**. This contains all input items, and each element represents one input field or selector on the page.                                                           |

---

## 3. Concurrency and Task Splitting

CoreClaw decides how to split a submitted run by checking the schema in this order:

1. If `concurrency.fields` contains at least one non-empty field name, the platform uses the new concurrency rules.
2. If `concurrency.fields` is empty or missing and `b` is non-empty, the platform uses the legacy `b` rule.
3. If neither configuration is available, the whole submitted input becomes one task.

When `concurrency.fields` and `b` both exist, `concurrency.fields` takes priority and `b` is ignored.

### `concurrency` Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `fields` | `string[]` | Candidate input fields used for task splitting. Each field should match a `properties[*].name` whose `type` is `array`. |
| `remove_fields` | `string[]` | Optional fields to remove from task input when a preferred field has values. Each value should also appear in `fields`. |

The platform first calculates:

```text
preferred = fields - remove_fields
```

Then it chooses active fields:

- If `preferred` has any field with a non-empty value in the submitted input, only `preferred` fields are active.
- Otherwise, all `fields` are active, including fields listed in `remove_fields`.

### Empty Value Filtering

Before splitting tasks, the platform filters empty concurrency items. The following values are treated as empty:

- `null`
- Empty or whitespace-only strings, such as `""` or `"   "`
- Empty objects, such as `{}`
- Objects where every value is empty, such as `{ "place_id": "" }` or `{ "a": null, "b": "" }`

If a concurrency array becomes empty after filtering, that field is treated as having no value.

### Task Output Rules

For every generated task:

- The field currently being split is kept with one item.
- Other active concurrency fields are kept as `[""]`.
- Fields disabled through `remove_fields` are removed from the task input entirely.
- Non-concurrency fields are copied into every generated task.

Example with keyword fallback:

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

If the submitted input is:

```json
{
    "keywords": ["pizza", "iphone"],
    "google_maps_urls": ["urlA", "urlB"],
    "place_ids": [],
    "base_location": "New York, USA"
}
```

The platform generates two tasks:

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

`keywords` is removed because `google_maps_urls` has values and `keywords` is listed in `remove_fields`.

If `google_maps_urls` and `place_ids` are both empty, the platform falls back to `keywords` and keeps the other concurrency fields as `[""]`.

### Common Edge Cases

| Case | Result |
| ---- | ------ |
| `remove_fields` is omitted | Every non-empty field in `fields` participates in splitting. Task count is the sum of valid items across those fields. |
| `fields` contains one field | Behavior is equivalent to legacy `b`, but `concurrency.fields` is the recommended format. |
| A `remove_fields` field is disabled | The key is removed from task input entirely. It is not kept as `[""]`. |
| A preferred field contains only `""`, `null`, `{}`, or objects with only empty values | It is treated as empty and does not trigger `remove_fields`. |
| A URL contains `&` | The platform keeps the URL value as submitted. Avoid re-serializing it in Worker code in a way that HTML-escapes `&`. |
| A concurrency array contains very large integers | The platform preserves them during JSON parsing, but strings are still safer if another language or service will read the value. |
| The generated task count exceeds the limit | The platform counts tasks first and rejects the run before expanding all task payloads. Avoid submitting very large arrays. |

### Legacy `b` Compatibility

Existing schemas can keep using `b`:

```json
{
    "description": "Old schema demo",
    "b": "startURLs",
    "properties": [
        {
            "title": "Start URLs",
            "name": "startURLs",
            "type": "array",
            "editor": "requestList",
            "default": [
                { "url": "https://example.com/a" },
                { "url": "https://example.com/b" }
            ],
            "description": "The URLs to scrape",
            "required": true
        }
    ]
}
```

This schema splits tasks by `startURLs`. Whitespace around `b` is trimmed. If you add `concurrency.fields` later, that new configuration takes priority.

### Supported Concurrency Item Types

Whether you use `concurrency.fields` or legacy `b`, every item inside `custom[fieldName]` follows the same rules:

| Item type | Example | Supported | Behavior |
| --------- | ------- | --------- | -------- |
| Object | `{ "url": "https://a.com" }` | Yes | Merged into the task input instead of staying under the concurrency field name; child values override parent values. |
| String | `"pizza"` | Yes | Wrapped as `["pizza"]`. Whitespace-only strings are filtered as empty. |
| Number | `42`, `3.14` | Yes | Wrapped as `[42]` or `[3.14]`. Very large integers are preserved by the platform parser, but strings are still safer across languages. |
| Boolean | `true` | Yes | Wrapped as `[true]`. |
| `null` | `null` | Treated as empty | Filtered before splitting. |
| Nested array | `["a", "b"]` as one item | No | Causes a runtime error. |
| Mixed object and primitive items | `[{ "url": "a" }, "x"]` | No | Causes a runtime error. Use one item shape per field. |

### Runtime Error Quick Reference

| Error message | Cause | Fix |
| ------------- | ----- | --- |
| `input_schema is not a valid json` | The schema file is not valid JSON. | Validate the file before upload. |
| `custom parameters must contain a single JSON object` | Submitted input is not one top-level object. | Send a single JSON object as input. |
| `concurrency fields must have at least one field` | `concurrency.fields` contains no valid field names. | Add at least one field name. |
| `concurrency fields have no non-empty fields` | All configured concurrency fields are empty after filtering. | Submit at least one non-empty value. |
| `missing concurrency field [X]` | Legacy `b` points to a field missing from submitted input. | Include that field in input. |
| `field [X] must be an array` | A concurrency field exists but is not an array. | Send an array value. |
| `concurrency field [X] is empty` | Legacy `b` mode received an empty array. | Submit at least one value. |
| `item at index N in [X] must be an object or primitive value` | A concurrency item is a nested array or unsupported type. | Use object or primitive items. |
| `field [X] must not mix object and primitive items` | One array mixes object items and primitive items. | Use a consistent item type. |
| `concurrency_num (N) exceeds limit (M)` | Generated task count exceeds the platform limit. | Reduce input size or adjust platform limits. |

### Concurrency Checklist

- Use `concurrency.fields` for new Workers.
- Keep `b` only for legacy schemas.
- Make every concurrency field match a `properties[*].name` with `type: "array"`.
- If you use `remove_fields`, keep it as a subset of `fields`.
- Do not rely on `remove_fields` keys being present in task input; they can be removed entirely.
- Do not mix object items and primitive items inside the same concurrency array.
- Do not use nested arrays as concurrency items.

---

## 4. Property Details Inside `properties`

Each input item must be an object. In normal Worker schemas, each property should contain these fields:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `title` | `string` | Yes | Field label shown in the form. |
| `name` | `string` | Yes | Internal field name used by Worker code. It must be unique and should match `^[A-Za-z_][A-Za-z0-9_]*$`. |
| `type` | `string` | Yes | Data type. See the type table below. |
| `editor` | `string` | Yes | Form control used in the web interface. See the editor table below. |
| `description` | `string` | Yes | Helper text shown below the field. |
| `required` | `boolean` | Yes | If `true`, the Worker cannot start until the user fills in this field. |
| `default` | Same as `type` | No | Initial value shown in the form. It should match `type`. |
| `options` | `array` | No | Option list for `checkbox`, `select`, or `radio`. |

### Supported `type` Values

| Type | Meaning | Typical `default` | Common editors |
| ---- | ------- | ----------------- | -------------- |
| `string` | Text | `"abc"` | `input`, `textarea`, `select` |
| `integer` | Integer | `42` | `number`, `input` |
| `number` | Floating-point number | `3.14` | `number` |
| `boolean` | Boolean | `true` / `false` | `switch` |
| `array` | List | `[]` / `[...]` | `checkbox`, `stringList`, `requestList` |
| `object` | Object | `{}` | Rarely used directly |

### Recommended Editor and Type Pairings

| Editor | Recommended type | Use case |
| ------ | ---------------- | -------- |
| `input` | `string`, `integer`, `number` | Single-line text or simple numeric input |
| `textarea` | `string` | Multi-line text |
| `number` | `integer`, `number` | Numeric input |
| `switch` | `boolean` | On/off setting |
| `checkbox` | `array` | Multiple choices |
| `select` | `string`, `integer` | Single-select dropdown |
| `radio` | `string`, `integer` | Single-choice radio group |
| `stringList` | `array` | List of strings |
| `requestList` | `array` | List of URL or request objects |

---

## 5. Editor Type Guide

You can choose different `editor` types based on your needs to improve the user experience.

### 1. Basic Text and Number Inputs

| Type Value   | UI Form            | Common Use Cases                    |
| ------------ | ------------------ | ----------------------------------- |
| **input**    | Single-line input  | Short text, keywords, account names |
| **textarea** | Multi-line textbox | Notes, long text descriptions       |
| **number**   | Number input       | Limits, page numbers, wait seconds  |

### 2. Selectors

| Type Value   | UI Form       | Example Use Cases                  |
| ------------ | ------------- | ---------------------------------- |
| **select**   | Dropdown      | Gender, language, region           |
| **radio**    | Radio group   | One-of-two or one-of-three choices |
| **checkbox** | Checkbox set  | Select multiple tags of interest   |
| **switch**   | Toggle switch | Enable or disable an option        |

### 3. Date and Special List Inputs

| Type Value            | UI Form            | Common Use Cases                                                      |
| --------------------- | ------------------ | --------------------------------------------------------------------- |
| **datepicker**        | Date picker        | Filter by a specific publish date                                     |
| **requestList**       | URL list           | Batch input for page links to scrape, with Excel-style import support |
| **requestListSource** | URL request source | Allows additional custom parameters                                   |
| **stringList**        | String list        | Batch input for multiple keywords                                     |

---

## 6. Common Component Examples

### 1. Single-line Input (`input`)

```json
{
    "title": "Location (use only one location per run)",
    "name": "location",
    "type": "string",
    "editor": "input",
    "default": "New York, USA"
}
```

### 2. Multi-line Textarea (`textarea`)

```json
{
    "title": "Filter reviews by keywords",
    "name": "keywords",
    "type": "string",
    "editor": "textarea"
}
```

### 3. Number Input (`number`)

```json
{
    "title": "Number of places to extract (per each search term or URL)",
    "name": "maxPlacesPerSearch",
    "type": "integer",
    "editor": "number",
    "default": 4
}
```

### 4. Dropdown (`select`)

> Set `multiple: true` attribute for select to enable multiple mode.

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

### 5. Radio Group (`radio`)

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

### 6. Checkbox Group (`checkbox`)

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

### 7. Date Picker (`datepicker`)

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

### 8. Toggle Switch (`switch`)

```json
{
    "title": "Skip closed places",
    "name": "skipClosed",
    "type": "boolean",
    "editor": "switch"
}
```

### 9. URL List (`requestList`)

Object array with custom key names:

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

OR plain string array:

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


### 10. URL Request Source (`requestListSource`)

Similar to `requestList`, but allows you to define additional custom parameters for each URL entry via `param_list`.

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
            "description": "The URL to scrape"
        },
        {
            "param": "num_of_posts",
            "title": "Maximum Posts",
            "description": "Maximum number of posts to fetch"
        }
    ],
    "description": "The URLs of the website to scrape"
}
```

### 11. String List (`stringList`)

Object array with custom key names:

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

OR plain string array:

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

## Grouped Configuration

Developers can logically group multiple configuration items by using specific fields. When there are many configuration items, grouping improves readability and maintainability, helping users locate and understand the settings more easily.

| Parameter          | Example Value | Type   | Required | Description                                                                                                                          |
| ------------------ | ------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| sectionCaption     | -             | String | No       | Defines the display title of a group. When this property appears in a configuration item, it is treated as the start of a new group. |
| sectionDescription | -             | String | No       | Adds extra explanation for the current group and provides more detailed context.                                                     |

### Example

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

## Configuration Tips

1. **Write clear descriptions**: Make sure `description` is clear and accurate. This helps your script get discovered by more target users.
2. **Set sensible defaults**: A reasonable `default` value lets users run the script immediately and greatly lowers the barrier to entry.
3. **Validate required fields**: For parameters without which the script cannot run, such as login cookies or the main URL, be sure to set `"required": true`.
4. **Configure task splitting deliberately**: Use `concurrency.fields` for array inputs that should split into tasks. Use `remove_fields` only when one input mode should disable another.
5. **Max results naming**: If your Worker accepts a maximum-results parameter, use the field name `max_results`. This is the conventional name recognized by the platform and downstream integrations.

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

A standard configuration file consists of the following three parts:

1. **description**: Introduces the script's purpose and usage to the user.
2. **b**: The concurrency key field that determines how the script splits tasks.
3. **properties**: The list of specific parameter settings.

### Core Example

```json
{
    "description": "With our Instagram Reel information Worker tool, after a successful scrape, you can extract the Reel author's username, Reel caption, hashtags used in the post, number of comments on the Reel, Reel publish date, likes count, views count, play count, popular comments, unique post identifier, URL of the Reel's display image or video thumbnail, product type, Reel duration, video URL, post audio link, number of posts on the profile, number of followers on the profile, profile URL, whether the account is a paid partner, and other relevant information.",
    "b": "startUrl",
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
| **b**           | **Yes**  | **Task splitting key**. This must match the `name` of one element inside `properties`, and that element's `type` must be `array`. The script uses this field for concurrent processing, for example, splitting tasks by the number of URLs. |
| **properties**  | **Yes**  | **Parameter configuration array**. This contains all input items, and each element represents one input field or selector on the page.                                                           |

---

## 3. Property Details Inside `properties`

Each input item can contain the following settings:

- **title**: The label displayed on the page, for example, "Search Keywords".
- **name**: The internal ID used by the program. It **must be unique** and cannot contain Chinese characters.
- **type**:
  - `string`: text
  - `integer`: number
  - `boolean`: switch (`true` / `false`)
  - `array`: list / multi-select
  - `object`: object
- **editor**: Determines which form control is used to render the input item in the web interface. See the table below.
- **description**: Helper text shown below the input field to guide the user.
- **default**: The initial displayed value or option.
- **required**: If set to `true`, the script cannot be started unless the user fills in this field.

---

## 4. Editor Type Guide

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

## 5. Common Component Examples

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

```json
{
    "name": "startURLs",
    "type": "array",
    "title": "Start URLs",
    "editor": "requestList",
    "default": [
        {
            "url": "https://example.com/page1"
        },
        {
            "url": "https://example.com/page2"
        }
    ],
    "required": true,
    "description": "The URLs of the website to scrape"
}
```

### 10. String List (`stringList`)

```json
{
    "title": "Search term(s)",
    "name": "searchTerms",
    "type": "array",
    "editor": "stringList",
    "default": [
        {
            "string": "restaurant"
        },
        {
            "string": "school"
        }
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
    "b": "username",
    "properties": [
        {
            "title": "Username",
            "name": "username",
            "type": "array",
            "editor": "stringList",
            "description": "Username(s) to search. One per line.",
            "default": [
                {
                    "string": "john_doe"
                }
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

## Configuration Tips

1. **Write clear descriptions**: Make sure `description` is clear and accurate. This helps your script get discovered by more target users.
2. **Set sensible defaults**: A reasonable `default` value lets users run the script immediately and greatly lowers the barrier to entry.
3. **Validate required fields**: For parameters without which the script cannot run, such as login cookies or the main URL, be sure to set `"required": true`.

---
title: Worker Input Configuration (Input Schema)
description: A manual for Worker input configuration (Input Schema)
sidebar:
    order: 3
---

This document explains how developers should configure the **input\_schema.json** file. This file determines the **input form layout** presented to users in the web interface of an automation Worker.

***

## 🛠️ Input Schema User Guide

`input_schema.json` is the "face" of your script. By editing this file, you can control which parameters users must fill in before launching the script, such as URLs, keywords, dates, and more, as well as how those fields are displayed, such as dropdowns, checkboxes, and text inputs.

## 1. Overall Structure

A standard configuration file consists of the following three parts:

1. **description**: Introduces the script's purpose and usage to the user.
2. **b**: The concurrency key field that determines how the script splits tasks.
3. **properties**: The list of specific parameter settings.

### Core Example

```json
{
    "description": "With our Instagram Reel information Worker tool, after a successful scrape, you can extract the Reel author's username, Reel caption, hashtags used in the post, number of comments on the Reel, Reel publish date, likes count, views count, play count, popular comments, unique post identifier, URL of the Reel's display image or video thumbnail, product type, Reel duration, video URL, post audio link, number of posts on the profile, number of followers on the profile, profile URL, whether the account is a paid partner, and other relevant information. Currently, the tool can scrape via Instagram username, URL, and other methods, and the scrape results can be downloaded in various structured formats.",
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
                },
                {
                    "url": "https://www.instagram.com/reel/C85BZjeSHuO"
                }
            ],
            "required": true
        }
    ]
}
```

### Output Example: Input

![Input Schema output example](@/assets/docs/img_34.jpg)

## 2. Key Root Fields

| Field Name      | Required | Description                                                                                                                                                                                      |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **description** | No       | **Tool summary**. Displayed at the top of the page. You can use it to describe the script's purpose, notes, and more. There is no length limit.                                                  |
| **b**           | **Yes**  | **Task splitting key**. This must match the `name` of one element inside `properties`. The script uses this field for concurrent processing, for example, splitting tasks by the number of URLs. |
| **properties**  | **Yes**  | **Parameter configuration array**. This contains all input items, and each element represents one input field or selector on the page.                                                           |

***

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

***

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

***

## 5. Common Component Examples

### 1. Single-line Input (`input`)

```json
{
    "title": "📍 Location (use only one location per run)",
    "name": "location",
    "type": "string",
    "editor": "input",
    "default": "New York, USA"
}
```

![Input field example](@/assets/docs/img_35.jpg)

### 2. Multi-line Textarea (`textarea`)

```json
{
    "title": "Filter reviews by keywords",
    "name": "keywords",
    "type": "string",
    "editor": "textarea"
}
```

![Textarea example](@/assets/docs/img_36.jpg)

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

![Number input example](@/assets/docs/img_37.jpg)

### 4. Dropdown (`select`)

> Set `multiple: true` attribute for select to enable multiple mode.

```json
{
    "title": "🌍 Language",
    "name": "language",
    "type": "string",
    "editor": "select",
    "options": [
        {
            "label": "English",
            "value": "en"
        },
        {
            "label": "Afrikaans",
            "value": "af"
        },
        {
            "label": "azərbaycan",
            "value": "az"
        }
    ],
    "default": "en"
}
```

![Dropdown select example](@/assets/docs/img_38.jpg)

### 5. Radio Group (`radio`)

```json
{
    "title": "🏢 Category",
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

![Radio group example](@/assets/docs/img_39.jpg)

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

![Checkbox group example](@/assets/docs/img_40.jpg)

### 7. Date Picker (`datepicker`)

```json
{
    "title": "📅 Extract posts that are newer than",
    "name": "date",
    "type": "string",
    "editor": "datepicker",
    "format": "DD/MM/YYYY", // Controls the display format shown in the input field (optional)
    "valueFormat": "DD/MM/YYYY" // Controls the format of the bound value (optional)
}
```

![Date picker example](@/assets/docs/img_41.jpg)

```json
// editor:"datepicker"
// dateType: 'absoluteOrRelative'
{
    "title": "📅 Extract posts that are newer than",
    "name": "date",
    "type": "string",
    "editor": "datepicker",
    "dateType": "absoluteOrRelative"
}
```

![Date picker absolute or relative](@/assets/docs/img_42.jpg)

![Date picker relative date options](@/assets/docs/img_43.jpg)

### 8. Toggle Switch (`switch`)

```json
{
    "title": "⏩ Skip closed places",
    "name": "skipClosed",
    "type": "boolean",
    "editor": "switch"
}
```

![Toggle switch example](@/assets/docs/img_44.jpg)

### 9. URL List (`requestList`)

```json
{
    "name": "startURLs",
    "type": "array",
    "title": "Start URLs",
    "editor": "requestList",
    "default": [
        {
            "url": "https://www.google.com/search?sca_esv=593729410&q=Software+Engineer+jobs&uds=AMIYvT8-5jbJIP1-CbwNj1OVjAm_ezkS5e9c6xL1Cc4ifVo4bFIMuuQemtnb3giV7cKava9luZMDXVTS5p4powtoyb0ACtDGDu9unNkXZkFxC0i7ZSwrZd_aHgim6pFgOWgs0dte0pnb&sa=X&ictx=0&biw=1621&bih=648&dpr=2&ibp=htl;jobs&ved=2ahUKEwjt-4-Y6KyDAxUog4kEHSJ8DjQQudcGKAF6BAgRECo"
        },
        {
            "url": "https://www.google.com.hk/search?q=software+engineer+salary&newwindow=1&sca_esv=593729410&biw=1588&bih=1273&ei=vEtOadCxI-3AkPIP952z0Qc&oq=Software+Engineer&gs_lp=Egxnd3Mtd2l6LXNlcnAiEVNvZnR3YXJlIEVuZ2luZWVyKgIIAjIKEAAYgAQYQxiKBTIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEj2yQFQ0TFYlbEBcAR4AZABBJgBkwOgAbUXqgEHMi0zLjQuMrgBA8gBAPgBAZgCBqACiAWoAgPCAgoQABiwAxjWBBhHwgIgEAAYgAQYtAIY1AMY5QIY5wYYtwMYigUY6gIYigPYAQGYAwTxBcFiu8bFvIEOiAYBkAYKugYECAEYB5IHCTQuMC4xLjAuMaAHvy6yBwcyLTEuMC4xuAf1BMIHAzItNsgHGIAIAA&sclient=gws-wiz-serp"
        }
    ],
    "required": true,
    "description": "The URLs of the website to scrape"
}
```

![URL list example](@/assets/docs/img_45.jpg)

### 10. URL Request Source (`requestListSource`)

```json
{
    "title": "startURLs",
    "name": "url",
    "type": "array",
    "editor": "requestListSource",
    "default": [
        {
            "url": "https://www.instagram.com/espn",
            "end_date": "",
            "start_date": "",
            "num_of_posts": "10",
            "posts_to_not_include": ""
        }
    ],
    "param_list": [
        {
            "param": "url",
            "title": "URL",
            "editor": "input",
            "type": "string",
            "required": true,
            "description": "This parameter is used to specify the Instagram access URL to be fetched."
        },
        {
            "param": "num_of_posts",
            "title": "Maximum Number of Reels",
            "type": "integer",
            "editor": "number",
            "description": "This parameter is used to specify the maximum number of Reels to fetch."
        },
        {
            "param": "start_date",
            "title": "Start Date",
            "type": "string",
            "editor": "datepicker",
            "format": "MM-DD-YYYY",
            "valueFormat": "MM-DD-YYYY",
            "description": "This parameter is used to specify the start time of the post, format: mm-dd-yyyy, and should be earlier than the \"end_date\"."
        },
        {
            "param": "end_date",
            "title": "End Date",
            "type": "string",
            "editor": "datepicker",
            "format": "MM-DD-YYYY",
            "valueFormat": "MM-DD-YYYY",
            "description": "This parameter is used to specify the end time of the post, format: mm-dd-yyyy, and should be later than the \"start_date\"."
        }
    ],
    "description": "The URLs of the website to scrape"
}
```

![URL request source example](@/assets/docs/img_46.jpg)

### 11. String List (`stringList`)

```json
{
    "title": "🔍 Search term(s)",
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

![String list example](@/assets/docs/img_47.jpg)

***

## 📚 Grouped Configuration

Developers can logically group multiple configuration items by using specific fields. When there are many configuration items, grouping improves readability and maintainability, helping users locate and understand the settings more easily.

| Parameter          | Example Value | Type   | Required | Description                                                                                                                          |
| ------------------ | ------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| sectionCaption     | -             | String | No       | Defines the display title of a group. When this property appears in a configuration item, it is treated as the start of a new group. |
| sectionDescription | -             | String | No       | Adds extra explanation for the current group and provides more detailed context.                                                     |

#### Example

```json
{
    "description": "🔍 Find usernames across 400+ social networks. Check if a username is available or already taken on various platforms.",
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
            "sectionCaption": "🧩 Request control and result settings",
            "sectionDescription": "Configure the performance parameters of the crawler requests (such as timeout and concurrency), and control the filtering rules and output range of search results."
        },
        {
            "title": "Concurrency",
            "name": "maxConcurrency",
            "type": "integer",
            "editor": "number",
            "description": "Maximum concurrent requests.",
            "default": 20
        },
        {
            "title": "Include NSFW",
            "name": "includeNsfw",
            "type": "boolean",
            "editor": "switch",
            "description": "Include adult content sites in search.",
            "default": false
        },
        {
            "title": "Show All Results",
            "name": "printAll",
            "type": "boolean",
            "editor": "switch",
            "description": "Show all results including not found.",
            "default": false
        },
        {
            "title": "Specific Sites",
            "name": "sites",
            "type": "array",
            "editor": "requestList",
            "description": "Only check these sites (empty = all sites).",
            "default": [],
            "sectionCaption": "🔗 Target site restrictions?",
            "sectionDescription": "Configure the specific list of websites to be checked. If the list is empty, all available sites will be checked by default."
        }
    ]
}
```

![Grouped configuration example](@/assets/docs/img_48.jpg)

## 💡 Configuration Tips

1. **Write clear descriptions**: Make sure `description` is clear and accurate. This helps your script get discovered by more target users.
2. **Set sensible defaults**: A reasonable `default` value lets users run the script immediately and greatly lowers the barrier to entry.
3. **Validate required fields**: For parameters without which the script cannot run, such as login cookies or the main URL, be sure to set `"required": true`.


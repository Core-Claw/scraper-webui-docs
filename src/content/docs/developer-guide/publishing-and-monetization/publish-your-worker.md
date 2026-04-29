---
title: Publish Your Worker
description: Publish your script as a private script or to the CoreClaw Store
sidebar:
  order: 1
---

CoreClaw supports publishing both **private scripts** and **public scripts**. All script execution files **must strictly follow platform specifications**.

---

## Upload Restrictions

> Currently, **only ZIP archive files are supported** for script uploads. Please ensure your file format is correct before uploading.

---

## Publishing a Private Script

After the script is created, it can be executed **immediately without review**, but it can **only run in the test environment**.

- No review required
- Can be run immediately
- **Only visible to you**

![Private script](@/assets/docs/img_45.jpg)

Private scripts are ideal for:

- Testing and debugging your script
- Running scripts for personal use
- Iterating on your script before public release

---

## Publishing to the Store

If you want your script to generate revenue, you can publish it publicly to the [CoreClaw Store](https://coreclaw.com/store).

For detailed revenue rules, see [Monetize Your Worker](/developer-guide/publishing-and-monetization/monetize-your-worker/).

### Submission Process

1. Select **"Submit and Publish to Store"**
2. The script enters the review queue
3. After approval, the script will be automatically listed in the Store
4. It will appear in relevant categories and search results

![Publish to Store](@/assets/docs/img_17.jpg)

### Review Criteria

The platform reviews scripts for:

- **Functionality** — Does the script work as described?
- **Code quality** — Is the code clean and well-structured?
- **Input schema** — Are parameters clearly defined?
- **Output format** — Is the data structure correct?
- **Description** — Is the description accurate and helpful?

---

## Configuration Tips

1. **Clear descriptions** — Ensure the `description` is clear and accurate. This significantly improves discoverability and user understanding.
2. **Set sensible defaults** — Reasonable default values allow users to run the script with a single click, greatly lowering the barrier to use.
3. **Focus on popular platforms** — Scripts targeting popular platforms (such as **e-commerce** and **social media**) are more likely to gain attention and usage.

---

## Updating a Published Script

To update a published script:

1. Make changes to your code
2. Upload a new version as a ZIP archive
3. Build and test the new version
4. Publish the new version

Previous versions remain available until you remove them.

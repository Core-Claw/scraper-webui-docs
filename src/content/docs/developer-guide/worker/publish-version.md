---
title: Publish Version
description: Learn how versioning works when publishing Script updates.
sidebar:
    order: 10
---

## What is a Published Version?

On the CoreClaw platform, each Script can generate a new published version after updates or modifications. Published versions are used to:

- Track script update history
- Ensure stability of production executions
- Allow users to select specific versions to run

Each official release generates an independent version number.

## How to Publish a New Version

1. Log in to the Console
2. Navigate to the Script management page
3. Edit the script content or configuration
4. Click the "Publish" button
5. The system generates a new version number

After publishing, new tasks will use the latest version by default (unless a specific version is specified).

## Version Management

The platform typically supports the following operations:

- View historical versions
- Select a specific version to run tasks
- Roll back to a previous stable version
- Delete draft versions (if applicable)

:::tip[Best Practice]
Keep a stable version before making major changes so you can quickly roll back if needed.
:::

## Important Notes

- Modifying script content does not automatically affect running tasks
- Only reviewed and published versions can be used for production execution
- Different versions may correspond to different billing or resource consumption rates

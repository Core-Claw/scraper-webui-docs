---
title: n8n
description: Connect CoreClaw to n8n workflows using the CoreClaw community node
sidebar:
  order: 1
---

Use [n8n](https://n8n.io/) to build automated workflows that trigger CoreClaw Workers, poll run status, and route results to any service — no code required.

## How it works

The CoreClaw n8n integration provides a dedicated community node (`n8n-nodes-coreclaw`) with four resources and built-in actions for common operations:

- **Scraper** — Search the marketplace, get scraper details, and run a scraper
- **Run** — Get status, get results, export results, get logs, abort, or rerun an execution
- **Task** — Run a pre-configured saved task
- **Account** — Get account info (balance, traffic, plan)

You can also use the **HTTP Request** node to call the CoreClaw REST API directly for advanced use cases.

## Prerequisites

- A [CoreClaw](https://console.coreclaw.com/sign-up) account
- An API key from **Settings → API & Integrations** in the [CoreClaw Console](https://console.coreclaw.com/settings/integrations)
- An n8n instance (cloud or self-hosted)

---

## n8n Cloud setup

### Install the CoreClaw node

For n8n Cloud users, installation is straightforward — search and add the node directly from the canvas.

1. In n8n Cloud, create a new workflow or open an existing one.
2. Open the **nodes panel** (click the **+** button on the canvas).
3. Search for **CoreClaw** in the community node registry.

![Search for CoreClaw node in n8n](@/assets/docs/n8n-1.png)

4. Click **Install node** to add the CoreClaw node to your instance.

![Install n8n-nodes-coreclaw package](@/assets/docs/n8n-2.png)

After installation, you can find the CoreClaw node under **Community Nodes** in the nodes panel.

![CoreClaw node in Community Nodes list](@/assets/docs/n8n-3.png)

### Create credentials

Before using the CoreClaw node, you need to create a credential with your CoreClaw API key.

1. In n8n, go to **Credentials** → **Add Credential**.
2. Search for **CoreClaw API** and select it.

![Create CoreClaw API credential](@/assets/docs/n8n-4.png)

3. Enter a name for the credential (e.g., "CoreClaw Production").
4. In the **API Key** field, paste the API key you copied from the [CoreClaw Console](https://console.coreclaw.com/settings/integrations).

![Enter API key and save credential](@/assets/docs/n8n-5.png)

5. Click **Save** to store the credential.

You can now use this credential in any CoreClaw node in your workflows.

---

## n8n self-hosted setup

If you're running a self-hosted n8n instance, install the CoreClaw community node from the settings.

### Install

1. Open your n8n instance.
2. Go to **Settings** → **Community Nodes**.
3. Click **Install a community node**.
4. Enter the npm package name: `n8n-nodes-coreclaw`
5. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes and click **Install**.
6. After installation, the CoreClaw node appears in your nodes panel under **Community Nodes**.

### Connect

Follow the same steps as [Create credentials](#create-credentials) above to set up your CoreClaw API key.

---

## CoreClaw node actions

The CoreClaw node is organized by **resource** (Scraper, Run, Task, Account). Select a resource, then choose the operation you want to perform.

### Scraper resource

#### Search

Search the CoreClaw marketplace for ready-to-run scrapers by keyword.


| Field     | Description                                                |
| --------- | ---------------------------------------------------------- |
| **Query** | Keyword matched against scraper title / description / tags |
| **Limit** | Max number of results to return (1–100, default: 50)       |


#### Get Details

Fetch the full spec of a scraper: current version, system defaults, custom input schema, and README.


| Field       | Description                                              |
| ----------- | -------------------------------------------------------- |
| **Scraper** | Pick from the marketplace list, or paste a slug directly |


#### Run

Start an asynchronous scraper run with custom parameters.


| Field                 | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| **Scraper**           | Pick from the marketplace list, or paste a slug directly                 |
| **Version**           | Scraper version string (required). Obtain from **Get Details** → version |
| **Custom Parameters** | Scraper-specific input parameters as JSON (schema from Get Details)      |
| **System Parameters** | Optional JSON overrides for cpus, memory, timeout, max charge, traffic   |
| **Callback URL**      | Optional webhook URL for async notifications                             |


:::caution
**Version is required.** The node does not support "leave empty for latest". Always obtain the correct version string from **Get Details** first.
:::

Get the `scraper_slug` (Worker Slug) from the Worker page in the [CoreClaw Console](https://console.coreclaw.com/store) or from the API (`GET /api/scraper?slug=<scraper_slug>`).

### Run resource

#### Get

Get the current execution status of a run (status, started_at, duration, cost).


| Field        | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| **Run Slug** | The run identifier returned when starting a scraper or task |


Status codes: `1` Ready, `2` Running, `3` Succeeded, `4` Failed, `5` Aborting.

#### Get Many

List the user's historical scraper runs with pagination and filters.


| Field          | Description                                          |
| -------------- | ---------------------------------------------------- |
| **Return All** | Whether to return all results or only up to a limit  |
| **Limit**      | Max number of results to return (1–200, default: 50) |
| **Filters**    | Filter by status and/or scraper slug                 |


#### Get Results

Get paginated result records from a completed run.


| Field          | Description                                          |
| -------------- | ---------------------------------------------------- |
| **Run Slug**   | The run identifier                                   |
| **Return All** | Whether to return all results or only up to a limit  |
| **Limit**      | Max number of results to return (1–500, default: 50) |


#### Export Results

Export a run's full result set as a downloadable CSV or JSON file.


| Field           | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| **Run Slug**    | The run identifier                                                   |
| **Format**      | `csv` (human-readable, opens in Excel) or `json` (preserves nesting) |
| **Filter Keys** | Comma-separated field keys to include. Leave empty for all fields.   |


#### Get Logs

Fetch execution logs from a run for debugging or understanding failures.


| Field        | Description        |
| ------------ | ------------------ |
| **Run Slug** | The run identifier |


#### Abort

Cancel an in-progress scraper run.


| Field        | Description                 |
| ------------ | --------------------------- |
| **Run Slug** | The run identifier to abort |


#### Rerun

Re-run a previous run with the exact same parameters.


| Field            | Description                                  |
| ---------------- | -------------------------------------------- |
| **Run Slug**     | The run identifier to rerun                  |
| **Callback URL** | Optional webhook URL for async notifications |


### Task resource

#### Run

Run a pre-configured saved task from the CoreClaw console. Task parameters are stored with the task itself, so no custom input is needed.


| Field            | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| **Task Slug**    | Saved task identifier from the CoreClaw Console → Tasks page |
| **Callback URL** | Optional webhook URL for async notifications                 |


### Account resource

#### Get Info

Get account info: balance, traffic usage, and plan expiry.

No parameters required.

---

## Example workflow

Here's a typical n8n workflow using CoreClaw:

1. **Trigger** — Schedule Trigger (e.g., every day at 9 AM) or Webhook
2. **CoreClaw: Scraper → Run** — Run a web scraper with target URLs
3. **Wait** — Wait 30 seconds for the run to progress
4. **CoreClaw: Run → Get** — Poll until status is `3` (Succeeded)
5. **IF** — Check if status equals `3`
  - **True** → Continue to get results
  - **False** → Loop back to Wait
6. **CoreClaw: Run → Get Results** — Retrieve the scraped data
7. **Downstream nodes** — Send to Google Sheets, Slack, database, etc.

---

## Using HTTP Request node (advanced)

For operations not covered by the CoreClaw node, use the **HTTP Request** node to call the CoreClaw REST API directly.

### Configuration


| Field             | Value                                            |
| ----------------- | ------------------------------------------------ |
| Method            | `POST` (most endpoints)                          |
| URL               | `https://openapi.coreclaw.com/api/v1/<endpoint>` |
| Authentication    | **Header Auth**                                  |
| Header Name       | `api-key`                                        |
| Header Value      | Your CoreClaw API key                            |
| Body Content Type | `JSON`                                           |


### Common endpoints


| Action                  | Method | Endpoint                           |
| ----------------------- | ------ | ---------------------------------- |
| Get Worker schema       | `GET`  | `/api/scraper?slug=<scraper_slug>` |
| Start a Worker          | `POST` | `/api/v1/scraper/run`              |
| Run a Task template     | `POST` | `/api/v1/task/run`                 |
| Check run status        | `POST` | `/api/v1/run/detail`               |
| Get results (paginated) | `POST` | `/api/v1/run/result/list`          |
| Export results (file)   | `POST` | `/api/v1/run/result/export`        |
| Abort a run             | `POST` | `/api/v1/scraper/abort`            |


Full API reference: [API Integration](/api/integration/).

---

## Tips

- **Store the API key as an n8n credential** — Never hardcode it in nodes.
- **Use expressions** — Pass data between nodes with `{{ $json.run_slug }}` instead of manual copy-paste.
- **Handle errors** — Check the `code` field in responses. Non-zero means an error occurred.
- **Rate limits** — If you receive `code: 4290`, add a Wait node before retrying.
- **Webhook callbacks** — Set `callback_url` when starting a Worker to receive notifications instead of polling.

---

## Troubleshooting

<details>
<summary><strong>Node not appearing after installation</strong></summary>

1. Refresh the n8n page.
2. Check **Settings → Community Nodes** — the node should be listed there.
3. If using n8n Cloud, ensure verified community nodes are enabled in the Cloud Admin Panel.
</details>

<details>
<summary><strong>Invalid API key error</strong></summary>

1. Verify the API key in the [CoreClaw Console](https://console.coreclaw.com/settings/integrations).
2. Ensure there are no extra spaces or line breaks in the credential.
3. Test the key with a curl command:

```bash
curl -X POST "https://openapi.coreclaw.com/api/v1/account/info" \
  -H "api-key: YOUR_API_KEY" \
  -H "content-type: application/json" \
  --data "{}"
```

A successful response contains `code: 0`.
</details>

<details>
<summary><strong>Worker-specific input fields</strong></summary>

Each Worker has different input parameters. To find the correct fields:

1. Open the Worker in the [CoreClaw Console](https://console.coreclaw.com/store).
2. Go to the **Input** tab.
3. Click the **API** button in the top-right corner.
4. Select **API clients** to view ready-to-use code snippets.

Or call the API:

```bash
curl "https://openapi.coreclaw.com/api/scraper?slug=YOUR_SCRAPER_SLUG"
```

The response contains `data.parameters.custom.properties` — each entry maps to an input field.
</details>
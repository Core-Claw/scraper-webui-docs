---

## title: n8n
description: Connect CoreClaw to n8n workflows using the CoreClaw community node
sidebar:
  order: 1

Use [n8n](https://n8n.io/) to build automated workflows that trigger CoreClaw Workers, poll run status, and route results to any service — no code required.

## How it works

The CoreClaw n8n integration provides a dedicated community node (`n8n-nodes-coreclaw`) with built-in actions for common operations:

- **Start a Worker** — Run any Worker from the CoreClaw Store
- **Check run status** — Poll execution progress
- **Get results** — Retrieve output data
- **Abort a run** — Cancel an in-progress execution

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

Search for CoreClaw node in n8n

1. Click **Install node** to add the CoreClaw node to your instance.

Install n8n-nodes-coreclaw package

After installation, you can find the CoreClaw node under **Community Nodes** in the nodes panel.

CoreClaw node in Community Nodes list

### Create credentials

Before using the CoreClaw node, you need to create a credential with your CoreClaw API key.

1. In n8n, go to **Credentials** → **Add Credential**.
2. Search for **CoreClaw API** and select it.

Create CoreClaw API credential

1. Enter a name for the credential (e.g., "CoreClaw Production").
2. In the **API Key** field, paste the API key you copied from the [CoreClaw Console](https://console.coreclaw.com/settings/integrations).

Enter API key and save credential

1. Click **Save** to store the credential.

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

The CoreClaw node provides several built-in actions for common operations.

### Start a Worker

Run any Worker from the CoreClaw Store.


| Field                | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| **Worker Slug**      | The unique identifier of the Worker (e.g., `01KNXSHE0Y7DZKF1N8B1EMFX35`) |
| **Version**          | The Worker version to run (leave empty for latest)                       |
| **Input Parameters** | Worker-specific input fields (varies by Worker)                          |
| **Proxy Region**     | Optional proxy region for the run                                        |
| **Callback URL**     | Optional webhook URL for async notifications                             |


Get the `scraper_slug` (Worker Slug) from the Worker page in the [CoreClaw Console](https://console.coreclaw.com/store) or from the API (`GET /api/scraper?slug=<scraper_slug>`).

### Check Run Status

Poll the status of a running or completed Worker execution.


| Field        | Description                                        |
| ------------ | -------------------------------------------------- |
| **Run Slug** | The run identifier returned when starting a Worker |


Status codes: `1` Ready, `2` Running, `3` Succeeded, `4` Failed, `5` Aborting.

### Get Results

Retrieve the output data from a completed run.


| Field          | Description                              |
| -------------- | ---------------------------------------- |
| **Run Slug**   | The run identifier                       |
| **Page Index** | Page number for pagination (default: 1)  |
| **Page Size**  | Number of results per page (default: 20) |


For large datasets, use the **Export Results** action to download a JSON or CSV file.

### Abort a Run

Cancel an in-progress Worker execution.


| Field        | Description                 |
| ------------ | --------------------------- |
| **Run Slug** | The run identifier to abort |


---

## Example workflow

Here's a typical n8n workflow using CoreClaw:

1. **Trigger** — Schedule Trigger (e.g., every day at 9 AM) or Webhook
2. **CoreClaw: Start a Worker** — Run a web scraper with target URLs
3. **Wait** — Wait 30 seconds for the run to progress
4. **CoreClaw: Check Run Status** — Poll until status is `3` (Succeeded)
5. **IF** — Check if status equals `3`
  - **True** → Continue to get results
  - **False** → Loop back to Wait
6. **CoreClaw: Get Results** — Retrieve the scraped data
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

**Node not appearing after installation**

1. Refresh the n8n page.
2. Check **Settings → Community Nodes** — the node should be listed there.
3. If using n8n Cloud, ensure verified community nodes are enabled in the Cloud Admin Panel.

**Invalid API key error**

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

**Worker-specific input fields**

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
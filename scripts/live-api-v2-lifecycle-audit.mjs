import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const API_BASE_URL = process.env.CORECLAW_API_BASE_URL || 'https://openapi.coreclaw.com'
const API_KEY = process.env.CORECLAW_API_KEY
const WRITE_ENABLED = process.env.CORECLAW_LIVE_WRITE === '1'
const WORKER_ID = process.env.CORECLAW_LIVE_WORKER_ID || 'coreclaw~google-maps-scraper'
const SAFE_RUN_BODY = {
    input: {
        parameters: {
            custom: {
                keywords: ['coffee'],
                base_location: 'New York,USA',
                max_results: 1,
            },
        },
    },
    is_async: true,
    offset: 0,
    limit: 20,
}
const TERMINAL_OR_CANCELLATION_STATUSES = new Set(['succeeded', 'failed', 'aborting'])

if (!API_KEY) {
    console.error('Set CORECLAW_API_KEY to run the live lifecycle audit.')
    process.exit(1)
}

const spec = JSON.parse(await readFile(path.join(root, 'public', 'openapi.json'), 'utf8'))
const statusValues = (
    spec.paths?.['/api/v2/worker-runs']?.get?.parameters ?? []
).find(parameter => parameter.in === 'query' && parameter.name === 'status')?.schema?.enum ?? []

if (!Array.isArray(statusValues) || statusValues.length === 0) {
    throw new Error('The public OpenAPI document does not define GET /api/v2/worker-runs status values.')
}

function redact(value) {
    if (typeof value !== 'string' || value.length <= 8) return value
    return `${value.slice(0, 4)}…${value.slice(-4)}`
}

function summarizeRun(run) {
    if (!run || typeof run !== 'object') return null
    return {
        slug: redact(run.slug),
        status: run.status,
        results: run.results,
        has_err_msg: Boolean(run.err_msg),
        err_msg: run.err_msg || undefined,
        has_started_at: Number.isFinite(run.started_at) && run.started_at > 0,
        has_finished_at: Number.isFinite(run.finished_at) && run.finished_at > 0,
        duration: run.duration,
        origin: run.origin,
        has_usage: run.usage !== undefined,
        has_traffic: run.traffic !== undefined,
    }
}

async function request(method, apiPath, { query, body } = {}) {
    const url = new URL(API_BASE_URL.replace(/\/$/, '') + apiPath)
    for (const [key, value] of Object.entries(query ?? {})) {
        if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
    }

    const response = await fetch(url, {
        method,
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    })
    const text = await response.text()
    let payload = null
    try {
        payload = text ? JSON.parse(text) : null
    } catch {
        throw new Error(`${method} ${apiPath} returned non-JSON HTTP ${response.status}`)
    }
    if (!response.ok || payload?.code !== 0) {
        throw new Error(JSON.stringify({
            method,
            path: apiPath,
            http_status: response.status,
            code: payload?.code,
            message: payload?.message,
            request_id: payload?.request_id,
        }))
    }
    return payload
}

async function readStatusSamples() {
    const observations = []
    for (const status of statusValues) {
        const response = await request('GET', '/api/v2/worker-runs', {
            query: { status, offset: 0, limit: 5 },
        })
        const list = response.data?.list ?? []
        const representative = list.find(item => item?.slug)
        let detail = null
        let logSummary = null
        if (representative?.slug) {
            const detailResponse = await request('GET', `/api/v2/worker-runs/${encodeURIComponent(representative.slug)}`)
            detail = detailResponse.data
            if (status === 'failed' || status === 'aborting') {
                const logResponse = await request('GET', `/api/v2/worker-runs/${encodeURIComponent(representative.slug)}/log`)
                logSummary = {
                    result_count: logResponse.data?.result_count,
                    log_entries: Array.isArray(logResponse.data?.list) ? logResponse.data.list.length : 0,
                    has_all_logs_url: Boolean(logResponse.data?.all_logs_url),
                }
            }
        }
        observations.push({
            status,
            count: response.data?.count ?? 0,
            page_index: response.data?.page_index,
            page_size: response.data?.page_size,
            representative: summarizeRun(detail ?? representative),
            log_summary: logSummary,
        })
    }
    return observations
}

async function waitForCancellation(runId, timeoutMs = 90_000) {
    const deadline = Date.now() + timeoutMs
    let delayMs = 2_000
    const seenStatuses = []
    while (Date.now() < deadline) {
        const detail = await request('GET', `/api/v2/worker-runs/${encodeURIComponent(runId)}`)
        const status = detail.data?.status
        if (status && seenStatuses.at(-1) !== status) seenStatuses.push(status)
        if (TERMINAL_OR_CANCELLATION_STATUSES.has(status)) {
            return { status, seen_statuses: seenStatuses, detail: summarizeRun(detail.data) }
        }
        await new Promise(resolve => setTimeout(resolve, delayMs))
        delayMs = Math.min(delayMs * 2, 15_000)
    }
    return { status: null, seen_statuses: seenStatuses, detail: null, timed_out: true }
}

const observations = await readStatusSamples()
const report = {
    audited_at: new Date().toISOString(),
    base_url: API_BASE_URL,
    mode: WRITE_ENABLED ? 'write-exercise' : 'read-only',
    contract_status_values: statusValues,
    status_observations: observations,
}

if (WRITE_ENABLED) {
    const schema = await request('GET', `/api/v2/workers/${encodeURIComponent(WORKER_ID)}/input-schema`)
    if (!schema.data) throw new Error('The selected Worker did not return an input schema.')

    const created = await request('POST', `/api/v2/workers/${encodeURIComponent(WORKER_ID)}/runs`, {
        body: SAFE_RUN_BODY,
    })
    const runId = created.data?.run_slug
    if (!runId) throw new Error('The disposable run did not return data.run_slug.')

    const initialDetail = await request('GET', `/api/v2/worker-runs/${encodeURIComponent(runId)}`)
    const abortResponse = await request('POST', `/api/v2/worker-runs/${encodeURIComponent(runId)}/abort`, { body: {} })
    const cancellation = await waitForCancellation(runId)
    report.write_exercise = {
        worker_id: WORKER_ID,
        created_run: redact(runId),
        initial_status: initialDetail.data?.status,
        abort_request_id: abortResponse.request_id,
        cancellation,
    }
}

console.log(JSON.stringify(report, null, 2))

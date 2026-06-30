import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const API_BASE_URL = process.env.CORECLAW_API_BASE_URL || 'https://openapi.coreclaw.com'
const API_KEY = process.env.CORECLAW_API_KEY
const WORKER_ID = process.env.CORECLAW_LIVE_WORKER_ID || 'coreclaw~google-maps-scraper'
const OLD_WORKER_ID = process.env.CORECLAW_OLD_WORKER_ID || 'coreclaw~google-maps-scraper-tool'
const OLD_TASK_ID = process.env.CORECLAW_OLD_TASK_ID || '01KSFDXRNYGKT3NNE11EMR4W5X'
const OLD_NUMERIC_WORKER_ID = process.env.CORECLAW_OLD_NUMERIC_WORKER_ID || '32707111693320193'

if (!API_KEY) {
    console.error('Set CORECLAW_API_KEY to run live API v2 playground audit.')
    process.exit(1)
}

const internalOperations = new Set([
    'GET /api/v2/workers/{workerId}/internal',
    'POST /api/v2/workers/{workerId}/versions',
    'PUT /api/v2/workers/{workerId}/versions/{version}',
])

const safeDirectRunBody = {
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
    limit: 20,
    offset: 0,
}

const checks = []
const probes = []
const setupRuns = []
const terminalStatuses = new Set(['succeeded', 'success', 'finished', 'completed', 'failed', 'aborted', 'aborting'])

const spec = JSON.parse(await readFile(path.join(root, 'public', 'openapi.json'), 'utf8'))
const publicOperations = collectOperations(spec).filter(op => !internalOperations.has(op.key))

function collectOperations(openapi) {
    const methods = new Set(['get', 'post', 'put', 'patch', 'delete'])
    const out = []
    for (const [apiPath, item] of Object.entries(openapi.paths ?? {})) {
        for (const [method] of Object.entries(item ?? {})) {
            if (!methods.has(method)) continue
            out.push({ method: method.toUpperCase(), path: apiPath, key: `${method.toUpperCase()} ${apiPath}` })
        }
    }
    return out.sort((a, b) => a.key.localeCompare(b.key))
}

function authHeaders(auth) {
    if (auth === 'none') return {}
    if (auth === 'api-key') return { 'api-key': API_KEY }
    return { Authorization: `Bearer ${API_KEY}` }
}

function addQuery(url, query) {
    for (const [key, value] of Object.entries(query ?? {})) {
        if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
    }
}

async function request({
    operationKey,
    label,
    method,
    path: apiPath,
    query,
    body,
    auth = 'bearer',
    expectedCodes = [0],
    expectedStatuses = [200],
    record = true,
    probe = false,
}) {
    const url = new URL(API_BASE_URL.replace(/\/$/, '') + apiPath)
    addQuery(url, query)
    if (auth === 'query-token') url.searchParams.set('token', API_KEY)

    const headers = authHeaders(auth)
    if (body !== undefined) headers['Content-Type'] = 'application/json'

    const started = performance.now()
    let response
    let text = ''
    let error
    try {
        response = await fetch(url, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        })
        text = await response.text()
    } catch (err) {
        error = err instanceof Error ? err.message : String(err)
    }

    let json = null
    if (text) {
        try {
            json = JSON.parse(text)
        } catch {
            json = null
        }
    }

    const code = json?.code
    const status = response?.status ?? 0
    const ok =
        !error &&
        expectedStatuses.includes(status) &&
        (code === undefined || expectedCodes.includes(code))
    const entry = {
        operationKey,
        label,
        method,
        path: apiPath,
        status,
        code,
        ok,
        ms: Math.round(performance.now() - started),
        request_id: json?.request_id,
        data_summary: summarizeData(json?.data),
        error,
        message: json?.message,
    }
    if (probe) probes.push(entry)
    else if (record) checks.push(entry)
    return { entry, json, text, response }
}

function summarizeData(data) {
    if (data === undefined || data === null) return undefined
    if (Array.isArray(data)) return { type: 'array', length: data.length }
    if (typeof data !== 'object') return { type: typeof data, value: String(data).slice(0, 80) }
    const summary = { type: 'object', keys: Object.keys(data).slice(0, 10) }
    if (data.run_slug) summary.run_slug = data.run_slug
    if (data.slug) summary.slug = data.slug
    if (data.status) summary.status = data.status
    if (typeof data.count === 'number') summary.count = data.count
    if (Array.isArray(data.list)) summary.list_length = data.list.length
    if (Array.isArray(data.scraper)) summary.scraper_length = data.scraper.length
    return summary
}

function workerPath(pathSuffix = '') {
    return `/api/v2/workers/${encodeURIComponent(WORKER_ID)}${pathSuffix}`
}

function runPath(runId, pathSuffix = '') {
    return `/api/v2/worker-runs/${encodeURIComponent(runId)}${pathSuffix}`
}

async function createDirectRun(label, { recordOperation = false } = {}) {
    const { json } = await request({
        operationKey: recordOperation ? 'POST /api/v2/workers/{workerId}/runs' : undefined,
        label,
        method: 'POST',
        path: workerPath('/runs'),
        body: safeDirectRunBody,
        record: recordOperation,
    })
    const runId = json?.data?.run_slug
    if (!runId) throw new Error(`${label} did not return data.run_slug`)
    setupRuns.push(runId)
    return runId
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForRunWithResults(runId, { timeoutMs = 90000, intervalMs = 3000 } = {}) {
    const deadline = Date.now() + timeoutMs
    let lastDetail = null
    while (Date.now() < deadline) {
        const detail = await request({
            label: `Poll run ${runId}`,
            method: 'GET',
            path: runPath(runId),
            record: false,
        })
        lastDetail = detail.json?.data
        if ((lastDetail?.results ?? 0) > 0 && String(lastDetail?.status).toLowerCase() === 'succeeded') {
            return runId
        }
        if (terminalStatuses.has(String(lastDetail?.status).toLowerCase())) break
        await sleep(intervalMs)
    }
    const fallback = await findCompletedRunWithResults()
    if (fallback) return fallback
    throw new Error(`Run ${runId} did not produce exportable results. Last detail: ${JSON.stringify(lastDetail)}`)
}

async function findCompletedRunWithResults() {
    const runs = await request({
        label: 'Find completed run with results',
        method: 'GET',
        path: '/api/v2/worker-runs',
        query: { worker_id: WORKER_ID, offset: 0, limit: 20 },
        record: false,
    })
    const list = runs.json?.data?.list ?? []
    const candidate = list.find(item =>
        item?.slug &&
        (item.results ?? 0) > 0 &&
        String(item.status).toLowerCase() === 'succeeded'
    )
    return candidate?.slug ?? null
}

async function abortRunIfPossible(runId, label) {
    await request({
        label,
        method: 'POST',
        path: runPath(runId, '/abort'),
        body: {},
        record: false,
        expectedCodes: [0, 70002],
        expectedStatuses: [200, 400],
    })
}

await request({
    operationKey: 'GET /api/v2/proxy/region',
    label: 'List proxy regions',
    method: 'GET',
    path: '/api/v2/proxy/region',
    query: { language: 'en' },
    auth: 'none',
})
await request({
    operationKey: 'GET /api/v2/store',
    label: 'List store workers',
    method: 'GET',
    path: '/api/v2/store',
    query: { keyword: 'google maps', offset: 0, limit: 5 },
    auth: 'none',
})
await request({
    operationKey: 'GET /api/v2/users/account',
    label: 'Get user account',
    method: 'GET',
    path: '/api/v2/users/account',
})
await request({
    operationKey: 'GET /api/v2/workers',
    label: 'List workers',
    method: 'GET',
    path: '/api/v2/workers',
    query: { keyword: 'google', offset: 0, limit: 5 },
})
await request({
    operationKey: 'GET /api/v2/workers/{workerId}',
    label: 'Get worker detail',
    method: 'GET',
    path: workerPath(),
})
await request({
    operationKey: 'GET /api/v2/workers/{workerId}/input-schema',
    label: 'Get worker input schema',
    method: 'GET',
    path: workerPath('/input-schema'),
})

const directRunId = await createDirectRun('Run worker with safe playground body', { recordOperation: true })
const exportableRunId = await waitForRunWithResults(directRunId)

await request({
    operationKey: 'GET /api/v2/worker-runs',
    label: 'List worker runs',
    method: 'GET',
    path: '/api/v2/worker-runs',
    query: { offset: 0, limit: 5 },
})
await request({
    operationKey: 'GET /api/v2/worker-runs/{runId}',
    label: 'Get worker run detail',
    method: 'GET',
    path: runPath(exportableRunId),
})
await request({
    operationKey: 'GET /api/v2/worker-runs/{runId}/log',
    label: 'Get worker run log',
    method: 'GET',
    path: runPath(exportableRunId, '/log'),
})
await request({
    operationKey: 'GET /api/v2/worker-runs/{runId}/result',
    label: 'List worker run results',
    method: 'GET',
    path: runPath(exportableRunId, '/result'),
    query: { offset: 0, limit: 5 },
})
await request({
    operationKey: 'GET /api/v2/worker-runs/{runId}/result/export',
    label: 'Export worker run results',
    method: 'GET',
    path: runPath(exportableRunId, '/result/export'),
    query: { format: 'csv', filter_keys: 'title,address' },
})
await request({
    operationKey: 'GET /api/v2/worker-runs/last',
    label: 'Get account latest run',
    method: 'GET',
    path: '/api/v2/worker-runs/last',
})
await request({
    operationKey: 'GET /api/v2/worker-runs/last/log',
    label: 'Get account latest run log',
    method: 'GET',
    path: '/api/v2/worker-runs/last/log',
})
await request({
    operationKey: 'GET /api/v2/worker-runs/last/result',
    label: 'List account latest run results',
    method: 'GET',
    path: '/api/v2/worker-runs/last/result',
    query: { offset: 0, limit: 5 },
})
await request({
    operationKey: 'GET /api/v2/worker-runs/last/export',
    label: 'Export account latest run results',
    method: 'GET',
    path: '/api/v2/worker-runs/last/export',
    query: { format: 'csv', filter_keys: 'title,address' },
})
await request({
    operationKey: 'GET /api/v2/workers/{workerId}/runs/last',
    label: 'Get worker latest run',
    method: 'GET',
    path: workerPath('/runs/last'),
})
await request({
    operationKey: 'GET /api/v2/workers/{workerId}/runs/last/log',
    label: 'Get worker latest run log',
    method: 'GET',
    path: workerPath('/runs/last/log'),
})
await request({
    operationKey: 'GET /api/v2/workers/{workerId}/runs/last/result',
    label: 'List worker latest run results',
    method: 'GET',
    path: workerPath('/runs/last/result'),
    query: { offset: 0, limit: 5 },
})
await request({
    operationKey: 'GET /api/v2/workers/{workerId}/runs/last/export',
    label: 'Export worker latest run results',
    method: 'GET',
    path: workerPath('/runs/last/export'),
    query: { format: 'csv', filter_keys: 'title,address' },
})

const workerTasks = await request({
    operationKey: 'GET /api/v2/worker-tasks',
    label: 'List worker tasks',
    method: 'GET',
    path: '/api/v2/worker-tasks',
    query: { worker_id: WORKER_ID, offset: 0, limit: 10 },
})
const task = workerTasks.json?.data?.list?.find(item => item?.slug)
if (!task?.slug) throw new Error(`No saved worker task is available for ${WORKER_ID}`)

const taskRun = await request({
    operationKey: 'POST /api/v2/worker-tasks/{workerTaskId}/runs',
    label: 'Run saved worker task',
    method: 'POST',
    path: `/api/v2/worker-tasks/${encodeURIComponent(task.slug)}/runs`,
    body: { is_async: true, limit: 20, offset: 0 },
})
const taskRunId = taskRun.json?.data?.run_slug
if (taskRunId) setupRuns.push(taskRunId)

const runRerun = await request({
    operationKey: 'POST /api/v2/worker-runs/{runId}/rerun',
    label: 'Rerun specific worker run',
    method: 'POST',
    path: runPath(directRunId, '/rerun'),
    body: { is_async: true, limit: 20, offset: 0 },
})
const runRerunId = runRerun.json?.data?.run_slug
if (runRerunId) setupRuns.push(runRerunId)

const accountRerun = await request({
    operationKey: 'POST /api/v2/worker-runs/last/rerun',
    label: 'Rerun account latest run',
    method: 'POST',
    path: '/api/v2/worker-runs/last/rerun',
    body: { is_async: true, limit: 20, offset: 0 },
})
const accountRerunId = accountRerun.json?.data?.run_slug
if (accountRerunId) setupRuns.push(accountRerunId)

const workerLastRerun = await request({
    operationKey: 'POST /api/v2/workers/{workerId}/runs/last/rerun',
    label: 'Rerun worker latest run',
    method: 'POST',
    path: workerPath('/runs/last/rerun'),
    body: { is_async: true, limit: 20, offset: 0 },
})
const workerLastRerunId = workerLastRerun.json?.data?.run_slug
if (workerLastRerunId) setupRuns.push(workerLastRerunId)

const explicitAbortRunId = await createDirectRun('Setup run for specific abort')
await request({
    operationKey: 'POST /api/v2/worker-runs/{runId}/abort',
    label: 'Abort specific worker run',
    method: 'POST',
    path: runPath(explicitAbortRunId, '/abort'),
    body: {},
})

await createDirectRun('Setup run for account latest abort')
await request({
    operationKey: 'POST /api/v2/worker-runs/last/abort',
    label: 'Abort account latest run',
    method: 'POST',
    path: '/api/v2/worker-runs/last/abort',
    body: {},
})

await createDirectRun('Setup run for worker latest abort')
await request({
    operationKey: 'POST /api/v2/workers/{workerId}/runs/last/abort',
    label: 'Abort worker latest run',
    method: 'POST',
    path: workerPath('/runs/last/abort'),
    body: {},
})

for (const runId of setupRuns) {
    await abortRunIfPossible(runId, `Cleanup abort ${runId}`)
}

await request({
    label: 'Probe direct run with explicit version latest',
    method: 'POST',
    path: workerPath('/runs'),
    body: { ...safeDirectRunBody, version: 'latest' },
    expectedCodes: [50003],
    expectedStatuses: [400],
    record: false,
    probe: true,
})
await request({
    label: 'Probe direct run with flat input keyword',
    method: 'POST',
    path: workerPath('/runs'),
    body: { input: { keyword: 'coffee', limit: 10 }, is_async: true, limit: 20, offset: 0 },
    expectedCodes: [50002, 11000],
    expectedStatuses: [400],
    record: false,
    probe: true,
})
await request({
    label: 'Probe slashed worker path without playground normalization',
    method: 'GET',
    path: '/api/v2/workers/coreclaw%2Fgoogle-maps-scraper',
    expectedCodes: [11004, 50001],
    expectedStatuses: [404, 400],
    record: false,
    probe: true,
})
await request({
    label: 'Probe old delisted worker path',
    method: 'GET',
    path: `/api/v2/workers/${encodeURIComponent(OLD_WORKER_ID)}`,
    expectedCodes: [0, 50001, 11004],
    expectedStatuses: [200, 400, 404],
    record: false,
    probe: true,
})
await request({
    label: 'Probe old delisted saved task',
    method: 'POST',
    path: `/api/v2/worker-tasks/${encodeURIComponent(OLD_TASK_ID)}/runs`,
    body: { is_async: true, limit: 20, offset: 0 },
    expectedCodes: [60001, 11004],
    expectedStatuses: [400, 404],
    record: false,
    probe: true,
})
await request({
    label: 'Probe numeric task.worker_id as public workerId',
    method: 'GET',
    path: `/api/v2/workers/${encodeURIComponent(OLD_NUMERIC_WORKER_ID)}`,
    expectedCodes: [50001, 11004],
    expectedStatuses: [400, 404],
    record: false,
    probe: true,
})

const checkedOperationKeys = new Set(checks.map(check => check.operationKey).filter(Boolean))
const missingOperations = publicOperations
    .map(op => op.key)
    .filter(key => !checkedOperationKeys.has(key))
const failedChecks = checks.filter(check => !check.ok)
const failedProbes = probes.filter(probe => !probe.ok)

const result = {
    audited_at: new Date().toISOString(),
    base_url: API_BASE_URL,
    worker_id: WORKER_ID,
    task: task ? {
        slug: task.slug,
        worker_slug: task.worker_slug,
        worker_path: task.worker_path,
        numeric_worker_id: task.worker_id,
        version: task.version,
    } : null,
    public_operations_total: publicOperations.length,
    public_operations_checked: checkedOperationKeys.size,
    missing_operations: missingOperations,
    checks_passed: checks.length - failedChecks.length,
    checks_failed: failedChecks.length,
    probes_passed: probes.length - failedProbes.length,
    probes_failed: failedProbes.length,
    checks,
    probes,
}

console.log(JSON.stringify(result, null, 2))

if (missingOperations.length || failedChecks.length || failedProbes.length) {
    process.exit(1)
}

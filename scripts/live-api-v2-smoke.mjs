const API_BASE_URL = process.env.CORECLAW_API_BASE_URL || 'https://openapi.coreclaw.com'
const API_KEY = process.env.CORECLAW_API_KEY

if (!API_KEY) {
    console.error('Set CORECLAW_API_KEY to run live API v2 smoke checks.')
    process.exit(1)
}

const workerId = process.env.CORECLAW_WORKER_ID || '01KRACN8NRFVKHYD3XJ8KK6K4C'
const workerPath = process.env.CORECLAW_WORKER_PATH || 'dong-xian-nan~gu-ge-di-tu'

const checks = []

function authHeaders(mode) {
    if (mode === 'bearer') return { Authorization: `Bearer ${API_KEY}` }
    if (mode === 'api-key') return { 'api-key': API_KEY }
    return {}
}

async function request(name, method, path, { auth = 'bearer', query = {}, body } = {}) {
    const url = new URL(API_BASE_URL + path)
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
    }
    if (auth === 'query-token') url.searchParams.set('token', API_KEY)

    const headers = authHeaders(auth)
    if (body !== undefined) headers['Content-Type'] = 'application/json'

    const started = performance.now()
    let response
    let text = ''
    try {
        response = await fetch(url, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        })
        text = await response.text()
    } catch (error) {
        checks.push({ name, method, path, auth, ok: false, error: String(error) })
        return null
    }

    let json = null
    try {
        json = text ? JSON.parse(text) : null
    } catch {
        json = null
    }
    const ok = response.ok && (!json || json.code === 0)
    checks.push({
        name,
        method,
        path,
        auth,
        status: response.status,
        code: json?.code,
        ok,
        ms: Math.round(performance.now() - started),
        dataKeys: json?.data && typeof json.data === 'object' ? Object.keys(json.data).slice(0, 8) : [],
        requestId: json?.request_id,
    })
    return json
}

await request('public proxy regions', 'GET', '/api/v2/proxy/region', {
    auth: 'none',
    query: { language: 'en' },
})
await request('public store search', 'GET', '/api/v2/store', {
    auth: 'none',
    query: { keyword: 'google', offset: 0, limit: 5 },
})

await request('account bearer auth', 'GET', '/api/v2/users/account', { auth: 'bearer' })
await request('account api-key auth', 'GET', '/api/v2/users/account', { auth: 'api-key' })
await request('account query token auth', 'GET', '/api/v2/users/account', { auth: 'query-token' })

await request('list workers', 'GET', '/api/v2/workers', {
    query: { offset: 0, limit: 5 },
})
await request('get worker by slug', 'GET', `/api/v2/workers/${workerId}`)
await request('get worker by path', 'GET', `/api/v2/workers/${workerPath}`)
await request('get worker input schema', 'GET', `/api/v2/workers/${workerId}/input-schema`, { auth: 'none' })
await request('get worker internal detail', 'GET', `/api/v2/workers/${workerId}/internal`, { auth: 'none' })
await request('list worker tasks', 'GET', '/api/v2/worker-tasks', {
    query: { offset: 0, limit: 5, worker_id: workerId },
})
await request('list worker runs', 'GET', '/api/v2/worker-runs', {
    query: { offset: 0, limit: 5 },
})

const runs = await request('list worker runs for run id', 'GET', '/api/v2/worker-runs', {
    query: { offset: 0, limit: 5, worker_id: workerId },
})
const runId = runs?.data?.list?.find(item => item?.slug)?.slug

if (runId) {
    await request('get worker run detail', 'GET', `/api/v2/worker-runs/${runId}`)
    await request('get worker run log', 'GET', `/api/v2/worker-runs/${runId}/log`)
    await request('list worker run results', 'GET', `/api/v2/worker-runs/${runId}/result`, {
        query: { offset: 0, limit: 5 },
    })
    await request('export worker run results', 'GET', `/api/v2/worker-runs/${runId}/result/export`, {
        query: { format: 'csv', filter_keys: 'title,address' },
    })
}

await request('get account latest run', 'GET', '/api/v2/worker-runs/last')
await request('get account latest run log', 'GET', '/api/v2/worker-runs/last/log')
await request('list account latest run results', 'GET', '/api/v2/worker-runs/last/result', {
    query: { offset: 0, limit: 5 },
})
await request('export account latest run results', 'GET', '/api/v2/worker-runs/last/export', {
    query: { format: 'csv', filter_keys: 'title,address' },
})

await request('get worker latest run', 'GET', `/api/v2/workers/${workerId}/runs/last`)
await request('get worker latest run log', 'GET', `/api/v2/workers/${workerId}/runs/last/log`)
await request('list worker latest run results', 'GET', `/api/v2/workers/${workerId}/runs/last/result`, {
    query: { offset: 0, limit: 5 },
})
await request('export worker latest run results', 'GET', `/api/v2/workers/${workerId}/runs/last/export`, {
    query: { format: 'csv', filter_keys: 'title,address' },
})

const failed = checks.filter(check => !check.ok)
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length, runId, checks }, null, 2))

if (failed.length) process.exit(1)

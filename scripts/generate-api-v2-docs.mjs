import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourceSpecPath = process.argv[2]
const API_BASE_URL = 'https://openapi.coreclaw.com'
const publicHttpStatusOrder = ['200', '400', '401', '404', '422', '429', '500']
const sampleDirectWorkerCustomInput = {
    keywords: ['coffee'],
    base_location: 'New York,USA',
    max_results: 1,
}

if (!sourceSpecPath) {
    console.error('Usage: node scripts/generate-api-v2-docs.mjs <openapi.json>')
    process.exit(1)
}

const internalOperations = new Set([
    'GET /api/v2/workers/{workerId}/internal',
    'POST /api/v2/workers/{workerId}/versions',
    'PUT /api/v2/workers/{workerId}/versions/{version}',
])

const pageMeta = {
    'GET /api/v2/proxy/region': ['proxy/region', 10, 'List Proxy Regions', '查询代理区域'],
    'GET /api/v2/store': ['store/list', 20, 'List Store Workers', '查询商店 Worker'],
    'GET /api/v2/users/account': ['account/get', 30, 'Get User Account', '获取账户信息'],
    'GET /api/v2/workers': ['workers/list', 40, 'List Workers', '查询我的 Worker'],
    'GET /api/v2/workers/{workerId}': ['workers/detail', 41, 'Get Worker Detail', '获取 Worker 详情'],
    'GET /api/v2/workers/{workerId}/input-schema': ['workers/input-schema', 42, 'Get Worker Input Schema', '获取 Worker 输入 Schema'],
    'POST /api/v2/workers/{workerId}/runs': ['workers/run', 44, 'Run Worker', '运行 Worker'],
    'GET /api/v2/worker-tasks': ['worker-tasks/list', 50, 'List Worker Tasks', '查询 Worker 任务'],
    'POST /api/v2/worker-tasks': ['worker-tasks/create', 52, 'Create Worker Task', '创建 Worker 任务'],
    'GET /api/v2/worker-tasks/{workerTaskId}': ['worker-tasks/get', 53, 'Get Worker Task', '获取 Worker 任务'],
    'PUT /api/v2/worker-tasks/{workerTaskId}': ['worker-tasks/update', 54, 'Update Worker Task', '更新 Worker 任务'],
    'DELETE /api/v2/worker-tasks/{workerTaskId}': ['worker-tasks/delete', 55, 'Delete Worker Task', '删除 Worker 任务'],
    'GET /api/v2/worker-tasks/{workerTaskId}/input': ['worker-tasks/get-input', 56, 'Get Worker Task Input', '获取 Worker 任务输入'],
    'PUT /api/v2/worker-tasks/{workerTaskId}/input': ['worker-tasks/update-input', 57, 'Update Worker Task Input', '更新 Worker 任务输入'],
    'POST /api/v2/worker-tasks/{workerTaskId}/runs': ['worker-tasks/run', 51, 'Run Worker Task', '运行 Worker 任务'],
    'GET /api/v2/worker-runs': ['worker-runs/list', 60, 'List Worker Runs', '查询 Worker 运行记录'],
    'GET /api/v2/worker-runs/last': ['worker-runs/last-detail', 61, 'Get Last Worker Run', '获取最近一次运行'],
    'POST /api/v2/worker-runs/last/abort': ['worker-runs/last-abort', 62, 'Abort Last Worker Run', '中止最近一次运行'],
    'GET /api/v2/worker-runs/last/export': ['worker-runs/last-export', 63, 'Export Last Worker Run Results', '导出最近一次运行结果'],
    'GET /api/v2/worker-runs/last/log': ['worker-runs/last-log', 64, 'Get Last Worker Run Log', '获取最近一次运行日志'],
    'POST /api/v2/worker-runs/last/rerun': ['worker-runs/last-rerun', 65, 'Rerun Last Worker Run', '重跑最近一次运行'],
    'GET /api/v2/worker-runs/last/result': ['worker-runs/last-result', 66, 'List Last Worker Run Results', '查询最近一次运行结果'],
    'GET /api/v2/worker-runs/{runId}': ['worker-runs/detail', 70, 'Get Worker Run Detail', '获取运行详情'],
    'POST /api/v2/worker-runs/{runId}/abort': ['worker-runs/abort', 71, 'Abort Worker Run', '中止运行'],
    'GET /api/v2/worker-runs/{runId}/log': ['worker-runs/log', 72, 'Get Worker Run Log', '获取运行日志'],
    'POST /api/v2/worker-runs/{runId}/rerun': ['worker-runs/rerun', 73, 'Rerun Worker Run', '重跑运行'],
    'GET /api/v2/worker-runs/{runId}/result': ['worker-runs/result', 74, 'List Worker Run Results', '查询运行结果'],
    'GET /api/v2/worker-runs/{runId}/result/export': ['worker-runs/export', 75, 'Export Worker Run Results', '导出运行结果'],
    'GET /api/v2/workers/{workerId}/runs/last': ['worker-runs/worker-last-detail', 80, 'Get Worker Last Run', '获取某 Worker 最近一次运行'],
    'POST /api/v2/workers/{workerId}/runs/last/abort': ['worker-runs/worker-last-abort', 81, 'Abort Worker Last Run', '中止某 Worker 最近一次运行'],
    'GET /api/v2/workers/{workerId}/runs/last/export': ['worker-runs/worker-last-export', 82, 'Export Worker Last Run Results', '导出某 Worker 最近一次运行结果'],
    'GET /api/v2/workers/{workerId}/runs/last/log': ['worker-runs/worker-last-log', 83, 'Get Worker Last Run Log', '获取某 Worker 最近一次运行日志'],
    'POST /api/v2/workers/{workerId}/runs/last/rerun': ['worker-runs/worker-last-rerun', 84, 'Rerun Worker Last Run', '重跑某 Worker 最近一次运行'],
    'GET /api/v2/workers/{workerId}/runs/last/result': ['worker-runs/worker-last-result', 85, 'List Worker Last Run Results', '查询某 Worker 最近一次运行结果'],
}

const sourceSpec = JSON.parse(await readFile(sourceSpecPath, 'utf8'))
const spec = structuredClone(sourceSpec)

spec.info = {
    ...spec.info,
    title: 'CoreClaw API',
    version: '2.0.0',
    description: sourceSpec.info?.description?.trim() || 'CoreClaw public API v2 contract.',
}
spec.servers = [{ url: API_BASE_URL }]
spec.components ??= {}
spec.components.securitySchemes ??= {}
spec.components.securitySchemes.BearerAuth ??= {
    type: 'http',
    scheme: 'bearer',
    description: 'API token passed as Authorization: Bearer <token>.',
}
spec.components.securitySchemes.QueryTokenAuth ??= {
    type: 'apiKey',
    in: 'query',
    name: 'token',
    description: 'API token passed as a query parameter.',
}
spec.components.securitySchemes.ApiKeyAuth = {
    type: 'apiKey',
    in: 'header',
    name: 'api-key',
    description: 'Backward-compatible API key header supported by CoreClaw API v2.',
}
if (!Array.isArray(spec.security) || spec.security.length === 0) {
    spec.security = [{ BearerAuth: [] }, { QueryTokenAuth: [] }, { ApiKeyAuth: [] }]
} else if (!spec.security.some(entry => entry.ApiKeyAuth)) {
    spec.security.push({ ApiKeyAuth: [] })
}

for (const [apiPath, item] of Object.entries(spec.paths ?? {})) {
    for (const method of Object.keys(item)) {
        const key = `${method.toUpperCase()} ${apiPath}`
        if (internalOperations.has(key)) {
            delete item[method]
            continue
        }
        if (Array.isArray(item[method]?.security) && item[method].security.length > 0) {
            const hasApiKey = item[method].security.some(entry => entry.ApiKeyAuth)
            if (!hasApiKey) item[method].security.push({ ApiKeyAuth: [] })
        }
    }
    if (Object.keys(item).length === 0) delete spec.paths[apiPath]
}
sanitizePublicSpecExamples(spec)

const operations = collectOperations(spec)
const errorCodes = spec['x-error-codes'] ?? []
const runStatusValues = (
    spec.paths?.['/api/v2/worker-runs']?.get?.parameters ?? []
).find(parameter => parameter.in === 'query' && parameter.name === 'status')?.schema?.enum ?? []

if (!Array.isArray(runStatusValues) || runStatusValues.length === 0) {
    throw new Error('GET /api/v2/worker-runs must define the status enum.')
}

if (!Array.isArray(errorCodes) || errorCodes.length === 0) {
    throw new Error('Missing x-error-codes in source OpenAPI document.')
}

await writeJson(path.join(root, 'public', 'openapi.json'), spec)
await resetApiDir('api')
await resetApiDir(path.join('zh-cn', 'api'))
await writeFileEnsured(path.join(root, 'src/content/docs/api/index.md'), indexPage('en'))
await writeFileEnsured(path.join(root, 'src/content/docs/zh-cn/api/index.md'), indexPage('zh'))
await writeFileEnsured(path.join(root, 'src/content/docs/api/integration.md'), integrationPage('en'))
await writeFileEnsured(path.join(root, 'src/content/docs/zh-cn/api/integration.md'), integrationPage('zh'))
await writeFileEnsured(path.join(root, 'src/content/docs/api/run-lifecycle.md'), runLifecyclePage('en'))
await writeFileEnsured(path.join(root, 'src/content/docs/zh-cn/api/run-lifecycle.md'), runLifecyclePage('zh'))
await writeFileEnsured(path.join(root, 'src/content/docs/api/callbacks.md'), callbacksPage('en'))
await writeFileEnsured(path.join(root, 'src/content/docs/zh-cn/api/callbacks.md'), callbacksPage('zh'))
await writeFileEnsured(path.join(root, 'src/content/docs/api/error-codes.md'), errorCodesPage('en'))
await writeFileEnsured(path.join(root, 'src/content/docs/zh-cn/api/error-codes.md'), errorCodesPage('zh'))

for (const op of operations) {
    await writeFileEnsured(path.join(root, 'src/content/docs/api', `${meta(op).slug}.mdx`), operationPage(op, 'en'))
    await writeFileEnsured(path.join(root, 'src/content/docs/zh-cn/api', `${meta(op).slug}.mdx`), operationPage(op, 'zh'))
}

for (const [name, order] of [['python', 1], ['nodejs', 2], ['java', 3], ['php', 4], ['go', 5]]) {
    await writeFileEnsured(path.join(root, 'src/content/docs/api/examples', `${name}.md`), examplePage(name, order, 'en'))
    await writeFileEnsured(path.join(root, 'src/content/docs/zh-cn/api/examples', `${name}.md`), examplePage(name, order, 'zh'))
}

console.log(`Generated ${operations.length} API v2 public operation pages per locale.`)

async function resetApiDir(rel) {
    const dir = path.join(root, 'src/content/docs', rel)
    await rm(dir, { recursive: true, force: true })
    await mkdir(dir, { recursive: true })
}

async function writeFileEnsured(file, text) {
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, text, 'utf8')
}

async function writeJson(file, value) {
    await writeFileEnsured(file, `${JSON.stringify(value, null, 2)}\n`)
}

function collectOperations(openapi) {
    const methods = new Set(['get', 'post', 'put', 'patch', 'delete'])
    const out = []
    for (const [apiPath, item] of Object.entries(openapi.paths ?? {})) {
        for (const [method, operation] of Object.entries(item ?? {})) {
            if (!methods.has(method)) continue
            const key = `${method.toUpperCase()} ${apiPath}`
            if (!pageMeta[key]) throw new Error(`Missing page metadata for ${key}`)
            out.push({ method: method.toUpperCase(), path: apiPath, operation, key })
        }
    }
    return out.sort((a, b) => meta(a).order - meta(b).order)
}

function meta(op) {
    const [slug, order, title, zhTitle] = pageMeta[op.key]
    return { slug, order, title, zhTitle }
}

function operationPage(op, lang) {
    const zh = lang === 'zh'
    const m = meta(op)
    const importPath = zh ? '../../../../../components/ApiPlayground.astro' : '../../../../components/ApiPlayground.astro'
    const pathParams = (op.operation.parameters ?? []).filter(p => p.in === 'path')
    const queryParams = (op.operation.parameters ?? []).filter(p => p.in === 'query')
    const requestBody = bodySchema(op)
    const requestFields = fieldsForSchema(requestBody)
    const requestExample = requestExampleFor(op)
    const responseExample = responseExampleFor(op)
    const lines = [
        '---',
        `title: ${JSON.stringify(zh ? m.zhTitle : m.title)}`,
        `description: ${JSON.stringify(zh ? `${m.zhTitle} API 参考` : `${m.title} API reference`)}`,
        'sidebar:',
        `  order: ${m.order}`,
        '---',
        '',
        `import ApiPlayground from '${importPath}'`,
        '',
        `**${zh ? '方法' : 'Method'}:** \`${op.method}\``,
        '',
        `**${zh ? '端点' : 'Endpoint'}:** \`${op.path}\``,
        '',
        `**${zh ? '认证' : 'Authentication'}:** ${authText(op, zh)}`,
        '',
        `## ${zh ? '在线试用' : 'Try it'}`,
        '',
        `<ApiPlayground method="${op.method}" path="${op.path}" />`,
        '',
        `## ${zh ? '什么时候使用这个接口' : 'When to use this endpoint'}`,
        '',
        useText(op, zh),
        '',
        identifierText(op, zh),
    ]

    if (pathParams.length) lines.push(paramTable(pathParams, zh ? '路径参数' : 'Path Parameters', zh))
    if (queryParams.length) lines.push(paramTable(queryParams, zh ? '查询参数' : 'Query Parameters', zh))
    if (requestFields.length) lines.push(bodyTable(requestFields, requestExample, zh))
    if (requestFields.some(field => field.name === 'is_async')) lines.push(runModeSection(zh))

    lines.push(
        `## ${zh ? '请求示例' : 'Request Example'}`,
        '',
        '```bash',
        curlFor(op, requestExample),
        '```',
        '',
        `## ${zh ? '响应示例' : 'Response Example'}`,
        '',
        '```json',
        JSON.stringify(responseExample, null, 2),
        '```',
        '',
    )

    const responseFields = responseFieldsSection(op, zh)
    if (responseFields) lines.push(responseFields)

    lines.push(
        `## ${zh ? '注意事项' : 'Notes'}`,
        '',
        notesFor(op, zh).map(note => `- ${note}`).join('\n'),
        '',
        httpResponseTable(op, zh)
    )

    return lines.join('\n')
}

function httpResponseTable(op, zh) {
    const rows = [
        `## ${zh ? 'HTTP 响应' : 'HTTP Responses'}`,
        '',
        `| ${zh ? 'HTTP 状态' : 'HTTP Status'} | ${zh ? '应用代码' : 'Application Code'} | ${zh ? '含义' : 'Meaning'} |`,
        '| --- | --- | --- |',
    ]
    const responseStatuses = Object.keys(op.operation.responses ?? {}).sort((a, b) => {
        const ai = publicHttpStatusOrder.indexOf(a)
        const bi = publicHttpStatusOrder.indexOf(b)
        if (ai !== -1 && bi !== -1) return ai - bi
        if (ai !== -1) return -1
        if (bi !== -1) return 1
        return Number(a) - Number(b)
    })
    for (const status of responseStatuses) {
        const response = op.operation.responses?.[status]
        if (!response) continue
        rows.push(`| \`${status}\` | \`${responseExampleCode(response)}\` | ${responseMeaning(status, response, zh)} |`)
    }
    rows.push('')
    return rows.join('\n')
}

function responseExampleCode(response) {
    const json = response?.content?.['application/json']
    const example = json?.examples ? Object.values(json.examples)[0]?.value : json?.example
    return example?.code ?? '-'
}

function responseMeaning(status, response, zh) {
    const fallback = {
        200: zh ? '请求成功。' : 'The request succeeded.',
        400: zh ? '请求参数不合法。' : 'Invalid request parameters.',
        401: zh ? '认证缺失或无效。' : 'Authentication is missing or invalid.',
        404: zh ? '目标资源不存在。' : 'Resource not found.',
        422: zh ? '请求语义或字段校验未通过。' : 'Request semantics or field validation failed.',
        429: zh ? '请求过于频繁。' : 'Too many requests.',
        500: zh ? '服务端内部错误。' : 'Internal server error.',
    }[status]
    if (zh) return fallback || '-'
    return response?.description || fallback || '-'
}

function useText(op, zh) {
    const pathText = op.path
    if (pathText === '/api/v2/store') return zh ? '用于搜索公开商店中的 Worker，并获取后续详情查询需要的 Worker slug 或 path。' : 'Use this endpoint to search public Store Workers and collect the Worker slug or path for follow-up calls.'
    if (pathText === '/api/v2/workers/{workerId}/runs') return zh ? '用于按新的输入参数直接启动 Worker 运行，而不是运行已保存任务。' : 'Use this endpoint to start a Worker with a fresh input payload instead of a saved task.'
    if (pathText.includes('/result/export') || pathText.endsWith('/export')) return zh ? '用于把运行结果导出为文件下载地址。' : 'Use this endpoint to export run results as a downloadable file.'
    if (pathText.includes('/result')) return zh ? '用于分页读取运行结果行，适合结果预览和表格展示。' : 'Use this endpoint to read paginated result rows for previews or tables.'
    if (pathText.includes('/log')) return zh ? '用于读取运行日志，排查运行状态和错误。' : 'Use this endpoint to read run logs for monitoring and troubleshooting.'
    if (pathText.includes('/abort')) return zh ? '用于中止仍可中止的运行。调用前应确认目标运行。' : 'Use this endpoint to abort an abortable run. Confirm the target before calling it.'
    if (pathText.includes('/rerun')) return zh ? '用于基于已有运行创建新的运行，响应会返回新的 `run_slug`。' : 'Use this endpoint to create a new run from an existing run. The response returns a new `run_slug`.'
    if (pathText === '/api/v2/worker-runs') return zh ? '用于按账户范围查询运行历史，可按 Worker 和状态筛选；它不返回 Worker 清单。' : 'Use this endpoint to list run history in the account scope, optionally filtered by Worker and status; it does not list Workers.'
    if (pathText === '/api/v2/worker-tasks' && op.method === 'POST') return zh ? '用于创建一个新的 Worker 任务模板，保存 Worker 标识、输入参数和可选的调度配置。' : 'Use this endpoint to create a new Worker task template that stores the Worker identifier, input parameters, and an optional schedule.'
    if (pathText === '/api/v2/worker-tasks') return zh ? '用于查询已保存的 Worker 任务模板。' : 'Use this endpoint to list saved Worker task templates.'
    if (pathText === '/api/v2/worker-tasks/{workerTaskId}' && op.method === 'GET') return zh ? '用于读取某个已保存任务模板的详情。' : 'Use this endpoint to read the details of a saved task template.'
    if (pathText === '/api/v2/worker-tasks/{workerTaskId}' && op.method === 'PUT') return zh ? '用于更新任务模板的标题、描述或调度配置；省略的字段保持原值。' : 'Use this endpoint to update the title, description, or schedule of a task template. Omitted fields keep their current values.'
    if (pathText === '/api/v2/worker-tasks/{workerTaskId}' && op.method === 'DELETE') return zh ? '用于删除一个已保存的任务模板。' : 'Use this endpoint to delete a saved task template.'
    if (pathText === '/api/v2/worker-tasks/{workerTaskId}/input' && op.method === 'GET') return zh ? '用于读取任务模板保存的输入参数。' : 'Use this endpoint to read the input parameters stored on a task template.'
    if (pathText === '/api/v2/worker-tasks/{workerTaskId}/input' && op.method === 'PUT') return zh ? '用于更新任务模板的输入参数，可同时切换 Worker 版本。' : 'Use this endpoint to update the input parameters of a task template, optionally switching the Worker version.'
    if (pathText.includes('/worker-tasks') && op.method === 'POST') return zh ? '用于运行已保存的 Worker 任务模板。' : 'Use this endpoint to run a saved Worker task template.'
    if (pathText === '/api/v2/workers/{workerId}/input-schema') return zh ? '用于读取某个 Worker 的输入 schema，并据此构造 `input`。' : 'Use this endpoint to read a Worker input schema and build the `input` payload.'
    if (pathText.includes('/workers/{workerId}/runs/last')) return zh ? '用于在指定 Worker 范围内读取或操作最近一次运行。' : 'Use this endpoint to read or operate on the latest run scoped to one Worker.'
    if (pathText.includes('/worker-runs/last')) return zh ? '用于读取或操作当前账户最近一次运行，不限定 Worker。' : 'Use this endpoint to read or operate on the account-level latest run.'
    if (pathText.includes('/worker-runs/{runId}')) return zh ? '用于通过已知 `runId` 读取或操作某一次具体运行。' : 'Use this endpoint to read or operate on a specific run by `runId`.'
    if (pathText === '/api/v2/users/account') return zh ? '用于验证 token，并读取账户余额和流量额度。' : 'Use this endpoint to verify the token and read account balance and traffic quota.'
    if (pathText === '/api/v2/proxy/region') return zh ? '用于查询运行 Worker 时可选择的代理区域。' : 'Use this endpoint to list proxy regions available for Worker runs.'
    return zh ? '用于查询当前认证用户可使用的 Worker。' : 'Use this endpoint to list Workers available to the authenticated user.'
}

function identifierText(op, zh) {
    const names = (op.operation.parameters ?? []).map(p => p.name)
    const bullets = []
    if (names.includes('workerId') || names.includes('worker_id')) {
        bullets.push(zh ? '`workerId` / `worker_id` 支持 Worker slug，也支持把路径 `owner/name` 写成 `owner~name`。' : '`workerId` / `worker_id` accepts a Worker slug or a path encoded as `owner~name` from `owner/name`.')
    }
    if (names.includes('runId')) {
        bullets.push(zh ? '`runId` 是运行记录 slug。启动或重跑后的 `data.run_slug` 就是后续接口使用的 `runId`。' : '`runId` is the run slug. Use `data.run_slug` from start or rerun responses as the `runId`.')
    }
    if (names.includes('workerTaskId')) {
        bullets.push(zh ? '`workerTaskId` 是已保存任务模板的 slug。' : '`workerTaskId` is the saved task template slug.')
    }
    if (!bullets.length) return ''
    return [`## ${zh ? '标识符说明' : 'Identifier Notes'}`, '', bullets.map(x => `- ${x}`).join('\n'), ''].join('\n')
}

function responseFieldsSection(op, zh) {
    const heading = zh ? '响应字段' : 'Response Fields'
    const isRunDetail = op.method === 'GET' && (
        op.path === '/api/v2/worker-runs/{runId}' ||
        op.path === '/api/v2/worker-runs/last' ||
        op.path === '/api/v2/workers/{workerId}/runs/last'
    )
    const isRunList = op.method === 'GET' && op.path === '/api/v2/worker-runs'
    const isResult = op.method === 'GET' && /\/result$/.test(op.path)
    const isLog = op.method === 'GET' && /\/log$/.test(op.path)
    const isAccount = op.method === 'GET' && op.path === '/api/v2/users/account'

    if (isRunDetail || isRunList) {
        const scope = isRunList
            ? (zh ? '`data.list[]` 中的每一条运行记录都包含以下字段（`data.count` 为总记录数）：' : 'Each run record in `data.list[]` contains these fields (`data.count` is the total record count):')
            : (zh ? '`data` 包含以下运行字段：' : '`data` contains these run fields:')
        const rows = zh ? [
            '| 字段 | 类型 | 说明 |',
            '| --- | --- | --- |',
            '| `slug` | `string` | 运行标识；作为后续详情、日志、结果和导出接口的 `runId`。 |',
            '| `scraper_slug` | `string` | 实际运行的 Worker 标识。 |',
            '| `scraper_title` | `string` | Worker 展示名称。 |',
            '| `version` | `string` | 实际运行的 Worker 版本，例如 `v1.2.8`。 |',
            '| `status` | `string` | 运行状态，唯一的主要结果判断字段。取值见[运行生命周期与状态](/zh-cn/api/run-lifecycle/)。 |',
            '| `results` | `integer` | 当前或最终结果行数。`0` 不代表失败。 |',
            '| `usage` | `string` | 平台记录的资源用量（字符串数值），用于观测与计费诊断。 |',
            '| `traffic` | `integer` | 平台记录的流量诊断值。 |',
            '| `origin` | `string` | 运行来源，例如 `api_v2`。 |',
            '| `started_at` | `integer` | 执行开始时间，Unix 秒。 |',
            '| `finished_at` | `integer` | 执行结束时间，Unix 秒。 |',
            '| `duration` | `integer` | 执行耗时，秒。 |',
            '| `err_msg` | `string` | 可选诊断信息。可能缺失（例如成功运行时通常不返回该字段）；仅作辅助排障，不要单独用它判断成败。 |',
        ] : [
            '| Field | Type | Description |',
            '| --- | --- | --- |',
            '| `slug` | `string` | Run identifier; pass it as `runId` to detail, log, result, and export endpoints. |',
            '| `scraper_slug` | `string` | Identifier of the Worker that ran. |',
            '| `scraper_title` | `string` | Worker display name. |',
            '| `version` | `string` | Worker version that actually ran, for example `v1.2.8`. |',
            '| `status` | `string` | Run status and the primary outcome field. See [Run Lifecycle & Status](/api/run-lifecycle/) for values. |',
            '| `results` | `integer` | Current or final number of result rows. `0` does not mean failure. |',
            '| `usage` | `string` | Platform-recorded resource usage (numeric string) for observability and billing diagnostics. |',
            '| `traffic` | `integer` | Platform-recorded traffic diagnostic value. |',
            '| `origin` | `string` | Run origin, for example `api_v2`. |',
            '| `started_at` | `integer` | Execution start time, Unix seconds. |',
            '| `finished_at` | `integer` | Execution end time, Unix seconds. |',
            '| `duration` | `integer` | Execution duration in seconds. |',
            '| `err_msg` | `string` | Optional diagnostic text. It may be absent (successful runs usually omit it); use it only as supporting evidence, never as the sole success/failure signal. |',
        ]
        const note = zh
            ? '> 时间戳为 Unix 秒（UTC）。取消、排队或状态同步时，时间字段可能出现不完整或不直观的组合；请始终以 `status` 为准。'
            : '> Timestamps are Unix seconds (UTC). Cancellation, queueing, or state synchronization can produce incomplete or non-intuitive timing combinations; always treat `status` as authoritative.'
        return [`## ${heading}`, '', scope, '', ...rows, '', note, ''].join('\n')
    }

    if (isResult) {
        const rows = zh ? [
            '| 字段 | 类型 | 说明 |',
            '| --- | --- | --- |',
            '| `data.count` | `integer` | 当前运行的结果总行数。 |',
            '| `data.headers[]` | `array` | 列定义，每项包含 `key`（字段名）和 `label`（展示名）。 |',
            '| `data.list[]` | `array` | 结果数据行；每行的键对应 `headers[].key`。 |',
        ] : [
            '| Field | Type | Description |',
            '| --- | --- | --- |',
            '| `data.count` | `integer` | Total number of result rows for the run. |',
            '| `data.headers[]` | `array` | Column definitions; each item has `key` (field name) and `label` (display name). |',
            '| `data.list[]` | `array` | Result rows; each row keys align with `headers[].key`. |',
        ]
        const note = zh
            ? '> 结果行可能包含未在 Worker 输出 schema 中声明的内部字段（例如 `__coreclaw_data_id__`），请按需忽略。嵌套或空值的序列化方式取决于导出格式；`filter_keys` 必须匹配 `headers[].key`。分页请求使用从 0 开始的 `offset` 与 `limit`（最大 `100`）。'
            : '> Result rows may include internal fields not declared in the Worker output schema (for example `__coreclaw_data_id__`); ignore them as needed. Serialization of nested or empty values depends on the export format; `filter_keys` must match `headers[].key`. Page requests with zero-based `offset` and `limit` (max `100`).'
        return [`## ${heading}`, '', ...rows, '', note, ''].join('\n')
    }

    if (isLog) {
        const rows = zh ? [
            '| 字段 | 类型 | 说明 |',
            '| --- | --- | --- |',
            '| `data.all_logs_url` | `string` | 完整日志的下载地址。该地址可能是临时的，请及时下载；保留策略请咨询支持。 |',
            '| `data.list[]` | `array` | 日志条目数组，字段由平台定义。 |',
            '| `data.list[].type` | `integer` | 平台定义的日志类型标记。 |',
            '| `data.list[].group` | `string` | 子任务或分组标识。 |',
            '| `data.list[].content` | `string` | 日志文本内容。 |',
            '| `data.list[].timestamp` | `integer` | 日志时间戳（毫秒）。 |',
            '| `data.result_count` | `integer` | 当前结果数量。 |',
        ] : [
            '| Field | Type | Description |',
            '| --- | --- | --- |',
            '| `data.all_logs_url` | `string` | Download URL for the full log. This URL may be temporary — download promptly; contact support for retention policy. |',
            '| `data.list[]` | `array` | Log entries; fields are platform-defined. |',
            '| `data.list[].type` | `integer` | Platform-defined log type marker. |',
            '| `data.list[].group` | `string` | Subtask or group identifier. |',
            '| `data.list[].content` | `string` | Log text content. |',
            '| `data.list[].timestamp` | `integer` | Log timestamp in milliseconds. |',
            '| `data.result_count` | `integer` | Current result count. |',
        ]
        return [`## ${heading}`, '', ...rows, ''].join('\n')
    }

    if (isAccount) {
        const rows = zh ? [
            '| 字段 | 类型 | 说明 |',
            '| --- | --- | --- |',
            '| `data.balance` | `string` | 账户余额（字符串数值）。 |',
            '| `data.balance_expiration_at` | `integer` | 余额到期时间，Unix 秒。余额可能到期；具体到期策略请以 Console 或支持为准。 |',
        ] : [
            '| Field | Type | Description |',
            '| --- | --- | --- |',
            '| `data.balance` | `string` | Account balance as a numeric string. |',
            '| `data.balance_expiration_at` | `integer` | Balance expiration time, Unix seconds. Balance may expire; refer to the Console or support for the exact policy. |',
        ]
        return [`## ${heading}`, '', ...rows, ''].join('\n')
    }

    return ''
}

function notesFor(op, zh) {
    const notes = []
    if (!requiresAuth(op)) notes.push(zh ? '此接口不需要 API token。' : 'This endpoint does not require an API token.')
    else notes.push(zh ? 'API v2 同时支持 Bearer token、旧版 `api-key` 请求头和 query token；新集成建议优先使用 Bearer token。' : 'API v2 supports Bearer token, the legacy `api-key` header, and query token. Prefer Bearer token for new integrations.')
    if (op.path.startsWith('/api/v2/worker-runs/last')) {
        notes.push(zh ? '这是账户级最近运行接口，不需要 `workerId` 路径参数；它会作用于当前账户范围内最近一次运行。' : 'This is an account-level latest-run endpoint and does not take a `workerId` path parameter; it operates on the latest run in the current account scope.')
    } else if (op.path.includes('/workers/{workerId}/runs/last')) {
        notes.push(zh ? '这是 Worker 级最近运行接口，`workerId` 是必填路径参数；它只会作用于该 Worker 范围内最近一次运行。' : 'This is a Worker-scoped latest-run endpoint; `workerId` is required and the operation applies only to that Worker\'s latest run.')
    }
    if (op.path.includes('last')) notes.push(zh ? '`last` 表示当前筛选范围内最近一次运行；如需确定目标，请使用具体 `runId` 接口。' : '`last` means the latest run in the current scope. Use a concrete `runId` endpoint when the target must be explicit.')
    if (op.path.includes('/export')) notes.push(zh ? '`filter_keys` 可用于限制导出字段，例如 `title,address`。' : '`filter_keys` can limit exported fields, for example `title,address`.')
    if (op.path.includes('/result')) notes.push(zh ? '结果列表使用 `offset` 和 `limit` 分页。' : 'Result lists use `offset` and `limit` pagination.')
    if (op.path === '/api/v2/workers/{workerId}/runs') {
        notes.push(zh ? '应先读取 Worker 输入 schema，再构造 `input`；不同 Worker 的输入字段不一定相同。' : 'Read the Worker input schema first before building `input`; fields differ by Worker.')
        notes.push(zh ? '`offset` 和 `limit` 只控制同步返回的结果窗口，不改变 Worker 实际产生的完整结果集。' : 'Use `offset` and `limit` only to control the synchronous result window; they do not change the full result set produced by the Worker.')
        notes.push(zh ? '`version` 是可选字段；除非已经确认具体版本可用，否则建议省略。并非所有 Worker 都接受 `latest` 作为显式版本值。' : '`version` is optional. Omit it unless you have confirmed a concrete available version; not every Worker accepts `latest` as an explicit version value.')
    }
    if (op.path.endsWith('/result')) {
        notes.push(zh ? '`offset` 从 0 开始；`limit` 默认 `20`，最大 `100`。' : '`offset` is zero-based; `limit` defaults to `20` and cannot exceed `100`.')
    }
    if (op.path === '/api/v2/worker-tasks' && op.method === 'POST') {
        notes.push(zh ? '`worker_id` 接受 Worker slug，也支持把 `owner/name` 写成 `owner~name`。' : '`worker_id` accepts a Worker slug, or an `owner/name` path encoded as `owner~name`.')
        notes.push(zh ? '应先读取 Worker 输入 schema 再构造 `input`，表单字段放在 `input.parameters.custom` 下；可用 `GET /api/v2/workers/{workerId}/input-schema` 读取 schema。' : 'Read the Worker input schema before building `input`; form fields belong under `input.parameters.custom`. Use `GET /api/v2/workers/{workerId}/input-schema` to read the schema.')
        notes.push(zh ? '调度字段：`schedule_enabled` 1 启用 0 关闭；`schedule_type` 1=每天、2=每周、3=每月、4=单次；`schedule_time` 为 `HH:mm`；`schedule_once_date` 为 `YYYY-MM-DD`。不启用调度时可省略全部 schedule 字段。' : 'Schedule fields: `schedule_enabled` 1 enabled / 0 disabled; `schedule_type` 1=daily, 2=weekly, 3=monthly, 4=once; `schedule_time` is `HH:mm`; `schedule_once_date` is `YYYY-MM-DD`. Omit all schedule fields when scheduling is not needed.')
        notes.push(zh ? '调度的时区、夏令时、月末边界、错过执行与重叠运行等具体行为由平台管理，不属于公开 API 契约；如需依赖精确调度语义，请先咨询 Console 或支持。' : 'Timezone, DST, month-end edges, missed-run, and overlapping-run behavior for schedules are platform-managed and not part of the public API contract; consult the Console or support before relying on exact schedule semantics.')
    }
    if (op.path === '/api/v2/worker-tasks/{workerTaskId}' && op.method === 'PUT') {
        notes.push(zh ? 'PUT 为部分更新语义：省略的字段保持原值，无需重传整个任务对象。' : 'PUT is a partial update: omitted fields keep their current values; you do not need to resend the whole task object.')
        notes.push(zh ? '如需更新任务输入参数本身（而非标题或调度），请使用 `PUT /api/v2/worker-tasks/{workerTaskId}/input`。' : 'To update the task input parameters themselves (not the title or schedule), use `PUT /api/v2/worker-tasks/{workerTaskId}/input`.')
    }
    if (op.path === '/api/v2/worker-tasks/{workerTaskId}/input' && op.method === 'PUT') {
        notes.push(zh ? '`input` 应按目标 Worker 的输入 schema 构造，表单字段放在 `input.parameters.custom` 下。' : 'Build `input` from the target Worker input schema; form fields belong under `input.parameters.custom`.')
        notes.push(zh ? '`version` 可选，省略时保持当前版本；如需切换版本请传入具体可用版本号。' : '`version` is optional and keeps the current version when omitted; pass a concrete available version to switch.')
    }
    if (op.path === '/api/v2/worker-tasks/{workerTaskId}/runs') {
        notes.push(zh ? '运行已保存任务时，请求体只控制执行模式、回调和同步结果窗口；任务本身的输入来自已保存的 Worker 任务配置。' : 'When running a saved task, the request body controls execution mode, callback, and synchronous result window; the task input comes from the saved Worker task configuration.')
        notes.push(zh ? '`limit` 和 `offset` 只控制同步返回的结果窗口，不改变任务实际产生的完整结果集。' : 'Use `limit` and `offset` only to control the synchronous result window; they do not change the full result set produced by the task.')
    }
    if (op.path.includes('/worker-runs') || op.path.includes('/runs')) {
        notes.push(zh ? '运行状态、轮询、失败诊断和取消处理请参阅[运行生命周期与状态](/zh-cn/api/run-lifecycle/)。' : 'See [Run Lifecycle & Status](/api/run-lifecycle/) for status handling, polling, failure diagnosis, and cancellation behavior.')
    }
    if (op.path.includes('/abort')) {
        notes.push(zh ? '取消请求成功只表示服务端已接受取消操作；随后应针对同一具体 `runId` 读取详情。不要等待或自行构造未在契约中定义的 `aborted` 状态。' : 'A successful abort request only means the service accepted the cancellation operation; then read detail for the same concrete `runId`. Do not wait for or invent an undocumented `aborted` state.')
    }
    if (fieldsForSchema(bodySchema(op)).some(field => field.name === 'callback_url')) {
        notes.push(zh ? '传入 `callback_url` 后，CoreClaw 会在运行状态变化或结束时发送回调通知。详见[回调通知](/zh-cn/api/callbacks/)。' : 'When `callback_url` is provided, CoreClaw sends callback notifications after status changes or completion. See [Callback Notifications](/api/callbacks/).')
    }
    return notes
}

function runModeSection(zh) {
    return zh ? [
        '## 运行模式',
        '',
        '- `is_async: true` 表示异步提交运行，不等待执行结果。响应会返回 `data.run_slug`，随后用运行详情、日志和结果接口轮询。',
        '- `is_async: false` 表示等待执行结果，等价于等待运行执行完成的 run-and-wait；可配合 `offset` / `limit` 直接获取同步运行返回的数据窗口。',
        '',
        '> **⚠️ 同步等待上限：5 分钟。** 当 `is_async: false` 时，平台**最多等待 5 分钟**。若运行在 5 分钟内未完成，请求仍会返回，运行会在后台继续执行——此时必须改用运行**查询接口**按 `runId` 轮询状态、日志和结果。预计运行可能超过 5 分钟时，建议使用 `is_async: true`。',
        '',
    ].join('\n') : [
        '## Run Mode',
        '',
        '- `is_async: true` submits the run asynchronously and returns without waiting for execution results. The response includes `data.run_slug`; then poll the run detail, log, and result endpoints.',
        '- `is_async: false` waits for the run to finish, equivalent to run-and-wait behavior. Use `offset` / `limit` to control the result window returned by the synchronous run.',
        '',
        '> **⚠️ Sync wait limit: 5 minutes.** When `is_async: false`, the platform waits for the run for **up to 5 minutes at most**. If the run has not finished within 5 minutes, the request returns anyway and the run keeps executing in the background — you must then use the run **query endpoint** to poll status, logs, and results by `runId`. For runs that may exceed 5 minutes, prefer `is_async: true`.',
        '',
    ].join('\n')
}

function paramTable(params, title, zh) {
    const rows = [
        `## ${title}`,
        '',
        `| ${zh ? '参数' : 'Parameter'} | ${zh ? '必填' : 'Required'} | ${zh ? '类型' : 'Type'} | ${zh ? '说明' : 'Description'} |`,
        '| --- | --- | --- | --- |',
    ]
    for (const param of params) {
        const schema = param.schema ?? {}
        rows.push(`| \`${param.name}\` | ${param.required ? (zh ? '是' : 'Yes') : (zh ? '否' : 'No')} | \`${schemaType(schema)}\` | ${paramDescription(param, zh)} |`)
    }
    rows.push('')
    return rows.join('\n')
}

function bodyTable(fields, example, zh) {
    const rows = [
        `## ${zh ? '请求体' : 'Request Body'}`,
        '',
        zh ? '使用 `Content-Type: application/json` 发送请求体。表格中的必填/选填描述字段本身是否必须提供；整个请求体是否必填以在线试用区的 Request Body 标记为准。' : 'Send the request body with `Content-Type: application/json`. Required/Optional describes each field; the Try it Request Body badge shows whether the body itself is required.',
        '',
        `| ${zh ? '字段' : 'Field'} | ${zh ? '必填' : 'Required'} | ${zh ? '类型' : 'Type'} | ${zh ? '说明' : 'Description'} |`,
        '| --- | --- | --- | --- |',
    ]
    for (const field of fields) {
        rows.push(`| \`${field.name}\` | ${field.required ? (zh ? '是' : 'Yes') : (zh ? '否' : 'No')} | \`${field.type}\` | ${fieldDescription(field, zh)} |`)
    }
    if (example !== null) rows.push('', `### ${zh ? 'JSON 示例' : 'JSON Example'}`, '', '```json', JSON.stringify(example, null, 2), '```')
    rows.push('')
    return rows.join('\n')
}

function fieldDescription(field, zh) {
    if (field.name === 'is_async') {
        return zh ? '`true` 表示异步提交，不等待执行结果；`false` 表示等待执行结果，直到运行完成。默认 `true`。**同步模式最多等待 5 分钟；超过 5 分钟仍未完成时，请求会先返回，需要改用运行查询接口轮询状态。**' : '`true` submits asynchronously without waiting for results; `false` waits for the run to finish. Defaults to `true`. **Sync mode waits at most 5 minutes; if the run has not finished by then, the request returns and you must poll status via the run query endpoint.**'
    }
    if (zh) {
        if (field.name === 'worker_id') return 'Worker 标识。接受 Worker slug，也支持把 `owner/name` 写成 `owner~name`。'
        if (field.name === 'title') return '任务模板标题，用于展示和搜索。'
        if (field.name === 'description') return '任务模板描述，可选。'
        if (field.name === 'schedule_enabled') return '调度开关：1 启用，0 关闭。'
        if (field.name === 'schedule_type') return '调度类型：1=每天，2=每周，3=每月，4=单次。'
        if (field.name === 'schedule_time') return '调度执行时间，格式 `HH:mm`。'
        if (field.name === 'schedule_weekday') return '每周调度时的星期几（1=周一 … 7=周日）。'
        if (field.name === 'schedule_day') return '每月调度时的日期（1-31）。'
        if (field.name === 'schedule_once_date') return '单次调度的日期，格式 `YYYY-MM-DD`。'
        if (field.name === 'callback_url') return '回调地址。传入后，CoreClaw 会在运行状态变化或结束时向该地址发送 `POST` 请求。'
        if (field.name === 'input') return 'Worker 输入参数。Worker 表单字段通常放在 `input.parameters.custom` 下；应先读取该 Worker 的 input schema，再按 schema 构造。'
        if (field.name === 'limit') return withConstraints('同步运行或重跑时返回的结果窗口大小；仅影响同步响应中附带的结果数量，不影响完整结果集。', field.schema, zh)
        if (field.name === 'offset') return withConstraints('同步运行或重跑时返回结果窗口的起始偏移；从 0 开始。', field.schema, zh)
        if (field.name === 'version') return '可选 Worker 版本。除非已经确认该 Worker 存在某个具体可用版本，否则建议省略；并非所有 Worker 都接受 `latest` 作为显式版本值。'
    }
    if (field.name === 'worker_id') return 'Worker identifier. Accepts a Worker slug, or an `owner/name` path encoded as `owner~name`.'
    if (field.name === 'title') return 'Task template title, used for display and search.'
    if (field.name === 'description') return 'Task template description. Optional.'
    if (field.name === 'schedule_enabled') return 'Schedule switch: 1 enabled, 0 disabled.'
    if (field.name === 'schedule_type') return 'Schedule type: 1=daily, 2=weekly, 3=monthly, 4=once.'
    if (field.name === 'schedule_time') return 'Schedule time of day, `HH:mm`.'
    if (field.name === 'schedule_weekday') return 'Day of week for weekly schedules (1=Monday … 7=Sunday).'
    if (field.name === 'schedule_day') return 'Day of month for monthly schedules (1-31).'
    if (field.name === 'schedule_once_date') return 'Date for one-time schedules, `YYYY-MM-DD`.'
    if (field.name === 'callback_url') return 'Callback URL. When provided, CoreClaw sends a `POST` request after the run status changes or finishes.'
    if (field.name === 'input') return 'Worker input payload. Worker form fields usually belong under `input.parameters.custom`; read the Worker input schema first and build this object from that schema.'
    if (field.name === 'limit') return withConstraints('Synchronous result window size for runs or reruns. It only controls how many result rows are included in the synchronous response, not the full result set.', field.schema, zh)
    if (field.name === 'offset') return withConstraints('Zero-based offset for the synchronous result window returned by runs or reruns.', field.schema, zh)
    if (field.name === 'version') return 'Optional Worker version. Omit it unless you have confirmed a concrete available version for this Worker; not every Worker accepts `latest` as an explicit version value.'
    return withConstraints(field.description || '-', field.schema, zh)
}

function paramDescription(param, zh) {
    const schema = param.schema ?? {}
    const name = param.name
    if (zh) {
        if (name === 'offset') return withConstraints('分页偏移量，从 0 开始；用于结果预览、列表翻页或导出前确认数据窗口。', schema, zh)
        if (name === 'limit') return withConstraints('每页返回数量；列表和结果接口的 `limit` 上限为 `100`。', schema, zh)
        if (name === 'filter_keys') return '逗号分隔的字段名列表，用于限制导出字段，例如 `title,address`。'
        if (name === 'format') return withConstraints('导出格式，支持 `csv`、`json`、`jsonl`、`xlsx`、`xls`、`xml`、`html`、`rss`（大小写不敏感）。默认 `csv`。', schema, zh)
        if (name === 'status') return withConstraints('运行状态筛选。', schema, zh)
        if (name === 'keyword') return param.description === 'Keyword for task title or slug' ? '按任务标题或 slug 搜索。' : '按标题、slug 或 path 搜索。'
        if (name === 'worker_id') return 'Worker slug 或 path；如果使用 `owner/name` 路径，请写成 `owner~name`。'
        if (name === 'workerId') return 'Worker slug 或 path；如果使用 `owner/name` 路径，请写成 `owner~name`。'
        if (name === 'runId') return '运行记录 slug，即启动或重跑响应中的 `data.run_slug`。'
        if (name === 'workerTaskId') return '已保存 Worker 任务模板的 slug，可从 `GET /api/v2/worker-tasks` 响应的 `data.list[].slug` 获取。'
        if (name === 'language') return withConstraints('代理区域名称语言。', schema, zh)
    } else {
        if (name === 'offset') return withConstraints('Pagination offset, starting from 0. Use it for result previews, list paging, or choosing a result window.', schema, zh)
        if (name === 'limit') return withConstraints('Page size. `limit` is capped at `100` on list and result endpoints.', schema, zh)
        if (name === 'filter_keys') return 'Comma-separated field keys used to limit exported fields, for example `title,address`.'
        if (name === 'format') return withConstraints('Export format. Supports `csv`, `json`, `jsonl`, `xlsx`, `xls`, `xml`, `html`, `rss` (case-insensitive). Defaults to `csv`.', schema, zh)
        if (name === 'status') return withConstraints('Run status filter.', schema, zh)
        if (name === 'worker_id') return 'Worker slug or path. You may paste `owner/name`; the playground sends it as `owner~name` for query values.'
        if (name === 'workerId') return 'Worker slug or path. You may paste `owner/name`; the playground sends it as `owner~name` for path values.'
        if (name === 'runId') return 'Run slug returned as `data.run_slug` from start or rerun responses.'
        if (name === 'workerTaskId') return 'Saved Worker task template slug. Get it from the `data.list[].slug` field of `GET /api/v2/worker-tasks`.'
    }
    return withConstraints(param.description || schema.description || '-', schema, zh)
}

function withConstraints(text, schema = {}, zh) {
    const details = []
    if (schema.default !== undefined) details.push(zh ? `默认 \`${schema.default}\`` : `default \`${schema.default}\``)
    if (schema.minimum !== undefined && schema.maximum !== undefined) details.push(zh ? `范围 ${schema.minimum}-${schema.maximum}` : `range ${schema.minimum}-${schema.maximum}`)
    else if (schema.minimum !== undefined) details.push(zh ? `最小 ${schema.minimum}` : `minimum ${schema.minimum}`)
    else if (schema.maximum !== undefined) details.push(zh ? `最大 ${schema.maximum}` : `maximum ${schema.maximum}`)
    if (schema.enum?.length) details.push(zh ? `可选值：${schema.enum.map(value => `\`${value}\``).join('、')}` : `allowed values: ${schema.enum.map(value => `\`${value}\``).join(', ')}`)
    if (!details.length) return text
    return zh ? `${text} 约束：${details.join('；')}。` : `${text} Constraints: ${details.join('; ')}.`
}

function bodySchema(op) {
    const schema = op.operation.requestBody?.content?.['application/json']?.schema
    return deref(schema)
}

function fieldsForSchema(schema) {
    if (!schema || schema.type !== 'object') return []
    const required = new Set(schema.required ?? [])
    return Object.entries(schema.properties ?? {}).map(([name, value]) => ({
        name,
        required: required.has(name),
        type: schemaType(value),
        description: value.description ?? '',
        schema: value,
    }))
}

function deref(node) {
    if (!node || typeof node !== 'object') return node
    if (node.$ref) {
        const parts = node.$ref.replace(/^#\//, '').split('/')
        let current = spec
        for (const part of parts) current = current?.[part]
        return deref(current)
    }
    if (Array.isArray(node)) return node.map(deref)
    const out = {}
    for (const [key, value] of Object.entries(node)) out[key] = deref(value)
    return out
}

function schemaType(schema = {}) {
    if (Array.isArray(schema.type)) return schema.type.join(' | ')
    if (schema.type === 'array') return `${schemaType(schema.items ?? {})}[]`
    if (schema.enum) return `enum: ${schema.enum.join(', ')}`
    return schema.type ?? schema.format ?? 'any'
}

function requestExampleFor(op) {
    const json = op.operation.requestBody?.content?.['application/json']
    if (json?.examples) {
        const first = Object.values(json.examples)[0]
        if (first?.value !== undefined) return sanitizeRequestExample(op, first.value)
    }
    if (json?.example !== undefined) return sanitizeRequestExample(op, json.example)
    const schema = bodySchema(op)
    if (!schema || schema.type !== 'object') return null
    const out = {}
    for (const [name, field] of Object.entries(schema.properties ?? {})) out[name] = sampleValue(name, field)
    return sanitizeRequestExample(op, out)
}

function sanitizeRequestExample(op, value) {
    if (op.path !== '/api/v2/workers/{workerId}/runs' || value === null || typeof value !== 'object' || Array.isArray(value)) {
        return value
    }
    const out = { ...value }
    delete out.callback_url
    delete out.version
    out.input = directWorkerInput()
    return out
}

function sanitizePublicSpecExamples(openapi) {
    const examples = openapi.paths?.['/api/v2/workers/{workerId}/runs']?.post?.requestBody?.content?.['application/json']?.examples
    if (!examples) return
    for (const example of Object.values(examples)) {
        if (!example?.value || typeof example.value !== 'object' || Array.isArray(example.value)) continue
        delete example.value.version
        example.value.input = directWorkerInput()
    }
}

function directWorkerInput() {
    return {
        parameters: {
            custom: { ...sampleDirectWorkerCustomInput },
        },
    }
}

function directWorkerRunExample(extra = {}) {
    return {
        input: directWorkerInput(),
        is_async: true,
        limit: 20,
        offset: 0,
        ...extra,
    }
}

function responseExampleFor(op) {
    const json = op.operation.responses?.['200']?.content?.['application/json']
    if (json?.examples) {
        const first = Object.values(json.examples)[0]
        if (first?.value !== undefined) return first.value
    }
    return { code: 0, message: 'success', request_id: 'req-123' }
}

function sampleValue(name, schema = {}) {
    if (schema.default !== undefined) return schema.default
    if (name === 'callback_url') return 'https://client.example.com/openapi/callback'
    if (name === 'input') return { parameters: { custom: { ...sampleDirectWorkerCustomInput } } }
    if (name === 'is_async') return true
    if (name === 'limit') return 20
    if (name === 'offset') return 0
    if (name === 'worker_id') return 'coreclaw~google-maps-scraper'
    if (name === 'title') return 'Google Maps Scraper (Task)'
    if (name === 'description') return 'Scrape Google Maps business records on a schedule.'
    if (name === 'schedule_enabled') return 0
    if (name === 'schedule_type') return 1
    if (name === 'schedule_time') return '09:00'
    if (name === 'schedule_weekday') return 1
    if (name === 'schedule_day') return 1
    if (name === 'schedule_once_date') return '2026-08-01'
    if (name === 'version') return undefined
    if (schema.type === 'boolean') return true
    if (schema.type === 'integer' || schema.type === 'number') return 0
    if (schema.type === 'array') return []
    if (schema.type === 'object') return {}
    return `YOUR_${name.toUpperCase()}`
}

function curlFor(op, example) {
    const url = new URL(`${API_BASE_URL}${samplePath(op.path)}`)
    for (const param of op.operation.parameters ?? []) {
        if (param.in !== 'query') continue
        const value = sampleQuery(param)
        if (value !== undefined) url.searchParams.set(param.name, value)
    }
    const lines = [`curl -X ${op.method} "${url.toString()}"`]
    if (requiresAuth(op)) lines.push('  -H "Authorization: Bearer YOUR_API_KEY"')
    if (example !== null && op.method !== 'GET') {
        lines.push('  -H "Content-Type: application/json"')
        lines.push(`  --data '${JSON.stringify(example)}'`)
    }
    return lines.join(' \\\n')
}

function samplePath(apiPath) {
    return apiPath
        .replace('{workerId}', 'YOUR_WORKER_ID')
        .replace('{workerTaskId}', 'YOUR_WORKER_TASK_ID')
        .replace('{runId}', 'YOUR_RUN_ID')
}

function sampleQuery(param) {
    const schema = param.schema ?? {}
    if (schema.default !== undefined) return String(schema.default)
    if (param.name === 'keyword') return 'coffee'
    if (param.name === 'worker_id') return 'YOUR_WORKER_ID'
    if (param.name === 'status') return 'running'
    if (param.name === 'format') return 'csv'
    if (param.name === 'filter_keys') return 'title,address'
    return param.required ? String(sampleValue(param.name, schema)) : undefined
}

function requiresAuth(op) {
    const security = op.operation.security ?? spec.security
    return Array.isArray(security) && security.some(item => Object.keys(item).length > 0)
}

function authText(op, zh) {
    if (!requiresAuth(op)) return zh ? '不需要 API token' : 'No API token required'
    return zh
        ? '支持 `Authorization: Bearer <YOUR_API_KEY>`、`api-key: <YOUR_API_KEY>` 和 `?token=<YOUR_API_KEY>`。推荐优先使用 Bearer token。'
        : 'Supports `Authorization: Bearer <YOUR_API_KEY>`, `api-key: <YOUR_API_KEY>`, and `?token=<YOUR_API_KEY>`. Prefer Bearer token.'
}

function indexPage(lang) {
    const zh = lang === 'zh'
    const rows = operations.map((op, i) => {
        const m = meta(op)
        const href = zh ? `/zh-cn/api/${m.slug}/` : `/api/${m.slug}/`
        return `| ${i + 1} | \`${op.method}\` | \`${op.path}\` | [${zh ? m.zhTitle : m.title}](${href}) |`
    }).join('\n')
    const title = zh ? '基础 URL 与认证' : 'Base URL & Authentication'
    const desc = zh ? 'CoreClaw API v2 的基础地址、认证方式和公开接口清单' : 'CoreClaw API v2 base URL, authentication, and public endpoint reference'
    const body = zh ? [
        '## API 基础地址',
        '',
        `HTTP API 基础地址为 \`${API_BASE_URL}\`。所有 v2 接口路径都以 \`/api/v2\` 开头，例如 \`${API_BASE_URL}/api/v2/users/account\`。`,
        '',
        '```',
        API_BASE_URL,
        '```',
        '',
        '## 认证方式',
        '',
        '需要认证的接口支持三种 token 传递方式。推荐优先使用 Bearer token，同时兼容旧版 `api-key` 请求头和 query token：',
        '',
        '```bash',
        '-H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '| 方式 | 示例 | 说明 |',
        '| --- | --- | --- |',
        '| Bearer token | `Authorization: Bearer YOUR_API_KEY` | 推荐方式，适合新的服务端集成，也适用于浏览器 playground |',
        '| 旧版请求头 | `api-key: YOUR_API_KEY` | 兼容 v1 集成；**仅供服务端使用，浏览器 playground 因 CORS 预检限制无法使用，请改用 Bearer 或 query token** |',
        '| Query token | `?token=YOUR_API_KEY` | 仅在无法设置请求头时使用，避免把带 token 的 URL 写入日志 |',
        '',
        '公开接口不需要 token，例如代理区域列表和商店 Worker 查询。',
        '',
        '## 调用约定',
        '',
        '- 发送 `input` 前先读取 Worker 输入 schema；不同 Worker 的输入字段不一定相同。',
        '- 直接运行 Worker 时使用 `POST /api/v2/workers/{workerId}/runs`；运行已保存任务时使用 `POST /api/v2/worker-tasks/{workerTaskId}/runs`。',
        '- `is_async: true` 表示提交后立即返回，再用 `runId` 查询详情、日志和结果；`is_async: false` 表示等待执行完成并返回同步结果窗口。',
        '- 列表和结果接口的 `offset` 从 0 开始；列表和结果接口的 `limit` 上限为 `100`。',
        '- 需要下载结果文件时使用导出接口，不要在前端逐页拉取全部结果。',
        '',
        '## 响应结构',
        '',
        '大多数 JSON 响应都会包含 `code`、`message`、`request_id` 和 `data`。HTTP 状态表示请求层结果；业务 `code: 0` 表示业务处理成功。排查失败请求时请记录 HTTP 状态、`code`、`message` 和 `request_id`。',
        '',
        '## 标识符类型',
        '',
        '| 标识符 | 含义 | 用法 |',
        '| --- | --- | --- |',
        '| `workerId` | Worker 标识 | 支持 Worker slug，也支持把路径 `owner/name` 写成 `owner~name` |',
        '| `workerTaskId` | 已保存任务模板标识 | 运行任务模板时作为路径参数传入 |',
        '| `runId` | 运行记录标识 | 启动或重跑后响应中的 `data.run_slug` |',
        '',
        '## 公开接口清单',
        '',
        '| # | 方法 | 端点 | 文档 |',
        '| --- | --- | --- | --- |',
        rows,
        '',
    ] : [
        '## API Base URL',
        '',
        `Use \`${API_BASE_URL}\` as the HTTP API base URL. Every v2 endpoint path starts with \`/api/v2\`, for example \`${API_BASE_URL}/api/v2/users/account\`.`,
        '',
        '```',
        API_BASE_URL,
        '```',
        '',
        '## Authentication',
        '',
        'Authenticated endpoints support three token transport modes. Prefer Bearer tokens, while keeping compatibility with the legacy `api-key` header and query token:',
        '',
        '```bash',
        '-H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '| Mode | Example | Notes |',
        '| --- | --- | --- |',
        '| Bearer token | `Authorization: Bearer YOUR_API_KEY` | Recommended for new server-side integrations; also works in the browser playground |',
        '| Legacy header | `api-key: YOUR_API_KEY` | Compatible with v1 integrations; **server-side only — the browser playground cannot use it due to a CORS preflight restriction; use Bearer or query token instead** |',
        '| Query token | `?token=YOUR_API_KEY` | Use only when headers are unavailable; avoid logging tokenized URLs |',
        '',
        'Public endpoints do not require a token, including proxy region lookup and Store Worker search.',
        '',
        '## Calling Conventions',
        '',
        '- Read the Worker input schema before sending `input`; fields differ by Worker.',
        '- Use `POST /api/v2/workers/{workerId}/runs` for a direct Worker run, or `POST /api/v2/worker-tasks/{workerTaskId}/runs` for a saved task run.',
        '- `is_async: true` returns immediately; use `runId` to read details, logs, and results. `is_async: false` waits for completion and returns a synchronous result window.',
        '- `offset` is zero-based on list and result endpoints; `limit` is capped at `100` on list and result endpoints.',
        '- Use export endpoints when the caller needs a downloadable result file instead of fetching every page in a browser.',
        '',
        '## Response Envelope',
        '',
        'Most JSON responses include `code`, `message`, `request_id`, and `data`. HTTP status describes the request layer; application `code: 0` means the business operation succeeded. Keep HTTP status, `code`, `message`, and `request_id` when troubleshooting failed requests.',
        '',
        '## Identifier Types',
        '',
        '| Identifier | Meaning | Usage |',
        '| --- | --- | --- |',
        '| `workerId` | Worker identifier | Accepts a Worker slug or a path encoded as `owner~name` from `owner/name` |',
        '| `workerTaskId` | Saved task template identifier | Passed as a path parameter when running a task template |',
        '| `runId` | Run record identifier | The `data.run_slug` returned after starting or rerunning a Worker |',
        '',
        '## Public Endpoint Reference',
        '',
        '| # | Method | Endpoint | Docs |',
        '| --- | --- | --- | --- |',
        rows,
        '',
    ]
    return frontmatter(title, desc, 0) + body.join('\n')
}

function callbacksPage(lang) {
    const zh = lang === 'zh'
    const example = {
        run_slug: 'run_slug',
        run_status: 'succeeded',
        error_message: '',
        execution_start_timestamp: 100,
        execution_end_timestamp: 200,
        running_duration: 100,
        result_count: 3,
        result_message: 'done',
    }
    const title = zh ? '回调通知' : 'Callback Notifications'
    const desc = zh ? '使用 callback_url 接收 Worker 运行状态通知' : 'Receive Worker run status notifications with callback_url'
    const lines = zh ? [
        '当运行请求包含 `callback_url` 时，CoreClaw 会在运行状态变化或结束后，向调用方提供的地址发送 `POST` 请求。',
        '',
        '回调适合用来减少主动轮询次数。调用方仍应保存启动运行时返回的 `data.run_slug` 和 `request_id`，用于后续查询、排查和幂等处理。',
        '',
        '## 触发方式',
        '',
        '在支持请求体的运行类接口中传入 `callback_url`，例如直接运行 Worker：',
        '',
        '```json',
        JSON.stringify(directWorkerRunExample({ callback_url: 'https://example.com/coreclaw/callbacks' }), null, 2),
        '```',
        '',
        '## 回调请求',
        '',
        'CoreClaw 发送的回调请求使用 `POST` 方法，Body 为 JSON：',
        '',
        '```json',
        JSON.stringify(example),
        '```',
        '',
        '## 字段说明',
        '',
        '| 字段 | 类型 | 说明 |',
        '| --- | --- | --- |',
        '| `run_slug` | `string` | 平台运行标识。 |',
        '| `run_status` | `string` | 运行状态，例如 `succeeded`。 |',
        '| `error_message` | `string` | 失败时的错误信息；没有错误时为空字符串。 |',
        '| `execution_start_timestamp` | `number` | 执行开始时间戳。 |',
        '| `execution_end_timestamp` | `number` | 执行结束时间戳。 |',
        '| `running_duration` | `number` | 运行耗时。 |',
        '| `result_count` | `number` | 当前结果数量。 |',
        '| `result_message` | `string` | 结果摘要或运行消息。 |',
        '',
        '收到回调时应先按 `run_slug` 做幂等处理，再读取[运行详情](/zh-cn/api/worker-runs/detail/)确认实际 `status`；回调或 `finished_at` 都不能替代状态判断。运行状态处理详见[运行生命周期与状态](/zh-cn/api/run-lifecycle/)。',
        '',
        '## 接收端建议',
        '',
        '1. 回调地址应能被 CoreClaw 服务端访问，并返回 2xx HTTP 状态。',
        '2. 根据运行标识做幂等处理，避免重复通知造成重复写入。',
        '3. 收到回调后，如需完整结果，请继续调用运行详情、日志、结果或导出接口读取。',
        '4. 不要把 API key 放进 `callback_url`；如需校验来源，请在自己的回调服务中使用独立签名或随机路径。',
        '',
    ] : [
        'When a run request includes `callback_url`, CoreClaw sends a `POST` request to that URL after the run status changes or finishes.',
        '',
        'Callbacks reduce polling, but callers should still store the `data.run_slug` and `request_id` returned by the run request for follow-up reads, troubleshooting, and idempotency.',
        '',
        '## Triggering a Callback',
        '',
        'Pass `callback_url` in run endpoints that accept a JSON request body, for example when starting a Worker directly:',
        '',
        '```json',
        JSON.stringify(directWorkerRunExample({ callback_url: 'https://example.com/coreclaw/callbacks' }), null, 2),
        '```',
        '',
        '## Callback Request',
        '',
        'CoreClaw sends the callback as a `POST` request with a JSON body:',
        '',
        '```json',
        JSON.stringify(example),
        '```',
        '',
        '## Fields',
        '',
        '| Field | Type | Description |',
        '| --- | --- | --- |',
        '| `run_slug` | `string` | Platform run slug. |',
        '| `run_status` | `string` | Run status, for example `succeeded`. |',
        '| `error_message` | `string` | Error message when the run fails; empty when there is no error. |',
        '| `execution_start_timestamp` | `number` | Execution start timestamp. |',
        '| `execution_end_timestamp` | `number` | Execution end timestamp. |',
        '| `running_duration` | `number` | Running duration. |',
        '| `result_count` | `number` | Current result count. |',
        '| `result_message` | `string` | Result summary or run message. |',
        '',
        'Handle a callback idempotently by `run_slug`, then re-read [run detail](/api/worker-runs/detail/) to confirm the actual `status`; neither a callback nor `finished_at` replaces the status decision. See [Run Lifecycle & Status](/api/run-lifecycle/) for state handling.',
        '',
        '## Receiver Guidance',
        '',
        '1. The callback URL should be reachable by CoreClaw servers and return a 2xx HTTP status.',
        '2. Use the run identifier for idempotency so repeated notifications do not create duplicate writes.',
        '3. After receiving a callback, call the run detail, log, result, or export endpoints when complete data is needed.',
        '4. Do not put API keys in `callback_url`; use a separate signature or random callback path if your receiver needs source verification.',
        '',
    ]
    return frontmatter(title, desc, 1) + lines.join('\n')
}

function errorCodesPage(lang) {
    const zh = lang === 'zh'
    const rows = errorCodes.map(error => `| \`${error.code}\` | \`${error.key}\` | ${error.message} |`).join('\n')
    const title = zh ? '错误码' : 'Error Codes'
    const desc = zh ? 'CoreClaw API v2 应用错误码' : 'CoreClaw API v2 application error codes'
    const lines = zh ? [
        'CoreClaw API 使用 HTTP 状态码表达请求层结果，并使用响应体中的 `code` 表达业务层结果。',
        '',
        '`code: 0` 表示业务处理成功；非 0 值表示请求已被服务端处理但业务层失败。排查问题时请同时记录 HTTP 状态、`code`、`message` 和 `request_id`。',
        '',
        '## 错误码表',
        '',
        '| Code | Key | Message |',
        '| --- | --- | --- |',
        rows,
        '',
        '## 处理建议',
        '',
        '1. `12001` 和 `12002` 通常需要检查 Bearer token、`api-key` 请求头或 query token。',
        '2. `13000` 表示触发限流，应降低请求频率并做退避重试。',
        '3. `30001` 表示账户余额不足，应先处理账户余额或额度。',
        '4. `50001`、`50003`、`60001`、`70001` 通常与 Worker、任务、版本或运行 ID 不存在或不可用有关。',
        '5. `10000`、`14000`、`16000` 属于服务端或能力状态问题，请记录 `request_id` 后再排查。',
        '',
    ] : [
        'CoreClaw API uses HTTP status codes for the request layer and the response body `code` for the business layer.',
        '',
        '`code: 0` means the business operation succeeded. Non-zero values mean the request reached the service but the business operation failed. When troubleshooting, keep the HTTP status, `code`, `message`, and `request_id` together.',
        '',
        '## Error Code Table',
        '',
        '| Code | Key | Message |',
        '| --- | --- | --- |',
        rows,
        '',
        '## Handling Guidance',
        '',
        '1. `12001` and `12002` usually require checking Bearer token, the `api-key` header, or query token.',
        '2. `13000` means the request is rate limited; reduce request frequency and retry with backoff.',
        '3. `30001` means the account balance is insufficient.',
        '4. `50001`, `50003`, `60001`, and `70001` usually mean the Worker, task, version, or run ID does not exist or is unavailable.',
        '5. `10000`, `14000`, and `16000` indicate server-side or capability-state issues. Keep `request_id` for troubleshooting.',
        '',
    ]
    return frontmatter(title, desc, 2) + lines.join('\n')
}

function integrationPage(lang) {
    const zh = lang === 'zh'
    const title = zh ? 'API 集成指南' : 'API Integration'
    const desc = zh ? '使用 CoreClaw API v2 运行 Worker 并获取结果' : 'Run Workers and retrieve results with CoreClaw API v2'
    const lines = zh ? [
        'CoreClaw API v2 的推荐流程是：确认认证，选择运行入口，按 Worker schema 构造输入，选择异步或同步执行模式，保存 `data.run_slug` 和 `request_id`，然后用 `runId` 查询状态、日志、结果或导出文件。运行状态处理、退避轮询和取消语义见[运行生命周期与状态](/zh-cn/api/run-lifecycle/)。',
        '',
        '## 1. 快速认证检查',
        '',
        '先用账户接口验证 token 是否可用。响应中的 HTTP 状态表示请求层结果，业务 `code` 表示业务层结果。',
        '',
        '```bash',
        `curl -X GET "${API_BASE_URL}/api/v2/users/account" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '## 2. 选择运行入口',
        '',
        'CoreClaw 有两类常见运行入口。直接运行 Worker 适合调用方每次传入新的 `input`；运行已保存的 Worker 任务适合复用平台中已经配置好的任务模板。',
        '',
        '| 场景 | 接口 | 何时使用 |',
        '| --- | --- | --- |',
        '| 直接运行 Worker | `POST /api/v2/workers/{workerId}/runs` | 调用方自己构造 `input`，每次请求可以传入不同输入。 |',
        '| 运行已保存的 Worker 任务 | `POST /api/v2/worker-tasks/{workerTaskId}/runs` | 输入来自已保存任务配置，请求体只控制执行模式、回调和同步结果窗口。 |',
        '',
        '### 搜索或列出 Worker',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/store?keyword=coffee&offset=0&limit=20"`,
        '```',
        '',
        '### 读取输入 schema',
        '',
        '发送 `input` 前应先读取 Worker 输入 schema。不同 Worker 的字段、默认值和约束可能不同。',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/workers/YOUR_WORKER_ID/input-schema"`,
        '```',
        '',
        '## 3. 选择执行模式',
        '',
        '- `is_async: true` 表示异步提交，不等待执行结果。响应会返回 `data.run_slug`，后续异步运行使用 `runId` 轮询详情、日志和结果。',
        '- `is_async: false` 表示等待执行结果，相当于 run-and-wait，会等待运行完成。`offset` / `limit` 只控制同步响应中附带的结果窗口，不影响完整结果集。',
        '- `callback_url` 可用于接收状态变化或结束通知，但回调不能替代结果接口。需要完整数据时仍应按 `runId` 查询或导出。',
        '',
        '### 直接运行 Worker',
        '',
        '```bash',
        `curl -X POST "${API_BASE_URL}/api/v2/workers/YOUR_WORKER_ID/runs" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        '  --data \'{"input":{"parameters":{"custom":{"keywords":["coffee"],"base_location":"New York,USA","max_results":1}}},"is_async":true,"limit":20,"offset":0}\'',
        '```',
        '',
        '### 运行已保存的 Worker 任务',
        '',
        '```bash',
        `curl -X POST "${API_BASE_URL}/api/v2/worker-tasks/YOUR_WORKER_TASK_ID/runs" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        '  --data \'{"is_async":true,"callback_url":"https://example.com/coreclaw/callbacks"}\'',
        '```',
        '',
        '响应中的 `data.run_slug` 就是后续接口使用的 `runId`。',
        '',
        '### 管理已保存的任务模板',
        '',
        '除了在平台上手动创建任务，也可以用 API 管理任务模板：用 `POST /api/v2/worker-tasks` 创建，`GET /api/v2/worker-tasks/{workerTaskId}` 读取，`PUT` 更新标题/描述/调度，`PUT .../input` 更新输入参数，`DELETE` 删除。这样可以在服务端复用同一套输入和调度配置，而不必每次重发 `input`。',
        '',
        '```bash',
        `curl -X POST "${API_BASE_URL}/api/v2/worker-tasks" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        '  --data \'{"worker_id":"coreclaw~google-maps-scraper","title":"Google Maps Scraper (Task)","input":{"parameters":{"custom":{"keywords":[{"keyword":"HVAC Contractors"}],"base_location":"New York,USA","max_results":1}}}}\'',
        '```',
        '',
        '## 4. 异步运行使用 `runId` 轮询',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID/log" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID/result?offset=0&limit=20" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '`offset` 从 0 开始；列表和结果接口的 `limit` 默认 `20`，最大 `100`。长时间轮询时应使用退避策略，避免触发 `429`。',
        '',
        '## 5. 下载文件使用导出接口',
        '',
        '结果预览使用 `/result` 分页接口。需要下载文件时使用导出接口，并用 `filter_keys` 控制导出字段。',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID/result/export?format=csv&filter_keys=title%2Caddress" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '## 错误处理建议',
        '',
        '1. 同时检查 HTTP 状态和业务 `code`；不要只看其中一个。',
        '2. `401` 通常表示 token 缺失或无效；`422` 通常表示字段值、分页范围或请求语义不符合契约。',
        '3. 保存 `request_id`，用于排查失败请求。',
        '4. 对 `429` 做退避重试，不要立即高频重放请求。',
        '',
    ] : [
        'The recommended CoreClaw API v2 flow is: verify authentication, choose the run entry point, build input from the Worker schema, choose async or sync execution, save `data.run_slug` and `request_id`, then use `runId` to read status, logs, results, or an export file. See [Run Lifecycle & Status](/api/run-lifecycle/) for state handling, backoff polling, and cancellation semantics.',
        '',
        '## 1. Quick Authentication Check',
        '',
        'Start by verifying that the token works. HTTP status describes the request layer, and application `code` describes the business layer.',
        '',
        '```bash',
        `curl -X GET "${API_BASE_URL}/api/v2/users/account" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '## 2. Choose the run entry point',
        '',
        'CoreClaw has two common run entry points. Direct Worker run is for callers that send a fresh `input` payload. Saved Worker task run is for reusing a task template already configured in the platform.',
        '',
        '| Scenario | Endpoint | When to use |',
        '| --- | --- | --- |',
        '| Direct Worker run | `POST /api/v2/workers/{workerId}/runs` | The caller builds `input`; each request can send different input. |',
        '| Saved Worker task run | `POST /api/v2/worker-tasks/{workerTaskId}/runs` | Input comes from the saved task configuration; the request body controls execution mode, callback, and synchronous result window. |',
        '',
        '### Search or list Workers',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/store?keyword=coffee&offset=0&limit=20"`,
        '```',
        '',
        '### Read the input schema',
        '',
        'Read the Worker input schema before sending `input`. Fields, defaults, and constraints can differ by Worker.',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/workers/YOUR_WORKER_ID/input-schema"`,
        '```',
        '',
        '## 3. Choose the execution mode',
        '',
        '- `is_async: true` submits asynchronously and does not wait for execution results. The response returns `data.run_slug`; Poll by `runId` when the run is asynchronous.',
        '- `is_async: false` waits for completion, equivalent to run-and-wait behavior. `offset` / `limit` only control the result window included in the synchronous response; they do not change the full result set.',
        '- `callback_url` can receive status-change or completion notifications, but callbacks do not replace result endpoints. Use `runId` to read or export complete data.',
        '',
        '### Direct Worker run',
        '',
        '```bash',
        `curl -X POST "${API_BASE_URL}/api/v2/workers/YOUR_WORKER_ID/runs" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        '  --data \'{"input":{"parameters":{"custom":{"keywords":["coffee"],"base_location":"New York,USA","max_results":1}}},"is_async":true,"limit":20,"offset":0}\'',
        '```',
        '',
        '### Saved Worker task run',
        '',
        '```bash',
        `curl -X POST "${API_BASE_URL}/api/v2/worker-tasks/YOUR_WORKER_TASK_ID/runs" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        '  --data \'{"is_async":true,"callback_url":"https://example.com/coreclaw/callbacks"}\'',
        '```',
        '',
        'The response `data.run_slug` is the `runId` used by follow-up endpoints.',
        '',
        '### Manage saved task templates',
        '',
        'Besides creating tasks manually on the platform, you can manage task templates through the API: create with `POST /api/v2/worker-tasks`, read with `GET /api/v2/worker-tasks/{workerTaskId}`, update title/description/schedule with `PUT`, update input parameters with `PUT .../input`, and delete with `DELETE`. This lets you reuse the same input and schedule configuration from the server side instead of resending `input` every time.',
        '',
        '```bash',
        `curl -X POST "${API_BASE_URL}/api/v2/worker-tasks" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        '  --data \'{"worker_id":"coreclaw~google-maps-scraper","title":"Google Maps Scraper (Task)","input":{"parameters":{"custom":{"keywords":[{"keyword":"HVAC Contractors"}],"base_location":"New York,USA","max_results":1}}}}\'',
        '```',
        '',
        '## 4. Poll by `runId` when the run is asynchronous',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID/log" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID/result?offset=0&limit=20" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '`offset` is zero-based. List and result endpoints default `limit` to `20` and cap it at `100`. Poll long-running jobs with backoff to avoid `429` responses.',
        '',
        '## 5. Use export endpoints for downloads',
        '',
        'Use `/result` endpoints for paginated previews. Use export endpoints for downloads, and use `filter_keys` to limit exported fields.',
        '',
        '```bash',
        `curl "${API_BASE_URL}/api/v2/worker-runs/YOUR_RUN_ID/result/export?format=csv&filter_keys=title%2Caddress" \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY"',
        '```',
        '',
        '## Error Handling Guidance',
        '',
        '1. Check both HTTP status and application `code`; do not rely on only one layer.',
        '2. `401` usually means the token is missing or invalid. `422` usually means a field value, pagination range, or request semantic failed validation.',
        '3. Store `request_id` for troubleshooting failed requests.',
        '4. Retry `429` responses with backoff instead of replaying immediately at high frequency.',
        '',
    ]
    return frontmatter(title, desc, -1) + lines.join('\n')
}

function runLifecyclePage(lang) {
    const zh = lang === 'zh'
    const statusValues = runStatusValues.map(value => `\`${value}\``).join(zh ? '、' : ', ')
    const title = zh ? '运行生命周期与状态' : 'Run Lifecycle & Status'
    const desc = zh
        ? 'CoreClaw API v2 Worker 运行状态、轮询与故障处理指南'
        : 'CoreClaw API v2 Worker run states, polling, and failure handling'
    const lines = zh ? [
        '本页说明如何安全地判断一次 Worker 运行的结果。先保存启动或重跑响应中的 `data.run_slug`（后续接口使用的 `runId`）和 `request_id`，再用具体 `runId` 查询运行详情。不要把账户级或 Worker 级的 `last` 接口当作稳定引用。',
        '',
        '## 契约中的状态值',
        '',
        `目前 ` + '`GET /api/v2/worker-runs` 的 `status` 筛选参数允许：' + statusValues + '。这些是公开 API 契约支持的值。',
        '',
        '| 状态 | 客户端处理方式 |',
        '| --- | --- |',
        '| `ready` | 已创建但尚未开始执行。使用有上限的退避轮询详情接口。 |',
        '| `running` | 正在执行。继续以退避方式轮询；需要进度或诊断时可读取日志。 |',
        '| `succeeded` | 运行成功。随后读取 `/result` 预览数据，或使用导出接口获取下载地址。结果数为 `0` 仍然可能是成功运行。 |',
        '| `failed` | 运行失败。保存 `request_id`，读取详情和日志；只有 `err_msg` 存在时才向用户展示它。不要仅根据结果数判断。 |',
        '| `aborting` | 已请求取消。继续针对**同一 `runId`**进行有上限的详情/日志查询，避免无限等待。 |',
        '',
        '> `aborted` 不是当前公开 `status` 筛选契约中的值。客户端不能自行把 `aborting` 改写成 `aborted`，也不能把 `finished_at` 单独当作成功或最终状态的证据。',
        '',
        '## 运行详情字段',
        '',
        '| 字段 | 用途与注意事项 |',
        '| --- | --- |',
        '| `slug` | 运行标识；作为后续详情、日志、结果和导出接口的 `runId`。 |',
        '| `scraper_slug`、`scraper_title`、`version` | 标识实际运行的 Worker 和版本。 |',
        '| `status` | 唯一的主要结果判断字段；始终优先于 `results`、时间戳或诊断字段。 |',
        '| `results` | 当前或最终的结果数量；`0` 不等于失败，非零也不保证成功。 |',
        '| `err_msg` | 可选诊断信息。可能缺失，也可能在非失败记录中出现；仅作辅助排障信息。 |',
        '| `started_at`、`finished_at`、`duration` | 执行时间信息。取消、排队或服务端状态同步时它们可能出现不完整或不直观的组合。 |',
        '| `origin`、`usage`、`traffic` | 来源、计费/使用量和流量诊断字段；将它们用于观测，而不是运行成败判断。 |',
        '',
        '## 推荐轮询流程',
        '',
        '1. 提交运行后保存 `data.run_slug` 与 `request_id`。',
        '2. 调用 [`GET /api/v2/worker-runs/{runId}`](/zh-cn/api/worker-runs/detail/) 读取 `data.status`。先等待约 2 秒，然后逐步退避到 5、10、15 秒；为调用设置总超时。',
        '3. 当状态为 `ready` 或 `running` 时继续轮询；需要排查时读取[运行日志](/zh-cn/api/worker-runs/log/)。',
        '4. 当状态为 `succeeded` 时读取[运行结果](/zh-cn/api/worker-runs/result/)或[导出结果](/zh-cn/api/worker-runs/export/)。',
        '5. 当状态为 `failed` 时记录 `request_id`、读取详情与日志，并根据 Worker 输入或日志采取下一步。只有在明确需要时才调用重跑接口。',
        '6. 调用取消接口后，只查询刚才提交的具体 `runId`；若仍为 `aborting`，继续有限次数的退避查询并向用户提示取消正在处理。',
        '',
        '## 与回调一起使用',
        '',
        '`callback_url` 能减少轮询次数，但回调接收端应按 `run_slug` 做幂等，并在处理通知前重新读取[运行详情](/zh-cn/api/worker-runs/detail/)。回调或 `finished_at` 都不能替代 `status` 的判断。详见[回调通知](/zh-cn/api/callbacks/)。',
        '',
    ] : [
        'This page explains how to determine the outcome of a Worker run safely. Save the `data.run_slug` returned by a start or rerun request (the `runId` used by follow-up endpoints) together with `request_id`, then read run detail by the specific `runId`. Do not treat account- or Worker-scoped `last` endpoints as stable references.',
        '',
        '## Contract status values',
        '',
        '`GET /api/v2/worker-runs` currently accepts these `status` filter values: ' + statusValues + '. These are the values supported by the public API contract.',
        '',
        '| Status | Client handling |',
        '| --- | --- |',
        '| `ready` | The run exists but has not started. Poll run detail with bounded backoff. |',
        '| `running` | The run is executing. Continue backoff polling; read logs when progress or diagnostics are needed. |',
        '| `succeeded` | The run succeeded. Read `/result` for a preview or use an export endpoint for a download URL. A result count of `0` can still be successful. |',
        '| `failed` | The run failed. Preserve `request_id`, read detail and logs, and show `err_msg` only when present. Do not infer failure from result count alone. |',
        '| `aborting` | Cancellation was requested. Perform bounded detail/log reads for the **same `runId`** instead of waiting indefinitely. |',
        '',
        '> `aborted` is not a value in the current public `status` filter contract. Clients must not rewrite `aborting` to `aborted`, and must not use `finished_at` alone as proof of success or a final state.',
        '',
        '## Run detail fields',
        '',
        '| Field | Use and caveats |',
        '| --- | --- |',
        '| `slug` | Run identifier; pass it as `runId` to detail, log, result, and export endpoints. |',
        '| `scraper_slug`, `scraper_title`, `version` | Identify the Worker and version that actually ran. |',
        '| `status` | The primary outcome field. Always prioritize it over result count, timestamps, or diagnostics. |',
        '| `results` | Current or final number of rows. `0` does not mean failure, and a non-zero count does not guarantee success. |',
        '| `err_msg` | Optional diagnostic text. It can be absent and may appear on non-failed records; use it only as supporting diagnostic evidence. |',
        '| `started_at`, `finished_at`, `duration` | Execution timing. Cancellation, queueing, or server-side state synchronization can produce incomplete or non-intuitive combinations. |',
        '| `origin`, `usage`, `traffic` | Source, billing/usage, and traffic diagnostics. Use them for observability, not as success criteria. |',
        '',
        '## Recommended polling flow',
        '',
        '1. After submission, save `data.run_slug` and `request_id`.',
        '2. Call [`GET /api/v2/worker-runs/{runId}`](/api/worker-runs/detail/) and read `data.status`. Wait about 2 seconds first, then back off progressively to 5, 10, and 15 seconds; enforce a total timeout.',
        '3. Continue polling for `ready` or `running`; read the [run log](/api/worker-runs/log/) when diagnosing progress.',
        '4. On `succeeded`, read [run results](/api/worker-runs/result/) or [export results](/api/worker-runs/export/).',
        '5. On `failed`, retain `request_id`, read detail and logs, and act on Worker input or log evidence. Call a rerun endpoint only when repeating the work is intentional.',
        '6. After an abort request, read only the concrete `runId` that you just submitted. If it remains `aborting`, make a bounded number of backoff reads and tell the user that cancellation is being processed.',
        '',
        '## Use with callbacks',
        '',
        '`callback_url` can reduce polling, but receivers should be idempotent by `run_slug` and re-read [run detail](/api/worker-runs/detail/) before acting on a notification. Neither a callback nor `finished_at` replaces the `status` decision. See [Callback Notifications](/api/callbacks/).',
        '',
    ]
    return frontmatter(title, desc, -2) + lines.join('\n')
}

function examplePage(name, order, lang) {
    const zh = lang === 'zh'
    const titles = {
        python: ['Python Example', 'Python 示例'],
        nodejs: ['Node.js Example', 'Node.js 示例'],
        java: ['Java Example', 'Java 示例'],
        php: ['PHP Example', 'PHP 示例'],
        go: ['Go Example', 'Go 示例'],
    }[name]
    return frontmatter(zh ? titles[1] : titles[0], zh ? 'CoreClaw API v2 集成代码示例' : 'CoreClaw API v2 integration code example', order) + exampleBody(name, zh)
}

function exampleBody(name, zh) {
    const intro = zh
        ? [
            '下面示例覆盖认证检查、启动 Worker、用返回的 `run_slug` 查询结果三步。',
            '',
            '示例中的 `YOUR_WORKER_ID` 是占位符。请替换为要运行的 Worker slug，或把 `owner/name` 路径写成 `owner~name`。`input` 必须按该 Worker 的输入 schema 构造；不同 Worker 的字段不一定相同。',
            '',
            '默认使用 `is_async: true` 异步提交并轮询结果。如需等待执行完成，把 `is_async` 改为 `false`，并用 `offset` / `limit` 控制同步返回的数据窗口。',
        ].join('\n')
        : [
            'The example below checks authentication, starts a Worker run, then reads results with the returned `run_slug`.',
            '',
            '`YOUR_WORKER_ID` is a placeholder. Replace it with a Worker slug, or encode an `owner/name` path as `owner~name`. Build `input` from that Worker\'s input schema; fields differ by Worker.',
            '',
            'The example uses `is_async: true` for async submit-and-poll behavior. Set `is_async` to `false` when the caller should wait for execution to finish, and use `offset` / `limit` to control the synchronous result window.',
        ].join('\n')
    const snippets = {
        python: ['python', `import os
import time

import requests

API_BASE_URL = "${API_BASE_URL}"
API_KEY = os.environ["CORECLAW_API_KEY"]
WORKER_ID = os.environ.get("CORECLAW_WORKER_ID", "YOUR_WORKER_ID")


def coreclaw_request(method, path, *, params=None, json_body=None):
    headers = {"Authorization": f"Bearer {API_KEY}"}
    if json_body is not None:
        headers["Content-Type"] = "application/json"

    response = requests.request(
        method,
        f"{API_BASE_URL}{path}",
        headers=headers,
        params=params,
        json=json_body,
        timeout=60,
    )
    response.raise_for_status()
    payload = response.json()
    if payload.get("code") != 0:
        raise RuntimeError(payload)
    return payload


def wait_for_run(run_id, timeout_seconds=300):
    deadline = time.monotonic() + timeout_seconds
    delay_seconds = 2
    while time.monotonic() < deadline:
        detail = coreclaw_request("GET", f"/api/v2/worker-runs/{run_id}")
        run_data = detail["data"]
        status = run_data.get("status")
        if status == "succeeded":
            return run_data
        if status in {"failed", "aborting"}:
            logs = coreclaw_request("GET", f"/api/v2/worker-runs/{run_id}/log")
            raise RuntimeError({
                "status": status,
                "err_msg": run_data.get("err_msg"),
                "request_id": detail.get("request_id"),
                "logs": logs.get("data"),
            })
        if status not in {"ready", "running"}:
            raise RuntimeError({"unexpected_status": status, "run": run_data})
        time.sleep(delay_seconds)
        delay_seconds = min(delay_seconds * 2, 15)
    raise TimeoutError(f"Timed out waiting for run {run_id}")


account = coreclaw_request("GET", "/api/v2/users/account")
print("Account:", account["data"])

run = coreclaw_request(
    "POST",
    f"/api/v2/workers/{WORKER_ID}/runs",
    json_body={
        # Replace input.parameters.custom with fields from the Worker's input schema.
        "input": {
            "parameters": {
                "custom": {
                    "keywords": ["coffee"],
                    "base_location": "New York,USA",
                    "max_results": 1,
                }
            }
        },
        "is_async": True,
        "offset": 0,
        "limit": 20,
    },
)
run_id = run["data"]["run_slug"]
print("Run ID:", run_id)

completed_run = wait_for_run(run_id)
results = coreclaw_request(
    "GET",
    f"/api/v2/worker-runs/{run_id}/result",
    params={"offset": 0, "limit": 20},
)
print({"status": completed_run["status"], "results": results["data"]})`],
        nodejs: ['js', `const API_BASE_URL = "${API_BASE_URL}";
const API_KEY = process.env.CORECLAW_API_KEY;
const WORKER_ID = process.env.CORECLAW_WORKER_ID ?? "YOUR_WORKER_ID";

if (!API_KEY) throw new Error("Set CORECLAW_API_KEY first.");

async function coreclawRequest(path, { method = "GET", query, body } = {}) {
  const url = new URL(API_BASE_URL + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: \`Bearer \${API_KEY}\`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) throw new Error(\`HTTP \${response.status}: \${await response.text()}\`);
  const payload = await response.json();
  if (payload.code !== 0) throw new Error(JSON.stringify(payload));
  return payload;
}

async function waitForRun(runId, timeoutMs = 300_000) {
  const deadline = Date.now() + timeoutMs;
  let delayMs = 2_000;
  while (Date.now() < deadline) {
    const detail = await coreclawRequest(\`/api/v2/worker-runs/\${runId}\`);
    const runData = detail.data;
    if (runData.status === "succeeded") return runData;
    if (["failed", "aborting"].includes(runData.status)) {
      const logs = await coreclawRequest(\`/api/v2/worker-runs/\${runId}/log\`);
      throw new Error(JSON.stringify({
        status: runData.status,
        err_msg: runData.err_msg,
        request_id: detail.request_id,
        logs: logs.data,
      }));
    }
    if (!["ready", "running"].includes(runData.status)) {
      throw new Error(\`Unexpected run status: \${runData.status}\`);
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
    delayMs = Math.min(delayMs * 2, 15_000);
  }
  throw new Error(\`Timed out waiting for run \${runId}\`);
}

const account = await coreclawRequest("/api/v2/users/account");
console.log("Account:", account.data);

const run = await coreclawRequest(\`/api/v2/workers/\${WORKER_ID}/runs\`, {
  method: "POST",
  body: {
    // Replace input.parameters.custom with fields from the Worker's input schema.
    input: {
      parameters: {
        custom: {
          keywords: ["coffee"],
          base_location: "New York,USA",
          max_results: 1,
        },
      },
    },
    is_async: true,
    offset: 0,
    limit: 20,
  },
});

const runId = run.data.run_slug;
console.log("Run ID:", runId);

const completedRun = await waitForRun(runId);

const results = await coreclawRequest(\`/api/v2/worker-runs/\${runId}/result\`, {
  query: { offset: 0, limit: 20 },
});
console.log({ status: completedRun.status, results: results.data });`],
        java: ['java', javaExample()],
        php: ['php', `<?php
$apiBaseUrl = "${API_BASE_URL}";
$apiKey = getenv("CORECLAW_API_KEY");
$workerId = getenv("CORECLAW_WORKER_ID") ?: "YOUR_WORKER_ID";

if (!$apiKey) {
    throw new RuntimeException("Set CORECLAW_API_KEY first.");
}

function coreclaw_request(string $method, string $path, ?array $query = null, ?array $body = null): array
{
    global $apiBaseUrl, $apiKey;

    $url = $apiBaseUrl . $path;
    if ($query) {
        $url .= "?" . http_build_query($query);
    }

    $headers = ["Authorization: Bearer " . $apiKey];
    $options = [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
    ];

    if ($body !== null) {
        $headers[] = "Content-Type: application/json";
        $options[CURLOPT_HTTPHEADER] = $headers;
        $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_SLASHES);
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, $options);
    $raw = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($raw === false || $status < 200 || $status >= 300) {
        throw new RuntimeException("HTTP " . $status . ": " . $raw);
    }

    $payload = json_decode($raw, true);
    if (($payload["code"] ?? null) !== 0) {
        throw new RuntimeException($raw);
    }
    return $payload;
}

function wait_for_run(string $runId, int $timeoutSeconds = 300): array
{
    $deadline = microtime(true) + $timeoutSeconds;
    $delaySeconds = 2;
    while (microtime(true) < $deadline) {
        $detail = coreclaw_request("GET", "/api/v2/worker-runs/" . rawurlencode($runId));
        $runData = $detail["data"];
        $status = $runData["status"] ?? null;
        if ($status === "succeeded") {
            return $runData;
        }
        if (in_array($status, ["failed", "aborting"], true)) {
            $logs = coreclaw_request("GET", "/api/v2/worker-runs/" . rawurlencode($runId) . "/log");
            throw new RuntimeException(json_encode([
                "status" => $status,
                "err_msg" => $runData["err_msg"] ?? null,
                "request_id" => $detail["request_id"] ?? null,
                "logs" => $logs["data"] ?? null,
            ]));
        }
        if (!in_array($status, ["ready", "running"], true)) {
            throw new RuntimeException("Unexpected run status: " . $status);
        }
        sleep($delaySeconds);
        $delaySeconds = min($delaySeconds * 2, 15);
    }
    throw new RuntimeException("Timed out waiting for run " . $runId);
}

$account = coreclaw_request("GET", "/api/v2/users/account");
print_r($account["data"]);

$run = coreclaw_request("POST", "/api/v2/workers/" . rawurlencode($workerId) . "/runs", null, [
    // Replace input.parameters.custom with fields from the Worker's input schema.
    "input" => [
        "parameters" => [
            "custom" => [
                "keywords" => ["coffee"],
                "base_location" => "New York,USA",
                "max_results" => 1,
            ],
        ],
    ],
    "is_async" => true,
    "offset" => 0,
    "limit" => 20,
]);
$runId = $run["data"]["run_slug"];
echo "Run ID: " . $runId . PHP_EOL;

$completedRun = wait_for_run($runId);

$results = coreclaw_request("GET", "/api/v2/worker-runs/" . rawurlencode($runId) . "/result", [
    "offset" => 0,
    "limit" => 20,
]);
print_r(["status" => $completedRun["status"], "results" => $results["data"]]);`],
        go: ['go', `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "os"
    "time"
)

const apiBaseURL = "${API_BASE_URL}"

type envelope struct {
    Code    int             \`json:"code"\`
    Message string          \`json:"message"\`
    Data    json.RawMessage \`json:"data"\`
}

type runData struct {
    RunSlug string \`json:"run_slug"\`
}

type runDetail struct {
    Status string \`json:"status"\`
    ErrMsg string \`json:"err_msg"\`
}

func main() {
    apiKey := os.Getenv("CORECLAW_API_KEY")
    if apiKey == "" {
        panic("Set CORECLAW_API_KEY first.")
    }
    workerID := os.Getenv("CORECLAW_WORKER_ID")
    if workerID == "" {
        workerID = "YOUR_WORKER_ID"
    }

    account := coreclawRequest(apiKey, "GET", "/api/v2/users/account", nil, nil)
    fmt.Println("Account:", string(account.Data))

    runPayload := map[string]any{
        // Replace input.parameters.custom with fields from the Worker's input schema.
        "input": map[string]any{
            "parameters": map[string]any{
                "custom": map[string]any{
                    "keywords":      []string{"coffee"},
                    "base_location": "New York,USA",
                    "max_results":   1,
                },
            },
        },
        "is_async": true,
        "offset": 0,
        "limit": 20,
    }
    run := coreclawRequest(apiKey, "POST", "/api/v2/workers/"+url.PathEscape(workerID)+"/runs", nil, runPayload)

    var runInfo runData
    if err := json.Unmarshal(run.Data, &runInfo); err != nil {
        panic(err)
    }
    fmt.Println("Run ID:", runInfo.RunSlug)

    completedRun := waitForRun(apiKey, runInfo.RunSlug, 300*time.Second)
    results := coreclawRequest(apiKey, "GET", "/api/v2/worker-runs/"+url.PathEscape(runInfo.RunSlug)+"/result", url.Values{
        "offset": {"0"},
        "limit":  {"20"},
    }, nil)
    fmt.Println("Status:", completedRun.Status, "Results:", string(results.Data))
}

func waitForRun(apiKey, runID string, timeout time.Duration) runDetail {
    deadline := time.Now().Add(timeout)
    delay := 2 * time.Second
    for time.Now().Before(deadline) {
        detail := coreclawRequest(apiKey, "GET", "/api/v2/worker-runs/"+url.PathEscape(runID), nil, nil)
        var run runDetail
        if err := json.Unmarshal(detail.Data, &run); err != nil {
            panic(err)
        }
        if run.Status == "succeeded" {
            return run
        }
        if run.Status == "failed" || run.Status == "aborting" {
            logs := coreclawRequest(apiKey, "GET", "/api/v2/worker-runs/"+url.PathEscape(runID)+"/log", nil, nil)
            panic(fmt.Sprintf("run status=%s err_msg=%s request_id=%s logs=%s", run.Status, run.ErrMsg, detail.Message, logs.Data))
        }
        if run.Status != "ready" && run.Status != "running" {
            panic("Unexpected run status: " + run.Status)
        }
        time.Sleep(delay)
        if delay < 15*time.Second {
            delay *= 2
        }
    }
    panic("Timed out waiting for run " + runID)
}

func coreclawRequest(apiKey, method, path string, query url.Values, body any) envelope {
    endpoint := apiBaseURL + path
    if len(query) > 0 {
        endpoint += "?" + query.Encode()
    }

    var reader io.Reader
    if body != nil {
        raw, err := json.Marshal(body)
        if err != nil {
            panic(err)
        }
        reader = bytes.NewReader(raw)
    }

    req, err := http.NewRequest(method, endpoint, reader)
    if err != nil {
        panic(err)
    }
    req.Header.Set("Authorization", "Bearer "+apiKey)
    if body != nil {
        req.Header.Set("Content-Type", "application/json")
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    raw, err := io.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }
    if resp.StatusCode < 200 || resp.StatusCode >= 300 {
        panic(fmt.Sprintf("HTTP %d: %s", resp.StatusCode, raw))
    }

    var payload envelope
    if err := json.Unmarshal(raw, &payload); err != nil {
        panic(err)
    }
    if payload.Code != 0 {
        panic(string(raw))
    }
    return payload
}`],
    }
    const [language, code] = snippets[name]
    return [intro, '', '```' + language, code, '```', ''].join('\n')
}

function javaExample() {
    return [
        '// Java 11+',
        'import java.net.URI;',
        'import java.net.URLEncoder;',
        'import java.net.http.HttpClient;',
        'import java.net.http.HttpRequest;',
        'import java.net.http.HttpResponse;',
        'import java.nio.charset.StandardCharsets;',
        'import java.util.Map;',
        'import java.util.Set;',
        'import java.util.regex.Matcher;',
        'import java.util.regex.Pattern;',
        '',
        'public class CoreClawExample {',
        `    static final String API_BASE_URL = "${API_BASE_URL}";`,
        '    static final String API_KEY = System.getenv("CORECLAW_API_KEY");',
        '    static final String WORKER_ID = System.getenv().getOrDefault("CORECLAW_WORKER_ID", "YOUR_WORKER_ID");',
        '    static final HttpClient HTTP = HttpClient.newHttpClient();',
        '',
        '    public static void main(String[] args) throws Exception {',
        '        if (API_KEY == null || API_KEY.isBlank()) throw new IllegalStateException("Set CORECLAW_API_KEY first.");',
        '',
        '        String account = request("GET", "/api/v2/users/account", null, null);',
        '        System.out.println(account);',
        '',
        '        String runBody = "{"',
        '            + "\\"input\\":{\\"parameters\\":{\\"custom\\":{"',
        '            + "\\"keywords\\":[\\"coffee\\"],"',
        '            + "\\"base_location\\":\\"New York,USA\\","',
        '            + "\\"max_results\\":1"',
        '            + "}}},"',
        '            + "\\"is_async\\":true,"',
        '            + "\\"offset\\":0,"',
        '            + "\\"limit\\":20"',
        '            + "}";',
        '        String run = request("POST", "/api/v2/workers/" + encode(WORKER_ID) + "/runs", null, runBody);',
        '        System.out.println(run);',
        '',
        '        String runId = extract(run, "\\\\\\"run_slug\\\\\\"\\\\s*:\\\\s*\\\\\\"([^\\\\\\"]+)\\\\\\"");',
        '        String completedRun = waitForRun(runId, 300_000);',
        '        String results = request("GET", "/api/v2/worker-runs/" + encode(runId) + "/result", Map.of("offset", "0", "limit", "20"), null);',
        '        System.out.println("status=" + extract(completedRun, "\\\"status\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"") + " results=" + results);',
        '    }',
        '',
        '    static String waitForRun(String runId, long timeoutMs) throws Exception {',
        '        long deadline = System.currentTimeMillis() + timeoutMs;',
        '        long delayMs = 2_000;',
        '        while (System.currentTimeMillis() < deadline) {',
        '            String detail = request("GET", "/api/v2/worker-runs/" + encode(runId), null, null);',
        '            String status = extract(detail, "\\\"status\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"");',
        '            if (status.equals("succeeded")) return detail;',
        '            if (Set.of("failed", "aborting").contains(status)) {',
        '                String logs = request("GET", "/api/v2/worker-runs/" + encode(runId) + "/log", null, null);',
        '                throw new IllegalStateException("run status=" + status + " logs=" + logs);',
        '            }',
        '            if (!Set.of("ready", "running").contains(status)) {',
        '                throw new IllegalStateException("Unexpected run status: " + status);',
        '            }',
        '            Thread.sleep(delayMs);',
        '            delayMs = Math.min(delayMs * 2, 15_000);',
        '        }',
        '        throw new IllegalStateException("Timed out waiting for run " + runId);',
        '    }',
        '',
        '    static String request(String method, String path, Map<String, String> query, String body) throws Exception {',
        '        URI uri = URI.create(API_BASE_URL + path + queryString(query));',
        '        HttpRequest.Builder builder = HttpRequest.newBuilder(uri)',
        '            .header("Authorization", "Bearer " + API_KEY)',
        '            .method(method, body == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(body));',
        '        if (body != null) builder.header("Content-Type", "application/json");',
        '        HttpResponse<String> response = HTTP.send(builder.build(), HttpResponse.BodyHandlers.ofString());',
        '        if (response.statusCode() < 200 || response.statusCode() >= 300) {',
        '            throw new RuntimeException("HTTP " + response.statusCode() + ": " + response.body());',
        '        }',
        '        return response.body();',
        '    }',
        '',
        '    static String queryString(Map<String, String> query) {',
        '        if (query == null || query.isEmpty()) return "";',
        '        return "?" + query.entrySet().stream()',
        '            .map(e -> encode(e.getKey()) + "=" + encode(e.getValue()))',
        '            .reduce((a, b) -> a + "&" + b)',
        '            .orElse("");',
        '    }',
        '',
        '    static String encode(String value) {',
        '        return URLEncoder.encode(value, StandardCharsets.UTF_8);',
        '    }',
        '',
        '    static String extract(String text, String regex) {',
        '        Matcher matcher = Pattern.compile(regex).matcher(text);',
        '        if (!matcher.find()) throw new IllegalStateException("run_slug not found in response: " + text);',
        '        return matcher.group(1);',
        '    }',
        '}',
    ].join('\n')
}

function frontmatter(title, description, order) {
    return ['---', `title: ${JSON.stringify(title)}`, `description: ${JSON.stringify(description)}`, 'sidebar:', `  order: ${order}`, '---', ''].join('\n') + '\n'
}

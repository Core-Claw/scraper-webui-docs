import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const specPath = path.join(root, 'public', 'openapi.json')
const docsRoot = path.join(root, 'src', 'content', 'docs')

const internalOperations = new Set([
    'GET /api/v2/workers/{workerId}/internal',
    'POST /api/v2/workers/{workerId}/versions',
    'PUT /api/v2/workers/{workerId}/versions/{version}',
])
const API_BASE_URL = 'https://openapi.coreclaw.com'
const LEGACY_HTTP_API_BASE_URL = 'http://openapi.coreclaw.com'
const OLD_API_BASE_URL = ['http://openapi', 'test', 'coreclaw.com'].join('.')
const expectedPublicHttpStatuses = ['200', '400', '401', '404', '422', '429', '500']
const operationsWithout422 = new Set([
    'GET /api/v2/users/account',
    'GET /api/v2/worker-runs/last',
    'GET /api/v2/worker-runs/last/log',
])
const expectedPublicHttpStatusesWithout422 = expectedPublicHttpStatuses.filter(status => status !== '422')
const expectedErrorCodes = [
    [10000, 'SYSTEM_ERROR', 'internal server error'],
    [11000, 'INVALID_ARGUMENT', 'invalid argument'],
    [11004, 'NOT_FOUND', 'not found'],
    [12001, 'UNAUTHORIZED', 'authentication required'],
    [12002, 'INVALID_TOKEN', 'invalid token'],
    [13000, 'RATE_LIMITED', 'too many requests'],
    [14000, 'DATABASE_ERROR', 'database error'],
    [30001, 'INSUFFICIENT_BALANCE', 'account balance is insufficient'],
    [50001, 'WORKER_NOT_FOUND', 'worker does not exist'],
    [50002, 'WORKER_RUN_FAILED', 'worker run failed'],
    [50003, 'WORKER_VERSION_UNAVAILABLE', 'the worker version is not available'],
    [60001, 'TASK_NOT_FOUND', 'task does not exist'],
    [70001, 'RUN_NOT_FOUND', 'run record does not exist'],
    [70002, 'RUN_FAILED', 'run operation failed'],
    [16000, 'NOT_IMPLEMENTED', 'not implemented'],
]

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    const files = []
    for (const entry of entries) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) files.push(...await walk(full))
        else if (/\.(md|mdx)$/.test(entry.name)) files.push(full)
    }
    return files
}

async function readRequiredDoc(rel) {
    try {
        return await readFile(path.join(root, rel), 'utf8')
    } catch (error) {
        if (error?.code === 'ENOENT') {
            errors.push(`missing required API doc: ${rel}`)
            return ''
        }
        throw error
    }
}

function operationsFromSpec(spec) {
    const methods = new Set(['get', 'post', 'put', 'patch', 'delete'])
    const operations = []
    for (const [apiPath, item] of Object.entries(spec.paths ?? {})) {
        for (const [method, operation] of Object.entries(item ?? {})) {
            if (!methods.has(method)) continue
            operations.push({
                key: `${method.toUpperCase()} ${apiPath}`,
                method: method.toUpperCase(),
                path: apiPath,
                operationId: operation.operationId ?? '',
            })
        }
    }
    return operations
}

const spec = JSON.parse(await readFile(specPath, 'utf8'))
const allOperations = operationsFromSpec(spec)
const publicOperations = allOperations.filter(op => !internalOperations.has(op.key))
const docFiles = (await walk(docsRoot)).filter(file =>
    file.includes(`${path.sep}api${path.sep}`)
)
const playgroundText = await readFile(
    path.join(root, 'src', 'components', 'ApiPlayground.astro'),
    'utf8'
)
const docTexts = await Promise.all(
    docFiles.map(async file => ({
        file,
        text: await readFile(file, 'utf8'),
    }))
)
const joinedDocs = docTexts.map(({ text }) => text).join('\n')
const astroConfigText = await readFile(path.join(root, 'astro.config.mjs'), 'utf8')

const errors = []

if (!publicOperations.every(op => op.path.startsWith('/api/v2/'))) {
    errors.push('public/openapi.json must contain only v2 public-facing API paths, excluding allowed non-public operations.')
}

if (publicOperations.length !== 28) {
    errors.push(`expected 28 public v2 operations, found ${publicOperations.length}.`)
}

for (const op of publicOperations) {
    const operation = spec.paths?.[op.path]?.[op.method.toLowerCase()]
    const actualStatuses = Object.keys(operation?.responses ?? {}).sort((a, b) => Number(a) - Number(b))
    const expectedStatuses = operationsWithout422.has(op.key)
        ? expectedPublicHttpStatusesWithout422
        : expectedPublicHttpStatuses
    const expected = expectedStatuses.join(',')
    const actual = actualStatuses.join(',')
    if (actual !== expected) {
        errors.push(`${op.key} must document HTTP statuses ${expected}, found ${actual || '(none)'}.`)
    }
}

for (const op of publicOperations) {
    const hasPlayground = docTexts.some(({ text }) =>
        text.includes(`<ApiPlayground method="${op.method}" path="${op.path}" />`)
    )
    if (!hasPlayground) {
        errors.push(`missing ApiPlayground for ${op.key}.`)
    }
}

for (const op of allOperations.filter(op => internalOperations.has(op.key))) {
    if (joinedDocs.includes(op.path) || joinedDocs.includes(op.operationId)) {
        errors.push(`non-public operation is documented: ${op.key}.`)
    }
}

if (joinedDocs.includes(OLD_API_BASE_URL) || playgroundText.includes(OLD_API_BASE_URL)) {
    errors.push(`API docs should not mention the test API base URL ${OLD_API_BASE_URL}.`)
}

if (
    joinedDocs.includes(LEGACY_HTTP_API_BASE_URL) ||
    playgroundText.includes(LEGACY_HTTP_API_BASE_URL) ||
    JSON.stringify(spec).includes(LEGACY_HTTP_API_BASE_URL)
) {
    errors.push(`API docs should use HTTPS and must not mention ${LEGACY_HTTP_API_BASE_URL}.`)
}

if (!joinedDocs.includes(API_BASE_URL)) {
    errors.push(`API docs should use the production API base URL ${API_BASE_URL}.`)
}

if (spec?.servers?.[0]?.url !== API_BASE_URL) {
    errors.push(`public/openapi.json should use the production API base URL ${API_BASE_URL}.`)
}

for (const op of publicOperations.filter(op => !operationsWithout422.has(op.key))) {
    const has422Doc = docTexts.some(({ text }) =>
        text.includes(`<ApiPlayground method="${op.method}" path="${op.path}" />`) &&
        text.includes('| `422` |')
    )
    if (!has422Doc) {
        errors.push(`${op.key} docs must document HTTP 422 to match the live OpenAPI contract.`)
    }
}

for (const op of publicOperations.filter(op => operationsWithout422.has(op.key))) {
    const hasUnexpected422Doc = docTexts.some(({ text }) =>
        text.includes(`<ApiPlayground method="${op.method}" path="${op.path}" />`) &&
        text.includes('| `422` |')
    )
    if (hasUnexpected422Doc) {
        errors.push(`${op.key} docs must not document HTTP 422 because the live OpenAPI contract does not include it.`)
    }
}

if (!spec?.components?.securitySchemes?.ApiKeyAuth) {
    errors.push('public/openapi.json must document backwards-compatible api-key authentication.')
}

for (const scheme of ['BearerAuth', 'QueryTokenAuth', 'ApiKeyAuth']) {
    if (!spec?.components?.securitySchemes?.[scheme]) {
        errors.push(`public/openapi.json must document ${scheme}.`)
    }
}

for (const op of publicOperations) {
    const operation = spec.paths?.[op.path]?.[op.method.toLowerCase()]
    const security = operation?.security ?? spec.security
    if (!Array.isArray(security) || security.length === 0) continue
    if (security.every(item => Object.keys(item).length === 0)) continue
    for (const scheme of ['BearerAuth', 'QueryTokenAuth', 'ApiKeyAuth']) {
        if (!security.some(item => Object.hasOwn(item, scheme))) {
            errors.push(`${op.key} must support ${scheme}.`)
        }
    }
}

for (const publicPath of ['/api/v2/proxy/region', '/api/v2/store']) {
    const security = spec?.paths?.[publicPath]?.get?.security
    if (Array.isArray(security) && security.length > 0) {
        errors.push(`${publicPath} must remain public and must not require auth in public/openapi.json.`)
    }
}

for (const authText of [
    'Authorization: Bearer',
    'api-key',
    '?token=',
]) {
    if (!joinedDocs.includes(authText)) {
        errors.push(`API docs must document v2 auth compatibility for ${authText}.`)
    }
}

for (const playgroundTextRequired of [
    'Bearer',
    'api-key',
    'token=',
    'data-role="auth-mode"',
]) {
    if (!playgroundText.includes(playgroundTextRequired)) {
        errors.push(`ApiPlayground must support auth mode: ${playgroundTextRequired}.`)
    }
}

for (const playgroundTextRequired of [
    'exampleFromSchema',
    'sampleSchemaValue',
    'describeBodyField',
    'describeParam',
]) {
    if (!playgroundText.includes(playgroundTextRequired)) {
        errors.push(`ApiPlayground must include schema-driven request examples and field descriptions: ${playgroundTextRequired}.`)
    }
}

if (playgroundText.includes('This endpoint takes no body parameters.')) {
    errors.push('ApiPlayground must not use "takes no body parameters" because it is easy to confuse with path/query parameters.')
}

for (const playgroundTextRequired of [
    "param.required ? 'ap-pill--required' : 'ap-pill--optional'",
    "param.required ? 'Required' : 'Optional'",
    'No JSON request body',
    'Request Body',
]) {
    if (!playgroundText.includes(playgroundTextRequired)) {
        errors.push(`ApiPlayground must clearly label required vs optional parameters and request-body state: ${playgroundTextRequired}.`)
    }
}

function hasExplicitRequestExample(operation) {
    const json = operation?.requestBody?.content?.['application/json']
    return !!(json?.example !== undefined || (json?.examples && Object.keys(json.examples).length > 0))
}

function derefSchema(schema) {
    if (!schema || typeof schema !== 'object') return schema
    if (schema.$ref) {
        const parts = schema.$ref.replace(/^#\//, '').split('/')
        let current = spec
        for (const part of parts) current = current?.[part]
        return derefSchema(current)
    }
    return schema
}

for (const op of publicOperations) {
    const operation = spec.paths?.[op.path]?.[op.method.toLowerCase()]
    const schema = derefSchema(operation?.requestBody?.content?.['application/json']?.schema)
    const hasSchemaFields =
        schema?.type === 'object' &&
        schema.properties &&
        Object.keys(schema.properties).length > 0
    if (hasSchemaFields && !hasExplicitRequestExample(operation)) {
        if (!playgroundText.includes('pickFirstExample(opResolved?.requestBody?.content) ?? exampleFromSchema(bodySchema)')) {
            errors.push(`${op.key} has a schema-only request body; ApiPlayground must generate a fallback JSON example from schema.`)
        }
    }
}

for (const { rel, required } of [
    {
        rel: 'src/content/docs/api/worker-runs/last-abort.mdx',
        required: [
            'account-level latest-run endpoint',
            'does not take a `workerId` path parameter',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/worker-runs/last-abort.mdx',
        required: [
            '账户级最近运行接口',
            '不需要 `workerId` 路径参数',
        ],
    },
    {
        rel: 'src/content/docs/api/worker-runs/worker-last-abort.mdx',
        required: [
            'Worker-scoped latest-run endpoint',
            '`workerId` is required',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/worker-runs/worker-last-abort.mdx',
        required: [
            'Worker 级最近运行接口',
            '`workerId` 是必填路径参数',
        ],
    },
]) {
    const text = await readRequiredDoc(rel)
    for (const phrase of required) {
        if (!text.includes(phrase)) {
            errors.push(`last-run docs must clarify account scope vs Worker scope: ${rel} missing "${phrase}"`)
        }
    }
}

for (const { rel, required } of [
    {
        rel: 'src/content/docs/api/index.md',
        required: [
            'Use `https://openapi.coreclaw.com` as the HTTP API base URL',
            'Read the Worker input schema before sending `input`',
            '`limit` is capped at `100` on list and result endpoints',
            'Use export endpoints when the caller needs a downloadable result file',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/index.md',
        required: [
            'HTTP API 基础地址为 `https://openapi.coreclaw.com`',
            '发送 `input` 前先读取 Worker 输入 schema',
            '列表和结果接口的 `limit` 上限为 `100`',
            '需要下载结果文件时使用导出接口',
        ],
    },
]) {
    const text = await readRequiredDoc(rel)
    for (const phrase of required) {
        if (!text.includes(phrase)) {
            errors.push(`API index docs need clearer production and usage guidance: ${rel} missing "${phrase}"`)
        }
    }
}

for (const { rel, required } of [
    {
        rel: 'src/content/docs/api/integration.md',
        required: [
            'Choose the run entry point',
            'Direct Worker run',
            'Saved Worker task run',
            'Choose the execution mode',
            '`is_async: true`',
            '`is_async: false`',
            'Poll by `runId` when the run is asynchronous',
            'Use export endpoints for downloads',
            'HTTP status',
            'application `code`',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/integration.md',
        required: [
            '选择运行入口',
            '直接运行 Worker',
            '运行已保存的 Worker 任务',
            '选择执行模式',
            '`is_async: true`',
            '`is_async: false`',
            '异步运行使用 `runId` 轮询',
            '下载文件使用导出接口',
            'HTTP 状态',
            '业务 `code`',
        ],
    },
]) {
    const text = await readRequiredDoc(rel)
    for (const phrase of required) {
        if (!text.includes(phrase)) {
            errors.push(`integration guide must explain the full API workflow: ${rel} missing "${phrase}"`)
        }
    }
}

for (const { rel, required } of [
    {
        rel: 'src/content/docs/api/workers/run.mdx',
        required: [
            'Read the Worker input schema first',
            'Use `offset` and `limit` only to control the synchronous result window',
            'Use `version` to pin a Worker version',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/workers/run.mdx',
        required: [
            '应先读取 Worker 输入 schema',
            '`offset` 和 `limit` 只控制同步返回的结果窗口',
            '`version` 用于指定 Worker 版本',
        ],
    },
    {
        rel: 'src/content/docs/api/worker-runs/result.mdx',
        required: [
            '`offset` is zero-based',
            '`limit` defaults to `20` and cannot exceed `100`',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/worker-runs/result.mdx',
        required: [
            '`offset` 从 0 开始',
            '`limit` 默认 `20`，最大 `100`',
        ],
    },
]) {
    const text = await readRequiredDoc(rel)
    for (const phrase of required) {
        if (!text.includes(phrase)) {
            errors.push(`endpoint parameter docs need fuller user-facing guidance: ${rel} missing "${phrase}"`)
        }
    }
}

for (const { file, text } of docTexts.filter(({ file }) => file.endsWith('.mdx'))) {
    if (/^import\s.+\r?\n[^\r\n]/m.test(text)) {
        errors.push(`MDX import must be followed by a blank line: ${path.relative(root, file)}`)
    }
}

const runWorkerDocs = [
    {
        rel: 'src/content/docs/api/workers/run.mdx',
        required: [
            '`is_async: true` submits the run asynchronously and returns without waiting for execution results.',
            '`is_async: false` waits for the run to finish',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/workers/run.mdx',
        required: [
            '`is_async: true` 表示异步提交运行，不等待执行结果。',
            '`is_async: false` 表示等待执行结果',
        ],
    },
    {
        rel: 'src/content/docs/api/integration.md',
        required: [
            '`is_async: true` submits asynchronously',
            '`is_async: false` waits for completion',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/integration.md',
        required: [
            '`is_async: true` 表示异步提交',
            '`is_async: false` 表示等待执行结果',
        ],
    },
]

for (const { rel, required } of runWorkerDocs) {
    const text = await readRequiredDoc(rel)
    for (const phrase of required) {
        if (!text.includes(phrase)) {
            errors.push(`run Worker docs must explain is_async true/false semantics: ${rel} missing "${phrase}"`)
        }
    }
}

const callbackDocs = [
    {
        rel: 'src/content/docs/api/callbacks.md',
        required: [
            'Callback Notifications',
            '`callback_url`',
            'POST',
            '"run_status":"succeeded"',
            'status changes or finishes',
        ],
    },
    {
        rel: 'src/content/docs/zh-cn/api/callbacks.md',
        required: [
            '回调通知',
            '`callback_url`',
            'POST',
            '"run_status":"succeeded"',
            '状态变化或结束',
        ],
    },
]

for (const { rel, required } of callbackDocs) {
    const text = await readRequiredDoc(rel)
    for (const phrase of required) {
        if (!text.includes(phrase)) {
            errors.push(`callback docs must document callback_url notifications: ${rel} missing "${phrase}"`)
        }
    }
}

const errorCodeDocs = [
    'src/content/docs/api/error-codes.md',
    'src/content/docs/zh-cn/api/error-codes.md',
]

for (const rel of errorCodeDocs) {
    const text = await readRequiredDoc(rel)
    for (const [code, key, message] of expectedErrorCodes) {
        if (!text.includes(`| \`${code}\` | \`${key}\` | ${message} |`)) {
            errors.push(`error code docs must include ${code} ${key}: ${rel}`)
        }
    }
}

for (const [code, key, message] of expectedErrorCodes) {
    const match = spec['x-error-codes']?.some(error =>
        error.code === code && error.key === key && error.message === message
    )
    if (!match) {
        errors.push(`public/openapi.json x-error-codes must include ${code} ${key}.`)
    }
}

for (const sidebarText of [
    "slug: 'api/callbacks'",
    "slug: 'api/error-codes'",
    "'zh-CN': '回调通知'",
    "'zh-CN': '错误码'",
]) {
    if (!astroConfigText.includes(sidebarText)) {
        errors.push(`API sidebar must include ${sidebarText}.`)
    }
}

const localizedTexts = [
    ...docTexts.filter(({ file }) => file.includes(`${path.sep}zh-cn${path.sep}`)),
    { file: path.join(root, 'astro.config.mjs'), text: astroConfigText },
]
const mojibakePattern = /\?{2,}|锟|鍩|璐|绾|鏄|鍙|€|閸|檤|緗|搢|攟|鐠|亅|閺|寍|鐞|泑|鐏|弢|磡|盲赂|脙/

for (const { file, text } of localizedTexts) {
    const textWithoutCode = text.replace(/```[\s\S]*?```/g, '')
    if (mojibakePattern.test(textWithoutCode)) {
        errors.push(`localized docs contain mojibake or replacement question marks: ${path.relative(root, file)}`)
    }
}

const relatedApiDocs = [
    'src/content/docs/user-guide/run-worker/api-calls.md',
    'src/content/docs/zh-cn/user-guide/run-worker/api-calls.md',
    'src/content/docs/user-guide/user-faq/how-to-export-data.md',
    'src/content/docs/zh-cn/user-guide/user-faq/how-to-export-data.md',
    'src/content/docs/integrations/workflows-and-notifications/n8n.md',
    'src/content/docs/zh-cn/integrations/workflows-and-notifications/n8n.md',
    'src/content/docs/developer-guide/builds-and-runs.md',
    'src/content/docs/zh-cn/developer-guide/builds-and-runs.md',
]
const staleRelatedPatterns = [
    /\/api\/v1\//,
    /\/api\/run\//,
    /\/api\/worker\//,
    /\/api\/task\//,
    /\/api\/account\/info/,
    new RegExp(['openapi', 'test', 'coreclaw\\.com'].join('\\.')),
]

for (const rel of relatedApiDocs) {
    const text = await readRequiredDoc(rel)
    for (const pattern of staleRelatedPatterns) {
        if (pattern.test(text)) {
            errors.push(`related API doc still contains stale v1/API link pattern ${pattern}: ${rel}`)
        }
    }
}

if (errors.length) {
    console.error('API v2 docs validation failed:')
    for (const error of errors) console.error(`- ${error}`)
    process.exit(1)
}

console.log(`API v2 docs validation passed: ${publicOperations.length} public operations documented.`)

import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()

const files = [
    'src/content/docs/api/callbacks.md',
    'src/content/docs/zh-cn/api/callbacks.md',
    'src/content/docs/api/examples/python.md',
    'src/content/docs/api/examples/nodejs.md',
    'src/content/docs/api/examples/java.md',
    'src/content/docs/api/examples/php.md',
    'src/content/docs/api/examples/go.md',
    'src/content/docs/zh-cn/api/examples/python.md',
    'src/content/docs/zh-cn/api/examples/nodejs.md',
    'src/content/docs/zh-cn/api/examples/java.md',
    'src/content/docs/zh-cn/api/examples/php.md',
    'src/content/docs/zh-cn/api/examples/go.md',
    'src/content/docs/user-guide/run-worker/api-calls.md',
    'src/content/docs/zh-cn/user-guide/run-worker/api-calls.md',
]

const failures = []

for (const rel of files) {
    const text = await readFile(path.join(root, rel), 'utf8')
    if (/version["']?\s*[:=>]\s*["']latest/.test(text) || /\\"version\\"\s*:\s*\\"latest\\"/.test(text)) {
        failures.push(`${rel} must not suggest version: "latest" in runnable request examples.`)
    }
}

for (const rel of files.filter(file => !file.endsWith('openapi.json'))) {
    const text = await readFile(path.join(root, rel), 'utf8')
    if (/input["']?\s*[:=>]\s*\{[^{}]*(keyword|limit)/s.test(text) || /\\"input\\"\s*:\s*\{\\"keyword\\"/s.test(text)) {
        failures.push(`${rel} must use input.parameters.custom instead of flat input.keyword examples.`)
    }
}

const openapi = JSON.parse(await readFile(path.join(root, 'public/openapi.json'), 'utf8'))
const runWorkerExamples =
    openapi.paths?.['/api/v2/workers/{workerId}/runs']?.post?.requestBody?.content?.['application/json']?.examples ?? {}
for (const [name, example] of Object.entries(runWorkerExamples)) {
    const value = example?.value
    if (value?.version === 'latest') {
        failures.push(`public/openapi.json run Worker example ${name} must omit version unless it is concrete.`)
    }
    if (value?.input && !value.input?.parameters?.custom) {
        failures.push(`public/openapi.json run Worker example ${name} must use input.parameters.custom.`)
    }
}

// Developer-guide proxy / quick-start runnable examples must be safe:
// no TLS-verification bypass and no logging of proxy credentials.
const developerExampleFiles = [
    'src/content/docs/developer-guide/builds-and-runs.md',
    'src/content/docs/zh-cn/developer-guide/builds-and-runs.md',
    'src/content/docs/developer-guide/developer-faq/test-errors.md',
    'src/content/docs/zh-cn/developer-guide/developer-faq/test-errors.md',
    'src/content/docs/developer-guide/worker-definition/platform-features/proxy-support.md',
    'src/content/docs/zh-cn/developer-guide/worker-definition/platform-features/proxy-support.md',
    'src/content/docs/developer-guide/worker-standards.md',
    'src/content/docs/zh-cn/developer-guide/worker-standards.md',
]

const forbiddenExamplePatterns = [
    [/InsecureSkipVerify\s*:\s*true/, 'must not disable TLS verification (InsecureSkipVerify: true)'],
    [/rejectUnauthorized\s*:\s*false/, 'must not disable TLS verification (rejectUnauthorized: false)'],
    [/verify\s*=\s*False/, 'must not disable TLS verification (verify=False)'],
    [/(?:print|console\.log|fmt\.Print\w*|log\.\w+|echo)\([^)]*PROXY_AUTH/, 'must not print/log PROXY_AUTH credentials'],
    [/Web Unlocker/i, 'must not reference the undocumented "Web Unlocker" feature'],
]

// Inspect only fenced code blocks — prose that *names* a forbidden pattern
// (e.g. "do not use verify=False") must not trip the runnable-example guard.
function codeBlocksOnly(text) {
    const blocks = []
    for (const match of text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
        blocks.push(match[1])
    }
    return blocks.join('\n')
}

for (const rel of developerExampleFiles) {
    let text
    try {
        text = await readFile(path.join(root, rel), 'utf8')
    } catch (error) {
        if (error?.code === 'ENOENT') continue
        throw error
    }
    const codeText = codeBlocksOnly(text)
    for (const [pattern, reason] of forbiddenExamplePatterns) {
        if (pattern.test(codeText)) {
            failures.push(`${rel} ${reason}.`)
        }
    }
}

if (failures.length) {
    console.error('Runnable API example regression check failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
}

console.log('Runnable API example regression check passed.')

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

if (failures.length) {
    console.error('Runnable API example regression check failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
}

console.log('Runnable API example regression check passed.')

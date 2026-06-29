import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'

const root = process.cwd()
const tmp = path.join(os.tmpdir(), 'scraper-webui-docs-api-examples')

const tools = {
    javac: process.env.JAVAC_PATH || 'C:\\Program Files\\Microsoft\\jdk-21.0.11.10-hotspot\\bin\\javac.exe',
    go: process.env.GO_PATH || 'C:\\Program Files\\Go\\bin\\go.exe',
    php: process.env.PHP_PATH || path.join(
        process.env.LOCALAPPDATA ?? '',
        'Microsoft\\WinGet\\Packages\\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\\php.exe'
    ),
    python: process.env.PYTHON_PATH || 'python',
    node: process.env.NODE_PATH || 'node',
}

await mkdir(tmp, { recursive: true })

const examples = {
    python: {
        file: 'src/content/docs/api/examples/python.md',
        fence: 'python',
        out: 'coreclaw_example.py',
        verify: [
            [tools.python, ['-m', 'py_compile', 'coreclaw_example.py']],
        ],
    },
    nodejs: {
        file: 'src/content/docs/api/examples/nodejs.md',
        fence: 'js',
        out: 'coreclaw-example.mjs',
        verify: [
            [tools.node, ['--check', 'coreclaw-example.mjs']],
        ],
    },
    java: {
        file: 'src/content/docs/api/examples/java.md',
        fence: 'java',
        out: 'CoreClawExample.java',
        verify: [
            [tools.javac, ['CoreClawExample.java']],
        ],
    },
    php: {
        file: 'src/content/docs/api/examples/php.md',
        fence: 'php',
        out: 'coreclaw-example.php',
        verify: [
            [tools.php, ['-l', 'coreclaw-example.php']],
        ],
    },
    go: {
        file: 'src/content/docs/api/examples/go.md',
        fence: 'go',
        out: 'coreclaw_example.go',
        verify: [
            [tools.go, ['fmt', 'coreclaw_example.go']],
            [tools.go, ['test', 'coreclaw_example.go']],
        ],
    },
}

const errors = []

for (const [name, example] of Object.entries(examples)) {
    const text = await readFile(path.join(root, example.file), 'utf8')
    const code = extractFence(text, example.fence)
    await writeFile(path.join(tmp, example.out), code)
    for (const [command, args] of example.verify) {
        const result = spawnSync(command, args, {
            cwd: tmp,
            encoding: 'utf8',
            shell: false,
        })
        if (result.status !== 0) {
            errors.push([
                `${name}: ${command} ${args.join(' ')}`,
                result.stdout.trim(),
                result.stderr.trim(),
            ].filter(Boolean).join('\n'))
        }
    }
}

if (errors.length) {
    console.error('API example verification failed:')
    for (const error of errors) console.error(`\n${error}`)
    process.exit(1)
}

console.log('API example verification passed: Python, Node.js, Java, PHP, and Go snippets are syntactically valid.')

function extractFence(text, language) {
    const pattern = new RegExp(`\\\`\\\`\\\`${language}\\n([\\s\\S]*?)\\n\\\`\\\`\\\``)
    const match = text.match(pattern)
    if (!match) throw new Error(`Missing ${language} code fence`)
    return match[1]
}
